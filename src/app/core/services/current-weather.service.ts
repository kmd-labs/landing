import { Injectable, signal } from '@angular/core';
import * as topojson from 'topojson-client';
import * as d3Geo from 'd3-geo';

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

      // 2. Load World & Detailed North America Land Geometry
      try {
        const [landRes, naLandRes, naStatesRes] = await Promise.all([
          fetch('assets/data/land-50m.json').catch(() => null),
          fetch('assets/data/na-land-10m.json').catch(() => null),
          fetch('assets/data/na-states-10m.json').catch(() => null)
        ]);

        if (naLandRes && naLandRes.ok) {
          const naGeo = await naLandRes.json();
          this.detailedLand.set(naGeo);
          this.buildLandMask(naGeo);
        }

        if (naStatesRes && naStatesRes.ok) {
          const states = await naStatesRes.json();
          this.stateBorders.set(states);
        }

        if (landRes && landRes.ok) {
          const topo = await landRes.json();
          if (topo && topo.objects && topo.objects.land) {
            const geo = topojson.feature(topo, topo.objects.land);
            this.landFeature.set(geo);
            if (!this.detailedLand()) {
              this.buildLandMask(geo);
            }
          }
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
   * 1° resolution binary land mask (360x180) to restrict water vertices to oceans.
   */
  private buildLandMask(land: any) {
    if (typeof document === 'undefined') return;
    try {
      const mc = document.createElement('canvas');
      mc.width = 360;
      mc.height = 180;
      const mctx = mc.getContext('2d', { willReadFrequently: true });
      if (!mctx) return;

      const proj = d3Geo.geoEquirectangular().scale(360 / (2 * Math.PI)).translate([180, 90]);
      mctx.beginPath();
      d3Geo.geoPath(proj, mctx)(land);
      mctx.fillStyle = '#000000';
      mctx.fill();

      const px = mctx.getImageData(0, 0, 360, 180).data;
      const mask = new Uint8Array(360 * 180);
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
    const c = Math.floor(((((lon + 180) % 360) + 360) % 360));
    const r = Math.max(0, Math.min(179, Math.floor(90 - lat)));
    return this.landMask[r * 360 + c] === 1;
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

    // Western Boundary Current Jet (Gulf Stream past Cape Hatteras & New York Bight)
    if (lat >= 24 && lat <= 48) {
      let targetLon: number;
      let dirRad: number;
      if (lat <= 35.5) {
        targetLon = -80.0 + (lat - 25.0) * (4.5 / 10.5); // Florida to Cape Hatteras
        dirRad = 22 * DEG;
      } else {
        targetLon = -75.5 + (lat - 35.5) * (15.5 / 8.5); // Cape Hatteras past NY Bight towards Grand Banks
        dirRad = 55 * DEG;
      }
      const dL = (lon - targetLon) * Math.cos(lat * DEG);
      const jetWeight = Math.exp(-((dL / 2.2) ** 2));
      const jetSpeed = jetWeight * 2.8;
      res.u += jetSpeed * Math.sin(dirRad);
      res.v += jetSpeed * Math.cos(dirRad);
      res.waveHeight = Math.max(res.waveHeight, 1.8 + jetWeight * 1.6);
    }

    // Coherent Mesoscale Cyclone Vortex offshore New York / Slope Sea (39.0°N, 71.0°W)
    const dLonV = (lon - (-71.0)) * Math.cos(39.0 * DEG);
    const dLatV = lat - 39.0;
    const rV = Math.hypot(dLonV, dLatV);
    if (rV > 0.04) {
      const R_core = 1.25;
      const rRatio = rV / R_core;
      // Algebraic-logarithmic mantle profile: active eyewall with smooth power-law outer rim swirl
      const vTheta = 2.8 * ((2.0 * rRatio) / (1.0 + Math.pow(rRatio, 1.6)));
      // Gentle outward logarithmic shedding (detrainment prevents eternal particle trapping in the eye)
      const vRad = 0.16 * Math.min(1.0, rRatio) * Math.exp(-rV / 4.5);

      const tangU = -vTheta * (dLatV / rV);
      const tangV = vTheta * (dLonV / rV);
      const radU = vRad * (dLonV / rV);
      const radV = vRad * (dLatV / rV);

      res.u += tangU + radU;
      res.v += tangV + radV;
      res.waveHeight = Math.max(res.waveHeight, 1.8 + vTheta * 0.9);
    }

    // Southern Ocean Antarctic Circumpolar Current & Roaring Forties water boost
    if (lat < -40 && lat > -65) {
      res.u = Math.max(res.u, 2.8 + Math.abs(lat + 52) * 0.1);
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
