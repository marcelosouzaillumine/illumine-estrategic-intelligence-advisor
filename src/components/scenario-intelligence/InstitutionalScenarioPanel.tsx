// src/components/scenario-intelligence/InstitutionalScenarioPanel.tsx
import React, { useState } from 'react';
import { Settings2, Play, AlertTriangle, ShieldAlert, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { FiduciaryRuntimeAdapter, InstitutionalScenarioResult } from '../../services/FiduciaryRuntimeAdapter';

interface Props {
  contextData: any; // Raw data passed from the dashboard
}

export function InstitutionalScenarioPanel({ contextData }: Props) {
  const [formState, setFormState] = useState({
    estoque: 0,
    receita: 0,
    ebitda: 0,
    prazoPgm: 0,
    prazoRec: 0,
    capex: 0
  });

  const [scenarioResult, setScenarioResult] = useState<InstitutionalScenarioResult | null>(null);

  const handleSimulate = () => {
    const inputs = FiduciaryRuntimeAdapter.ScenarioAdapter.adaptFormInputs(formState);
    if (inputs.length === 0) return;
    const result = FiduciaryRuntimeAdapter.InstitutionalScenarioEngine.evaluateScenario(inputs, contextData);
    setScenarioResult(result);
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-8">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <Settings2 size={24} className="text-primary-500" />
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Institutional Scenario Intelligence</h2>
            <p className="text-xs font-medium text-slate-500">Simulação estrutural baseada em propagação e constraints fiduciárias.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Variáveis de Choque</h3>
            
            <div className="space-y-3">
              <label className="block">
                <span className="text-xs font-bold text-slate-700">Volume de Estoque (%)</span>
                <input 
                  type="range" min="-50" max="100" step="5"
                  value={formState.estoque} onChange={e => setFormState({...formState, estoque: parseInt(e.target.value)})}
                  className="w-full mt-2 accent-primary-600"
                />
                <div className="text-right text-[10px] font-mono font-bold text-slate-500">{formState.estoque > 0 ? `+${formState.estoque}` : formState.estoque}%</div>
              </label>

              <label className="block">
                <span className="text-xs font-bold text-slate-700">Receita Bruta (%)</span>
                <input 
                  type="range" min="-50" max="50" step="5"
                  value={formState.receita} onChange={e => setFormState({...formState, receita: parseInt(e.target.value)})}
                  className="w-full mt-2 accent-primary-600"
                />
                <div className="text-right text-[10px] font-mono font-bold text-slate-500">{formState.receita > 0 ? `+${formState.receita}` : formState.receita}%</div>
              </label>

              <label className="block">
                <span className="text-xs font-bold text-slate-700">CAPEX Adicional (%)</span>
                <input 
                  type="range" min="0" max="100" step="5"
                  value={formState.capex} onChange={e => setFormState({...formState, capex: parseInt(e.target.value)})}
                  className="w-full mt-2 accent-primary-600"
                />
                <div className="text-right text-[10px] font-mono font-bold text-slate-500">+{formState.capex}%</div>
              </label>
            </div>
          </div>

          <button 
            onClick={handleSimulate}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white p-3 rounded-xl hover:bg-primary-600 transition-colors font-bold text-xs uppercase tracking-wider"
          >
            <Play size={16} />
            Executar Propagação
          </button>
        </div>

        {/* Results */}
        <div className="lg:col-span-8 bg-slate-50 rounded-2xl p-6 border border-slate-100">
          {!scenarioResult ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
              <Settings2 size={48} className="opacity-20" />
              <p className="text-sm font-medium">Ajuste as variáveis e execute a propagação para visualizar o impacto estrutural.</p>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              {/* Validation Status */}
              {scenarioResult.validation.status !== 'VALID' ? (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex gap-3 text-rose-800">
                  <ShieldAlert size={20} className="shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider">Fail-Closed Fiduciário</h4>
                    <p className="text-[11px] font-medium leading-relaxed mt-1">{scenarioResult.validation.reason}</p>
                    <div className="mt-3 text-[9px] font-mono bg-rose-100 text-rose-700 px-2 py-1 rounded inline-block">
                      Lineage Hash: {scenarioResult.explainability?.lineageHash || 'ERR_NO_HASH'}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-100 px-3 py-1 rounded border border-emerald-200">
                      Simulação Válida
                    </span>
                    <div className="text-[10px] font-mono text-slate-400">
                      Lineage: {scenarioResult.explainability?.lineageHash}
                    </div>
                  </div>

                  <div className="text-sm font-medium text-slate-700 leading-relaxed bg-white/50 p-4 rounded-xl border border-blue-200/50">
                    {FiduciaryRuntimeAdapter.ScenarioNarrativeComposer.compose(scenarioResult)}
                  </div>

                  {scenarioResult.propagationProfile && (
                    <div className="space-y-4 mt-6">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cadeia de Propagação</h4>
                      
                      <div className="space-y-3">
                        {scenarioResult.propagationProfile.edges.map((edge, i) => (
                          <div key={i} className="flex items-center gap-4 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                            <div className="flex-1 flex items-center justify-between gap-4">
                              <span className="text-[10px] font-bold text-slate-600 w-24 text-right">{edge.source.metric}</span>
                              <div className="flex-1 h-px bg-slate-200 relative flex items-center justify-center">
                                <ArrowRight size={14} className="text-slate-400 bg-white px-0.5" />
                              </div>
                              <span className={cn(
                                "text-[10px] font-bold w-32",
                                edge.target.impactDirection === 'NEGATIVE' ? 'text-rose-600' : 'text-emerald-600'
                              )}>{edge.target.metric}</span>
                            </div>
                            <div className="w-1/3 text-[9px] text-slate-500 font-mono text-right">
                              {edge.mechanism}
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
