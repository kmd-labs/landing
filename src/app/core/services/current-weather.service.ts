import { Injectable, signal } from '@angular/core';
import * as topojson from 'topojson-client';
import * as d3Geo from 'd3-geo';
import { MAP_CONFIG } from '../config/map-viewport.config';

export interface WindGridMeta {
  lat0: number;
  lon0: number;
  step: number;
  nLat: number;
  nLon: number;
}

export interface WindDataset {
  source: string;
  sourceUrl: string;
  time: string;
  fetchedAt: string;
  grid: WindGridMeta;
  stats?: {
    totalNodes?: number;
    validNodes?: number;
    maxSpeedMps?: number;
  };
  u: number[];
  v: number[];
  speed: number[];
  temp: number[];
  uWater?: (number | null)[];
  vWater?: (number | null)[];
  waveHeight?: (number | null)[];
  wavePeriod?: (number | null)[];
  maxWaveHeight?: number;
}

export interface WindSample {
  u: number;
  v: number;
  speed: number;
  temp: number;
}

export interface WaterSample {
  u: number;
  v: number;
  speed: number;
  waveHeight: number;
  wavePeriod: number;
}

export interface RoadNetwork {
  highways: [number, number][][];
  secondary: [number, number][][];
}

const DEG = Math.PI / 180;

@Injectable({
  providedIn: 'root'
})
export class CurrentWeatherService {
  readonly status = signal<'loading' | 'ready' | 'error'>('loading');
  readonly meta = signal<WindDataset | null>(null);
  readonly landFeature = signal<any>(null);
  readonly detailedLand = signal<any>(null);
  readonly stateBorders = signal<[number, number][][]>([]);
  readonly stateBorders50m = signal<[number, number][][]>([]);
  readonly roads = signal<RoadNetwork | null>(null);
  readonly cityLimits = signal<[number, number][][]>([]);
  readonly cityLimits50m = signal<[number, number][][]>([]);

  private u = new Float32Array(0);
  private v = new Float32Array(0);
  private speed = new Float32Array(0);
  private temp = new Float32Array(0);

  // Marine ocean water vectors & wave properties
  private uWater = new Float32Array(0);
  private vWater = new Float32Array(0);
  private waveHeight = new Float32Array(0);
  private wavePeriod = new Float32Array(0);
  private landMask: Uint8Array | null = null;

  private lat0 = -60;
  private lon0 = -180;
  private step = 10;
  private nLat = 13;
  private nLon = 36;

  constructor() {
    this.init();
  }

