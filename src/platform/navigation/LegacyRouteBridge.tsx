import React from 'react';
import { getLegacyMappingForSurface } from '../../navigation/legacy-route.registry';

// Import all possible legacy pages that could be bridged.
// In a real application, these might be dynamically imported to reduce bundle size.
// For now, we will assume they are passed via context or props, or imported directly.
// To keep the bridge decoupled from the app's heavy pages, we'll accept a render prop or 
// use a dictionary of known components passed from the top.

export interface LegacyRouteBridgeProps {
  officeId: string;
  surfaceId: string;
  // This is a map of component keys to the actual React components.
  // We pass this in to avoid creating massive import dependencies in the bridge.
  legacyComponents: Record<string, React.ReactNode>;
  children?: React.ReactNode; // Fallback or native surface
}

/**
 * Acts as the structural bridge for rendering legacy pages inside the new Executive AppShell.
 * If the current surface is marked as 'hybrid' in the registry, it looks up the legacy component and renders it.
 * Otherwise, it renders the provided native surface (children).
 */
export function LegacyRouteBridge({ 
  officeId, 
  surfaceId, 
  legacyComponents,
  children 
}: LegacyRouteBridgeProps) {
  
  const mapping = getLegacyMappingForSurface(officeId, surfaceId);

  if (mapping && mapping.migrationStatus === 'hybrid') {
    const LegacyComponent = legacyComponents[mapping.componentKey];
    
    if (LegacyComponent) {
      return (
        <div className="flex-1 w-full h-full p-4 sm:p-6 overflow-y-auto">
           {LegacyComponent}
        </div>
      );
    }
  }

  // If it's native or no mapping exists, render the new Executive Surface
  return <>{children}</>;
}
