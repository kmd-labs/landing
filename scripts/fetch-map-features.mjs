import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BBOX = {
  minLon: -83.5,
  maxLon: -65.5,
  minLat: 28.5,
  maxLat: 48.5
};

function roundCoord(c) {
  return Math.round(c * 1000) / 1000;
}

function simplifyPoints(coords) {
  const result = [];
  let lastX = null;
  let lastY = null;
  for (const [x, y] of coords) {
    const rx = roundCoord(x);
    const ry = roundCoord(y);
    if (rx !== lastX || ry !== lastY) {
      result.push([rx, ry]);
      lastX = rx;
      lastY = ry;
    }
  }
  return result;
}

function streamGeoJson(url, onFeature) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to GET ${url}: HTTP ${res.statusCode}`));
      }
      let buffer = '';
      res.on('data', (chunk) => {
        buffer += chunk;
        let idx;
        while ((idx = buffer.indexOf('{"type":"Feature"')) !== -1) {
          const nextIdx = buffer.indexOf('{"type":"Feature"', idx + 1);
          if (nextIdx === -1) break;
          const featStr = buffer.slice(idx, nextIdx).replace(/,\s*$/, '');
          try {
            const feat = JSON.parse(featStr);
            onFeature(feat);
          } catch (e) {
            // ignore partial parse errors
          }
          buffer = buffer.slice(nextIdx);
        }
      });
      res.on('end', () => {
        // Handle final trailing feature if present
        if (buffer.startsWith('{"type":"Feature"')) {
          const endIdx = buffer.lastIndexOf('}');
          if (endIdx !== -1) {
            try {
              const feat = JSON.parse(buffer.slice(0, endIdx + 1));
              onFeature(feat);
            } catch (e) {}
          }
        }
        resolve();
      });
    }).on('error', reject);
  });
}

async function extractRoads() {
  console.log('Extracting roads from Natural Earth...');
  const roadsUrl = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_roads.geojson';
  const highways = [];
  const secondary = [];

  await streamGeoJson(roadsUrl, (feat) => {
    const [minX, minY, maxX, maxY] = feat.bbox;
    if (maxX < BBOX.minLon || minX > BBOX.maxLon || maxY < BBOX.minLat || minY > BBOX.maxLat) {
      return;
    }

    const type = feat.properties?.type;
    const isExpressway = feat.properties?.expressway === 1;
    const isMajor = type === 'Major Highway' || type === 'Beltway' || isExpressway;

    const processLine = (pts) => {
      const line = simplifyPoints(pts);
      if (line.length >= 2) {
        if (isMajor) {
          highways.push(line);
        } else {
          secondary.push(line);
        }
      }
    };

    const geom = feat.geometry;
    if (!geom) return;
    if (geom.type === 'LineString') {
      processLine(geom.coordinates);
    } else if (geom.type === 'MultiLineString') {
      for (const line of geom.coordinates) {
        processLine(line);
      }
    }
  });

  const targetPath = path.resolve(__dirname, '../src/assets/data/na-roads-10m.json');
  const payload = { highways, secondary };
  fs.writeFileSync(targetPath, JSON.stringify(payload));
  console.log(`Saved roads to ${targetPath}: ${highways.length} highways, ${secondary.length} secondary. Size: ${(fs.statSync(targetPath).size / 1024).toFixed(1)} KB`);
}

async function extractCities() {
  console.log('Extracting city limits & urban boundaries from Natural Earth...');
  const urbanUrl = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_urban_areas.geojson';
  const cityLimits = [];

  await streamGeoJson(urbanUrl, (feat) => {
    const [minX, minY, maxX, maxY] = feat.bbox;
    if (maxX < BBOX.minLon || minX > BBOX.maxLon || maxY < BBOX.minLat || minY > BBOX.maxLat) {
      return;
    }

    // Include urban areas (filter out micro artifacts < 10 sq km for clean graphics)
    const area = feat.properties?.area_sqkm ?? 0;
    if (area < 10) return;

    const processRing = (pts) => {
      const ring = simplifyPoints(pts);
      if (ring.length >= 3) {
        cityLimits.push(ring);
      }
    };

    const geom = feat.geometry;
    if (!geom) return;
    if (geom.type === 'Polygon') {
      for (const ring of geom.coordinates) {
        processRing(ring);
      }
    } else if (geom.type === 'MultiPolygon') {
      for (const poly of geom.coordinates) {
        for (const ring of poly) {
          processRing(ring);
        }
      }
    }
  });

  const targetPath = path.resolve(__dirname, '../src/assets/data/na-cities-10m.json');
  fs.writeFileSync(targetPath, JSON.stringify(cityLimits));
  console.log(`Saved city limits to ${targetPath}: ${cityLimits.length} urban boundary rings. Size: ${(fs.statSync(targetPath).size / 1024).toFixed(1)} KB`);
}

async function main() {
  try {
    await extractRoads();
    await extractCities();
    console.log('All map assets generated successfully.');
  } catch (err) {
    console.error('Error extracting map features:', err);
    process.exit(1);
  }
}

main();
