


import React, { useState, useEffect } from 'react';
import { Calculator, Loader2, TrendingUp, Zap, BarChart3, Calendar } from 'lucide-react';
import { PageHeader, StatusBadge } from '../Common';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../ui/executive-decision-trace';
import { useValuationViewModel } from '../../viewmodels/useValuationViewModel';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveAccordion } from '../ui/executive-accordion';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';
import { ExecutiveMetricCard } from '../ui/executive-metric-card';
import { cn, formatCurrency } from '../../lib/utils';
import { useFinancialData } from '../../hooks/useFinancialData';
import { useValuationPageViewModel } from '../../viewmodels/useValuationPageViewModel';

export function ValuationPage({ clients, selectedClient, selectedYear, selectedMonth }: any) {
  // Adapter: useValuationPageAdapter
  // ViewModel: useValuationPageViewModel
  const { state: vmState, computed: vmComputed, actions: vmActions } = useValuationPageViewModel({ clientId: selectedClient });
  const portal = createPortal;
  const [multiple, setMultiple] = useState(6.5);
  const [wacc, setWacc] = useState(12.5);
  const [growth, setGrowth] = useState(3.0);
  const [year, setYear] = useState(selectedYear || 2026);
  const [month, setMonth] = useState(selectedMonth || 3);

  useEffect(() => {
    if (selectedYear) setYear(selectedYear);
    if (selectedMonth) setMonth(selectedMonth);
  }, [selectedYear, selectedMonth]);

  const curYear = new Date().getFullYear();
  const yearsArray = Array.from({ length: 11 }, (_, i) => curYear - 5 + i);

  const { dbData, loading } = useFinancialData(selectedClient, year, month, 'DRE');
  
  const hasDbData = dbData.length > 0;
  
  const currentRevenue = hasDbData ? 
    (dbData.find((d: any) => d.category === 'Receita Líquida' || d.category === 'Receita Operacional Bruta')?.value || 0) : 0;
  
  let currentEbitda = hasDbData ? (dbData.find((d: any) => d.category === 'EBITDA')?.value || 0) : 0;
  if (hasDbData && currentEbitda === 0) {
    const ebit = dbData.find((d: any) => d.category === 'Lucro Operacional (EBIT)')?.value || 0;
    const da = Math.abs(dbData.find((d: any) => d.category === 'Depreciação e Amortização')?.value || 0);
    currentEbitda = ebit + da;
  }

  const anualizedEbitda = currentEbitda * 12;
  const anualizedRevenue = currentRevenue * 12;
  const valuationEbitda = anualizedEbitda * multiple;
  
  // FCF Proxy: EBITDA * (1 - TaxRate) - Capex/WC Proxy
  // Estimativa conservadora de 65% de conversão de EBITDA em Caixa Livre
  const freeCashFlow = anualizedEbitda * 0.65;
  
  // Gordon Growth Model Refined
  // r = WACC, g = Growth
  // TV = FCF * (1 + g) / (r - g)
  const r = wacc / 100;
  const g = growth / 100;
  
  // Guard against g >= r
  const effectiveSpread = Math.max(0.02, r - g); 
  const terminalValue = (freeCashFlow * (1 + g)) / effectiveSpread;
  
  // Enterprise Value = Terminal Value (Single Stage Perpetuity)
  const enterpriseValueDCF = terminalValue;

   return (
     <ExecutivePageTemplate header={{
       title: "Valuation Business",
       description: "Avaliação estratégica de valor de mercado utilizando múltiplos setoriais e fluxo de caixa descontado (DCF).",
     }}>

       {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE VALUATION) --- */}
       <ExecutiveSummarySection 
         className="mb-8"
         status={{ label: hasDbData ? 'Valuation Calculado' : 'Premissas Incompletas', variant: hasDbData ? 'success' : 'warning' }}
         question="Qual a estimativa de valor de mercado (Enterprise Value) por múltiplos e Fluxo de Caixa Descontado (DCF)?"
         opinion="O comitê fiduciário homologa a avaliação de valuation, atestando a razoabilidade do múltiplos de EBITDA e da taxa de desconto (WACC)."
         driver="EBITDA anualizado, múltiplos EV/EBITDA, taxa WACC e taxa de crescimento perpétuo."
         implication="Definição do piso de negociação para rodadas de investimento ou processos M&A."
         action="Acompanhar a sensibilidade do valuation em relação a variações de WACC e EBITDA."
       >
         <ExecutiveStrategicTensions tensions={[]} />
         <ExecutiveDecisionTrace trace={[]} />
       </ExecutiveSummarySection>

       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">

         <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border border-border shrink-0">
            <div className="flex items-center px-4 py-2 border-r border-border">
              <Calendar size={14} className="text-muted-foreground mr-2" />
              <select 
                value={year} 
                onChange={(e) => setYear(Number(e.target.value))}
                className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer text-muted-foreground"
              >
                {yearsArray.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center px-4 py-2">
              <select 
                value={month} 
                onChange={(e) => setMonth(Number(e.target.value))}
                className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer text-muted-foreground"
              >
                <option value={1}>Jan</option>
                <option value={2}>Fev</option>
                <option value={3}>Mar</option>
                <option value={4}>Abr</option>
                <option value={5}>Mai</option>
                <option value={6}>Jun</option>
                <option value={7}>Jul</option>
                <option value={8}>Ago</option>
                <option value={9}>Set</option>
                <option value={10}>Out</option>
                <option value={11}>Nov</option>
                <option value={12}>Dez</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 md:px-6 py-2 md:py-3 bg-white border border-border rounded-2xl shadow-sm flex items-center gap-3">
            {loading && <Loader2 size={14} className="animate-spin text-secondary" />}
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              {hasDbData ? 'Dados Reais' : 'Sem Dados'}
            </span>
           </div>
           <StatusBadge status={hasDbData ? 'Verde' : 'Amarelo'} label={hasDbData ? 'Dados Reais' : 'Sem Dados'} />
         </div>
       
      </div>

       <div className="mt-12 mb-8 border-t border-border pt-8" />
       <ExecutiveAccordion
         title="Valuation Business"
         subtitle="Múltiplos setoriais, DCF e análise de valor."
         variant="analytics"
         defaultExpanded
       >
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-border">
      <ExecutiveHeading as="h3" className="text-executive-secondary mb-6 flex items-center gap-2">
              <Calculator size={18} className="text-secondary" />
              Premissas de Avaliação
            </ExecutiveHeading>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Múltiplo de EBITDA</label>
                  <span className="text-[10px] font-black text-secondary">{multiple}x</span>
                </div>
                <input type="range" min="2" max="15" step="0.5" value={multiple} onChange={(e) => setMultiple(parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-secondary" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Taxa WACC (%)</label>
                  <span className="text-[10px] font-black text-secondary">{wacc}%</span>
                </div>
                <input type="range" min="5" max="25" step="0.5" value={wacc} onChange={(e) => setWacc(parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-secondary" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Crescimento Perpétuo (%)</label>
                  <span className="text-[10px] font-black text-secondary">{growth}%</span>
                </div>
                <input type="range" min="0" max="8" step="0.1" value={growth} onChange={(e) => setGrowth(parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-secondary" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-secondary/10 rounded-full blur-2xl group-hover:bg-secondary/20 transition-all"></div>
            <ExecutiveHeading as="h4" className="text-muted-foreground mb-2">Resumo Operacional (Anualizado)</ExecutiveHeading>
            <div className="space-y-4">
              <div>
                <ExecutiveText as="div" variant="bodyStandard" className="whitespace-nowrap">{formatCurrency(anualizedEbitda)}</ExecutiveText>
        <ExecutiveText as="div" variant="bodyStandard">EBITDA Estimado</ExecutiveText>
              </div>
              <div className="h-px bg-white/20" />
              <div className="flex justify-between items-end">
                <div>
                  <ExecutiveText as="div" variant="bodyStandard" className="whitespace-nowrap">{formatCurrency(anualizedRevenue)}</ExecutiveText>
         <ExecutiveText as="div" variant="bodyStandard">Receita Líquida Est.</ExecutiveText>
                </div>
                <div className="text-right">
                  <ExecutiveText as="div" variant="bodyStandard">{anualizedRevenue > 0 ? ((anualizedEbitda / anualizedRevenue) * 100).toFixed(2) : 0}%</ExecutiveText>
         <ExecutiveText as="div" variant="bodyStandard">Margem EBITDA</ExecutiveText>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-border text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-success-soft text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                <TrendingUp size={24} />
              </div>
              <ExecutiveHeading as="h4" className="text-muted-foreground mb-1">Múltiplo de EBITDA</ExecutiveHeading>
       <ExecutiveText as="div" variant="bodyStandard" className="text-executive-secondary mb-2 whitespace-nowrap">{formatCurrency(valuationEbitda)}</ExecutiveText>
              <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-lg">
                MÉTODO COMPARATIVO
              </div>
              <p className="mt-4 text-[11px] text-muted-foreground font-medium leading-relaxed">
                Valor baseado na aplicação do múltiplo de {multiple}x sobre o EBITDA anualizado.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-border text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mb-4">
                <Zap size={24} />
              </div>
              <ExecutiveHeading as="h4" className="text-muted-foreground mb-1">Valor Presente (DCF)</ExecutiveHeading>
       <ExecutiveText as="div" variant="bodyStandard" className="text-executive-secondary mb-2 whitespace-nowrap">{formatCurrency(enterpriseValueDCF)}</ExecutiveText>
              <div className="px-3 py-1 bg-secondary/20 text-secondary text-[10px] font-black rounded-lg">
                MÉTODO INTRÍNSECO
              </div>
              <p className="mt-4 text-[11px] text-muted-foreground font-medium leading-relaxed">
                Cálculo baseado no fluxo de caixa projetado com taxa de desconto de {wacc}% e perpetuidade de {growth}%.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-8 rounded-3xl border border-border">
            <ExecutiveHeading as="h4" className="text-muted-foreground mb-6">Detalhamento dos Cálculos</ExecutiveHeading>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-xs font-bold text-muted-foreground">Fluxo de Caixa Livre (Ano 1)</span>
                <span className="text-xs font-black text-muted-foreground whitespace-nowrap">{formatCurrency(freeCashFlow)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-xs font-bold text-muted-foreground">Valor na Perpetuidade</span>
                <span className="text-xs font-black text-muted-foreground whitespace-nowrap">{formatCurrency(terminalValue)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-xs font-bold text-muted-foreground">Taxa de Desconto (WACC)</span>
                <span className="text-xs font-black text-muted-foreground">{wacc/100}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
       <ExecutiveSummarySection 
         status={{ label: 'Valuation Calculado', variant: 'success' }}
         question="Qual a avaliação de valor de mercado e premissas aplicadas?"
         opinion="O comitê fiduciário homologa os cálculos de valuation com base nos múltiplos e no fluxo de caixa descontado."
         driver="Múltiplos setoriais, WACC e taxa de crescimento na perpetuidade."
         implication="Definição de preço de referência para captações de equity ou transações societárias."
         action="Atualizar as premissas macroeconômicas trimestralmente."
       >
         <ExecutiveStrategicTensions tensions={[]} />
         <ExecutiveDecisionTrace trace={[]} />
       </ExecutiveSummarySection>
      </ExecutiveAccordion>
    </ExecutivePageTemplate>
  );
}
