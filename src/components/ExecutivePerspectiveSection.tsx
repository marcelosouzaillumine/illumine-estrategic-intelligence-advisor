import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Zap, AlertTriangle, BookOpen, Target, Activity, TrendingUp, Users, BarChart2, DollarSign, Layers, Lock } from 'lucide-react';
import { ExecutiveAdvisoryReport } from '../lib/executive-advisory-engine';
import { ExecutiveIntelligenceReport } from '../services/FiduciaryRuntimeAdapter';
import { InstitutionalLocaleGuard } from '../services/FiduciaryRuntimeAdapter';
import { cn } from '../lib/utils';
import { ExecutiveLabelResolver } from '../services/FiduciaryRuntimeAdapter';
import { ExecutiveDisclosureResolver } from '../services/FiduciaryRuntimeAdapter';
import { ExecutiveNarrativeDeduplicationEngine } from '../services/FiduciaryRuntimeAdapter';
import { useLanguage } from '../contexts/LanguageContext';

interface ExecutivePerspectiveSectionProps {
  report?: ExecutiveAdvisoryReport | null;
  intelligenceReport?: ExecutiveIntelligenceReport | null;
  loading: boolean;
  className?: string;
}

// ── Dicionário de enums → português fluido ─────────────────────────────────
const ENUM_PT: Record<string, string> = {
  FIRST_OPERATIONAL_YEAR:          'Primeiro ciclo financeiro disponível',
  EARLY_STAGE_CONSOLIDATION:       'Consolidação Inicial',
  GROWTH_STAGE:                    'Estágio de Crescimento',
  SCALE_STAGE:                     'Estágio de Escala',
  MATURE_OPERATION:                'Operação Madura',
  TURNAROUND_DISTRESS:             'Turnaround / Recuperação',
  DECLINE_STAGE:                   'Estágio de Declínio',
  TRANSITION_STAGE:                'Estágio de Transição',
  ASSET_HEAVY:                     'Intensivo em Ativos',
  ASSET_LIGHT:                     'Leve em Ativos',
  CAPITAL_INTENSIVE:               'Intensivo em Capital',
  INVENTORY_DEPENDENT:             'Operação Intensiva em Estoques',
  INVENTORY_INTENSIVE:             'Operação Intensiva em Estoques',
  LABOR_INTENSIVE:                 'Intensivo em Mão de Obra',
  RECURRING_REVENUE:               'Receita Recorrente',
  SEASONAL_REVENUE:                'Receita Sazonal',
  SERVICE_BASED:                   'Baseado em Serviços',
  INDUSTRIAL:                      'Industrial',
  DISTRIBUTION:                    'Distribuição',
  SAAS:                            'SaaS',
  HEALTHCARE:                      'Saúde',
  HOLDING_STRUCTURE:               'Holding',
  FINANCIAL_OPERATION:             'Operação Financeira',
  SINGLE_YEAR_ONLY:                'Apenas um Exercício Disponível',
  LOW_HISTORICAL_DENSITY:          'Histórico Inicial (< 2 anos)',
  MODERATE_HISTORY:                'Histórico Moderado (2–3 anos)',
  STRONG_HISTORICAL_BASE:          'Base Histórica Sólida (4+ anos)',
  HIGH:                            'Alta',
  MODERATE:                        'Moderada',
  LOW:                             'Baixa',
  LIMITED_CONTEXT:                 'Contexto Parcial',
  UNVERIFIABLE:                    'Base Contextual Insuficiente',
  HEALTHY_GROWTH:                  'Crescimento Saudável',
  ARTIFICIAL_GROWTH:               'Crescimento Artificial',
  CASHLESS_GROWTH:                 'Crescimento sem Geração de Caixa',
  DEBT_FINANCED_GROWTH:            'Crescimento Financiado por Dívida',
  SHAREHOLDER_FINANCED_GROWTH:     'Crescimento Financiado por Sócios',
  SUSTAINABLE_OPERATIONAL_EXPANSION: 'Expansão Operacional Sustentável',
  PREMATURE_EXPANSION:             'Expansão Prematura',
  STAGNATION:                      'Estagnação',
  CONTRACTION:                     'Contração',
  HIGH_CONFIDENCE:                 'Alta Confiabilidade',
  MEDIUM_CONFIDENCE:               'Confiabilidade Moderada',
  LOW_CONFIDENCE:                  'Confiabilidade Reduzida',
  FULL_FINANCIAL_VIEW:             'Visão Financeira Completa',
  PARTIAL_FINANCIAL_VIEW:          'Visão Financeira Parcial',
  BALANCE_SHEET_ONLY:              'Apenas Balanço Patrimonial',
  DRE_ONLY:                        'Apenas DRE',
  CASHFLOW_ONLY:                   'Apenas Fluxo de Caixa',
  LONG:                            'Longo',
  MODERATE_CYCLE:                  'Moderado',
  SHORT:                           'Curto',
  NEGATIVE:                        'Negativo',
};
const pt = (key: string) => ENUM_PT[key] || key.replace(/_/g, ' ').replace(/^./, c => c.toUpperCase());

