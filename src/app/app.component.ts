import {
  AfterViewInit,
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
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Cpu,
  Waves,
  Database,
  Mail,
  Send,
  Menu,
  X,
  Github
} from 'lucide-angular';
import {
  ButtonComponent,
  BadgeComponent,
  DropdownComponent,
  DropdownOption,
  SplashComponent,
  SplashService,
  BreakpointService,
  getContactMailtoUrl
} from '@kmd/design-system';
import { I18nService } from './core/i18n/i18n.service';
import { FounderEntry, Lang } from './core/i18n/i18n.types';
import { CurrentWeatherService } from './core/services/current-weather.service';
import { LocaleDatePipe } from './core/pipes/locale-date.pipe';
import {
  TelemetryData,
  VortexCanvasComponent
} from './components/vortex-canvas/vortex-canvas.component';

export interface TeamSlide {
  slideId: string;
  realIndex: number;
  person: FounderEntry;
  isClone: boolean;
}

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
    LocaleDatePipe
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit, OnDestroy {
  readonly i18n = inject(I18nService);
  readonly bp = inject(BreakpointService);
  readonly splash = inject(SplashService);
  readonly weather = inject(CurrentWeatherService);
  private readonly zone = inject(NgZone);
  private readonly splashRevealed = signal(false);

  // Portfolio interactive screengrab / GIF preview state
  readonly activeProjectIds = signal(new Set<string>());
  readonly startedProjectIds = signal(new Set<string>());
  readonly loadedProjectIds = signal(new Set<string>());
  private readonly minLoadingMs = 500;
  private readonly startedAt = new Map<string, number>();

  @ViewChildren('projectMediaEl', { read: ElementRef })
  private projectMediaEls?: QueryList<ElementRef<HTMLElement>>;

  private observer?: IntersectionObserver;

  readonly navOptions = computed<DropdownOption<string>[]>(() => {
    const t = this.i18n.t();
    return [
      { value: 'portfolio', label: t.navPortfolio },
      { value: 'specialities', label: t.navSpecialities },
      { value: 'team', label: t.navTeam },
      { value: 'contact', label: t.navContact, cta: true, variant: 'cta' }
    ];
  });

  constructor() {
    effect(() => {
      const revealed = this.splashRevealed();
      const status = this.weather.status();
      // Ensure splash only fades out once BOTH brand animation finishes AND data/canvas is fully ready
      if (revealed && (status === 'ready' || status === 'error')) {
        this.splash.finish();
      }
    });

    if (typeof window !== 'undefined') {
      setTimeout(() => {
        if (this.splash.visible()) {
          this.splash.finish();
        }
      }, 5000);
    }
  }

  onSplashRevealed() {
    this.splashRevealed.set(true);
  }

  onNavSelect(id: string) {
    this.scrollToSection(id);
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
  readonly chevronLeftIcon = ChevronLeft;
  readonly chevronRightIcon = ChevronRight;
  readonly arrowUpRightIcon = ArrowUpRight;
  readonly cpuIcon = Cpu;
  readonly wavesIcon = Waves;
  readonly databaseIcon = Database;
  readonly mailIcon = Mail;
  readonly sendIcon = Send;
  readonly menuIcon = Menu;
  readonly xIcon = X;
  readonly githubIcon = Github;

  // Team Infinite Horizontal Carousel (Mobile / Tablet)
  readonly teamTrackIndex = signal(1);
  readonly teamTransitionEnabled = signal(true);
  readonly teamPaused = signal(false);
  readonly teamDragOffsetPx = signal(0);
  readonly isDraggingTeam = signal(false);
  private teamAutoTimer?: ReturnType<typeof setInterval>;
  private teamPointerStartX = 0;
  private teamPointerStartY = 0;
  private teamIsHorizontalDrag = false;

  readonly activeRealTeamIndex = computed(() => {
    const founders = this.i18n.t().founders;
    const count = founders?.length || 3;
    const trackIdx = this.teamTrackIndex();
    return ((trackIdx - 1) % count + count) % count;
  });

  readonly teamSlides = computed<TeamSlide[]>(() => {
    const founders = this.i18n.t().founders;
    if (!founders || founders.length === 0) return [];
    const count = founders.length;
    const last = founders[count - 1];
    const first = founders[0];
    return [
      {
        slideId: `clone-last-${last.name}`,
        realIndex: count - 1,
        person: last,
        isClone: true
      },
      ...founders.map((p, idx) => ({
        slideId: `real-${idx}-${p.name}`,
        realIndex: idx,
        person: p,
        isClone: false
      })),
      {
        slideId: `clone-first-${first.name}`,
        realIndex: 0,
        person: first,
        isClone: true
      }
    ];
  });

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
    this.startTeamAutoScroll();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.stopTeamAutoScroll();
  }

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
              if (!id) continue;
              if (entry.isIntersecting) {
                this.activateProject(id);
              } else {
                this.deactivateProject(id);
              }
            }
          });
        },
        { threshold: 0.25, rootMargin: '0px' }
      );
      this.projectMediaEls?.forEach((ref) => this.observer!.observe(ref.nativeElement));
      this.projectMediaEls?.changes.subscribe((ql: QueryList<ElementRef<HTMLElement>>) => {
        this.observer?.disconnect();
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

  nextTeammate(): void {
    const count = this.i18n.t().founders?.length || 3;
    if (this.teamTrackIndex() >= count + 1) return;
    this.teamTransitionEnabled.set(true);
    this.teamTrackIndex.update((idx) => idx + 1);
    this.resetTeamAutoTimer();
  }

  prevTeammate(): void {
    if (this.teamTrackIndex() <= 0) return;
    this.teamTransitionEnabled.set(true);
    this.teamTrackIndex.update((idx) => idx - 1);
    this.resetTeamAutoTimer();
  }

  selectTeammate(realIndex: number): void {
    this.teamTransitionEnabled.set(true);
    this.teamTrackIndex.set(realIndex + 1);
    this.resetTeamAutoTimer();
  }

  onTeamTrackTransitionEnd(): void {
    const count = this.i18n.t().founders?.length || 3;
    const current = this.teamTrackIndex();
    if (current >= count + 1) {
      this.teamTransitionEnabled.set(false);
      this.teamTrackIndex.set(1);
      if (typeof window !== 'undefined') {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.teamTransitionEnabled.set(true);
          });
        });
      }
    } else if (current <= 0) {
      this.teamTransitionEnabled.set(false);
      this.teamTrackIndex.set(count);
      if (typeof window !== 'undefined') {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.teamTransitionEnabled.set(true);
          });
        });
      }
    }
  }

  private startTeamAutoScroll(): void {
    if (typeof window === 'undefined') return;
    this.stopTeamAutoScroll();
    this.zone.runOutsideAngular(() => {
      this.teamAutoTimer = setInterval(() => {
        if (this.teamPaused() || this.isDraggingTeam() || this.isReducedMotion()) return;
        if (!this.bp.tablet()) return;
        this.zone.run(() => {
          this.nextTeammate();
        });
      }, 4500);
    });
  }

  private stopTeamAutoScroll(): void {
    if (this.teamAutoTimer) {
      clearInterval(this.teamAutoTimer);
      this.teamAutoTimer = undefined;
    }
  }

  private resetTeamAutoTimer(): void {
    this.startTeamAutoScroll();
  }

  onTeamPointerDown(event: PointerEvent): void {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    this.teamPointerStartX = event.clientX;
    this.teamPointerStartY = event.clientY;
    this.teamIsHorizontalDrag = false;
    this.isDraggingTeam.set(true);
    this.teamPaused.set(true);
  }

  onTeamPointerMove(event: PointerEvent): void {
    if (!this.isDraggingTeam()) return;
    const deltaX = event.clientX - this.teamPointerStartX;
    const deltaY = event.clientY - this.teamPointerStartY;

    if (!this.teamIsHorizontalDrag) {
      if (Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY)) {
        this.teamIsHorizontalDrag = true;
      } else if (Math.abs(deltaY) > 8) {
        this.isDraggingTeam.set(false);
        this.teamDragOffsetPx.set(0);
        return;
      }
    }

    if (this.teamIsHorizontalDrag) {
      this.teamTransitionEnabled.set(false);
      this.teamDragOffsetPx.set(deltaX);
    }
  }

  onTeamPointerUp(event: PointerEvent): void {
    if (!this.isDraggingTeam()) return;
    const deltaX = this.teamDragOffsetPx();
    this.isDraggingTeam.set(false);
    this.teamDragOffsetPx.set(0);
    this.teamTransitionEnabled.set(true);
    this.teamPaused.set(false);

    if (this.teamIsHorizontalDrag) {
      if (deltaX < -35) {
        this.nextTeammate();
      } else if (deltaX > 35) {
        this.prevTeammate();
      }
    }
    this.teamIsHorizontalDrag = false;
  }

  onTeamPointerCancel(): void {
    this.isDraggingTeam.set(false);
    this.teamDragOffsetPx.set(0);
    this.teamTransitionEnabled.set(true);
    this.teamPaused.set(false);
    this.teamIsHorizontalDrag = false;
  }

  setTeamPaused(paused: boolean): void {
    this.teamPaused.set(paused);
  }

  onProjectPointerEnter(id: string, event: PointerEvent): void {
    if (event.pointerType === 'touch') return;
    this.activateProject(id);
  }

  onProjectPointerLeave(id: string, event: PointerEvent): void {
    if (event.pointerType === 'touch') return;
    this.deactivateProject(id);
  }

  activateProject(id: string): void {
    if (this.isReducedMotion()) return;
    if (this.activeProjectIds().has(id)) return;
    this.activeProjectIds.set(new Set(this.activeProjectIds()).add(id));
    if (!this.startedProjectIds().has(id)) {
      this.startedProjectIds.set(new Set(this.startedProjectIds()).add(id));
      this.startedAt.set(id, performance.now());
    }
  }

  deactivateProject(id: string): void {
    if (!this.activeProjectIds().has(id)) return;
    const next = new Set(this.activeProjectIds());
    next.delete(id);
    this.activeProjectIds.set(next);
  }

  onProjectGifLoaded(id: string): void {
    if (this.loadedProjectIds().has(id)) return;
    const started = this.startedAt.get(id);
    const elapsed = started != null ? performance.now() - started : Infinity;
    const wait = Math.max(0, this.minLoadingMs - elapsed);
    const markReady = () => {
      this.zone.run(() => {
        if (this.loadedProjectIds().has(id)) return;
        this.loadedProjectIds.set(new Set(this.loadedProjectIds()).add(id));
      });
    };
    if (wait === 0) {
      markReady();
    } else {
      setTimeout(markReady, wait);
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
