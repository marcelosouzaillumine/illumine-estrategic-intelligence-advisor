
import React, { useState, useMemo, useEffect } from 'react';
import { Zap, TrendingUp, Activity, DollarSign, Target, BarChart3, ArrowRight, Percent, RefreshCw, Info, ChevronRight, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { PageHeader } from '../Common';
import { cn, formatCurrency } from '../../lib/utils';
import { useFinancialData } from '../../hooks/useFinancialData';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface StrategicSimulatorPageProps {
  clientId: string;
  selectedYear: number;
  selectedMonth: number;
}

export function StrategicSimulatorPage({ clientId, selectedYear, selectedMonth }: StrategicSimulatorPageProps) {
  // Real Data State
  const [dbIndicators, setDbIndicators] = useState<any[]>([]);
  const { dbData } = useFinancialData(clientId, selectedYear, selectedMonth, 'DRE');

  // Simulation Sliders
  const [growthSim, setGrowthSim] = useState(0); // % increase in revenue
  const [churnSim, setChurnSim] = useState(0); // % reduction in churn
  const [marginSim, setMarginSim] = useState(0); // % increase in net margin
  const [efficiencySim, setEfficiencySim] = useState(0); // % reduction in OpEx

  useEffect(() => {
    if (!clientId) return;
    const q = query(
      collection(db, 'indicators'),
      where('clientId', '==', clientId),
      where('ano', '==', selectedYear),
      where('mes', '==', selectedMonth)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDbIndicators(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [clientId, selectedYear, selectedMonth]);

  const getIndicatorValue = (name: string, fallback: number = 0) => {
    const ind = dbIndicators.find(i => i.ind === name || i.ind?.toLowerCase() === name.toLowerCase());
    return ind ? ind.val : fallback;
  };

  const currentRevenue = useMemo(() => {
    return (dbData.find((d: any) => d.category === 'Receita Líquida' || d.category === 'Receita Operacional Bruta')?.value || 0) * 12;
  }, [dbData]);

  const currentEbitda = useMemo(() => {
    let ebitda = dbData.find((d: any) => d.category === 'EBITDA')?.value || 0;
    if (ebitda === 0) {
      const ebit = dbData.find((d: any) => d.category === 'Lucro Operacional (EBIT)')?.value || 0;
      const da = Math.abs(dbData.find((d: any) => d.category === 'Depreciação e Amortização')?.value || 0);
      ebitda = ebit + da;
    }
    return ebitda * 12;
  }, [dbData]);

  const currentChurn = getIndicatorValue('Churn Rate', 5); // Fallback 5%
  
  // Results Calculation
  const simulation = useMemo(() => {
    const revenueImpact = currentRevenue * (1 + (growthSim / 100));
    const churnImpact = (currentChurn - churnSim) / (currentChurn || 1); // reduction ratio
    
    // Revenue adjusted by churn reduction (simplified: reducing churn helps growth)
    const finalRevenue = revenueImpact * (1 + (churnSim * 0.5 / 100));
    
    const baseMargin = currentRevenue > 0 ? (currentEbitda / currentRevenue) : 0.15;
    const finalMargin = baseMargin + (marginSim / 100);
    
    const simulatedEbitda = finalRevenue * finalMargin;
    
    // Valuation Impact (DCF Simplified)
    const multiple = 7.5; // Constant for simulation
    const currentValuation = currentEbitda * multiple;
    const simulatedValuation = simulatedEbitda * multiple;
    const valuationDelta = simulatedValuation - currentValuation;

    return {
      currentRevenue,
      simulatedRevenue: finalRevenue,
      currentEbitda,
      simulatedEbitda,
      currentValuation,
      simulatedValuation,
      valuationDelta,
      impactPercent: currentValuation > 0 ? (valuationDelta / currentValuation) * 100 : 0
    };
  }, [currentRevenue, currentEbitda, growthSim, churnSim, marginSim, currentChurn]);

  const resetSim = () => {
    setGrowthSim(0);
    setChurnSim(0);
    setMarginSim(0);
    setEfficiencySim(0);
  };

  return (
    <div className="space-y-12 pb-32 animate-executive-fade">
      <PageHeader 
        title="Simulador de Impacto Estratégico" 
        subtitle="Analise como mudanças em indicadores críticos impactam o Valuation e o Fluxo de Caixa."
        icon={Zap}
        color="bg-slate-900"
      />

      <div className="flex items-center justify-between gap-4 flex-wrap bg-white/60 p-4 rounded-3xl border border-border backdrop-blur-sm shadow-sm -mt-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border border-border shrink-0">
            <button 
              onClick={resetSim}
              className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all text-muted-foreground hover:text-muted-foreground hover:bg-white flex items-center gap-2"
            >
              <RefreshCw size={14} />
              Resetar Simulação
            </button>
          </div>
        </div>
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sliders Area */}
        <div className="lg:col-span-4 space-y-10">
          <div className="bg-white p-10 rounded-[40px] border border-border shadow-sm space-y-12">
      <h3 className="text-sm font-black text-executive-secondary uppercase tracking-widest flex items-center gap-3">
               <Activity size={20} className="text-primary" /> Alavancas de Valor
            </h3>

            <div className="space-y-10">
              {/* Growth Slider */}
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Crescimento de Receita</label>
                  <span className="text-lg font-black text-primary">+{growthSim}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" step="1" 
                  value={growthSim} onChange={(e) => setGrowthSim(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Churn Reduction Slider */}
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Redução de Churn</label>
                  <span className="text-lg font-black text-emerald-500">-{churnSim}%</span>
                </div>
                <input 
                  type="range" min="0" max={currentChurn} step="0.5" 
                  value={churnSim} onChange={(e) => setChurnSim(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Margin Improvement Slider */}
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Melhoria de Margem EBITDA</label>
                  <span className="text-lg font-black text-secondary">+{marginSim}%</span>
                </div>
                <input 
                  type="range" min="0" max="20" step="0.5" 
                  value={marginSim} onChange={(e) => setMarginSim(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-secondary"
                />
              </div>
            </div>

            <div className="pt-8 border-t border-border flex items-center gap-4 text-muted-foreground">
               <Info size={16} />
               <p className="text-[10px] font-medium leading-relaxed italic">Arraste os seletores para simular cenários otimistas e ver o impacto financeiro.</p>
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Impact Card: Valuation */}
            <div className="bg-slate-900 p-12 rounded-[48px] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform duration-700">
                <DollarSign size={160} />
              </div>
              <div className="relative z-10 space-y-8">
                <div>
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-4">Geração de Valor (Enterprise Value)</p>
                  <h2 className="text-5xl font-display font-black tracking-tight">{formatCurrency(simulation.simulatedValuation)}</h2>
                </div>
                <div className="flex items-center gap-6">
                   <div className="bg-success-soft0/20 px-4 md:px-6 py-1.5 md:py-2 rounded-2xl border border-emerald-500/30">
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Delta de Valor</p>
                      <p className="text-lg font-black text-emerald-400 flex items-center gap-2">
                        <TrendingUp size={18} /> +{formatCurrency(simulation.valuationDelta)}
                      </p>
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Impacto %</p>
                      <p className="text-lg font-black text-white">{simulation.impactPercent.toFixed(2)}%</p>
                   </div>
                </div>
              </div>
            </div>

            {/* Impact Card: EBITDA */}
            <div className="bg-white p-12 rounded-[48px] border border-border shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform duration-700">
                <Activity size={160} />
              </div>
              <div className="relative z-10 space-y-8">
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-4">EBITDA Anual Projetado</p>
         <h2 className="text-5xl font-display font-black text-executive-secondary tracking-tight">{formatCurrency(simulation.simulatedEbitda)}</h2>
                </div>
                <div className="flex items-center gap-6">
                   <div className="bg-slate-50 px-4 md:px-6 py-1.5 md:py-2 rounded-2xl border border-border">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Margem Projetada</p>
           <p className="text-lg font-black text-executive-secondary">
                        {((simulation.simulatedEbitda / (simulation.simulatedRevenue || 1)) * 100).toFixed(2)}%
                      </p>
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Receita Anual</p>
           <p className="text-lg font-black text-executive-secondary">{formatCurrency(simulation.simulatedRevenue)}</p>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Board */}
          <div className="bg-white p-12 rounded-[56px] border border-border shadow-sm relative overflow-hidden">
             <div className="flex justify-between items-center mb-12">
               <div>
                 <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-2">Análise Comparativa</h3>
         <h2 className="text-2xl font-display font-black text-executive-secondary tracking-tight">Cenário Atual vs. Projetado</h2>
               </div>
               <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-muted-foreground">
                 <BarChart3 size={28} />
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                  { label: 'Receita Líquida (Anual)', current: simulation.currentRevenue, sim: simulation.simulatedRevenue, color: 'primary' },
                  { label: 'EBITDA (Anual)', current: simulation.currentEbitda, sim: simulation.simulatedEbitda, color: 'secondary' },
                  { label: 'Valuation (DCF)', current: simulation.currentValuation, sim: simulation.simulatedValuation, color: 'emerald-500' },
                ].map((item, i) => (
                  <div key={i} className="space-y-6 group">
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{item.label}</p>
                     
                     <div className="space-y-2">
            <p className="text-[9px] font-bold text-executive-secondary uppercase">Atual</p>
            <p className="text-sm font-black text-executive-secondary">{formatCurrency(item.current)}</p>
                     </div>

                     <div className="space-y-2">
            <p className="text-[9px] font-bold text-executive-secondary uppercase flex items-center gap-2">
                          Projetado <ChevronRight size={10} className="text-emerald-500" />
                        </p>
                        <p className={cn("text-xl font-black transition-all group-hover:scale-105 origin-left", `text-${item.color}`)}>
                          {formatCurrency(item.sim)}
                        </p>
                     </div>

                     <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-border">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.current / (item.sim || 1)) * 100}%` }}
                          className="h-full bg-slate-200"
                        />
                     </div>
                  </div>
                ))}
             </div>

             <div className="mt-16 p-10 bg-success-soft rounded-[40px] border border-emerald-100 flex flex-col md:flex-row items-center gap-8">
                <div className="w-16 h-16 rounded-2xl bg-success-soft0 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                   <ShieldCheck size={32} />
                </div>
                <div className="flex-1 text-center md:text-left">
                   <h4 className="text-lg font-black text-emerald-900 mb-1">Potencial Máximo de Governança</h4>
                   <p className="text-sm text-emerald-700/70 font-medium">Ao aplicar os fundamentos de Eficiência e Crescimento, a empresa pode gerar um prêmio de valor de <span className="font-black text-emerald-600">{formatCurrency(simulation.valuationDelta)}</span> no mercado de M&A.</p>
                </div>
                <button className="px-4 md:px-6 md:px-10 py-2 md:py-3 md:py-5 bg-emerald-600 text-white rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-600/20 hover:bg-success-soft0 transition-all">
                  SALVAR CENÁRIO
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
