// src/components/pages/governance/GovernanceJourneyPanel.tsx

import React, { useMemo } from 'react';
import { 
  Compass, 
  ShieldAlert, 
  Target, 
  Users, 
  TrendingUp, 
  Brain, 
  Scale, 
  Sparkles, 
  Lock, 
  AlertCircle, 
  ChevronRight, 
  Clock, 
  FileText,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  FiduciaryRuntimeAdapter,
  ESGIMMode, 
  ESGIMScenario, 
  GovernanceJourneyStep 
} from '../../../services/FiduciaryRuntimeAdapter';
import { InvestigationLauncherWrapper } from '../../investigation/InvestigationLauncherWrapper';

interface GovernanceJourneyPanelProps {
  clientId: string;
  mode: ESGIMMode;
  scenario: ESGIMScenario;
  onNavigate: (tab: 'maturity' | 'execution' | 'meeting', sectionId?: string) => void;
}

export function GovernanceJourneyPanel({ 
  clientId, 
  mode, 
  scenario, 
  onNavigate 
}: GovernanceJourneyPanelProps) {
  
  // 1. Fetch journey data dynamically from the read-only engine
  const journey = useMemo(() => {
    return FiduciaryRuntimeAdapter.governanceJourneyEngine.generateJourney(clientId, mode, scenario);
  }, [clientId, mode, scenario]);

  // Get BRL status to render locked overlays if necessary
  const brlResult = useMemo(() => {
    return FiduciaryRuntimeAdapter.benchmarkReadinessEngine.evaluateReadiness(clientId, scenario);
  }, [clientId, scenario]);

  const isBrlBlocked = brlResult.certificationStatus === 'NOT_CERTIFIED';

  // 2. Sort steps dynamically by EAI (executiveAttentionScore) descending
  const sortedSteps = useMemo(() => {
    return [...journey.steps].sort((a, b) => b.executiveAttentionScore - a.executiveAttentionScore);
  }, [journey.steps]);

  // Helper: map step ID to Lucide icon
  const getStepIcon = (id: string, isLocked: boolean) => {
    if (isLocked) return <Lock className="w-5 h-5 text-rose-400" />;
    switch (id) {
      case 'step-01': return <Compass className="w-5 h-5 text-primary" />;
      case 'step-02': return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      case 'step-03': return <Target className="w-5 h-5 text-amber-400" />;
      case 'step-04': return <Users className="w-5 h-5 text-teal-400" />;
      case 'step-05': return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      case 'step-06': return <Brain className="w-5 h-5 text-primary" />;
      case 'step-07': return <Scale className="w-5 h-5 text-sky-400" />;
      case 'step-08': return <Sparkles className="w-5 h-5 text-primary" />;
      default: return <Activity className="w-5 h-5 text-muted-foreground" />;
    }
  };

  // Helper: map status to tailwind colors
  const getStatusBadgeStyles = (status: 'HEALTHY' | 'ATTENTION' | 'CRITICAL', isLocked: boolean) => {
    if (isLocked) {
      return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
    }
    switch (status) {
      case 'CRITICAL':
        return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
      case 'ATTENTION':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      case 'HEALTHY':
        default:
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
    }
  };

  // Circular gauge parameters
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (journey.gjiScore / 100) * circumference;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER SECTION: GJI Dial & Executive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Dial Card */}
        <div className="lg:col-span-4 card-premium p-6 border border-white/5 bg-[#060D17] rounded-2xl flex flex-col justify-between items-center text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent rounded-full filter blur-2xl group-hover:bg-accent transition-all duration-700" />
          
          <div className="w-full flex justify-between items-center border-b border-white/5 pb-3">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Navegação Consolidada</span>
            <Activity className="w-4 h-4 text-primary" />
          </div>

          <div className="my-6 relative flex items-center justify-center">
            {/* SVG Ring Dial */}
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-slate-900 fill-none"
                strokeWidth="10"
              />
              <motion.circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-indigo-500 fill-none"
                strokeWidth="10"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: strokeOffset }}
                transition={{ duration: 1, ease: 'easeOut' }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-display font-black text-muted-foreground">{journey.gjiScore}</span>
              <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Score GJI™</span>
            </div>
          </div>

          <div className="space-y-1 w-full">
            <div className="text-xs text-muted-foreground leading-snug">
              Governance Journey Index
            </div>
            <div className="text-[10px] text-muted-foreground font-semibold italic">
              “índice consolidado de navegação executiva”
            </div>
            <div className="pt-2">
              <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black tracking-wider border ${
                journey.gjiScore >= 80 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : journey.gjiScore >= 65 
                  ? 'bg-teal-500/10 border-teal-500/20 text-teal-400' 
                  : journey.gjiScore >= 50 
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' 
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              }`}>
                {journey.gjiStage}
              </span>
            </div>
          </div>
        </div>

        {/* Board Narrative & Scenario Card */}
        <div className="lg:col-span-8 card-premium p-6 border border-white/5 bg-[#060D17] rounded-2xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-48 h-48 bg-coral-500/5 rounded-full filter blur-2xl group-hover:bg-[#FF8552]/5 transition-all duration-700" />
          
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#FF8552]" />
              Parecer Executivo da Governança (Board Narrative)
            </h3>
            <span className="text-[8px] bg-slate-900 border border-white/5 text-muted-foreground font-black px-2 py-0.5 rounded tracking-widest uppercase">
              {scenario.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="my-6">
            <p className="text-muted-foreground text-sm leading-relaxed font-light italic bg-slate-950/40 p-4 border border-white/5 rounded-xl">
              “{journey.boardNarrative}”
            </p>
          </div>

          <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-2 border-t border-white/5">
            <span>Sustentado pela Constituição Cognitiva da Plataforma</span>
            <span className="font-mono text-muted-foreground">Adaptado dinamicamente ao cenário ativo</span>
          </div>
        </div>
      </div>

      {/* TEMPORAL NAVIGATION TIMELINE */}
      <div className="card-premium p-6 border border-white/5 bg-[#060D17] rounded-2xl">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          Linha do Tempo de Navegação Temporal (Passado, Presente, Futuro)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          
          {/* Connecting Lines for Desktop */}
          <div className="hidden md:block absolute top-10 left-[16.6%] right-[16.6%] h-0.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 z-0" />

          {/* 1. Passado */}
          <div className="relative z-10 flex flex-col items-center text-center p-4 bg-slate-950/30 border border-white/5 rounded-xl space-y-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 border border-border flex items-center justify-center text-muted-foreground font-bold text-xs">
              01
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Passado</h4>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-widest">Onde Estávamos?</p>
            </div>
            <p className="text-[11px] text-muted-foreground leading-normal">
              Análise baseada nos registros históricos consolidados da holding.
            </p>
            <button 
              onClick={() => onNavigate('maturity')} 
              className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-white/5 text-[9px] font-black uppercase tracking-wider rounded text-muted-foreground transition-colors"
            >
              Ver Linha do Tempo (GML)
            </button>
          </div>

          {/* 2. Presente */}
          <div className="relative z-10 flex flex-col items-center text-center p-4 bg-primary border border-primary rounded-xl space-y-3">
            <div className="w-10 h-10 rounded-full bg-primary border border-primary flex items-center justify-center text-primary font-bold text-xs ring-4 ring-indigo-500/10">
              02
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Presente</h4>
              <p className="text-[10px] text-primary mt-1 uppercase font-bold tracking-widest">Onde Estamos?</p>
            </div>
            <p className="text-[11px] text-muted-foreground leading-normal">
              Diagnóstico imediato de maturidade ESGIM™ e índice de resiliência IRI™.
            </p>
            <div className="flex gap-2">
              <span className="text-[9px] font-mono font-bold bg-slate-900 px-1.5 py-0.5 rounded text-primary">
                GJI: {journey.gjiScore}
              </span>
              <span className="text-[9px] font-mono font-bold bg-slate-900 px-1.5 py-0.5 rounded text-primary">
                IRI: {FiduciaryRuntimeAdapter.institutionalResilienceIndexEngine.calculateResilience(clientId, mode, scenario).score}
              </span>
            </div>
          </div>

          {/* 3. Futuro */}
          <div className="relative z-10 flex flex-col items-center text-center p-4 bg-slate-950/30 border border-white/5 rounded-xl space-y-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 border border-border flex items-center justify-center text-muted-foreground font-bold text-xs">
              03
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Futuro</h4>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-widest">Para Onde Vamos?</p>
            </div>
            <p className="text-[11px] text-muted-foreground leading-normal">
              Planejamento de roadmap GRE™ e simulações de avanço BAI™.
            </p>
            <button 
              onClick={() => onNavigate('maturity')} 
              className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-white/5 text-[9px] font-black uppercase tracking-wider rounded text-muted-foreground transition-colors"
            >
              Simular Avanço (BAI)
            </button>
          </div>

        </div>
      </div>

      {/* EXECUTIVE ATTENTION ENGINE GRID (8 STEPS) */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Passos da Jornada Executiva
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Ordenados dinamicamente por prioridade de atenção executiva (EAI™)
            </p>
          </div>
          <span className="text-[9px] font-black tracking-widest text-muted-foreground uppercase border border-white/5 bg-slate-900 px-2 py-1 rounded">
            EAI™ Sort Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedSteps.map((step, idx) => {
            const isStepLocked = isBrlBlocked && (step.id === 'step-07' || step.id === 'step-08');
            const statusStyles = getStatusBadgeStyles(step.status, isStepLocked);
            
            // Map step to navigation destination
            let targetTab: 'maturity' | 'execution' | 'meeting' = 'maturity';
            let sectionId = '';
            
            switch (step.id) {
              case 'step-01': 
                targetTab = 'maturity'; 
                sectionId = 'esgim-maturity'; 
                break;
              case 'step-02': 
                targetTab = 'maturity'; 
                sectionId = 'bpe-priorities'; 
                break;
              case 'step-03': 
                targetTab = 'maturity'; 
                sectionId = 'gre-roadmap'; 
                break;
              case 'step-04': 
                targetTab = 'execution'; 
                break;
              case 'step-05': 
                targetTab = 'maturity'; 
                sectionId = 'gml-monitoring'; 
                break;
              case 'step-06': 
                targetTab = 'maturity'; 
                sectionId = 'gll-learning'; 
                break;
              case 'step-07': 
                targetTab = 'maturity'; 
                sectionId = 'bci-comparative'; 
                break;
              case 'step-08': 
                targetTab = 'maturity'; 
                sectionId = 'bai-advisory'; 
                break;
            }

            return (
              <motion.div
                key={step.id}
                whileHover={{ y: isStepLocked ? 0 : -4 }}
                className={`card-premium p-5 border rounded-xl flex flex-col justify-between gap-4 transition-all duration-300 relative overflow-hidden group ${
                  isStepLocked 
                    ? 'border-rose-950/20 bg-rose-950/5 opacity-75' 
                    : step.status === 'CRITICAL'
                    ? 'border-rose-500/20 bg-[#0E0608] hover:border-rose-500/40'
                    : step.status === 'ATTENTION'
                    ? 'border-amber-500/10 bg-[#0E0B06] hover:border-amber-500/30'
                    : 'border-white/5 bg-[#060D17] hover:border-accent'
                }`}
              >
                {/* Attention Rank Badge */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-slate-900 border-l border-b border-white/5 flex items-center justify-center text-[10px] font-black text-muted-foreground rounded-bl-lg">
                  #{idx + 1}
                </div>

                <div className="space-y-3">
                  {/* Title and Icon */}
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${
                      isStepLocked 
                        ? 'bg-rose-500/5 border-rose-500/10' 
                        : 'bg-slate-950/50 border-white/5'
                    }`}>
                      {getStepIcon(step.id, isStepLocked)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground tracking-wide">{step.title}</h4>
                      <p className="text-[10px] text-muted-foreground leading-normal">{step.description}</p>
                    </div>
                  </div>

                  {/* Status & EAI Indicator */}
                  <div className="flex justify-between items-center text-[9px] pt-1">
                    <span className={`px-2 py-0.5 rounded font-black border uppercase tracking-wider ${statusStyles}`}>
                      {isStepLocked ? 'BLOQUEADO' : step.status}
                    </span>
                    <span className="font-mono text-muted-foreground font-bold">
                      EAI: {step.executiveAttentionScore}
                    </span>
                  </div>

                  {/* Value / Metrics */}
                  <div className="bg-slate-950/40 p-2.5 rounded-lg border border-white/5 min-h-[46px] flex flex-col justify-center">
                    <div className="text-[9px] uppercase tracking-widest font-black text-muted-foreground">
                      {step.primaryMetric}
                    </div>
                    <div className="text-xs font-bold text-muted-foreground font-mono mt-0.5 truncate">
                      {step.primaryValue}
                    </div>
                  </div>

                  {/* Executive Summary */}
                  <p className="text-[10.5px] text-muted-foreground leading-relaxed min-h-[54px] line-clamp-3">
                    {step.executiveSummary}
                  </p>
                </div>

                {/* Actions / Navigation */}
                <div className="border-t border-white/5 pt-3 mt-1 flex flex-col gap-2">
                  {step.actionRequired && (
                    <div className="text-[10px] flex items-start gap-1 text-muted-foreground">
                      <strong className="text-rose-400 font-black uppercase text-[8px] tracking-widest mt-0.5 block shrink-0">Ação:</strong>
                      <span className="leading-snug">{step.actionRequired}</span>
                    </div>
                  )}

                  {isStepLocked ? (
                    <div className="w-full py-1.5 px-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded text-[9px] font-black uppercase tracking-wider text-center flex items-center justify-center gap-1">
                      <Lock className="w-3 h-3" />
                      Bloqueado por Prontidão (BRL)
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onNavigate(targetTab, sectionId)}
                        className="flex-1 py-1.5 px-3 bg-slate-950 hover:bg-slate-900 border border-white/5 hover:border-accent text-[9px] font-black uppercase tracking-wider rounded text-accent hover:text-accent transition-all text-center flex items-center justify-center gap-1 group"
                      >
                        Análise Detalhada
                        <ChevronRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
                      </button>
                      <InvestigationLauncherWrapper 
                        tenantId="SYSTEM_TENANT" 
                        nodeId={step.id} 
                        originSurface="ESGIM" 
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
