import { Dict } from './i18n.types';

export const EN: Dict = {
  htmlLang: 'en',
  docTitle: 'KMD Labs · Interactive Data Visualisation & Scientific Engineering',
  appName: 'Laboratory',
  langName: 'English',

  // Top HUD & Navigation
  changeLanguage: 'Language',
  scrollToTopAria: 'Return to interactive simulation',
  navPortfolio: 'Portfolio',
  navSpecialities: 'Specialities',
  navTeam: 'Team',
  navContact: 'Contact',

  // Hero Section
  heroKicker: 'KMD LABS · EARTH OBSERVATION & CARTOGRAPHY',
  heroTitle: 'Scientific Data Visualisation &',
  heroHighlight: 'Geospatial Engineering',
  heroSubtitle:
    'We transform complex satellite telemetry, ocean currents, and planetary datasets into ultra-responsive, publication-grade interactive web experiences.',
  heroPrimaryCta: 'Explore Observatory',
  heroSecondaryCta: 'Initiate Contact',
  heroInteractionHint:
    'Cyclone eye centered observatory: mesoscale vortex core, eyewall streamline circulation & ocean dynamics telemetry',
  heroDataSource: 'Wind & Marine Vectors: Open-Meteo & NOAA GFS Telemetry (00:00 UTC)',
  showMore: 'Show more',
  showMoreAria: 'Scroll down to explore KMD Labs portfolio and observatory',

  // Live Hero Telemetry
  telemetryLatLon: 'OBSERVATORY LAT/LON',
  telemetryVelocity: 'OCEAN WAVE HEIGHT',
  telemetryVorticity: 'DOMINANT SWELL / DYNAMICS',
  telemetryAnomaly: 'WATER TEMPERATURE',
  telemetryRegime: 'CIRCULATION REGIME',
  telemetryParticles: 'ACTIVE STREAMLINES',
  thermalScaleCold: '-3.0°C (Cold Water)',
  thermalScaleWarm: '+3.0°C (Warm Water)',
  velocityScaleSlow: '0.5m Calm Drift',
  velocityScaleFast: '8.5m+ Storm Swell',
  regimeLaminar: 'Laminar Streamline Flow',
  regimeTransition: 'Wave Instability & Meanders',
  regimeRollup: 'Vortex Roll-Up Zone',
  regimeVortex: 'Turbulent Vortex Street',
  regimeMeander: 'Prevailing Westerly Flow',
  regimeColdCoreRing: 'Cyclonic Low-Pressure Vortex',
  regimeWarmCoreRing: 'Anticyclonic Subtropical High',
  regimeWakeEddy: 'Turbulent Wake & Reverse Flow',
  regimeRossbyWave: 'Rossby Wave Undulation',
  regimeTradeWinds: 'Trade Winds (Easterlies)',
  regimeWesterlies: 'Prevailing Westerlies (Roaring Forties)',
  regimePolarVortex: 'Circumpolar Vortex / Polar Easterlies',
  regimeDoldrums: 'ITCZ / Equatorial Doldrums',
  regimeJetStream: 'Subtropical Jet Stream',
  telemetryLiveWind: 'DAILY OPEN-METEO TELEMETRY',
  telemetryUpdatedDaily: 'Updated daily at 00:00 UTC',
  canvasLabelGulfStream: 'LAMINAR INFLOW',
  canvasLabelMeanderPinch: 'SHEAR INSTABILITY',
  canvasLabelColdCoreRing: 'COHERENT VORTEX CORE',
  canvasLabelWakeReverse: 'REVERSE FLOW & EDGE SWIRLS',
  canvasStageLaminar: '01 LAMINAR',
  canvasStageTransition: '02 UNDULATION',
  canvasStageRollup: '03 ROLL-UP',
  canvasStageVortex: '04 VORTEX STREET',

  // Portfolio Section
  portfolioKicker: 'OBSERVATORY ARCHIVE',
  portfolioTitle: 'Flagship Interactive Applications',
  portfolioLead:
    'Every project is engineered with zero-friction interaction, custom WebGL/Canvas rendering pipelines, and real planetary telemetry.',
  launchApp: 'Launch Visualization',
  projects: [
    {
      id: 'el-nino',
      tag: '01 / PLANETARY CLIMATOLOGY',
      title: 'El Niño — Southern Oscillation',
      subtitle: 'Global 3D WebGL thermal anomaly, atmospheric Walker circulation & historical impact ledger',
      description:
        'Interactive digital twin of the coupled Pacific ocean-atmosphere system. Integrates multi-decade Sea Surface Temperature (SST) keyframes, real-time NOAA/Copernicus anomalies, and dynamic wind & wave crest streamlines.',
      metrics: [
        { label: 'RESOLUTION', value: '0.25° Global' },
        { label: 'RENDERER', value: 'WebGL / Three.js' },
        { label: 'LATENCY', value: '60 FPS' }
      ],
      tags: ['WebGL 3D', 'Three.js', 'Climate Telemetry', 'Particle Streamlines'],
      url: 'https://kmd-labs.github.io/el-nino/'
    },
    {
      id: 'watershed',
      tag: '02 / OCEANOGRAPHY & ECOLOGY',
      title: 'Baltic Nutrient Loads (Watershed)',
      subtitle: 'Drainage basin riverine Nitrogen/Phosphorus discharge & deep seabed hypoxia telemetry',
      description:
        'Comprehensive geospatial analysis of 85+ Baltic catchments across 14 countries. Visualizes 50 years of agricultural nutrient runoff and near-bottom oxygen depletion (dead zones) ventilated by Major Baltic Inflows.',
      metrics: [
        { label: 'CATCHMENTS', value: '85+ Basins' },
        { label: 'DATA BASIS', value: 'HELCOM PLC-7' },
        { label: 'OXYGEN DEAD ZONES', value: '1960–2026' }
      ],
      tags: ['Geographic GIS', 'Cartography', 'Biogeochemistry', 'HELCOM Data'],
      url: 'https://kmd-labs.github.io/watershed/'
    },
    {
      id: 'golfstrom',
      tag: '03 / THERMOHALINE DYNAMICS',
      title: 'Golfstrom',
      subtitle: 'North Atlantic boundary current transport, vorticity filaments & kinetic eddy simulation',
      description:
        'High-density vector field advection modeling the Atlantic Meridional Overturning Circulation (AMOC). Renders thousands of Lagrangian particle tracks reflecting boundary current velocity, salinity, and temperature gradients.',
      metrics: [
        { label: 'CURRENT SYSTEM', value: 'North Atlantic' },
        { label: 'ADVECTION', value: 'Vector Field' },
        { label: 'COMPUTATION', value: 'Client-side GL' }
      ],
      tags: ['Ocean Dynamics', 'Lagrangian Particles', 'AMOC', 'Interactive Canvas'],
      url: 'https://kmd-labs.github.io/golfstrom/'
    },
    {
      id: 'viadrus-ai',
      tag: '04 / SATELLITE INNOVATION',
      title: 'Viadrus AI (CASSINI Winner)',
      subtitle: '1st Place European Champions — 11th CASSINI Hackathon by European Union Space Programme',
      description:
        'Our founding innovation: early detection of municipal water distribution network leaks by correlating Copernicus Sentinel-1 radar (SAR) moisture signatures and Sentinel-2 multispectral indices with hydraulic telemetry.',
      metrics: [
        { label: 'AWARD', value: '1st Place EU Final' },
        { label: 'ORGANIZER', value: 'EUSPA / EC' },
        { label: 'SATELLITES', value: 'Sentinel-1 & 2' }
      ],
      tags: ['Copernicus SAR', 'Machine Learning', 'EUSPA Award', 'Infrastructure'],
      url: 'https://defence-industry-space.ec.europa.eu/orbit-water-tap-11th-cassini-hackathon-2026-05-08_en',
      isExternal: true
    }
  ],

  // Specialities Section
  specialitiesKicker: 'CORE CAPABILITIES',
  specialitiesTitle: 'Where Spatial Science Meets Modern Software Engineering',
  specialitiesLead:
    'We bridge the gap between academic Earth observation, massive spatial datasets, and modern performant web architecture.',
  disciplines: [
    {
      id: 'geoviz',
      title: 'Geovisualisation & 3D WebGL',
      lead: 'Turning multi-gigabyte spatial rasters and atmospheric fields into fluid 60 FPS web canvases.',
      points: [
        'Custom WebGL, Three.js, and GLSL shaders for real-time spherical & flat projections.',
        'Lagrangian particle systems, curl-noise vector fields, and thermodynamic color gradients.',
        'Pixel-ratio aware, high-DPI scientific rendering with accessible HUD typography.'
      ],
      tools: ['WebGL', 'Three.js', 'HTML5 Canvas', 'GLSL', 'D3.js', 'GIS Projection Math']
    },
    {
      id: 'data-eng',
      title: 'Data Engineering & Satellite EO',
      lead: 'End-to-end processing pipelines from satellite orbits down to optimized client tiles.',
      points: [
        'Automated ingestion of Copernicus Sentinel-1 (SAR), Sentinel-2, and NOAA/Copernicus marine data.',
        'Spatial ETL pipelines, raster tiling, GeoTIFF processing, and binary compression (bin.gz).',
        'Data quality monitoring, sensor cross-calibration, and robust geographic data schemas.'
      ],
      tools: ['Copernicus EO', 'Python / GDAL', 'Rasterio', 'PostGIS', 'Cloudflare Workers', 'DuckDB']
    },
    {
      id: 'ai-ml',
      title: 'AI, Machine Learning & Anomaly Detection',
      lead: 'Targeted machine learning models detecting outliers, physical leaks, and environmental shifts.',
      points: [
        'Spatio-temporal anomaly detection across satellite moisture time-series and sensor arrays.',
        'Predictive modeling for oceanographic thresholds (hypoxia onset, bloom probabilities).',
        'Production edge deployment with minimal memory footprints and zero cold-start latency.'
      ],
      tools: ['PyTorch', 'Scikit-Learn', 'Anomaly Detection', 'Time Series ML', 'ONNX Web Runtime']
    }
  ],

  // Team Section
  teamKicker: 'RESEARCHERS & BUILDERS',
  teamTitle: 'The KMD Labs Collective',
  teamLead:
    'A multidisciplinary team rooted in environmental engineering, FMCG data architecture, and marine geoinformatics.',
  founders: [
    {
      name: 'Adrian Kulik',
      role: 'Fullstack & AI Engineer · Co-Founder',
      bio: 'Environmental engineer by training and AI engineer by choice. Pioneer of generative 3D graphics, augmented reality systems, and full-stack spatial platforms. Lead developer for the winning 11th CASSINI Hackathon solution.',
      tags: ['Fullstack development', '3D graphics', 'DevOps', 'UX/UI', 'Artificial intelligence', 'Machine learning'],
      linkedin: 'https://www.linkedin.com/in/adrian-kulik',
      github: 'https://github.com/adriankulik',
      photo: 'assets/design-system/team/adrian-kulik.jpg'
    },
    {
      name: 'Leszek Michalak',
      role: 'Lead Data Engineer · Co-Founder',
      bio: 'Master of Administration from the University of Wrocław. Data engineer with deep expertise in enterprise databases, anomaly detection, data quality control, and data acquisition pipelines. Initiator of the Viadrus AI project.',
      tags: ['Data engineering', 'Machine learning', 'Data analytics', 'Data acquisition', 'Data quality'],
      linkedin: 'https://www.linkedin.com/in/leszek-michalak-422745b6/',
      photo: 'assets/design-system/team/leszek-michalak.jpg'
    },
    {
      name: 'Marcin Derewońko',
      role: 'Geoinformatics & AI Specialist · Co-Founder',
      bio: 'Graduate of Marine Geography, Geoinformation, and AI in Corporate Finance. 12+ years consulting on ERP systems, developing machine learning for satellite anomaly detection, and crafting complex geovisualisations.',
      tags: ['Geoinformatics', 'Geovisualisation', 'Anomaly detection', 'Machine learning', 'Artificial intelligence'],
      linkedin: 'https://linkedin.com/in/mmder',
      photo: 'assets/design-system/team/marcin-derewonko.jpg'
    }
  ],

  // Contact / Terminal Section
  contactKicker: 'SECURE GROUND STATION',
  contactTitle: 'Initiate a Project or Technical Call',
  contactLead:
    'Have complex planetary, satellite, or environmental data that needs to be visualised or analyzed? Let us connect.',
  contactTypeDemo: 'Request Live Demo',
  contactTypeCall: 'Schedule Technical Call',
  contactTypeMessage: 'Send Project Inquiry',
  fieldName: 'Your Name',
  fieldNamePlaceholder: 'e.g. Dr. Jane Doe',
  fieldOrg: 'Organization / Institution',
  fieldOrgPlaceholder: 'e.g. Space Agency, Research Institute, Enterprise',
  fieldEmail: 'Work Email Address',
  fieldEmailPlaceholder: 'jane@organization.eu',
  fieldBrief: 'Telemetry / Project Scope Brief',
  fieldBriefPlaceholder: 'Describe your dataset, scientific goals, and desired interactive visualization timeline...',
  contactPlaceholderBadge: 'SANDBOX / SAFE UPLINK MODE',
  contactPlaceholderNotice:
    'Direct serverless email forwarding is currently in calibration. Clicking "Transmit Brief" will copy KMD Labs coordinates and provide direct contact channels without persisting your personal data.',
  contactTransmitBtn: 'Transmit Brief (Simulated)',
  contactCopiedFeedback: '✓ Coordinates copied to clipboard! Connecting via LinkedIn / Email...',
  contactDirectMailNotice:
    'Prefer direct communication? Connect with KMD Labs directly on LinkedIn or reach out to our core team.',
  contactGdprNotice:
    'GDPR Notice: We treat data privacy with absolute rigor. No cookies, trackers, or automated profiling scripts run on this page. All telemetry processing is purely client-side.',

  // Footer
  footerRights: 'All rights reserved.',
  footerTagline: 'KMD Labs · Interactive Data Visualisations & Geospatial Intelligence'
};
