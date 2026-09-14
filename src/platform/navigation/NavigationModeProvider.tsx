import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SystemCapability } from '../../domain/authorization/Capabilities';

export type NavigationExperience = 'legacy' | 'hybrid' | 'executive';

export interface NavigationExperiencePolicy {
  mode: NavigationExperience;
  allowedCapabilities?: SystemCapability[];
  allowedUsers?: string[]; // for specific rollout
  tenantId?: string; // for tenant-specific rollout
}

interface NavigationModeContextValue {
  policy: NavigationExperiencePolicy;
  setPolicy: (policy: NavigationExperiencePolicy) => void;
  mode: NavigationExperience;
}

const NavigationModeContext = createContext<NavigationModeContextValue | undefined>(undefined);

const DEFAULT_POLICY: NavigationExperiencePolicy = {
  mode: 'legacy'
};

export function NavigationModeProvider({ children }: { children: ReactNode }) {
  const [policy, setPolicyState] = useState<NavigationExperiencePolicy>(DEFAULT_POLICY);

  useEffect(() => {
    // Read from localStorage (internal testing flag)
    const stored = localStorage.getItem('navigationExperiencePolicy');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.mode) {
          setPolicyState(parsed);
          return;
        }
      } catch (e) {
        // fallback to legacy check
      }
    }
    
    // Legacy fallback check for the old mode variable during transition
    const oldStored = localStorage.getItem('navigationMode');
    if (oldStored === 'executive' || oldStored === 'hybrid' || oldStored === 'legacy') {
      setPolicyState({ mode: oldStored });
    }
  }, []);

  const setPolicy = (newPolicy: NavigationExperiencePolicy) => {
    setPolicyState(newPolicy);
    localStorage.setItem('navigationExperiencePolicy', JSON.stringify(newPolicy));
    // For backwards compatibility during tests
    localStorage.setItem('navigationMode', newPolicy.mode);
  };

  return (
    <NavigationModeContext.Provider value={{ policy, setPolicy, mode: policy.mode }}>
      {children}
    </NavigationModeContext.Provider>
  );
}

export function useNavigationMode() {
  const context = useContext(NavigationModeContext);
  if (!context) {
    throw new Error('useNavigationMode must be used within NavigationModeProvider');
  }
  return context;
}
