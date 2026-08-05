// @ts-nocheck
import { ExecutiveText } from '@/components/ui/executive-typography';
import { ExecutiveHeading } from '@/components/ui/executive-heading';
import { ExecutiveSurface } from '@/components/ui/executive-surface';
import { ExecutiveMetricCard } from '@/components/ui/executive-metric-card';
import { ExecutiveBadge } from '@/components/ui/executive-badge';

import React, { useState, useMemo } from 'react';
import { Brain, Target, Activity, Scale, Building, Users, ShieldCheck, ShieldAlert, ChevronRight, ChevronDown, Info, AlertCircle, CheckCircle2, Clock, TrendingUp, Dna, Lock, Compass, Coins, HeartPulse, Workflow, Sparkles, ArrowRight, TrendingDown, Calendar, Layers, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageHeader } from '@/components/Common';
import { useLanguage } from '@/contexts/LanguageContext';
import { useInstitutionalAuth } from '@/hooks/useInstitutionalAuth';
import { FiduciaryRuntimeAdapter, ESGIMDimension, ESGIMMode, ESGIMScenario, IRILevel, BoardPriority, BoardExecutiveBrief, GovernanceMonitoringSnapshot, GovernanceMonitoringResult, DecisionExecutionRisk } from '@/services/FiduciaryRuntimeAdapter';
import { ExecutiveBoardReportModal } from '@/components/modals/ExecutiveBoardReportModal';
import { BoardPackPreviewModal } from '@/components/modals/BoardPackPreviewModal';
import { GovernanceExecutionPanel } from './GovernanceExecutionPanel';
import { BoardMeetingMode } from './BoardMeetingMode';
import { GovernanceKnowledgePanel } from './GovernanceKnowledgePanel';
import { BenchmarkReadinessPanel } from './BenchmarkReadinessPanel';
import { BenchmarkComparativePanel } from './BenchmarkComparativePanel';
import { BenchmarkAdvisoryPanel } from './BenchmarkAdvisoryPanel';
import { GovernanceLearningPanel } from './GovernanceLearningPanel';
import { GovernanceJourneyPanel } from './GovernanceJourneyPanel';
import { InvestigationLauncherWrapper } from '../../investigation/InvestigationLauncherWrapper';

