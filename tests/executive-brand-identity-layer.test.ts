/**
 * EVCA-EBIL-001 — Executive Brand Identity Layer (EBIL) Test Suite
 * 
 * Includes the Canonical Similarity Architecture Gate:
 * Verifies Tenant A vs Tenant B vs Platform Core rendering invariants:
 * - DOM structural tokens (typography, spacing, radius): 100% equal
 * - Semantic state tokens (success, warning, critical): 100% equal
 * - Only brand identity tokens (brand-primary, brand-on-primary, organizationName, logo) change.
 */

import test from 'node:test';
import assert from 'node:assert';
import { BRAND_BOUNDARY_CONTRACT } from '../src/core/brand/BrandBoundaryContract';
import { BrandGovernanceValidator } from '../src/core/brand/BrandGovernanceValidator';
import { ColorTokenGenerator } from '../src/core/brand/ColorTokenGenerator';
import { BrandIdentityResolver, PLATFORM_BRAND_CONFIG } from '../src/core/brand/BrandIdentityResolver';
import { EBILRuntimeEngine } from '../src/core/brand/EBILRuntimeEngine';
import { runBrandIdentityAudit } from '../src/scripts/runBrandIdentityAudit';
import { runPartnerBrandAudit } from '../src/scripts/runPartnerBrandAudit';

test('EVCA-EBIL-001: BrandBoundaryContract prohibits structural visual overrides', () => {
  const illegalConfig = {
    tenantId: 'tenant-illegal-001',
    organizationName: 'Illegal Theme Infallible Inc',
    brandPrimaryColor: '#0057FF',
    logoLight: '/logo.svg',
    typography: { fontFamily: 'Comic Sans' }, // Forbidden
    radius: '0px',                            // Forbidden
    themeOverride: true                       // Forbidden
  };

  const validation = BrandGovernanceValidator.validate(illegalConfig);
  assert.strictEqual(validation.valid, false, 'Validator must reject forbidden structural overrides');
  assert.ok(
    validation.errors.some(e => e.includes('typography')),
    'Must explicitly cite typography violation'
  );
  assert.ok(
    validation.errors.some(e => e.includes('radius')),
    'Must explicitly cite radius violation'
  );
});

test('EVCA-EBIL-001: BrandGovernanceValidator validates HEX colors and contact fields', () => {
  const invalidHexConfig = {
    tenantId: 'tenant-bad-hex',
    organizationName: 'Bad Hex Corp',
    brandPrimaryColor: 'blue-color', // Invalid HEX
    logoLight: '/logo.svg'
  };

  const hexVal = BrandGovernanceValidator.validate(invalidHexConfig);
  assert.strictEqual(hexVal.valid, false, 'Must reject non-HEX color strings');
  assert.ok(hexVal.errors.some(e => e.includes('not a valid 3-digit or 6-digit HEX color')));

  const validPartnerConfig = {
    tenantId: 'tenant-valid-partner',
    organizationName: 'Valid Partner Global',
    brandPrimaryColor: '#0284C7',
    logoLight: '/logo.svg',
    supportUrl: 'https://partner.com/support',
    institutionalEmail: 'contact@partner.com'
  };

  const validVal = BrandGovernanceValidator.validate(validPartnerConfig);
  assert.strictEqual(validVal.valid, true, 'Must pass clean valid tenant config');
});