  private async init() {
    try {
      // 1. Load Real Current Wind & Marine Dataset
      const windRes = await fetch('assets/data/current-wind.json');
      if (!windRes.ok) throw new Error(`Failed to load wind data: HTTP ${windRes.status}`);
      const dataset: WindDataset = await windRes.json();

      this.lat0 = dataset.grid.lat0;
      this.lon0 = dataset.grid.lon0;
      this.step = dataset.grid.step;
      this.nLat = dataset.grid.nLat;
      this.nLon = dataset.grid.nLon;

      const n = this.nLat * this.nLon;
      this.u = new Float32Array(dataset.u);
      this.v = new Float32Array(dataset.v);
      this.speed = new Float32Array(dataset.speed);
      this.temp = new Float32Array(dataset.temp);

      this.uWater = new Float32Array(n);
      this.vWater = new Float32Array(n);
      this.waveHeight = new Float32Array(n);
      this.wavePeriod = new Float32Array(n);

      for (let i = 0; i < n; i++) {
        const uw = dataset.uWater?.[i];
        const vw = dataset.vWater?.[i];
        const wh = dataset.waveHeight?.[i];
        const wp = dataset.wavePeriod?.[i];

        if (uw != null && vw != null && !Number.isNaN(uw)) {
          this.uWater[i] = uw;
          this.vWater[i] = vw;
          this.waveHeight[i] = wh ?? 1.5;
          this.wavePeriod[i] = wp ?? 8.0;
        } else {
          // Derive baseline surface water drift from surface wind stress
          this.uWater[i] = this.u[i] * 0.45;
          this.vWater[i] = this.v[i] * 0.45;
          this.waveHeight[i] = Math.max(0.6, Math.min(6.5, this.speed[i] * 0.28));
          this.wavePeriod[i] = 7.5;
        }
      }

      this.meta.set(dataset);

      // 2. Load World & Detailed Land & Cartographic Geometry
      try {
        const [landRes, ukLandRes, ukStatesRes, ukStates50mRes, ukRoadsRes, ukCitiesRes, ukCities50mRes] = await Promise.all([
          fetch('assets/data/land-50m.json').catch(() => null),
          fetch('assets/data/uk-land-10m.json').catch(() => null),
          fetch('assets/data/uk-states-10m.json').catch(() => null),
          fetch('assets/data/uk-states-50m.json').catch(() => null),
          fetch('assets/data/uk-roads-10m.json').catch(() => null),
          fetch('assets/data/uk-cities-10m.json').catch(() => null),
          fetch('assets/data/uk-cities-50m.json').catch(() => null)
        ]);

        // Always load global land first to ensure worldwide landmass and global land mask coverage
        if (landRes && landRes.ok) {
          const topo = await landRes.json();
          if (topo && topo.objects && topo.objects.land) {
            const geo = topojson.feature(topo, topo.objects.land);
            this.landFeature.set(geo);
            this.buildLandMask(geo);
          }
        }

        if (ukLandRes && ukLandRes.ok) {
          const ukGeo = await ukLandRes.json();
          this.detailedLand.set(ukGeo);
        }

        if (ukStatesRes && ukStatesRes.ok) {
          const states = await ukStatesRes.json();
          this.stateBorders.set(states);
        }

        if (ukStates50mRes && ukStates50mRes.ok) {
          const states50m = await ukStates50mRes.json();
          this.stateBorders50m.set(states50m);
        }

        if (ukRoadsRes && ukRoadsRes.ok) {
          const roads = await ukRoadsRes.json();
          this.roads.set(roads);
        }

        if (ukCitiesRes && ukCitiesRes.ok) {
          const cities = await ukCitiesRes.json();
          this.cityLimits.set(cities);
        }

        if (ukCities50mRes && ukCities50mRes.ok) {
          const cities50m = await ukCities50mRes.json();
          this.cityLimits50m.set(cities50m);
        }
      } catch (landErr) {
        console.warn('Could not load land datasets:', landErr);
      }

      this.status.set('ready');
    } catch (err) {
      console.error('CurrentWeatherService init error:', err);
      this.status.set('error');
    }
  }

  /**
   * 0.5° resolution binary land mask (720x360) to restrict water vertices to oceans.
   */
  private buildLandMask(land: any) {
    if (typeof document === 'undefined') return;
    try {
      const mc = document.createElement('canvas');
      mc.width = 720;
      mc.height = 360;
      const mctx = mc.getContext('2d', { willReadFrequently: true });
      if (!mctx) return;

      const proj = d3Geo.geoEquirectangular().scale(720 / (2 * Math.PI)).translate([360, 180]);
      mctx.beginPath();
      d3Geo.geoPath(proj, mctx)(land);
      mctx.fillStyle = '#000000';
      mctx.fill();

      const px = mctx.getImageData(0, 0, 720, 360).data;
      const mask = new Uint8Array(720 * 360);
      for (let i = 0; i < mask.length; i++) {
        mask[i] = px[i * 4 + 3] > 64 ? 1 : 0;
      }
      this.landMask = mask;
    } catch (e) {
      console.warn('Could not generate land mask canvas:', e);
    }
  }

  isLand(lon: number, lat: number): boolean {
    if (!this.landMask) return false;
    const c = Math.floor(((((lon + 180) % 360) + 360) % 360) * 2);
    const r = Math.max(0, Math.min(359, Math.floor((90 - lat) * 2)));
    return this.landMask[r * 720 + c] === 1;
  }

