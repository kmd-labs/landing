#!/usr/bin/env node
import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const DIR = dirname(fileURLToPath(import.meta.url));
const OUT_FILE = resolve(DIR, '../src/assets/data/current-wind.json');

// Global meteorological grid matching Open-Meteo marine/atmospheric snapshot
// Latitude: -60° to +60° in 10° steps (13 rows)
// Longitude: -180° to +170° in 10° steps (36 columns)
// Total nodes: 13 * 36 = 468 nodes (3 chunks of 156 nodes)
const LAT0 = -60;
const STEP = 10;
const N_LAT = 13;
const LON0 = -180;
const N_LON = 36;
const TOTAL_POINTS = N_LAT * N_LON; // 468 points
const CHUNK_SIZE = 156;

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

const round1 = (val) => (val == null || Number.isNaN(val) ? 0 : Math.round(val * 10) / 10);

async function run() {
  console.log(`[fetch-current-wind] Fetching global wind grid: ${N_LAT}x${N_LON} (${TOTAL_POINTS} nodes)`);

  const points = [];
  for (let r = 0; r < N_LAT; r++) {
    const lat = LAT0 + r * STEP;
    for (let c = 0; c < N_LON; c++) {
      const lon = LON0 + c * STEP;
      points.push({ lat, lon });
    }
  }

  const results = [];
  const start = Date.now();

  for (let i = 0; i < points.length; i += CHUNK_SIZE) {
    const chunk = points.slice(i, i + CHUNK_SIZE);
    const lats = chunk.map((p) => p.lat).join(',');
    const lons = chunk.map((p) => p.lon).join(',');
    const url = `${BASE_URL}?latitude=${lats}&longitude=${lons}&current=wind_speed_10m,wind_direction_10m,temperature_2m&wind_speed_unit=ms`;

    let success = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
        if (res.status === 429) {
          console.warn(`[fetch-current-wind] Rate limit (429), waiting ${attempt * 2}s...`);
          await new Promise((r) => setTimeout(r, attempt * 2000));
          continue;
        }
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        const json = await res.json();
        const records = Array.isArray(json) ? json : [json];
        for (const item of records) {
          results.push(item.current ?? {});
        }
        process.stdout.write(`[Chunk ${Math.floor(i / CHUNK_SIZE) + 1}/${Math.ceil(points.length / CHUNK_SIZE)}] `);
        success = true;
        break;
      } catch (err) {
        console.warn(`Chunk ${i} error: ${err.message}, retrying...`);
        await new Promise((r) => setTimeout(r, 2000));
      }
    }

    if (!success) {
      console.warn(`Could not fetch chunk ${i}, keeping fallback zeroes for this region.`);
      while (results.length < i + chunk.length) {
        results.push({});
      }
    }

    if (i + CHUNK_SIZE < points.length) {
      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  console.log(`\n[fetch-current-wind] Downloaded in ${((Date.now() - start) / 1000).toFixed(1)}s`);

  const u = new Float32Array(TOTAL_POINTS);
  const v = new Float32Array(TOTAL_POINTS);
  const speed = new Float32Array(TOTAL_POINTS);
  const temp = new Float32Array(TOTAL_POINTS);

  const DEG = Math.PI / 180;
  let validCount = 0;
  let maxSpd = 0;

  for (let i = 0; i < TOTAL_POINTS; i++) {
    const rec = results[i] || {};
    const spd = rec.wind_speed_10m ?? 0;
    const dir = rec.wind_direction_10m ?? 0;
    const t = rec.temperature_2m ?? 15;

    // Meteorological vector components:
    // u = eastward (m/s)
    // v = northward (m/s)
    const uComp = -spd * Math.sin(dir * DEG);
    const vComp = -spd * Math.cos(dir * DEG);

    u[i] = round1(uComp);
    v[i] = round1(vComp);
    speed[i] = round1(spd);
    temp[i] = round1(t);

    if (spd > 0) validCount++;
    if (spd > maxSpd) maxSpd = spd;
  }

  const payload = {
    source: 'Open-Meteo.com (CC BY 4.0)',
    sourceUrl: 'https://open-meteo.com/',
    fetchedAt: new Date().toISOString(),
    time: results[0]?.time ?? new Date().toISOString(),
    grid: {
      lat0: LAT0,
      lon0: LON0,
      step: STEP,
      nLat: N_LAT,
      nLon: N_LON
    },
    stats: {
      totalNodes: TOTAL_POINTS,
      validNodes: validCount,
      maxSpeedMps: maxSpd
    },
    u: Array.from(u),
    v: Array.from(v),
    speed: Array.from(speed),
    temp: Array.from(temp)
  };

  await mkdir(dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(payload, null, 2));
  console.log(`[fetch-current-wind] Successfully wrote ${OUT_FILE} (${(Buffer.byteLength(JSON.stringify(payload)) / 1024).toFixed(1)} KB)`);
}

run().catch((err) => {
  console.error('[fetch-current-wind] Error:', err);
  process.exit(1);
});
