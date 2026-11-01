import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localeDate',
  standalone: true
})
export class LocaleDatePipe implements PipeTransform {
  transform(
    value: Date | string | number | [Date | string | number, Date | string | number] | null | undefined,
    lang: string = 'en',
    format: 'range' | 'short' | 'medium' | 'long' = 'medium'
  ): string {
    if (!value) return '';

    const locale = lang === 'pl' ? 'pl-PL' : 'en-US';

    if (Array.isArray(value)) {
      const [startVal, endVal] = value;
      const start = startVal instanceof Date ? startVal : new Date(startVal);
      const end = endVal instanceof Date ? endVal : new Date(endVal);

      try {
        const dtf = new Intl.DateTimeFormat(locale, {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
        const formatted = dtf.formatRange(start, end);
        // Ensure standard space before and after the range dash
        return formatted.replace(/[\s\u2000-\u200F\u202F]*[–—-][\s\u2000-\u200F\u202F]*/g, ' – ');
      } catch {
        return `${start.toLocaleDateString(locale)} – ${end.toLocaleDateString(locale)}`;
      }
    }

    const d = value instanceof Date ? value : new Date(value);
    try {
      const options: Intl.DateTimeFormatOptions =
        format === 'short'
          ? { day: 'numeric', month: 'numeric', year: 'numeric' }
          : format === 'long'
          ? { day: 'numeric', month: 'long', year: 'numeric' }
          : { day: 'numeric', month: 'short', year: 'numeric' };

      return new Intl.DateTimeFormat(locale, options).format(d);
    } catch {
      return d.toLocaleDateString(locale);
    }
  }
}
