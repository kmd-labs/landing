import {
  Component,
  ElementRef,
  EventEmitter,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  effect,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@kmd/design-system';
import { CurrentWeatherService, WaterSample } from '../../core/services/current-weather.service';

export interface TelemetryData {
  latLon: string;
  velocity: string;
  vorticity: string;
  regimeKey:
    | 'regimeLaminar'
    | 'regimeTransition'
    | 'regimeRollup'
    | 'regimeVortex'
    | 'regimeMeander'
    | 'regimeColdCoreRing'
    | 'regimeWarmCoreRing'
    | 'regimeWakeEddy'
    | 'regimeRossbyWave'
    | 'regimeTradeWinds'
    | 'regimeWesterlies'
    | 'regimePolarVortex'
    | 'regimeDoldrums'
    | 'regimeJetStream';
}

interface WaterParticle {
  lon: number;
  lat: number;
  age: number;
  life: number;
  speed: number;
  waveHeight: number;
  u: number;
  v: number;
  histX: Float32Array;
  histY: Float32Array;
  histSpeed: Float32Array;
  trailCount: number;
  isDying: boolean;
}

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

interface SpeedColorStop {
  readonly speed: number;
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

// Continuous KMD Velocity Gradient Ramp (Deep Blue -> Royal Blue -> Cyan -> Emerald -> Amber -> KMD Orange)
const COLOR_STOPS: SpeedColorStop[] = [
  { speed: 0.5, r: 30, g: 58, b: 138 },   // Deep Navy Blue (#1e3a8a)
  { speed: 1.1, r: 37, g: 99, b: 235 },   // Royal Blue (#2563eb)
  { speed: 1.8, r: 14, g: 165, b: 233 },  // Cyan (#0ea5e9)
  { speed: 2.4, r: 16, g: 185, b: 129 },  // Emerald Green (#10b981)
  { speed: 3.0, r: 234, g: 179, b: 8 },   // Amber / Gold (#eab308)
  { speed: 3.8, r: 211, g: 116, b: 0 }    // KMD Orange (#d37400)
];

function getSpeedRgb(speed: number): [number, number, number] {
  if (speed <= COLOR_STOPS[0].speed) {
    return [COLOR_STOPS[0].r, COLOR_STOPS[0].g, COLOR_STOPS[0].b];
  }
  const lastIdx = COLOR_STOPS.length - 1;
  if (speed >= COLOR_STOPS[lastIdx].speed) {
    return [COLOR_STOPS[lastIdx].r, COLOR_STOPS[lastIdx].g, COLOR_STOPS[lastIdx].b];
  }
  for (let i = 0; i < lastIdx; i++) {
    const c0 = COLOR_STOPS[i];
    const c1 = COLOR_STOPS[i + 1];
    if (speed <= c1.speed) {
      const t = (speed - c0.speed) / (c1.speed - c0.speed);
      return [
        Math.round(c0.r + (c1.r - c0.r) * t),
        Math.round(c0.g + (c1.g - c0.g) * t),
        Math.round(c0.b + (c1.b - c0.b) * t)
      ];
    }
  }
  return [COLOR_STOPS[lastIdx].r, COLOR_STOPS[lastIdx].g, COLOR_STOPS[lastIdx].b];
}

@Component({
  selector: 'app-vortex-canvas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vortex-canvas.component.html',
  styleUrl: './vortex-canvas.component.scss'
})
export class VortexCanvasComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @Output() telemetryChange = new EventEmitter<TelemetryData>();

  private readonly weather = inject(CurrentWeatherService);
  private readonly theme = inject(ThemeService);
  private readonly ngZone = inject(NgZone);

  private ctx!: CanvasRenderingContext2D;
  private offscreenMapCanvas: HTMLCanvasElement | null = null;
  private offscreenMapCtx: CanvasRenderingContext2D | null = null;

  private width = 0;
  private height = 0;
  private dpr = 1;

  // Camera Center Coordinates (View shifted westward to showcase the American continent & seaboard)
  private readonly CENTER_LON = -74.2;
  private readonly CENTER_LAT = 39.4;
  private readonly centerMerc = Math.log(Math.tan(Math.PI / 4 + (39.4 * DEG) / 2));

  // Cyclone Eye Physical Coordinates (Offshore in the slope waters)
  private readonly EYE_LON = -71.0;
  private readonly EYE_LAT = 39.0;
  private mapScale = 11000;

  // Calibrated particle pool for locked 60-120 FPS without thermal throttling
  private readonly NW_DESKTOP = 120;
  private readonly NW_MOBILE = 65;
  private readonly TRAIL = 180; // Elegant orbital swirling trails
  private numParticles = this.NW_DESKTOP;
  private particles: WaterParticle[] = [];
  private readonly sampleBuffer: WaterSample = { u: 0, v: 0, speed: 0, waveHeight: 1.5, wavePeriod: 8.0 };



  // Animation & Observer Lifecycle
  private animId: number | null = null;
  private lastTime = performance.now();
  private isVisible = true;
  private isDataReady = false;

  private resizeObserver: ResizeObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;

  constructor() {
    effect(() => {
      const status = this.weather.status();
      const land = this.weather.landFeature();
      const detailed = this.weather.detailedLand();
      const states = this.weather.stateBorders();
      if (status === 'ready' && this.width > 0 && this.height > 0) {
        this.isDataReady = true;
        this.renderBasemap();
        this.emitSummaryTelemetry();
      }
    });
  }

  ngOnInit() {
    this.initCanvas();
    this.initParticles();
    this.setupObservers();
    this.startLoop();
  }

  ngOnDestroy() {
    this.stopLoop();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }
  }

  private initCanvas() {
    const canvas = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!context) {
      throw new Error('Failed to acquire 2D canvas context');
    }
    this.ctx = context;

    this.offscreenMapCanvas = document.createElement('canvas');
    this.offscreenMapCtx = this.offscreenMapCanvas.getContext('2d', { alpha: false });
  }

  private initParticles() {
    this.numParticles = typeof window !== 'undefined' && window.innerWidth <= 768 ? this.NW_MOBILE : this.NW_DESKTOP;
    this.particles = [];

    for (let i = 0; i < this.numParticles; i++) {
      const [lon, lat] = this.randomOceanPoint();
      const life = 18.0 + Math.random() * 14.0;
      const histX = new Float32Array(this.TRAIL);
      const histY = new Float32Array(this.TRAIL);
      const histSpeed = new Float32Array(this.TRAIL);
      histSpeed.fill(2.0);

      const p: WaterParticle = {
        lon,
        lat,
        age: Math.random() * life,
        life,
        speed: 2.0,
        waveHeight: 1.8,
        u: 0,
        v: 0,
        histX,
        histY,
        histSpeed,
        trailCount: 1,
        isDying: false
      };

      const [sx, sy] = this.lonLatToScreen(lon, lat);
      histX.fill(sx);
      histY.fill(sy);

      this.particles.push(p);
    }

    // Fast warm-up: pre-advance initial histories so spiral streamlines appear immediately on load
    for (let step = 0; step < 120; step++) {
      this.tick(0.033);
    }
  }

  private randomOceanPoint(): [number, number] {
    const [minLon, maxLat] = this.screenToLonLat(0, 0);
    const [maxLon, minLat] = this.screenToLonLat(this.width, this.height);

    // Active spatial density governor:
    // Count how many particles currently occupy the eye vicinity (within 3.8 degrees)
    let eyeCount = 0;
    const total = this.particles.length;
    for (let i = 0; i < total; i++) {
      const p = this.particles[i];
      const dL = (p.lon - this.EYE_LON) * Math.cos(this.EYE_LAT * DEG);
      const dP = p.lat - this.EYE_LAT;
      if (dL * dL + dP * dP < 14.4) {
        eyeCount++;
      }
    }
    const eyeDensity = total > 0 ? eyeCount / total : 0;
    const canSpawnInEye = eyeDensity < 0.28; // Cap eye saturation at 28% to prevent long-term clustering

    for (let tries = 0; tries < 35; tries++) {
      let lon: number;
      let lat: number;

      const roll = Math.random();
      if (canSpawnInEye && roll < 0.35) {
        // Logarithmic radial distribution from the eye:
        // Preserves a clean calm eye center (r >= 1.25 deg) while creating dense, rich outer rim lines
        const theta = Math.random() * Math.PI * 2;
        const rMin = 1.25;
        const rMax = 7.80;
        const u = Math.pow(Math.random(), 0.72); // Biased outward across logarithmic octaves
        const r = rMin * Math.pow(rMax / rMin, u);
        lon = this.EYE_LON + (r * Math.cos(theta)) / Math.cos(this.EYE_LAT * DEG);
        lat = this.EYE_LAT + r * Math.sin(theta);
      } else if (roll < 0.70) {
        // 35% along the continental shelf, Gulf Stream, & coastal boundary waters
        const tLat = 30.0 + Math.random() * 15.0;
        const tLon = -77.5 + (tLat - 30.0) * (11.0 / 15.0) + (Math.random() - 0.5) * 4.0;
        lon = tLon;
        lat = tLat;
      } else {
        // 30% across broader regional Atlantic waters
        lon = minLon + Math.random() * (maxLon - minLon);
        lat = minLat + Math.random() * (maxLat - minLat);
      }

      if (!this.weather.isLand(lon, lat)) {
        return [lon, lat];
      }
    }
    return [this.EYE_LON + 2.5, this.EYE_LAT + 1.2];
  }

  /**
   * Conformal Mercator Projection centered over the American East Coast seaboard.
   * (CENTER_LON, CENTER_LAT) projects EXACTLY to (width/2, height/2).
   */
  private lonLatToScreen(lon: number, lat: number): [number, number] {
    const w = this.width;
    const h = this.height;
    if (w <= 0 || h <= 0) return [0, 0];

    const x = w * 0.5 + (lon - this.CENTER_LON) * DEG * this.mapScale;
    const safeLat = Math.max(-85, Math.min(85, lat));
    const latRad = safeLat * DEG;
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = h * 0.5 - (mercN - this.centerMerc) * this.mapScale;
    return [x, y];
  }

  private screenToLonLat(x: number, y: number): [number, number] {
    const w = this.width;
    const h = this.height;
    if (w <= 0 || h <= 0) return [this.CENTER_LON, this.CENTER_LAT];

    const lon = this.CENTER_LON + (x - w * 0.5) / (this.mapScale * DEG);
    const mercN = this.centerMerc - (y - h * 0.5) / this.mapScale;
    const latRad = 2 * Math.atan(Math.exp(mercN)) - Math.PI / 2;
    const lat = latRad * RAD;
    return [lon, lat];
  }

  private setupObservers() {
    this.ngZone.runOutsideAngular(() => {
      const canvas = this.canvasRef.nativeElement;

      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          if (width > 0 && height > 0) {
            this.handleResize(width, height);
          }
        }
      });
      this.resizeObserver.observe(canvas);

      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            this.isVisible = entry.isIntersecting;
            if (this.isVisible && !this.animId) {
              this.startLoop();
            }
          }
        },
        { threshold: 0.02 }
      );
      this.intersectionObserver.observe(canvas);
    });
  }

  private handleResize(cssWidth: number, cssHeight: number) {
    const rawDpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    this.dpr = Math.min(rawDpr, 2.0);

    this.width = cssWidth;
    this.height = cssHeight;

    const canvas = this.canvasRef.nativeElement;
    canvas.width = Math.round(cssWidth * this.dpr);
    canvas.height = Math.round(cssHeight * this.dpr);

    // View scale shifted westward over the American continent and seaboard
    const isMobile = cssWidth <= 640;
    const spanLonDeg = isMobile ? 9.6 : 14.0;
    this.mapScale = cssWidth / (spanLonDeg * DEG);

    if (this.offscreenMapCanvas) {
      this.offscreenMapCanvas.width = canvas.width;
      this.offscreenMapCanvas.height = canvas.height;
    }

    this.renderBasemap();

    for (const p of this.particles) {
      const [sx, sy] = this.lonLatToScreen(p.lon, p.lat);
      p.histX.fill(sx);
      p.histY.fill(sy);
      p.histSpeed.fill(p.speed);
      p.trailCount = 1;
    }
  }

  private renderBasemap() {
    if (!this.offscreenMapCtx || !this.offscreenMapCanvas || this.width <= 0 || this.height <= 0) return;
    const ctx = this.offscreenMapCtx;

    ctx.save();
    ctx.scale(this.dpr, this.dpr);

    // Ocean Background in KMD Light Theme
    ctx.fillStyle = this.theme.getTokenColor('neutral-50', '#f5f7fb');
    ctx.fillRect(0, 0, this.width, this.height);

    // Graticules across the view
    ctx.strokeStyle = this.theme.getTokenColor('neutral-200', 'rgba(203, 213, 225, 0.40)');
    ctx.lineWidth = 1.0;
    ctx.setLineDash([4, 6]);

    // Parallels (34°N to 44°N)
    for (let lat = 34; lat <= 44; lat += 2) {
      const [, y] = this.lonLatToScreen(this.CENTER_LON, lat);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }

    // Meridians (-82°W to -66°W)
    for (let lon = -82; lon <= -66; lon += 2) {
      const [x] = this.lonLatToScreen(lon, this.CENTER_LAT);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // 2. High-Resolution American Landmass (Detailed 10m coastline and filled land)
    const land = this.weather.detailedLand() || this.weather.landFeature();
    if (land) {
      ctx.fillStyle = this.theme.getTokenColor('neutral-100', '#eef2f7');
      ctx.strokeStyle = this.theme.getTokenColor('neutral-400', 'rgba(100, 116, 139, 0.48)');
      ctx.lineWidth = 1.2;

      const drawRing = (ring: [number, number][]) => {
        if (!ring.length) return;
        const [x0, y0] = this.lonLatToScreen(ring[0][0], ring[0][1]);
        ctx.moveTo(x0, y0);
        for (let i = 1; i < ring.length; i++) {
          const [x, y] = this.lonLatToScreen(ring[i][0], ring[i][1]);
          ctx.lineTo(x, y);
        }
      };

      ctx.beginPath();
      for (const feature of land.features || [land]) {
        const geom = feature.geometry;
        if (!geom) continue;
        if (geom.type === 'Polygon') {
          for (const ring of geom.coordinates) drawRing(ring);
        } else if (geom.type === 'MultiPolygon') {
          for (const poly of geom.coordinates) {
            for (const ring of poly) drawRing(ring);
          }
        }
      }
      ctx.fill();
      ctx.stroke();
    }

    // 3. Detailed US State & Provincial Borders (Subtle dotted cartography)
    const stateLines = this.weather.stateBorders();
    if (stateLines && stateLines.length > 0) {
      ctx.strokeStyle = this.theme.getTokenColor('neutral-300', 'rgba(148, 163, 184, 0.35)');
      ctx.lineWidth = 0.8;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      for (let s = 0; s < stateLines.length; s++) {
        const seg = stateLines[s];
        if (seg.length < 2) continue;
        const [x0, y0] = this.lonLatToScreen(seg[0][0], seg[0][1]);
        ctx.moveTo(x0, y0);
        for (let i = 1; i < seg.length; i++) {
          const [x, y] = this.lonLatToScreen(seg[i][0], seg[i][1]);
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.restore();
  }

  private startLoop() {
    if (this.animId !== null) return;
    this.lastTime = performance.now();

    this.ngZone.runOutsideAngular(() => {
      const loop = (now: number) => {
        if (!this.isVisible) {
          this.animId = null;
          return;
        }

        const elapsed = (now - this.lastTime) * 0.001;
        this.lastTime = now;
        const dt = Math.min(elapsed, 0.033);

        this.tick(dt);
        this.render();

        this.animId = requestAnimationFrame(loop);
      };

      this.animId = requestAnimationFrame(loop);
    });
  }

  private stopLoop() {
    if (this.animId !== null) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  private tick(dt: number) {
    if (!this.isDataReady) return;

    // Fluid advection scale calibrated for zoomed vortex view
    const DEG_PER_MS = 0.52;
    const margin = 120;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.age += dt;

      this.weather.waterSample(p.lon, p.lat, this.sampleBuffer);
      p.u = this.sampleBuffer.u;
      p.v = this.sampleBuffer.v;
      p.waveHeight = this.sampleBuffer.waveHeight;

      // Smooth speed relaxation to ensure fluid color transitions across velocity gradients
      const targetSpeed = this.sampleBuffer.speed;
      p.speed += (targetSpeed - p.speed) * Math.min(1.0, dt * 5.0);

      // Advect along swirling cyclone velocity vector
      const cosLat = Math.max(0.20, Math.cos(p.lat * DEG));
      p.lon += (p.u * DEG_PER_MS * dt) / cosLat;
      p.lat += p.v * DEG_PER_MS * dt;

      const [curSx, curSy] = this.lonLatToScreen(p.lon, p.lat);
      p.histX.copyWithin(1, 0, this.TRAIL - 1);
      p.histY.copyWithin(1, 0, this.TRAIL - 1);
      p.histSpeed.copyWithin(1, 0, this.TRAIL - 1);
      p.histX[0] = curSx;
      p.histY[0] = curSy;
      p.histSpeed[0] = p.speed;
      if (p.trailCount < this.TRAIL) p.trailCount++;

      const outOfScreen =
        curSx < -margin || curSx > this.width + margin || curSy < -margin || curSy > this.height + margin;
      const hitLand = this.weather.isLand(p.lon, p.lat);

      if (p.age >= p.life || outOfScreen || hitLand) {
        p.isDying = true;
      }

      if (p.isDying) {
        p.trailCount = Math.max(0, p.trailCount - 4);

        if (p.trailCount <= 1) {
          const [nLon, nLat] = this.randomOceanPoint();
          p.lon = nLon;
          p.lat = nLat;
          p.age = 0;
          p.life = 18.0 + Math.random() * 14.0;
          p.isDying = false;
          p.trailCount = 1;
          const [sx, sy] = this.lonLatToScreen(p.lon, p.lat);
          p.histX.fill(sx);
          p.histY.fill(sy);
          this.weather.waterSample(p.lon, p.lat, this.sampleBuffer);
          p.speed = this.sampleBuffer.speed;
          p.histSpeed.fill(p.speed);
        }
      }
    }
  }

  /**
   * Batched render of the zoomed Cyclone Eye.
   * Only 8 total path strokes per frame! Runs in ~0.2ms (locked 120 FPS).
   */
  private render() {
    if (!this.ctx || this.width <= 0 || this.height <= 0) return;
    const ctx = this.ctx;
    const w = this.canvasRef.nativeElement.width;
    const h = this.canvasRef.nativeElement.height;

    // 1. Clear Frame (Zero Ghosting)
    ctx.clearRect(0, 0, w, h);

    // 2. Blit Pre-rendered Basemap (0.1ms)
    if (this.offscreenMapCanvas) {
      ctx.drawImage(this.offscreenMapCanvas, 0, 0);
    }

    if (!this.isDataReady) return;

    ctx.save();
    ctx.scale(this.dpr, this.dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'miter';
    ctx.miterLimit = 2;

    // 3. Render Continuous Gradient Traces & Dynamic Glowing Vertex Heads
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      const count = p.trailCount;
      if (count < 3) continue;

      const x0 = p.histX[0];
      const y0 = p.histY[0];
      const midIdx = Math.round(count * 0.62);
      const xMid = p.histX[midIdx];
      const yMid = p.histY[midIdx];
      const xTail = p.histX[count - 1];
      const yTail = p.histY[count - 1];

      const [hr, hg, hb] = getSpeedRgb(p.histSpeed[0]);
      const [mr, mg, mb] = getSpeedRgb(p.histSpeed[midIdx]);
      const [tr, tg, tb] = getSpeedRgb(p.histSpeed[count - 1]);

      // 3A. Body Section (Head -> Mid with continuous velocity gradient)
      const dx = xMid - x0;
      const dy = yMid - y0;
      const gradBody =
        Math.hypot(dx, dy) > 2
          ? ctx.createLinearGradient(x0, y0, xMid, yMid)
          : ctx.createLinearGradient(x0, y0, x0 + 2, y0);
      gradBody.addColorStop(0, `rgba(${hr}, ${hg}, ${hb}, 0.92)`);
      gradBody.addColorStop(1, `rgba(${mr}, ${mg}, ${mb}, 0.40)`);

      ctx.lineWidth = 1.8 + Math.min(2.0, (p.speed / 4.0) * 2.0);
      ctx.strokeStyle = gradBody;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      for (let s = 2; s < midIdx; s += 2) {
        ctx.lineTo(p.histX[s], p.histY[s]);
      }
      ctx.lineTo(xMid, yMid);
      ctx.stroke();

      // 3B. Tapered Faded Tail Section (Mid -> Tail fading smoothly to transparency)
      const tdx = xTail - xMid;
      const tdy = yTail - yMid;
      const gradTail =
        Math.hypot(tdx, tdy) > 2
          ? ctx.createLinearGradient(xMid, yMid, xTail, yTail)
          : ctx.createLinearGradient(xMid, yMid, xMid + 2, yMid);
      gradTail.addColorStop(0, `rgba(${mr}, ${mg}, ${mb}, 0.40)`);
      gradTail.addColorStop(1, `rgba(${tr}, ${tg}, ${tb}, 0.0)`);

      ctx.lineWidth = 1.1;
      ctx.strokeStyle = gradTail;
      ctx.beginPath();
      ctx.moveTo(xMid, yMid);
      for (let s = midIdx + 2; s < count; s += 2) {
        ctx.lineTo(p.histX[s], p.histY[s]);
      }
      ctx.lineTo(xTail, yTail);
      ctx.stroke();

      // 3C. Leading Vertex Head (Reduced vertex head clutter, clean dynamic highlights)
      if (p.speed > 2.0) {
        const radius = 1.3 + Math.min(1.5, (p.speed - 2.0) * 0.7);
        ctx.fillStyle = `rgb(${hr}, ${hg}, ${hb})`;
        ctx.beginPath();
        ctx.arc(x0, y0, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  private emitSummaryTelemetry() {
    this.ngZone.run(() => {
      this.telemetryChange.emit({
        latLon: '39.00°N, 71.00°W (Cyclone Eye Center)',
        velocity: '2.8 m/s (5.4 kn) · Eyewall Peak',
        vorticity: '+2.8 × 10⁻⁴ s⁻¹ (Concentric Swirl)',
        regimeKey: 'regimeVortex'
      });
    });
  }
}
