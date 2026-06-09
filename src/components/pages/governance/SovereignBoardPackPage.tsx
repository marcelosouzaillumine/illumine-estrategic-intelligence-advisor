// src/components/pages/governance/SovereignBoardPackPage.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { Compass, AlertTriangle, ShieldCheck, Lock, Activity, TrendingUp, AlertOctagon, RefreshCw } from 'lucide-react';
import { PageHeader } from '../../Common';
import { useLanguage } from '../../../contexts/LanguageContext';
import { FiduciaryRestrictionPanel } from './FiduciaryRestrictionPanel';
import { ConfidenceDisclosurePanel } from './ConfidenceDisclosurePanel';
import { ContinuityRiskPanel } from './ContinuityRiskPanel';
import { BoardDecisionSurface } from './BoardDecisionSurface';
import { InstitutionalLineageExplorer } from './InstitutionalLineageExplorer';
import { EXECUTIVE_SEVERITY_THEME } from './ExecutiveSeverityTheme';
import { ExecutiveTimelinePanel } from './ExecutiveTimelinePanel';
import { CausalityExplorerPanel } from './CausalityExplorerPanel';
import { ConstitutionalGovernanceDashboardPanel } from './ConstitutionalGovernanceDashboardPanel';
import { useInstitutionalAuth } from '../../../core/security/auth/InstitutionalAuthProvider';
import { cn } from '../../../lib/utils';
import { FiduciaryRuntimeAdapter, PresentationLayer, InstitutionalBoardPackOutput } from '../../../services/FiduciaryRuntimeAdapter';
import { CognitiveNavigationProvider } from '../../../context/cognitive-navigation/CognitiveNavigationContext';
import { DecisionCognitiveDrawer } from '../../cognitive/DecisionCognitiveDrawer';

interface SovereignBoardPackPageProps {
  boardPack?: InstitutionalBoardPackOutput | null;
  dataMode: 'REAL' | 'MOCK' | 'EMPTY' | 'ERROR';
}

