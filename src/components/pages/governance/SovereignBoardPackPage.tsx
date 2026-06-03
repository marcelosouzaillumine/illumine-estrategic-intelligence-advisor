// src/components/pages/governance/SovereignBoardPackPage.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { Compass, AlertTriangle, ShieldCheck, Lock, Activity, TrendingUp, AlertOctagon, RefreshCw } from 'lucide-react';
import { InstitutionalBoardPackOutput } from '../../../core/runtime/institutional-reporting/institutional-reporting-types';
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
import { useInstitutionalAuth } from '../../../core/security/auth/InstitutionalAuthProvider';
import { getProfile, mapOfficialRoleToProfileId, PresentationLayer } from '../../../core/runtime/presentation-governance/ExecutiveAudienceProfile';
import { cn } from '../../../lib/utils';

interface SovereignBoardPackPageProps {
  boardPack?: InstitutionalBoardPackOutput | null;
  dataMode: 'REAL' | 'MOCK' | 'EMPTY' | 'ERROR';
}

export function SovereignBoardPackPage({ boardPack, dataMode }: SovereignBoardPackPageProps) {
  const { t } = useLanguage();
  const { session } = useInstitutionalAuth();
  const userRole = session?.role || 'BOARD_MEMBER';
  const profile = useMemo(() => getProfile(mapOfficialRoleToProfileId(userRole)), [userRole]);

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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/5 pb-6">
          <PageHeader 
            title="Fiduciary Decision Center" 
            subtitle="Consolidação Executiva e Deliberação Soberana de Governança." 
            icon={Compass} 
            transparent 
          />
          {boardPack && (
            <div className="flex flex-col text-right text-[10px] font-mono text-slate-500 dark:text-zinc-550 space-y-0.5">
              <span>Relatório ID: <span className="text-slate-700 dark:text-zinc-400 font-bold">{boardPack.metadata?.reportId || 'N/A'}</span></span>
              <span>Ciclo: <span className="text-slate-700 dark:text-zinc-400 font-bold">{boardPack.metadata?.cycleReference || 'N/A'}</span></span>
              <span>Gerado em: <span className="text-slate-700 dark:text-zinc-400 font-bold">{boardPack.metadata?.reportGenerationTimestamp ? new Date(boardPack.metadata.reportGenerationTimestamp).toLocaleString() : 'N/A'}</span></span>
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
                className="text-sm font-semibold text-slate-700 dark:text-zinc-350 leading-relaxed text-center px-4"
                style={{ width: '100%', maxWidth: '576px', display: 'block', margin: '0 auto', whiteSpace: 'normal', overflowWrap: 'break-word', wordBreak: 'normal' }}
              >
                {errorDesc}
              </p>
            </div>

            {/* Collapsible Technical Details (hidden from standard executive view) */}
            <div className="w-full max-w-md flex flex-col items-center gap-4">
              <button 
                onClick={() => setShowDiagnostics(!showDiagnostics)}
                className="text-[10px] text-slate-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-450 transition-colors select-none uppercase tracking-widest font-semibold outline-none focus:outline-none flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
              >
                <span>{showDiagnostics ? 'Ocultar Diagnóstico Técnico' : 'Visualizar Diagnóstico Técnico'}</span>
              </button>
              
              {showDiagnostics && (
                <div 
                  className="w-full p-6 bg-slate-100/90 dark:bg-zinc-950/80 border border-slate-200/80 dark:border-zinc-900 rounded-2xl font-mono text-[10px] text-slate-500 dark:text-zinc-400 flex flex-col gap-4 shadow-xs text-left animate-in fade-in slide-in-from-top-2 duration-200"
                  style={{ width: '100%', maxWidth: '448px' }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-white/5 pb-2.5 w-full">
                    <span className="font-semibold text-slate-450 dark:text-zinc-500 uppercase shrink-0">Estado do Runtime:</span>
                    <span className="font-bold text-red-650 dark:text-red-400 sm:text-right shrink-0">QUARANTINED / RESTRICTED</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-white/5 pb-2.5 w-full">
                    <span className="font-semibold text-slate-450 dark:text-zinc-500 uppercase shrink-0">Código de Controle:</span>
                    <span className="font-bold text-slate-800 dark:text-zinc-300 sm:text-right shrink-0">SFFL_FC_1.0</span>
                  </div>
                  <div className="flex flex-col gap-1.5 text-left pt-1 w-full">
                    <span className="font-semibold text-slate-450 dark:text-zinc-500 uppercase">Hash de Linhagem:</span>
                    <span 
                      className="font-bold text-slate-600 dark:text-zinc-500 leading-relaxed text-[9px]"
                      style={{ wordBreak: 'break-all', overflowWrap: 'anywhere', whiteSpace: 'normal', display: 'block', width: '100%' }}
                    >
                      {lineageHash}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="text-[10px] text-slate-500 dark:text-zinc-550 uppercase tracking-widest leading-relaxed font-medium w-full text-center">
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/5 pb-6">
        <PageHeader 
          title="Fiduciary Decision Center" 
          subtitle="Consolidação Executiva e Deliberação Soberana de Governança." 
          icon={Compass} 
          transparent 
        />

        <div className="flex flex-col text-right text-[10px] font-mono text-slate-500 dark:text-zinc-550 space-y-0.5">
          <span>Relatório ID: <span className="text-slate-700 dark:text-zinc-400 font-bold">{boardPack.metadata.reportId || 'N/A'}</span></span>
          <span>Ciclo: <span className="text-slate-700 dark:text-zinc-400 font-bold">{boardPack.metadata.cycleReference}</span></span>
          <span>Gerado em: <span className="text-slate-700 dark:text-zinc-400 font-bold">{new Date(boardPack.metadata.reportGenerationTimestamp).toLocaleString()}</span></span>
        </div>
      </div>

      {/* Toggle Premium de Densidade Informativa (EIDF) */}
      <div className="flex justify-center mb-4 animate-in fade-in duration-300">
        <div className="bg-slate-100 dark:bg-zinc-900 p-1.5 rounded-2xl flex gap-1 shadow-inner border border-slate-200/50 dark:border-zinc-800 text-xs">
          <span className="text-slate-400 dark:text-zinc-550 font-bold uppercase tracking-widest px-3 py-2 flex items-center select-none text-[10px]">
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
                    ? "text-slate-300 dark:text-zinc-700 cursor-not-allowed opacity-55"
                    : densityLevel === lvl
                    ? "bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md scale-105"
                    : "text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-white/50 dark:hover:bg-zinc-800/50"
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
      <div className="p-6 md:p-8 rounded-[32px] border border-slate-200 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-950/40 backdrop-blur-md space-y-6 shadow-xs">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-550">
              Tese Fiduciária Consolidada
            </span>
            <h2 className="text-sm font-bold text-slate-855 dark:text-zinc-300">
              {snapshot.unifiedThesisStatement}
            </h2>
          </div>
          {snapshot.periodScore !== undefined && (
            <div className="px-4 py-2 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center shadow-xs">
              <span className="text-[8px] text-slate-550 dark:text-zinc-500 font-black uppercase tracking-wider">Score</span>
              <span className="text-xl font-light text-slate-850 dark:text-zinc-200">{snapshot.periodScore}</span>
            </div>
          )}
        </div>

        <div className="p-4 rounded-2xl bg-slate-101/50 dark:bg-zinc-900/40 border border-slate-200/80 dark:border-zinc-900 text-xs font-semibold text-slate-700 dark:text-zinc-455 leading-relaxed shadow-xs">
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
            <span className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 bg-slate-100 dark:bg-zinc-900 text-slate-650 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800 rounded">
              NÍVEL DE PRESSÃO: {snapshot.structuralPressureLevel}
            </span>
          )}
          {snapshot.earlyWarningLevel && (
            <span className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 rounded">
              EARLY WARNING LEVEL: {snapshot.earlyWarningLevel}
            </span>
          )}
          {snapshot.stabilityIndexClassification && (
            <span className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20 rounded">
              ESTABILIDADE: {snapshot.stabilityIndexClassification}
            </span>
          )}
        </div>
      </div>

      {/* EIDF Executive Summary (Highlighted layout) */}
      {boardPack.executiveView && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-300">
          {/* Business Context Card */}
          <div className="p-6 rounded-[24px] border border-slate-200 dark:border-zinc-900 bg-slate-50/40 dark:bg-zinc-950/30 backdrop-blur-md space-y-3">
            <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400">
              <Activity className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-500">
                Contexto Executivo
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-zinc-350 leading-relaxed">
              Fase operacional identificada: <strong className="text-slate-900 dark:text-zinc-200">{boardPack.executiveView.contextoEmpresarial}</strong>.
            </p>
          </div>

          {/* Main Risks Card */}
          <div className="p-6 rounded-[24px] border border-slate-200 dark:border-zinc-900 bg-slate-50/40 dark:bg-zinc-950/30 backdrop-blur-md space-y-3">
            <div className="flex items-center gap-2 text-red-500 dark:text-red-400">
              <AlertOctagon className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-555 font-bold">
                Fatores de Risco
              </span>
            </div>
            {boardPack.executiveView.principaisRiscos && boardPack.executiveView.principaisRiscos.length > 0 ? (
              <ul className="text-xs font-semibold text-slate-700 dark:text-zinc-350 space-y-1">
                {boardPack.executiveView.principaisRiscos.map((risco, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-red-550 shrink-0">•</span>
                    <span>{risco}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs font-semibold text-slate-500 dark:text-zinc-550">Nenhum risco severo reportado.</p>
            )}
          </div>

          {/* Priorities Card */}
          <div className="p-6 rounded-[24px] border border-slate-200 dark:border-zinc-900 bg-slate-50/40 dark:bg-zinc-950/30 backdrop-blur-md space-y-3">
            <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400">
              <TrendingUp className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-555 font-bold">
                Top 3 Prioridades
              </span>
            </div>
            {boardPack.executiveView.prioridades && boardPack.executiveView.prioridades.length > 0 ? (
              <ol className="text-xs font-semibold text-slate-700 dark:text-zinc-350 space-y-1.5">
                {boardPack.executiveView.prioridades.map((prio, idx) => (
                  <li key={idx} className="flex gap-1.5 items-start">
                    <span className="text-amber-550 font-bold shrink-0">{idx + 1}.</span>
                    <span>{prio}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-xs font-semibold text-slate-500 dark:text-zinc-550">Nenhuma prioridade urgente mapeada.</p>
            )}
          </div>

          {/* Constitutional Decisions Card */}
          <div className="p-6 rounded-[24px] border border-slate-200 dark:border-zinc-900 bg-slate-50/40 dark:bg-zinc-950/30 backdrop-blur-md space-y-3">
            <div className="flex items-center gap-2 text-emerald-500 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-555 font-bold">
                Conformidade
              </span>
            </div>
            {boardPack.executiveView.decisoesConstitucionais && boardPack.executiveView.decisoesConstitucionais.length > 0 ? (
              <ul className="text-xs font-semibold text-slate-700 dark:text-zinc-350 space-y-1">
                {boardPack.executiveView.decisoesConstitucionais.map((dec, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      dec === 'COMPLIANT' || dec === 'VALID' ? "bg-emerald-500" : "bg-red-500"
                    )} />
                    <span className="uppercase tracking-wider text-[10px] font-black">
                      {dec === 'COMPLIANT' || dec === 'VALID' ? 'Conforme' : 'Desvios'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs font-semibold text-slate-505 dark:text-zinc-550">Processando conformidade fiduciária...</p>
            )}
          </div>
        </div>
      )}

      {/* Technical Appendix Section (Collapsible container, rendered conditionally) */}
      {showTechnicalAudit && (
        <div className="border border-slate-200 dark:border-zinc-900 rounded-[32px] bg-slate-50/20 dark:bg-zinc-950/20 overflow-hidden shadow-xs transition-all duration-300">
          <button
            onClick={() => setAppendixExpanded(!appendixExpanded)}
            className="w-full flex items-center justify-between p-6 md:p-8 bg-slate-100/50 dark:bg-zinc-900/50 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
          >
            <div className="flex items-center gap-3 text-left">
              <Lock className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-zinc-205">
                  Apêndice Técnico de Auditoria (Technical Appendix)
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-zinc-500 uppercase tracking-widest mt-0.5">
                  Fórmulas, linhagem criptográfica e rastreabilidade fiduciária completa.
                </p>
              </div>
            </div>
            <span className="text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs text-slate-600 dark:text-zinc-400">
              {appendixExpanded ? 'Ocultar Detalhes' : 'Visualizar Detalhes'}
            </span>
          </button>

          {appendixExpanded && (
            <div className="p-6 md:p-8 space-y-8 border-t border-slate-200 dark:border-zinc-900 animate-in fade-in slide-in-from-top-4 duration-300">
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

              {/* Recommended Directives Board Surface */}
              <BoardDecisionSurface 
                executiveDirectives={boardPack.executiveDirectives}
                boardResolutionAppendix={boardPack.boardResolutionAppendix}
              />

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