  /**
   * Bilinear interpolation of ocean wave & surface water velocity vectors (u, v).
   */
  waterSample(lon: number, lat: number, out?: WaterSample): WaterSample {
    const res = out || { u: 0, v: 0, speed: 0, waveHeight: 1.5, wavePeriod: 8.0 };
    if (this.uWater.length === 0) return res;

    let wrappedLon = ((((lon + 180) % 360) + 360) % 360) - 180;

    const cExact = (wrappedLon - this.lon0) / this.step;
    let c0 = Math.floor(cExact);
    let c1 = c0 + 1;
    const tx = cExact - c0;

    c0 = ((c0 % this.nLon) + this.nLon) % this.nLon;
    c1 = ((c1 % this.nLon) + this.nLon) % this.nLon;

    const rExact = (lat - this.lat0) / this.step;
    const r0 = Math.max(0, Math.min(this.nLat - 1, Math.floor(rExact)));
    const r1 = Math.max(0, Math.min(this.nLat - 1, r0 + 1));
    const ty = Math.max(0, Math.min(1, rExact - r0));

    const i00 = r0 * this.nLon + c0;
    const i10 = r0 * this.nLon + c1;
    const i01 = r1 * this.nLon + c0;
    const i11 = r1 * this.nLon + c1;

    const w00 = (1 - tx) * (1 - ty);
    const w10 = tx * (1 - ty);
    const w01 = (1 - tx) * ty;
    const w11 = tx * ty;

    res.u = this.uWater[i00] * w00 + this.uWater[i10] * w10 + this.uWater[i01] * w01 + this.uWater[i11] * w11;
    res.v = this.vWater[i00] * w00 + this.vWater[i10] * w10 + this.vWater[i01] * w01 + this.vWater[i11] * w11;
    res.waveHeight = this.waveHeight[i00] * w00 + this.waveHeight[i10] * w10 + this.waveHeight[i01] * w01 + this.waveHeight[i11] * w11;
    res.wavePeriod = this.wavePeriod[i00] * w00 + this.wavePeriod[i10] * w10 + this.wavePeriod[i01] * w01 + this.wavePeriod[i11] * w11;

    // 1. Primary Active Vortex / Eddy (Configured in MAP_CONFIG)
    const v = MAP_CONFIG.vortex;
    if (v) {
      const vLon = v.lon;
      const vLat = v.lat;
      const vRadius = v.radiusDeg ?? 1.35;
      const vSpeed = v.swirlSpeed ?? 2.7;

      const dLonV = (lon - vLon) * Math.cos(vLat * DEG);
      const dLatV = lat - vLat;
      const rV = Math.hypot(dLonV, dLatV);
      if (rV > 0.04) {
        const rRatio = rV / vRadius;
        const vTheta = vSpeed * ((2.0 * rRatio) / (1.0 + Math.pow(rRatio, 1.6)));
        const vRad = 0.15 * Math.min(1.0, rRatio) * Math.exp(-rV / 4.8);

        const tangU = -vTheta * (dLatV / rV);
        const tangV = vTheta * (dLonV / rV);
        const radU = vRad * (dLonV / rV);
        const radV = vRad * (dLatV / rV);

        res.u += tangU + radU;
        res.v += tangV + radV;
        res.waveHeight = Math.max(res.waveHeight, 1.8 + vTheta * 0.9);
      }
    }

    // 2. Global Ocean Current & Gyre Systems for Global Exploration:
    // A. Antarctic Circumpolar Current (ACC) - West Wind Drift (40°S to 65°S)
    if (lat < -40 && lat > -65) {
      res.u = Math.max(res.u, 2.6 + Math.abs(lat + 52) * 0.08);
      res.waveHeight = Math.max(res.waveHeight, 2.8 + Math.abs(lat + 52) * 0.12);
    }

    // B. North Atlantic Drift & European / Norwegian Shelf Current (44°N to 72°N, -25°W to 25°E)
    if (lat >= 44 && lat <= 72 && lon >= -25 && lon <= 25) {
      const targetLon = -14.0 + (lat - 48.0) * (14.0 / 14.0);
      const dirRad = 48 * DEG;
      const dL = (lon - targetLon) * Math.cos(lat * DEG);
      const jetWeight = Math.exp(-((dL / 3.8) ** 2));
      const jetSpeed = jetWeight * 2.2;
      res.u += jetSpeed * Math.sin(dirRad);
      res.v += jetSpeed * Math.cos(dirRad);
      res.waveHeight = Math.max(res.waveHeight, 1.8 + jetWeight * 1.4);
    }

    // C. Western Mediterranean & Algerian Coastal Current (35°N to 43°N, -7°W to 14°E)
    if (lat >= 35 && lat <= 43 && lon >= -7 && lon <= 14) {
      res.u += 1.6; // Eastward Algerian current & Gibraltar Mediterranean inflow
      res.waveHeight = Math.max(res.waveHeight, 1.4);
    }

    // C. Gulf Stream Jet (24°N to 48°N, -85°W to -45°W)
    if (lat >= 24 && lat <= 48 && lon >= -85 && lon <= -45) {
      const targetLon = lat <= 35.5 ? -80.0 + (lat - 25.0) * (4.5 / 10.5) : -75.5 + (lat - 35.5) * (15.5 / 8.5);
      const dirRad = (lat <= 35.5 ? 22 : 55) * DEG;
      const dL = (lon - targetLon) * Math.cos(lat * DEG);
      const jetWeight = Math.exp(-((dL / 2.4) ** 2));
      res.u += jetWeight * 2.6 * Math.sin(dirRad);
      res.v += jetWeight * 2.6 * Math.cos(dirRad);
      res.waveHeight = Math.max(res.waveHeight, 1.8 + jetWeight * 1.5);
    }

    // D. Kuroshio Current (24°N to 44°N, 122°E to 165°E)
    if (lat >= 24 && lat <= 44 && lon >= 122 && lon <= 165) {
      const targetLon = 128.0 + (lat - 24.0) * (20.0 / 20.0);
      const dirRad = 45 * DEG;
      const dL = (lon - targetLon) * Math.cos(lat * DEG);
      const jetWeight = Math.exp(-((dL / 2.8) ** 2));
      res.u += jetWeight * 2.5 * Math.sin(dirRad);
      res.v += jetWeight * 2.5 * Math.cos(dirRad);
      res.waveHeight = Math.max(res.waveHeight, 1.8 + jetWeight * 1.5);
    }

    // E. Agulhas Current & Retroflection (26°S to 42°S, 15°E to 40°E)
    if (lat >= -42 && lat <= -26 && lon >= 15 && lon <= 40) {
      const dL = (lon - 28.0) * Math.cos(lat * DEG);
      const jetWeight = Math.exp(-((dL / 3.5) ** 2));
      res.u -= jetWeight * 2.4 * Math.sin(30 * DEG);
      res.v -= jetWeight * 2.4 * Math.cos(30 * DEG);
      res.waveHeight = Math.max(res.waveHeight, 2.2 + jetWeight * 1.6);
    }

    res.speed = Math.hypot(res.u, res.v);

    return res;
  }

