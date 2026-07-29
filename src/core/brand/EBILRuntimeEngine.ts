/**
 * EVCA-EBIL-001 — EBILRuntimeEngine
 * 
 * Centralized Orchestrator Service for Executive Brand Identity Layer.
 * Sequence:
 * Tenant Identification → BrandIdentityResolver → BrandGovernanceValidator → ColorTokenGenerator → EBILRuntimeEngine → CSS Variables
 */

import { BrandIdentityConfig, DerivedBrandTokens } from './BrandBoundaryContract';
import { BrandIdentityResolver } from './BrandIdentityResolver';
import { BrandGovernanceValidator } from './BrandGovernanceValidator';
import { ColorTokenGenerator } from './ColorTokenGenerator';

export interface AppliedBrandState {
  config: BrandIdentityConfig;
  tokens: DerivedBrandTokens;
  appliedAt: string;
}

export class EBILRuntimeEngine {
  private static currentState: AppliedBrandState | null = null;
  private static listeners: Set<(state: AppliedBrandState) => void> = new Set();

  /**
   * Resolve, validate, generate, and apply brand identity to runtime environment.
   */
  public static applyBrand(tenantId?: string | null): AppliedBrandState {
    // 1. Resolve configuration
    const config = BrandIdentityResolver.resolve(tenantId);

    // 2. Validate configuration against Visual Governance Contract
    BrandGovernanceValidator.assertValid(config as unknown as Record<string, unknown>);

    // 3. Generate WCAG-compliant derived brand tokens
    const tokens = ColorTokenGenerator.generateTokens(config.brandPrimaryColor);

    // 4. Inject CSS variables into DOM (browser environment safe)
    EBILRuntimeEngine.injectCSSVariables(tokens);

    // 5. Update Favicon if in browser environment
    if (config.favicon) {
      EBILRuntimeEngine.updateFavicon(config.favicon);
    }

    const state: AppliedBrandState = {
      config,
      tokens,
      appliedAt: new Date().toISOString()
    };

    EBILRuntimeEngine.currentState = state;
    EBILRuntimeEngine.notifyListeners(state);

    return state;
  }

  /**
   * Inject Brand CSS Custom Properties into document.documentElement style
   */
  public static injectCSSVariables(tokens: DerivedBrandTokens): void {
    if (typeof document === 'undefined' || !document.documentElement) {
      return; // Safe for Node.js / SSR / testing environment
    }

    const style = document.documentElement.style;

    style.setProperty('--color-brand-primary', tokens.brandPrimary);
    style.setProperty('--color-brand-primary-hover', tokens.brandPrimaryHover);
    style.setProperty('--color-brand-primary-active', tokens.brandPrimaryActive);
    style.setProperty('--color-brand-primary-subtle', tokens.brandPrimarySubtle);
    style.setProperty('--color-brand-primary-border', tokens.brandPrimaryBorder);
    style.setProperty('--color-brand-on-primary', tokens.brandOnPrimary);
  }

  /**
   * Update browser favicon dynamically
   */
  private static updateFavicon(faviconUrl: string): void {
    if (typeof document === 'undefined') return;

    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'shortcut icon';
      document.getElementsByTagName('head')[0]?.appendChild(link);
    }
    link.href = faviconUrl;
  }

  /**
   * Get current applied brand state
   */
  public static getCurrentState(): AppliedBrandState | null {
    return EBILRuntimeEngine.currentState;
  }

  /**
   * Subscribe to brand identity state changes
   */
  public static subscribe(listener: (state: AppliedBrandState) => void): () => void {
    EBILRuntimeEngine.listeners.add(listener);
    if (EBILRuntimeEngine.currentState) {
      listener(EBILRuntimeEngine.currentState);
    }
    return () => {
      EBILRuntimeEngine.listeners.delete(listener);
    };
  }

  private static notifyListeners(state: AppliedBrandState): void {
    EBILRuntimeEngine.listeners.forEach(listener => {
      try {
        listener(state);
      } catch (err) {
        console.error('[EBILRuntimeEngine] Listener error:', err);
      }
    });
  }
}
