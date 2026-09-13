import React from 'react';
import { UniversalSearchHub } from '../../../../components/executive/UniversalSearchHub';
import { WorkspaceHubNavigation } from '../../../../components/executive/WorkspaceHubNavigation';
import { GuidedInvestigationCard, GuidedJourney } from '../../../../components/executive/GuidedInvestigationCard';
import { ExecutiveQuickActions } from '../../../../components/executive/ExecutiveQuickActions';
import { Search, Info } from 'lucide-react';

export const ExecutiveHomeWorkspace: React.FC = () => {
  const tenantId = 'SYSTEM_TENANT'; // Fallback for observability

  if (!tenantId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Info size={32} className="text-muted-foreground/60 mb-4" />
        <p className="text-eyebrow text-muted-foreground uppercase tracking-widest">Contexto indisponível.</p>
      </div>
    );
  }

  const journeys: GuidedJourney[] = [
    {
      id: 'journey-compliance',
      title: 'Status de Compliance e Risco',
      description: 'Navegue pelo Digital Twin para avaliar a atual integridade fiduciária e estrutural da organização.',
      targetWorkspace: 'DIGITAL_TWIN',
      path: '/digital-twin',
      iconType: 'NETWORK'
    },
    {
      id: 'journey-scenarios',
      title: 'Impactos de Cenários Macro',
      description: 'Abra a War Room para visualizar as simulações e impactos de longo prazo projetados.',
      targetWorkspace: 'WAR_ROOM',
      path: '/war-room',
      iconType: 'TARGET'
    },
    {
      id: 'journey-audit',
      title: 'Auditoria de Decisões Prévias',
      description: 'Utilize a Time Machine para investigar como o cenário anterior justificou a decisão X.',
      targetWorkspace: 'TIME_MACHINE',
      path: '/governance-time-machine/root',
      iconType: 'HISTORY'
    }
  ];

  const recentObjects = [
    { id: 'ev-991', title: 'Relatório Trimestral Q3', type: 'EVIDENCE' },
    { id: 'dec-102', title: 'Aprovação M&A', type: 'DECISION' }
  ];

  return (
    <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">
      {/* Sidebar Hub */}
      <WorkspaceHubNavigation />

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">
        <UniversalSearchHub />
        
        {/* Header bar with fake search trigger to visually show Universal Search */}
        <header className="h-16 border-b border-border bg-surface-container/60 backdrop-blur flex items-center px-8 justify-between">
          <h1 className="text-h4 font-display font-medium text-foreground text-primary">Executive Home</h1>
          <div className="flex items-center gap-4">
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest rounded-lg text-muted-foreground text-sm transition-colors border border-border"
              onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
            >
              <Search size={16} />
              <span>Busca Institucional...</span>
              <kbd className="ml-4 px-1.5 py-0.5 rounded bg-background border border-border font-sans text-[10px]">⌘K</kbd>
            </button>
            <div className="w-8 h-8 rounded-full bg-primary border border-primary flex items-center justify-center text-primary font-bold text-sm">
              EX
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* Welcome Section */}
            <section className="space-y-2">
              <h2 className="text-h2 font-display font-medium text-foreground">Boa tarde, Conselheiro.</h2>
              <p className="text-body-lg text-muted-foreground">O tenant de demonstração está operando com integridade. Selecione um caminho de investigação abaixo.</p>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Journeys */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-eyebrow uppercase tracking-widest">Jornadas Sugeridas</h3>
                <div className="space-y-3">
                  {journeys.length > 0 ? journeys.map(j => (
                    <GuidedInvestigationCard key={j.id} journey={j} />
                  )) : (
                    <div className="p-6 border border-border border-dashed rounded-2xl text-muted-foreground text-center">
                      Nenhuma jornada disponível.
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Actions & Recents */}
              <div className="space-y-6">
                <ExecutiveQuickActions />
                
                <div className="card-premium">
                  <h3 className="text-eyebrow uppercase mb-4 tracking-widest">Objetos Recentes</h3>
                  {recentObjects.length > 0 ? (
                    <div className="space-y-3">
                      {recentObjects.map(obj => (
                        <div key={obj.id} className="flex items-center justify-between p-3 rounded-[12px] bg-surface-container-low border border-border">
                          <span className="text-sm text-foreground font-display font-medium truncate pr-2">{obj.title}</span>
                          <span className="text-[10px] uppercase font-bold text-muted-foreground bg-surface-container px-2 py-1 rounded">{obj.type}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground text-center p-4">
                      Nenhum objeto recente encontrado.
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};