  sample(lon: number, lat: number, out?: WindSample): WindSample {
    const res = out || { u: 0, v: 0, speed: 0, temp: 15 };
    if (this.u.length === 0) return res;

    let wrappedLon = ((((lon + 180) % 360) + 360) % 360) - 180;
    const cExact = (wrappedLon - this.lon0) / this.step;
    let c0 = Math.floor(cExact);
    let c1 = c0 + 1;
    const tx = cExact - c0;
    c0 = ((c0 % this.nLon) + this.nLon) % this.nLon;
    c1 = ((c1 % this.nLon) + this.nLon) % this.nLon;

    const rExact = (lat - this.lat0) / this.step;
    const r0 = Math.max(0, Math.min(this.nLat - 1, Math.floor(rExact)));
    const r1 = Math.max(0, Math.min(this.nLat - 1, r0 + 1));
    const ty = Math.max(0, Math.min(1, rExact - r0));

    const i00 = r0 * this.nLon + c0;
    const i10 = r0 * this.nLon + c1;
    const i01 = r1 * this.nLon + c0;
    const i11 = r1 * this.nLon + c1;

    const w00 = (1 - tx) * (1 - ty);
    const w10 = tx * (1 - ty);
    const w01 = (1 - tx) * ty;
    const w11 = tx * ty;

    res.u = this.u[i00] * w00 + this.u[i10] * w10 + this.u[i01] * w01 + this.u[i11] * w11;
    res.v = this.v[i00] * w00 + this.v[i10] * w10 + this.v[i01] * w01 + this.v[i11] * w11;

    if (Math.abs(lat) > 60) {
      const poleFactor = Math.min(1, (Math.abs(lat) - 60) / 20);
      const polarEasterly = lat > 0 ? -4.5 : 8.0;
      res.u = res.u * (1 - poleFactor) + polarEasterly * poleFactor;
      res.v = res.v * (1 - poleFactor);
    }

    res.speed = Math.hypot(res.u, res.v);
    res.temp = this.temp[i00] * w00 + this.temp[i10] * w10 + this.temp[i01] * w01 + this.temp[i11] * w11;

    return res;
  }
}
