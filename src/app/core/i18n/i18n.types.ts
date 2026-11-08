export type Lang = 'en' | 'pl';

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectMetadata {
  id: string;
  url: string;
  poster: string;
  media: string;
  repoUrl?: string;
  secondaryUrl?: string;
  isExternal?: boolean;
  previewDurationMs?: number;
}

export interface ProjectCopy {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  metrics: ProjectMetric[];
  tags: string[];
  secondaryLabel?: string;
}

export interface ProjectEntry extends ProjectMetadata, ProjectCopy {}

export interface DisciplineEntry {
  id: string;
  title: string;
  lead: string;
  points: string[];
  tools: string[];
}

export interface TeamRef {
  label: string;
  href: string;
  title: string;
  aria: string;
}

export interface FounderEntry {
  name: string;
  role?: string;
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
  menuOpenAria: string;
  menuCloseAria: string;

  // Hero Section
  heroKicker: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  heroInteractionHint: string;
  heroDataSource: string;
  telemetryLiveBadge: string;
  telemetrySourceLabel: string;
  telemetrySourceShort: string;
  telemetrySourceUrl: string;
  telemetrySourceTitle: string;
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
  viewRepository: string;
  portfolioPrevAria: string;
  portfolioNextAria: string;
  portfolioSelectAria: string;
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
  teamLeads: string[];
  teamRefs: TeamRef[];
  teamRefsLabel: string;
  teamFocusLabel: string;
  teamPrevAria: string;
  teamNextAria: string;
  teamSelectAria: string;
  carouselSlideAria: string;
  founders: FounderEntry[];

  // Contact Section
  contactKicker: string;
  contactTitle: string;
  contactLead: string;
  contactSubmitBtn: string;
  contactClientNote: string;
  contactMailSubject: string;
  contactMailBody: string;
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
