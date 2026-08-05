import React, { useState } from 'react';
import { ExecutiveSidebar } from './ExecutiveSidebar';
import { ExecutiveHeader } from './ExecutiveHeader';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { NAVIGATION_SURFACE_REGISTRY } from '../../../core/navigation/navigation-surface.registry';

interface AdministrationAppShellProps {
  children: React.ReactNode;
  noPadding?: boolean;
  noScroll?: boolean;
}

export function AdministrationAppShell({ children, noPadding = false, noScroll = false }: AdministrationAppShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-[260px] transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <ExecutiveSidebar 
          currentOfficeId="admin" 
          currentSurfaceId="workspace" 
          onOfficeChange={(office) => {
            const defaultSurfaceId = 'overview';
            const surface = NAVIGATION_SURFACE_REGISTRY.find(s => s.surfaceId === defaultSurfaceId && s.officeId === office);
            if (surface) {
              navigate(surface.route);
            } else if (office === 'navigation.group.cfo_domain') {
              navigate(`/dashboard/dashboard_gestao`);
            } else if (office === 'navigation.group.commercial_office') {
              navigate(`/dashboard/commercial.executive-overview`);
            } else if (office === 'navigation.group.platform_workspace') {
              navigate(`/platform/workspace/revenue-center`);
            } else {
              navigate(`/executive/workspace/${office}/overview`);
            }
            setIsMobileMenuOpen(false);
          }}
          onSurfaceChange={(surfaceId) => {
            if (surfaceId === 'workspace') {
              navigate(`/administration/workspace`);
            } else {
              const surface = NAVIGATION_SURFACE_REGISTRY.find(s => s.surfaceId === surfaceId);
              if (surface) {
                navigate(surface.route);
              } else {
                navigate(`/dashboard/${surfaceId}`);
              }
            }
            setIsMobileMenuOpen(false);
          }}
        />
      </div>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ExecutiveHeader 
          officeName="Administration"
          surfaceName="Workspace"
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <main className={cn("flex-1 min-h-0 bg-muted/20 relative", !noScroll && "overflow-auto")}>
          <div className={cn("w-full h-full flex flex-col relative", !noPadding && "p-4 sm:p-6")}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
