// src/components/pages/InstitutionalContinuityCockpitPage.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { ShieldCheck, Loader2, Milestone, Server, Shield, CheckCircle2, AlertTriangle, AlertOctagon, HeartPulse } from 'lucide-react';
import { useAnnualFinancialData, useAllFinancialData } from '../../hooks/useFinancialData';
import { executiveRuntime } from '../../services/FiduciaryRuntimeAdapter';
import { InstitutionalLifecycleSurface } from '../institutional-continuity/InstitutionalLifecycleSurface';
import { FiduciaryContinuityPanel } from '../institutional-continuity/FiduciaryContinuityPanel';
import { RecoveryRegressionTimeline } from '../institutional-continuity/RecoveryRegressionTimeline';
import { ResilienceAntifragilityRadar } from '../institutional-continuity/ResilienceAntifragilityRadar';
import { FiduciaryRestrictionOverlay } from '../institutional-continuity/FiduciaryRestrictionOverlay';
import { InstitutionalTrajectoryGraph } from '../institutional-continuity/InstitutionalTrajectoryGraph';
import { ExecutiveContinuityNarrativePanel } from '../institutional-continuity/ExecutiveContinuityNarrativePanel';
import { InstitutionalEvidenceControlCenterPage } from '../evidence-ingestion/InstitutionalEvidenceControlCenterPage';

interface CockpitProps {
  clientId?: string;
  selectedYear?: number;
  selectedMonth?: number;
}

