
import React, { useState, useEffect, useMemo } from 'react';
import { 
  WalletCards, 
  CalendarDays, 
  Calculator, 
  TrendingDown, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  FileSpreadsheet,
  Boxes,
  Sparkles,
  Zap,
  TrendingUp,
  Plus,
  Upload,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { PageHeader, ControlBar } from '../Common';
import { DATA } from '../../data';
import { cn, formatCurrency, getThemeColors } from '../../lib/utils';
import { useDataTable } from '../../hooks/useDataTable';
import { ContractModal } from '../modals/ContractModal';

// Helpers
const percent = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(date));
}

function addMonths(dateString: string, months: number) {
  const date = new Date(`${dateString}T00:00:00Z`);
  date.setUTCMonth(date.getUTCMonth() + months);
  return date.toISOString().slice(0, 10);
}

function pmt(rate: number, nper: number, pv: number) {
  if (rate === 0) return pv / nper;
  return (pv * rate) / (1 - Math.pow(1 + rate, -nper));
}

function buildPriceSchedule({ valorEmprestimo, periodoMeses, taxaMensal, parcelaMensal, dataPrimeiroVencimento }: any) {
  let saldo = valorEmprestimo;
  const parcela = parcelaMensal || pmt(taxaMensal, periodoMeses, valorEmprestimo);

  return Array.from({ length: periodoMeses }, (_, index) => {
    const periodo = index + 1;
    const juros = saldo * taxaMensal;
    const amortizacao = Math.min(parcela - juros, saldo);
    const saldoFinal = Math.max(saldo - amortizacao, 0);
    const linha = {
      periodo,
      vencimento: addMonths(dataPrimeiroVencimento, index),
      saldoInicial: saldo,
      parcela,
      juros,
      amortizacao,
      saldoFinal,
    };
    saldo = saldoFinal;
    return linha;
  });
}

function buildSacSchedule({ valorEmprestimo, periodoMeses, taxaMensal, dataPrimeiroVencimento }: any) {
  let saldo = valorEmprestimo;
  const amortizacaoConstante = valorEmprestimo / periodoMeses;

  return Array.from({ length: periodoMeses }, (_, index) => {
    const periodo = index + 1;
    const juros = saldo * taxaMensal;
    const parcela = amortizacaoConstante + juros;
    const saldoFinal = Math.max(saldo - amortizacaoConstante, 0);
    const linha = {
      periodo,
      vencimento: addMonths(dataPrimeiroVencimento, index),
      saldoInicial: saldo,
      parcela,
      juros,
      amortizacao: amortizacaoConstante,
      saldoFinal,
    };
    saldo = saldoFinal;
    return linha;
  });
}

function sumBy(schedule: any[], field: string) {
  return schedule.reduce((acc, row) => acc + row[field], 0);
}

