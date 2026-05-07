
import React, { useState, useMemo } from 'react';
import { 
  LayoutGrid, 
  Activity, 
  FileText, 
  Coins, 
  BookOpen, 
  Settings2, 
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, AreaChart, Area } from 'recharts';
import { PageHeader } from '../Common';
import { cn, formatCurrency } from '../../lib/utils';
import { DATA } from '../../data';

function KpiCardModeling({ label, value, tone = 'default', helper }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <h3 className={cn(
        "text-2xl font-black tracking-tight",
        tone === 'danger' ? "text-rose-600" : tone === 'success' ? "text-emerald-600" : "text-slate-900"
      )}>{value}</h3>
      {helper && <p className="text-[10px] text-slate-400 mt-2 italic">{helper}</p>}
    </div>
  );
}

function FinancialModelTable({ table, title, subtitle }: { table: any, title: string, subtitle?: string }) {
  const headers = table.headers.map((h: any, i: number) => `Ano ${h || i + 1}`);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
      <div className="p-8 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900">{title}</h2>
          {subtitle && <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">{subtitle}</p>}
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
            <tr className="bg-slate-50/50 sticky top-0 z-20">
              <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 sticky left-0 top-0 bg-slate-50 shadow-[2px_0_5px_rgba(0,0,0,0.05)] z-30">Indicador</th>
              {headers.map((h: any) => (
                <th key={h} className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 whitespace-nowrap bg-slate-50">
                  <div className="flex flex-col items-end">
                    <span>{h}</span>
                    <span className="hidden md:inline text-[8px] opacity-40 font-bold">Projeção</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {table.rows.map((row: any) => (
              <tr key={row.item} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-4 text-xs font-bold text-slate-600 sticky left-0 bg-white group-hover:bg-slate-50 shadow-[2px_0_5px_rgba(0,0,0,0.05)] z-10">{row.item}</td>
                {row.values.map((v: any, i: number) => {
                  const isNumeric = typeof v === 'number' && Number.isFinite(v);
                  const isInvalid = !isNumeric;

                  return (
                    <td key={i} className={cn(
                      "px-8 py-4 text-xs font-black text-right transition-all",
                      isNumeric && v < 0 ? "text-rose-500" : "text-slate-900",
                      isInvalid ? "bg-rose-50/50" : ""
                    )}>
                      <div className="flex items-center justify-end gap-1.5">
                        {isInvalid && (
                          <AlertTriangle size={12} className="text-rose-400 shrink-0" />
                        )}
                        <span>
                          {isNumeric ? formatCurrency(v) : (v ?? "-")}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InputsModelView() {
  return (
    <div className="space-y-8">
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100">
          <h2 className="text-lg font-black text-slate-900">Configuração de Projeção (Estrutural)</h2>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">Parâmetros base para o horizonte de 5 Anos.</p>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Econômico</span>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-600">IPCA (Inflação Meta)</span>
                <span className="font-black text-blue-600">3.85% a.a.</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-600">Taxa Selic Target</span>
                <span className="font-black text-blue-600">14.65% a.a.</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-600">PIB Projetado 2026</span>
                <span className="font-black text-blue-600">2.1%</span>
              </div>
            </div>
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Operacional Cliente</span>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-600">Growth Target (Market)</span>
                <span className="font-black text-emerald-600">12.00%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-600">Escalabilidade Custos</span>
                <span className="font-black text-emerald-600">45% da Receita</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-600">Depreciação Média</span>
                <span className="font-black text-emerald-600">10.00% a.a.</span>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="text-blue-600" size={20} />
              <h4 className="text-xs font-black text-slate-800 uppercase italic">Conformidade Fiscal</h4>
            </div>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
              O modelo utiliza as regras de apuração do Lucro Real e Presumido conforme o regime tributário vinculado ao cadastro do cliente para cálculo de IR/CSLL.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100">
          <h2 className="text-lg font-black text-slate-900">Dicionário de Variáveis de Projeção</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Indicador</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Descrição Técnica</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 italic">Impacto no Modelo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { i: "FCFF", d: "Free Cash Flow to the Firm", m: "Capacidade líquida de pagamento de dívida e dividendos." },
                { i: "EBITDA Margin", d: "Margem operacional antes de impostos e despesas financeiras", m: "Principal métrica de eficiência core da operação." },
                { i: "NCG Variation", d: "Necessidade de Capital de Giro", m: "Consumo de caixa gerado pelo prazo médio de recebimento e estoques." },
                { i: "Capex Plan", d: "Capital Expenditure", m: "Investimentos em ativos fixos necessários para suportar o crescimento." }
              ].map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-4 text-xs font-black text-slate-800">{item.i}</td>
                  <td className="px-8 py-4 text-xs font-medium text-slate-500">{item.d}</td>
                  <td className="px-8 py-4 text-xs font-bold text-blue-600 italic">{item.m}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function FinancialModelingPage({ clients, selectedClient, setSelectedClient }: { clients: any[], selectedClient: string, setSelectedClient: (id: string) => void }) {
  const [tab, setTab] = useState("dashboard");
  
  // Base Data Selection
  const activeClient = useMemo(() => 
    clients.find(c => c.id === selectedClient) || clients[0]
  , [clients, selectedClient]);

  // Projection Engine (5 Years)
  const projection = useMemo(() => {
    const years = [2026, 2027, 2028, 2029, 2030];
    const growthRate = 0.12; 
    const ipca = 0.045; 
    
    // Attempt to extract base from actual data
    const clientDre = DATA.dre.filter(d => d.id === selectedClient);
    const lastYearRevenue = clientDre.filter(d => d.ano === 2025).reduce((acc, curr) => acc + (curr.conta === 'Receita Líquida' ? curr.valor : 0), 0) * 12 / 3; // Estimate annual if partial
    
    // Fallbacks if data is missing
    let baseRevenue = lastYearRevenue > 0 ? lastYearRevenue : 12000000;
    let baseAssets = 5000000;
    let baseDebt = 2000000;

    // Derived Projections
    const dreGerencialRows: any[] = [
      { item: "Receita Bruta", values: [] },
      { item: "Custos Variáveis", values: [] },
      { item: "Margem de Contribuição", values: [] },
      { item: "Despesas Fixas", values: [] },
      { item: "EBITDA Gerencial", values: [] },
    ];

    const dreContabilRows: any[] = [
      { item: "Receita Líquida", values: [] },
      { item: "Lucro Bruto", values: [] },
      { item: "EBIT", values: [] },
      { item: "Impostos (IRPJ/CSLL)", values: [] },
      { item: "Lucro Líquido", values: [] },
    ];

    const fluxoCaixaRows: any[] = [
      { item: "EBITDA", values: [] },
      { item: "(-) Capex", values: [] },
      { item: "(-) Variação NCG", values: [] },
      { item: "(+) Amortização", values: [] },
      { item: "Fluxo de Caixa Livre (FCFF)", values: [] },
    ];

    const balancoRows: any[] = [
      { item: "Ativo Circulante", values: [] },
      { item: "Ativo Não Circulante", values: [] },
      { item: "Patrimônio Líquido", values: [] },
      { item: "Passivo Oneroso", values: [] },
    ];

    years.forEach((year, i) => {
      const yearGrowth = growthRate * Math.pow(1 + ipca, i);
      const revenue = baseRevenue * Math.pow(1 + yearGrowth, i);
      const variableCosts = revenue * 0.45;
      const fixedCosts = 1800000 * Math.pow(1 + ipca, i);
      const ebitda = revenue - variableCosts - fixedCosts;
      const depr = baseAssets * 0.1;
      const ebit = ebitda - depr;
      
      // Tax Logic (Accounting DRE)
      const isLucroReal = activeClient?.regime === 'Lucro Real';
      const taxRate = isLucroReal ? 0.34 : 0.15; // Simplified
      const taxes = ebit > 0 ? ebit * taxRate : 0;
      const lucroLiquido = ebit - taxes;

      // Cash Flow Path
      const capex = year === 2026 ? 500000 : 200000 * Math.pow(1 + ipca, i);
      const deltaNcg = revenue * 0.05;
      const fcff = ebitda - capex - deltaNcg + depr;

      // Balance Sheet Path
      const currentAssets = (revenue / 12) * 2; // ~60 days sales
      const netAssets = baseAssets - (depr * (i + 1)) + capex;
      const currentPL = (revenue * 0.3) + lucroLiquido; // Simulation

      // Filling Rows
      dreGerencialRows[0].values.push(revenue);
      dreGerencialRows[1].values.push(-variableCosts);
      dreGerencialRows[2].values.push(revenue - variableCosts);
      dreGerencialRows[3].values.push(-fixedCosts);
      dreGerencialRows[4].values.push(ebitda);

      dreContabilRows[0].values.push(revenue * 0.85); // Net of sales taxes
      dreContabilRows[1].values.push((revenue * 0.85) - variableCosts);
      dreContabilRows[2].values.push(ebit);
      dreContabilRows[3].values.push(-taxes);
      dreContabilRows[4].values.push(lucroLiquido);

      fluxoCaixaRows[0].values.push(ebitda);
      fluxoCaixaRows[1].values.push(-capex);
      fluxoCaixaRows[2].values.push(-deltaNcg);
      fluxoCaixaRows[3].values.push(depr);
      fluxoCaixaRows[4].values.push(fcff);

      balancoRows[0].values.push(currentAssets);
      balancoRows[1].values.push(netAssets);
      balancoRows[2].values.push(currentPL);
      balancoRows[3].values.push(baseDebt * (1 - (i/10))); // Paying off debt
    });

    return { 
      years, 
      dreGerencial: { headers: years, rows: dreGerencialRows }, 
      dreContabil: { headers: years, rows: dreContabilRows },
      fluxoCaixa: { headers: years, rows: fluxoCaixaRows },
      balanco: { headers: years, rows: balancoRows }
    };
  }, [activeClient, selectedClient]);

  const tabs = [
    { id: 'dashboard', label: 'Monitor Board', icon: LayoutGrid },
    { id: 'dreGerencial', label: 'DRE Gerencial', icon: Activity },
    { id: 'dreContabil', label: 'DRE Contábil', icon: FileText },
    { id: 'caixa', label: 'Geração de Caixa', icon: Coins },
    { id: 'balanco', label: 'Balanço Projetado', icon: BookOpen },
    { id: 'inputs', label: 'Inputs Ref.', icon: Settings2 },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-6 border-b border-slate-200">
        <PageHeader 
          title="Modelagem Financeira" 
          description={`Horizonte: 5 Anos (2026-2030) · Cliente: ${activeClient?.fantasia || activeClient?.name}`}
        />
        <div className="flex bg-slate-100 p-1 rounded-xl w-fit overflow-x-auto max-w-full">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all whitespace-nowrap",
                tab === t.id 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              )}
            >
              <t.icon size={13} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {tab === 'dashboard' && (
             <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <KpiCardModeling label="EBITDA Ano 5" value={formatCurrency(projection.fluxoCaixa.rows[0].values[4])} helper="Geração operacional final" tone="success" />
                  <KpiCardModeling label="Geração de Caixa (Acum.)" value={formatCurrency(projection.fluxoCaixa.rows[4].values.reduce((a: any, b: any) => a + b, 0))} helper="FCF Total Projected" tone="success" />
                  <KpiCardModeling label="Tax Efficiency" value={activeClient?.regime} helper={`Baseado em ${activeClient?.regime}`} />
                  <KpiCardModeling label="Proj. Debt Score" value="0.4x" helper="EBITDA / Dívida Ano 5" tone="success" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white p-8 rounded-3xl border border-slate-200">
                    <h3 className="text-sm font-bold text-slate-900 mb-2">Escalabilidade de Receita</h3>
                    <p className="text-[11px] text-slate-400 font-bold mb-8 uppercase tracking-widest">PROJEÇÃO ANUAL (5 ANOS)</p>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={projection.dreGerencial.rows[0].values.map((v: any, i: number) => ({ year: projection.years[i], value: v }))}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                          <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }} tickFormatter={(v) => `R$${(v/1000000).toFixed(1)}M`} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            formatter={(v: any) => [formatCurrency(v), 'Receita Bruta']}
                          />
                          <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-3xl border border-slate-200">
                    <h3 className="text-sm font-bold text-slate-900 mb-2">Fluxo de Caixa Livre (FCFF)</h3>
                    <p className="text-[11px] text-slate-400 font-bold mb-8 uppercase tracking-widest">CAPACIDADE DE DISTRIBUIÇÃO</p>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={projection.fluxoCaixa.rows[4].values.map((v: any, i: number) => ({ year: projection.years[i], fcff: v }))}>
                          <defs>
                            <linearGradient id="colorFcff" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                          <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            formatter={(v: any) => [formatCurrency(v), 'FCFF']}
                          />
                          <Area type="monotone" dataKey="fcff" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorFcff)" dot={{ r: 4, fill: '#8b5cf6' }} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
             </div>
          )}

          {tab === 'dreGerencial' && <FinancialModelTable table={projection.dreGerencial} title="DRE Gerencial" subtitle="Foco em performance operacional e EBITDA (5 Anos)." />}
          {tab === 'dreContabil' && <FinancialModelTable table={projection.dreContabil} title="DRE Contábil / Fiscal" subtitle="Foco em apuração fiscal, IRPJ/CSLL e Lucro Líquido Final." />}
          {tab === 'caixa' && <FinancialModelTable table={projection.fluxoCaixa} title="Geração de Caixa Livre (FCFF)" subtitle="Caminho do EBITDA para o Caixa disponível após impostos, capex e NCG." />}
          {tab === 'balanco' && <FinancialModelTable table={projection.balanco} title="Balanço Patrimonial Projetado" subtitle="Evolução de ativos, capital de giro e endividamento." />}
          {tab === 'inputs' && <InputsModelView />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