export function InstitutionalContinuityCockpitPage({ clientId, selectedYear, selectedMonth }: CockpitProps) {
  const filterYear = selectedYear || new Date().getFullYear();

  // 1. Fetch Real Database Inputs
  const { dbData: dbDataDRE, docIds: docIdsDRE, loading: loadingDRE } = useAnnualFinancialData(clientId || '', filterYear, 'DRE');
  const { dbData: dbDataBP, loading: loadingBP } = useAnnualFinancialData(clientId || '', filterYear, 'BP');
  const { dbData: allHistoryData, loading: loadingHistory } = useAllFinancialData(clientId || '');

  const loading = loadingDRE || loadingBP || loadingHistory;

  // 2. Compute Sovereign EFOS Report
  const report = useMemo(() => {
    if (loading || !clientId) return null;
    const input = {
      clientProfile: { id: clientId },
      dreData: dbDataDRE,
      bpData: dbDataBP,
      rawFinancialData: { filterYear, allHistoryData },
      historicalCyclesCount: docIdsDRE.length,
      isMockData: dbDataDRE.length === 0,
      historicalSeries: allHistoryData
    };
    return executiveRuntime.generateExecutiveReport(input);
  }, [clientId, filterYear, dbDataDRE, dbDataBP, allHistoryData, docIdsDRE.length, loading]);

  if (!clientId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-8 bg-zinc-950 border border-zinc-800 rounded-3xl p-20 text-center w-full text-zinc-100 font-mono">
        <div className="w-24 h-24 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 shadow-xl relative animate-pulse">
          <HeartPulse size={48} />
        </div>
        <div className="text-center space-y-4 w-full max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight">Selecione uma Empresa</h2>
          <p className="text-zinc-500 text-xs tracking-wider uppercase">
            Selecione uma organização fiduciária ativa para carregar o cockpit de continuidade.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center font-mono bg-zinc-950 text-zinc-100">
        <div className="flex flex-col items-center gap-4 text-zinc-500">
          <Loader2 className="animate-spin" size={32} />
          <p className="text-xs uppercase tracking-widest">Avaliando Linhagem e Continuidade...</p>
        </div>
      </div>
    );
  }

  // 3. Fallbacks and Data Extraction
  const rep = report as any;
  const survivalReport = rep?.survivalReport || {
    activeSurvivalMode: 'NORMAL',
    survivalNarrative: 'Sem dados suficientes.',
    survivalTriggersActive: [],
    blockedActions: []
  };

  const recoveryReport = rep?.recoveryReport || {
    activeRecoveryStage: 'NONE',
    recoveryNarrative: 'Sem dados suficientes.',
    institutionalRecoveryConfidence: 'LOW'
  };

  const regressionReport = rep?.recoveryReport?.regressionReport || rep?.regressionReport || {
    regressionDetected: false,
    regressionNarrative: 'Sem desvios detectados.'
  };

  const resilienceReport = rep?.recoveryReport?.resilienceReport || rep?.resilienceReport || {
    resilienceClassification: 'STRUCTURALLY_STABLE',
    antifragilityValidated: false,
    confidenceLevel: 'LOW',
    resilienceScore: 0,
    resilienceNarrative: 'Análise de resiliência pendente de histórico longitudinal.'
  };

  const fiduciaryOutput = rep?.capitalGovernanceReport?.fiduciaryOutput || {
    consolidatedSeverity: 'NORMAL',
    treasuryProtectionLevel: 'STRONG',
    institutionalContinuityRisk: 'LOW',
    activeFiduciaryLocks: []
  };

  const longitudinalRuntimeHistory = allHistoryData?.map((d: any) => ({
    fco: d.fco || 0,
    survivalModeActive: false,
    treasurySeverity: 'STABLE',
    cycleId: d.exercicio ? `Exercicio ${d.exercicio}` : 'N/A'
  })) || [];

  const auditTrail = rep?.deploymentReadiness?.auditTrail || [];
  const failClosedTriggered = rep?.deploymentReadiness?.deploymentBlocked || false;
  const readinessMatrix = rep?.deploymentReadiness?.readinessMatrix;
  const evidenceReport = rep?.institutionalEvidence;

  if (evidenceReport?.fiduciaryInterpretationBlocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-8 bg-zinc-950 border border-zinc-800 rounded-3xl p-20 text-center w-full text-zinc-100 font-mono">
        <div className="w-24 h-24 rounded-full bg-red-950/50 border border-red-900/50 flex items-center justify-center text-red-500 shadow-xl relative">
          <AlertTriangle size={48} />
        </div>
        <div className="text-center space-y-4 w-full max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight text-red-400">Visão Institucional Indisponível — evidência fiduciária não validada.</h2>
          <p className="text-zinc-500 text-xs tracking-wider uppercase">
            A proteção de Fail-Closed está ativa. Os componentes de continuidade institucional estão bloqueados devido a inconsistências ou falta de validação das evidências contábeis primárias.
          </p>
        </div>
        <div className="w-full max-w-4xl text-left mt-8">
          <InstitutionalEvidenceControlCenterPage evidenceReport={evidenceReport} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full text-zinc-100 pb-12 bg-zinc-950 p-6 rounded-3xl border border-zinc-800 font-mono">
      
      {/* Sovereign Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <ShieldCheck size={16} />
            <span className="text-[10px] uppercase font-bold tracking-widest font-mono">Sovereign Fiduciary Board Room</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Institutional Continuity Cockpit</h1>
          <p className="text-xs text-zinc-500 font-mono mt-1 uppercase tracking-widest">Sovereign Fiduciary Lifecycle Visualization Layer</p>
        </div>
        
        {rep?.metadata?.lineageHash && (
          <div className="text-[10px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span>Lineage Hash:</span>
            <span className="font-bold text-zinc-300">{rep.metadata.lineageHash.substring(0, 16)}...</span>
          </div>
        )}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Top Row: Lifecycle (Full width) */}
        <div className="xl:col-span-12">
          <InstitutionalLifecycleSurface 
            activeSurvivalMode={survivalReport.activeSurvivalMode}
            activeRecoveryStage={recoveryReport.activeRecoveryStage}
            regressionDetected={regressionReport.regressionDetected}
            resilienceClassification={resilienceReport.resilienceClassification}
            antifragilityValidated={resilienceReport.antifragilityValidated}
            confidenceLevel={resilienceReport.confidenceLevel}
          />
        </div>

        {/* Middle Row Left: Fiduciary State & Restriction */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <FiduciaryContinuityPanel 
            activeSurvivalMode={survivalReport.activeSurvivalMode}
            activeRecoveryStage={recoveryReport.activeRecoveryStage}
            regressionDetected={regressionReport.regressionDetected}
            resilienceClassification={resilienceReport.resilienceClassification}
            antifragilityValidated={resilienceReport.antifragilityValidated}
            institutionalRecoveryConfidence={recoveryReport.institutionalRecoveryConfidence}
            treasuryProtectionLevel={fiduciaryOutput.treasuryProtectionLevel}
            institutionalContinuityRisk={fiduciaryOutput.institutionalContinuityRisk}
            confidenceLevel={resilienceReport.confidenceLevel}
          />
          <FiduciaryRestrictionOverlay 
            activeFiduciaryLocks={fiduciaryOutput.activeFiduciaryLocks}
            blockedActions={survivalReport.blockedActions}
            survivalTriggersActive={survivalReport.survivalTriggersActive}
            consolidatedSeverity={fiduciaryOutput.consolidatedSeverity}
            failClosedTriggered={failClosedTriggered}
          />
        </div>

        {/* Middle Row Center: Radar & Trajectory */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          <ResilienceAntifragilityRadar 
            resilienceScore={resilienceReport.resilienceScore}
            antifragilityScore={resilienceReport.antifragilityScore}
            vulnerabilityReductionScore={resilienceReport.vulnerabilityReductionScore}
            institutionalLearningScore={resilienceReport.institutionalLearningScore}
            shockAbsorptionScore={resilienceReport.shockAbsorptionScore}
            resilienceClassification={resilienceReport.resilienceClassification}
            antifragilityValidated={resilienceReport.antifragilityValidated}
            confidenceLevel={resilienceReport.confidenceLevel}
            blockedConclusions={resilienceReport.blockedConclusions || []}
            allowedConclusions={resilienceReport.allowedConclusions || []}
          />
          <InstitutionalTrajectoryGraph 
            longitudinalRuntimeHistory={longitudinalRuntimeHistory}
            confidenceLevel={resilienceReport.confidenceLevel}
          />
        </div>

        {/* Middle Row Right: Timeline & Narrative */}
        <div className="xl:col-span-3 flex flex-col gap-6">
          <RecoveryRegressionTimeline 
            events={[]} 
            auditTrail={auditTrail}
            regressionDetected={regressionReport.regressionDetected}
            activeRecoveryStage={recoveryReport.activeRecoveryStage}
            regressionNarrative={regressionReport.regressionNarrative}
          />
          <ExecutiveContinuityNarrativePanel 
            survivalNarrative={survivalReport.survivalNarrative}
            recoveryNarrative={recoveryReport.recoveryNarrative}
            regressionNarrative={regressionReport.regressionNarrative}
            resilienceNarrative={resilienceReport.resilienceNarrative}
            confidenceLevel={resilienceReport.confidenceLevel}
            failClosedTriggered={failClosedTriggered}
          />
        </div>

        {/* Bottom Row: Go-Live Readiness Evaluation */}
        {readinessMatrix && (
          <div className="xl:col-span-12 mt-6 bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Milestone size={14} className="text-zinc-500" /> Go-Live Deployment & Fiduciary Readiness Assessment
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Column 1: Production Readiness */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                    <Server size={14} className="text-zinc-400" /> Production Readiness (Technical)
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider ${readinessMatrix.productionReadiness.status === 'VALIDATED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-900'}`}>
                    {readinessMatrix.productionReadiness.status}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 leading-relaxed">{readinessMatrix.productionReadiness.description}</p>
                <div className="space-y-2">
                  {readinessMatrix.productionReadiness.issues.length === 0 ? (
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1 bg-emerald-950/20 p-2 rounded-lg border border-emerald-900/30">
                      <CheckCircle2 size={12} />
                      <span>Todos os critérios técnicos de compilação, testes e variáveis de ambiente atendidos.</span>
                    </div>
                  ) : (
                    readinessMatrix.productionReadiness.issues.map((issue, idx) => (
                      <div key={idx} className="text-[10px] text-red-400 flex items-start gap-1.5 bg-red-950/20 p-2 rounded-lg border border-red-900/30">
                        <AlertOctagon size={12} className="shrink-0 mt-0.5" />
                        <span>{issue}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Column 2: Fiduciary Readiness */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                    <Shield size={14} className="text-zinc-400" /> Fiduciary Readiness (Governance)
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider ${readinessMatrix.fiduciaryReadiness.status === 'VALIDATED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-900'}`}>
                    {readinessMatrix.fiduciaryReadiness.status}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 leading-relaxed">{readinessMatrix.fiduciaryReadiness.description}</p>
                <div className="space-y-2">
                  {readinessMatrix.fiduciaryReadiness.issues.length === 0 ? (
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1 bg-emerald-950/20 p-2 rounded-lg border border-emerald-900/30">
                      <CheckCircle2 size={12} />
                      <span>Assinaturas criptográficas, isolamento e salvaguardas fail-closed ativas e válidas.</span>
                    </div>
                  ) : (
                    readinessMatrix.fiduciaryReadiness.issues.map((issue, idx) => (
                      <div key={idx} className="text-[10px] text-red-400 flex items-start gap-1.5 bg-red-950/20 p-2 rounded-lg border border-red-900/30">
                        <AlertOctagon size={12} className="shrink-0 mt-0.5" />
                        <span>{issue}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Sub Matrix dimensions details */}
              <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t border-zinc-800">
                <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-800 text-center space-y-1">
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest">Governance</span>
                  <span className={`text-[10px] font-bold block ${readinessMatrix.governanceReadiness.status === 'VALIDATED' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {readinessMatrix.governanceReadiness.status}
                  </span>
                </div>
                <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-800 text-center space-y-1">
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest">Continuity</span>
                  <span className={`text-[10px] font-bold block ${readinessMatrix.continuityReadiness.status === 'VALIDATED' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {readinessMatrix.continuityReadiness.status}
                  </span>
                </div>
                <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-800 text-center space-y-1">
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest">Observability</span>
                  <span className={`text-[10px] font-bold block ${readinessMatrix.observabilityReadiness.status === 'VALIDATED' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {readinessMatrix.observabilityReadiness.status}
                  </span>
                </div>
                <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-800 text-center space-y-1">
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest">Auditability</span>
                  <span className={`text-[10px] font-bold block ${readinessMatrix.auditabilityReadiness.status === 'VALIDATED' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {readinessMatrix.auditabilityReadiness.status}
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
