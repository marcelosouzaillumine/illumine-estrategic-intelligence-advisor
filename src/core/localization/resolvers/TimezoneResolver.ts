import { DEFAULT_TIMEZONE } from '../types';
import { UserPreferences, TenantSettings } from './LocaleResolver';

export class TimezoneResolver {
  static resolve(
    userPref?: UserPreferences,
    tenantSettings?: TenantSettings,
    browserTimezone?: string
  ): string {
    if (userPref?.timezone) return userPref.timezone;
    if (tenantSettings?.defaultTimezone) return tenantSettings.defaultTimezone;
    if (browserTimezone) return browserTimezone;

    return DEFAULT_TIMEZONE;
  }
}
