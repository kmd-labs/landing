import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Monitor, Sun, Moon } from 'lucide-angular';
import { PopupService } from '@kmd/design-system';
import { I18nService } from '../../core/i18n/i18n.service';
import { Lang } from '../../core/i18n/i18n.types';
import { AnalyticsService } from '../../core/services/analytics.service';
import { ThemePref, ThemePrefService } from '../../core/services/theme-pref.service';

@Component({
  selector: 'app-settings-popup',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './settings-popup.component.html',
  styleUrl: './settings-popup.component.scss'
})
export class SettingsPopupComponent {
  readonly i18n = inject(I18nService);
  readonly themePref = inject(ThemePrefService);
  private readonly analytics = inject(AnalyticsService);

  readonly themes = computed<{ id: ThemePref; icon: typeof Monitor; label: string }[]>(() => {
    const t = this.i18n.t();
    return [
      { id: 'auto', icon: Monitor, label: t.themeAuto },
      { id: 'light', icon: Sun, label: t.themeLight },
      { id: 'dark', icon: Moon, label: t.themeDark }
    ];
  });

  readonly languages = computed<{ id: Lang; label: string }[]>(() =>
    this.i18n.langs.map((id) => ({ id, label: this.i18n.dicts[id].langName }))
  );

  selectTheme(pref: ThemePref, event: MouseEvent): void {
    if (pref !== this.themePref.pref()) {
      this.analytics.track(`theme/${pref}`);
    }
    this.themePref.setPref(pref, event);
  }

  selectLang(lang: Lang): void {
    if (lang !== this.i18n.lang()) {
      this.analytics.track(`lang/${lang}`);
    }
    this.i18n.setLang(lang);
  }
}

/** Open the Settings popup modal matching kmd-labs/nasa-wildfires-model. */
export function openSettingsPopup(popup: PopupService, i18n: I18nService): void {
  popup.open({
    id: 'settings',
    title: computed(() => i18n.t().settingsTitle),
    component: SettingsPopupComponent,
    size: 'sm',
    actions: [{ label: computed(() => i18n.t().close), variant: 'default' }]
  });
}
