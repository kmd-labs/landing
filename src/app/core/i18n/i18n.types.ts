export type Lang = 'en' | 'pl';

export interface ProjectEntry {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  metrics: { label: string; value: string }[];
  tags: string[];
  url: string;
  isExternal?: boolean;
}

export interface DisciplineEntry {
  id: string;
  title: string;
  lead: string;
  points: string[];
  tools: string[];
}

export interface FounderEntry {
  name: string;
  role: string;
  bio: string;
  tags: string[];
  linkedin: string;
  github?: string;
  photo: string;
}

/**
 * Every user-facing text of the application in one language.
 * Add new translation keys here first so TypeScript enforces parity across en.ts and pl.ts.
 */
export interface Dict {
  htmlLang: string;
  docTitle: string;
  appName: string;
  langName: string;

  // Top HUD & Navigation
  changeLanguage: string;
  scrollToTopAria: string;
  navPortfolio: string;
  navSpecialities: string;
  navTeam: string;
  navContact: string;

  // Hero Section
  heroKicker: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  heroInteractionHint: string;
  heroDataSource: string;
  showMore: string;
  showMoreAria: string;

  // Live Hero Telemetry
  telemetryLatLon: string;
  telemetryVelocity: string;
  telemetryVorticity: string;
  telemetryAnomaly: string;
  telemetryRegime: string;
  telemetryParticles: string;
  thermalScaleCold: string;
  thermalScaleWarm: string;
  velocityScaleSlow: string;
  velocityScaleFast: string;
  regimeLaminar: string;
  regimeTransition: string;
  regimeRollup: string;
  regimeVortex: string;
  regimeMeander: string;
  regimeColdCoreRing: string;
  regimeWarmCoreRing: string;
  regimeWakeEddy: string;
  regimeRossbyWave: string;
  regimeTradeWinds: string;
  regimeWesterlies: string;
  regimePolarVortex: string;
  regimeDoldrums: string;
  regimeJetStream: string;
  telemetryLiveWind: string;
  telemetryUpdatedDaily: string;
  canvasLabelGulfStream: string;
  canvasLabelMeanderPinch: string;
  canvasLabelColdCoreRing: string;
  canvasLabelWakeReverse: string;
  canvasStageLaminar: string;
  canvasStageTransition: string;
  canvasStageRollup: string;
  canvasStageVortex: string;

  // Portfolio Section
  portfolioKicker: string;
  portfolioTitle: string;
  portfolioLead: string;
  launchApp: string;
  projects: ProjectEntry[];

  // Specialities Section
  specialitiesKicker: string;
  specialitiesTitle: string;
  specialitiesLead: string;
  disciplines: DisciplineEntry[];

  // Team Section
  teamKicker: string;
  teamTitle: string;
  teamLead: string;
  founders: FounderEntry[];

  // Contact / Terminal Section
  contactKicker: string;
  contactTitle: string;
  contactLead: string;
  contactTypeDemo: string;
  contactTypeCall: string;
  contactTypeMessage: string;
  fieldName: string;
  fieldNamePlaceholder: string;
  fieldOrg: string;
  fieldOrgPlaceholder: string;
  fieldEmail: string;
  fieldEmailPlaceholder: string;
  fieldBrief: string;
  fieldBriefPlaceholder: string;
  contactPlaceholderBadge: string;
  contactPlaceholderNotice: string;
  contactTransmitBtn: string;
  contactCopiedFeedback: string;
  contactDirectMailNotice: string;
  contactGdprNotice: string;

  // Footer
  footerRights: string;
  footerTagline: string;
}