export function LoansPage({ clients, selectedClient }: { clients: any[], selectedClient: string }) {
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'simulador' | 'amortizacao' | 'pagamentos'>('dashboard');
  const [showContractModal, setShowContractModal] = useState(false);

  const [, setThemeTrigger] = useState(0);
  useEffect(() => {
    const handleThemeChange = () => setThemeTrigger(prev => prev + 1);
    window.addEventListener('theme-changed', handleThemeChange);
    return () => window.removeEventListener('theme-changed', handleThemeChange);
  }, []);

  const colors = getThemeColors();
  
  const filteredLoans: any[] = [];
  
  // Set default loan if none selected
  useEffect(() => {
    if (filteredLoans.length > 0 && !selectedLoanId) {
      setSelectedLoanId(filteredLoans[0].id);
    }
  }, [filteredLoans, selectedLoanId]);

  const loanData = filteredLoans.find((l: any) => l.id === selectedLoanId) || filteredLoans[0];

  const [inputs, setInputs] = useState(loanData || {
    empresa: "",
    titulo: "Simulação de Empréstimo",
    motivo: "Investimento em Capital de Giro",
    valorEmprestimo: 500000,
    parcelaMensal: 0,
    periodoMeses: 12,
    taxaMensal: 0.015,
    dataPrimeiroVencimento: new Date().toISOString().slice(0, 10),
    pagosInicialmente: 0,
  });

  // Re-sync when loan selection changes
  useEffect(() => {
    if (loanData) {
      setInputs(loanData);
    }
  }, [loanData]);

  const [paymentStatus, setPaymentStatus] = useState<any[]>([]);

  useEffect(() => {
    if (inputs) {
      setPaymentStatus(
        Array.from({ length: inputs.periodoMeses }, (_, index) => ({
          periodo: index + 1,
          status: index < (inputs.pagosInicialmente || 0) ? "Débito Efetivado" : "A Vencer",
          dataDebito: index < (inputs.pagosInicialmente || 0) ? addMonths(inputs.dataPrimeiroVencimento, index) : "",
        }))
      );
    }
  }, [inputs]);

  const priceSchedule = useMemo(() => buildPriceSchedule(inputs), [inputs]);
  const sacSchedule = useMemo(() => buildSacSchedule(inputs), [inputs]);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedSchedule
  } = useDataTable(priceSchedule, {
    searchFields: [],
    initialSort: { key: 'periodo', direction: 'asc' },
    itemsPerPage: 12
  });

  const totalPrice = sumBy(priceSchedule, "parcela");
  const totalSac = sumBy(sacSchedule, "parcela");
  const jurosPrice = sumBy(priceSchedule, "juros");
  const jurosSac = sumBy(sacSchedule, "juros");
  const pagosCount = paymentStatus.filter((item) => item.status === "Débito Efetivado").length;
  const saldoAbertura = priceSchedule[pagosCount]?.saldoInicial ?? 0;

  const chartData = [
    { name: "PRICE", total: Math.round(totalPrice), juros: Math.round(jurosPrice) },
    { name: "SAC", total: Math.round(totalSac), juros: Math.round(jurosSac) },
  ];

  const saldoData = priceSchedule.map((row) => ({
    periodo: row.periodo,
    saldo: Math.round(row.saldoFinal),
  }));

  const updateInput = (field: string, value: any) => {
    setInputs((prev: any) => ({ ...prev, [field]: value }));
  };

  const updateStatus = (periodo: number, field: string, value: any) => {
    setPaymentStatus((prev) => prev.map((item) => (item.periodo === periodo ? { ...item, [field]: value } : item)));
  };

  if (!selectedClient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-8 animate-executive-fade text-center p-20 bg-white border border-slate-200 rounded-[32px] w-full">
         <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-secondary shadow-xl relative">
            <div className="absolute inset-0 bg-secondary blur-3xl opacity-20 animate-pulse" />
            <Boxes size={48} className="relative z-10 animate-pulse" />
         </div>
         <div className="text-center space-y-4 w-full max-w-2xl mx-auto">
            <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">Selecione uma Empresa</h2>
            <p className="text-slate-500 w-full max-w-2xl mx-auto font-medium leading-relaxed">
              Por favor, selecione uma empresa no seletor de cliente ativo no topo da tela para visualizar o painel de passivos.
            </p>
         </div>
      </div>
    );
  }

  if (!loanData && filteredLoans.length === 0) {
    return (
      <div className="space-y-12 pb-20">
        <PageHeader 
          title="Gestão de Passivos" 
          subtitle="Gestão de contratos de empréstimos e parcelamentos tributários."
        />
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white border border-slate-200 rounded-[32px] p-20 text-center">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <WalletCards size={48} className="text-slate-200" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Sem contratos registrados</h3>
          <p className="text-slate-500 max-w-2xl mx-auto mb-8 leading-relaxed">Nenhum contrato de financiamento foi cadastrado para o cliente {(clients || []).find((c: any) => c.id === selectedClient)?.fantasia || 'Selecionado'} até o momento.</p>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowContractModal(true)}
              className="px-4 md:px-6 py-2 md:py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <Plus size={16} /> Inserir Contrato
            </button>
            <button className="px-4 md:px-6 py-2 md:py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20">
              <Upload size={16} /> Importar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 animate-executive-fade">
      <PageHeader 
        title="Gestão de Passivos" 
        subtitle={`Gestão de contratos de empréstimos e parcelamentos tributários · ${inputs.empresa || (clients || []).find((c: any) => c.id === selectedClient)?.fantasia || 'Selecionado'}`}
        icon={<Boxes className="text-secondary" size={24} />}
        color="bg-slate-900"
      />

      {/* Control Bar */}
      <ControlBar 
        tabs={[
          { id: 'dashboard', label: 'DASHBOARD' },
          { id: 'simulador', label: 'SIMULADOR' },
          { id: 'amortizacao', label: 'AMORTIZAÇÃO' },
          { id: 'pagamentos', label: 'PAGAMENTOS' }
        ]}
        activeTab={activeTab}
        setActiveTab={(tab) => setActiveTab(tab)}
        actions={
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowContractModal(true)}
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-100 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Plus size={14} /> Inserir
            </button>
            <button className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 shadow-sm cursor-pointer">
              <Upload size={14} /> Importar
            </button>
            <button className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 shadow-sm cursor-pointer">
              <Trash2 size={14} /> Excluir
            </button>
          </div>
        }
      />


      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* CFO Executive Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
              <div className="lg:col-span-2 glass-card p-10 flex flex-col md:flex-row items-center gap-10">
                <div className="shrink-0">
                   <div className="w-20 h-20 rounded-[28px] bg-secondary/10 flex items-center justify-center text-secondary relative">
                      <Sparkles size={40} />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                      </div>
                   </div>
                </div>
                <div>
                  <h3 className="text-[11px] font-black text-secondary uppercase tracking-[0.3em] mb-3">Insight de Gestão de Passivos</h3>
                  <p className="executive-note">
                    "O cronograma de amortização atual apresenta uma concentração de desembolso nos próximos 6 meses. Recomendamos avaliar a migração de {percent.format(0.15)} do saldo devedor para linhas de crédito com carência estendida para preservar o capital de giro durante o ciclo de expansão previsto."
                  </p>
                </div>
              </div>
              
              <div className="bg-primary p-8 rounded-[32px] text-white flex flex-col justify-between relative overflow-hidden group shadow-xl">
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl group-hover:bg-secondary/30 transition-all"></div>
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Saldo Devedor Total</h3>
                  <p className="text-3xl font-display font-black mb-2">{formatCurrency(Math.floor(sumBy(priceSchedule, "saldoInicial") / priceSchedule.length))}</p>
                  <div className="flex items-center gap-2 text-emerald-400">
                     <TrendingUp size={16} />
                     <span className="text-xs font-bold">Amortização em Dia</span>
                  </div>
                </div>
                <button className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                  Conciliação Bancária
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Valor do Empréstimo', value: formatCurrency(Math.floor(inputs.valorEmprestimo)), icon: WalletCards, helper: 'Principal contratado' },
                { title: 'Parcela Mensal PRICE', value: formatCurrency(Math.floor(priceSchedule[0]?.parcela || 0)), icon: CalendarDays, helper: `${inputs.periodoMeses} meses` },
                { title: 'Taxa Mensal', value: percent.format(inputs.taxaMensal), icon: Calculator, helper: `A.A. equiv: ${percent.format(Math.pow(1 + inputs.taxaMensal, 12) - 1)}` },
                { title: 'Saldo Atual Projetado', value: formatCurrency(Math.floor(saldoAbertura)), icon: TrendingDown, helper: `${pagosCount} parcelas pagas` },
              ].map((kpi, idx) => (
                <div key={idx} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm transition-all hover:shadow-elegant group relative overflow-hidden">
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-slate-500 transition-colors">{kpi.title}</p>
                    <div className="p-3 bg-slate-50 rounded-[32px] text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                      {(() => {
                        const Icon = kpi.icon;
                        return <Icon size={20} />;
                      })()}
                    </div>
                  </div>
                  <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight relative z-10 whitespace-nowrap">{kpi.value}</h3>
                  <p className="text-[10px] font-bold text-slate-400 mt-4 flex items-center gap-2 relative z-10 opacity-80 italic">
                    <ArrowRight size={12} className="text-secondary" /> {kpi.helper}
                  </p>
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-slate-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"></div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-900">Comparativo PRICE x SAC</h3>
                  <p className="text-xs text-slate-500">Desembolso total vs Custo financeiro (Juros)</p>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.border} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: colors.mutedForeground, fontWeight: 600 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: colors.mutedForeground, fontWeight: 600 }} tickFormatter={(v) => `R$${Math.round(v / 1000)}k`} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: `1px solid ${colors.border}`, backgroundColor: colors.cardBg, color: colors.cardFg, boxShadow: 'var(--shadow-floating)', fontSize: '12px' }}
                        formatter={(value: number) => formatCurrency(value)}
                      />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }} />
                      <Bar dataKey="total" name="Total a Pagar" fill={colors.primary} radius={[4, 4, 0, 0]} barSize={40} />
                      <Bar dataKey="juros" name="Custo de Juros" fill={colors.secondary} radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-900">Evolução do Saldo Devedor</h3>
                  <p className="text-xs text-slate-500">Curva de amortização projetada ao longo do tempo</p>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={saldoData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={colors.primary} stopOpacity={0.1}/>
                          <stop offset="95%" stopColor={colors.primary} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.border} />
                      <XAxis dataKey="periodo" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: colors.mutedForeground, fontWeight: 600 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: colors.mutedForeground, fontWeight: 600 }} tickFormatter={(v) => `R$${Math.round(v / 1000)}k`} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: `1px solid ${colors.border}`, backgroundColor: colors.cardBg, color: colors.cardFg, boxShadow: 'var(--shadow-floating)', fontSize: '12px' }}
                        formatter={(value: number) => formatCurrency(value)}
                      />
                      <Area type="monotone" dataKey="saldo" name="Saldo Devedor" stroke={colors.primary} strokeWidth={3} fillOpacity={1} fill="url(#colorSaldo)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-8 rounded-[32px] border border-slate-800 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                <Calculator size={120} />
              </div>
              <h3 className="text-xl font-bold mb-6">Resumo Executivo</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/5 p-6 rounded-[32px] border border-white/5">
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total a Pagar (PRICE)</p>
                  <p className="text-2xl font-black">{formatCurrency(totalPrice)}</p>
                </div>
                <div className="bg-white/5 p-6 rounded-[32px] border border-white/5">
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total a Pagar (SAC)</p>
                  <p className="text-2xl font-black">{formatCurrency(totalSac)}</p>
                </div>
                <div className="bg-primary/20 p-6 rounded-[32px] border border-primary/30">
                  <p className="text-primary/70 text-[10px] font-bold uppercase tracking-widest mb-1">Diferença de Custo</p>
                  <p className="text-2xl font-black text-primary/90">{formatCurrency(Math.abs(jurosPrice - jurosSac))}</p>
                  <p className="text-[10px] text-primary/80 font-medium mt-2">
                    {jurosSac < jurosPrice ? "SAC é financeiramente mais vantajosa" : "Custo similar entre os modelos"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'simulador' && (
          <motion.div 
            key="simulador"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm"
          >
            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-900">Simulador de Cenários</h3>
              <p className="text-sm text-slate-500">Ajuste as premissas para recalcular o cronograma financeiro.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Valor do Empréstimo</label>
                <input 
                  type="number" 
                  value={inputs.valorEmprestimo} 
                  onChange={(e) => updateInput("valorEmprestimo", Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all font-bold text-slate-800"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Prazo (Meses)</label>
                <input 
                  type="number" 
                  value={inputs.periodoMeses} 
                  onChange={(e) => updateInput("periodoMeses", Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all font-bold text-slate-800"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Taxa de Juros Mensal</label>
                <input 
                  type="number" 
                  step="0.0001" 
                  value={inputs.taxaMensal} 
                  onChange={(e) => updateInput("taxaMensal", Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all font-bold text-slate-800"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Valor da Parcela (PRICE)</label>
                <input 
                  type="number" 
                  value={inputs.parcelaMensal} 
                  onChange={(e) => updateInput("parcelaMensal", Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all font-bold text-slate-800"
                />
              </div>
            </div>

            <div className="mt-10 flex gap-4">
              <button 
                onClick={() => setInputs(loanData || inputs)}
                className="px-4 md:px-6 py-2 md:py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >Restaurar Original</button>
              <button 
                onClick={() => updateInput("parcelaMensal", Number(pmt(inputs.taxaMensal, inputs.periodoMeses, inputs.valorEmprestimo).toFixed(2)))}
                className="px-4 md:px-6 py-2 md:py-2.5 bg-secondary hover:bg-secondary/90 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-secondary/20 transition-all"
              >Recalcular Parcela PRICE</button>
            </div>
          </motion.div>
        )}

        {activeTab === 'amortizacao' && (
          <motion.div 
            key="amortizacao"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">Cronograma de Amortização (PRICE)</h3>
              <p className="text-sm text-slate-500">Detalhe de Principal e Juros por período.</p>
            </div>
            <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
              <table className="w-full">
                <thead className="bg-slate-50 sticky top-0 z-10">
                  <tr>
                    {["Per", "Vencimento", "Saldo Inicial", "Parcela", "Juros", "Amortização", "Saldo Final"].map(h => (
                      <th key={h} className="px-4 md:px-6 py-2.5 md:py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedSchedule.map((row: any) => (
                    <tr key={row.periodo} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-4 md:px-6 py-2.5 md:py-4 text-sm font-bold text-slate-400">{row.periodo}</td>
                      <td className="px-4 md:px-6 py-2.5 md:py-4 text-sm font-semibold text-slate-600">{formatDate(row.vencimento)}</td>
                      <td className="px-4 md:px-6 py-2.5 md:py-4 text-sm font-medium text-slate-500">{formatCurrency(row.saldoInicial)}</td>
                      <td className="px-4 md:px-6 py-2.5 md:py-4 text-sm font-bold text-secondary">{formatCurrency(row.parcela)}</td>
                      <td className="px-4 md:px-6 py-2.5 md:py-4 text-sm font-medium text-rose-500">{formatCurrency(row.juros)}</td>
                      <td className="px-4 md:px-6 py-2.5 md:py-4 text-sm font-medium text-emerald-500">{formatCurrency(row.amortizacao)}</td>
                      <td className="px-4 md:px-6 py-2.5 md:py-4 text-sm font-black text-slate-900 group-hover:text-secondary transition-colors">{formatCurrency(row.saldoFinal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">
                Página {currentPage} de {totalPages || 1}
              </div>
              <div className="flex gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-all text-slate-600"
                >
                  <ChevronLeft size={18} />
                </button>
                <button 
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-all text-slate-600"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'pagamentos' && (
          <motion.div 
            key="pagamentos"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Controle de Fluxo de Pagamento</h3>
                <p className="text-sm text-slate-500">Gestão de liquidação de parcelas e conciliação.</p>
              </div>
              <div className="flex gap-4">
                <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <p className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest">Liquidado</p>
                  <p className="text-sm font-black text-emerald-700">{formatCurrency(priceSchedule.slice(0, pagosCount).reduce((acc, r) => acc + r.parcela, 0))}</p>
                </div>
                <div className="px-4 py-2 bg-primary/5 border border-primary/10 rounded-xl">
                  <p className="text-[8px] font-bold text-primary uppercase tracking-widest">A Vencer</p>
                  <p className="text-sm font-black text-primary">{inputs.periodoMeses - pagosCount} Parcelas</p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
              <table className="w-full">
                <thead className="bg-slate-50 sticky top-0 z-10">
                  <tr>
                    {["Per", "Data Vcto", "Valor Parcela", "Status do Débito", "Data de Pagamento"].map(h => (
                      <th key={h} className="px-4 md:px-6 py-2.5 md:py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedSchedule.map((row: any) => {
                    const payment = paymentStatus.find((item) => item.periodo === row.periodo) || { status: "A Vencer", dataDebito: "" };
                    return (
                      <tr key={row.periodo} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 md:px-6 py-2.5 md:py-4 text-sm font-bold text-slate-400">{row.periodo}</td>
                        <td className="px-4 md:px-6 py-2.5 md:py-4 text-sm font-semibold text-slate-600">{formatDate(row.vencimento)}</td>
                        <td className="px-4 md:px-6 py-2.5 md:py-4 text-sm font-bold text-slate-900">{formatCurrency(row.parcela)}</td>
                        <td className="px-4 md:px-6 py-2.5 md:py-4">
                          <select 
                            value={payment.status} 
                            onChange={(e) => updateStatus(row.periodo, "status", e.target.value)}
                            className={cn(
                              "text-xs font-bold px-3 py-1.5 rounded-lg outline-none border transition-all",
                              payment.status === "Débito Efetivado" ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                              payment.status === "Em Atraso" ? "bg-rose-100 text-rose-700 border-rose-200" :
                              "bg-slate-100 text-slate-600 border-slate-200"
                            )}
                          >
                            <option value="Débito Efetivado">Liquidado</option>
                            <option value="A Vencer">A Vencer</option>
                            <option value="Em Atraso">Em Atraso</option>
                          </select>
                        </td>
                        <td className="px-4 md:px-6 py-2.5 md:py-4">
                          <input 
                            type="date" 
                            value={payment.dataDebito} 
                            onChange={(e) => updateStatus(row.periodo, "dataDebito", e.target.value)}
                            className="bg-transparent text-xs font-semibold text-slate-600 outline-none hover:bg-slate-100 p-1 rounded transition-all"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">
                Página {currentPage} de {totalPages || 1}
              </div>
              <div className="flex gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-all text-slate-600"
                >
                  <ChevronLeft size={18} />
                </button>
                <button 
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-all text-slate-600"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 p-6 bg-slate-50 border border-slate-200 rounded-[32px] opacity-60">
        <FileSpreadsheet size={16} className="text-slate-400" />
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
           Análise gerada a partir de contratos bancários registrados · {inputs.titulo}
        </p>
      </div>

      {showContractModal && (
        <ContractModal
          clientId={selectedClient}
          onClose={() => setShowContractModal(false)}
          onSuccess={() => {
            setShowContractModal(false);
          }}
        />
      )}
    </div>
  );
}
