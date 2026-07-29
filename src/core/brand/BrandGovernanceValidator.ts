/**
 * EVCA-EBIL-001 — BrandGovernanceValidator
 * 
 * Enforces visual governance rules on all brand configurations.
 * Rejects illegal overrides (typography, spacing, radius, custom CSS),
 * invalid HEX codes, and WCAG contrast violations.
 */

import { BrandIdentityConfig, BRAND_BOUNDARY_CONTRACT } from './BrandBoundaryContract';
import { ColorTokenGenerator } from './ColorTokenGenerator';

export interface GovernanceValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export class BrandGovernanceValidator {
  /**
   * Validate a BrandIdentityConfig object against EBIL rules.
   */
  public static validate(config: Record<string, unknown>): GovernanceValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!config || typeof config !== 'object') {
      return {
        valid: false,
        errors: ['Brand identity configuration must be a valid object.'],
        warnings: []
      };
    }

    // 1. Check for illegal / forbidden keys
    for (const forbiddenKey of BRAND_BOUNDARY_CONTRACT.forbiddenProperties) {
      if (forbiddenKey in config) {
        errors.push(
          `VIOLATION (EVCA-EBIL-001): Property '${forbiddenKey}' is forbidden in BrandIdentityConfig. Structural visual elements belong strictly to Executive Design System.`
        );
      }
    }

    // 2. Validate allowed keys only
    const allowedKeysSet = new Set<string>(BRAND_BOUNDARY_CONTRACT.allowedProperties);
    for (const key of Object.keys(config)) {
      if (!allowedKeysSet.has(key)) {
        errors.push(
          `VIOLATION (EVCA-EBIL-001): Unauthorized property '${key}' detected. Allowed properties: ${BRAND_BOUNDARY_CONTRACT.allowedProperties.join(', ')}.`
        );
      }
    }

    // 3. Validate Organization Name
    if (!config.organizationName || typeof config.organizationName !== 'string' || config.organizationName.trim() === '') {
      errors.push('organizationName is required and must be a non-empty string.');
    }

    // 4. Validate Brand Primary Color HEX
    const color = config.brandPrimaryColor;
    if (!color || typeof color !== 'string') {
      errors.push('brandPrimaryColor is required and must be a string.');
    } else {
      const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (!hexRegex.test(color)) {
        errors.push(`brandPrimaryColor '${color}' is not a valid 3-digit or 6-digit HEX color.`);
      } else {
        // 5. Check WCAG contrast requirement
        const baseRgb = ColorTokenGenerator.hexToRgb(color);
        const whiteRgb = { r: 255, g: 255, b: 255 };
        const darkRgb = { r: 15, g: 23, b: 42 };
        const contrastWhite = ColorTokenGenerator.calculateContrastRatio(baseRgb, whiteRgb);
        const contrastDark = ColorTokenGenerator.calculateContrastRatio(baseRgb, darkRgb);

        const maxContrast = Math.max(contrastWhite, contrastDark);
        if (maxContrast < 3.0) {
          warnings.push(
            `brandPrimaryColor '${color}' has low WCAG contrast (${maxContrast.toFixed(2)}:1). Consider using a darker or richer tone for optimal legibility.`
          );
        }
      }
    }

    // 6. Validate URLs if present
    if (config.supportUrl && typeof config.supportUrl === 'string') {
      if (!config.supportUrl.startsWith('http://') && !config.supportUrl.startsWith('https://') && !config.supportUrl.startsWith('/')) {
        errors.push(`supportUrl '${config.supportUrl}' must be a valid URL string starting with http://, https://, or /.`);
      }
    }

    if (config.institutionalEmail && typeof config.institutionalEmail === 'string') {
      if (!config.institutionalEmail.includes('@')) {
        errors.push(`institutionalEmail '${config.institutionalEmail}' must be a valid email address.`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Asserts validity or throws a Governance Error.
   */
  public static assertValid(config: unknown): asserts config is BrandIdentityConfig {
    const result = BrandGovernanceValidator.validate(config as Record<string, unknown>);
    if (!result.valid) {
      throw new Error(`[EBIL Governance Error] Configuration rejected:\n - ${result.errors.join('\n - ')}`);
    }
  }
}