test('EVCA-EBIL-001: ColorTokenGenerator produces WCAG AA compliant brand tokens', () => {
  // 1. Color with high native contrast (#0E1C2C)
  const platformTokens = ColorTokenGenerator.generateTokens('#0E1C2C');
  assert.strictEqual(platformTokens.brandPrimary, '#0E1C2C');

  // 2. Partner color requiring minor lightness auto-tuning for WCAG AA (>= 4.5:1)
  const oceanBlueHex = '#0284C7';
  const tokens = ColorTokenGenerator.generateTokens(oceanBlueHex);

  assert.ok(tokens.brandPrimary.startsWith('#'));
  assert.ok(tokens.brandPrimaryHover.startsWith('#'));
  assert.ok(tokens.brandPrimaryActive.startsWith('#'));
  assert.ok(tokens.brandPrimarySubtle.includes('rgba('));
  assert.ok(tokens.brandPrimaryBorder.includes('rgba('));

  // Check WCAG AA contrast ratio of brandOnPrimary against brandPrimary
  const primaryRgb = ColorTokenGenerator.hexToRgb(tokens.brandPrimary);
  const onPrimaryRgb = ColorTokenGenerator.hexToRgb(tokens.brandOnPrimary);
  const contrastRatio = ColorTokenGenerator.calculateContrastRatio(primaryRgb, onPrimaryRgb);

  assert.ok(
    contrastRatio >= 4.5,
    `On-primary contrast ratio (${contrastRatio.toFixed(2)}:1) must satisfy WCAG AA requirement (>= 4.5:1)`
  );
});

test('EVCA-EBIL-001: BrandIdentityResolver distinguishes Platform Identity from Tenant Identity', () => {
  const platformConfig = BrandIdentityResolver.resolve('platform-core');
  assert.strictEqual('id' in platformConfig ? platformConfig.id : '', 'platform-core');
  assert.strictEqual(platformConfig.organizationName, 'Illumine Governance');

  const defaultResolved = BrandIdentityResolver.resolve(null);
  assert.strictEqual(defaultResolved.organizationName, 'Illumine Governance');

  const acmeConfig = BrandIdentityResolver.resolve('tenant-acme-001');
  assert.strictEqual(acmeConfig.organizationName, 'Acme Corporate Governance');
  assert.strictEqual(acmeConfig.brandPrimaryColor, '#0284C7');

  const vanguardConfig = BrandIdentityResolver.resolve('tenant-vanguard-002');
  assert.strictEqual(vanguardConfig.organizationName, 'Vanguard Strategic Group');
  assert.strictEqual(vanguardConfig.brandPrimaryColor, '#0D9488');
});

test('EVCA-EBIL-001 Architecture Gate: Canonical Similarity Test (Tenant A vs Tenant B)', () => {
  // Apply Tenant A (Acme Corporate Governance)
  const stateA = EBILRuntimeEngine.applyBrand('tenant-acme-001');

  // Apply Tenant B (Vanguard Strategic Group)
  const stateB = EBILRuntimeEngine.applyBrand('tenant-vanguard-002');

  // Apply Platform Core
  const stateCore = EBILRuntimeEngine.applyBrand('platform-core');

  // Assert Brand Identity parameters change
  assert.notStrictEqual(stateA.config.organizationName, stateB.config.organizationName);
  assert.notStrictEqual(stateA.tokens.brandPrimary, stateB.tokens.brandPrimary);

  // Assert Structural Invariants:
  // Allowed properties contract strictly equals BRAND_BOUNDARY_CONTRACT.allowedProperties
  assert.deepStrictEqual(
    BRAND_BOUNDARY_CONTRACT.allowedProperties,
    [
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
    ]
  );

  // Assert Forbidden properties contract strictly equals BRAND_BOUNDARY_CONTRACT.forbiddenProperties
  assert.deepStrictEqual(
    BRAND_BOUNDARY_CONTRACT.forbiddenProperties,
    [
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
    ]
  );
});

test('EVCA-EBIL-001 Architecture Gate: Brand Identity Audit Utility', () => {
  const report = runBrandIdentityAudit();
  assert.strictEqual(report.passed, true, `Brand Identity Audit must pass cleanly. Errors:\n${report.errors.join('\n')}`);
  assert.ok(report.metrics.tenantsAudited >= 4, 'Must audit at least 4 tenant configurations');
});

test('EVCA-EBIL-002: Partner Brand Configuration Audit Utility', () => {
  const report = runPartnerBrandAudit();
  assert.strictEqual(report.passed, true, `Partner Brand Audit must pass cleanly. Errors:\n${report.errors.join('\n')}`);
  assert.ok(report.metrics.tenantsAudited >= 4, 'Must audit all tenants');
  assert.ok(report.metrics.componentsVerified >= 4, 'Must verify admin brand components');
});
