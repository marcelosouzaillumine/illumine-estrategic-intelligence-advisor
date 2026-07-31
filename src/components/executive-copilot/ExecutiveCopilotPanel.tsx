import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, MessageSquare, Lightbulb, Zap, FileText } from 'lucide-react';
import { useExecutiveUIStore } from '../../../packages/intelligence/executive-copilot/src/store/ExecutiveUIStore';
import { useExecutiveConversationStore } from '../../../packages/intelligence/executive-copilot/src/store/ExecutiveConversationStore';
import { useExecutiveKnowledgeStore } from '../../../packages/intelligence/executive-copilot/src/store/ExecutiveKnowledgeStore';
import { useGovernance } from '../../lib/governanceContext';

import { ExecutiveIdentityContext } from '../../../packages/intelligence/executive-identity-context/src/ExecutiveIdentityContext';
import { ExecutiveRelationshipEngine } from '../../../packages/intelligence/executive-relationship-intelligence/src/ExecutiveRelationshipEngine';
import { SessionEvent } from '../../../packages/intelligence/executive-relationship-intelligence/src/ExecutiveSessionIntelligence';
import { ExecutiveNarrativeRenderer } from '../../../packages/ui/executive-narrative-renderer/src';

// New Architecture Imports
import { ExecutiveIntelligencePipeline } from '../../../packages/intelligence/executive-advisor-runtime/src/ExecutiveIntelligencePipeline';
import { ExecutiveAdvisorRuntimeContext } from '../../../packages/intelligence/executive-advisor-runtime/src/ExecutiveAdvisorRuntimeContext';
import { WorkspaceAdvisoryEngine } from '../../../packages/intelligence/executive-advisor-runtime/src/WorkspaceAdvisoryEngine';
import { ExecutiveIntelligenceRenderingEngine } from '../../../packages/intelligence/executive-rendering-engine/src/ExecutiveIntelligenceRenderingEngine';
import { ExecutiveLearningCard } from './ExecutiveLearningCard';
import { ExecutivePatternCard } from './ExecutivePatternCard';
import { ExecutiveDecisionHistoryCard } from './ExecutiveDecisionHistoryCard';
import { ExecutiveDecisionTimeline } from './ExecutiveDecisionTimeline';
import { ExecutiveIntelligenceContextAssembler } from '../../../packages/intelligence/executive-intelligence-integration/src';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // ERI Observer: Intercepta ciclo de vida e invoca o Decision Engine
  React.useEffect(() => {
    // Fake Identity for validation purposes
    const mockIdentity: ExecutiveIdentityContext = {
      userId: 'test-user',
      tenantId: 'test-tenant',
      organizationId: 'test-org',
      operationalRole: 'CLIENT',
      executivePersona: 'CEO',
      permissions: [],
      sessionId: 'sess-123',
      issuedAt: new Date(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      identitySource: 'SYSTEM'
    };

    // Em produção, isso leria estado real da sessão (token, last login, etc.)
    const event = page ? SessionEvent.PAGE_CONTEXT_UPDATE : SessionEvent.FIRST_ACCESS_OF_DAY;
    
    const generatedBriefing = ExecutiveRelationshipEngine.evaluateEvent(mockIdentity, {
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
      // Cria o Runtime Context Canônico
      const runtimeContext: ExecutiveAdvisorRuntimeContext = {
        identity: {
          userId: 'user',
          tenantId: 'tenant-1',
          organizationId: 'org-1',
          operationalRole: 'CLIENT',
          executivePersona: 'Strategist',
          permissions: [],
          sessionId: 'session',
          issuedAt: new Date(),
          expiresAt: new Date(),
          identitySource: 'SYSTEM'
        },
        organization: {
          tenantId: 'tenant-1',
          companyName: 'Organização Atual',
          industry: 'Geral'
        },
        page: {
          route: window.location.pathname,
          domain: 'INSTITUTIONAL',
          capability: 'Analysis',
          purpose: page?.title || 'Dashboard',
          // @ts-ignore - added title for the mock engine
          title: page?.title
        },
        objective: {
          currentDecision: userMessage
        },
        memory: {
          previousDecisions: [],
          unresolvedIssues: []
        },
        timestamp: new Date().toISOString(),
        contextVersion: "1.0"
      };

      const engine = new WorkspaceAdvisoryEngine();
      
      setTimeout(() => setLoadingState('Identificando padrões estratégicos...'), 800);

      // Executa Pipeline (Sem texto cru, apenas JSON Contract)
      const contract = await ExecutiveIntelligencePipeline.execute(runtimeContext, engine, userMessage);
      
      addMessage({ 
        role: 'assistant', 
        content: '', // Conteúdo vazio pois renderizaremos o contrato
        metadata: { contract } 
      });
    } catch (error) {
      addMessage({ role: 'assistant', content: 'Desculpe, o isolamento do tenant impediu a operação.' });
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
              <span className="font-bold text-sm tracking-wide">Illumine Executive Advisor™</span>
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
                  <Sparkles size={32} className="mb-2 opacity-50" />
                  <p className="text-sm">Olá, {getGreetingRole()}! Conselheiro Executivo Digital ativo.</p>
                  <p className="text-xs mt-2 opacity-70">Contextualizado em {page?.title || 'nível corporativo'}.</p>
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
              <ExecutiveDecisionTimeline />
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">Historical Insights</div>
              <ExecutivePatternCard pattern={{
                patternId: 'PAT-001',
                description: 'Expansões comerciais realizadas sem validação operacional geraram necessidade posterior de correção.',
                maturity: 'VALIDATED_PATTERN',
                supportingLessons: [],
                causalEvidenceAssessment: {
                  correlationStrength: 'STRONG',
                  evidenceBase: 'Based on 4 historical decisions',
                  validationCriteria: []
                }
              }} />
              <ExecutiveLearningCard lesson={{
                lessonId: 'LES-001',
                sourceDecisionId: 'DEC-123',
                observation: { expectedOutcome: '20% margin', actualOutcome: '15% margin', variance: 'Underperformed by 5%' },
                learning: { whatWorked: ['Market entry'], whatFailed: ['Operational capacity'], principleGenerated: 'Prioritize operational capacity over rapid expansion' },
                applicability: { domains: [], futureContexts: [] },
                confidence: { level: 'validated', evidenceCount: 4 },
                temporalContext: { createdAt: new Date().toISOString() },
                scope: { domains: [] },
                tenantId: 'tenant-1'
              }} />
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
