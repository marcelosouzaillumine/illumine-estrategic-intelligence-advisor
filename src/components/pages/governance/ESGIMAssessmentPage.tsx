// src/components/pages/governance/ESGIMAssessmentPage.tsx

import React, { useState, useMemo } from 'react';
import { 
  Brain, 
  Target, 
  Activity, 
  Scale, 
  Building, 
  Users, 
  ShieldCheck, 
  ShieldAlert, 
  ChevronRight, 
  ChevronDown,
  Info, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  TrendingUp,
  Dna,
  Lock,
  Compass,
  Coins,
  HeartPulse,
  Workflow,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Calendar,
  Layers,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageHeader } from '../../Common';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useInstitutionalAuth } from '../../../core/security/auth/InstitutionalAuthProvider';
import { FiduciaryRuntimeAdapter, ESGIMDimension, ESGIMMode, ESGIMScenario, IRILevel, BoardPriority, BoardExecutiveBrief, GovernanceMonitoringSnapshot, GovernanceMonitoringResult, DecisionExecutionRisk } from '../../../services/FiduciaryRuntimeAdapter';
import { ExecutiveBoardReportModal } from '../../modals/ExecutiveBoardReportModal';
import { BoardPackPreviewModal } from '../../modals/BoardPackPreviewModal';
import { GovernanceExecutionPanel } from './GovernanceExecutionPanel';
import { BoardMeetingMode } from './BoardMeetingMode';
import { GovernanceKnowledgePanel } from './GovernanceKnowledgePanel';
import { BenchmarkReadinessPanel } from './BenchmarkReadinessPanel';
import { BenchmarkComparativePanel } from './BenchmarkComparativePanel';
import { BenchmarkAdvisoryPanel } from './BenchmarkAdvisoryPanel';
import { GovernanceLearningPanel } from './GovernanceLearningPanel';

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
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-[#03080F] text-white">
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl mb-4">
          <ShieldAlert className="w-12 h-12 mx-auto" />
        </div>
        <h2 className="text-xl font-bold uppercase tracking-wider text-slate-200 mb-2">Acesso Restrito</h2>
        <p className="text-slate-400 text-sm max-w-md">
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
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/20',
          fill: '#34d399',
          bgBar: 'bg-emerald-500'
        };
      case 'MATURE':
        return {
          text: 'text-teal-400',
          bg: 'bg-teal-500/10',
          border: 'border-teal-500/20',
          fill: '#2dd4bf',
          bgBar: 'bg-teal-500'
        };
      case 'DEVELOPING':
        return {
          text: 'text-sky-400',
          bg: 'bg-sky-500/10',
          border: 'border-sky-500/20',
          fill: '#38bdf8',
          bgBar: 'bg-sky-500'
        };
      case 'CONCERN':
        return {
          text: 'text-amber-400',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/20',
          fill: '#fbbf24',
          bgBar: 'bg-amber-500'
        };
      case 'CRITICAL':
      default:
        return {
          text: 'text-rose-400',
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/20',
          fill: '#f87171',
          bgBar: 'bg-rose-500'
        };
    }
  };

  // Get IRI status color palette
  const getIRIStatusClasses = (level: IRILevel) => {
    switch (level) {
      case 'HIGH_RESILIENCE':
        return {
          text: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/20',
          fill: '#34d399',
          bgBar: 'bg-emerald-500'
        };
      case 'RESILIENT':
        return {
          text: 'text-teal-400',
          bg: 'bg-teal-500/10',
          border: 'border-teal-500/20',
          fill: '#2dd4bf',
          bgBar: 'bg-teal-500'
        };
      case 'MODERATE':
        return {
          text: 'text-sky-400',
          bg: 'bg-sky-500/10',
          border: 'border-sky-500/20',
          fill: '#38bdf8',
          bgBar: 'bg-sky-500'
        };
      case 'FRAGILE':
        return {
          text: 'text-amber-400',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/20',
          fill: '#fbbf24',
          bgBar: 'bg-amber-500'
        };
      case 'CRITICAL':
      default:
        return {
          text: 'text-rose-400',
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/20',
          fill: '#f87171',
          bgBar: 'bg-rose-500'
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
        return 'text-rose-400 border-rose-500/20 bg-rose-500/5';
      case 'SHORT_TERM':
        return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
      case 'MEDIUM_TERM':
        return 'text-teal-400 border-teal-500/20 bg-teal-500/5';
      case 'LONG_TERM':
      default:
        return 'text-slate-400 border-slate-500/20 bg-slate-500/5';
    }
  };

  // Get Impact classes
  const getImpactBadgeClasses = (impact: string) => {
    switch (impact) {
      case 'CRITICAL':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'HIGH':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'MODERATE':
        return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
      case 'LOW':
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  // Get Risk Level class styling
  const getRiskLevelStyles = (risk: string) => {
    switch (risk) {
      case 'CRITICAL':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'HIGH':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'MODERATE':
        return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
      case 'LOW':
      default:
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
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
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-8 pb-32 animate-executive-fade bg-[#03080F] text-white">
      
      {/* 1. Header with Side-by-Side Unified KPIs */}
      <PageHeader 
        title="Cockpit de Governança Institucional"
        subtitle="Mapeamento duplo do estado corporativo atual (ESGIM™), resiliência futura (IRI™), prioridades (BPE™) e plano de evolução (GRE™)."
        icon={Brain}
        transparent
        actions={
          <div className="flex items-center gap-8 justify-end">
            
            {/* ESGIM Score */}
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1 block">Maturidade ESGIM™</span>
              <div className="text-3xl font-light flex items-center justify-end gap-1.5">
                <span className={esgimStyles.text}>{assessment.overallScore}</span>
                <span className="text-sm text-slate-600">/100</span>
              </div>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded-lg text-[9px] font-black tracking-widest border uppercase ${esgimStyles.bg} ${esgimStyles.text} ${esgimStyles.border}`}>
                {assessment.maturityLevel}
              </span>
            </div>

            {/* Divider line */}
            <div className="w-px h-10 bg-white/10" />

            {/* IRI Score */}
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1 block">Resiliência IRI™</span>
              <div className="text-3xl font-light flex items-center justify-end gap-1.5">
                <span className={iriStyles.text}>{resilience.score}</span>
                <span className="text-sm text-slate-600">/100</span>
              </div>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded-lg text-[9px] font-black tracking-widest border uppercase ${iriStyles.bg} ${iriStyles.text} ${iriStyles.border}`}>
                {resilience.level.replace('_', ' ')}
              </span>
            </div>

          </div>
        }
      />

      {/* 2. Controls Section */}
      <div className="card-premium p-6 border border-white/5 bg-[#060D17]/50 backdrop-blur-md rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">Filtro de Leitura Estrutural</h3>
          <p className="text-xs text-slate-500 mt-1">Diferencie entre dados contábeis auditados (LIVE_DATA) e simulações cognitivas de estresse (DEMO_SCENARIO).</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex p-1 bg-slate-950/60 rounded-xl border border-white/5">
            <button
              onClick={() => setMode('LIVE_DATA')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${
                mode === 'LIVE_DATA' 
                  ? 'bg-slate-800 text-white border border-white/10 shadow-md' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Live Data
            </button>
            <button
              onClick={() => setMode('DEMO_SCENARIO')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${
                mode === 'DEMO_SCENARIO' 
                  ? 'bg-secondary text-white border border-white/10 shadow-md' 
                  : 'text-slate-500 hover:text-slate-300'
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
                className="bg-slate-950/80 border border-white/10 hover:border-white/20 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-300 outline-none cursor-pointer min-w-[280px]"
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
            className="flex items-center gap-2 px-5 py-2.5 bg-[#FF8552] hover:bg-[#FF8552]/90 border border-transparent rounded-xl text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-[#FF8552]/10 hover:shadow-[#FF8552]/20 hover:-translate-y-0.5 transition-all duration-200"
          >
            <ShieldCheck size={14} className="animate-pulse" />
            Gerar Relatório Executivo
          </button>

          {/* BPG Board Pack Button */}
          <button
            onClick={() => setIsBoardPackModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#BAB86C] hover:bg-[#BAB86C]/90 border border-transparent rounded-xl text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-[#BAB86C]/10 hover:shadow-[#BAB86C]/20 hover:-translate-y-0.5 transition-all duration-200"
          >
            <Activity size={14} className="animate-pulse" />
            Gerar Board Pack
          </button>
        </div>
      </div>

      {/* Warning if Simulation active */}
      {mode === 'DEMO_SCENARIO' && (
        <div className="p-4 bg-amber-500/5 border border-amber-500/10 text-amber-400 rounded-xl text-xs flex items-center gap-3">
          <Info className="w-5 h-5 flex-shrink-0" />
          <span>
            <strong>Simulação de Stress Ativa:</strong> Exibindo o cenário <strong>{demoScenario}</strong>. Isto valida as arbitragens cognitivas e testes de resistência de forma isolada sem alterar os dados históricos reais.
          </span>
        </div>
      )}

      {/* Cockpit Tabs selector */}
      <div className="flex border-b border-white/5 bg-slate-950/20 rounded-xl p-1 max-w-xl">
        <button
          onClick={() => setActiveMainTab('maturity')}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${
            activeMainTab === 'maturity'
              ? 'bg-[#FF8552]/10 border border-[#FF8552]/20 text-[#FF8552]'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Maturidade e Resiliência
        </button>
        <button
          onClick={() => setActiveMainTab('execution')}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeMainTab === 'execution'
              ? 'bg-[#FF8552]/10 border border-[#FF8552]/20 text-[#FF8552]'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Activity size={12} />
          Execução (GDTL™)
        </button>
        <button
          onClick={() => setActiveMainTab('meeting')}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeMainTab === 'meeting'
              ? 'bg-[#FF8552]/10 border border-[#FF8552]/20 text-[#FF8552]'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Users size={12} />
          Entrar em Reunião (BMM™)
        </button>
      </div>

      {activeMainTab === 'maturity' && (
        <>
          {/* 3. Main Grid layout: Heatmaps & Circular Gauges */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Heatmaps (lg:col-span-8) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Column A: ESGIM Heatmap */}
          <div className="card-premium p-6 border border-white/5 bg-[#060D17] rounded-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" />
                Eixos de Maturidade (ESGIM™)
              </h3>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Estado Atual</span>
            </div>

            <div className="space-y-5">
              {assessment.dimensions.map((dim, i) => {
                const styles = getESGIMStatusClasses(dim.status);
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-slate-400">
                        {getDimensionIcon(dim.dimension)}
                        <span>{dim.dimension}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase ${styles.bg} ${styles.text} ${styles.border}`}>
                          {dim.status}
                        </span>
                        <span className="font-bold font-mono text-slate-100">{dim.score}</span>
                      </div>
                    </div>
                    
                    <div className="w-full h-1.5 bg-slate-950/60 rounded-full overflow-hidden border border-white/5 relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${dim.score}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full ${styles.bgBar}`} 
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      {dim.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column B: IRI Resilience Heatmap */}
          <div className="card-premium p-6 border border-white/5 bg-[#060D17] rounded-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-400" />
                Dimensões de Resiliência (IRI™)
              </h3>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Continuidade</span>
            </div>

            <div className="space-y-5">
              
              {/* 1. Fiduciary Resilience */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-slate-400">
                    <Coins className="w-4 h-4 text-emerald-400" />
                    <span>Fiduciary Resilience</span>
                  </div>
                  <span className="font-bold font-mono text-slate-100">{resilience.fiduciaryResilience}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-950/60 rounded-full overflow-hidden border border-white/5 relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${resilience.fiduciaryResilience}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full bg-emerald-500" 
                  />
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Mede o runway financeiro, a liquidez de tesouraria e a suficiência de capital sob stress agudo.
                </p>
              </div>

              {/* 2. Institutional Resilience */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-slate-400">
                    <Workflow className="w-4 h-4 text-teal-400" />
                    <span>Institutional Resilience</span>
                  </div>
                  <span className="font-bold font-mono text-slate-100">{resilience.institutionalResilience}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-950/60 rounded-full overflow-hidden border border-white/5 relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${resilience.institutionalResilience}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full bg-teal-500" 
                  />
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Mede a ausência de personificação do legado, blindagem sucessória e formalização corporativa.
                </p>
              </div>

              {/* 3. Prospective Resilience */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-slate-400">
                    <TrendingUp className="w-4 h-4 text-sky-400" />
                    <span>Prospective Resilience</span>
                  </div>
                  <span className="font-bold font-mono text-slate-100">{resilience.prospectiveResilience}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-950/60 rounded-full overflow-hidden border border-white/5 relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${resilience.prospectiveResilience}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full bg-sky-500" 
                  />
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Mede a adaptabilidade estratégica, prontidão para inovação e capacidade de transição de ciclos.
                </p>
              </div>

              {/* 4. Mission Continuity */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-slate-400">
                    <HeartPulse className="w-4 h-4 text-rose-400" />
                    <span>Mission Continuity</span>
                  </div>
                  <span className="font-bold font-mono text-slate-100">{resilience.missionContinuity}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-950/60 rounded-full overflow-hidden border border-white/5 relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${resilience.missionContinuity}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full bg-rose-500" 
                  />
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Mede a solidez existencial do propósito do fundador mesmo em períodos de reestruturação severa.
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Right Side: Circular Gauges (lg:col-span-4) */}
        <div className="lg:col-span-4 card-premium p-6 border border-white/5 bg-[#060D17] rounded-2xl space-y-6 flex flex-col items-center justify-center">
          
          <div className="text-center">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Gauges de Diagnóstico</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">Maturidade operacional versus capacidade de sobrevivência.</p>
          </div>

          <div className="grid grid-cols-2 gap-6 w-full">
            
            {/* Meter 1: ESGIM */}
            <div className="flex flex-col items-center text-center">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-3 block">ESGIM™ Atual</span>
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
                  <span className="text-xl font-light text-slate-100">{assessment.overallScore}</span>
                </div>
              </div>
              <span className={`inline-block mt-3 px-2 py-0.5 rounded text-[8px] font-black tracking-widest border uppercase ${esgimStyles.bg} ${esgimStyles.text} ${esgimStyles.border}`}>
                {assessment.maturityLevel}
              </span>
            </div>

            {/* Meter 2: IRI */}
            <div className="flex flex-col items-center text-center">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-3 block">Resiliência IRI™</span>
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
                  <span className="text-xl font-light text-slate-100">{resilience.score}</span>
                </div>
              </div>
              <span className={`inline-block mt-3 px-2 py-0.5 rounded text-[8px] font-black tracking-widest border uppercase ${iriStyles.bg} ${iriStyles.text} ${iriStyles.border}`}>
                {resilience.level.replace('_', ' ')}
              </span>
            </div>

          </div>

          <div className="w-full h-px bg-white/5" />
          <div className="text-[10px] text-slate-500 text-center leading-relaxed px-1">
            Maturidade mede processos em execução; resiliência prevê comportamento frente a choques severos.
          </div>
        </div>

      </div>

      {/* 4. Board Executive Brief Card (Unified BPE™ Synthesis) */}
      <div className="card-premium p-8 border border-amber-500/10 bg-[#060D17] rounded-2xl relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black block">Board Priorities Engine (BPE™)</span>
            <h3 className="text-lg font-display font-medium text-slate-200">Board Executive Brief</h3>
          </div>
        </div>

        {/* Brief Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-7 space-y-4">
            <h4 className="text-2xl font-light leading-snug tracking-tight text-amber-300 font-sans italic">
              "{brief.headline}"
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed font-sans font-normal border-l-2 border-amber-500/30 pl-4">
              {brief.summary}
            </p>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl space-y-1.5">
              <span className="text-[9px] font-black uppercase tracking-widest text-rose-400 block">Principal Risco</span>
              <span className="text-xs text-slate-300 font-medium leading-relaxed">{brief.primaryRisk}</span>
            </div>

            <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl space-y-1.5">
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 block">Principal Oportunidade</span>
              <span className="text-xs text-slate-300 font-medium leading-relaxed">{brief.primaryOpportunity}</span>
            </div>

            <div className="p-4 bg-slate-950/40 border border-amber-500/10 rounded-xl sm:col-span-2 space-y-1.5">
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
      <div className="space-y-6">
        <div>
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black block">Plano de Direcionamento Executivo</span>
          <h3 className="text-xl font-display font-medium text-slate-200">Top 5 Recomendações Prioritárias do Conselho</h3>
        </div>

        <div className="space-y-4">
          {priorities.map((priority, index) => {
            const isExpanded = !!expandedPriorities[priority.id];
            const urgencyStyles = getUrgencyBadgeClasses(priority.urgency);
            const impactStyles = getImpactBadgeClasses(priority.impact);
            
            return (
              <div 
                key={priority.id}
                className="card-premium border border-white/5 bg-[#060D17] hover:border-indigo-500/10 transition-all rounded-2xl overflow-hidden"
              >
                {/* Header row of priority card */}
                <div 
                  onClick={() => togglePriority(priority.id)}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Rank Badge */}
                    <div className="w-10 h-10 rounded-xl bg-slate-950/80 border border-white/10 hover:border-indigo-500/20 flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-[9px] text-slate-500 font-bold uppercase leading-none">Rank</span>
                      <span className="text-base font-bold font-mono text-indigo-400 leading-none mt-0.5">#{index + 1}</span>
                    </div>

                    {/* Title & description summary */}
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 truncate">
                          {priority.title}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-500">
                          Priority Score: <strong className="text-indigo-400 font-black">{priority.priorityScore}</strong>
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed truncate md:max-w-xl">
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
                    <span className="px-2.5 py-0.5 rounded-lg text-[9px] font-black tracking-wider bg-slate-950/80 border border-white/5 text-slate-300 uppercase">
                      {priority.decisionCategory}
                    </span>

                    {/* Expand Chevron */}
                    <div className="p-1 text-slate-500 hover:text-slate-300 transition-colors">
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
                      <div className="px-5 pb-6 pt-1 border-t border-white/5 bg-slate-950/30 space-y-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3">
                          
                          {/* Expected Benefit */}
                          <div className="space-y-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">Benefício Esperado</span>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {priority.expectedBenefit}
                            </p>
                          </div>

                          {/* Impact Area */}
                          <div className="space-y-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">Área de Impacto Mapeada</span>
                            <div className="flex flex-wrap gap-2 pt-0.5">
                              {priority.expectedImpactArea.map((area, idx) => (
                                <span key={idx} className="px-2.5 py-1 bg-indigo-500/5 border border-indigo-500/10 text-indigo-300 font-bold rounded-lg text-[10px] uppercase">
                                  {area}
                                </span>
                              ))}
                            </div>
                          </div>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/5 pt-4">
                          
                          {/* Evidences list */}
                          <div className="space-y-3">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">Sinais e Evidências Coletadas</span>
                            <div className="space-y-2">
                              {priority.evidence.map((ev, idx) => (
                                <div key={idx} className="p-3 bg-slate-950/40 border border-white/5 rounded-xl flex items-start gap-2">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-[11px] text-slate-400 leading-relaxed">{ev}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Explainability / Rationale */}
                          <div className="space-y-3">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">Justificativa da Constituição Cognitiva</span>
                            <div className="space-y-2">
                              {priority.explainability.map((ex, idx) => (
                                <div key={idx} className="p-3 bg-slate-950/40 border border-white/5 rounded-xl flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                                  <span className="text-[11px] text-slate-300 leading-relaxed">{ex}</span>
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
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-650/25 hover:bg-indigo-650/40 border border-indigo-500/30 hover:border-indigo-500/50 text-indigo-300 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
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
      <div className="card-premium p-8 border border-white/5 bg-[#060D17] rounded-2xl space-y-8">
        
        {/* GRE Title & Progress / Risk Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black block">Governance Roadmap Engine (GRE™)</span>
              <h3 className="text-xl font-display font-medium text-slate-200">Plano de Evolução Institucional</h3>
            </div>
          </div>

          <div className="flex items-center gap-6">
            
            {/* Stage */}
            <div className="text-right">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold block mb-1">Estágio de Maturidade</span>
              <span className="inline-block px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-black uppercase tracking-widest rounded-lg">
                {roadmap.maturityStage}
              </span>
            </div>

            {/* Progress */}
            <div className="text-right min-w-[120px]">
              <div className="flex justify-between text-[9px] text-slate-500 uppercase font-bold mb-1">
                <span>Executado</span>
                <span className="text-indigo-400">{roadmap.roadmapProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-950/60 rounded-full overflow-hidden border border-white/5 relative">
                <div 
                  className="h-full rounded-full bg-indigo-500" 
                  style={{ width: `${roadmap.roadmapProgress}%` }}
                />
              </div>
            </div>

            {/* Risk level */}
            <div className="text-right">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold block mb-1">Grau de Risco do GRE™</span>
              <span className={`inline-block px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest border ${getRiskLevelStyles(roadmap.roadmapRiskLevel)}`}>
                {roadmap.roadmapRiskLevel}
              </span>
            </div>

          </div>
        </div>

        {/* Milestone Alert Banner */}
        <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-indigo-400 flex-shrink-0 animate-pulse" />
            <div className="text-xs">
              <strong className="text-slate-300 block uppercase tracking-wider text-[10px]">Próximo Marco Crítico do Conselho</strong>
              <span className="text-slate-400">{roadmap.nextCriticalMilestone}</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest font-mono hidden md:inline">
            Duração Total: {roadmap.estimatedDurationMonths} meses
          </span>
        </div>

        {/* Narrative recommendation */}
        <p className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-indigo-500/40 pl-4 bg-slate-950/20 py-3 rounded-r-xl">
          "{roadmap.executiveSummary}"
        </p>

        {/* Horizontal Timeline Grid of Phases */}
        <div className="space-y-4">
          <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black block">Fases Cronológicas Sequenciais</span>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {roadmap.phases.map((phase, idx) => {
              const isActive = isPhaseHighlighted(phase.phaseId, roadmap.maturityStage);
              return (
                <div 
                  key={phase.phaseId}
                  className={`p-4 rounded-xl border flex flex-col justify-between min-h-[300px] transition-all relative ${
                    isActive 
                      ? 'bg-indigo-500/5 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.05)]' 
                      : 'bg-slate-950/40 border-white/5 opacity-75 hover:opacity-100'
                  }`}
                >
                  {/* Glowing dot for active phase */}
                  {isActive && (
                    <div className="absolute top-3 right-3 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </div>
                  )}

                  <div className="space-y-3">
                    {/* Header */}
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Fase {idx + 1} ({phase.durationMonths} meses)</span>
                      <h4 className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-indigo-400' : 'text-slate-300'}`}>
                        {phase.title}
                      </h4>
                    </div>

                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      {phase.objective}
                    </p>

                    {/* Completion Criteria */}
                    <div className="space-y-1.5 pt-2 border-t border-white/5">
                      <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest block">Critérios de Conclusão</span>
                      <ul className="space-y-1 text-[9px] text-slate-400">
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
                      <div className="text-slate-500">
                        <strong className="text-slate-600 block uppercase text-[8px] tracking-widest font-black">Dependência</strong>
                        Requer {phase.dependencies.join(', ')}
                      </div>
                    ) : (
                      <div className="text-emerald-500/80 font-bold uppercase text-[8px] tracking-widest">Livre de Dependência</div>
                    )}
                    <div className="flex flex-wrap gap-1">
                      {phase.riskReductionAreas.map((area, aIdx) => (
                        <span key={aIdx} className="px-1.5 py-0.5 rounded bg-slate-900 border border-white/5 text-slate-400 uppercase text-[8px]">
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
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Quick Wins (Até 90 dias)
            </h4>
            <ul className="text-xs text-slate-400 space-y-2">
              {roadmap.quickWins.map((win, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <span>{win}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Foundational Initiatives */}
          <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <Workflow className="w-4 h-4" />
              Foundational Initiatives (90–365 dias)
            </h4>
            <ul className="text-xs text-slate-400 space-y-2">
              {roadmap.foundationalInitiatives.map((init, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                  <span>{init}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Strategic Initiatives */}
          <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Strategic Initiatives (12–36 meses)
            </h4>
            <ul className="text-xs text-slate-400 space-y-2">
              {roadmap.strategicInitiatives.map((init, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                  <span>{init}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

      {/* 6. Governance Monitoring™ Dashboard Row */}
      <div className="card-premium p-8 border border-white/5 bg-[#060D17] rounded-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black block">Governance Monitoring Layer (GML™)</span>
              <h3 className="text-lg font-display font-medium text-slate-200">Governance Monitoring™</h3>
            </div>
          </div>

          {/* Timeline Mode Badge */}
          <div>
            {monitoring.timelineMode === 'LIVE_HISTORY' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Histórico Real (LIVE_HISTORY)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border bg-purple-500/10 text-purple-400 border-purple-500/20">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                Demonstração Temporal (DEMO_TIMELINE)
              </span>
            )}
          </div>
        </div>

        {/* Executive summary paragraph */}
        <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl text-sm text-slate-300 leading-relaxed">
          <strong className="text-slate-400 block uppercase tracking-wider text-[10px] mb-1">Sumário Executivo de Evolução</strong>
          "{monitoring.executiveSummary}"
        </div>

        {/* Grid 1: Temporal Trends for ESGIM and IRI */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Card A: ESGIM Trend */}
          <div className="p-6 bg-slate-950/30 border border-white/5 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
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
            <div className="flex items-center justify-between py-2 px-4 bg-slate-950/60 border border-white/5 rounded-xl">
              {monitoring.snapshots.map((snap, idx) => (
                <React.Fragment key={idx}>
                  <div className="text-center">
                    <span className="text-[9px] text-slate-500 block uppercase tracking-widest font-mono">
                      {idx === 3 ? "Presente" : `T-${(3 - idx) * 12}M`}
                    </span>
                    <span className={`text-lg font-light font-mono block mt-0.5 ${idx === 3 ? 'text-indigo-400 font-bold text-xl' : 'text-slate-300'}`}>
                      {snap.esgimScore}
                    </span>
                  </div>
                  {idx < 3 && <ChevronRight className="w-4 h-4 text-slate-700" />}
                </React.Fragment>
              ))}
            </div>
            <p className="text-[10px] text-slate-500">
              A maturidade mede a adesão formal de processos nos eixos socioambientais, sociais, governança, institucionais e missão.
            </p>
          </div>

          {/* Card B: IRI Trend */}
          <div className="p-6 bg-slate-950/30 border border-white/5 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
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
            <div className="flex items-center justify-between py-2 px-4 bg-slate-950/60 border border-white/5 rounded-xl">
              {monitoring.snapshots.map((snap, idx) => (
                <React.Fragment key={idx}>
                  <div className="text-center">
                    <span className="text-[9px] text-slate-500 block uppercase tracking-widest font-mono">
                      {idx === 3 ? "Presente" : `T-${(3 - idx) * 12}M`}
                    </span>
                    <span className={`text-lg font-light font-mono block mt-0.5 ${idx === 3 ? 'text-emerald-400 font-bold text-xl' : 'text-slate-300'}`}>
                      {snap.iriScore}
                    </span>
                  </div>
                  {idx < 3 && <ChevronRight className="w-4 h-4 text-slate-700" />}
                </React.Fragment>
              ))}
            </div>
            <p className="text-[10px] text-slate-500">
              A resiliência mede o grau de blindagem sucessória, proteção fiduciária e adaptabilidade estratégica da holding.
            </p>
          </div>

        </div>

        {/* Grid 2: PEI, RPI, Institutional Risk Trends */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: PEI (Priority Execution Index) */}
          <div className="p-5 bg-slate-950/40 border border-white/5 rounded-xl space-y-3">
            <div>
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono block">Indicador Proprietário</span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-amber-400" />
                Priority Execution (PEI)
              </h4>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-light font-mono text-amber-400">{monitoring.snapshots[3].priorityExecutionIndex}</span>
              <span className="text-xs text-slate-600">/100</span>
            </div>

            {/* PEI classification badge */}
            <div>
              {(() => {
                const val = monitoring.snapshots[3].priorityExecutionIndex;
                let label = "CRITICAL";
                let classes = "bg-rose-500/10 text-rose-400 border-rose-500/20";
                if (val >= 90) {
                  label = "EXCELLENT";
                  classes = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                } else if (val >= 75) {
                  label = "STRONG";
                  classes = "bg-teal-500/10 text-teal-400 border-teal-500/20";
                } else if (val >= 60) {
                  label = "MODERATE";
                  classes = "bg-sky-500/10 text-sky-400 border-sky-500/20";
                } else if (val >= 40) {
                  label = "WEAK";
                  classes = "bg-amber-500/10 text-amber-400 border-amber-500/20";
                }
                return (
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase border ${classes}`}>
                    {label}
                  </span>
                );
              })()}
            </div>
            <p className="text-[9px] text-slate-500 leading-normal">
              Mede se as prioridades e decisões recomendadas pelo conselho estão sendo executadas dentro do prazo.
            </p>
          </div>

          {/* Card 2: RPI (Roadmap Progress Index) */}
          <div className="p-5 bg-slate-950/40 border border-white/5 rounded-xl space-y-3">
            <div>
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono block">Progresso do Plano</span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Workflow className="w-4 h-4 text-indigo-400" />
                Roadmap Progress (RPI)
              </h4>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-light font-mono text-indigo-400">{monitoring.snapshots[3].roadmapProgress}%</span>
              <span className="text-xs text-slate-600">concluído</span>
            </div>

            {/* RPI mini-progress bar */}
            <div className="w-full h-1.5 bg-slate-950/60 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                style={{ width: `${monitoring.snapshots[3].roadmapProgress}%` }}
              />
            </div>
            <p className="text-[9px] text-slate-500 leading-normal">
              Consome e cruza a taxa de conclusão dos critérios e marcos críticos definidos nas fases ativas do GRE™.
            </p>
          </div>

          {/* Card 3: Institutional Risk Trend */}
          <div className="p-5 bg-slate-950/40 border border-white/5 rounded-xl space-y-3">
            <div>
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono block">Índice Geral de Risco</span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Risk Index Trend
              </h4>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-light font-mono text-rose-400">{monitoring.snapshots[3].institutionalRiskIndex}</span>
              <span className="text-xs text-slate-600">/100</span>
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
                    <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-mono font-bold ${isLiquidity ? 'text-rose-400 border border-rose-500/20 bg-rose-500/5' : 'text-slate-600 border border-white/5'}`}>
                      Fid
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-mono font-bold ${isExit ? 'text-rose-400 border border-rose-500/20 bg-rose-500/5' : 'text-slate-600 border border-white/5'}`}>
                      Inst
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-mono font-bold ${isStress ? 'text-rose-400 border border-rose-500/20 bg-rose-500/5' : 'text-slate-600 border border-white/5'}`}>
                      Mis
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-mono font-bold ${isDisrupt ? 'text-rose-400 border border-rose-500/20 bg-rose-500/5' : 'text-slate-600 border border-white/5'}`}>
                      Pros
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-mono font-bold ${isBreach ? 'text-rose-400 border border-rose-500/20 bg-rose-500/5' : 'text-slate-600 border border-white/5'}`}>
                      Const
                    </span>
                  </>
                );
              })()}
            </div>
            <p className="text-[9px] text-slate-500 leading-normal">
              Avaliação de ameaça nas categorias estatutárias, fiduciárias, constitucionais e operacionais.
            </p>
          </div>

        </div>

        {/* Monitoring Alerts Feed */}
        <div className="space-y-4 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-indigo-400" />
              Alertas Automáticos de Monitoramento ({monitoring.alerts.length})
            </h4>
            <span className="text-[8px] text-slate-500 uppercase tracking-widest font-mono">Detecção Contínua</span>
          </div>

          {monitoring.alerts.length === 0 ? (
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Nenhum alerta de deterioração detectado. A organização mantém a evolução dentro do padrão esperado.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {monitoring.alerts.map((alert, idx) => {
                let cardClass = "bg-slate-950/40 border-white/5 text-slate-300";
                let badgeClass = "bg-slate-500/10 text-slate-400 border-slate-500/20";
                
                if (alert.severity === 'CRITICAL') {
                  cardClass = "bg-rose-500/5 border-rose-500/10 text-rose-300";
                  badgeClass = "bg-rose-500/10 text-rose-400 border-rose-500/20";
                } else if (alert.severity === 'HIGH') {
                  cardClass = "bg-amber-500/5 border-amber-500/10 text-amber-300";
                  badgeClass = "bg-amber-500/10 text-amber-400 border-amber-500/20";
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
                      <p className="text-[11px] opacity-70 leading-relaxed">{alert.description}</p>
                    </div>

                    <div className="text-[10px] border-t border-white/5 pt-2 flex items-start gap-1">
                      <strong className="uppercase text-[8px] font-black tracking-widest block text-indigo-400 mt-0.5">Ação:</strong>
                      <span className="opacity-90">{alert.recommendedAction}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* 8. Governance Knowledge Layer Panel (GKL™) */}
      <div className="my-8">
        <GovernanceKnowledgePanel 
          clientId={clientId} 
          scenario={demoScenario} 
          executiveSummary={assessment.executiveSummary || ''} 
        />
      </div>

      {/* 9. Benchmark Readiness Layer Panel (BRL™) */}
      <div className="my-8">
        <BenchmarkReadinessPanel 
          clientId={clientId} 
          scenario={demoScenario} 
        />
      </div>

      {/* 10. Benchmark Comparative Intelligence Panel (BCI™) */}
      <div className="my-8">
        <BenchmarkComparativePanel 
          clientId={clientId} 
          scenario={demoScenario} 
        />
      </div>

      {/* 11. Benchmark Advisory Intelligence Panel (BAI™) */}
      <div className="my-8">
        <BenchmarkAdvisoryPanel 
          clientId={clientId} 
          scenario={demoScenario} 
        />
      </div>

      {/* 12. Governance Learning Layer Panel (GLL™) */}
      <div className="my-8">
        <GovernanceLearningPanel 
          clientId={clientId} 
          scenario={demoScenario} 
        />
      </div>

      {/* 7. Explainability & Traceability Panel */}
      <div className="card-premium p-0 border border-white/5 bg-[#060D17] rounded-2xl overflow-hidden">
        <div className="flex border-b border-white/5 bg-slate-950/40">
          <button 
            onClick={() => setActiveExplainTab('evidences')}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
              activeExplainTab === 'evidences' 
                ? 'text-indigo-400 border-indigo-500 bg-indigo-500/5' 
                : 'text-slate-500 border-transparent hover:text-slate-400'
            }`}
          >
            Evidências e Sinais
          </button>
          <button 
            onClick={() => setActiveExplainTab('rules')}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
              activeExplainTab === 'rules' 
                ? 'text-indigo-400 border-indigo-500 bg-indigo-500/5' 
                : 'text-slate-500 border-transparent hover:text-slate-400'
            }`}
          >
            Regras de Arbitragem
          </button>
          <button 
            onClick={() => setActiveExplainTab('lineage')}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
              activeExplainTab === 'lineage' 
                ? 'text-indigo-400 border-indigo-500 bg-indigo-500/5' 
                : 'text-slate-500 border-transparent hover:text-slate-400'
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
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-300">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  <h4>Trilha de Sinais e Evidências Associadas</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* ESGIM Evidences */}
                  <div className="space-y-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">Sinais Eixos ESGIM</span>
                    <div className="space-y-2">
                      {assessment.auditTrail.evidenceTrail.map((ev, idx) => (
                        <div key={idx} className="p-3.5 bg-slate-950/40 border border-white/5 rounded-xl flex items-start gap-2.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 mt-0.5 flex-shrink-0" />
                          <span className="text-[11px] text-slate-400 leading-relaxed">{ev}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* IRI Evidences */}
                  <div className="space-y-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">Sinais Resiliência IRI™</span>
                    <div className="space-y-2">
                      {resilience.explainability
                        .filter(ex => ex.type === 'evidence')
                        .map((ev, idx) => (
                          <div key={idx} className="p-3.5 bg-slate-950/40 border border-white/5 rounded-xl flex items-start gap-2.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <div className="space-y-1">
                              <strong className="text-[10px] text-slate-300 block uppercase tracking-wider">{ev.title}</strong>
                              <span className="text-[11px] text-slate-400 leading-relaxed">{ev.description}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* GML Evidences / Snapshots */}
                  <div className="space-y-3 md:col-span-2 border-t border-white/5 pt-4">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">Sinais de Evolução Temporal GML™</span>
                    <div className="p-3.5 bg-slate-950/40 border border-white/5 rounded-xl space-y-2">
                      <div className="text-[11px] text-slate-400">
                        Histórico simulado com base no cenário ativo <strong>{demoScenario}</strong>. O hash de linhagem garante a conformidade.
                      </div>
                      <div className="space-y-1">
                        {monitoring.explainability.map((ex, idx) => (
                          <div key={idx} className="text-[11px] text-slate-400 flex items-start gap-1">
                            <span className="text-indigo-400 font-bold">•</span>
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
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-300">
                  <Scale className="w-5 h-5 text-indigo-400" />
                  <h4>Regras da Constituição Cognitiva & Overrides Aplicados</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* ESGIM overrides */}
                  <div className="space-y-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">Limitações ESGIM</span>
                    <div className="space-y-2">
                      {assessment.auditTrail.rulesApplied.map((rule, idx) => (
                        <div 
                          key={idx} 
                          className={`p-3.5 border rounded-xl flex items-center gap-2.5 ${
                            rule.includes('VETO') || rule.includes('RESTRIÇÃO')
                              ? 'bg-rose-500/5 border-rose-500/10 text-rose-400'
                              : 'bg-slate-950/40 border-indigo-500/10 text-slate-300'
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${rule.includes('VETO') ? 'bg-rose-500 animate-pulse' : 'bg-indigo-400'}`} />
                          <span className="text-[11px] font-medium">{rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* IRI overrides */}
                  <div className="space-y-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">Limitações IRI™</span>
                    <div className="space-y-2">
                      {resilience.explainability
                        .filter(ex => ex.type === 'override' || ex.type === 'rule')
                        .map((ex, idx) => (
                          <div 
                            key={idx} 
                            className={`p-3.5 border rounded-xl flex items-start gap-2.5 ${
                              ex.type === 'override'
                                ? 'bg-rose-500/5 border-rose-500/10 text-rose-400'
                                : 'bg-slate-950/40 border-indigo-500/10 text-slate-300'
                            }`}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${ex.type === 'override' ? 'bg-rose-500 animate-pulse' : 'bg-indigo-400'}`} />
                            <div className="space-y-1">
                              <strong className="text-[10px] block uppercase tracking-wider">{ex.title}</strong>
                              <span className="text-[11px] leading-relaxed">{ex.description}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                </div>

                <div className="border border-white/5 rounded-xl p-5 bg-slate-950/20 space-y-4">
                  
                  {/* BPE / GRE Connections */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Roadmap Gerado das Prioridades (BPE™ → GRE™)</h5>
                    <ul className="text-[11px] text-slate-500 space-y-1.5 list-disc pl-4">
                      {roadmap.generatedFromPriorities.map((pTitle, pIdx) => (
                        <li key={pIdx}>
                          Prioridade #{pIdx+1}: <span className="text-slate-300 font-medium">{pTitle}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2 border-t border-white/5 pt-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Regras de Validação de Dependência de Fases</h5>
                    <ul className="text-[11px] text-slate-500 space-y-1.5 list-disc pl-4">
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
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-300">
                  <Dna className="w-5 h-5 text-indigo-400" />
                  <h4>Rastreabilidade Fiduciária e Assinatura Criptográfica</h4>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  
                  <div className="p-4 bg-slate-950/60 border border-white/5 rounded-xl space-y-2">
                    <div className="text-slate-500 uppercase tracking-wider text-[9px] font-bold">Linhagem de Processamento ESGIM (Lineage Hash)</div>
                    <div className="text-slate-300 select-all break-all">{assessment.lineageHash}</div>
                  </div>

                  <div className="p-4 bg-slate-950/60 border border-white/5 rounded-xl space-y-2">
                    <div className="text-slate-500 uppercase tracking-wider text-[9px] font-bold">Linhagem de Processamento IRI™ (Lineage Hash)</div>
                    <div className="text-emerald-400 select-all break-all">{resilience.lineageHash}</div>
                  </div>

                  <div className="p-4 bg-slate-950/60 border border-white/5 rounded-xl space-y-2">
                    <div className="text-slate-500 uppercase tracking-wider text-[9px] font-bold">Linhagem de Processamento GML™ (Lineage Hash)</div>
                    <div className="text-indigo-400 select-all break-all">{monitoring.lineageHash}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-950/60 border border-white/5 rounded-xl space-y-1">
                      <span className="text-slate-500 uppercase tracking-wider text-[9px] font-bold block">Timestamp de Processamento</span>
                      <span className="text-slate-300 text-xs">{assessment.createdAt}</span>
                    </div>
                    <div className="p-4 bg-slate-950/60 border border-white/5 rounded-xl space-y-1">
                      <span className="text-slate-500 uppercase tracking-wider text-[9px] font-bold block">Status das Engines</span>
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
        <div className="card-premium p-6 border border-white/5 bg-[#060D17] rounded-2xl">
          <GovernanceExecutionPanel clientId={clientId} scenario={demoScenario} mode={mode} />
        </div>
      )}

      {activeMainTab === 'meeting' && (
        <div className="card-premium p-6 border border-white/5 bg-[#060D17] rounded-2xl">
          <BoardMeetingMode clientId={clientId} scenario={demoScenario} />
        </div>
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
