import { useMemo } from 'react';
import { LocaleResolver, UserPreferences, TenantSettings } from '../resolvers/LocaleResolver';
import { CurrencyResolver } from '../resolvers/CurrencyResolver';
import { TimezoneResolver } from '../resolvers/TimezoneResolver';
import { CurrencyFormatter } from '../formatters/CurrencyFormatter';
import { NumberFormatter } from '../formatters/NumberFormatter';
import { PercentageFormatter } from '../formatters/PercentageFormatter';
import { DateFormatter } from '../formatters/DateFormatter';
import { RelativeTimeFormatter } from '../formatters/RelativeTimeFormatter';
import { ListFormatter } from '../formatters/ListFormatter';
import { DisplayNamesFormatter } from '../formatters/DisplayNamesFormatter';
import { ScoreFormatter, ScoreFormatOptions } from '../formatters/ScoreFormatter';
import { LocaleContext } from '../types';

export function useExecutiveFormatter(
  userPref?: UserPreferences,
  tenantSettings?: TenantSettings
) {
  // For browser locale/timezone
  const browserLocale = typeof navigator !== 'undefined' ? navigator.language : undefined;
  const browserTimezone = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : undefined;
  
  // Resolve context parameters only when they change
  const context: LocaleContext = useMemo(() => {
    // URL parameters can be fetched here if needed, or passed down from a provider.
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : undefined;
    const urlLocale = urlParams?.get('locale') || undefined;

    const resolvedLocale = LocaleResolver.resolve(userPref, tenantSettings, urlLocale, browserLocale);

    return {
      locale: resolvedLocale,
      currency: CurrencyResolver.resolve(userPref, tenantSettings, resolvedLocale),
      timezone: TimezoneResolver.resolve(userPref, tenantSettings, browserTimezone),
    };
  }, [userPref, tenantSettings, browserLocale, browserTimezone]);

  return useMemo(() => ({
    currency: (value: number, options?: Intl.NumberFormatOptions) => 
      CurrencyFormatter.format(value, context, options),
      
    number: (value: number, options?: Intl.NumberFormatOptions) => 
      NumberFormatter.format(value, context, options),
      
    percentage: (value: number, options?: Intl.NumberFormatOptions) => 
      PercentageFormatter.format(value, context, options),
      
    date: (value: Date | number | string, options?: Intl.DateTimeFormatOptions) => 
      DateFormatter.format(value, context, options),
      
    relativeTime: (value: number, unit: Intl.RelativeTimeFormatUnit, options?: Intl.RelativeTimeFormatOptions) => 
      RelativeTimeFormatter.format(value, unit, context, options),
      
    list: (list: string[], options?: Intl.ListFormatOptions) => 
      ListFormatter.format(list, context, options),
      
    displayName: (code: string, options?: Intl.DisplayNamesOptions) => 
      DisplayNamesFormatter.format(code, context, options),
      
    score: (value: number, options?: ScoreFormatOptions) =>
      ScoreFormatter.format(value, context, options),
      
    getContext: () => context,
  }), [context]);
}
