import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { internationalRoutes, routePrefixes, legacyAliases, SupportedLocale, RouteKey, getLocalizedRoute, getRouteKeyFromPath } from '../src/core/routing/internationalRoutes';
import { generateCanonicalUrl } from '../src/core/seo/utils/canonical';
import { generateHreflangTags } from '../src/core/seo/utils/hreflang';

describe('International Routing Architecture', () => {
  const locales = Object.keys(routePrefixes) as SupportedLocale[];
  const routeKeys = Object.keys(internationalRoutes) as RouteKey[];

  it('every route must be available in pt-BR, en-US, and es-ES (via getLocalizedRoute)', () => {
    routeKeys.forEach(key => {
      locales.forEach(locale => {
        const path = getLocalizedRoute(key, locale);
        assert.ok(path, 'path should be defined');
        assert.strictEqual(typeof path, 'string');
        
        // Ensure path starts with the locale prefix (except HOME which is exactly the prefix)
        const prefix = routePrefixes[locale];
        assert.ok(path.startsWith(prefix), 'path must start with prefix');
      });
    });
  });

  it('every route must possess a canonical URL', () => {
    routeKeys.forEach(key => {
      const canonical = generateCanonicalUrl('https://illuminegovernance.com', key, 'pt-BR');
      assert.ok(canonical, 'canonical URL should be defined');
      assert.ok(canonical.startsWith('https://illuminegovernance.com/pt'), 'canonical must start with pt-BR base');
    });
  });

  it('every route must possess hreflang tags for all locales and x-default', () => {
    routeKeys.forEach(key => {
      const hreflangTags = generateHreflangTags('https://illuminegovernance.com', key);
      
      // Should have 3 locales + 1 x-default
      assert.strictEqual(hreflangTags.length, 4);
      
      const ptTag = hreflangTags.find(tag => tag.hreflang === 'pt');
      assert.ok(ptTag);
      assert.ok(ptTag?.href.includes('/pt'));

      const enTag = hreflangTags.find(tag => tag.hreflang === 'en');
      assert.ok(enTag);
      assert.ok(enTag?.href.includes('/en'));

      const esTag = hreflangTags.find(tag => tag.hreflang === 'es');
      assert.ok(esTag);
      assert.ok(esTag?.href.includes('/es'));

      const defaultTag = hreflangTags.find(tag => tag.hreflang === 'x-default');
      assert.ok(defaultTag);
      assert.ok(defaultTag?.href.includes('/en'));
    });
  });

  it('there must be no duplicate canonical slugs', () => {
    const slugs = Object.values(internationalRoutes);
    const uniqueSlugs = new Set(slugs);
    assert.strictEqual(slugs.length, uniqueSlugs.size);
  });

  it('there must be no legacy aliases without a destination', () => {
    Object.entries(legacyAliases).forEach(([alias, destKey]) => {
      assert.ok(destKey);
      assert.ok(internationalRoutes[destKey]);
    });
  });

  it('resolves routes from paths correctly using getRouteKeyFromPath', () => {
    assert.strictEqual(getRouteKeyFromPath('/pt/platform'), 'PLATFORM');
    assert.strictEqual(getRouteKeyFromPath('/en/platform'), 'PLATFORM');
    assert.strictEqual(getRouteKeyFromPath('/es/platform'), 'PLATFORM');
    assert.strictEqual(getRouteKeyFromPath('/pt'), 'HOME');
    
    // Legacy alias test
    assert.strictEqual(getRouteKeyFromPath('/plataforma'), 'PLATFORM');
    assert.strictEqual(getRouteKeyFromPath('/governanca'), 'GOVERNANCE');
  });
});
