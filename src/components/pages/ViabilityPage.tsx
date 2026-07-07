
import React, { useState, useEffect } from 'react';
import { Plus, X, Activity, ShieldCheck, TrendingUp, TrendingDown, Settings2, Rocket } from 'lucide-react';
import { motion } from 'motion/react';
import { BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell, ComposedChart } from 'recharts';
import { PageHeader, StatusBadge } from '../Common';
import { formatCurrency, calculateVPL, calculateTIR, calculatePayback, cn } from '../../lib/utils';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export function ViabilityScenario({ project }: { project: any }) {
  const [discountRate, setDiscountRate] = useState(2.0); // 2% a.m. default
  const [cfMultiplier, setCfMultiplier] = useState(100); // 100% default
  const [capexAdjustment, setCapexAdjustment] = useState(100); // 100% default
  
  const originalFlows = project.fluxo.map((f: any) => f.valor);
  const simulatedFlows = originalFlows.map((v: number, i: number) => {
    if (i === 0) return v * (capexAdjustment / 100); 
    return v * (cfMultiplier / 100);
  });
  
  const simulatedVPL = calculateVPL(simulatedFlows, discountRate / 100);
  const simulatedTIR = calculateTIR(simulatedFlows);
  const simulatedPayback = calculatePayback(simulatedFlows);
  const investment = Math.abs(simulatedFlows[0]);
  const simulatedIL = investment !== 0 ? (simulatedVPL + investment) / investment : 0;

  const chartData = simulatedFlows.map((v: number, i: number) => ({
    name: i === 0 ? 'Inv.' : `M${i}`,
    valor: v,
  }));

  const paybackIndex = simulatedPayback ? Math.floor(simulatedPayback) : null;
  const paybackLabel = paybackIndex !== null ? (paybackIndex === 0 ? 'Inv.' : `M${paybackIndex}`) : null;

  return (
    <div className="mt-8 bg-slate-900 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden border border-white/5">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <TrendingUp size={120} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
            <Settings2 size={20} />
          </div>
          <div>
            <h3 className="text-xl font-display tracking-tight">Análise de Cenários</h3>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-[0.2em]">Simulação Dinâmica de Viabilidade</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 mb-12">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Taxa de Desconto (TMA) - Mensal</label>
                <span className="text-sm font-black text-secondary">{discountRate}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="15" 
                step="0.1" 
                value={discountRate} 
                onChange={(e) => setDiscountRate(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-secondary"
              />
              <div className="flex justify-between text-[8px] text-muted-foreground font-bold uppercase">
                <span>Conservador (0%)</span>
                <span>Agressivo (15%)</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Ajuste de Investimento (CAPEX)</label>
                <span className="text-sm font-black text-rose-400">{capexAdjustment}%</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="200" 
                step="5" 
                value={capexAdjustment} 
                onChange={(e) => setCapexAdjustment(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex justify-between text-[8px] text-muted-foreground font-bold uppercase">
                <span>Economia (-50%)</span>
                <span>Estouro (+100%)</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Ajuste de Fluxo de Caixa (Receitas)</label>
                <span className="text-sm font-black text-emerald-400">{cfMultiplier}%</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="200" 
                step="5" 
                value={cfMultiplier} 
                onChange={(e) => setCfMultiplier(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[8px] text-muted-foreground font-bold uppercase">
                <span>Cenário Pessimista (-50%)</span>
                <span>Cenário Otimista (+100%)</span>
              </div>
            </div>
            
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                * Os cálculos acima aplicam os ajustes linearmente sobre o investimento inicial e as entradas projetadas.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'VPL Simulado', val: formatCurrency(simulatedVPL) },
              { label: 'TIR Simulada', val: (simulatedTIR * 100).toFixed(2) + '%' },
              { label: 'Payback Sim.', val: simulatedPayback ? simulatedPayback.toFixed(1) + ' meses' : 'N/A' },
              { label: 'Índ. Lucratividade', val: simulatedIL.toFixed(2) + 'x' },
            ].map((res, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-center">
                <span className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{res.label}</span>
                <span className="text-lg font-black tracking-tight">{res.val}</span>
              </div>
            ))}

            <div className={cn(
              "col-span-2 mt-2 p-5 rounded-xl border",
              simulatedVPL >= 0 
                ? "bg-blue-600/20 border-blue-500/30 text-blue-100" 
                : "bg-rose-600/20 border-rose-500/30 text-rose-100"
            )}>
              <p className="text-xs font-medium flex items-center gap-2">
                {simulatedVPL >= 0 ? <Activity size={14} /> : <TrendingDown size={14} />}
                {simulatedVPL >= 0 
                  ? "Cenário Viável: O projeto mantém retorno positivo." 
                  : "Cenário Crítico: Inviabilidade financeira detectada."}
              </p>
            </div>
          </div>
        </div>

        {/* Visualização do Fluxo de Caixa */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-sm font-bold text-white">Fluxo de Caixa Mensal Projetado</h4>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-1">Estimativa de entradas e saídas por período</p>
            </div>
            {simulatedPayback && (
              <div className="px-3 py-1 bg-warning-soft0/10 border border-amber-500/20 rounded-lg">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-tight">Payback Point: {simulatedPayback.toFixed(1)}m</span>
              </div>
            )}
          </div>

          <div className="h-[280px] w-full bg-slate-800/40 rounded-2xl p-6 border border-white/5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: 'var(--color-executive-primary)', fontWeight: 600 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: 'var(--color-executive-primary)', fontWeight: 600 }}
                  tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface-container)', border: '1px solid var(--color-executive-primary)', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: 'var(--color-executive-primary)' }}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  formatter={(value: number) => [formatCurrency(value), 'Fluxo Mensal']}
                />
                <Bar 
                  dataKey="valor" 
                  radius={[4, 4, 0, 0]}
                  fill="currentColor"
                >
                  {chartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.valor < 0 ? 'var(--color-executive-primary)' : 'var(--color-executive-primary)'} />
                  ))}
                </Bar>
                {paybackLabel && (
                  <ReferenceLine 
                    x={paybackLabel} 
                    stroke="currentColor" 
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    label={{ 
                      value: 'PAYBACK', 
                      position: 'top', 
                      fill: 'var(--color-executive-primary)', 
                      fontSize: 10, 
                      fontWeight: 900,
                      letterSpacing: '0.1em'
                    }} 
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ViabilityPage({ selectedClient, clients }: { selectedClient: string, clients: any[] }) {
  const [projects, setProjects] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newProj, setNewProj] = useState({
    cl: selectedClient || (clients[0]?.id || ''),
    nome: '',
    unidadeNegocio: '',
    filial: '',
    conclusao: 'Em Análise'
  });

  useEffect(() => {
    if (!selectedClient) {
      setProjects([]);
      return;
    }
    const q = query(collection(db, 'viability_projects'), where('cl', '==', selectedClient));
    getDocs(q).then(snap => {
      if (!snap.empty) {
        const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(docs);
      } else {
        setProjects([]);
      }
    });
  }, [selectedClient]);

  const filteredProjects = projects;

  const handleAddProject = () => {
    if (!newProj.nome) return;
    
    const project = {
      cl: newProj.cl,
      proj: `P${projects.length + 1}`.padStart(4, '0'),
      nome: newProj.nome,
      unidadeNegocio: newProj.unidadeNegocio,
      filial: newProj.filial,
      vpl: 'R$ 0,00',
      tir: '0.00%',
      payback: '0 meses',
      il: '0.00',
      conclusao: 'Em Análise',
      fluxo: [
        { mes: 0, valor: -100000, acumulado: -100000 },
        { mes: 12, valor: 20000, acumulado: -80000 },
        { mes: 24, valor: 40000, acumulado: -40000 },
        { mes: 36, valor: 60000, acumulado: 20000 },
      ]
    };

    setProjects([project, ...projects]);
    setShowModal(false);
    setNewProj({
      cl: selectedClient,
      nome: '',
      unidadeNegocio: '',
      filial: '',
      conclusao: 'Em Análise'
    });
  };

  const header = (
    <PageHeader 
      title="Projetos de Inovação" 
      subtitle={`Monitoramento estratégico de investimentos, inovação e retorno de capital · ${clients.find(c => c.id === selectedClient)?.fantasia || 'Cliente'}`}
      icon={<Rocket size={20} />}
    />
  );

  const toolbar = (
    <div className="flex items-center justify-between gap-4 flex-wrap bg-white/60 p-4 rounded-3xl border border-border backdrop-blur-sm shadow-sm -mt-6 mb-10">
      <div className="flex items-center gap-3">
        <div className="px-4 md:px-6 py-2 md:py-3 bg-white border border-border rounded-2xl shadow-sm flex items-center gap-3">
          <Activity size={14} className="text-secondary" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            {projects.length} Projetos Ativos
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={() => setShowModal(true)}
          className="px-5 md:px-8 py-2 md:py-3 bg-secondary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-secondary/90 transition-all shadow-xl shadow-secondary/20 flex items-center gap-2"
        >
          <Plus size={16} /> ADICIONAR PROJETO
        </button>
      </div>
    </div>
  );

  if (filteredProjects.length === 0 && !showModal) {
    return (
      <div className="space-y-10 pb-20 animate-executive-fade">
        {header}
        {toolbar}
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white border border-border rounded-[40px] p-8 sm:p-12 md:p-20 text-center shadow-sm w-full mx-auto">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <Activity size={48} className="text-muted-foreground" />
          </div>
     <h3 className="text-xl font-black text-executive-secondary mb-2">Sem projetos vinculados</h3>
     <p className="text-executive-secondary max-w-md mx-auto mb-8 font-medium">Nenhum projeto de inovação foi cadastrado para este cliente até o momento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 animate-executive-fade">
      {header}
      {toolbar}


      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden"
          >
            <div className="p-8 border-b border-border flex items-center justify-between">
              <div>
        <h3 className="text-xl font-black text-executive-secondary">Lançar Projeto de Inovação</h3>
                <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Configuração inicial de CAPEX e unidade.</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-50 rounded-full text-muted-foreground"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2 block">Cliente Responsável</label>
                  <select 
                    value={newProj.cl}
                    onChange={(e) => setNewProj({ ...newProj, cl: e.target.value })}
                    className="w-full h-12 bg-slate-50 border border-border rounded-xl px-4 text-xs font-bold text-muted-foreground outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.fantasia || c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2 block">Nome do Projeto</label>
                  <input 
                    type="text"
                    placeholder="Ex: Expansão Ala Sul 2026"
                    value={newProj.nome}
                    onChange={(e) => setNewProj({ ...newProj, nome: e.target.value })}
                    className="w-full h-12 bg-slate-50 border border-border rounded-xl px-4 text-xs font-bold text-muted-foreground outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2 block">Unidade de Negócio</label>
                  <input 
                    type="text"
                    placeholder="Ex: Medicina Diagnóstica"
                    value={newProj.unidadeNegocio}
                    onChange={(e) => setNewProj({ ...newProj, unidadeNegocio: e.target.value })}
                    className="w-full h-12 bg-slate-50 border border-border rounded-xl px-4 text-xs font-bold text-muted-foreground outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2 block">Filial</label>
                  <input 
                    type="text"
                    placeholder="Ex: Matriz - SP"
                    value={newProj.filial}
                    onChange={(e) => setNewProj({ ...newProj, filial: e.target.value })}
                    className="w-full h-12 bg-slate-50 border border-border rounded-xl px-4 text-xs font-bold text-muted-foreground outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <ShieldCheck className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-blue-800 uppercase tracking-widest">Atenção Técnica</h4>
                  <p className="text-xs text-blue-600 font-medium leading-relaxed">
                    Ao criar o projeto, o sistema gera automaticamente uma estrutura de fluxo de caixa padronizada. Use os simuladores de cenário na página seguinte para ajustar CAPEX e NCG.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-border flex justify-end gap-4">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 md:px-6 py-2 md:py-3 text-xs font-bold text-muted-foreground hover:text-muted-foreground"
              >
                CANCELAR
              </button>
              <button 
                onClick={handleAddProject}
                className="px-5 md:px-8 py-2 md:py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg active:scale-95"
              >
                CRIAR PROJETO
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-12">
        {filteredProjects.map((v: any, i: number) => (
          <div key={i} className="bg-white p-8 rounded-xl border border-border shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 flex flex-col items-end gap-2 text-right">
              <StatusBadge status={v.conclusao} />
              {v.unidadeNegocio && (
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{v.unidadeNegocio} · {v.filial}</span>
              )}
            </div>
            
            <div className="mb-10">
               <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{v.cl} · Projeto {v.proj}</h2>
        <h4 className="text-3xl font-bold tracking-tight italic text-executive-secondary">{v.nome}</h4>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {label: 'VPL Original', val: v.vpl},
                    {label: 'TIR mensal', val: v.tir},
                    {label: 'Payback', val: v.payback},
                    {label: 'Índ. Lucratividade', val: v.il + 'x'},
                  ].map(row => (
                    <div key={row.label} className="bg-slate-50 p-4 rounded-lg border border-border flex flex-col justify-center min-h-[80px]">
                      <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{row.label}</span>
                      <span className={cn(
                        "font-bold text-muted-foreground",
                        row.val.length > 15 ? "text-sm" : "text-lg"
                      )}>{row.val}</span>
                    </div>
                  ))}
                </div>
                
                <div className="p-5 bg-blue-50/50 rounded-xl border border-blue-100">
                  <h5 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2">Conclusão do Consultor</h5>
                  <p className="text-sm text-blue-900 leading-relaxed">
                    Com base no VPL positivo e TIR acima do custo de capital, o projeto demonstra viabilidade técnica e financeira. 
                    O payback de {v.payback} está dentro do horizonte estratégico do negócio.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="mb-4 flex items-center justify-between">
                  <div>
          <h5 className="text-sm font-bold text-executive-secondary uppercase tracking-wide">Fluxo de Caixa Projetado</h5>
                    <p className="text-[10px] text-muted-foreground font-medium">Monthly vs Cumulative Cash Flow (Payback Point Highlighted)</p>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 bg-blue-100 rounded-sm border border-blue-200" />
                      <span className="text-muted-foreground">Mensal</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-0.5 bg-blue-600 rounded-full" />
                      <span className="text-muted-foreground">Acumulado</span>
                    </div>
                  </div>
                </div>
                
                <div className="h-[300px] w-full bg-slate-50/30 rounded-xl p-4 border border-border">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={v.fluxo}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" />
                      <XAxis 
                        dataKey="mes" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: 'var(--color-executive-primary)', fontWeight: 600 }}
                        label={{ value: 'Meses', position: 'insideBottom', offset: -5, fontSize: 10, fill: 'var(--color-executive-primary)', fontWeight: 700 }}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: 'var(--color-executive-primary)', fontWeight: 600 }} 
                        tickFormatter={(v) => `R$${v / 1000}k`} 
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: '1px solid var(--color-executive-primary)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                        formatter={(value: number) => formatCurrency(value)}
                        labelFormatter={(label) => `Mês ${label}`}
                      />
                      <ReferenceLine y={0} stroke="currentColor" strokeWidth={1} strokeDasharray="3 3" />
                      <Bar 
                        dataKey="valor" 
                        fill="currentColor" 
                        radius={[4, 4, 0, 0]} 
                        barSize={20} 
                        name="Fluxo Mensal"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="acumulado" 
                        stroke="currentColor" 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: 'var(--color-executive-primary)', strokeWidth: 2, stroke: 'var(--color-executive-primary)' }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                        name="Fluxo Acumulado"
                      />
                      {/* Highlight Payback point */}
                      <ReferenceLine 
                        x={v.paybackMesNum} 
                        stroke="currentColor" 
                        strokeDasharray="4 4" 
                        strokeWidth={2}
                        label={{ 
                          value: 'Payback', 
                          position: 'top', 
                          fill: 'var(--color-executive-primary)', 
                          fontSize: 10, 
                          fontWeight: 700
                        }} 
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">CAPEX Estimado</span>
                    <span className="text-xs font-bold text-rose-500">
                      {formatCurrency(Math.abs(v.fluxo[0].valor) * 0.85)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Capital de Giro (NCG)</span>
                    <span className="text-xs font-bold text-amber-500">
                      {formatCurrency(Math.abs(v.fluxo[0].valor) * 0.15)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Inv. Inicial Total</span>
                    <span className="text-xs font-black text-rose-600">
                      {formatCurrency(Math.abs(v.fluxo[0].valor))}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Saldo Final (12m)</span>
                    <span className="text-xs font-black text-emerald-600">
                      {formatCurrency(v.fluxo[v.fluxo.length - 1].acumulado)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Scenario Analysis Tool */}
            <ViabilityScenario project={v} />
          </div>
        ))}
      </div>
    </div>
  );
}
