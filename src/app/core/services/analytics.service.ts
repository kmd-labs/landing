import { Injectable, NgZone, inject } from '@angular/core';

/** Only these hostnames are counted (keeps localhost and preview deployments out of the stats). */
const ALLOWED_HOSTS: readonly string[] = ['kmd-labs.org', 'www.kmd-labs.org'];

/** GoatCounter dashboard: https://astroleh.goatcounter.com */
const GOATCOUNTER_ENDPOINT = 'https://astroleh.goatcounter.com/count';
const GOATCOUNTER_SRC = 'https://gc.zgo.at/count.js';

/** Umami Cloud website (data is sent to https://gateway.umami.is). */
const UMAMI_WEBSITE_ID = '7d28d984-4ec2-439e-a762-9d006588757b';
const UMAMI_SRC = 'https://cloud.umami.is/script.js';

interface GoatCounter {
  count?: (vars: { path: string; title?: string; event?: boolean }) => void;
}

interface Umami {
  track?: (event: string, data?: Record<string, string>) => void;
}

declare global {
  interface Window {
    goatcounter?: GoatCounter;
    umami?: Umami;
  }
}

/** One analytics backend: how to send an event once its script is ready. */
interface Provider {
  ready: () => boolean;
  send: (event: string) => void;
  queue: string[];
}

/**
 * Cookieless page-view and event analytics, sent to both GoatCounter and Umami.
 *
 * Events are named `<event>` or `<event>/<value>` (e.g. `project-launch/el-nino`):
 * - GoatCounter receives the full string as the event path.
 * - Umami receives `<event>` as the event name and `{ value: '<value>' }` as event data.
 *
 * - Page views are counted automatically by each script once it loads.
 * - Clicks on any element with `data-track="<event>"` (or inside one) are counted
 *   through a single delegated listener. Clicks whose default action was prevented
 *   (e.g. a carousel drag) are ignored.
 * - `track(event)` / `trackOnce(event)` count programmatic events.
 *
 * Every call is a silent no-op during SSR, on non-production hosts, or when a
 * script is blocked, so analytics can never break the UI.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly zone = inject(NgZone);
  private readonly enabled =
    typeof window !== 'undefined' && ALLOWED_HOSTS.includes(window.location.hostname);
  private readonly once = new Set<string>();

  private readonly providers: Provider[] = [
    {
      ready: () => typeof window.goatcounter?.count === 'function',
      send: (event) => window.goatcounter!.count!({ path: event, title: event, event: true }),
      queue: []
    },
    {
      ready: () => typeof window.umami?.track === 'function',
      send: (event) => {
        const slash = event.indexOf('/');
        if (slash === -1) {
          window.umami!.track!(event);
        } else {
          window.umami!.track!(event.slice(0, slash), { value: event.slice(slash + 1) });
        }
      },
      queue: []
    }
  ];

  constructor() {
    if (!this.enabled) return;

    this.zone.runOutsideAngular(() => {
      this.loadScript(GOATCOUNTER_SRC, { goatcounter: GOATCOUNTER_ENDPOINT }, this.providers[0]);
      this.loadScript(UMAMI_SRC, { websiteId: UMAMI_WEBSITE_ID }, this.providers[1]);
      document.addEventListener('click', this.onDocumentClick);
    });
  }

  /** Counts a custom event, e.g. `project-launch/el-nino`. */
  track(event: string): void {
    if (!this.enabled) return;
    for (const provider of this.providers) {
      if (provider.ready()) {
        this.safeSend(provider, event);
      } else {
        provider.queue.push(event);
      }
    }
  }

  /** Counts an event at most once per page view. */
  trackOnce(event: string): void {
    if (this.once.has(event)) return;
    this.once.add(event);
    this.track(event);
  }

  private loadScript(src: string, dataset: Record<string, string>, provider: Provider): void {
    const script = document.createElement('script');
    script.async = true;
    script.src = src;
    Object.assign(script.dataset, dataset);
    script.addEventListener('load', () => {
      if (!provider.ready()) return;
      for (const event of provider.queue.splice(0)) {
        this.safeSend(provider, event);
      }
    });
    document.head.appendChild(script);
  }

  private safeSend(provider: Provider, event: string): void {
    try {
      provider.send(event);
    } catch {
      /* analytics must never throw into the app */
    }
  }

  private readonly onDocumentClick = (e: MouseEvent): void => {
    if (e.defaultPrevented) return;
    const el = (e.target as Element | null)?.closest?.('[data-track]');
    const event = el?.getAttribute('data-track');
    if (event) this.track(event);
  };
}
