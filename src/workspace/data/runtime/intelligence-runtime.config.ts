export type IntelligenceProviderType = 'mock' | 'firestore' | 'api';
export type IntelligenceMode = 'development' | 'production';

export interface IntelligenceRuntimeConfig {
  provider: IntelligenceProviderType;
  mode: IntelligenceMode;
}

/**
 * Runtime configuration for the Intelligence Data Layer.
 * Defines which provider handles the data per environment or tenant.
 */
export const intelligenceRuntime: IntelligenceRuntimeConfig = {
  // Use Vite environment variables if available, otherwise default to 'mock'
  provider: (import.meta.env?.VITE_INTELLIGENCE_PROVIDER as IntelligenceProviderType) || 'mock',
  mode: (import.meta.env?.MODE as IntelligenceMode) === 'production' ? 'production' : 'development'
};

/**
 * Advanced provider resolver. Allows overriding the default provider
 * based on specific tenants (e.g. pilot customers using real data while others use mock).
 */
export function resolveProviderForTenant(tenantId: string): IntelligenceProviderType {
  // Example of tenant-specific override:
  if (tenantId === 'tenant-production-pilot') {
    return 'firestore';
  }
  
  return intelligenceRuntime.provider;
}
