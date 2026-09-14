/**
 * Translation Key Governance
 * 
 * Defines structural rules and TypeScript interfaces for translation keys to enforce strict domain separation.
 */

export interface RuntimeLabel {
  labelKey: string;
  severity?: 'info' | 'warning' | 'critical';
  args?: Record<string, string | number>;
}

// Below are reference types to enforce domain separation on translation keys.
// In practice, keys must follow one of these prefixes:
export type NavigationKey = `navigation.${string}`;
export type RuntimeKey = `runtime.${string}`;
export type LandingKey = `landing.${string}`;
export type AuthKey = `auth.${string}`;
export type SharedKey = `shared.${string}`;
export type FinancialKey = `financial.${string}`;
export type KpiKey = `kpi.${string}`;
export type ActionsKey = `actions.${string}`;

export type ValidTranslationKey = 
  | NavigationKey 
  | RuntimeKey 
  | LandingKey 
  | AuthKey 
  | SharedKey
  | FinancialKey
  | KpiKey
  | ActionsKey
  | string; // Fallback for flexibility during migration
