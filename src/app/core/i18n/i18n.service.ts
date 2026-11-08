import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Dict, Lang } from './i18n.types';
import { EN } from './en';
import { PL } from './pl';
import { StorageService } from '../services/storage.service';

const DICTS: Record<Lang, Dict> = { en: EN, pl: PL };
const STORAGE_KEY = 'landing.lang';

/**
 * Manages UI language and localized texts.
 * Resolves initial language from StorageService ('landing.lang') or Navigator API,
 * falling back to 'en', and persists selection via standardized storage.
 */
@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly storage = inject(StorageService);
  readonly dicts = DICTS;
  readonly langs: Lang[] = ['en', 'pl'];
  readonly lang = signal<Lang>(this.resolveInitialLang());
  readonly t = computed(() => DICTS[this.lang()]);

  constructor() {
    effect(() => {
      const currentLang = this.lang();
      const d = this.t();
      if (typeof document !== 'undefined') {
        document.documentElement.lang = d.htmlLang;
        document.title = d.docTitle;
      }
      this.persistLang(currentLang);
    });
  }

  setLang(lang: Lang) {
    this.lang.set(lang);
  }

  private resolveInitialLang(): Lang {
    const stored = this.storage.getItem(STORAGE_KEY);
    if (this.isSupportedLang(stored)) {
      return stored;
    }

    if (typeof navigator !== 'undefined') {
      const candidates = [
        ...(Array.isArray(navigator.languages) ? navigator.languages : []),
        navigator.language
      ].filter(Boolean);

      for (const candidate of candidates) {
        const prefix = candidate.slice(0, 2).toLowerCase();
        if (this.isSupportedLang(prefix)) {
          return prefix;
        }
      }
    }

    return 'en';
  }

  private isSupportedLang(val: string | null | undefined): val is Lang {
    return val === 'en' || val === 'pl';
  }

  private persistLang(lang: Lang) {
    this.storage.setItem(STORAGE_KEY, lang);
  }
}
