import React, { useEffect, useState } from 'react';
import { ArrowLeft, BrainCircuit, Sparkles, MessageSquare, LineChart, Database, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ExecutiveMemoryService } from '../../intelligence/memory/executive-memory.service';
import { ExecutiveMemoryState } from '../../intelligence/memory/executive-memory-types';
import { AdvisoryLaunchService } from '../../services/advisory-launch.service';
import { ExecutiveEvolutionTimeline } from '../advisory/ExecutiveEvolutionTimeline';
import { ExecutiveMaturityMap } from '../advisory/ExecutiveMaturityMap';
import { ExecutiveIntelligenceArchitectureMap } from '../advisory/ExecutiveIntelligenceArchitectureMap';
import { IntelligenceDomainState } from '../../intelligence/executive-operating-model/executive-operating-model.types';
import { DomainRegistry } from '../../intelligence/diagnostics/core/domain-registry';
import { DiagnosticDomain } from '../../intelligence/diagnostics/core/diagnostic-types';

export function ExecutiveAdvisoryWorkspacePage() {
  const navigate = useNavigate();
  const [memoryState, setMemoryState] = useState<ExecutiveMemoryState | null>(null);

  useEffect(() => {
    // In a real app, 'current_org' would come from context/auth
    console.log('[Analytics] advisory_workspace_opened');
    const memory = ExecutiveMemoryService.getInstance().getMemory('current_org');
    if (memory) {
      setMemoryState(memory);
    }
  }, []);

  const contexts = memoryState ? Object.values(memoryState.activeContexts) : [];
  const mainContext = contexts.length > 0 ? contexts[contexts.length - 1] : null;

  const intelligencePortfolio = mainContext?.intelligencePortfolio || null;

  const registry = DomainRegistry.getInstance();
  const domainStates: IntelligenceDomainState[] = registry.getAllDomains().map(meta => ({
    domain: meta.domain,
    status: intelligencePortfolio?.domains[meta.domain]?.status === 'completed' ? 'established' : 'future',
    currentCapability: meta.name.replace(' Intelligence™', ''),
    strategicRole: meta.isCoreFoundation ? 'foundation' : 'growth'
  }));

  const handleLaunchAdvisory = () => {
    AdvisoryLaunchService.launchAdvisoryExperience();
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col font-sans">
      <header className="h-20 border-b border-white/5 flex items-center px-8 shrink-0">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
        <div className="mx-auto flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-white font-bold tracking-wide">Illumine</span>
        </div>
        <div className="w-20" />
      </header>

      <main className="flex-1 p-6 md:p-12 relative overflow-hidden">
        <div className="w-full max-w-6xl mx-auto relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-6 border border-blue-500/20">
              <BrainCircuit className="w-8 h-8 text-blue-500" />
            </div>
            
            <h2 className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] mb-4">
              Aqui sua inteligência executiva continua evoluindo
            </h2>
            
            <h1 className="text-4xl md:text-5xl font-light text-white">
              Executive Advisory Workspace™
            </h1>
          </div>

          {mainContext ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Coluna Esquerda: Contexto Atual e Mapas */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* 1. Executive Intelligence Summary ("Current Executive Reality") */}
                <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent before:-z-10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                  <h3 className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold mb-8">
                    Current Executive Reality
                  </h3>
                  
                  <div className="mb-8 border-b border-white/5 pb-8">
                    <span className="text-amber-500 font-medium block mb-2 text-sm uppercase tracking-wider">
                      {mainContext.organizationStage || 'Enterprise Development'}
                    </span>
                    <p className="text-white font-light text-xl leading-relaxed">
                      {mainContext.currentExecutiveReality || "The organization demonstrates financial discipline and emerging governance maturity. The next executive challenge is scaling operational capability while preserving decision quality."}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] block mb-6 font-bold">Recommended Executive Conversation™</span>
                    
                    <button 
                      onClick={handleLaunchAdvisory}
                      className="w-full p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all text-left flex items-center justify-between gap-4 relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all" />
                      <div className="relative z-10 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                          <MessageSquare className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="text-white text-lg font-medium mb-1">
                            {mainContext.recommendedConversation?.topic || "Scaling operational capability"}
                          </h4>
                          <p className="text-sm text-slate-400">
                            Iniciar discussão estratégica com Illumine Advisory.
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform relative z-10" />
                    </button>
                  </div>
                </div>

                {/* 2. Executive Intelligence Architecture Map™ */}
                <ExecutiveIntelligenceArchitectureMap domains={domainStates} />

                {/* 3. Executive Intelligence Maturity Map™ */}
                <ExecutiveMaturityMap portfolio={intelligencePortfolio} />

              </div>

              {/* Coluna Direita: Timeline */}
              <div className="lg:col-span-1">
                <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl h-full sticky top-8">
                  <ExecutiveEvolutionTimeline memoryState={memoryState} />
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-20 bg-[#0A0A0A] rounded-3xl border border-white/5">
              <p className="text-slate-500 text-lg">
                Nenhum contexto estratégico encontrado. 
                <br/>Realize um Executive Diagnostic™ para iniciar sua evolução.
              </p>
            </div>
          )}
          
        </div>
      </main>
    </div>
  );
}
