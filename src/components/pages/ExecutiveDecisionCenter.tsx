import React from 'react';
import { Compass, ShieldCheck, AlertTriangle, TrendingUp, Activity, CheckCircle2, Target } from 'lucide-react';
import { cn, formatCurrency } from '../../lib/utils';
import { ExecutiveDecisionOutput } from '../../services/ExecutiveRuntimeAdapter';

interface ExecutiveDecisionCenterProps {
  executionIntelligence: any;
  executiveDecision: ExecutiveDecisionOutput | null;
  scenarioComparisons: any[];
}

export function ExecutiveDecisionCenter({ executionIntelligence, executiveDecision, scenarioComparisons }: ExecutiveDecisionCenterProps) {
  
  return (
    <div className="space-y-12">
      {/* EXECUTIVE DECISION CENTER */}
      {executiveDecision && (
        <div className="bg-slate-900 rounded-3xl p-8 shadow-xl mt-12 text-white border border-slate-800">
          <div className="flex items-center gap-3 mb-8">
            <Target className="text-emerald-400" size={24} />
            <div>
              <h3 className="text-xl font-black">Executive Decision Center</h3>
              <p className="text-xs text-slate-400">Síntese automatizada de recomendação fiduciária</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Recomendação Diretiva</p>
              <p className="text-lg font-black text-emerald-400">{executiveDecision.recommendedScenario}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Nível de Confiança</p>
              <p className={cn(
                "text-lg font-black",
                executiveDecision.confidenceLevel === 'Alta' ? "text-emerald-400" :
                executiveDecision.confidenceLevel === 'Média' ? "text-blue-400" : "text-rose-400"
              )}>{executiveDecision.confidenceLevel}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Valor Econômico</p>
              <p className="text-lg font-black text-white">{formatCurrency(executiveDecision.rankedScenarios.find(s => s.scenarioName === executiveDecision.recommendedScenario)?.enterpriseValue || 0)}</p>
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-500/20 rounded-2xl p-6 mb-8">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-3">Narrativa Executiva</h4>
            <p className="text-sm text-blue-100 leading-relaxed font-medium">
              {executiveDecision.executiveSummary}
            </p>
            {executiveDecision.strategicWarnings.length > 0 && (
              <div className="mt-4 pt-4 border-t border-blue-500/20">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-2">Alertas Estratégicos:</h5>
                <ul className="space-y-1">
                  {executiveDecision.strategicWarnings.map((warning, i) => (
                    <li key={i} className="text-xs text-amber-200/80 flex items-start gap-2">
                      <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-2xl p-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-4 flex items-center gap-2">
                <TrendingUp size={14} /> Ganhos Esperados
              </h4>
              <ul className="space-y-2">
                {executiveDecision.tradeOffs.gains.map((gain, i) => (
                  <li key={i} className="text-xs text-emerald-100 font-medium flex items-start gap-2">
                    <span className="text-emerald-500 font-black">+</span> {gain}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-rose-900/10 border border-rose-500/20 rounded-2xl p-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-4 flex items-center gap-2">
                <Activity size={14} /> Trade-offs & Requisitos
              </h4>
              <ul className="space-y-2">
                {executiveDecision.tradeOffs.losses.map((loss, i) => (
                  <li key={i} className="text-xs text-rose-100 font-medium flex items-start gap-2">
                    <span className="text-rose-500 font-black">-</span> {loss}
                  </li>
                ))}
                {executiveDecision.tradeOffs.requirements.map((req, i) => (
                  <li key={i} className="text-xs text-amber-100 font-medium flex items-start gap-2">
                    <span className="text-amber-500 font-black">!</span> {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-8">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Rankeamento Fiduciário</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="py-3 text-[10px] font-black uppercase tracking-widest text-slate-500">Cenário</th>
                    <th className="py-3 text-[10px] font-black uppercase tracking-widest text-slate-500">Categoria</th>
                    <th className="py-3 text-[10px] font-black uppercase tracking-widest text-slate-500">Valor Empresa</th>
                    <th className="py-3 text-[10px] font-black uppercase tracking-widest text-slate-500">Métricas EFOS</th>
                    <th className="py-3 text-[10px] font-black uppercase tracking-widest text-slate-500">Racional</th>
                  </tr>
                </thead>
                <tbody>
                  {scenarioComparisons.map((row) => {
                    const rank = executiveDecision?.rankedScenarios.find(r => r.scenarioId === row.id);
                    return (
                      <tr key={row.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 text-xs font-bold text-slate-300">{row.label}</td>
                        <td className="py-4">
                          <span className={cn(
                            "px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded border",
                            rank?.rankCategory === '1º Recomendado' ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                            rank?.rankCategory === '2º Alternativo' ? "bg-blue-500/20 text-blue-400 border-blue-500/30" :
                            "bg-amber-500/20 text-amber-400 border-amber-500/30"
                          )}>
                            {rank?.rankCategory}
                          </span>
                        </td>
                        <td className="py-4 text-xs font-medium text-slate-300">{formatCurrency(rank?.enterpriseValue || 0)}</td>
                        <td className="py-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-mono text-slate-400">IEI: {rank?.ieiScore.toFixed(0)}</span>
                            <span className="text-[9px] font-mono text-slate-400">IRG: {rank?.irgScore.toFixed(0)}</span>
                          </div>
                        </td>
                        <td className="py-4 text-[10px] text-slate-400 max-w-[200px] truncate" title={rank?.reasoning}>
                          {rank?.reasoning}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* EXECUTION INTELLIGENCE LAYER */}
      <div className="bg-slate-900 rounded-3xl p-8 shadow-xl text-white border border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <Compass className="text-blue-400" size={24} />
          <h3 className="text-xl font-black">Inteligência de Execução Institucional</h3>
        </div>

        {executionIntelligence?.status === 'NOT_AVAILABLE' ? (
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
            <ShieldCheck className="text-slate-500 mb-3" size={32} />
            <h4 className="text-sm font-bold text-slate-300">Capacidade Institucional Não Disponível</h4>
            <p className="text-xs text-slate-400 mt-2 max-w-md">Não é possível calcular o risco de execução para este cenário, pois a organização não possui um diagnóstico EFOS válido vigente (Prospecto sem dados). </p>
          </div>
        ) : executionIntelligence?.status === 'CERTIFIED' && executionIntelligence.assessment && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Diagnóstico E-F-O-S Atual</p>
                <p className="text-2xl font-black text-white">{executionIntelligence.efosScore}</p>
              </div>
              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Governance Pressure</p>
                <p className="text-2xl font-black text-amber-400">{executionIntelligence.assessment.governancePressureIndex.toFixed(0)}</p>
              </div>
              <div className="bg-slate-800/80 p-5 rounded-2xl border border-blue-900/50">
                <p className="text-[9px] font-black uppercase tracking-widest text-blue-400 mb-1">Execution Index</p>
                <p className="text-2xl font-black text-blue-300">{executionIntelligence.assessment.institutionalExecutionIndex.toFixed(0)}</p>
              </div>
              <div className="bg-slate-800/80 p-5 rounded-2xl border border-purple-900/50">
                <p className="text-[9px] font-black uppercase tracking-widest text-purple-400 mb-1">Readiness Gap (IRG)</p>
                <p className="text-2xl font-black text-purple-300">{executionIntelligence.readiness.readinessGap.toFixed(0)}</p>
              </div>
              <div className={cn(
                "p-5 rounded-2xl border",
                executionIntelligence.assessment.riskLevel === 'Baixo' ? "bg-emerald-900/30 border-emerald-800" :
                executionIntelligence.assessment.riskLevel === 'Moderado' ? "bg-blue-900/30 border-blue-800" :
                executionIntelligence.assessment.riskLevel === 'Elevado' ? "bg-amber-900/30 border-amber-800" :
                "bg-rose-900/30 border-rose-800"
              )}>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Risco Executivo</p>
                <p className={cn(
                  "text-lg font-black uppercase",
                  executionIntelligence.assessment.riskLevel === 'Baixo' ? "text-emerald-400" :
                  executionIntelligence.assessment.riskLevel === 'Moderado' ? "text-blue-400" :
                  executionIntelligence.assessment.riskLevel === 'Elevado' ? "text-amber-400" :
                  "text-rose-400"
                )}>{executionIntelligence.assessment.riskLevel}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
