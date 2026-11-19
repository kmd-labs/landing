import {
  AfterViewInit,
  ApplicationRef,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  QueryList,
  ViewChildren,
  computed,
  effect,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  Globe,
  Compass,
  Layers,
  Users,
  ExternalLink,
  ChevronDown,
  ArrowUpRight,
  Cpu,
  Waves,
  Database,
  Mail,
  Send,
  Menu,
  X,
  Github,
  Sun,
  Moon
} from 'lucide-angular';
import {
  ButtonComponent,
  BadgeComponent,
  DropdownComponent,
  DropdownOption,
  SplashComponent,
  SplashService,
  BreakpointService,
  CarouselComponent,
  CarouselPill,
  ThemeMode,
  ThemeService,
  getContactMailtoUrl
} from '@kmd/design-system';
import { I18nService } from './core/i18n/i18n.service';
import { Lang } from './core/i18n/i18n.types';
import { CurrentWeatherService } from './core/services/current-weather.service';
import { AnalyticsService } from './core/services/analytics.service';
import { StorageService } from './core/services/storage.service';
import { LocaleDatePipe } from './core/pipes/locale-date.pipe';
import {
  TelemetryData,
  VortexCanvasComponent
} from './components/vortex-canvas/vortex-canvas.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    ButtonComponent,
    BadgeComponent,
    DropdownComponent,
    SplashComponent,
    VortexCanvasComponent,
    CarouselComponent,
    LocaleDatePipe
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit, OnDestroy {
  readonly i18n = inject(I18nService);
  readonly bp = inject(BreakpointService);
  readonly splash = inject(SplashService);
  readonly theme = inject(ThemeService);
  readonly weather = inject(CurrentWeatherService);
  private readonly storage = inject(StorageService);
  private readonly analytics = inject(AnalyticsService);
  private readonly appRef = inject(ApplicationRef);
  private readonly zone = inject(NgZone);
  private readonly splashRevealed = signal(false);
  private readonly themeStorageKey = 'landing.theme';
  private themeFallbackTimer?: ReturnType<typeof setTimeout>;

  // Portfolio interactive screengrab / GIF preview state
  readonly activeProjectIds = signal(new Set<string>());
  readonly startedProjectIds = signal(new Set<string>());
  readonly loadedProjectIds = signal(new Set<string>());
  private readonly minLoadingMs = 500;
  private readonly startedAt = new Map<string, number>();
  private readonly mobileGifTimers = new Map<string, ReturnType<typeof setTimeout>>();

  @ViewChildren('projectMediaEl', { read: ElementRef })
  private projectMediaEls?: QueryList<ElementRef<HTMLElement>>;

  private observer?: IntersectionObserver;
  private sectionObserver?: IntersectionObserver;

  /** Hover/focus must last this long before a project preview counts as genuine interest. */
  private readonly previewDwellMs = 800;
  private readonly previewTimers = new Map<string, ReturnType<typeof setTimeout>>();

  readonly navOptions = computed<DropdownOption<string>[]>(() => {
    const t = this.i18n.t();
    return [
      { value: 'portfolio', label: t.navPortfolio },
      { value: 'specialities', label: t.navSpecialities },
      { value: 'team', label: t.navTeam },
      { value: 'contact', label: t.navContact, cta: true, variant: 'cta' }
    ];
  });

  readonly teamCarouselPills = computed<CarouselPill[]>(() => {
    const t = this.i18n.t();
    return t.founders.map((p) => ({
      id: p.name,
      label: p.name,
      avatar: p.photo,
      ariaLabel: `${t.teamSelectAria}: ${p.name}`
    }));
  });

  readonly projectCarouselPills = computed<CarouselPill[]>(() => {
    const t = this.i18n.t();
    return t.projects.map((p) => ({
      id: p.id,
      label: p.shortTitle || p.title,
      ariaLabel: `${p.shortTitle || p.title} — ${t.portfolioSelectAria}: ${p.title}`
    }));
  });

  constructor() {
    this.initTheme();

    effect(() => {
      const revealed = this.splashRevealed();
      const status = this.weather.status();
      // Ensure splash only fades out once BOTH brand animation finishes AND data/canvas is fully ready
      if (revealed && (status === 'ready' || status === 'error')) {
        this.splash.finish();
      }
    });

    if (typeof window !== 'undefined') {
      // Ensure reveal state unlocks if CSS animationend event is dropped in headless/slow environments
      setTimeout(() => {
        this.splashRevealed.set(true);
      }, 950);

      setTimeout(() => {
        if (this.splash.visible()) {
          this.splash.finish();
        }
      }, 1500);
    }
  }

  onSplashRevealed() {
    this.splashRevealed.set(true);
  }

  onNavSelect(id: string) {
    this.analytics.track(`nav/${id}`);
    this.scrollToSection(id);
  }

  onLangChange(lang: Lang) {
    if (lang !== this.i18n.lang()) {
      this.analytics.track(`lang/${lang}`);
    }
    this.i18n.setLang(lang);
  }

  private initTheme(): void {
    const saved = this.storage.getItem(this.themeStorageKey);
    if (saved === 'dark' || saved === 'light') {
      this.theme.setMode(saved);
      return;
    }
    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    this.theme.setMode(prefersDark ? 'dark' : 'light');
  }

  toggleTheme(event?: MouseEvent): void {
    const next: ThemeMode = this.theme.isDark() ? 'light' : 'dark';
    const applyTheme = () => {
      this.theme.setMode(next);
      this.storage.setItem(this.themeStorageKey, next);
      this.analytics.track(`theme/${next}`);
    };

    if (typeof document === 'undefined' || typeof window === 'undefined' || this.isReducedMotion()) {
      applyTheme();
      return;
    }

    const doc = document as Document & {
      startViewTransition?: (cb: () => void | Promise<void>) => { ready: Promise<void> };
    };

    if (typeof doc.startViewTransition === 'function') {
      const target = (event?.currentTarget as HTMLElement | null) ?? (event?.target as HTMLElement | null);
      const rect = target?.getBoundingClientRect();
      const x = rect && rect.width > 0 ? rect.left + rect.width / 2 : (event?.clientX || window.innerWidth / 2);
      const y = rect && rect.height > 0 ? rect.top + rect.height / 2 : (event?.clientY || 32);
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = doc.startViewTransition(async () => {
        applyTheme();
        this.appRef.tick();
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      });

      transition.ready
        .then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`
              ]
            },
            {
              duration: 520,
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
              pseudoElement: '::view-transition-new(root)'
            }
          );
        })
        .catch(() => {
          // Ignore if transition is skipped or aborted
        });
      return;
    }

    // Fallback: smooth CSS property transition
    const root = document.documentElement;
    root.classList.add('theme-transitioning');
    if (this.themeFallbackTimer) {
      clearTimeout(this.themeFallbackTimer);
    }
    applyTheme();
    this.themeFallbackTimer = setTimeout(() => {
      root.classList.remove('theme-transitioning');
      this.themeFallbackTimer = undefined;
    }, 380);
  }

  readonly vectorDates = computed<[Date, Date]>(() => {
    const meta = this.weather.meta();
    const end = meta?.time ? new Date(meta.time) : new Date();
    const start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
    return [start, end];
  });

  // Lucide Icons
  readonly globeIcon = Globe;
  readonly compassIcon = Compass;
  readonly layersIcon = Layers;
  readonly usersIcon = Users;
  readonly externalLinkIcon = ExternalLink;
  readonly chevronDownIcon = ChevronDown;
  readonly arrowUpRightIcon = ArrowUpRight;
  readonly cpuIcon = Cpu;
  readonly wavesIcon = Waves;
  readonly databaseIcon = Database;
  readonly mailIcon = Mail;
  readonly sendIcon = Send;
  readonly menuIcon = Menu;
  readonly xIcon = X;
  readonly githubIcon = Github;
  readonly sunIcon = Sun;
  readonly moonIcon = Moon;

  // Contact Mailto URL (Prefilled with localized general inquiry)
  readonly mailtoUrl = computed(() => getContactMailtoUrl(this.i18n.lang()));

  onSpecialitiesMouseMove(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    target.style.setProperty('--mouse-x', `${x}px`);
    target.style.setProperty('--mouse-y', `${y}px`);
    target.style.setProperty('--grid-opacity', '1');
  }

  onSpecialitiesMouseLeave(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    if (!target) return;
    target.style.setProperty('--grid-opacity', '0');
  }

  // Live telemetry state from Vortex Canvas
  readonly telemetry = signal<TelemetryData>({
    latLon: '39.00°N, 71.00°W (Cyclone Eye Center)',
    velocity: '2.8 m/s (5.4 kn) · Eyewall Peak',
    vorticity: '+2.8 × 10⁻⁴ s⁻¹ (Concentric Swirl)',
    regimeKey: 'regimeVortex'
  });

  /**
   * Evaluates the current four-digit calendar year dynamically.
   */
  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  get currentYear(): number {
    return this.getCurrentYear();
  }

  readonly langOptions = computed<DropdownOption<Lang>[]>(() =>
    this.i18n.langs.map(l => ({
      value: l,
      label: this.i18n.dicts[l].langName,
      shortLabel: l.toUpperCase(),
      badge: l.toUpperCase()
    }))
  );

  onTelemetryUpdate(data: TelemetryData) {
    this.telemetry.set(data);
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    this.initPortfolioObserver();
    this.initSectionViewTracking();
  }

  ngOnDestroy(): void {
    if (this.themeFallbackTimer) {
      clearTimeout(this.themeFallbackTimer);
      this.themeFallbackTimer = undefined;
    }
    this.observer?.disconnect();
    this.sectionObserver?.disconnect();
    for (const timer of this.previewTimers.values()) {
      clearTimeout(timer);
    }
    this.previewTimers.clear();
    for (const timer of this.mobileGifTimers.values()) {
      clearTimeout(timer);
    }
    this.mobileGifTimers.clear();
  }

  private readonly activePortfolioSlideIndex = signal(0);

  private initPortfolioObserver(): void {
    if (typeof window === 'undefined') return;
    if (!('IntersectionObserver' in window)) return;

    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          if (!this.canActivateOnScroll()) return;
          this.zone.run(() => {
            for (const entry of entries) {
              const id = entry.target.getAttribute('data-project-id');
              if (id) {
                if (entry.isIntersecting) {
                  this.activateProject(id);
                } else {
                  this.deactivateProject(id);
                }
              } else if (entry.target.id === 'portfolio') {
                if (entry.isIntersecting) {
                  const projects = this.i18n.t().projects;
                  const idx = this.activePortfolioSlideIndex();
                  if (projects && projects[idx]) {
                    this.activateProject(projects[idx].id);
                  }
                }
              }
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px' }
      );

      const portfolioSection = document.getElementById('portfolio');
      if (portfolioSection) {
        this.observer.observe(portfolioSection);
      }
      this.projectMediaEls?.forEach((ref) => this.observer!.observe(ref.nativeElement));
      this.projectMediaEls?.changes.subscribe((ql: QueryList<ElementRef<HTMLElement>>) => {
        this.observer?.disconnect();
        const pSec = document.getElementById('portfolio');
        if (pSec) this.observer!.observe(pSec);
        ql.forEach((ref) => this.observer!.observe(ref.nativeElement));
      });
    });
  }

  private canActivateOnScroll(): boolean {
    if (typeof window === 'undefined') return false;
    if (this.isReducedMotion()) return false;
    // Desktop viewports and hover-capable environments must NEVER activate on scroll (only hover).
    if (window.matchMedia('(hover: hover)').matches) return false;
    if (!this.bp.tablet()) return false;
    return true;
  }

  onPortfolioCarouselActiveChange(realIndex: number): void {
    this.activePortfolioSlideIndex.set(realIndex);
    const projects = this.i18n.t().projects;
    if (!projects || !projects[realIndex]) return;
    const active = projects[realIndex];

    for (const p of projects) {
      if (p.id !== active.id) {
        this.deactivateProject(p.id);
      }
    }

    this.activateProject(active.id);
  }

  onProjectPointerEnter(id: string, event: PointerEvent): void {
    if (event.pointerType === 'touch') return;
    this.activateProject(id);
    this.schedulePreviewTracking(id);
  }

  onProjectPointerLeave(id: string, event: PointerEvent): void {
    if (event.pointerType === 'touch') return;
    this.deactivateProject(id);
    this.cancelPreviewTracking(id);
  }

  onProjectFocus(id: string): void {
    this.activateProject(id);
    this.schedulePreviewTracking(id);
  }

  onProjectBlur(id: string): void {
    this.deactivateProject(id);
    this.cancelPreviewTracking(id);
  }

  /** Counts `project-preview/<id>` once per page view, only after a deliberate hover/focus dwell. */
  private schedulePreviewTracking(id: string): void {
    this.cancelPreviewTracking(id);
    this.previewTimers.set(
      id,
      setTimeout(() => {
        this.previewTimers.delete(id);
        this.analytics.trackOnce(`project-preview/${id}`);
      }, this.previewDwellMs)
    );
  }

  private cancelPreviewTracking(id: string): void {
    const timer = this.previewTimers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.previewTimers.delete(id);
    }
  }

  /**
   * Counts `section-view/<id>` the first time each section's top crosses the middle of the
   * viewport. Works as a scroll-depth funnel regardless of section height.
   */
  private initSectionViewTracking(): void {
    if (!('IntersectionObserver' in window)) return;
    const ids = ['portfolio', 'specialities', 'team', 'contact'];

    this.zone.runOutsideAngular(() => {
      this.sectionObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            this.analytics.trackOnce(`section-view/${entry.target.id}`);
            this.sectionObserver?.unobserve(entry.target);
          }
        },
        { threshold: 0, rootMargin: '0px 0px -50% 0px' }
      );

      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) this.sectionObserver.observe(el);
      }
    });
  }

  activateProject(id: string): void {
    if (this.isReducedMotion()) return;
    if (this.activeProjectIds().has(id)) return;
    this.activeProjectIds.set(new Set(this.activeProjectIds()).add(id));
    if (!this.startedProjectIds().has(id)) {
      this.startedProjectIds.set(new Set(this.startedProjectIds()).add(id));
      this.startedAt.set(id, performance.now());
    } else if (this.isProjectReady(id)) {
      this.scheduleMobileOneShotPlay(id);
    }
  }

  deactivateProject(id: string): void {
    this.clearMobileGifTimer(id);
    if (!this.activeProjectIds().has(id)) return;
    const next = new Set(this.activeProjectIds());
    next.delete(id);
    this.activeProjectIds.set(next);
  }

  onProjectGifLoaded(id: string): void {
    if (this.loadedProjectIds().has(id)) {
      this.scheduleMobileOneShotPlay(id);
      return;
    }
    const started = this.startedAt.get(id);
    const elapsed = started != null ? performance.now() - started : Infinity;
    const wait = Math.max(0, this.minLoadingMs - elapsed);
    const markReady = () => {
      this.zone.run(() => {
        if (!this.loadedProjectIds().has(id)) {
          this.loadedProjectIds.set(new Set(this.loadedProjectIds()).add(id));
        }
        this.scheduleMobileOneShotPlay(id);
      });
    };
    if (wait === 0) {
      markReady();
    } else {
      setTimeout(markReady, wait);
    }
  }

  private scheduleMobileOneShotPlay(id: string): void {
    if (typeof window === 'undefined') return;
    // On desktop, user leaves hover alone; on mobile/touch, play once to avoid reader distraction
    if (!this.isMobileOrTouch()) return;

    this.clearMobileGifTimer(id);
    const duration = this.getProjectPreviewDuration(id);
    const timer = setTimeout(() => {
      this.zone.run(() => {
        this.deactivateProject(id);
      });
    }, duration);
    this.mobileGifTimers.set(id, timer);
  }

  private isMobileOrTouch(): boolean {
    if (typeof window === 'undefined') return false;
    if (this.bp.mobile()) return true;
    return !window.matchMedia('(hover: hover)').matches;
  }

  private getProjectPreviewDuration(id: string): number {
    const proj = this.i18n.t().projects.find((p) => p.id === id);
    return proj?.previewDurationMs ?? 3600;
  }

  private clearMobileGifTimer(id: string): void {
    const timer = this.mobileGifTimers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.mobileGifTimers.delete(id);
    }
  }

  isProjectActive(id: string): boolean {
    return this.activeProjectIds().has(id);
  }

  isProjectReady(id: string): boolean {
    return this.loadedProjectIds().has(id);
  }

  hasProjectStarted(id: string): boolean {
    return this.startedProjectIds().has(id);
  }

  private isReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  scrollToSection(id: string) {
    if (typeof document === 'undefined') return;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  scrollToTop() {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