export function ESGIMAssessmentPage({ clientId }: { clientId: string }) {
  const { translateLabel: t } = useLanguage();
  const { session } = useInstitutionalAuth();
  
  // 1. Role Access Restriction Check
  const userRole = session?.role || '';
  const hasAccess = useMemo(() => {
    return (
      userRole === 'SUPER_ADMIN' || 
      userRole === 'TENANT_ADMIN' || 
      userRole === 'BOARD_MEMBER' || 
      userRole === 'ADVISOR' || 
      userRole === 'CFO' || 
      userRole === 'CONTROLLER'
    );
  }, [userRole]);

  // 2. State configuration
  const [mode, setMode] = useState<ESGIMMode>('DEMO_SCENARIO');
  const [demoScenario, setDemoScenario] = useState<ESGIMScenario>('STANDARD');
  const [activeExplainTab, setActiveExplainTab] = useState<'evidences' | 'rules' | 'lineage'>('evidences');
  
  // Track expanded priority card IDs
  const [expandedPriorities, setExpandedPriorities] = useState<Record<string, boolean>>({});
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isBoardPackModalOpen, setIsBoardPackModalOpen] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState<'maturity' | 'execution' | 'meeting'>('maturity');
  const [activeView, setActiveView] = useState<'EXECUTIVE_JOURNEY' | 'DEEP_ANALYSIS'>('EXECUTIVE_JOURNEY');

  const handleTransformPriorityToDecision = (priority: BoardPriority) => {
    const baseTime = Date.now();
    let daysToAdd = 30;
    const windowStr = priority.estimatedWindow.toLowerCase();
    if (windowStr.includes('24h') || windowStr.includes('1 dia')) daysToAdd = 1;
    else if (windowStr.includes('2 dias')) daysToAdd = 2;
    else if (windowStr.includes('7 dias') || windowStr.includes('1 semana')) daysToAdd = 7;
    else if (windowStr.includes('15 dias')) daysToAdd = 15;
    else if (windowStr.includes('30 dias') || windowStr.includes('1 mês')) daysToAdd = 30;
    else if (windowStr.includes('90 dias') || windowStr.includes('3 meses')) daysToAdd = 90;
    else if (windowStr.includes('180 dias') || windowStr.includes('6 meses')) daysToAdd = 180;
    else if (windowStr.includes('ano')) daysToAdd = 365;

    const dueDate = new Date(baseTime + daysToAdd * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    let executionRisk: DecisionExecutionRisk = 'LOW';
    if (priority.impact === 'CRITICAL') executionRisk = 'CRITICAL';
    else if (priority.impact === 'HIGH') executionRisk = 'HIGH';
    else if (priority.impact === 'MODERATE') executionRisk = 'MODERATE';

    const newDec = {
      id: `DEC-BPE-${priority.id}-${baseTime}`,
      title: priority.title,
      description: priority.description,
      source: 'BPE' as const,
      category: priority.category,
      decisionType: 'STRATEGIC_INITIATIVE' as const,
      originEngine: 'BPE' as const,
      executionRisk,
      assignedTo: undefined,
      createdAt: new Date().toISOString(),
      dueDate,
      status: 'OPEN' as const,
      expectedBenefit: priority.expectedBenefit,
      evidence: priority.evidence,
      lineageHash: `LIN-GDTL-BPE-${priority.id}-${baseTime}`,
      approvedByBoard: false
    };

    FiduciaryRuntimeAdapter.decisionRegistryEngine.addDecision(newDec);
    setActiveMainTab('execution');
  };

  // 3. Engine calculation triggers
  const assessment = useMemo(() => {
    return FiduciaryRuntimeAdapter.esgimAssessmentEngine.calculateAssessment(clientId, mode, demoScenario);
  }, [clientId, mode, demoScenario]);

  const resilience = useMemo(() => {
    return FiduciaryRuntimeAdapter.institutionalResilienceIndexEngine.calculateResilience(clientId, mode, demoScenario);
  }, [clientId, mode, demoScenario]);

  // 4. Board Priorities Engine Calculation
  const { brief, priorities } = useMemo(() => {
    return FiduciaryRuntimeAdapter.boardPrioritiesEngine.generatePriorities(clientId, mode, demoScenario);
  }, [clientId, mode, demoScenario]);

  // 5. Governance Roadmap Engine Calculation
  const roadmap = useMemo(() => {
    return FiduciaryRuntimeAdapter.governanceRoadmapEngine.generateRoadmap(clientId, mode, demoScenario);
  }, [clientId, mode, demoScenario]);

  // 6. Governance Monitoring Engine Calculation
  const monitoring = useMemo(() => {
    return FiduciaryRuntimeAdapter.governanceMonitoringEngine.calculateMonitoring(clientId, mode, demoScenario);
  }, [clientId, mode, demoScenario]);

  // Toggle priority detail accordion
  const togglePriority = (id: string) => {
    setExpandedPriorities(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Restricted Access View
  if (!hasAccess && session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-surface-container text-white">
        <div className="p-4 bg-critical-soft0/10 border border-rose-500/20 text-rose-700 rounded-2xl mb-4">
          <ShieldAlert className="w-12 h-12 mx-auto" />
        </div>
        <ExecutiveHeading as="h2" className="text-primary mb-2">Acesso Restrito</ExecutiveHeading>
    <p className="text-executive-secondary text-sm max-w-md">
          Esta área é restrita a Conselheiros (Board), Assessores (Advisor), Executivos e Administradores da holding.
        </p>
      </div>
    );
  }

  // Get ESGIM status color palette
  const getESGIMStatusClasses = (status: string) => {
    switch (status) {
      case 'EXCELLENT':
        return {
          text: 'text-emerald-400',
          bg: 'bg-success-soft0/10',
          border: 'border-emerald-500/20',
          fill: 'var(--color-executive-primary)',
          bgBar: 'bg-success-soft0'
        };
      case 'MATURE':
        return {
          text: 'text-teal-400',
          bg: 'bg-teal-500/10',
          border: 'border-teal-500/20',
          fill: 'var(--color-executive-primary)',
          bgBar: 'bg-teal-500'
        };
      case 'DEVELOPING':
        return {
          text: 'text-sky-400',
          bg: 'bg-sky-500/10',
          border: 'border-sky-500/20',
          fill: 'var(--color-executive-primary)',
          bgBar: 'bg-sky-500'
        };
      case 'CONCERN':
        return {
          text: 'text-amber-400',
          bg: 'bg-warning-soft0/10',
          border: 'border-amber-500/20',
          fill: 'var(--color-executive-primary)',
          bgBar: 'bg-warning-soft0'
        };
      case 'CRITICAL':
      default:
        return {
          text: 'text-rose-400',
          bg: 'bg-critical-soft0/10',
          border: 'border-rose-500/20',
          fill: 'var(--color-executive-primary)',
          bgBar: 'bg-critical-soft0'
        };
    }
  };

  // Get IRI status color palette
  const getIRIStatusClasses = (level: IRILevel) => {
    switch (level) {
      case 'HIGH_RESILIENCE':
        return {
          text: 'text-emerald-400',
          bg: 'bg-success-soft0/10',
          border: 'border-emerald-500/20',
          fill: 'var(--color-executive-primary)',
          bgBar: 'bg-success-soft0'
        };
      case 'RESILIENT':
        return {
          text: 'text-teal-400',
          bg: 'bg-teal-500/10',
          border: 'border-teal-500/20',
          fill: 'var(--color-executive-primary)',
          bgBar: 'bg-teal-500'
        };
      case 'MODERATE':
        return {
          text: 'text-sky-400',
          bg: 'bg-sky-500/10',
          border: 'border-sky-500/20',
          fill: 'var(--color-executive-primary)',
          bgBar: 'bg-sky-500'
        };
      case 'FRAGILE':
        return {
          text: 'text-amber-400',
          bg: 'bg-warning-soft0/10',
          border: 'border-amber-500/20',
          fill: 'var(--color-executive-primary)',
          bgBar: 'bg-warning-soft0'
        };
      case 'CRITICAL':
      default:
        return {
          text: 'text-rose-400',
          bg: 'bg-critical-soft0/10',
          border: 'border-rose-500/20',
          fill: 'var(--color-executive-primary)',
          bgBar: 'bg-critical-soft0'
        };
    }
  };

  const esgimStyles = getESGIMStatusClasses(assessment.maturityLevel);
  const iriStyles = getIRIStatusClasses(resilience.level);

  // Map icons for ESGIM dimensions
  const getDimensionIcon = (dim: ESGIMDimension) => {
    switch (dim) {
      case 'Environmental': return <Building className="w-4 h-4 text-emerald-400" />;
      case 'Social': return <Users className="w-4 h-4 text-teal-400" />;
      case 'Governance': return <Scale className="w-4 h-4 text-sky-400" />;
      case 'Institutional': return <Clock className="w-4 h-4 text-amber-400" />;
      case 'Mission': return <Target className="w-4 h-4 text-rose-400" />;
    }
  };

  // Get Urgency/Horizon classes
  const getUrgencyBadgeClasses = (urgency: string) => {
    switch (urgency) {
      case 'IMMEDIATE':
        return 'text-rose-400 border-rose-500/20 bg-critical-soft0/5';
      case 'SHORT_TERM':
        return 'text-amber-400 border-amber-500/20 bg-warning-soft0/5';
      case 'MEDIUM_TERM':
        return 'text-teal-400 border-teal-500/20 bg-teal-500/5';
      case 'LONG_TERM':
      default:
        return 'text-muted-foreground border-border bg-surface-container 500/5';
    }
  };

  // Get Impact classes
  const getImpactBadgeClasses = (impact: string) => {
    switch (impact) {
      case 'CRITICAL':
        return 'text-rose-400 bg-critical-soft0/10 border-rose-500/20';
      case 'HIGH':
        return 'text-amber-400 bg-warning-soft0/10 border-amber-500/20';
      case 'MODERATE':
        return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
      case 'LOW':
      default:
        return 'text-muted-foreground bg-surface-container 500/10 border-border';
    }
  };

  // Get Risk Level class styling
  const getRiskLevelStyles = (risk: string) => {
    switch (risk) {
      case 'CRITICAL':
        return 'text-rose-400 bg-critical-soft0/10 border-rose-500/20';
      case 'HIGH':
        return 'text-amber-400 bg-warning-soft0/10 border-amber-500/20';
      case 'MODERATE':
        return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
      case 'LOW':
      default:
        return 'text-emerald-400 bg-success-soft0/10 border-emerald-500/20';
    }
  };

  // Check if phase is highlighted based on maturityStage
  const isPhaseHighlighted = (phaseId: string, stage: string) => {
    if (phaseId === 'PH-01' && stage === 'STABILIZATION') return true;
    if (phaseId === 'PH-02' && stage === 'STRUCTURING') return true;
    if (phaseId === 'PH-03' && stage === 'STRENGTHENING') return true;
    if (phaseId === 'PH-04' && stage === 'SCALING') return true;
    if (phaseId === 'PH-05' && stage === 'LEGACY') return true;
    return false;
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-8 pb-32 animate-executive-fade bg-surface-container text-white">
      
      <PageHeader 
        title={activeView === 'EXECUTIVE_JOURNEY' ? "Jornada de Governança™" : "Cockpit de Governança Institucional"}
        subtitle={activeView === 'EXECUTIVE_JOURNEY' ? "Home Executiva: Acompanhe a maturidade, resiliência, riscos e evolução da organização em uma jornada unificada." : "Mapeamento duplo do estado corporativo atual (ESGIM™), resiliência futura (IRI™), prioridades (BPE™) e plano de evolução (GRE™)."}
        icon={Brain}
        transparent
        actions={
          <div className="flex items-center gap-8 justify-end">
            
            {/* ESGIM Score */}
            <div className="text-right">
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-1 block">Maturidade ESGIM™</span>
              <div className="text-3xl font-light flex items-center justify-end gap-1.5">
                <span className={esgimStyles.text}>{assessment.overallScore}</span>
        <span className="text-sm text-executive-secondary">/100</span>
              </div>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded-lg text-[9px] font-black tracking-widest border uppercase ${esgimStyles.bg} ${esgimStyles.text} ${esgimStyles.border}`}>
                {assessment.maturityLevel}
              </span>
            </div>

            {/* Divider line */}
            <div className="w-px h-10 bg-card/10" />

            {/* IRI Score */}
            <div className="text-right">
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-1 block">Resiliência IRI™</span>
              <div className="text-3xl font-light flex items-center justify-end gap-1.5">
                <span className={iriStyles.text}>{resilience.score}</span>
        <span className="text-sm text-executive-secondary">/100</span>
              </div>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded-lg text-[9px] font-black tracking-widest border uppercase ${iriStyles.bg} ${iriStyles.text} ${iriStyles.border}`}>
                {resilience.level.replace('_', ' ')}
              </span>
            </div>

          </div>
        }
      />

      {/* 2. Controls Section */}
      <div className="bg-card border border-border rounded-2xl p-6 border border-white/5 bg-surface-container/50 backdrop-blur-md rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <ExecutiveHeading as="h3" className="text-primary">Filtro de Leitura Estrutural</ExecutiveHeading>
     <ExecutiveText as="div" variant="bodyStandard" className="text-executive-secondary">Diferencie entre dados contábeis auditados (LIVE_DATA) e simulações cognitivas de estresse (DEMO_SCENARIO).</ExecutiveText>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex p-1 bg-surface-container 950/60 rounded-xl border border-white/5">
            <button
              onClick={() => setMode('LIVE_DATA')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${
                mode === 'LIVE_DATA' 
                  ? 'bg-surface-high text-white border border-white/10 shadow-md' 
                  : 'text-muted-foreground hover:text-muted-foreground'
              }`}
            >
              Live Data
            </button>
            <button
              onClick={() => setMode('DEMO_SCENARIO')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${
                mode === 'DEMO_SCENARIO' 
                  ? 'bg-secondary text-white border border-white/10 shadow-md' 
                  : 'text-muted-foreground hover:text-muted-foreground'
              }`}
            >
              Demo Scenario
            </button>
          </div>

          {mode === 'DEMO_SCENARIO' && (
            <div className="relative">
              <select
                value={demoScenario}
                onChange={(e: any) => setDemoScenario(e.target.value)}
                className="bg-surface-container 950/80 border border-white/10 hover:border-white/20 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground outline-none cursor-pointer min-w-[280px]"
              >
                <option value="STANDARD">1. Standard Baseline (Saudável)</option>
                <option value="CONSTITUTIONAL_BREACH">2. Constitutional Breach (Capped 39)</option>
                <option value="FOUNDER_EXIT">3. Founder Exit (Blocks High Resilience)</option>
                <option value="LIQUIDITY_SHOCK">4. Liquidity Shock (Capped 39)</option>
                <option value="MARKET_DISRUPTION">5. Market Disruption (Blocks High Resilience)</option>
                <option value="MISSION_STRESS">6. Mission Stress (Capped 59)</option>
              </select>
            </div>
          )}

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-secondary hover:bg-secondary/90 border border-transparent rounded-xl text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-secondary/10 hover:shadow-secondary/20 hover:-translate-y-0.5 transition-all duration-200"
          >
            <ShieldCheck size={14} className="animate-pulse" />
            Gerar Relatório Executivo
          </button>

          {/* BPG Board Pack Button */}
          <button
            onClick={() => setIsBoardPackModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-surface-container hover:bg-surface-container/90 border border-transparent rounded-xl text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-[var(--color-executive-primary)]/10 hover:shadow-[var(--color-executive-primary)]/20 hover:-translate-y-0.5 transition-all duration-200"
          >
            <Activity size={14} className="animate-pulse" />
            Gerar Board Pack
          </button>
        </div>
      </div>

      {/* Warning if Simulation active */}
      {mode === 'DEMO_SCENARIO' && (
        <div className="p-4 bg-warning-soft0/5 border border-amber-500/10 text-amber-700 rounded-xl text-xs flex items-center gap-3">
          <Info className="w-5 h-5 flex-shrink-0" />
          <span>
            <strong>Simulação de Stress Ativa:</strong> Exibindo o cenário <strong>{demoScenario}</strong>. Isto valida as arbitragens cognitivas e testes de resistência de forma isolada sem alterar os dados históricos reais.
          </span>
        </div>
      )}

      {/* Sleek View Switcher (Home Switcher) */}
      <div className="flex border-b border-white/5 bg-surface-container 950/20 rounded-xl p-1 max-w-xl">
        <button
          onClick={() => setActiveView('EXECUTIVE_JOURNEY')}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${
            activeView === 'EXECUTIVE_JOURNEY'
              ? 'bg-primary border border-primary text-primary'
              : 'text-muted-foreground hover:text-muted-foreground'
          }`}
        >
          Jornada Executiva (Home)
        </button>
        <button
          onClick={() => setActiveView('DEEP_ANALYSIS')}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${
            activeView === 'DEEP_ANALYSIS'
              ? 'bg-secondary/10 border border-secondary/20 text-secondary'
              : 'text-muted-foreground hover:text-muted-foreground'
          }`}
        >
          Deep Analysis (Detalhamento)
        </button>
      </div>

      {activeView === 'EXECUTIVE_JOURNEY' ? (
        <GovernanceJourneyPanel 
          clientId={clientId}
          mode={mode}
          scenario={demoScenario}
          onNavigate={(targetTab, sectionId) => {
            setActiveView('DEEP_ANALYSIS');
            setActiveMainTab(targetTab);
            if (sectionId) {
              setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }, 100);
            }
          }}
        />
      ) : (
        <>
          {/* Cockpit Tabs selector */}
          <div className="flex border-b border-white/5 bg-surface-container 950/20 rounded-xl p-1 max-w-xl">
            <button
              onClick={() => setActiveMainTab('maturity')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${
                activeMainTab === 'maturity'
                  ? 'bg-secondary/10 border border-secondary/20 text-secondary'
                  : 'text-muted-foreground hover:text-muted-foreground'
              }`}
            >
              Maturidade e Resiliência
            </button>
            <button
              onClick={() => setActiveMainTab('execution')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeMainTab === 'execution'
                  ? 'bg-secondary/10 border border-secondary/20 text-secondary'
                  : 'text-muted-foreground hover:text-muted-foreground'
              }`}
            >
              <Activity size={12} />
              Execução (GDTL™)
            </button>
            <button
              onClick={() => setActiveMainTab('meeting')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeMainTab === 'meeting'
                  ? 'bg-secondary/10 border border-secondary/20 text-secondary'
                  : 'text-muted-foreground hover:text-muted-foreground'
              }`}
            >
              <Users size={12} />
              Entrar em Reunião (BMM™)
            </button>
          </div>

          {activeMainTab === 'maturity' && (
            <>
              {/* 3. Main Grid layout: Heatmaps & Circular Gauges */}
              <div id="esgim-maturity" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Heatmaps (lg:col-span-8) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Column A: ESGIM Heatmap */}
          <div className="bg-card border border-border rounded-2xl p-6 border border-white/5 bg-surface-container rounded-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <ExecutiveHeading as="h3" className="text-primary flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Eixos de Maturidade (ESGIM™)
              </ExecutiveHeading>
              <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Estado Atual</span>
            </div>

            <div className="space-y-5">
              {assessment.dimensions.map((dim, i) => {
                const styles = getESGIMStatusClasses(dim.status);
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-muted-foreground">
                        {getDimensionIcon(dim.dimension)}
                        <span>{dim.dimension}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase ${styles.bg} ${styles.text} ${styles.border}`}>
                          {dim.status}
                        </span>
                        <span className="font-bold font-mono text-muted-foreground">{dim.score}</span>
                      </div>
                    </div>
                    
                    <div className="w-full h-1.5 bg-surface-container 950/60 rounded-full overflow-hidden border border-white/5 relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${dim.score}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full ${styles.bgBar}`} 
                      />
                    </div>
          <p className="text-executive-secondary">
                      {dim.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column B: IRI Resilience Heatmap */}
          <div className="bg-card border border-border rounded-2xl p-6 border border-white/5 bg-surface-container rounded-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <ExecutiveHeading as="h3" className="text-primary flex items-center gap-2">
                <Compass className="w-4 h-4 text-primary" />
                Dimensões de Resiliência (IRI™)
              </ExecutiveHeading>
              <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Continuidade</span>
            </div>

            <div className="space-y-5">
              
              {/* 1. Fiduciary Resilience */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-muted-foreground">
                    <Coins className="w-4 h-4 text-emerald-400" />
                    <span>Fiduciary Resilience</span>
                  </div>
                  <span className="font-bold font-mono text-muted-foreground">{resilience.fiduciaryResilience}</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container 950/60 rounded-full overflow-hidden border border-white/5 relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${resilience.fiduciaryResilience}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full bg-success-soft0" 
                  />
                </div>
        <p className="text-executive-secondary">
                  Mede o runway financeiro, a liquidez de tesouraria e a suficiência de capital sob stress agudo.
                </p>
              </div>

              {/* 2. Institutional Resilience */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-muted-foreground">
                    <Workflow className="w-4 h-4 text-teal-400" />
                    <span>Institutional Resilience</span>
                  </div>
                  <span className="font-bold font-mono text-muted-foreground">{resilience.institutionalResilience}</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container 950/60 rounded-full overflow-hidden border border-white/5 relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${resilience.institutionalResilience}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full bg-teal-500" 
                  />
                </div>
        <p className="text-executive-secondary">
                  Mede a ausência de personificação do legado, blindagem sucessória e formalização corporativa.
                </p>
              </div>

              {/* 3. Prospective Resilience */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-muted-foreground">
                    <TrendingUp className="w-4 h-4 text-sky-400" />
                    <span>Prospective Resilience</span>
                  </div>
                  <span className="font-bold font-mono text-muted-foreground">{resilience.prospectiveResilience}</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container 950/60 rounded-full overflow-hidden border border-white/5 relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${resilience.prospectiveResilience}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full bg-sky-500" 
                  />
                </div>
        <p className="text-executive-secondary">
                  Mede a adaptabilidade estratégica, prontidão para inovação e capacidade de transição de ciclos.
                </p>
              </div>

              {/* 4. Mission Continuity */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-muted-foreground">
                    <HeartPulse className="w-4 h-4 text-rose-400" />
                    <span>Mission Continuity</span>
                  </div>
                  <span className="font-bold font-mono text-muted-foreground">{resilience.missionContinuity}</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container 950/60 rounded-full overflow-hidden border border-white/5 relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${resilience.missionContinuity}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full bg-critical-soft0" 
                  />
                </div>
        <p className="text-executive-secondary">
                  Mede a solidez existencial do propósito do fundador mesmo em períodos de reestruturação severa.
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Right Side: Circular Gauges (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-6 border border-white/5 bg-surface-container rounded-2xl space-y-6 flex flex-col items-center justify-center">
          
          <div className="text-center">
            <ExecutiveHeading as="h4" className="text-primary">Gauges de Diagnóstico</ExecutiveHeading>
      <ExecutiveText as="div" variant="bodyStandard" className="text-executive-secondary">Maturidade operacional versus capacidade de sobrevivência.</ExecutiveText>
          </div>

          <div className="grid grid-cols-2 gap-6 w-full">
            
            {/* Meter 1: ESGIM */}
            <div className="flex flex-col items-center text-center">
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-3 block">ESGIM™ Atual</span>
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="8" fill="none" />
                  <motion.circle 
                    cx="50" cy="50" r="42" stroke={esgimStyles.fill} strokeWidth="8" strokeDasharray="264"
                    initial={{ strokeDashoffset: 264 }}
                    animate={{ strokeDashoffset: 264 - (264 * assessment.overallScore) / 100 }}
                    transition={{ duration: 1.0, ease: 'easeOut' }}
                    fill="none" strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-xl font-light text-primary">{assessment.overallScore}</span>
                </div>
              </div>
              <span className={`inline-block mt-3 px-2 py-0.5 rounded text-[8px] font-black tracking-widest border uppercase ${esgimStyles.bg} ${esgimStyles.text} ${esgimStyles.border}`}>
                {assessment.maturityLevel}
              </span>
            </div>

            {/* Meter 2: IRI */}
            <div className="flex flex-col items-center text-center">
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-3 block">Resiliência IRI™</span>
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="8" fill="none" />
                  <motion.circle 
                    cx="50" cy="50" r="42" stroke={iriStyles.fill} strokeWidth="8" strokeDasharray="264"
                    initial={{ strokeDashoffset: 264 }}
                    animate={{ strokeDashoffset: 264 - (264 * resilience.score) / 100 }}
                    transition={{ duration: 1.0, ease: 'easeOut' }}
                    fill="none" strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-xl font-light text-primary">{resilience.score}</span>
                </div>
              </div>
              <span className={`inline-block mt-3 px-2 py-0.5 rounded text-[8px] font-black tracking-widest border uppercase ${iriStyles.bg} ${iriStyles.text} ${iriStyles.border}`}>
                {resilience.level.replace('_', ' ')}
              </span>
            </div>

          </div>

          <div className="w-full h-px bg-card/5" />
          <div className="text-[10px] text-muted-foreground text-center leading-relaxed px-1">
            Maturidade mede processos em execução; resiliência prevê comportamento frente a choques severos.
          </div>
        </div>

      </div>

      {/* 4. Board Executive Brief Card (Unified BPE™ Synthesis) */}
      <div className="bg-card border border-border rounded-2xl p-8 border border-amber-500/10 bg-surface-container rounded-2xl relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-warning-soft0/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <div className="p-2 bg-warning-soft0/10 border border-amber-500/20 text-amber-700 rounded-xl">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-black block">Board Priorities Engine (BPE™)</span>
            <ExecutiveHeading as="h3" className="font-display text-primary">Board Executive Brief</ExecutiveHeading>
          </div>
        </div>

        {/* Brief Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-7 space-y-4">
            <ExecutiveHeading as="h4" className="text-amber-300 font-sans italic">
              "{brief.headline}"
            </ExecutiveHeading>
      <p className="text-sm text-executive-secondary leading-relaxed font-sans font-normal border-l-2 border-amber-500/30 pl-4">
              {brief.summary}
            </p>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 bg-surface-container 950/40 border border-white/5 rounded-xl space-y-1.5">
              <span className="text-[9px] font-black uppercase tracking-widest text-rose-400 block">Principal Risco</span>
              <span className="text-xs text-muted-foreground font-medium leading-relaxed">{brief.primaryRisk}</span>
            </div>

            <div className="p-4 bg-surface-container 950/40 border border-white/5 rounded-xl space-y-1.5">
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 block">Principal Oportunidade</span>
              <span className="text-xs text-muted-foreground font-medium leading-relaxed">{brief.primaryOpportunity}</span>
            </div>

            <div className="p-4 bg-surface-container 950/40 border border-amber-500/10 rounded-xl sm:col-span-2 space-y-1.5">
              <span className="text-[9px] font-black uppercase tracking-widest text-amber-400 block">Foco Recomendado pelo BPE™</span>
              <span className="text-xs text-amber-200/90 font-bold leading-relaxed flex items-center gap-2">
                <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                {brief.recommendedFocus}
              </span>
            </div>

          </div>

        </div>
      </div>

      {/* 5. Top 5 Priorities Roadmap (BPE™ Dashboard Row) */}
      <div id="bpe-priorities" className="space-y-6">
        <div>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black block">Plano de Direcionamento Executivo</span>
          <ExecutiveHeading as="h3" className="font-display text-primary">Top 5 Recomendações Prioritárias do Conselho</ExecutiveHeading>
        </div>

        <div className="space-y-4">
          {priorities.map((priority, index) => {
            const isExpanded = !!expandedPriorities[priority.id];
            const urgencyStyles = getUrgencyBadgeClasses(priority.urgency);
            const impactStyles = getImpactBadgeClasses(priority.impact);
            
            return (
              <div 
                key={priority.id}
                className="bg-card border border-border rounded-2xl border border-white/5 bg-surface-container hover:border-accent transition-all rounded-2xl overflow-hidden"
              >
                {/* Header row of priority card */}
                <div 
                  onClick={() => togglePriority(priority.id)}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Rank Badge */}
                    <div className="w-10 h-10 rounded-xl bg-surface-container 950/80 border border-white/10 hover:border-accent flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-[9px] text-muted-foreground font-bold uppercase leading-none">Rank</span>
                      <span className="text-base font-bold font-mono text-primary leading-none mt-0.5">#{index + 1}</span>
                    </div>

                    {/* Title & description summary */}
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <ExecutiveHeading as="h4" className="text-primary truncate">
                          {priority.title}
                        </ExecutiveHeading>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          Priority Score: <strong className="text-primary font-black">{priority.priorityScore}</strong>
                        </span>
                        <InvestigationLauncherWrapper 
                          tenantId="SYSTEM_TENANT" 
                          nodeId={priority.id} 
                          originSurface="ESGIM" 
                        />
                      </div>
           <p className="text-executive-secondary">
                        {priority.description}
                      </p>
                    </div>
                  </div>

                  {/* Metadata Indicators row */}
                  <div className="flex flex-wrap items-center gap-3.5 flex-shrink-0">
                    
                    {/* Urgency/Window */}
                    <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black tracking-wider border uppercase ${urgencyStyles}`}>
                      {priority.urgency.replace('_', ' ')} ({priority.estimatedWindow})
                    </span>

                    {/* Impact */}
                    <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black tracking-wider border uppercase ${impactStyles}`}>
                      Impacto: {priority.impact}
                    </span>

                    {/* Decision Category */}
                    <span className="px-2.5 py-0.5 rounded-lg text-[9px] font-black tracking-wider bg-surface-container 950/80 border border-white/5 text-muted-foreground uppercase">
                      {priority.decisionCategory}
                    </span>

                    {/* Expand Chevron */}
                    <div className="p-1 text-muted-foreground hover:text-muted-foreground transition-colors">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>

                  </div>

                </div>

                {/* Expanded Accordion Panel */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-6 pt-1 border-t border-white/5 bg-surface-container 950/30 space-y-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3">
                          
                          {/* Expected Benefit */}
                          <div className="space-y-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">Benefício Esperado</span>
              <p className="text-executive-secondary">
                              {priority.expectedBenefit}
                            </p>
                          </div>

                          {/* Impact Area */}
                          <div className="space-y-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">Área de Impacto Mapeada</span>
                            <div className="flex flex-wrap gap-2 pt-0.5">
                              {priority.expectedImpactArea.map((area, idx) => (
                                <span key={idx} className="px-2.5 py-1 bg-primary border border-primary text-primary font-bold rounded-lg text-[10px] uppercase">
                                  {area}
                                </span>
                              ))}
                            </div>
                          </div>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/5 pt-4">
                          
                          {/* Evidences list */}
                          <div className="space-y-3">
                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">Sinais e Evidências Coletadas</span>
                            <div className="space-y-2">
                              {priority.evidence.map((ev, idx) => (
                                <div key={idx} className="p-3 bg-surface-container 950/40 border border-white/5 rounded-xl flex items-start gap-2">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                                  <span className="text-[11px] text-muted-foreground leading-relaxed">{ev}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Explainability / Rationale */}
                          <div className="space-y-3">
                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">Justificativa da Constituição Cognitiva</span>
                            <div className="space-y-2">
                              {priority.explainability.map((ex, idx) => (
                                <div key={idx} className="p-3 bg-surface-container 950/40 border border-white/5 rounded-xl flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                  <span className="text-[11px] text-muted-foreground leading-relaxed">{ex}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>

                        <div className="flex justify-end pt-4 border-t border-white/5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTransformPriorityToDecision(priority);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent border border-accent hover:border-accent text-accent hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                          >
                            <Activity size={12} />
                            Transformar em Plano de Ação (GDTL™)
                          </button>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Governance Roadmap™ Dashboard Section (GRE™) */}
      <div id="gre-roadmap" className="bg-card border border-border rounded-2xl p-8 border border-white/5 bg-surface-container rounded-2xl space-y-8">
        
        {/* GRE Title & Progress / Risk Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary border border-primary text-primary rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-black block">Governance Roadmap Engine (GRE™)</span>
              <ExecutiveHeading as="h3" className="font-display text-primary">Plano de Evolução Institucional</ExecutiveHeading>
            </div>
          </div>

          <div className="flex items-center gap-6">
            
            {/* Stage */}
            <div className="text-right">
              <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold block mb-1">Estágio de Maturidade</span>
              <span className="inline-block px-3 py-1 bg-primary border border-primary text-primary text-xs font-black uppercase tracking-widest rounded-lg">
                {roadmap.maturityStage}
              </span>
            </div>

            {/* Progress */}
            <div className="text-right min-w-[120px]">
              <div className="flex justify-between text-[9px] text-muted-foreground uppercase font-bold mb-1">
                <span>Executado</span>
                <span className="text-primary">{roadmap.roadmapProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-surface-container 950/60 rounded-full overflow-hidden border border-white/5 relative">
                <div 
                  className="h-full rounded-full bg-primary" 
                  style={{ width: `${roadmap.roadmapProgress}%` }}
                />
              </div>
            </div>

            {/* Risk level */}
            <div className="text-right">
              <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold block mb-1">Grau de Risco do GRE™</span>
              <span className={`inline-block px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest border ${getRiskLevelStyles(roadmap.roadmapRiskLevel)}`}>
                {roadmap.roadmapRiskLevel}
              </span>
            </div>

          </div>
        </div>

        {/* Milestone Alert Banner */}
        <div className="p-4 bg-primary border border-primary rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary flex-shrink-0 animate-pulse" />
            <div className="text-xs">
              <strong className="text-muted-foreground block uppercase tracking-wider text-[10px]">Próximo Marco Crítico do Conselho</strong>
              <span className="text-muted-foreground">{roadmap.nextCriticalMilestone}</span>
            </div>
          </div>
          <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest font-mono hidden md:inline">
            Duração Total: {roadmap.estimatedDurationMonths} meses
          </span>
        </div>

        {/* Narrative recommendation */}
    <p className="text-executive-secondary">
          "{roadmap.executiveSummary}"
        </p>

        {/* Horizontal Timeline Grid of Phases */}
        <div className="space-y-4">
          <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-black block">Fases Cronológicas Sequenciais</span>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {roadmap.phases.map((phase, idx) => {
              const isActive = isPhaseHighlighted(phase.phaseId, roadmap.maturityStage);
              return (
                <div 
                  key={phase.phaseId}
                  className={`p-4 rounded-xl border flex flex-col justify-between min-h-[300px] transition-all relative ${
                    isActive 
                      ? 'bg-primary border-primary shadow-[0_0_15px_rgba(99,102,241,0.05)]' 
                      : 'bg-surface-container 950/40 border-white/5 opacity-75 hover:opacity-100'
                  }`}
                >
                  {/* Glowing dot for active phase */}
                  {isActive && (
                    <div className="absolute top-3 right-3 flex h-2 w-2">
           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary "></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </div>
                  )}

                  <div className="space-y-3">
                    {/* Header */}
                    <div className="space-y-1">
                      <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Fase {idx + 1} ({phase.durationMonths} meses)</span>
                      <h4 className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-primary' : 'text-primary'}`}>
                        {phase.title}
                      </h4>
                    </div>

          <p className="text-executive-secondary">
                      {phase.objective}
                    </p>

                    {/* Completion Criteria */}
                    <div className="space-y-1.5 pt-2 border-t border-white/5">
                      <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest block">Critérios de Conclusão</span>
                      <ul className="space-y-1 text-[9px] text-muted-foreground">
                        {phase.completionCriteria.map((crit, cIdx) => (
                          <li key={cIdx} className="flex items-start gap-1">
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span>{crit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Footer metadata */}
                  <div className="space-y-2 pt-3 border-t border-white/5 text-[9px]">
                    {phase.dependencies.length > 0 ? (
                      <div className="text-muted-foreground">
                        <strong className="text-muted-foreground block uppercase text-[8px] tracking-widest font-black">Dependência</strong>
                        Requer {phase.dependencies.join(', ')}
                      </div>
                    ) : (
                      <div className="text-emerald-500/80 font-bold uppercase text-[8px] tracking-widest">Livre de Dependência</div>
                    )}
                    <div className="flex flex-wrap gap-1">
                      {phase.riskReductionAreas.map((area, aIdx) => (
                        <span key={aIdx} className="px-1.5 py-0.5 rounded bg-foreground border border-white/5 text-muted-foreground uppercase text-[8px]">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Initiatives Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-white/5 pt-6">
          
          {/* Quick Wins */}
          <div className="p-4 bg-success-soft0/5 border border-emerald-500/10 rounded-xl space-y-3">
            <ExecutiveHeading as="h4" className="text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Quick Wins (Até 90 dias)
            </ExecutiveHeading>
            <ul className="text-xs text-muted-foreground space-y-2">
              {roadmap.quickWins.map((win, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <span>{win}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Foundational Initiatives */}
          <div className="p-4 bg-primary border border-primary rounded-xl space-y-3">
            <ExecutiveHeading as="h4" className="text-primary flex items-center gap-2">
              <Workflow className="w-4 h-4" />
              Foundational Initiatives (90–365 dias)
            </ExecutiveHeading>
            <ul className="text-xs text-muted-foreground space-y-2">
              {roadmap.foundationalInitiatives.map((init, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>{init}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Strategic Initiatives */}
          <div className="p-4 bg-primary border border-primary rounded-xl space-y-3">
            <ExecutiveHeading as="h4" className="text-primary flex items-center gap-2">
              <Target className="w-4 h-4" />
              Strategic Initiatives (12–36 meses)
            </ExecutiveHeading>
            <ul className="text-xs text-muted-foreground space-y-2">
              {roadmap.strategicInitiatives.map((init, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>{init}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

      {/* 6. Governance Monitoring™ Dashboard Row */}
      <div id="gml-monitoring" className="bg-card border border-border rounded-2xl p-8 border border-white/5 bg-surface-container rounded-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary border border-primary text-primary rounded-xl">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-black block">Governance Monitoring Layer (GML™)</span>
              <ExecutiveHeading as="h3" className="font-display text-primary">Governance Monitoring™</ExecutiveHeading>
            </div>
          </div>

          {/* Timeline Mode Badge */}
          <div>
            {monitoring.timelineMode === 'LIVE_HISTORY' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border bg-success-soft0/10 text-emerald-700 border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-success-soft0 animate-pulse" />
                Histórico Real (LIVE_HISTORY)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border bg-primary text-primary border-primary">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Demonstração Temporal (DEMO_TIMELINE)
              </span>
            )}
          </div>
        </div>

        {/* Executive summary paragraph */}
    <div className="p-4 bg-surface-container 950/40 border border-white/5 rounded-xl text-sm text-executive-secondary leading-relaxed">
          <strong className="text-muted-foreground block uppercase tracking-wider text-[10px] mb-1">Sumário Executivo de Evolução</strong>
          "{monitoring.executiveSummary}"
        </div>

        {/* Grid 1: Temporal Trends for ESGIM and IRI */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Card A: ESGIM Trend */}
          <div className="p-6 bg-surface-container 950/30 border border-white/5 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                Maturidade Temporal ESGIM™
              </span>
              <div className="flex items-center gap-1.5">
                {monitoring.trend === 'IMPROVING' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                    <TrendingUp className="w-3.5 h-3.5" /> Improving
                  </span>
                ) : monitoring.trend === 'DECLINING' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-rose-400 tracking-wider">
                    <TrendingDown className="w-3.5 h-3.5" /> Declining
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-amber-400 tracking-wider">
                    Stable
                  </span>
                )}
              </div>
            </div>

            {/* Score timeline sequence */}
            <div className="flex items-center justify-between py-2 px-4 bg-surface-container 950/60 border border-white/5 rounded-xl">
              {monitoring.snapshots.map((snap, idx) => (
                <React.Fragment key={idx}>
                  <div className="text-center">
                    <span className="text-[9px] text-muted-foreground block uppercase tracking-widest font-mono">
                      {idx === 3 ? "Presente" : `T-${(3 - idx) * 12}M`}
                    </span>
                    <span className={`text-lg font-light font-mono block mt-0.5 ${idx === 3 ? 'text-primary font-bold text-xl' : 'text-muted-foreground'}`}>
                      {snap.esgimScore}
                    </span>
                  </div>
                  {idx < 3 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                </React.Fragment>
              ))}
            </div>
      <p className="text-executive-secondary">
              A maturidade mede a adesão formal de processos nos eixos socioambientais, sociais, governança, institucionais e missão.
            </p>
          </div>

          {/* Card B: IRI Trend */}
          <div className="p-6 bg-surface-container 950/30 border border-white/5 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" />
                Resiliência Temporal IRI™
              </span>
              <div className="flex items-center gap-1.5">
                <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider ${
                  resilience.score >= 75 ? 'text-emerald-400' : resilience.score >= 60 ? 'text-sky-400' : 'text-rose-400'
                }`}>
                  {resilience.score >= 75 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {resilience.score >= 75 ? 'Resilience Active' : 'Resilience Warned'}
                </span>
              </div>
            </div>

            {/* Score timeline sequence */}
            <div className="flex items-center justify-between py-2 px-4 bg-surface-container 950/60 border border-white/5 rounded-xl">
              {monitoring.snapshots.map((snap, idx) => (
                <React.Fragment key={idx}>
                  <div className="text-center">
                    <span className="text-[9px] text-muted-foreground block uppercase tracking-widest font-mono">
                      {idx === 3 ? "Presente" : `T-${(3 - idx) * 12}M`}
                    </span>
                    <span className={`text-lg font-light font-mono block mt-0.5 ${idx === 3 ? 'text-emerald-400 font-bold text-xl' : 'text-muted-foreground'}`}>
                      {snap.iriScore}
                    </span>
                  </div>
                  {idx < 3 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                </React.Fragment>
              ))}
            </div>
      <p className="text-executive-secondary">
              A resiliência mede o grau de blindagem sucessória, proteção fiduciária e adaptabilidade estratégica da holding.
            </p>
          </div>

        </div>

        {/* Grid 2: PEI, RPI, Institutional Risk Trends */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: PEI (Priority Execution Index) */}
          <div className="p-5 bg-surface-container 950/40 border border-white/5 rounded-xl space-y-3">
            <div>
              <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-mono block">Indicador Proprietário</span>
              <ExecutiveHeading as="h4" className="text-primary flex items-center gap-1.5">
                <Target className="w-4 h-4 text-amber-400" />
                Priority Execution (PEI)
              </ExecutiveHeading>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-light font-mono text-amber-400">{monitoring.snapshots[3].priorityExecutionIndex}</span>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>

            {/* PEI classification badge */}
            <div>
              {(() => {
                const val = monitoring.snapshots[3].priorityExecutionIndex;
                let label = "CRITICAL";
                let classes = "bg-critical-soft0/10 text-rose-700 border-rose-500/20";
                if (val >= 90) {
                  label = "EXCELLENT";
                  classes = "bg-success-soft0/10 text-emerald-700 border-emerald-500/20";
                } else if (val >= 75) {
                  label = "STRONG";
                  classes = "bg-teal-500/10 text-teal-400 border-teal-500/20";
                } else if (val >= 60) {
                  label = "MODERATE";
                  classes = "bg-sky-500/10 text-sky-400 border-sky-500/20";
                } else if (val >= 40) {
                  label = "WEAK";
                  classes = "bg-warning-soft0/10 text-amber-700 border-amber-500/20";
                }
                return (
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase border ${classes}`}>
                    {label}
                  </span>
                );
              })()}
            </div>
      <p className="text-executive-secondary">
              Mede se as prioridades e decisões recomendadas pelo conselho estão sendo executadas dentro do prazo.
            </p>
          </div>

          {/* Card 2: RPI (Roadmap Progress Index) */}
          <div className="p-5 bg-surface-container 950/40 border border-white/5 rounded-xl space-y-3">
            <div>
              <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-mono block">Progresso do Plano</span>
              <ExecutiveHeading as="h4" className="text-primary flex items-center gap-1.5">
                <Workflow className="w-4 h-4 text-primary" />
                Roadmap Progress (RPI)
              </ExecutiveHeading>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-light font-mono text-primary">{monitoring.snapshots[3].roadmapProgress}%</span>
              <span className="text-xs text-muted-foreground">concluído</span>
            </div>

            {/* RPI mini-progress bar */}
            <div className="w-full h-1.5 bg-surface-container 950/60 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500" 
                style={{ width: `${monitoring.snapshots[3].roadmapProgress}%` }}
              />
            </div>
      <p className="text-executive-secondary">
              Consome e cruza a taxa de conclusão dos critérios e marcos críticos definidos nas fases ativas do GRE™.
            </p>
          </div>

          {/* Card 3: Institutional Risk Trend */}
          <div className="p-5 bg-surface-container 950/40 border border-white/5 rounded-xl space-y-3">
            <div>
              <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-mono block">Índice Geral de Risco</span>
              <ExecutiveHeading as="h4" className="text-primary flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Risk Index Trend
              </ExecutiveHeading>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-light font-mono text-rose-400">{monitoring.snapshots[3].institutionalRiskIndex}</span>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>

            {/* Risk sub-dimension badges */}
            <div className="flex flex-wrap gap-1.5">
              {(() => {
                const isBreach = demoScenario === 'CONSTITUTIONAL_BREACH';
                const isLiquidity = demoScenario === 'LIQUIDITY_SHOCK';
                const isExit = demoScenario === 'FOUNDER_EXIT';
                const isDisrupt = demoScenario === 'MARKET_DISRUPTION';
                const isStress = demoScenario === 'MISSION_STRESS';

                return (
                  <>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-mono font-bold ${isLiquidity ? 'text-rose-400 border border-rose-500/20 bg-critical-soft0/5' : 'text-muted-foreground border border-white/5'}`}>
                      Fid
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-mono font-bold ${isExit ? 'text-rose-400 border border-rose-500/20 bg-critical-soft0/5' : 'text-muted-foreground border border-white/5'}`}>
                      Inst
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-mono font-bold ${isStress ? 'text-rose-400 border border-rose-500/20 bg-critical-soft0/5' : 'text-muted-foreground border border-white/5'}`}>
                      Mis
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-mono font-bold ${isDisrupt ? 'text-rose-400 border border-rose-500/20 bg-critical-soft0/5' : 'text-muted-foreground border border-white/5'}`}>
                      Pros
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-mono font-bold ${isBreach ? 'text-rose-400 border border-rose-500/20 bg-critical-soft0/5' : 'text-muted-foreground border border-white/5'}`}>
                      Const
                    </span>
                  </>
                );
              })()}
            </div>
      <p className="text-executive-secondary">
              Avaliação de ameaça nas categorias estatutárias, fiduciárias, constitucionais e operacionais.
            </p>
          </div>

        </div>

        {/* Monitoring Alerts Feed */}
        <div className="space-y-4 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <ExecutiveHeading as="h4" className="text-primary flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-primary" />
              Alertas Automáticos de Monitoramento ({monitoring.alerts.length})
            </ExecutiveHeading>
            <span className="text-[8px] text-muted-foreground uppercase tracking-widest font-mono">Detecção Contínua</span>
          </div>

          {monitoring.alerts.length === 0 ? (
            <div className="p-4 bg-success-soft0/5 border border-emerald-500/10 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Nenhum alerta de deterioração detectado. A organização mantém a evolução dentro do padrão esperado.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {monitoring.alerts.map((alert, idx) => {
                let cardClass = "bg-surface-container 950/40 border-white/5 text-muted-foreground";
                let badgeClass = "bg-surface-container 500/10 text-muted-foreground border-border";
                
                if (alert.severity === 'CRITICAL') {
                  cardClass = "bg-critical-soft0/5 border-rose-500/10 text-rose-700";
                  badgeClass = "bg-critical-soft0/10 text-rose-700 border-rose-500/20";
                } else if (alert.severity === 'HIGH') {
                  cardClass = "bg-warning-soft0/5 border-amber-500/10 text-amber-700";
                  badgeClass = "bg-warning-soft0/10 text-amber-700 border-amber-500/20";
                } else if (alert.severity === 'MODERATE') {
                  cardClass = "bg-sky-500/5 border-sky-500/10 text-sky-300";
                  badgeClass = "bg-sky-500/10 text-sky-400 border-sky-500/20";
                }

                return (
                  <div key={idx} className={`p-4 rounded-xl border flex flex-col justify-between gap-3 ${cardClass}`}>
                    <div className="space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <h5 className="text-xs font-bold uppercase tracking-wider">{alert.title}</h5>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black border uppercase tracking-wider ${badgeClass}`}>
                          {alert.severity}
                        </span>
                      </div>
           <ExecutiveText as="div" variant="caption">{alert.description}</ExecutiveText>
                    </div>

                    <div className="text-[10px] border-t border-white/5 pt-2 flex items-start gap-1">
                      <strong className="uppercase text-[8px] font-black tracking-widest block text-primary mt-0.5">Ação:</strong>
           <span className="">{alert.recommendedAction}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* 8. Governance Knowledge Layer Panel (GKL™) */}
      <div id="gkl-knowledge" className="my-8">
        <GovernanceKnowledgePanel 
          clientId={clientId} 
          scenario={demoScenario} 
          executiveSummary={assessment.executiveSummary || ''} 
        />
      </div>

      {/* 9. Benchmark Readiness Layer Panel (BRL™) */}
      <div id="brl-readiness" className="my-8">
        <BenchmarkReadinessPanel 
          clientId={clientId} 
          scenario={demoScenario} 
        />
      </div>

      {/* 10. Benchmark Comparative Intelligence Panel (BCI™) */}
      <div id="bci-comparative" className="my-8">
        <BenchmarkComparativePanel 
          clientId={clientId} 
          scenario={demoScenario} 
        />
      </div>

      {/* 11. Benchmark Advisory Intelligence Panel (BAI™) */}
      <div id="bai-advisory" className="my-8">
        <BenchmarkAdvisoryPanel 
          clientId={clientId} 
          scenario={demoScenario} 
        />
      </div>

      {/* 12. Governance Learning Layer Panel (GLL™) */}
      <div id="gll-learning" className="my-8">
        <GovernanceLearningPanel 
          clientId={clientId} 
          scenario={demoScenario} 
        />
      </div>

      {/* 7. Explainability & Traceability Panel */}
      <div className="bg-card border border-border rounded-2xl p-0 border border-white/5 bg-surface-container rounded-2xl overflow-hidden">
        <div className="flex border-b border-white/5 bg-surface-container 950/40">
          <button 
            onClick={() => setActiveExplainTab('evidences')}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
              activeExplainTab === 'evidences' 
                ? 'text-primary border-primary bg-primary' 
                : 'text-muted-foreground border-transparent hover:text-muted-foreground'
            }`}
          >
            Evidências e Sinais
          </button>
          <button 
            onClick={() => setActiveExplainTab('rules')}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
              activeExplainTab === 'rules' 
                ? 'text-primary border-primary bg-primary' 
                : 'text-muted-foreground border-transparent hover:text-muted-foreground'
            }`}
          >
            Regras de Arbitragem
          </button>
          <button 
            onClick={() => setActiveExplainTab('lineage')}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
              activeExplainTab === 'lineage' 
                ? 'text-primary border-primary bg-primary' 
                : 'text-muted-foreground border-transparent hover:text-muted-foreground'
            }`}
          >
            Rastreabilidade e Linhagem
          </button>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {activeExplainTab === 'evidences' && (
              <motion.div 
                key="evidences"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-6"
              >
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-executive-secondary">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <ExecutiveHeading as="h4">Trilha de Sinais e Evidências Associadas</ExecutiveHeading>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* ESGIM Evidences */}
                  <div className="space-y-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">Sinais Eixos ESGIM</span>
                    <div className="space-y-2">
                      {assessment.auditTrail.evidenceTrail.map((ev, idx) => (
                        <div key={idx} className="p-3.5 bg-surface-container 950/40 border border-white/5 rounded-xl flex items-start gap-2.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-[11px] text-muted-foreground leading-relaxed">{ev}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* IRI Evidences */}
                  <div className="space-y-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">Sinais Resiliência IRI™</span>
                    <div className="space-y-2">
                      {resilience.explainability
                        .filter(ex => ex.type === 'evidence')
                        .map((ev, idx) => (
                          <div key={idx} className="p-3.5 bg-surface-container 950/40 border border-white/5 rounded-xl flex items-start gap-2.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <div className="space-y-1">
                              <strong className="text-[10px] text-muted-foreground block uppercase tracking-wider">{ev.title}</strong>
                              <span className="text-[11px] text-muted-foreground leading-relaxed">{ev.description}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* GML Evidences / Snapshots */}
                  <div className="space-y-3 md:col-span-2 border-t border-white/5 pt-4">
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">Sinais de Evolução Temporal GML™</span>
                    <div className="p-3.5 bg-surface-container 950/40 border border-white/5 rounded-xl space-y-2">
                      <div className="text-[11px] text-muted-foreground">
                        Histórico simulado com base no cenário ativo <strong>{demoScenario}</strong>. O hash de linhagem garante a conformidade.
                      </div>
                      <div className="space-y-1">
                        {monitoring.explainability.map((ex, idx) => (
                          <div key={idx} className="text-[11px] text-muted-foreground flex items-start gap-1">
                            <span className="text-primary font-bold">•</span>
                            <span><strong>{ex.title}:</strong> {ex.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {activeExplainTab === 'rules' && (
              <motion.div 
                key="rules"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-6"
              >
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-executive-secondary">
                  <Scale className="w-5 h-5 text-primary" />
                  <ExecutiveHeading as="h4">Regras da Constituição Cognitiva & Overrides Aplicados</ExecutiveHeading>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* ESGIM overrides */}
                  <div className="space-y-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">Limitações ESGIM</span>
                    <div className="space-y-2">
                      {assessment.auditTrail.rulesApplied.map((rule, idx) => (
                        <div 
                          key={idx} 
                          className={`p-3.5 border rounded-xl flex items-center gap-2.5 ${
                            rule.includes('VETO') || rule.includes('RESTRIÇÃO')
                              ? 'bg-critical-soft0/5 border-rose-500/10 text-rose-700'
                              : 'bg-surface-container 950/40 border-primary text-muted-foreground'
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${rule.includes('VETO') ? 'bg-critical-soft0 animate-pulse' : 'bg-primary'}`} />
                          <span className="text-[11px] font-medium">{rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* IRI overrides */}
                  <div className="space-y-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">Limitações IRI™</span>
                    <div className="space-y-2">
                      {resilience.explainability
                        .filter(ex => ex.type === 'override' || ex.type === 'rule')
                        .map((ex, idx) => (
                          <div 
                            key={idx} 
                            className={`p-3.5 border rounded-xl flex items-start gap-2.5 ${
                              ex.type === 'override'
                                ? 'bg-critical-soft0/5 border-rose-500/10 text-rose-700'
                                : 'bg-surface-container 950/40 border-primary text-muted-foreground'
                            }`}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${ex.type === 'override' ? 'bg-critical-soft0 animate-pulse' : 'bg-primary'}`} />
                            <div className="space-y-1">
                              <strong className="text-[10px] block uppercase tracking-wider">{ex.title}</strong>
                              <span className="text-[11px] leading-relaxed">{ex.description}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                </div>

                <div className="border border-white/5 rounded-xl p-5 bg-surface-container 950/20 space-y-4">
                  
                  {/* BPE / GRE Connections */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-primary">Roadmap Gerado das Prioridades (BPE™ → GRE™)</h5>
                    <ul className="text-[11px] text-muted-foreground space-y-1.5 list-disc pl-4">
                      {roadmap.generatedFromPriorities.map((pTitle, pIdx) => (
                        <li key={pIdx}>
                          Prioridade #{pIdx+1}: <span className="text-muted-foreground font-medium">{pTitle}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2 border-t border-white/5 pt-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-primary">Regras de Validação de Dependência de Fases</h5>
                    <ul className="text-[11px] text-muted-foreground space-y-1.5 list-disc pl-4">
                      {roadmap.explainability.map((ex, exIdx) => (
                        <li key={exIdx} className="leading-relaxed">{ex}</li>
                      ))}
                    </ul>
                  </div>

                </div>
              </motion.div>
            )}

            {activeExplainTab === 'lineage' && (
              <motion.div 
                key="lineage"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-6"
              >
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-executive-secondary">
                  <Dna className="w-5 h-5 text-primary" />
                  <ExecutiveHeading as="h4">Rastreabilidade Fiduciária e Assinatura Criptográfica</ExecutiveHeading>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  
                  <div className="p-4 bg-surface-container 950/60 border border-white/5 rounded-xl space-y-2">
                    <div className="text-muted-foreground uppercase tracking-wider text-[9px] font-bold">Linhagem de Processamento ESGIM (Lineage Hash)</div>
                    <div className="text-muted-foreground select-all break-all">{assessment.lineageHash}</div>
                  </div>

                  <div className="p-4 bg-surface-container 950/60 border border-white/5 rounded-xl space-y-2">
                    <div className="text-muted-foreground uppercase tracking-wider text-[9px] font-bold">Linhagem de Processamento IRI™ (Lineage Hash)</div>
                    <div className="text-emerald-400 select-all break-all">{resilience.lineageHash}</div>
                  </div>

                  <div className="p-4 bg-surface-container 950/60 border border-white/5 rounded-xl space-y-2">
                    <div className="text-muted-foreground uppercase tracking-wider text-[9px] font-bold">Linhagem de Processamento GML™ (Lineage Hash)</div>
                    <div className="text-primary select-all break-all">{monitoring.lineageHash}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-surface-container 950/60 border border-white/5 rounded-xl space-y-1">
                      <span className="text-muted-foreground uppercase tracking-wider text-[9px] font-bold block">Timestamp de Processamento</span>
                      <span className="text-muted-foreground text-xs">{assessment.createdAt}</span>
                    </div>
                    <div className="p-4 bg-surface-container 950/60 border border-white/5 rounded-xl space-y-1">
                      <span className="text-muted-foreground uppercase tracking-wider text-[9px] font-bold block">Status das Engines</span>
                      <span className="text-emerald-400 text-xs font-bold">COMPLETED & SIGNED</span>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      </>
      )}

      {activeMainTab === 'execution' && (
        <div className="bg-card border border-border rounded-2xl p-6 border border-white/5 bg-surface-container rounded-2xl">
          <GovernanceExecutionPanel clientId={clientId} scenario={demoScenario} mode={mode} />
        </div>
      )}

      {activeMainTab === 'meeting' && (
        <div className="bg-card border border-border rounded-2xl p-6 border border-white/5 bg-surface-container rounded-2xl">
          <BoardMeetingMode clientId={clientId} scenario={demoScenario} />
        </div>
      )}
      </>
      )}

      {/* EBRG Modal */}
      <ExecutiveBoardReportModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        clientId={clientId}
        mode={mode}
        scenario={demoScenario}
        companyName="Holding Illumine S/A"
      />

      {/* BPG Modal */}
      <BoardPackPreviewModal 
        isOpen={isBoardPackModalOpen}
        onClose={() => setIsBoardPackModalOpen(false)}
        clientId={clientId}
        mode={mode}
        scenario={demoScenario}
        companyName="Holding Illumine S/A"
      />

    </div>
  );
}