export function SovereignBoardPackPage({ boardPack, dataMode }: SovereignBoardPackPageProps) {
  const { t } = useLanguage();
  const { session } = useInstitutionalAuth();
  const userRole = session?.role || 'BOARD_MEMBER';
  const profile = useMemo(() => FiduciaryRuntimeAdapter.getProfile(FiduciaryRuntimeAdapter.mapOfficialRoleToProfileId(userRole)), [userRole]);

  const [densityLevel, setDensityLevel] = useState<PresentationLayer>(profile.defaultDensity);
  const [appendixExpanded, setAppendixExpanded] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  useEffect(() => {
    setDensityLevel(profile.defaultDensity);
  }, [userRole, profile]);

  // 1. Check for global state restrictions / Fail-Closed
  const isError = dataMode === 'ERROR' || dataMode === 'EMPTY' || !boardPack;
  
  const isQuarantined = boardPack?.status === 'CONSTITUTIONAL_QUARANTINE';
  const isFailed = boardPack?.status === 'FAILED';
  const isConfidenceBlocked = boardPack?.explainabilityAppendix?.confidenceDecomposition?.confidence === 'BLOCKED' ||
                              boardPack?.executiveSnapshot?.trajectoryConfidence === 'BLOCKED';
  
  const failClosedActive = isError || isQuarantined || isFailed || isConfidenceBlocked;

  // Render Premium Fail-Closed Overlay / Lock Screen
  if (failClosedActive) {
    const errorTitle = isQuarantined 
      ? (t('snapshot.constitutional_quarantine') || 'Quarentena Constitucional Ativa')
      : isFailed 
      ? (t('snapshot.process_failure') || 'Falha Crítica de Processamento')
      : (t('snapshot.fiduciary_violation') || 'Violação Fiduciária Detectada');

    const errorDesc = isQuarantined
      ? (boardPack?.constitutionalSection?.quarantineReason || 'Integridade constitucional comprometida. Runtime isolado por desvio de diretiva.')
      : isFailed
      ? 'Falha interna na consolidação das fontes de dados fiduciários. Runtime bloqueado.'
      : 'Dados de auditoria corrompidos ou inconsistentes. Acesso suspenso sob protocolo fail-closed.';

    const lineageHash = isError ? 'UNKNOWN_LINEAGE' : (boardPack?.metadata?.boardPackLineageHash || 'FAIL_CLOSED_LINEAGE');

    return (
      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-10 space-y-8 pb-32 animate-executive-fade text-foreground">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border dark:border-white/5 pb-6">
          <PageHeader 
            title="Fiduciary Decision Center" 
            subtitle="Consolidação Executiva e Deliberação Soberana de Governança." 
            icon={Compass} 
            transparent 
          />
          {boardPack && (
            <div className="flex flex-col text-right text-[10px] font-mono text-muted-foreground dark:text-zinc-550 space-y-0.5">
              <span>Relatório ID: <span className="text-muted-foreground dark:text-zinc-400 font-bold">{boardPack.metadata?.reportId || 'N/A'}</span></span>
              <span>Ciclo: <span className="text-muted-foreground dark:text-zinc-400 font-bold">{boardPack.metadata?.cycleReference || 'N/A'}</span></span>
              <span>Gerado em: <span className="text-muted-foreground dark:text-zinc-400 font-bold">{boardPack.metadata?.reportGenerationTimestamp ? new Date(boardPack.metadata.reportGenerationTimestamp).toLocaleString() : 'N/A'}</span></span>
            </div>
          )}
        </div>

        {/* Premium Lock Screen Centered Overlay */}
        <div className="w-full py-8 flex justify-center">
          <div 
            className={`w-full max-w-2xl p-8 md:p-12 rounded-[32px] md:rounded-[40px] border ${EXECUTIVE_SEVERITY_THEME.FAIL_CLOSED.border} ${EXECUTIVE_SEVERITY_THEME.FAIL_CLOSED.bg} ${EXECUTIVE_SEVERITY_THEME.FAIL_CLOSED.glow} flex flex-col items-center justify-center gap-8 text-center shadow-xl`}
            style={{ width: '100%', maxWidth: '672px' }}
          >
            <div className="p-4 bg-red-500/10 border border-red-500/20 dark:border-red-500/30 rounded-full w-20 h-20 flex items-center justify-center text-red-600 dark:text-red-400 animate-pulse shrink-0">
              <Lock className="w-10 h-10" />
            </div>

            <div className="flex flex-col items-center gap-4 w-full">
              <div className="flex justify-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-red-650 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/25 dark:text-red-450">
                  RESTRITIVA - FAIL CLOSED ATIVO
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider text-red-700 dark:text-red-300 w-full text-center">
                {errorTitle}
              </h2>
              <p 
                className="text-sm font-semibold text-muted-foreground dark:text-zinc-350 leading-relaxed text-center px-4"
                style={{ width: '100%', maxWidth: '576px', display: 'block', margin: '0 auto', whiteSpace: 'normal', overflowWrap: 'break-word', wordBreak: 'normal' }}
              >
                {errorDesc}
              </p>
            </div>

            {/* Collapsible Technical Details (hidden from standard executive view) */}
            <div className="w-full max-w-md flex flex-col items-center gap-4">
              <button 
                onClick={() => setShowDiagnostics(!showDiagnostics)}
                className="text-[10px] text-muted-foreground dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-450 transition-colors select-none uppercase tracking-widest font-semibold outline-none focus:outline-none flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
              >
                <span>{showDiagnostics ? 'Ocultar Diagnóstico Técnico' : 'Visualizar Diagnóstico Técnico'}</span>
              </button>
              
              {showDiagnostics && (
                <div 
                  className="w-full p-6 bg-slate-100/90 dark:bg-zinc-950/80 border border-border dark:border-zinc-900 rounded-2xl font-mono text-[10px] text-muted-foreground dark:text-zinc-400 flex flex-col gap-4 shadow-xs text-left animate-in fade-in slide-in-from-top-2 duration-200"
                  style={{ width: '100%', maxWidth: '448px' }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border dark:border-white/5 pb-2.5 w-full">
                    <span className="font-semibold text-muted-foreground dark:text-zinc-500 uppercase shrink-0">Estado do Runtime:</span>
                    <span className="font-bold text-red-650 dark:text-red-400 sm:text-right shrink-0">QUARANTINED / RESTRICTED</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border dark:border-white/5 pb-2.5 w-full">
                    <span className="font-semibold text-muted-foreground dark:text-zinc-500 uppercase shrink-0">Código de Controle:</span>
                    <span className="font-bold text-muted-foreground dark:text-zinc-300 sm:text-right shrink-0">SFFL_FC_1.0</span>
                  </div>
                  <div className="flex flex-col gap-1.5 text-left pt-1 w-full">
                    <span className="font-semibold text-muted-foreground dark:text-zinc-500 uppercase">Hash de Linhagem:</span>
                    <span 
                      className="font-bold text-muted-foreground dark:text-zinc-500 leading-relaxed text-[9px]"
                      style={{ wordBreak: 'break-all', overflowWrap: 'anywhere', whiteSpace: 'normal', display: 'block', width: '100%' }}
                    >
                      {lineageHash}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="text-[10px] text-muted-foreground dark:text-zinc-550 uppercase tracking-widest leading-relaxed font-medium w-full text-center">
              Nenhuma informação financeira ou parecer estratégico foi exposto para garantir a segurança fiduciária institucional.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal Passive Flow (all data validated)
  const isMock = dataMode === 'MOCK';
  const snapshot = boardPack.executiveSnapshot;

  const showTechnicalAudit = densityLevel === 'TECHNICAL' || 
                             !!(boardPack as any).featureFlags?.showTechnicalAudit || 
                             (window as any).showTechnicalAudit === true;

  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-10 space-y-8 pb-32 animate-executive-fade text-foreground">
      
      {/* Sandbox banner if mock data is used */}
      {isMock && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">Demo dataset / No real financial data loaded</h4>
            <p className="text-[10px] text-amber-655/70 mt-0.5 uppercase tracking-widest">
              Ambiente demonstrativo de simulação fiduciária. Os dados expostos não constituem auditoria ou parecer financeiro válido.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border dark:border-white/5 pb-6">
        <PageHeader 
          title="Fiduciary Decision Center" 
          subtitle="Consolidação Executiva e Deliberação Soberana de Governança." 
          icon={Compass} 
          transparent 
        />

        <div className="flex flex-col text-right text-[10px] font-mono text-muted-foreground dark:text-zinc-550 space-y-0.5">
          <span>Relatório ID: <span className="text-muted-foreground dark:text-zinc-400 font-bold">{boardPack.metadata.reportId || 'N/A'}</span></span>
          <span>Ciclo: <span className="text-muted-foreground dark:text-zinc-400 font-bold">{boardPack.metadata.cycleReference}</span></span>
          <span>Gerado em: <span className="text-muted-foreground dark:text-zinc-400 font-bold">{new Date(boardPack.metadata.reportGenerationTimestamp).toLocaleString()}</span></span>
        </div>
      </div>

      {/* Toggle Premium de Densidade Informativa (EIDF) */}
      <div className="flex justify-center mb-4 animate-in fade-in duration-300">
        <div className="bg-slate-100 dark:bg-zinc-900 p-1.5 rounded-2xl flex gap-1 shadow-inner border border-border dark:border-zinc-800 text-xs">
          <span className="text-muted-foreground dark:text-zinc-550 font-bold uppercase tracking-widest px-3 py-2 flex items-center select-none text-[10px]">
            Nível EIDF:
          </span>
          {['BOARD', 'EXECUTIVE', 'TECHNICAL'].map((lvl) => {
            const allowed = profile.allowedDensities.includes(lvl as PresentationLayer);
            return (
              <button
                key={lvl}
                disabled={!allowed}
                onClick={() => setDensityLevel(lvl as PresentationLayer)}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                  !allowed 
                    ? "text-muted-foreground dark:text-zinc-700 cursor-not-allowed opacity-55"
                    : densityLevel === lvl
                    ? "bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md scale-105"
                    : "text-muted-foreground hover:text-muted-foreground dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-white/50 dark:hover:bg-zinc-800/50"
                )}
              >
                {lvl === 'BOARD' ? 'Conselho (BOARD)' :
                 lvl === 'EXECUTIVE' ? 'Diretoria (EXECUTIVE)' :
                 'Técnico (TECHNICAL)'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Executive Summary & Thesis Statement */}
      <div className="p-6 md:p-8 rounded-[32px] border border-border dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-950/40 backdrop-blur-md space-y-6 shadow-xs">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground dark:text-zinc-550">
              Tese Fiduciária Consolidada
            </span>
            <h2 className="text-sm font-bold text-muted-foreground dark:text-zinc-300">
              {snapshot.unifiedThesisStatement}
            </h2>
          </div>
          {snapshot.periodScore !== undefined && (
            <div className="px-4 py-2 bg-slate-100 dark:bg-zinc-900 border border-border dark:border-zinc-800 rounded-2xl flex flex-col items-center shadow-xs">
              <span className="text-[8px] text-muted-foreground dark:text-zinc-500 font-black uppercase tracking-wider">Score</span>
              <span className="text-xl font-light text-muted-foreground dark:text-zinc-200">{snapshot.periodScore}</span>
            </div>
          )}
        </div>

        <div className="p-4 rounded-2xl bg-slate-101/50 dark:bg-zinc-900/40 border border-border dark:border-zinc-900 text-xs font-semibold text-muted-foreground dark:text-zinc-455 leading-relaxed shadow-xs">
          {snapshot.executiveSummary}
        </div>

        {/* Dynamic Badges from Snapshot */}
        <div className="flex flex-wrap gap-2.5 pt-2">
          {snapshot.activeSurvivalMode && (
            <span className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20 rounded">
              MODO SOBREVIVÊNCIA ATIVO
            </span>
          )}
          {snapshot.structuralPressureLevel && (
            <span className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 bg-slate-100 dark:bg-zinc-900 text-muted-foreground dark:text-zinc-400 border border-border dark:border-zinc-800 rounded">
              NÍVEL DE PRESSÃO: {snapshot.structuralPressureLevel}
            </span>
          )}
          {snapshot.earlyWarningLevel && (
            <span className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 rounded">
              EARLY WARNING LEVEL: {snapshot.earlyWarningLevel}
            </span>
          )}
          {snapshot.stabilityIndexClassification && (
            <span className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 bg-primary text-primary dark:text-primary border border-primary rounded">
              ESTABILIDADE: {snapshot.stabilityIndexClassification}
            </span>
          )}
        </div>
      </div>

      {/* Página Zero - Executive Strategic Snapshot */}
      {boardPack.executiveDecisionPrioritization?.pageZero && (
        <div className="p-6 md:p-8 rounded-[32px] border border-border dark:border-zinc-900 bg-slate-50/60 dark:bg-zinc-950/40 backdrop-blur-md space-y-6 shadow-sm animate-in fade-in duration-300">
          <div className="border-b border-border dark:border-white/5 pb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary dark:text-primary">
              Página Zero — Executive Strategic Snapshot
            </span>
            <h3 className="text-lg font-black text-muted-foreground dark:text-zinc-200 mt-1">
              Visão Soberana de Alta Direção
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="p-5 rounded-2xl border border-border dark:border-zinc-900 bg-white/50 dark:bg-zinc-900/30 space-y-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground dark:text-zinc-500">1. Estamos sobrevivendo?</span>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider",
                  boardPack.executiveDecisionPrioritization.pageZero.sobrevivendo === 'Sim'
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25"
                    : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/25"
                )}>
                  {boardPack.executiveDecisionPrioritization.pageZero.sobrevivendo}
                </span>
              </div>
              <p className="text-[11px] font-semibold text-muted-foreground dark:text-zinc-400 leading-normal">
                {boardPack.executiveDecisionPrioritization.pageZero.sobrevivendoJustificativa}
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-border dark:border-zinc-900 bg-white/50 dark:bg-zinc-900/30 space-y-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground dark:text-zinc-500">2. Estamos criando valor?</span>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider",
                  boardPack.executiveDecisionPrioritization.pageZero.criandoValor.includes('Criação')
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25"
                    : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/25"
                )}>
                  {boardPack.executiveDecisionPrioritization.pageZero.criandoValor}
                </span>
                <span className="text-[8px] font-mono text-muted-foreground dark:text-zinc-500 uppercase tracking-widest">
                  (Confiança: {boardPack.executiveDecisionPrioritization.pageZero.criandoValorConfidence})
                </span>
              </div>
              <p className="text-[11px] font-semibold text-muted-foreground dark:text-zinc-400 leading-normal">
                Remuneração do capital vs. custo médio ponderado de oportunidade.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-border dark:border-zinc-900 bg-white/50 dark:bg-zinc-900/30 space-y-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground dark:text-zinc-500">3. O capital está preservado?</span>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider",
                  boardPack.executiveDecisionPrioritization.pageZero.capitalPreservado === 'Preservado'
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25"
                    : boardPack.executiveDecisionPrioritization.pageZero.capitalPreservado === 'Parcialmente Preservado'
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25"
                    : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/25"
                )}>
                  {boardPack.executiveDecisionPrioritization.pageZero.capitalPreservado}
                </span>
              </div>
              <p className="text-[11px] font-semibold text-muted-foreground dark:text-zinc-400 leading-normal">
                {boardPack.executiveDecisionPrioritization.pageZero.capitalPreservadoJustificativa}
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-border dark:border-zinc-900 bg-white/50 dark:bg-zinc-900/30 space-y-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground dark:text-zinc-500">4. Qual é o maior risco?</span>
              <div className="flex items-center gap-1.5 text-red-500">
                <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-wider">Ameaça Existencial</span>
              </div>
              <p className="text-[11px] font-semibold text-muted-foreground dark:text-zinc-400 leading-normal">
                {boardPack.executiveDecisionPrioritization.pageZero.maiorRisco}
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-border dark:border-zinc-900 bg-white/50 dark:bg-zinc-900/30 space-y-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground dark:text-zinc-500">5. Decisão mais importante?</span>
              <div className="flex items-center gap-1.5 text-primary">
                <Compass className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-wider">Prioridade Soberana</span>
              </div>
              <p className="text-[11px] font-semibold text-muted-foreground dark:text-zinc-400 leading-normal">
                {boardPack.executiveDecisionPrioritization.pageZero.decisaoMaisImportante}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Institutional Executive Thesis 2.0 */}
      {boardPack.executiveDecisionPrioritization?.thesis && (
        <div className="p-6 rounded-[24px] border border-border dark:border-zinc-900 bg-slate-50/40 dark:bg-zinc-950/30 backdrop-blur-md space-y-2">
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground dark:text-zinc-500">
            Tese Executiva Institucional Consolidada (Thesis 2.0)
          </span>
          <p className="text-xs font-semibold text-muted-foreground dark:text-zinc-300 leading-relaxed max-w-[1200px]">
            "{boardPack.executiveDecisionPrioritization.thesis}"
          </p>
        </div>
      )}

      {/* Bloco 1 - Priorização e Decisões: Conselho vs. Diretoria */}
      {boardPack.executiveDecisionPrioritization && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
          
          {/* Conselho: Decisões Estratégicas */}
          <div className="p-6 md:p-8 rounded-[32px] border border-border dark:border-zinc-900 bg-slate-50/40 dark:bg-zinc-950/30 backdrop-blur-md space-y-6">
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-primary dark:text-primary">Conselho de Administração</span>
              <h3 className="text-base font-black text-muted-foreground dark:text-zinc-200 mt-0.5">Top 3 Decisões do Conselho</h3>
            </div>

            <div className="space-y-6">
              {boardPack.executiveDecisionPrioritization.top3BoardDecisions.map((dec, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-border dark:border-zinc-900 bg-white/40 dark:bg-zinc-900/20 space-y-3 shadow-xs hover:scale-[1.01] transition-transform duration-300">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-2.5 items-center">
                      <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary text-primary dark:text-primary font-bold text-xs shrink-0">{idx + 1}</span>
                      <h4 className="text-xs font-black text-muted-foreground dark:text-zinc-200 uppercase tracking-wide">{dec.titulo}</h4>
                    </div>
                    <div className="flex flex-wrap gap-1.5 justify-end shrink-0">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border",
                        dec.impactLabel === 'Muito Alto' ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/25" :
                        dec.impactLabel === 'Alto' ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25" :
                        dec.impactLabel === 'Moderado' ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25" :
                        "bg-slate-500/10 text-muted-foreground dark:text-muted-foreground border-border"
                      )}>
                        Impacto: {dec.impactLabel}
                      </span>
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border",
                        dec.urgencyLabel === 'Imediata' ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/25" :
                        dec.urgencyLabel === 'Curto Prazo' ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25" :
                        "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25"
                      )}>
                        Urgência: {dec.urgencyLabel}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-muted-foreground dark:text-zinc-350 leading-relaxed">
                    <strong className="text-muted-foreground dark:text-zinc-200">Problema: </strong>{dec.problema}
                  </p>
                  <p className="text-xs font-semibold text-muted-foreground dark:text-zinc-350 leading-relaxed">
                    <strong className="text-muted-foreground dark:text-zinc-200">Impacto Esperado: </strong>{dec.impactoEsperado}
                  </p>
                  <p className="text-xs font-semibold text-muted-foreground dark:text-zinc-400 leading-relaxed border-t border-border dark:border-white/5 pt-2 text-[10px]">
                    <strong className="text-red-600 dark:text-red-400">Consequência da Inação: </strong>{dec.consequenciaInacao}
                  </p>

                  <div className="flex items-center gap-4 text-[9px] font-mono text-muted-foreground dark:text-zinc-500 border-t border-border dark:border-white/5 pt-2">
                    <span>Origem: <strong className="text-muted-foreground dark:text-zinc-400">{dec.origin}</strong></span>
                    <span className="truncate">Evidência: <strong className="text-muted-foreground dark:text-zinc-400">{dec.evidence.join(' | ')}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Diretoria: Plano de Ação Executivo */}
          <div className="p-6 md:p-8 rounded-[32px] border border-border dark:border-zinc-900 bg-slate-50/40 dark:bg-zinc-950/30 backdrop-blur-md space-y-6">
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 dark:text-emerald-400">Diretoria Executiva</span>
              <h3 className="text-base font-black text-muted-foreground dark:text-zinc-200 mt-0.5">Top 5 Ações da Diretoria</h3>
            </div>

            <div className="space-y-4">
              {boardPack.executiveDecisionPrioritization.top5ExecutiveActions.map((act, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-border dark:border-zinc-900 bg-white/40 dark:bg-zinc-900/20 space-y-2 hover:scale-[1.01] transition-transform duration-300">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex gap-2 items-center">
                      <span className="w-5 h-5 flex items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] shrink-0">{idx + 1}</span>
                      <h4 className="text-[11px] font-black text-muted-foreground dark:text-zinc-200 uppercase tracking-wide">{act.acao}</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-[8px] font-mono text-muted-foreground dark:text-zinc-450 uppercase shrink-0">
                      Prazo: {act.prazo}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-[10px] font-semibold text-muted-foreground dark:text-zinc-400">
                    <div>
                      Responsável: <strong className="text-muted-foreground dark:text-zinc-200">{act.responsavel}</strong>
                    </div>
                    <div className="text-right">
                      Retorno: <strong className="text-muted-foreground dark:text-zinc-200">{act.impactoEsperado}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-[9px] font-mono text-muted-foreground dark:text-zinc-550 border-t border-border dark:border-white/5 pt-1.5">
                    <span>Origem: {act.origin}</span>
                    <span className="truncate">Evidência: {act.evidence.join(' | ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bloco 2 - Criação de Valor Econômico */}
      {boardPack.executiveDecisionPrioritization?.economicReturn && (
        <div className="p-6 md:p-8 rounded-[32px] border border-border dark:border-zinc-900 bg-slate-50/40 dark:bg-zinc-950/30 backdrop-blur-md space-y-6">
          <div className="border-b border-border dark:border-white/5 pb-4">
            <span className="text-[9px] font-black uppercase tracking-widest text-primary dark:text-primary">Criação de Valor Econômico</span>
            <h3 className="text-base font-black text-muted-foreground dark:text-zinc-200 mt-0.5">Economic Value Creation Framework</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Classification & Return */}
            <div className="lg:col-span-1 p-6 rounded-2xl border border-border dark:border-zinc-900 bg-white/40 dark:bg-zinc-900/20 flex flex-col justify-between gap-6">
              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground dark:text-zinc-500">Taxa de Retorno Operacional (ROCE Proxy)</span>
                <div className="text-4xl font-light text-muted-foreground dark:text-zinc-100 tracking-tight">
                  {boardPack.executiveDecisionPrioritization.economicReturn.returnRate.toFixed(1).replace('.', ',')}%
                </div>
                <div className="text-[10px] font-semibold text-muted-foreground dark:text-zinc-500">
                  Calculado sobre Capital Empregado de {boardPack.executiveDecisionPrioritization.economicReturn.capitalEmployed.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground dark:text-zinc-500">Classificação Fiduciária de Valor</span>
                <div className={cn(
                  "text-lg font-black uppercase tracking-wider",
                  boardPack.executiveDecisionPrioritization.economicReturn.classification.includes('Criação') 
                    ? "text-emerald-600 dark:text-emerald-400 animate-pulse" 
                    : "text-red-600 dark:text-red-400"
                )}>
                  {boardPack.executiveDecisionPrioritization.economicReturn.classification}
                </div>
                <div className="flex gap-2 items-center text-[9px] text-muted-foreground dark:text-zinc-500 uppercase tracking-widest">
                  <span>Confiança: <strong className="text-muted-foreground dark:text-zinc-400">{boardPack.executiveDecisionPrioritization.economicReturn.confidence}</strong></span>
                  <span>•</span>
                  <span className="truncate">{boardPack.executiveDecisionPrioritization.economicReturn.confidenceReason}</span>
                </div>
              </div>
            </div>

            {/* Narrative & Questions */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-4 rounded-xl bg-slate-100/50 dark:bg-zinc-950/40 border border-border dark:border-zinc-900 text-xs font-semibold text-muted-foreground dark:text-zinc-350 leading-relaxed">
                {boardPack.executiveDecisionPrioritization.economicReturn.narrative}
              </div>

              {/* DRE Board Support Questions (P8, P9) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border dark:border-zinc-900 bg-white/40 dark:bg-zinc-900/10 space-y-1.5">
                  <span className="text-[9px] font-black uppercase tracking-widest text-primary dark:text-primary">P1: Estamos criando valor?</span>
                  <p className="text-xs font-semibold text-muted-foreground dark:text-zinc-350 leading-relaxed">
                    {boardPack.executiveDecisionPrioritization.economicReturn.classification.includes('Criação')
                      ? 'Sim, o resultado da operação supera o custo implícito do capital empregado no período.'
                      : 'Não. A rentabilidade operacional permanece abaixo do custo de oportunidade exigido pelos investidores.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-border dark:border-zinc-900 bg-white/40 dark:bg-zinc-900/10 space-y-1.5">
                  <span className="text-[9px] font-black uppercase tracking-widest text-primary dark:text-primary">P2: Qual o retorno do capital empregado?</span>
                  <p className="text-xs font-semibold text-muted-foreground dark:text-zinc-350 leading-relaxed">
                    O retorno da operação foi de {boardPack.executiveDecisionPrioritization.economicReturn.returnRate.toFixed(1).replace('.', ',')}% para um custo de capital de referência de 12,0% a.a.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-border dark:border-zinc-900 bg-white/40 dark:bg-zinc-900/10 space-y-1.5">
                  <span className="text-[9px] font-black uppercase tracking-widest text-primary dark:text-primary">P3: O retorno justifica o risco?</span>
                  <p className="text-xs font-semibold text-muted-foreground dark:text-zinc-350 leading-relaxed">
                    {boardPack.executiveDecisionPrioritization.economicReturn.returnRate >= 12
                      ? 'Sim, o prêmio obtido compensa os riscos sistêmicos e o custo de captação da operação.'
                      : 'Não, o retorno gerado é insuficiente ou negativo, expondo a base societária a risco sem devida remuneração.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-border dark:border-zinc-900 bg-white/40 dark:bg-zinc-900/10 space-y-1.5">
                  <span className="text-[9px] font-black uppercase tracking-widest text-primary dark:text-primary">P4: Se nada mudar, o valor econômico aumenta ou diminui?</span>
                  <p className="text-xs font-semibold text-muted-foreground dark:text-zinc-350 leading-relaxed">
                    {boardPack.executiveDecisionPrioritization.economicReturn.returnRate >= 12
                      ? 'Tende a aumentar devido à capitalização interna de lucros consistentes e atratividade societária.'
                      : 'Tende a diminuir, acelerando a erosão do capital social integralizado e exigindo suporte de tesouraria.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bloco 3 - Matriz de Prioridades & Board Attention Demand Index (BADI) */}
      {boardPack.executiveDecisionPrioritization && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
          
          {/* BADI */}
          <div className="p-6 md:p-8 rounded-[32px] border border-border dark:border-zinc-900 bg-slate-50/40 dark:bg-zinc-950/30 backdrop-blur-md space-y-6">
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-primary dark:text-primary">BADI</span>
              <h3 className="text-base font-black text-muted-foreground dark:text-zinc-200 mt-0.5">Board Attention Demand Index (Demanda de Atenção)</h3>
              <p className="text-[10px] text-muted-foreground dark:text-zinc-550 uppercase tracking-widest mt-0.5">Notas maiores indicam maior urgência/prioridade fiduciária de atenção do Conselho.</p>
            </div>

            <div className="space-y-4">
              {[
                { name: 'Liquidez', value: boardPack.executiveDecisionPrioritization.badi.liquidez },
                { name: 'Rentabilidade', value: boardPack.executiveDecisionPrioritization.badi.rentabilidade },
                { name: 'Capital', value: boardPack.executiveDecisionPrioritization.badi.capital },
                { name: 'Governança', value: boardPack.executiveDecisionPrioritization.badi.governanca },
                { name: 'Compliance', value: boardPack.executiveDecisionPrioritization.badi.compliance },
              ].map((bad, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-black uppercase tracking-wider text-muted-foreground dark:text-zinc-300">{bad.name}</span>
                    <span className={cn(
                      "font-mono font-bold px-2 py-0.5 rounded text-[10px]",
                      bad.value >= 75 ? "text-red-600 bg-red-500/10" :
                      bad.value >= 50 ? "text-amber-600 bg-amber-500/10" :
                      "text-primary bg-primary"
                    )}>
                      {bad.value}/100
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        bad.value >= 75 ? "bg-red-500" :
                        bad.value >= 50 ? "bg-amber-500" :
                        "bg-primary"
                      )}
                      style={{ width: `${bad.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Matriz de Prioridades */}
          <div className="p-6 md:p-8 rounded-[32px] border border-border dark:border-zinc-900 bg-slate-50/40 dark:bg-zinc-950/30 backdrop-blur-md space-y-6">
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-primary dark:text-primary">Matriz de Prioridades</span>
              <h3 className="text-base font-black text-muted-foreground dark:text-zinc-200 mt-0.5">Matriz Institucional de Prioridades</h3>
              <p className="text-[10px] text-muted-foreground dark:text-zinc-555 uppercase tracking-widest mt-0.5">Resumo executivo de impacto, urgência e esforço por domínio corporativo.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border dark:border-white/5 text-muted-foreground dark:text-zinc-500 uppercase tracking-widest text-[9px] font-black">
                    <th className="pb-3 pr-4">Prioridade (Domínio)</th>
                    <th className="pb-3 px-4">Impacto</th>
                    <th className="pb-3 px-4">Urgência</th>
                    <th className="pb-3 pl-4">Esforço</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/50 dark:divide-white/5">
                  {boardPack.executiveDecisionPrioritization.priorityMatrix.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-100/20 dark:hover:bg-zinc-800/10 transition-colors">
                      <td className="py-3 pr-4 font-black uppercase tracking-wider text-muted-foreground dark:text-zinc-300">{row.area}</td>
                      <td className="py-3 px-4">
                        <span className={cn(
                          "px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider",
                          row.impacto === 'Muito Alto' ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20" :
                          row.impacto === 'Alto' ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20" :
                          "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                        )}>
                          {row.impacto}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={cn(
                          "px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider",
                          row.urgencia === 'Imediata' ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20" :
                          row.urgencia === 'Curto Prazo' ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20" :
                          row.urgencia === 'Médio Prazo' ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20" :
                          "bg-slate-500/10 text-muted-foreground dark:text-muted-foreground border border-border"
                        )}>
                          {row.urgencia}
                        </span>
                      </td>
                      <td className="py-3 pl-4">
                        <span className={cn(
                          "px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider",
                          row.esforco === 'Muito Alto' ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20" :
                          row.esforco === 'Alto' ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20" :
                          row.esforco === 'Moderado' ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20" :
                          "bg-slate-500/10 text-muted-foreground dark:text-muted-foreground border border-border"
                        )}>
                          {row.esforco}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Technical Appendix Section (Collapsible container, rendered conditionally) */}
      {showTechnicalAudit && (
        <div className="border border-border dark:border-zinc-900 rounded-[32px] bg-slate-50/20 dark:bg-zinc-950/20 overflow-hidden shadow-xs transition-all duration-300">
          <button
            onClick={() => setAppendixExpanded(!appendixExpanded)}
            className="w-full flex items-center justify-between p-6 md:p-8 bg-slate-100/50 dark:bg-zinc-900/50 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
          >
            <div className="flex items-center gap-3 text-left">
              <Lock className="w-5 h-5 text-primary dark:text-primary" />
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-muted-foreground dark:text-zinc-205">
                  Apêndice Técnico de Auditoria (Technical Appendix)
                </h3>
                <p className="text-[10px] text-muted-foreground dark:text-zinc-500 uppercase tracking-widest mt-0.5">
                  Fórmulas, linhagem criptográfica e rastreabilidade fiduciária completa.
                </p>
              </div>
            </div>
            <span className="text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border border-border dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs text-muted-foreground dark:text-zinc-400">
              {appendixExpanded ? 'Ocultar Detalhes' : 'Visualizar Detalhes'}
            </span>
          </button>

          {appendixExpanded && (
            <div className="p-6 md:p-8 space-y-8 border-t border-border dark:border-zinc-900 animate-in fade-in slide-in-from-top-4 duration-300">
              {/* Main Panels Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left Column: Security and Confidence */}
                <div className="space-y-6">
                  <FiduciaryRestrictionPanel 
                    restrictions={boardPack.fiduciaryRestrictions || []} 
                    status={boardPack.status}
                    quarantineReason={boardPack.constitutionalSection?.quarantineReason}
                  />

                  <ConfidenceDisclosurePanel 
                    confidence={boardPack.explainabilityAppendix?.confidenceDecomposition?.confidence as any}
                    rationaleMap={boardPack.explainabilityAppendix?.rationaleMap}
                    confidenceDecomposition={boardPack.explainabilityAppendix?.confidenceDecomposition}
                  />
                </div>

                {/* Right Column: Continuity Metrics */}
                <div>
                  <ContinuityRiskPanel 
                    continuityReport={boardPack.continuityReport}
                    treasuryReport={boardPack.treasuryReport}
                    fiduciaryTimeline={boardPack.fiduciaryTimeline}
                  />
                </div>

              </div>

              {/* Executive Timeline Panel */}
              <ExecutiveTimelinePanel timeline={boardPack.timeline} />

              {/* Causal Explanation Panel (ICE v1.0) */}
              <CausalityExplorerPanel causality={boardPack.causality} />

              {/* Recommended Directives Board Surface with Cognitive Integration */}
              <CognitiveNavigationProvider>
                <BoardDecisionSurface 
                  executiveDirectives={boardPack.executiveDirectives}
                  boardResolutionAppendix={boardPack.boardResolutionAppendix}
                />
                <DecisionCognitiveDrawer />
              </CognitiveNavigationProvider>

              {/* Lineage & Auditor Cryptographic Hashes */}
              <InstitutionalLineageExplorer 
                lineageAppendix={boardPack.lineageAppendix}
                disclosureSet={boardPack.disclosureSet}
                dataMode={dataMode}
              />
            </div>
          )}
        </div>
      )}

    </div>
  );
}
