import { Component, computed, effect, inject, signal } from '@angular/core';
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
  X
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
import { Lang } from './core/i18n/i18n.types';
import { CurrentWeatherService } from './core/services/current-weather.service';
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
    LocaleDatePipe
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly i18n = inject(I18nService);
  readonly bp = inject(BreakpointService);
  readonly splash = inject(SplashService);
  readonly weather = inject(CurrentWeatherService);
  private readonly splashRevealed = signal(false);

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
  readonly arrowUpRightIcon = ArrowUpRight;
  readonly cpuIcon = Cpu;
  readonly wavesIcon = Waves;
  readonly databaseIcon = Database;
  readonly mailIcon = Mail;
  readonly sendIcon = Send;
  readonly menuIcon = Menu;
  readonly xIcon = X;

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
