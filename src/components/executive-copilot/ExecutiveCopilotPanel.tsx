import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, MessageSquare, Lightbulb, Zap, FileText } from 'lucide-react';
import { useExecutiveUIStore } from '../../../packages/shell/executive-copilot/src/store/ExecutiveUIStore';
import { useExecutiveConversationStore } from '../../../packages/shell/executive-copilot/src/store/ExecutiveConversationStore';
import { useExecutiveKnowledgeStore } from '../../../packages/shell/executive-copilot/src/store/ExecutiveKnowledgeStore';
import { useGovernance } from '../../lib/governanceContext';

import { ExecutiveIdentityContext } from '../../../packages/shell/executive-identity-context/src/ExecutiveIdentityContext';
import { ExecutiveRelationshipEngine } from '../../../packages/shell/executive-relationship-intelligence/src/ExecutiveRelationshipEngine';
import { SessionEvent } from '../../../packages/shell/executive-relationship-intelligence/src/ExecutiveSessionIntelligence';
import { ExecutiveNarrativeRenderer } from '../../../packages/ui/executive-narrative-renderer/src';

// New Architecture Imports
import { ExecutiveIntelligencePipeline } from '../../../packages/shell/executive-advisor-runtime/src/ExecutiveIntelligencePipeline';
import { ExecutiveAdvisorRuntimeContext } from '../../../packages/shell/executive-advisor-runtime/src/ExecutiveAdvisorRuntimeContext';
import { WorkspaceAdvisoryEngine } from '../../../packages/shell/executive-advisor-runtime/src/WorkspaceAdvisoryEngine';
import { ExecutiveIntelligenceRenderingEngine } from '../../../packages/shell/executive-rendering-engine/src/ExecutiveIntelligenceRenderingEngine';
import { ExecutiveLearningCard } from './ExecutiveLearningCard';
import { ExecutivePatternCard } from './ExecutivePatternCard';
import { ExecutiveDecisionHistoryCard } from './ExecutiveDecisionHistoryCard';
import { ExecutiveCognitiveGovernanceCard } from './ExecutiveCognitiveGovernanceCard';
import { ExecutiveDecisionTimeline } from './ExecutiveDecisionTimeline';
import { ExecutiveWorkspaceOrchestrator, ExecutiveWorkspaceSnapshot } from '../../../packages/shell/executive-workspace-orchestrator/src';
import { AdvisoryContextService } from '../../services/advisory-context.service';

import { BRAND } from "../../config/brand";

/**
 * Canonical Experience Name: Executive Advisor Workspace™
 */
