import React, { useState, useEffect, useRef } from 'react';
import { ExecutiveSidebar } from './ExecutiveSidebar';
import { ExecutiveHeader } from './ExecutiveHeader';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { resolveNavigationContext, ExecutiveContext } from '../../../navigation/navigation.resolver';
import { SemanticRouteMatch } from '../../../navigation/useExecutiveRouteResolver';
import { trackNavigationEvent } from '../../../navigation/navigation-experience-events';
import { LegacyRouteBridge } from '../../../navigation/LegacyRouteBridge';
import { NAVIGATION_SURFACE_REGISTRY } from '../../../core/navigation/navigation-surface.registry';
import { CFOPerformanceSurface } from './CFOPerformanceSurface';
import { CFOCashIntelligenceSurface } from './CFOCashIntelligenceSurface';
import { CFOPlanningForecastSurface } from './CFOPlanningForecastSurface';

interface ExecutiveAppShellProps {
  children: React.ReactNode;
  semanticMatch?: SemanticRouteMatch;
}

export function ExecutiveAppShell({ children, semanticMatch }: ExecutiveAppShellProps) {
  const { office, surface } = useParams<{ office: string; surface?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const hasInitialized = useRef(false);
  
  const [currentOfficeId, setCurrentOfficeId] = useState('cfo-office');
  const [currentSurfaceId, setCurrentSurfaceId] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initialization & Hydration
  useEffect(() => {
    if (hasInitialized.current) return;

    // 1. Try resolving from URL
    const resolvedContext = resolveNavigationContext(location.pathname);
    
    // 2. Try resolving from Persistence
    const storedContextRaw = localStorage.getItem('executiveContext');
    let storedContext: ExecutiveContext | null = null;
    try {
      if (storedContextRaw) storedContext = JSON.parse(storedContextRaw);
    } catch(e) {}

    let initialOffice = 'cfo-office';
    let initialSurface = 'overview';

    if (semanticMatch && semanticMatch.isLegacyUrl) {
      if (semanticMatch.officeId) initialOffice = semanticMatch.officeId;
      if (semanticMatch.surfaceId) initialSurface = semanticMatch.surfaceId;
    } else if (resolvedContext && resolvedContext.office) {
      initialOffice = resolvedContext.office;
      if (resolvedContext.surface) {
        initialSurface = resolvedContext.surface;
      } else if (storedContext && storedContext.office === resolvedContext.office && storedContext.surface) {
        initialSurface = storedContext.surface;
      }
    } else if (storedContext && storedContext.office) {
      initialOffice = storedContext.office;
      if (storedContext.surface) {
        initialSurface = storedContext.surface;
      }
    }

    setCurrentOfficeId(initialOffice);
    setCurrentSurfaceId(initialSurface);
    
    // Ensure URL matches the hydrated state, BUT NOT if we are in a semantic matched legacy route
    if (!semanticMatch?.isLegacyUrl && (location.pathname === '/executive/workspace' || location.pathname === '/executive/workspace/')) {
      navigate(`/executive/workspace/${initialOffice}/${initialSurface}`, { replace: true });
    }

    hasInitialized.current = true;
  }, [location.pathname, navigate, semanticMatch]);

  // Persist State Changes
  useEffect(() => {
    if (!hasInitialized.current) return;

    const context: ExecutiveContext = {
      office: currentOfficeId,
      surface: currentSurfaceId,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('executiveContext', JSON.stringify(context));
  }, [currentOfficeId, currentSurfaceId, location.pathname, semanticMatch]);

  // Handle prop updates from URL (when user clicks back/forward)
  useEffect(() => {
    if (office && office !== currentOfficeId) {
      setCurrentOfficeId(office);
    }
    if (surface && surface !== currentSurfaceId) {
      setCurrentSurfaceId(surface);
    }
  }, [office, surface]);

  const handleOfficeChange = (newOfficeId: string) => {
    setCurrentOfficeId(newOfficeId);
    setCurrentSurfaceId('overview'); // Reset surface when switching office
    trackNavigationEvent('OFFICE_SELECTED', { office: newOfficeId });
    
    // External Routing fallback
    const surface = NAVIGATION_SURFACE_REGISTRY.find(s => s.surfaceId === 'overview' && s.officeId === newOfficeId);
    if (surface) {
      navigate(surface.route);
    } else if (newOfficeId === 'navigation.group.cfo_domain') {
      navigate(`/dashboard/dashboard_gestao`);
    } else if (newOfficeId === 'navigation.group.commercial_office') {
      navigate(`/dashboard/commercial.executive-overview`);
    } else if (newOfficeId === 'navigation.group.platform_workspace') {
      navigate(`/platform/workspace/revenue-center`);
    } else if (newOfficeId === 'navigation.group.administration_workspace' || newOfficeId === 'admin') {
      navigate(`/administration/workspace`);
    } else {
      navigate(`/executive/workspace/${newOfficeId}/overview`);
    }
  };

  const handleSurfaceChange = (newSurfaceId: string) => {
    setCurrentSurfaceId(newSurfaceId);
    trackNavigationEvent('SURFACE_VIEWED', { office: currentOfficeId, surface: newSurfaceId });
    
    if (newSurfaceId === 'workspace') {
      navigate(`/administration/workspace`);
    } else {
      const surface = NAVIGATION_SURFACE_REGISTRY.find(s => s.surfaceId === newSurfaceId);
      if (surface) {
        navigate(surface.route);
      } else {
        navigate(`/dashboard/${newSurfaceId}`);
      }
    }
  };

  // Mock mapping for breadcrumb names
  const officeNames: Record<string, string> = {
    'cfo-office': 'CFO Office',
    'ceo-office': 'CEO Office',
    'board-office': 'Board of Directors',
    'governance-office': 'Governance Office',
    'risk-office': 'Risk Office',
    'platform-workspace': 'Platform Center',
    'administration': 'Administration Workspace'
  };
  const surfaceNames: Record<string, string> = {
    'overview': 'Executive Overview',
    'performance': 'Financial Performance',
    'cash-intelligence': 'Cash Intelligence',
    'planning': 'Planning & Forecast',
    'revenue-center': 'Revenue Center',
    'pipeline-intelligence': 'Pipeline Intelligence',
    'partner-center': 'Partner Center',
    'workspace': 'Global Settings',
    'profitability': 'Profitability',
    'strategy': 'Strategic Alignment',
    'growth': 'Growth',
    'execution': 'Execution',
    'governance': 'Governance',
    'risk': 'Risk',
    'decisions': 'Decisions'
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background relative">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar Wrapper */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <ExecutiveSidebar 
          currentOfficeId={currentOfficeId}
          onOfficeChange={(id) => { handleOfficeChange(id); setIsMobileMenuOpen(false); }}
          currentSurfaceId={currentSurfaceId}
          onSurfaceChange={(id) => { handleSurfaceChange(id); setIsMobileMenuOpen(false); }}
        />
      </div>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ExecutiveHeader 
          officeName={officeNames[currentOfficeId] || 'Workspace'}
          surfaceName={surfaceNames[currentSurfaceId] || 'Overview'}
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <main className="flex-1 overflow-auto relative">
          {/* Overlay to catch clicks on mobile when sidebar is open */}
          <div id="executive-shell-content-area" className="w-full h-full flex flex-col relative">
            <LegacyRouteBridge 
              officeId={currentOfficeId} 
              surfaceId={currentSurfaceId} 
              legacyComponents={{
                // Mapping component keys to legacy routes (children holds the current legacy page).
                // Actually, since children is the whole <Routes> tree, if the bridge renders it, 
                // the existing page corresponding to the URL will render.
                // We'll pass children as the mapped hybrid component.
                'FinancialPerformancePage': children,
                'CashFlowPage': children,
                'FinancialModelingPage': children,
              }}
            >
              {/* Native Surfaces rendered here */}
              {currentOfficeId === 'cfo-office' && currentSurfaceId === 'performance' ? (
                 <CFOPerformanceSurface />
              ) : currentOfficeId === 'cfo-office' && currentSurfaceId === 'cash-intelligence' ? (
                 <CFOCashIntelligenceSurface />
              ) : currentOfficeId === 'cfo-office' && currentSurfaceId === 'planning' ? (
                 <CFOPlanningForecastSurface />
              ) : children ? (
                 children
              ) : (
                <div className="flex-1 w-full p-4 sm:p-6 overflow-y-auto">
                  <div className="bg-surface-elevated border border-border rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center max-w-2xl mx-auto mt-12">
                     <h2 className="text-xl font-semibold mb-2">Workspace Content Area</h2>
                     <p className="text-muted-foreground text-sm">
                       This is the native executive shell rendering a decision surface. <br/>
                       <strong>Office:</strong> {currentOfficeId} <br/>
                       <strong>Surface:</strong> {currentSurfaceId}
                     </p>
                  </div>
                </div>
              )}
            </LegacyRouteBridge>
          </div>
        </main>
      </div>
    </div>
  );
}
