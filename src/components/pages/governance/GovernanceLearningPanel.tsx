// src/components/pages/governance/GovernanceLearningPanel.tsx

import React from 'react';
import { 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Award,
  Activity,
  Zap,
  ShieldCheck,
  BrainCircuit,
  TrendingUp
} from 'lucide-react';
import { FiduciaryRuntimeAdapter, ESGIMScenario } from '../../../services/FiduciaryRuntimeAdapter';

interface GovernanceLearningPanelProps {
  clientId: string;
  scenario: ESGIMScenario;
}

export function GovernanceLearningPanel({ clientId, scenario }: GovernanceLearningPanelProps) {
  // 1. Fetch data from the adapter
  const learning = FiduciaryRuntimeAdapter.governanceLearningEngine.calculateLearning(clientId, 'DEMO_SCENARIO', scenario);
  const readiness = FiduciaryRuntimeAdapter.benchmarkReadinessEngine.evaluateReadiness(clientId, scenario);

  const isBlocked = readiness.certificationStatus === 'NOT_CERTIFIED';
  
  // Helper for AAI Level styling
  const getAAIStyles = (level: string) => {
    switch (level) {
      case 'HIGHLY_ACCURATE':
        return { text: 'text-primary bg-primary border-primary', label: 'Highly Accurate' };
      case 'RELIABLE':
        return { text: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25', label: 'Reliable (Confiável)' };
      case 'NEEDS_CALIBRATION':
        return { text: 'text-amber-400 bg-amber-500/10 border-amber-500/25', label: 'Needs Calibration' };
      case 'WEAK_PREDICTIVE_ACCURACY':
      default:
        return { text: 'text-red-400 bg-red-500/10 border-red-500/25', label: 'Weak Predictive Accuracy' };
    }
  };

  const getObservationStatusStyles = (status: string) => {
    switch (status) {
      case 'EXCEEDED':
        return 'text-primary bg-primary border-primary';
      case 'ACHIEVED':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'PARTIALLY_ACHIEVED':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'FAILED':
      default:
        return 'text-red-400 bg-red-500/10 border-red-500/20';
    }
  };

  const aaiTheme = getAAIStyles(learning.aaiLevel);

  return (
    <div className="bg-gray-900/60 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 space-y-8 shadow-2xl relative overflow-hidden">
      
      {/* Background soft lighting */}
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full filter blur-[120px] opacity-10 transition-colors duration-1000 ${isBlocked ? 'bg-red-500' : 'bg-emerald-500'}`} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/25 text-emerald-400 shadow-lg shadow-emerald-500/5">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-white">
                Governance Learning Layer
              </h2>
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-full">
                GLL™ v1.0
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
              Fechamento de Malha: Acurácia de Projeção, Lições Aprendidas e Calibração Fiduciária
            </p>
          </div>
        </div>

        {/* Data mode info */}
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground bg-gray-950/40 border border-border px-3 py-1.5 rounded-xl">
          <Info className="w-3.5 h-3.5 text-emerald-400" />
          <span className="uppercase tracking-wider">Feedback Mode: {learning.feedbackMode}</span>
        </div>
      </div>

      {/* BLOCKED OVERLAY / STATE (BRL Gate) */}
      {isBlocked ? (
        <div className="p-6 bg-red-950/10 border border-dashed border-red-900/30 rounded-2xl space-y-5 text-center relative overflow-hidden">
          <div className="p-4 bg-red-500/10 rounded-full w-14 h-14 flex items-center justify-center mx-auto text-red-400 border border-red-500/20 shadow-lg shadow-red-500/5">
            <Lock className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-base font-extrabold text-white uppercase tracking-wider">
              Revisão de Aprendizado Suspensa
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              O loop de controle e a medição de eficácia das recomendações permanecem suspensos até que a holding atinja a consistência de dados fiduciários mínima (BRL™).
            </p>
          </div>

          <div className="max-w-xl mx-auto p-4 bg-black/40 rounded-xl text-left border border-border space-y-3">
            <span className="text-[10px] font-black text-red-400 uppercase tracking-widest block border-b border-border pb-1.5">
              Motivo do Bloqueio fiduciário:
            </span>
            <p className="text-xs text-muted-foreground font-mono">
              {readiness.benchmarkBlockedReason}
            </p>
            
            <span className="text-[10px] font-black text-primary uppercase tracking-widest block border-b border-border pt-2 pb-1.5">
              Ações Requeridas para Desbloqueio do Aprendizado:
            </span>
            <div className="space-y-1.5">
              {readiness.requiredBeforeBenchmark?.map((req, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Simulated Feedback Banner */}
          {learning.feedbackMode === 'SIMULATED_FEEDBACK' && (
            <div className="p-4 bg-primary border border-primary text-primary rounded-2xl flex items-start gap-3 shadow-md shadow-indigo-500/5">
              <Info className="w-5 h-5 shrink-0 mt-0.5 text-primary" />
              <div className="space-y-1 text-xs">
                <span className="font-extrabold uppercase tracking-wider block">Dados de Feedback Simulado (SIMULATED_FEEDBACK):</span>
                <p className="font-semibold leading-relaxed">
                  Os dados de eficácia, variância e lições aprendidas estão sendo gerados através de modelos de simulação histórica.
                </p>
                <p className="text-[10px] text-primary leading-normal">
                  Esta camada está configurada em modo simulação de baseline para demonstrar o fechamento da malha de controle enquanto a coleta de dados de execução real é consolidada.
                </p>
              </div>
            </div>
          )}

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* GLI Dial */}
            <div className="bg-black/20 border border-border rounded-2xl p-6 flex flex-col items-center justify-between text-center relative overflow-hidden">
              <div className="absolute top-2 left-2 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">GLI™ INDEX</span>
              </div>

              <div className="relative flex items-center justify-center my-4">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    stroke="#1f2937"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    stroke="#10b981"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={326}
                    strokeDashoffset={326 - (326 * learning.gliScore) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-white tracking-tight">{learning.gliScore}</span>
                  <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">GLI™ Score</span>
                </div>
              </div>

              <div className="space-y-2 w-full">
                <div className="py-1 px-3.5 rounded-lg border text-center font-bold text-[10px] tracking-wider text-emerald-400 bg-emerald-500/10 border-emerald-500/25 uppercase">
                  Maturidade: {learning.learningMaturity}
                </div>
                <p className="text-[10px] text-muted-foreground leading-normal">
                  Governance Learning Index mede a taxa de sucesso das iniciativas deliberadas e marcos do roadmap.
                </p>
              </div>
            </div>

            {/* AAI Dial */}
            <div className="bg-black/20 border border-border rounded-2xl p-6 flex flex-col items-center justify-between text-center relative overflow-hidden">
              <div className="absolute top-2 left-2 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">AAI™ INDEX</span>
              </div>

              <div className="relative flex items-center justify-center my-4">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    stroke="#1f2937"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    stroke="#8b5cf6"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={326}
                    strokeDashoffset={326 - (326 * learning.aaiScore) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-white tracking-tight">{learning.aaiScore}%</span>
                  <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">AAI™ Score</span>
                </div>
              </div>

              <div className="space-y-2 w-full">
                <div className={`py-1 px-3.5 rounded-lg border text-center font-bold text-[10px] tracking-wider uppercase ${aaiTheme.text}`}>
                  {aaiTheme.label}
                </div>
                <p className="text-[10px] text-muted-foreground leading-normal">
                  Advisory Accuracy Index afere a variância entre o impacto projetado das recomendações e o resultado real obtido.
                </p>
              </div>
            </div>

            {/* Summary & Calibrations */}
            <div className="bg-black/20 border border-border rounded-2xl p-6 flex flex-col justify-between space-y-4">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">Análise de Malha de Aprendizado</span>
              
              <div className="p-4 bg-gray-950/40 border border-border rounded-xl">
                <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
                  {learning.executiveSummary}
                </p>
              </div>

              <div className="text-[10px] text-muted-foreground border-t border-border pt-3 leading-relaxed">
                <strong>Assinatura de Rastreabilidade (Hash):</strong>
                <p className="font-mono text-[9px] text-muted-foreground mt-1 break-all select-all">{learning.lineageHash}</p>
              </div>
            </div>

          </div>

          {/* Observations and Lessons Learned */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-450" />
              Observações e Análise de Eficácia de Recomendações
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {learning.observations.map((obs, idx) => {
                const statusStyle = getObservationStatusStyles(obs.status);
                return (
                  <div key={idx} className="p-4 bg-slate-950/40 border border-border hover:border-border transition-all rounded-2xl space-y-3 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">{obs.id} / Fonte: {obs.source}</span>
                        <h4 className="text-xs font-extrabold text-white leading-tight">{obs.title}</h4>
                      </div>
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${statusStyle}`}>
                        {obs.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-border pt-2 text-[10px]">
                      <div>
                        <span className="text-muted-foreground block uppercase font-bold text-[8px]">Esperado:</span>
                        <p className="text-muted-foreground">{obs.expectedOutcome}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground block uppercase font-bold text-[8px]">Real Obtido:</span>
                        <p className="text-muted-foreground">{obs.actualOutcome}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-black/40 border border-border rounded-xl space-y-2">
                      <div>
                        <span className="text-[8px] font-black uppercase text-primary tracking-wider block">Lição Aprendida</span>
                        <p className="text-[10px] text-muted-foreground italic leading-relaxed">{obs.lessonsLearned[0]}</p>
                      </div>
                      
                      {obs.expectedImpact !== undefined && (
                        <div className="flex justify-between items-center text-[9px] border-t border-border pt-1 text-muted-foreground">
                          <span>Eficácia: <strong className="text-emerald-400">{obs.effectivenessScore}%</strong></span>
                          <span>Impacto (Proj vs Real): <strong className="text-primary">{obs.expectedImpact} vs {obs.actualImpact} BPS</strong></span>
                          <span>Var: <strong className={obs.variance === 0 ? 'text-muted-foreground' : 'text-amber-400'}>{obs.variance} BPS</strong></span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Capabilities vs Failures */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Strengths / Capabilities */}
            <div className="p-5 bg-black/15 border border-border rounded-2xl space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Capacidades Institucionais Consolidadas (Success Loop)
              </span>
              <div className="space-y-2">
                {learning.institutionalStrengths.length > 0 ? (
                  learning.institutionalStrengths.map((str, idx) => (
                    <div key={idx} className="text-xs text-muted-foreground flex items-start gap-2 leading-relaxed">
                      <span className="text-emerald-500 font-bold mt-0.5">✔</span>
                      <span>{str}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground italic">Nenhum padrão repetitivo de sucesso fiduciário consolidado.</p>
                )}
              </div>
            </div>

            {/* Recurring obstacles / Failures */}
            <div className="p-5 bg-black/15 border border-border rounded-2xl space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-red-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-red-400" />
                Obstáculos e Padrões Recorrentes de Falha (Failure Loop)
              </span>
              <div className="space-y-2">
                {learning.recurringFailures.length > 0 ? (
                  learning.recurringFailures.map((fail, idx) => (
                    <div key={idx} className="text-xs text-muted-foreground flex items-start gap-2 leading-relaxed">
                      <span className="text-red-500 font-bold mt-0.5">⚠</span>
                      <span>{fail}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-emerald-500 flex items-start gap-2 leading-relaxed font-semibold">
                    <span className="font-bold">✔</span>
                    <span>Nenhum gargalo recorrente ou gargalos fiduciários acumulados.</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* GLL Limitations */}
          <div className="p-4 bg-black/30 border border-border rounded-2xl flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-450 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block">
                Regra de Imutabilidade Histórica Fiduciária (GLL™ Rule)
              </span>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Em conformidade com as diretrizes constitucionais fiduciárias, a Governance Learning Layer (GLL™) analisa eficácias e desvios de forma estritamente retroativa. Ela gera observações de aprendizado e calibrações preditivas futuras, mas nunca altera ou reescreve evidências originais, diagnósticos anteriores ou deliberações documentadas do conselho.
              </p>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
