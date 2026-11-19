import { ApplicationRef, Injectable, NgZone, computed, effect, inject, signal } from '@angular/core';
import { ThemeMode, ThemeService } from '@kmd/design-system';
import { StorageService } from './storage.service';

export type ThemePref = 'auto' | 'light' | 'dark';

const THEME_KEY = 'landing.theme';
export const DEFAULT_THEME_PREF: ThemePref = 'auto';

/**
 * Manages user appearance preference (`auto` | `light` | `dark`) persisted in `localStorage`,
 * synchronizes the resolved mode onto `ThemeService`, and animates theme transitions.
 */
@Injectable({ providedIn: 'root' })
export class ThemePrefService {
  private readonly theme = inject(ThemeService);
  private readonly storage = inject(StorageService);
  private readonly appRef = inject(ApplicationRef);
  private readonly ngZone = inject(NgZone);

  readonly pref = signal<ThemePref>(this.resolveInitial());
  private readonly systemDark = signal(false);
  private fallbackTimer?: ReturnType<typeof setTimeout>;

  readonly resolved = computed<ThemeMode>(() =>
    this.pref() === 'auto' ? (this.systemDark() ? 'dark' : 'light') : (this.pref() as ThemeMode)
  );

  constructor() {
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      this.systemDark.set(mql.matches);
      mql.addEventListener('change', (event) =>
        this.ngZone.run(() => this.systemDark.set(event.matches))
      );
    }

    effect(() => {
      this.theme.setMode(this.resolved());
    });
  }

  setPref(pref: ThemePref, event?: MouseEvent): void {
    const prevMode = this.resolved();
    const nextMode: ThemeMode =
      pref === 'auto' ? (this.systemDark() ? 'dark' : 'light') : (pref as ThemeMode);

    const apply = () => {
      this.pref.set(pref);
      this.storage.setItem(THEME_KEY, pref);
    };

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (
      prevMode === nextMode ||
      reducedMotion ||
      typeof document === 'undefined' ||
      typeof window === 'undefined'
    ) {
      apply();
      return;
    }

    const doc = document as Document & {
      startViewTransition?: (cb: () => void | Promise<void>) => { ready: Promise<void> };
    };

    if (typeof doc.startViewTransition === 'function') {
      const target =
        (event?.currentTarget as HTMLElement | null) ?? (event?.target as HTMLElement | null);
      const rect = target?.getBoundingClientRect();
      const x =
        rect && rect.width > 0
          ? rect.left + rect.width / 2
          : event?.clientX || window.innerWidth / 2;
      const y =
        rect && rect.height > 0
          ? rect.top + rect.height / 2
          : event?.clientY || window.innerHeight / 2;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = doc.startViewTransition(() => {
        document.documentElement.classList.add('theme-vt');
        apply();
        this.theme.setMode(nextMode);
        this.appRef.tick();
      });

      const vt = transition as { ready: Promise<void>; finished?: Promise<void> };
      vt.finished?.finally(() => {
        document.documentElement.classList.remove('theme-vt');
      });

      vt.ready
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
          document.documentElement.classList.remove('theme-vt');
        });
      return;
    }

    // Fallback smooth CSS transition
    const root = document.documentElement;
    root.classList.add('theme-transitioning');
    if (this.fallbackTimer) {
      clearTimeout(this.fallbackTimer);
    }
    apply();
    this.fallbackTimer = setTimeout(() => {
      root.classList.remove('theme-transitioning');
      this.fallbackTimer = undefined;
    }, 380);
  }

  private resolveInitial(): ThemePref {
    const stored = this.storage.getItem(THEME_KEY);
    if (stored === 'auto' || stored === 'light' || stored === 'dark') {
      return stored;
    }
    return DEFAULT_THEME_PREF;
  }
}
