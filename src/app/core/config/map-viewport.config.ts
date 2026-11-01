/**
 * Map Viewport & Simulation Configuration
 *
 * Use this file to customize the camera location, zoom level, and screen placement
 * for both desktop and mobile displays, as well as the active marine vortex / eddy.
 */

export interface ViewportSettings {
  /**
   * Geographic focus longitude on the globe in degrees (-180 to 180):
   * Negative = West (e.g. -74.0 for New York, -4.2 for UK/Ireland)
   * Positive = East (e.g. 2.0 for Paris, 139.7 for Tokyo)
   */
  lon: number;

  /**
   * Geographic focus latitude on the globe in degrees (-85 to 85):
   * Positive = North (e.g. 54.5 for UK/Ireland, 40.7 for New York)
   * Negative = South (e.g. -34.0 for Cape Town / Agulhas, -33.8 for Sydney)
   */
  lat: number;

  /**
   * Zoom scale: visible geographic longitude span in degrees across the screen.
   * - Larger number = zoomed OUT (wider ocean basins, continents, global context)
   * - Smaller number = zoomed IN (closer, tighter country/coastal view)
   *
   * Reference values:
   *   360 = full globe
   *   90  = ocean basin / sub-continent
   *   36  = zoomed-out regional view (UK, Ireland, North Sea, France, Norway)
   *   24  = close country view
   *   12  = metropolitan / coastal bay view
   */
  zoom: number;

  /**
   * Horizontal screen offset relative to the center (-0.5 to 0.5):
   *   0.0   = centered horizontally on screen
   *  -0.10  = shifted 10% to the LEFT of center
   *  +0.10  = shifted 10% to the RIGHT of center
   */
  x: number;

  /**
   * Vertical screen offset relative to the center (-0.5 to 0.5):
   *   0.0   = centered vertically on screen
   *  +0.08  = shifted 8% LOWER than center (closer to bottom)
   *  -0.08  = shifted 8% HIGHER than center (closer to top)
   */
  y: number;
}

export interface VortexFocusConfig {
  /** Geographic longitude of the vortex/eddy center in degrees */
  lon: number;
  /** Geographic latitude of the vortex/eddy center in degrees */
  lat: number;
  /** Core radius in degrees (typical range: 0.8 - 2.5) */
  radiusDeg?: number;
  /** Peak tangential swirl speed in m/s (typical range: 1.5 - 4.0) */
  swirlSpeed?: number;
  /** Telemetry readout display label */
  telemetryLabel?: string;
}

export interface MapViewportConfig {
  /** Configuration for desktop / wide displays (> 640px) */
  desktop: ViewportSettings;
  /** Configuration for mobile displays (<= 640px) */
  mobile: ViewportSettings;
  /** Active oceanic vortex / eddy center */
  vortex: VortexFocusConfig;
}

export const MAP_CONFIG: MapViewportConfig = {
  desktop: {
    lon: -14.2, // UK & Ireland geographic target
    lat: 54.5,
    zoom: 36, // Zoomed out slightly for broader oceanic & European context
    x: -0.1, // Positioned a bit to the left of center
    y: 0.08, // Positioned a bit lower than center vertically
  },
  mobile: {
    lon: -4.2, // Centered on UK & Ireland in mobile portrait
    lat: 55.5,
    zoom: 24, // Clean mobile framing
    x: 0, // Centered horizontally
    y: 0.04, // Slightly lower to clear the top bar
  },
  vortex: {
    lon: 3.8, // North Sea marine basin eddy
    lat: 57.2,
    radiusDeg: 1.35,
    swirlSpeed: 2.7,
    telemetryLabel: "57.20°N, 3.80°E (North Sea Vortex Core)",
  },
};
