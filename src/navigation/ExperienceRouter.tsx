import React from 'react';
import { useNavigationExperience } from './NavigationExperienceResolver';
import { ExecutiveAppShell } from '../components/executive-workspace/shell/ExecutiveAppShell';
import { useExecutiveRouteResolver } from './useExecutiveRouteResolver';
import { trackNavigationEvent } from './navigation-experience-events';
import { useEffect } from 'react';

interface ExperienceRouterProps {
  children: React.ReactNode; // The core dashboard routes (the content)
  legacyLayout: (content: React.ReactNode) => React.ReactNode; // The legacy sidebar + header wrapper
}

/**
 * Conditionally routes the user to the correct application shell 
 * based on the active NavigationExperiencePolicy.
 */
export function ExperienceRouter({ children, legacyLayout }: ExperienceRouterProps) {
  const experience = useNavigationExperience();
  const semanticMatch = useExecutiveRouteResolver();

  useEffect(() => {
    if (experience.shell === 'executive') {
      trackNavigationEvent('EXECUTIVE_SHELL_OPENED', { mode: experience.mode, reason: experience.reason });
    }
  }, [experience.shell, experience.mode, experience.reason]);

  if (experience.shell === 'executive') {
    // Render the new Executive OS Shell.
    // By passing `children` here, we enable Hybrid Mode: 
    // Legacy pages can render inside the Executive Shell.
    return (
      <ExecutiveAppShell semanticMatch={semanticMatch}>
        {children}
      </ExecutiveAppShell>
    );
  }

  // Render the legacy AppSidebar layout
  return (
    <>
      {legacyLayout(children)}
    </>
  );
}