// ── Mapeia ações para áreas de gestão ─────────────────────────────────────
function inferManagementArea(action: string): { area: string; icon: any; color: string } {
  const lower = action.toLowerCase();
  if (lower.includes('receita') || lower.includes('comercial') || lower.includes('venda') || lower.includes('market') || lower.includes('faturamento') || lower.includes('cliente'))
    return { area: 'Gestão Comercial', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
  if (lower.includes('pessoa') || lower.includes('equipe') || lower.includes('liderança') || lower.includes('talent') || lower.includes('rh') || lower.includes('humano'))
    return { area: 'Gestão de Pessoas', icon: Users, color: 'text-blue-600 bg-blue-50 border-blue-200' };
  if (lower.includes('caixa') || lower.includes('liquid') || lower.includes('financ') || lower.includes('dívida') || lower.includes('cr') || lower.includes('capital') || lower.includes('investimento'))
    return { area: 'Gestão Financeira', icon: DollarSign, color: 'text-primary-600 bg-primary-50 border-primary-200' };
  if (lower.includes('operac') || lower.includes('processo') || lower.includes('eficiên') || lower.includes('produt') || lower.includes('estrutura') || lower.includes('escala'))
    return { area: 'Gestão Operacional', icon: Layers, color: 'text-amber-600 bg-amber-50 border-amber-200' };
  if (lower.includes('estratég') || lower.includes('posicion') || lower.includes('mercado') || lower.includes('competi') || lower.includes('inovaç'))
    return { area: 'Gestão Estratégica', icon: Target, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' };
  return { area: 'Governança Corporativa', icon: BarChart2, color: 'text-slate-600 bg-slate-50 border-slate-200' };
}

function inferPriority(idx: number, action: string): { label: string; color: string } {
  const lower = action.toLowerCase();
  if (lower.includes('imediato') || lower.includes('urgente') || lower.includes('crítico') || lower.includes('risco') || idx === 0)
    return { label: 'Alta', color: 'bg-rose-100 text-rose-700 border-rose-200' };
  if (idx === 1)
    return { label: 'Média', color: 'bg-amber-100 text-amber-700 border-amber-200' };
  return { label: 'Normal', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
}

function inferTimeline(action: string): string {
  const lower = action.toLowerCase();
  if (lower.includes('imediato') || lower.includes('curto') || lower.includes('30 dias') || lower.includes('60 dias'))
    return 'Curto Prazo';
  if (lower.includes('médio') || lower.includes('6 meses') || lower.includes('90 dias'))
    return 'Médio Prazo';
  if (lower.includes('longo') || lower.includes('anual') || lower.includes('estratég'))
    return 'Longo Prazo';
  return 'Contínuo';
}

export function ExecutivePerspectiveSection({ 
  report, 
  intelligenceReport, 
  loading,
  className
}: ExecutivePerspectiveSectionProps) {
  const { t } = useLanguage();
  const [showPrudencyDetails, setShowPrudencyDetails] = useState(false);

  if (loading) {
    return (
      <div className={cn("bg-white rounded-[48px] border border-slate-200 p-12 flex flex-col items-center justify-center min-h-[400px]", className)}>
        <div className="w-16 h-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mb-6" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Consultando Motor Institucional...</p>
      </div>
    );
  }

  if (!report && !intelligenceReport) return null;

  const rawConfidenceLevel = intelligenceReport ? intelligenceReport.compliance?.confidenceLevel || 'HIGH_CONFIDENCE' : report?.confidenceLevel || '';
  const confidenceLevel = pt(rawConfidenceLevel);

  const executivePosture = intelligenceReport ? intelligenceReport.advisory?.priorityFocus || 'Em análise' : report?.executivePosture || '';
  const executiveSummary = intelligenceReport ? (intelligenceReport.institutionalView?.narrative.executiveSummary || intelligenceReport.advisory?.executiveSummary || '') : report?.executiveSummary || '';
  const institutionalDiagnosis = intelligenceReport ? (intelligenceReport.institutionalView?.causality.executiveInsight || intelligenceReport.causality?.financialPropagation || '') : report?.institutionalDiagnosis || '';

  // ── Riscos Dominantes ─────────────────────────────────────────────────
  // 1. Tenta usar insights de causalidade com tom de risco (rose/red/amber)
  // 2. Fallback para insights gerais com categoria de risco
  // 3. Fallback para event/rootCause da causalidade
  let dominantRisks: string[] = [];
  if (intelligenceReport) {
    if (intelligenceReport.institutionalView?.disclosures?.primaryDisclosure) {
      dominantRisks.push(ExecutiveDisclosureResolver.resolve(intelligenceReport.institutionalView.disclosures.primaryDisclosure));
    }
    intelligenceReport.institutionalView?.disclosures?.secondaryDisclosures?.forEach(d => dominantRisks.push(ExecutiveDisclosureResolver.resolve(d)));

    const insights = intelligenceReport.causality?.insights || [];
    // Prioridade: insights marcados com cores de risco
    const riskInsights = insights.filter(i =>
      (i.bgClass || '').includes('rose') ||
      (i.bgClass || '').includes('red') ||
      (i.colorClass || '').includes('rose') ||
      (i.colorClass || '').includes('red') ||
      (i.category || '').toLowerCase().includes('risco') ||
      (i.category || '').toLowerCase().includes('problem')
    );
    dominantRisks = riskInsights.map(i => i.text).filter(Boolean);

    // Fallback: outros insights se não houver riscos coloridos
    if (dominantRisks.length === 0 && insights.length > 0) {
      dominantRisks = insights.slice(0, 2).map(i => i.text).filter(Boolean);
    }

    // Fallback final: usa causality.event e rootCause
    if (dominantRisks.length === 0 && intelligenceReport.causality?.event) {
      const ev = intelligenceReport.causality.event;
      const rc = intelligenceReport.causality.rootCause;
      if (ev && !ev.includes('INSUFFICIENT') && !ev.includes('N/A')) dominantRisks.push(ev);
      if (rc && !rc.includes('INSUFFICIENT') && !rc.includes('N/A')) dominantRisks.push(rc);
    }

    // Último fallback: alerta sistêmico baseado no runtimeMode
    if (dominantRisks.length === 0) {
      const mode = intelligenceReport.compliance?.runtimeMode;
      if (mode === 'BALANCE_SHEET_ONLY') {
        dominantRisks = ['Dados de resultado operacional (DRE) ainda não foram lançados — análise de risco limitada ao Balanço Patrimonial.'];
      } else if (mode === 'DRE_ONLY') {
        dominantRisks = ['Dados do Balanço Patrimonial não disponíveis — risco de liquidez e estrutura de capital não podem ser avaliados.'];
      } else if (mode === 'PARTIAL_FINANCIAL_VIEW') {
        dominantRisks = ['Visão financeira parcial: complete o lançamento de todos os demonstrativos para identificar riscos dominantes com precisão.'];
      } else {
        dominantRisks = ['Nenhum risco estrutural crítico identificado com os dados disponíveis.'];
      }
    }
  } else {
    dominantRisks = report?.dominantRisks || [];
  }
  
  dominantRisks = ExecutiveNarrativeDeduplicationEngine.deduplicate(dominantRisks).slice(0, 3);

  const strategicPriorities = (intelligenceReport
    ? intelligenceReport.advisory?.actionMatrix || []
    : report?.strategicPriorities || []).slice(0, 3);

  const rawActions = intelligenceReport
    ? intelligenceReport.advisory?.actionMatrix || []
    : report?.actionMatrix || [];

  // ── Action Matrix Expandida com Visão de Gestão ──────────────────────
  const actionMatrix = rawActions.map((action: any, idx: number) => {
    if (action && typeof action === 'object') {
      const originalTitle = action.title || action.acao || '';
      const title = ExecutiveLabelResolver.resolve(originalTitle, t);
      const mgmt = inferManagementArea(title);
      mgmt.area = action.category || mgmt.area;
      
      const prioColor = action.priority === 'Alta' ? 'bg-rose-100 text-rose-700 border-rose-200' :
                        action.priority === 'Média' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                        'bg-emerald-100 text-emerald-700 border-emerald-200';
      const prio = { label: action.priority || 'Normal', color: prioColor };
      const timeline = action.timeline || 'Longo Prazo';
      
      return {
        acao: title,
        mgmt,
        prio,
        timeline,
        expectedImpact: action.expectedImpact,
        executionRisk: action.executionRisk,
        monitoringKPI: action.monitoringKPI,
        fiduciaryEvidence: action.fiduciaryEvidence
      };
    } else {
      const originalTitle = typeof action === 'string' ? action : (action?.acao || '');
      const title = ExecutiveLabelResolver.resolve(originalTitle, t);
      const mgmt = inferManagementArea(title);
      const prio = inferPriority(idx, title);
      const timeline = inferTimeline(title);
      return {
        acao: title,
        mgmt,
        prio,
        timeline,
        expectedImpact: undefined,
        executionRisk: undefined,
        monitoringKPI: undefined,
        fiduciaryEvidence: undefined
      };
    }
  });

  const blockedFalsePositives = intelligenceReport ? [] : report?.blockedFalsePositives || [];
  const causalConflicts = intelligenceReport ? [] : report?.causalConflicts || [];

  const confidenceBadgeColor =
    rawConfidenceLevel === 'HIGH_CONFIDENCE' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
    rawConfidenceLevel === 'MEDIUM_CONFIDENCE' ? 'bg-blue-100 text-blue-800 border-blue-200' :
    'bg-amber-100 text-amber-800 border-amber-200';

  return (
    <div className={cn("bg-white rounded-[48px] border border-slate-200 p-8 md:p-12 overflow-hidden relative shadow-sm", className)}>
      <div className="absolute -left-20 -top-20 w-80 h-80 bg-indigo-50 rounded-full blur-3xl opacity-60" />
      <div className="relative z-10">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-slate-100 pb-8">
          <div className="flex items-center gap-5">
            <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <ShieldCheck size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">Síntese Executiva Institucional</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Causalidade Integrada: BP + DRE + Caixa</p>
            </div>
          </div>

          <div className={cn("px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-2 border", confidenceBadgeColor)}>
            <Zap size={14} />
            {confidenceLevel}
          </div>
        </div>

        {/* Contexto Institucional Detectado */}
        {intelligenceReport?.institutionalContext && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100/80 relative overflow-hidden"
          >
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
            <h4 className="text-[10px] font-black text-indigo-700 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Activity size={14} className="text-indigo-500" /> Contexto Institucional Detectado
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {/* Segmento Operacional */}
              <div className="space-y-3">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Segmento Operacional</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-800">{pt(intelligenceReport.institutionalContext.operationalSegment.label)}</p>
                    {intelligenceReport.institutionalContext.segmentConfidence && (
                      <span className={cn(
                        "text-[8px] font-bold px-1.5 py-0.5 rounded-sm border uppercase tracking-wider",
                        intelligenceReport.institutionalContext.segmentConfidence.confidence >= 0.8 ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                        intelligenceReport.institutionalContext.segmentConfidence.confidence >= 0.5 ? "bg-amber-50 text-amber-600 border-amber-200" :
                        "bg-rose-50 text-rose-600 border-rose-200"
                      )}>
                        {intelligenceReport.institutionalContext.segmentConfidence.inferenceMode === 'direct' ? 'Exato' : 
                         intelligenceReport.institutionalContext.segmentConfidence.inferenceMode === 'heuristic' ? 'Inferido' : 'Genérico'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Modelo Operacional */}
              <div className="space-y-3">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Modelo Operacional</p>
                  <p className="text-sm font-bold text-slate-800">{pt(intelligenceReport.institutionalContext.operationalModel.label)}</p>
                </div>
              </div>

              {/* Perfil Financeiro */}
              <div className="space-y-3">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Perfil Financeiro</p>
                  <p className="text-sm font-bold text-slate-800">{InstitutionalLocaleGuard.translateFinancialProfile(intelligenceReport.institutionalContext.financialProfile.code)}</p>
                </div>
              </div>

              {/* Maturidade Institucional */}
              <div className="space-y-3">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Maturidade Institucional</p>
                  <p className="text-sm font-bold text-slate-800">{InstitutionalLocaleGuard.translateBusinessStage(intelligenceReport.institutionalContext.institutionalMaturity.code)}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 mt-6 pt-6 border-t border-indigo-200/50">
              {/* Confiança Estratégica */}
              <div className="space-y-3">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Confiança Estratégica</p>
                  <span className={cn(
                    "inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border",
                    intelligenceReport.institutionalContext.confidence.strategicConfidence === 'HIGH' ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
                    intelligenceReport.institutionalContext.confidence.strategicConfidence === 'MODERATE' ? "bg-blue-100 text-blue-800 border-blue-200" :
                    "bg-amber-100 text-amber-800 border-amber-200"
                  )}>
                    {pt(intelligenceReport.institutionalContext.confidence.strategicConfidence)}
                  </span>
                </div>
              </div>

              {/* Limitações Interpretativas */}
              <div className="space-y-3 col-span-1">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Limitações Interpretativas</p>
                  <div className="max-h-24 overflow-y-auto space-y-1 mt-1 text-[11px] text-slate-600 font-medium">
                    {intelligenceReport.compliance.narrativeRestrictions
                      .filter(r => r.includes('NÃO') || r.includes('Diretriz') || r.includes('limitadas'))
                      .slice(0, 3)
                      .map((r, i) => (
                        <p key={i} className="leading-tight">• {r.replace('Diretriz:', '').replace('NÃO reivindicar:', 'Não alegar:').trim()}</p>
                      ))
                    }
                    {intelligenceReport.compliance.narrativeRestrictions.length === 0 && (
                      <p className="italic text-slate-400">Nenhuma limitação ativa.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Prudência Institucional - Disclosure Premium */}
            {intelligenceReport.prudency?.prudencyApplied && (
              <div className="mt-6 pt-6 border-t border-indigo-200/50">
                <div className="flex flex-col">
                  <button 
                    onClick={() => setShowPrudencyDetails(!showPrudencyDetails)}
                    className="flex items-center justify-between w-full text-left group focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-indigo-600">
                        <ShieldCheck size={16} />
                      </div>
                      <div>
                        <h5 className="text-[10px] font-black text-indigo-700 uppercase tracking-widest mb-0.5">
                          Calibração de Prudência Institucional Ativa
                        </h5>
                        <span className="text-[10px] text-indigo-500 font-medium group-hover:text-indigo-700 transition-colors">
                          {showPrudencyDetails ? 'Ocultar critérios utilizados' : '[Ver critérios utilizados]'}
                        </span>
                      </div>
                    </div>
                  </button>

                  {showPrudencyDetails && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pl-7"
                    >
                      <p className="text-[11px] font-bold text-slate-600 mb-2">
                        A calibração prudencial considerou:
                      </p>
                      <ul className="space-y-2.5">
                        {intelligenceReport.prudency.prudencyReasons.map((reason: any, idx: number) => (
                          <li key={idx} className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <span className={cn(
                              "w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0",
                              reason.severity === 'high' ? "bg-rose-400" : "bg-amber-400"
                            )} /> 
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-700 mb-0.5">{reason.title}</p>
                              <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{reason.description}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Diagnóstico do Board */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 bg-gradient-to-br from-slate-900 to-slate-800 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px]">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Diagnóstico do Board
            </div>
          </div>
          {/* Header Metadata */}
          <div className="flex flex-wrap items-center gap-2 mb-6 pt-2">
            <div className="px-3 py-1.5 bg-white/10 rounded-md border border-white/20 text-[10px] font-bold uppercase tracking-widest text-white flex gap-2 items-center">
              <span className="text-white/60">{intelligenceReport?.context?.segment || 'Geral'}</span>
              <span className="w-1 h-1 bg-white/40 rounded-full"></span>
              <span>{InstitutionalLocaleGuard.translateOperationalModel(intelligenceReport?.context?.businessModel) || InstitutionalLocaleGuard.translateBusinessStage(intelligenceReport?.context?.stage)}</span>
            </div>
            {executivePosture && (
              <div className="px-3 py-1.5 bg-white/10 rounded-md border border-white/20 text-[10px] font-bold uppercase tracking-widest text-white text-balance leading-relaxed whitespace-nowrap">
                Foco: {executivePosture}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="text-lg md:text-xl font-medium text-slate-200 leading-relaxed italic">
              "{executiveSummary}"
            </div>
            {institutionalDiagnosis && (
              <div className="text-sm md:text-base font-medium text-slate-400 leading-relaxed border-t border-white/10 pt-6">
                {institutionalDiagnosis}
              </div>
            )}
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row gap-8">
            {/* Riscos Dominantes */}
            <div className="flex-1 space-y-4">
              <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle size={14} /> Riscos Dominantes
              </h4>
              <ul className="space-y-2">
                {dominantRisks.length > 0 ? dominantRisks.map((risk, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-rose-400 mt-1 shrink-0">•</span>
                    <span>{risk}</span>
                  </li>
                )) : (
                  <li className="text-sm text-slate-500 italic">Nenhum risco dominante identificado para o período analisado.</li>
                )}
              </ul>
            </div>

            {/* Prioridades Estratégicas */}
            <div className="flex-1 space-y-4">
              <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <Target size={14} /> Prioridades Estratégicas
              </h4>
              <ul className="space-y-2">
                {strategicPriorities.length > 0 ? strategicPriorities.map((p, i) => {
                  const rawText = typeof p === 'string' ? p : (p?.title || p?.acao || '');
                  const priorityText = ExecutiveLabelResolver.resolve(rawText, t);
                  return (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-emerald-400 mt-1 shrink-0">•</span>
                      <span>{priorityText}</span>
                    </li>
                  );
                }) : (
                  <li className="text-sm text-slate-500 italic">Lance os demonstrativos financeiros para gerar prioridades estratégicas.</li>
                )}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Matriz de Ação Executiva — Expandida com Visão de Gestão */}
        {actionMatrix.length > 0 ? (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="text-indigo-500" size={20} />
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Matriz de Ação Executiva</h4>
            </div>
            <p className="text-xs text-slate-400 mb-6 ml-8">Plano de ação priorizado por área de gestão e impacto esperado.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {actionMatrix.map((action, idx) => {
                const MgmtIcon = action.mgmt.icon;
                return (
                  <div key={idx} className={cn(
                    "rounded-2xl p-5 border hover:shadow-md transition-all group",
                    action.mgmt.color.includes('emerald') ? 'bg-emerald-50/60 border-emerald-200/70 hover:border-emerald-300' :
                    action.mgmt.color.includes('blue') ? 'bg-blue-50/60 border-blue-200/70 hover:border-blue-300' :
                    action.mgmt.color.includes('primary') ? 'bg-primary-50/60 border-primary-200/70 hover:border-primary-300' :
                    action.mgmt.color.includes('amber') ? 'bg-amber-50/60 border-amber-200/70 hover:border-amber-300' :
                    action.mgmt.color.includes('indigo') ? 'bg-indigo-50/60 border-indigo-200/70 hover:border-indigo-300' :
                    'bg-slate-50/60 border-slate-200/70 hover:border-slate-300'
                  )}>
                    {/* Header: Área de Gestão */}
                    <div className="flex items-center justify-between mb-3">
                      <div className={cn("flex items-center gap-2 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest", action.mgmt.color)}>
                        <MgmtIcon size={11} />
                        {action.mgmt.area}
                      </div>
                      <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-widest", action.prio.color)}>
                        {action.prio.label}
                      </span>
                    </div>

                    {/* Ação Principal */}
                    <p className="text-sm font-bold text-slate-800 leading-snug mb-3 group-hover:text-slate-900 transition-colors">
                      {action.acao}
                    </p>

                    {/* Metadados */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-2 py-1 bg-white/80 border border-slate-200 rounded-lg text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                        🕐 {action.timeline}
                      </span>
                    </div>

                    {action.fiduciaryEvidence && (
                      <div className="mt-4 pt-3 border-t border-slate-100/60 space-y-1 text-[10px] text-slate-500 leading-relaxed">
                        <div><strong className="text-slate-700">Evidência:</strong> {action.fiduciaryEvidence}</div>
                        {action.expectedImpact && <div><strong className="text-slate-700">Impacto Esperado:</strong> {action.expectedImpact}</div>}
                        {action.executionRisk && <div><strong className="text-slate-700">Risco da Não Execução:</strong> {action.executionRisk}</div>}
                        {action.monitoringKPI && <div><strong className="text-slate-700">KPI de Sucesso:</strong> {action.monitoringKPI}</div>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mb-12 p-8 bg-slate-50 rounded-[32px] border border-dashed border-slate-200 text-center relative overflow-hidden">
            <div className="absolute -left-10 -top-10 w-40 h-40 bg-slate-100 rounded-full blur-2xl opacity-50" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="p-4 rounded-full bg-slate-100 text-slate-400 mb-3 border border-slate-200">
                <Lock size={24} strokeWidth={2} />
              </div>
              <h5 className="text-xs font-black text-slate-700 uppercase tracking-[0.2em] mb-2">Matriz de Ação Executiva Bloqueada</h5>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
                Ausência de evidências fiduciárias suficientes ou dados incompletos para a geração de recomendações. Insira lançamentos válidos de balanço e DRE para liberar a matriz de ação executiva.
              </p>
            </div>
          </div>
        )}

        {/* Causal Moderation */}
        {(blockedFalsePositives.length > 0 || causalConflicts.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blockedFalsePositives.length > 0 && (
              <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-rose-600 mb-4">
                  <ShieldCheck size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Falsos Positivos Bloqueados</span>
                </div>
                <ul className="space-y-2">
                  {blockedFalsePositives.map((fp, i) => (
                    <li key={i} className="text-xs font-bold text-rose-900">• {fp}</li>
                  ))}
                </ul>
              </div>
            )}

            {causalConflicts.length > 0 && (
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-amber-600 mb-4">
                  <AlertTriangle size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Conflitos Causais Resolvidos</span>
                </div>
                <ul className="space-y-2">
                  {causalConflicts.map((cc, i) => (
                    <li key={i} className="text-xs font-bold text-amber-900">• {cc}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
