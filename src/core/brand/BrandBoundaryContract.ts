/**
 * EVCA-EBIL-001 — Executive Brand Identity Layer (EBIL)
 * Brand Boundary Contract
 * 
 * Fundamental Principle:
 * "A experiência da plataforma é canônica. Apenas a identidade institucional é configurável."
 */

export interface PlatformBrandConfig {
  id: 'platform-core';
  organizationName: string;
  logoLight: string;
  logoDark?: string;
  favicon?: string;
  brandPrimaryColor: string; // e.g. '#0E1C2C'
  supportUrl?: string;
  institutionalEmail?: string;
  status: 'published';
}

export interface TenantBrandConfig {
  tenantId: string;
  organizationName: string;
  logoLight: string;
  logoDark?: string;
  favicon?: string;
  brandPrimaryColor: string; // Partner Brand Input HEX
  supportUrl?: string;
  institutionalEmail?: string;
  status: 'draft' | 'approved' | 'published';
}

export type BrandIdentityConfig = PlatformBrandConfig | TenantBrandConfig;

export interface DerivedBrandTokens {
  brandPrimary: string;
  brandPrimaryHover: string;
  brandPrimaryActive: string;
  brandPrimarySubtle: string;
  brandPrimaryBorder: string;
  brandOnPrimary: string;
}

export const BRAND_BOUNDARY_CONTRACT = {
  allowedProperties: [
    'tenantId',
    'id',
    'organizationName',
    'logoLight',
    'logoDark',
    'favicon',
    'brandPrimaryColor',
    'supportUrl',
    'institutionalEmail',
    'status'
  ] as const,

  forbiddenProperties: [
    'typography',
    'spacing',
    'radius',
    'shadows',
    'componentVariants',
    'cssInjection',
    'layoutOverride',
    'interactionBehavior',
    'semanticColorOverride',
    'fontFamily',
    'borderStyle',
    'themeOverride'
  ] as const
};
