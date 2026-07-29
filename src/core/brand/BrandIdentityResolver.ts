/**
 * EVCA-EBIL-001 — BrandIdentityResolver
 * 
 * Resolves Brand Identity for Platform Core and Partner Tenants.
 * Governance Platform Core is NOT a tenant; it defines Platform Identity.
 */

import { PlatformBrandConfig, TenantBrandConfig, BrandIdentityConfig } from './BrandBoundaryContract';

export const PLATFORM_BRAND_CONFIG: PlatformBrandConfig = {
  id: 'platform-core',
  organizationName: 'Illumine Governance',
  logoLight: '/assets/logo-illumine-light.svg',
  logoDark: '/assets/logo-illumine-dark.svg',
  favicon: '/favicon.ico',
  brandPrimaryColor: '#0E1C2C',
  supportUrl: 'https://illuminegovernance.com/support',
  institutionalEmail: 'governance@illumine.com',
  status: 'published'
};

export const MOCK_PARTNER_TENANTS: Record<string, TenantBrandConfig> = {
  'tenant-acme-001': {
    tenantId: 'tenant-acme-001',
    organizationName: 'Acme Corporate Governance',
    logoLight: '/assets/mock/acme-logo-light.svg',
    logoDark: '/assets/mock/acme-logo-dark.svg',
    favicon: '/assets/mock/acme-favicon.ico',
    brandPrimaryColor: '#0284C7', // Ocean Blue
    supportUrl: 'https://acmecorp.com/governance-support',
    institutionalEmail: 'governance@acmecorp.com',
    status: 'published'
  },
  'tenant-vanguard-002': {
    tenantId: 'tenant-vanguard-002',
    organizationName: 'Vanguard Strategic Group',
    logoLight: '/assets/mock/vanguard-logo-light.svg',
    logoDark: '/assets/mock/vanguard-logo-dark.svg',
    favicon: '/assets/mock/vanguard-favicon.ico',
    brandPrimaryColor: '#0D9488', // Emerald Teal
    supportUrl: 'https://vanguardgroup.com/support',
    institutionalEmail: 'board@vanguardgroup.com',
    status: 'published'
  },
  'tenant-nexus-003': {
    tenantId: 'tenant-nexus-003',
    organizationName: 'Nexus Capital Holding',
    logoLight: '/assets/mock/nexus-logo-light.svg',
    logoDark: '/assets/mock/nexus-logo-dark.svg',
    favicon: '/assets/mock/nexus-favicon.ico',
    brandPrimaryColor: '#7C3AED', // Deep Violet
    supportUrl: 'https://nexuscapital.com/support',
    institutionalEmail: 'compliance@nexuscapital.com',
    status: 'published'
  }
};

export class BrandIdentityResolver {
  private static partnerRegistry: Map<string, TenantBrandConfig> = new Map(
    Object.entries(MOCK_PARTNER_TENANTS)
  );

  /**
   * Register or update a partner tenant's brand configuration.
   */
  public static registerTenantBrand(config: TenantBrandConfig): void {
    BrandIdentityResolver.partnerRegistry.set(config.tenantId, config);
  }

  /**
   * Resolve Brand Identity Config based on tenant ID.
   * If tenantId is missing, null, or 'platform-core', returns Platform Brand Config.
   */
  public static resolve(tenantId?: string | null): BrandIdentityConfig {
    if (!tenantId || tenantId === 'platform-core' || tenantId === 'default') {
      return PLATFORM_BRAND_CONFIG;
    }

    const tenantBrand = BrandIdentityResolver.partnerRegistry.get(tenantId);
    if (tenantBrand) {
      return tenantBrand;
    }

    // Fallback safely to Platform Core Identity
    return PLATFORM_BRAND_CONFIG;
  }

  /**
   * List all available tenant brand IDs for simulation and switcher.
   */
  public static getAvailableTenants(): Array<{ id: string; name: string }> {
    const list: Array<{ id: string; name: string }> = [
      { id: 'platform-core', name: PLATFORM_BRAND_CONFIG.organizationName }
    ];

    BrandIdentityResolver.partnerRegistry.forEach((config, id) => {
      list.push({ id, name: config.organizationName });
    });

    return list;
  }
}
