import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { getWorkspaceDefinition } from '../../workspace/workspace.registry';
import { WorkspaceDefinition } from '../../workspace/types';
import { useAuthorization } from '../../hooks/useAuthorization';
import { CAPABILITIES } from '../../domain/authorization/Capabilities';
import { useLanguage } from '../../contexts/LanguageContext';
import { Loader2, ShieldAlert } from 'lucide-react';
import { ExecutiveDataProvider } from './providers/ExecutiveDataProvider';
import { LayoutEngine } from './surfaces/LayoutEngine';
import { METRIC_WIDGET_DEF_V2 } from './decision/MetricWidget';
import { INSIGHT_WIDGET_DEF_V2 } from './decision/InsightWidget';
import { DECISION_CARD_WIDGET_DEF } from './decision/DecisionCardWidget';
import { EXECUTIVE_NARRATIVE_WIDGET_DEF } from './decision/ExecutiveNarrativeWidget';
import { widgetRegistry } from './widgets/WidgetRegistry';

// Quick registration of widgets for demo purposes
widgetRegistry.register(METRIC_WIDGET_DEF_V2);
widgetRegistry.register(INSIGHT_WIDGET_DEF_V2);
widgetRegistry.register(DECISION_CARD_WIDGET_DEF);
widgetRegistry.register(EXECUTIVE_NARRATIVE_WIDGET_DEF);

export function ExecutiveWorkspaceLab() {
  const { office } = useParams<{ office: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { can, loading: authLoading } = useAuthorization();
  const { t } = useLanguage();

  const isMock = searchParams.get('mock') === 'true' || searchParams.get('demo') === 'true';
  const dataMode = searchParams.get('demo') === 'true' ? 'demo' : (searchParams.get('mock') === 'true' ? 'mock' : 'live');
  const officeId = office ? `${office}-office` : '';
  
  const [workspace, setWorkspace] = useState<WorkspaceDefinition | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    // 1. Check base capability
    if (!can(CAPABILITIES.EXECUTIVE_WORKSPACE_VIEW)) {
      setError('ACCESS_DENIED');
      return;
    }

    // 2. Load workspace definition
    const def = getWorkspaceDefinition(officeId);
    if (!def) {
      setError('NOT_FOUND');
      return;
    }

    // 3. Check workspace specific capabilities (if any require ACCESS)
    const hasWorkspaceAccess = def.capabilities.some(cap => can(cap));
    if (!hasWorkspaceAccess && !isMock) { 
      setError('WORKSPACE_ACCESS_DENIED');
      return;
    }

    setWorkspace(def);
  }, [officeId, can, authLoading, isMock]);

  if (authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">{error === 'NOT_FOUND' ? 'Workspace Not Found' : 'Access Denied'}</h1>
        <p className="text-muted-foreground mt-2">
          {error === 'NOT_FOUND' 
            ? `O Office "${office}" não possui um Workspace definido no Registry.`
            : 'Você não possui as credenciais necessárias para acessar este Executive Workspace.'}
        </p>
        <button 
          onClick={() => navigate('/')}
          className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
        >
          Voltar para Início
        </button>
      </div>
    );
  }

  if (!workspace) return null;
  const activeSurface = workspace.surfaces[0];
  const activeLayout = activeSurface?.layouts.find(l => l.id === activeSurface.defaultLayout) || activeSurface?.layouts[0];

  return (
    <ExecutiveDataProvider mode={dataMode}>
      <div className="flex h-screen w-full flex-col bg-[#0A0A0B] text-white font-sans overflow-hidden">
        {/* Shell Header */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/20">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold tracking-tight">{workspace.titleKey}</h1>
              <span className="text-xs text-white/50 uppercase tracking-wider">{workspace.subtitleKey}</span>
            </div>
            {isMock && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase tracking-widest">
                {dataMode === 'demo' ? 'Demo Mode' : 'Mock Mode'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-xs font-bold">EX</span>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Workspace Sidebar (Surfaces Menu) */}
          <aside className="w-64 border-r border-white/10 bg-black/10 flex flex-col">
            <div className="p-4">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3 block">Decision Surfaces</span>
              <div className="flex flex-col gap-1">
                {workspace.surfaces.map(surface => (
                  <button 
                    key={surface.id}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                      workspace.defaultSurface === surface.id 
                        ? 'bg-primary/20 text-primary font-medium' 
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="truncate">{surface.titleKey}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Surface Renderer Context */}
          <main className="flex-1 overflow-auto bg-black/40">
            {activeLayout ? (
              <LayoutEngine layout={activeLayout} />
            ) : (
              <div className="p-8 flex items-center justify-center text-white/50 h-full">
                No layout configuration available for this surface.
              </div>
            )}
          </main>
        </div>
      </div>
    </ExecutiveDataProvider>
  );
}
