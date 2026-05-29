// src/components/pages/StrategicWarRoomPage.tsx
import React, { useState, useEffect } from 'react';
import { Layers3, AlertTriangle, Scale, ShieldAlert, History } from 'lucide-react';
import { PageHeader } from '../Common';
import { InstitutionalScenarioResult } from '../../core/runtime/scenario-intelligence/scenario-types';
import { ScenarioTradeoffProfile } from '../../core/runtime/board-decision/board-decision-types';
import { ScenarioTradeoffEngine } from '../../core/runtime/scenario-intelligence/ScenarioTradeoffEngine';
import { DecisionApprovalPanel } from '../board-decision/DecisionApprovalPanel';
import { BoardResolutionService } from '../../services/boardResolutionService';
import { BoardResolution } from '../../core/runtime/board-decision/board-decision-types';
import { InstitutionalScenarioPanel } from '../scenario-intelligence/InstitutionalScenarioPanel'; // Adjust path if needed

interface Props {
  selectedClient: string;
  contextData: any; // Raw Data to be fed to scenario simulations
}

export function StrategicWarRoomPage({ selectedClient, contextData }: Props) {
  // Array of scenarios simulated during this session
  const [sessionScenarios, setSessionScenarios] = useState<InstitutionalScenarioResult[]>([]);
  const [tradeoffProfile, setTradeoffProfile] = useState<ScenarioTradeoffProfile | null>(null);
  
  const [resolutionsHistory, setResolutionsHistory] = useState<BoardResolution[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      if (!selectedClient) return;
      setLoadingHistory(true);
      const history = await BoardResolutionService.getClientResolutions(selectedClient);
      setResolutionsHistory(history);
      setLoadingHistory(false);
    }
    fetchHistory();
  }, [selectedClient]);

  // Hook to simulate a scenario and add it to the board for comparison
  const handleScenarioSimulated = (result: InstitutionalScenarioResult) => {
    if (result.validation.status === 'VALID') {
      const updated = [...sessionScenarios, result];
      setSessionScenarios(updated);
      
      // Auto-compute tradeoffs if we have at least 2 valid scenarios
      if (updated.length >= 2) {
        try {
          const profile = ScenarioTradeoffEngine.compare(updated.slice(-2)); // compare last two
          setTradeoffProfile(profile);
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  const handleApprovalSuccess = () => {
    alert("Resolução fiduciária registrada com sucesso!");
    // Refresh history
    BoardResolutionService.getClientResolutions(selectedClient).then(setResolutionsHistory);
  };

  return (
    <div className="max-w-[1440px] mx-auto space-y-10 pb-32 animate-executive-fade">
      <PageHeader 
        title="Strategic War Room" 
        subtitle="Comparação matemática de trade-offs e deliberação fiduciária do conselho."
        icon={Scale}
        color="executive"
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column: Simulation and Comparison */}
        <div className="xl:col-span-8 space-y-8">
          
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-6 flex items-center gap-2">
              <Layers3 size={18} className="text-violet-500" />
              Simulação de Cenários (War Gaming)
            </h3>
            
            {/* Minimal wrapper to pass the simulated scenario up */}
            {/* For a real app, InstitutionalScenarioPanel would need an onSimulate callback */}
            <div className="relative border border-dashed border-violet-200 rounded-2xl p-4 bg-violet-50/30">
              <p className="text-xs text-slate-500 mb-4 font-medium">Configure e rode a simulação abaixo. Cenários válidos serão adicionados à mesa de deliberação automaticamente.</p>
              
              {/* Note: Assuming InstitutionalScenarioPanel was updated to accept onSimulated */}
              {/* <InstitutionalScenarioPanel contextData={contextData} onSimulated={handleScenarioSimulated} /> */}
              <div className="bg-amber-50 text-amber-800 p-4 rounded-xl text-xs font-bold border border-amber-200 flex gap-2">
                 <AlertTriangle size={16} />
                 <span>[SIMULADOR INTEGRADO AQUI] A interface do RC-1.6 está ativa na aba anterior. (Adapter mock para o fluxo)</span>
              </div>
              <button 
                onClick={() => handleScenarioSimulated({
                  id: `SCENARIO_${Date.now()}`,
                  inputs: [],
                  validation: { status: 'VALID' },
                  propagationProfile: { nodes: [], edges: [], structuralIntegrityScore: 80, systemicSeverity: 'MODERADA' },
                  explainability: { lineageHash: 'H_MOCK_A', baselineHash: 'H_BASE', simulationHash: 'H_SIM', constraintTriggers: [], propagationRationale: [] }
                })}
                className="mt-4 text-xs font-bold bg-violet-100 text-violet-700 px-4 py-2 rounded-lg hover:bg-violet-200 transition-colors"
              >
                + Inject Mock Scenario A
              </button>
              <button 
                onClick={() => handleScenarioSimulated({
                  id: `SCENARIO_${Date.now()+100}`,
                  inputs: [],
                  validation: { status: 'VALID' },
                  propagationProfile: { nodes: [{dimension: 'DFC', metric: 'Caixa Operacional', impactDirection: 'NEGATIVE', impactMagnitude: 10, severity: 'ALTA'}], edges: [], structuralIntegrityScore: 60, systemicSeverity: 'ALTA' },
                  explainability: { lineageHash: 'H_MOCK_B', baselineHash: 'H_BASE', simulationHash: 'H_SIM2', constraintTriggers: [], propagationRationale: [] }
                })}
                className="mt-4 ml-2 text-xs font-bold bg-rose-100 text-rose-700 px-4 py-2 rounded-lg hover:bg-rose-200 transition-colors"
              >
                + Inject Mock Scenario B
              </button>
            </div>
          </div>

          {/* Tradeoff Engine Output */}
          {tradeoffProfile && (
            <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl text-slate-100 animate-in slide-in-from-bottom-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-emerald-400 mb-6 flex items-center gap-2">
                <Scale size={18} />
                Trade-off Comparativo Estrutural
              </h3>

              <div className="space-y-6">
                {tradeoffProfile.criticalTensions.length > 0 && (
                  <div className="bg-rose-950/40 border border-rose-900 p-4 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase">
                      <ShieldAlert size={14} /> Tensões Críticas Identificadas
                    </div>
                    <ul className="space-y-1">
                      {tradeoffProfile.criticalTensions.map((tension, i) => (
                        <li key={i} className="text-[11px] text-rose-300">• {tension}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid gap-3">
                  {tradeoffProfile.edges.map((edge, i) => (
                    <div key={i} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{edge.dimension}</span>
                        {edge.winnerId && (
                          <span className="text-[9px] font-mono bg-emerald-900/50 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
                            Winner: {edge.winnerId}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">{edge.tradeoffRationale}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Resolution Panel & History */}
        <div className="xl:col-span-4 space-y-8">
          
          {sessionScenarios.length > 0 ? (
             <DecisionApprovalPanel 
               selectedScenario={sessionScenarios[sessionScenarios.length - 1]} // Select latest to approve for now
               tenantId="TENANT_XYZ"
               clientId={selectedClient}
               onApprovalSuccess={handleApprovalSuccess}
             />
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center text-slate-400 space-y-4">
               <ShieldAlert size={32} className="mx-auto opacity-50" />
               <p className="text-xs font-medium">Execute simulações estruturais válidas para habilitar a deliberação do conselho.</p>
            </div>
          )}

          {/* Institutional Memory (History) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-800 mb-4 flex items-center gap-2">
              <History size={14} /> Memória de Decisão Institucional
            </h3>
            
            {loadingHistory ? (
              <p className="text-xs text-slate-400">Carregando lineage...</p>
            ) : resolutionsHistory.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Nenhuma resolução fiduciária registrada para este tenant.</p>
            ) : (
              <div className="space-y-4">
                {resolutionsHistory.map((res) => (
                  <div key={res.id} className="border-l-2 border-emerald-500 pl-3 py-1 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-700">{res.id}</span>
                      <span className="text-[9px] text-slate-400">{new Date(res.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{res.rationale}</p>
                    <div className="text-[9px] font-mono text-slate-400 bg-slate-50 inline-block px-1 rounded">
                      Hash: {res.resolutionHash.substring(0,12)}...
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
