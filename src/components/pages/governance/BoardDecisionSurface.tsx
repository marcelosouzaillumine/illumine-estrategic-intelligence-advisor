// src/components/pages/governance/BoardDecisionSurface.tsx

import React from 'react';
import { Gavel, Scale, AlertTriangle, FileText, CheckCircle2, Shield } from 'lucide-react';
import { ExecutiveDirectiveSection, BoardResolutionAppendix } from '../../../services/FiduciaryRuntimeAdapter';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useCognitiveNavigation } from '../../../context/cognitive-navigation/CognitiveNavigationContext';
import { BrainCircuit, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { InvestigationLauncherWrapper } from '../../investigation/InvestigationLauncherWrapper';

interface BoardDecisionSurfaceProps {
  executiveDirectives?: ExecutiveDirectiveSection;
  boardResolutionAppendix?: BoardResolutionAppendix;
}

export function BoardDecisionSurface({ executiveDirectives, boardResolutionAppendix }: BoardDecisionSurfaceProps) {
  const { t } = useLanguage();
  const cognitiveNavigation = useCognitiveNavigation();
  const openCognitiveDrawer = cognitiveNavigation?.openDrawer;
  const navigate = useNavigate();

  const handleNavigateToAdvisor = () => {
    const navRef = {
      tenantId: 'SYSTEM_TENANT',
      sourceWorkspace: 'BOARD_DECISION',
      targetWorkspace: 'ADVISOR',
      correlationId: `nav-${Date.now()}`
    };
    navigate('/advisor', { state: { navRef } });
  };

  const activeDirectives = executiveDirectives?.activeDirectives || [];
  const resolutions = boardResolutionAppendix?.resolutionIds || [];
  const approvals = boardResolutionAppendix?.approvals || [];
  
  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'RESTRICTIVE':
        return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'CRITICAL':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'ELEVATED':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'STANDARD':
      default:
        return 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20';
    }
  };

  return (
    <div className="p-6 rounded-[32px] border border-slate-200 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-950/40 backdrop-blur-md space-y-6 shadow-xs">
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-white/5 pb-3 justify-between">
        <div className="flex items-center gap-3">
          <Gavel className="w-5 h-5 text-amber-500 dark:text-amber-400" />
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-zinc-300">
            Painel de Diretivas e Deliberações do Conselho (Board Decision Surface)
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-400 rounded flex items-center gap-1.5 shadow-xs">
            <Scale className="w-3.5 h-3.5" />
            Fiduciary Directives
          </span>
          <button
            onClick={handleNavigateToAdvisor}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[9px] font-mono font-bold uppercase tracking-widest rounded transition-colors border border-slate-700 shadow-sm"
          >
            Abrir Advisor Workspace
          </button>
        </div>
      </div>

      {/* Grid: Directives List & Historical Memory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Directives List - occupies 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-500">
              Diretivas Ativas do Sistema
            </span>
            <span className="text-[9px] font-mono text-slate-400 dark:text-zinc-400">
              {activeDirectives.length} diretivas pendentes/ativas
            </span>
          </div>

          {activeDirectives.length === 0 ? (
            <div className="p-6 rounded-2xl bg-slate-100/50 dark:bg-zinc-950/40 border border-slate-200 dark:border-zinc-900 text-center space-y-2 shadow-xs">
              <Shield className="w-8 h-8 text-slate-400 dark:text-zinc-600 mx-auto" />
              <p className="text-xs text-slate-700 dark:text-zinc-400 font-semibold uppercase tracking-wider">
                Nenhuma diretiva ativa no momento.
              </p>
              <p className="text-[10px] text-slate-500 dark:text-zinc-500 max-w-sm mx-auto font-medium">
                Todas as posturas operacionais e fluxos financeiros estão alinhados com o regimento estatutário.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeDirectives.map((dir, idx) => (
                <div key={idx} className="p-4 bg-slate-100/80 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-900 rounded-2xl space-y-3 shadow-xs">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-slate-700 dark:text-zinc-300 font-mono">
                      {dir.id}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-mono bg-slate-200/60 dark:bg-zinc-900 text-slate-600 dark:text-zinc-500 px-1.5 py-0.5 rounded border border-slate-200 dark:border-zinc-800 uppercase tracking-wider">
                        {dir.category.replace(/_/g, ' ')}
                      </span>
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${getSeverityStyle(dir.severity)}`}>
                        {dir.severity}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wide mb-1">
                      {dir.title}
                    </h4>
                    <p className="text-xs font-semibold text-slate-600 dark:text-zinc-400 leading-relaxed">
                      {dir.statement}
                    </p>
                  </div>

                  {dir.causalDrivers && dir.causalDrivers.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-650">
                        Gatilhos:
                      </span>
                      {dir.causalDrivers.map((driver, dIdx) => (
                        <span key={dIdx} className="text-[8px] font-mono bg-slate-200/50 dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400 px-1.5 py-0.5 rounded border border-slate-200 dark:border-zinc-800">
                          {driver}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-slate-200 dark:border-white/5 pt-2 text-[9px] font-mono text-slate-500 dark:text-zinc-500">
                    <span>Linhagem: <span className="text-slate-600 dark:text-zinc-400 select-all">{dir.lineageHash}</span></span>
                    <span className="font-bold uppercase text-amber-600 dark:text-amber-500/80">{dir.status}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/50 dark:border-white/5">
                    <InvestigationLauncherWrapper 
                      tenantId="SYSTEM_TENANT" 
                      nodeId={dir.id} 
                      originSurface="BOARD_PACK" 
                    />
                    
                    {openCognitiveDrawer && (
                      <>
                        <button 
                          onClick={() => openCognitiveDrawer(dir.id)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 rounded text-[9px] font-black uppercase tracking-wider transition-colors"
                        >
                          <BrainCircuit size={12} />
                          Ver Cadeia Causal
                        </button>
                        <button 
                          onClick={() => openCognitiveDrawer(dir.id)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-500/10 hover:bg-slate-500/20 text-slate-600 dark:text-slate-400 border border-slate-500/20 rounded text-[9px] font-black uppercase tracking-wider transition-colors"
                        >
                          <Search size={12} />
                          Ver Evidências
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resolutions & Memory - occupies 1 column */}
        <div className="space-y-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-500">
              Deliberações Aprovadas (Board Resolutions)
            </span>
          </div>

          <div className="p-4 bg-slate-100/80 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-900 rounded-2xl space-y-4 shadow-xs">
            <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-zinc-500 border-b border-slate-200 dark:border-white/5 pb-2">
              <span>Status da Memória:</span>
              <span className="font-bold font-mono text-emerald-650 dark:text-emerald-400 uppercase">
                {boardResolutionAppendix?.readOnlyHistoricalMemory ? 'READ_ONLY_LOCK' : 'MUTABLE'}
              </span>
            </div>

            {resolutions.length === 0 ? (
              <div className="text-center py-6 text-slate-500 dark:text-zinc-500 space-y-1">
                <FileText className="w-5 h-5 mx-auto text-slate-400 dark:text-zinc-700" />
                <p className="text-[10px] font-bold uppercase tracking-wider">Sem deliberações registradas</p>
                <p className="text-[9px] text-slate-400 dark:text-zinc-600">Nenhum evento requereu intervenção humana formal neste ciclo.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {resolutions.map((resId, idx) => (
                  <div key={idx} className="p-3 bg-slate-200/30 dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-900 rounded-xl space-y-1.5 shadow-xs">
                    <div className="flex items-center justify-between text-[9px] font-mono">
                      <span className="font-bold text-slate-700 dark:text-zinc-300">{resId}</span>
                      <div className="flex items-center gap-2">
                        <InvestigationLauncherWrapper 
                          tenantId="SYSTEM_TENANT" 
                          nodeId={resId} 
                          originSurface="BOARD_PACK" 
                        />
                        {openCognitiveDrawer && (
                          <button 
                            onClick={() => openCognitiveDrawer(resId)}
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
                            title="Explorar Contexto Cognitivo"
                          >
                            <BrainCircuit size={14} />
                          </button>
                        )}
                        <span className="text-emerald-600 dark:text-emerald-500 font-bold uppercase">APROVADA</span>
                      </div>
                    </div>
                    {approvals[idx] && (
                      <p className="text-[10px] text-slate-650 dark:text-zinc-400 leading-snug font-medium italic">
                        "{approvals[idx]}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
