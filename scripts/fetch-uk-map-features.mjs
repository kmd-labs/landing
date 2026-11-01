import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Bounding box covering UK, Ireland, Norway, France, Spain, Portugal, Algeria, Morocco, and surrounding shelf waters
const BBOX = {
  minLon: -25.0,
  maxLon: 28.0,
  minLat: 26.0,
  maxLat: 72.0
};

function roundCoord(c) {
  return Math.round(c * 100) / 100;
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

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to GET ${url}: HTTP ${res.statusCode}`));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
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

async function extractLand() {
  console.log('1/6 Extracting 10m land covering UK, Norway, France, Spain, Algeria, etc...');
  const countriesUrl = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries.geojson';
  const targetCodes = new Set([
    'GBR', 'IRL', 'IMN', 'JEY', 'GGY', // UK & Ireland & Crown dependencies
    'FRA', 'MCO', 'AND',               // France & Monaco & Andorra
    'ESP', 'PRT', 'GIB',               // Spain & Portugal & Gibraltar
    'NOR', 'SWE', 'DNK', 'FRO', 'ISL', // Norway & Scandinavia & North Atlantic
    'BEL', 'NLD', 'LUX', 'DEU', 'CHE', // Low Countries, Germany, Switzerland
    'ITA', 'SMR', 'VAT',               // Italy
    'DZA', 'MAR', 'TUN'                // Algeria, Morocco, Tunisia
  ]);
  const features = [];

  await streamGeoJson(countriesUrl, (feat) => {
    const code = feat.properties?.ADM0_A3 || feat.properties?.ISO_A3;
    if (!targetCodes.has(code)) return;

    const simplifyRing = (ring) => simplifyPoints(ring);

    const geom = feat.geometry;
    if (!geom) return;

    if (geom.type === 'Polygon') {
      geom.coordinates = geom.coordinates.map(simplifyRing).filter(r => r.length >= 3);
    } else if (geom.type === 'MultiPolygon') {
      geom.coordinates = geom.coordinates
        .map(poly => poly.map(simplifyRing).filter(r => r.length >= 3))
        .filter(poly => poly.length > 0);
    }

    features.push({
      type: 'Feature',
      properties: { code, name: feat.properties?.NAME },
      geometry: geom
    });
  });

  const targetPath = path.resolve(__dirname, '../src/assets/data/uk-land-10m.json');
  fs.writeFileSync(targetPath, JSON.stringify({ type: 'FeatureCollection', features }));
  console.log(`Saved land to ${targetPath}: ${features.length} country geometries. Size: ${(fs.statSync(targetPath).size / 1024).toFixed(1)} KB`);
}

async function extractBorders10m() {
  console.log('2/6 Extracting 10m borders covering UK, Norway, France, Spain, Algeria, etc...');
  const bordersUrl = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_boundary_lines_land.geojson';
  const borders = [];

  await streamGeoJson(bordersUrl, (feat) => {
    const [minX, minY, maxX, maxY] = feat.bbox || [-180, -90, 180, 90];
    if (maxX < BBOX.minLon || minX > BBOX.maxLon || maxY < BBOX.minLat || minY > BBOX.maxLat) return;

    const processLine = (coords) => {
      const line = simplifyPoints(coords);
      if (line.length >= 2) borders.push(line);
    };

    const geom = feat.geometry;
    if (!geom) return;
    if (geom.type === 'LineString') {
      processLine(geom.coordinates);
    } else if (geom.type === 'MultiLineString') {
      for (const line of geom.coordinates) processLine(line);
    }
  });

  // Also include constituent borders (Scotland, England, Wales, NI)
  const mapUnits = await fetchJson('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_boundary_map_units.geojson').catch(() => null);
  if (mapUnits?.features) {
    for (const feat of mapUnits.features) {
      const [minX, minY, maxX, maxY] = feat.bbox || [-180, -90, 180, 90];
      if (maxX < BBOX.minLon || minX > BBOX.maxLon || maxY < BBOX.minLat || minY > BBOX.maxLat) continue;
      const geom = feat.geometry;
      if (!geom) continue;
      if (geom.type === 'LineString') {
        const line = simplifyPoints(geom.coordinates);
        if (line.length >= 2) borders.push(line);
      }
    }
  }

  const targetPath = path.resolve(__dirname, '../src/assets/data/uk-states-10m.json');
  fs.writeFileSync(targetPath, JSON.stringify(borders));
  console.log(`Saved 10m borders to ${targetPath}: ${borders.length} line segments. Size: ${(fs.statSync(targetPath).size / 1024).toFixed(1)} KB`);
}

async function extractBorders50m() {
  console.log('3/6 Extracting clean 50m national and constituent borders covering UK, Norway, France, Spain, Algeria (for mobile)...');
  const borders50m = [];

  const handleLine = (feat) => {
    const [minX, minY, maxX, maxY] = feat.bbox || [-180, -90, 180, 90];
    if (maxX < BBOX.minLon || minX > BBOX.maxLon || maxY < BBOX.minLat || minY > BBOX.maxLat) return;

    const processLine = (coords) => {
      const line = simplifyPoints(coords);
      if (line.length >= 2) borders50m.push(line);
    };

    const geom = feat.geometry;
    if (!geom) return;
    if (geom.type === 'LineString') processLine(geom.coordinates);
    else if (geom.type === 'MultiLineString') {
      for (const line of geom.coordinates) processLine(line);
    }
  };

  const [b0, bMapUnits] = await Promise.all([
    fetchJson('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_boundary_lines_land.geojson'),
    fetchJson('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_boundary_map_units.geojson')
  ]);

  b0.features.forEach(handleLine);
  bMapUnits.features.forEach(handleLine);

  const targetPath = path.resolve(__dirname, '../src/assets/data/uk-states-50m.json');
  fs.writeFileSync(targetPath, JSON.stringify(borders50m));
  console.log(`Saved 50m borders to ${targetPath}: ${borders50m.length} clean boundaries. Size: ${(fs.statSync(targetPath).size / 1024).toFixed(1)} KB`);
}

async function extractRoads() {
  console.log('4/6 Extracting motorway & road network covering UK, Norway, France, Spain, Algeria...');
  const roadsUrl = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_roads.geojson';
  const highways = [];
  const secondary = [];

  await streamGeoJson(roadsUrl, (feat) => {
    const [minX, minY, maxX, maxY] = feat.bbox || [-180, -90, 180, 90];
    if (maxX < BBOX.minLon || minX > BBOX.maxLon || maxY < BBOX.minLat || minY > BBOX.maxLat) return;

    const type = feat.properties?.type;
    if (type && type.toLowerCase().includes('ferry')) return;

    const isExpressway = feat.properties?.expressway === 1;
    const isMajor = type === 'Major Highway' || type === 'Beltway' || isExpressway;

    const processLine = (coords) => {
      const line = simplifyPoints(coords);
      if (line.length >= 2) {
        if (isMajor) highways.push(line);
        else secondary.push(line);
      }
    };

    const geom = feat.geometry;
    if (!geom) return;
    if (geom.type === 'LineString') {
      processLine(geom.coordinates);
    } else if (geom.type === 'MultiLineString') {
      for (const line of geom.coordinates) processLine(line);
    }
  });

  const targetPath = path.resolve(__dirname, '../src/assets/data/uk-roads-10m.json');
  const payload = { highways, secondary };
  fs.writeFileSync(targetPath, JSON.stringify(payload));
  console.log(`Saved roads to ${targetPath}: ${highways.length} motorways, ${secondary.length} secondary. Size: ${(fs.statSync(targetPath).size / 1024).toFixed(1)} KB`);
}

async function extractCities10m() {
  console.log('5/6 Extracting 10m urban boundaries covering UK, Norway, France, Spain, Algeria...');
  const urbanUrl = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_urban_areas.geojson';
  const cityLimits = [];

  await streamGeoJson(urbanUrl, (feat) => {
    const [minX, minY, maxX, maxY] = feat.bbox || [-180, -90, 180, 90];
    if (maxX < BBOX.minLon || minX > BBOX.maxLon || maxY < BBOX.minLat || minY > BBOX.maxLat) return;

    const area = feat.properties?.area_sqkm ?? 0;
    if (area < 15) return; // Keep significant metropolitan regions for desktop

    const processRing = (coords) => {
      const ring = simplifyPoints(coords);
      if (ring.length >= 3) cityLimits.push(ring);
    };

    const geom = feat.geometry;
    if (!geom) return;
    if (geom.type === 'Polygon') {
      for (const ring of geom.coordinates) processRing(ring);
    } else if (geom.type === 'MultiPolygon') {
      for (const poly of geom.coordinates) {
        for (const ring of poly) processRing(ring);
      }
    }
  });

  const targetPath = path.resolve(__dirname, '../src/assets/data/uk-cities-10m.json');
  fs.writeFileSync(targetPath, JSON.stringify(cityLimits));
  console.log(`Saved 10m city limits to ${targetPath}: ${cityLimits.length} urban boundary rings. Size: ${(fs.statSync(targetPath).size / 1024).toFixed(1)} KB`);
}

async function extractCities50m() {
  console.log('6/6 Extracting clean 50m major urban centers covering UK, Norway, France, Spain, Algeria (for mobile)...');
  const urbanData = await fetchJson('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_urban_areas.geojson');
  const cityLimits50m = [];

  for (const feat of urbanData.features) {
    const [minX, minY, maxX, maxY] = feat.bbox || [-180, -90, 180, 90];
    if (maxX < BBOX.minLon || minX > BBOX.maxLon || maxY < BBOX.minLat || minY > BBOX.maxLat) continue;

    const processRing = (coords) => {
      const ring = simplifyPoints(coords);
      if (ring.length >= 3) cityLimits50m.push(ring);
    };

    const geom = feat.geometry;
    if (!geom) continue;
    if (geom.type === 'Polygon') {
      for (const ring of geom.coordinates) processRing(ring);
    } else if (geom.type === 'MultiPolygon') {
      for (const poly of geom.coordinates) {
        for (const ring of poly) processRing(ring);
      }
    }
  }

  const targetPath = path.resolve(__dirname, '../src/assets/data/uk-cities-50m.json');
  fs.writeFileSync(targetPath, JSON.stringify(cityLimits50m));
  console.log(`Saved 50m city limits to ${targetPath}: ${cityLimits50m.length} major metro rings. Size: ${(fs.statSync(targetPath).size / 1024).toFixed(1)} KB`);
}

async function main() {
  try {
    await extractLand();
    await extractBorders10m();
    await extractBorders50m();
    await extractRoads();
    await extractCities10m();
    await extractCities50m();

    console.log('All map assets covering UK, Norway, France, Spain, Algeria, and surrounding regions ready.');
  } catch (err) {
    console.error('Failed to extract map features:', err);
    process.exit(1);
  }
}

main();