export function ExecutiveCopilotPanel() {
  const { isOpen, activeTab, isMinimized, setOpen, setActiveTab, setMinimized } = useExecutiveUIStore();
  const { messages, addMessage, isTyping, setTyping } = useExecutiveConversationStore();
  const { page } = useExecutiveKnowledgeStore();
  const { role } = useGovernance();

  const getGreetingRole = () => {
     const r = role as string;
     if (r === 'MASTER' || r === 'SUPER_ADMIN' || r === 'ADMIN') return 'Administrador';
     if (r === 'ADVISOR') return 'Conselheiro';
     if (r === 'EXECUTIVE') return 'Executivo';
     return 'Cliente';
  };
  const [input, setInput] = useState('');
  const [briefing, setBriefing] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<ExecutiveWorkspaceSnapshot | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // ERI Observer: Intercepta ciclo de vida e invoca o Decision Engine
  React.useEffect(() => {
    // In production this would be the actual organization ID from auth context
    const currentOrgId = 'current_org';
    const runtimeContext = AdvisoryContextService.getCurrentRuntimeContext(currentOrgId, page);
    
    // Em produção, isso leria estado real da sessão (token, last login, etc.)
    const event = page ? SessionEvent.PAGE_CONTEXT_UPDATE : SessionEvent.FIRST_ACCESS_OF_DAY;
    
    const generatedBriefing = ExecutiveRelationshipEngine.evaluateEvent(runtimeContext.identity, {
      event,
      timestamp: new Date().toISOString(),
      pageId: page?.title,
      criticalAlerts: 0,
      recommendations: 2, 
      changes: 1,
      contextDescription: 'Ambiente executivo',
      impactDescription: 'Indicadores globais',
      recipientIdentified: true,
      potentialAction: 'Analisar números'
    });

    if (generatedBriefing) {
      setBriefing(generatedBriefing);
      // Força a abertura do painel se um briefing proativo foi gerado (CRITICAL ou PROACTIVE)
      if (!isOpen) {
         setOpen(true);
      }
    }
  }, [page]);

  const [loadingState, setLoadingState] = useState<string | null>(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setInput('');
    addMessage({ role: 'user', content: userMessage });
    setTyping(true);
    setLoadingState('Analisando contexto executivo...');

    try {
      const currentOrgId = 'current_org';
      // Cria o Runtime Context Canônico via AdvisoryContextService
      const runtimeContext = AdvisoryContextService.getCurrentRuntimeContext(currentOrgId, page);
      runtimeContext.objective = { currentDecision: userMessage };

      const orchestrator = new ExecutiveWorkspaceOrchestrator();
      
      setTimeout(() => setLoadingState('Sintetizando Snapshot Canônico...'), 800);

      // Executa Pipeline via Orchestrator, garantindo zero acoplamento
      const wsSnapshot = await orchestrator.orchestrate(runtimeContext, userMessage);
      
      setSnapshot(wsSnapshot);
      
      addMessage({ 
        role: 'assistant', 
        content: wsSnapshot.narrative.interpretation, 
        metadata: { contract: { 
           schemaVersion: '1.0', 
           executiveSummary: wsSnapshot.narrative.interpretation,
           currentSituation: { title: 'Situação', content: wsSnapshot.situation.whatChanged }
        }} 
      });
    } catch (error) {
      console.error('[Advisory] Erro ao preparar contexto executivo', error);
      addMessage({ role: 'assistant', content: 'Não conseguimos preparar seu contexto executivo neste momento. Nossa equipe de inteligência já foi notificada. Por favor, tente novamente em alguns instantes.' });
    } finally {
      setTyping(false);
      setLoadingState(null);
    }
  };

  if (!isOpen) {
    return (
      <div 
        className="fixed right-0 top-1/2 -translate-y-1/2 z-[100] bg-primary text-primary-foreground p-2 rounded-l-md cursor-pointer hover:bg-primary/90 transition-colors shadow-lg flex flex-col items-center gap-2 border border-r-0 border-border"
        onClick={() => setOpen(true)}
      >
        <Sparkles size={20} />
        <span className="text-xs font-bold [writing-mode:vertical-lr] rotate-180 tracking-widest uppercase">Advisor</span>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-80 md:w-96 bg-surface-elevated border-l border-border/40 shadow-2xl flex flex-col shrink-0 h-full relative"
        >
          {/* Header */}
          <div className="h-14 flex items-center justify-between px-4 border-b border-border/40 shrink-0 bg-surface-container/30">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-primary" />
              <span className="font-bold text-sm tracking-wide">{BRAND.advisoryName}</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setOpen(false)} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-surface-elevated rounded-md transition-colors" title="Fechar">
                <X size={18} />
              </button>
            </div>
          </div>



          {/* Tabs - Nomenclatura Canônica G5.0.2.3 */}
          <div className="flex px-2 pt-2 gap-1 border-b border-border/40 shrink-0 overflow-x-auto no-scrollbar bg-surface-container/30">
            <TabButton active={activeTab === 'briefing'} onClick={() => setActiveTab('briefing')} icon={<FileText size={14} />} label="Briefing Executivo" />
            <TabButton active={activeTab === 'conversation'} onClick={() => setActiveTab('conversation')} icon={<MessageSquare size={14} />} label="Conversa Estratégica" />
            <TabButton active={activeTab === 'actions'} onClick={() => setActiveTab('actions')} icon={<Zap size={14} />} label="Decisões & Ações" />
          </div>

          {/* Briefing Area */}
          {activeTab === 'briefing' && (
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {page && (
                <div className="bg-primary/5 px-4 py-2 border border-primary/10 rounded-md flex items-center gap-2 mb-2 shrink-0">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs text-primary font-medium truncate">
                    Contexto Organizacional: {page.title}
                  </span>
                </div>
              )}
              {briefing ? (
                <div className="bg-surface-elevated border border-border/60 p-4 rounded-lg shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3 flex items-center gap-1.5">
                    <Zap size={14} className="fill-primary/20" /> 
                    Briefing Proativo
                  </h3>
                  <div className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                    <ExecutiveNarrativeRenderer content={briefing} />
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground p-4">
                  <FileText size={32} className="mb-2 opacity-50" />
                  <p className="text-sm">Nenhum briefing proativo estruturado.</p>
                </div>
              )}
            </div>
          )}

          {/* Workspace Content Area (Not a Chat) */}
          {activeTab === 'conversation' && (
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
              {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground p-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
                    <Sparkles size={24} className="text-primary opacity-80" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">Como posso apoiar sua próxima decisão?</h3>
                  <p className="text-xs mt-2 max-w-[250px] opacity-80 leading-relaxed">
                    Estou calibrado com o contexto de <strong>{page?.title || 'nível corporativo'}</strong> e pronto para análise de cenário.
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="flex flex-col w-full">
                    {msg.role === 'user' && (
                      <div className="w-full pb-4 border-b border-border/40 mb-4">
                         <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Sua Diretriz</span>
                         <p className="text-sm text-foreground font-medium">{msg.content}</p>
                      </div>
                    )}
                    {msg.role === 'assistant' && msg.metadata?.contract && (
                      <div className="w-full flex flex-col">
                        {ExecutiveIntelligenceRenderingEngine.render(msg.metadata.contract)}
                      </div>
                    )}
                    {msg.role === 'assistant' && !msg.metadata?.contract && (
                      <div className="w-full flex flex-col bg-surface-elevated p-4 rounded-lg border border-border">
                        <ExecutiveNarrativeRenderer content={msg.content} />
                      </div>
                    )}
                  </div>
                ))
              )}
              {isTyping && (
                <div className="w-full self-start flex flex-col gap-2 items-center justify-center py-8">
                  <div className="flex items-center gap-1.5 text-primary">
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground animate-pulse">{loadingState}</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Integration Area */}
          {activeTab === 'actions' && (
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              
              {snapshot && (
                 <div className="bg-surface-container p-4 rounded-lg border border-border">
                   <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Executive Situation</h3>
                   <div className="space-y-2 text-sm text-foreground">
                      <p><strong>Domínio:</strong> {snapshot.situation.whereAmI}</p>
                      <p><strong>Cenário:</strong> {snapshot.situation.whatChanged}</p>
                      <p><strong>Atenção:</strong> {snapshot.situation.whatNeedsAttention}</p>
                      <p><strong>Risco:</strong> <span className="text-destructive">{snapshot.situation.highestRisk}</span></p>
                      <p><strong>Oportunidade:</strong> <span className="text-green-600">{snapshot.situation.highestOpportunity}</span></p>
                   </div>
                   
                   <div className="mt-4">
                     {(() => {
                        const testScore = {
                          overallScore: 87,
                          evidenceQuality: 18,
                          reasoningCompleteness: 18,
                          contradictionAnalysis: 12,
                          agentDiversity: 14,
                          historicalValidation: 12,
                          reflectionQuality: 13,
                          strengths: ['Historical consistency', 'Sufficient evidence', 'Consensus approved'],
                          warnings: ['Financial Agent diverged', 'Pessimistic scenario under-explored']
                        };
                        return <ExecutiveCognitiveGovernanceCard score={testScore} />;
                     })()}
                   </div>
                 </div>
              )}

              <ExecutiveDecisionTimeline />
              
              {snapshot && (
                <>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">Historical Insights</div>
                  {snapshot.institutionalPatterns.map(pattern => (
                     <ExecutivePatternCard key={pattern.patternId} pattern={pattern} />
                  ))}
                  {snapshot.institutionalLearning.map(lesson => (
                     <ExecutiveLearningCard key={lesson.lessonId} lesson={lesson} />
                  ))}
                </>
              )}
              
              {!snapshot && (
                 <div className="text-center text-muted-foreground p-4 text-sm border border-dashed border-border rounded-md mt-4">
                    Interaja com a Conversa Estratégica para gerar o Snapshot Canônico.
                 </div>
              )}
            </div>
          )}

          {/* Input Area */}
          {activeTab === 'conversation' && (
            <div className="p-4 border-t border-border/40 bg-surface-container/30 shrink-0">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Qual decisão você precisa tomar?"
                  className="w-full bg-background border border-border rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          )}

        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-lg transition-colors border-b-2 ${
        active 
          ? 'text-primary border-primary bg-primary/5' 
          : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-surface-container'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
