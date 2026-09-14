/**
 * EVCA-EBIL-001 — BrandIdentityProvider
 * 
 * React Context Provider for Executive Brand Identity Layer.
 * Integrates with TenancyProvider or direct workspace resolution.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrandIdentityConfig, DerivedBrandTokens } from '../../../../core/brand/BrandBoundaryContract';
import { BrandIdentityResolver, PLATFORM_BRAND_CONFIG } from '../../../../core/brand/BrandIdentityResolver';
import { ColorTokenGenerator } from '../../../../core/brand/ColorTokenGenerator';
import { EBILRuntimeEngine, AppliedBrandState } from '../../../../core/brand/EBILRuntimeEngine';
import { useTenancy } from '../../../../context/TenancyProvider';

interface BrandIdentityContextType {
  activeBrand: BrandIdentityConfig;
  derivedTokens: DerivedBrandTokens;
  setTenantBrand: (tenantId?: string | null) => void;
  availableTenants: Array<{ id: string; name: string }>;
  isPlatformDefault: boolean;
}

const defaultTokens = ColorTokenGenerator.generateTokens(PLATFORM_BRAND_CONFIG.brandPrimaryColor);

const BrandIdentityContext = createContext<BrandIdentityContextType>({
  activeBrand: PLATFORM_BRAND_CONFIG,
  derivedTokens: defaultTokens,
  setTenantBrand: () => {},
  availableTenants: BrandIdentityResolver.getAvailableTenants(),
  isPlatformDefault: true
});

export const useBrandIdentity = () => useContext(BrandIdentityContext);

export function BrandIdentityProvider({ children }: { children: React.ReactNode }) {
  const tenancy = useTenancy();
  const [brandState, setBrandState] = useState<AppliedBrandState>(() => {
    // Initial application of default platform identity
    return EBILRuntimeEngine.applyBrand('platform-core');
  });

  // Sync with TenancyProvider active tenant when it resolves/changes
  useEffect(() => {
    const activeTenantId = tenancy.context?.activeTenantId;
    if (activeTenantId) {
      const newState = EBILRuntimeEngine.applyBrand(activeTenantId);
      setBrandState(newState);
    }
  }, [tenancy.context?.activeTenantId]);

  // Subscribe to EBILRuntimeEngine state changes
  useEffect(() => {
    const unsubscribe = EBILRuntimeEngine.subscribe(state => {
      setBrandState(state);
    });
    return unsubscribe;
  }, []);

  const setTenantBrand = (tenantId?: string | null) => {
    const newState = EBILRuntimeEngine.applyBrand(tenantId);
    setBrandState(newState);
  };

  const isPlatformDefault = !('tenantId' in brandState.config);

  return (
    <BrandIdentityContext.Provider
      value={{
        activeBrand: brandState.config,
        derivedTokens: brandState.tokens,
        setTenantBrand,
        availableTenants: BrandIdentityResolver.getAvailableTenants(),
        isPlatformDefault
      }}
    >
      {children}
    </BrandIdentityContext.Provider>
  );
}
