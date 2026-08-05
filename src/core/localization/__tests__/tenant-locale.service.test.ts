import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { tenantLocaleService } from '../tenant-locale.service';
import { UserPreferences, TenantSettings } from '../resolvers/LocaleResolver';
import { CurrencyResolver } from '../resolvers/CurrencyResolver';

describe('TenantLocaleService', () => {
  test('resolves user preference with highest priority', () => {
    const userPref: UserPreferences = { locale: 'pt-BR', currency: 'BRL' };
    const tenantPref: TenantSettings = { defaultLocale: 'en-US', defaultCurrency: 'USD' };
    
    assert.equal(tenantLocaleService.resolveActiveLocale(userPref, tenantPref, 'es-ES', 'en-GB'), 'pt-BR');
    assert.equal(tenantLocaleService.resolveActiveCurrency(userPref, tenantPref), 'BRL');
  });

  test('falls back to tenant settings if user has no preference', () => {
    const userPref: UserPreferences = {};
    const tenantPref: TenantSettings = { defaultLocale: 'en-US', defaultCurrency: 'USD' };
    
    assert.equal(tenantLocaleService.resolveActiveLocale(userPref, tenantPref, 'es-ES', 'en-GB'), 'en-US');
    assert.equal(tenantLocaleService.resolveActiveCurrency(userPref, tenantPref), 'USD');
  });

  test('infers currency from locale if missing in both', () => {
    const userPref: UserPreferences = { locale: 'es-ES' };
    const tenantPref: TenantSettings = {};
    
    const activeLocale = tenantLocaleService.resolveActiveLocale(userPref, tenantPref);
    assert.equal(activeLocale, 'es-ES');
    
    const activeCurrency = CurrencyResolver.resolve(userPref, tenantPref, activeLocale);
    
    assert.equal(activeCurrency, 'EUR');
  });
});
