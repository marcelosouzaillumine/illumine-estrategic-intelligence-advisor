
import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  Percent, 
  Calculator,
  ArrowRightLeft,
  AlertCircle,
  BarChart2,
  Package,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { useModuleData } from '../../hooks/useModuleData';
import { useFinancialData } from '../../hooks/useFinancialData';
import { ProdutoServico } from '../../types/modules';
import { cn, formatCurrency, formatValue } from '../../lib/utils';
import { SectionHeader } from '../Common';

interface PrecificacaoPageProps {
  clientId: string;
}

export function PrecificacaoPage({ clientId }: PrecificacaoPageProps) {
  const { data: produtos, add, remove, loading } = useModuleData<ProdutoServico>('precificacao', clientId);
  const { dbData: dreGerencial } = useFinancialData(clientId, 2026, 3, 'DRE Gerencial');
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    precoVenda: 0,
    custoMP: 0,
    comissao: 0,
    impostos: 0,
    frete: 0,
    outros: 0
  });

  const [simulador, setSimulador] = useState({
    variacaoPreco: 0,
    variacaoVolume: 0
  });

  const custosFixosTotais = useMemo(() => {
    // Assuming 'Custos Fixos' or similar in DRE Gerencial
    return dreGerencial
      .filter(e => e.conta.toLowerCase().includes('custo fixo') || e.conta.toLowerCase().includes('despesa fixa'))
      .reduce((acc, curr) => acc + curr.valor, 0);
  }, [dreGerencial]);

  const stats = useMemo(() => {
    const list = produtos.map(p => {
      const totalCustosVar = p.custosVariaveis.materiaPrima + p.custosVariaveis.comissao + p.custosVariaveis.impostos + p.custosVariaveis.frete + p.custosVariaveis.outros;
      const margemUnit = p.precoVenda - totalCustosVar;
      const margemPct = p.precoVenda > 0 ? (margemUnit / p.precoVenda) * 100 : 0;
      
      const pontoEquilibrioUnd = margemUnit > 0 ? custosFixosTotais / margemUnit : 0;
      const pontoEquilibrioFin = p.precoVenda * pontoEquilibrioUnd;

      return { ...p, totalCustosVar, margemUnit, margemPct, pontoEquilibrioUnd, pontoEquilibrioFin };
    });

    return list.sort((a, b) => b.margemPct - a.margemPct);
  }, [produtos, custosFixosTotais]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalCustosVar = formData.custoMP + formData.comissao + formData.impostos + formData.frete + formData.outros;
    const margemUnit = formData.precoVenda - totalCustosVar;
    const margemPct = formData.precoVenda > 0 ? (margemUnit / formData.precoVenda) * 100 : 0;

    await add({
      nome: formData.nome,
      precoVenda: formData.precoVenda,
      custosVariaveis: {
        materiaPrima: formData.custoMP,
        comissao: formData.comissao,
        impostos: formData.impostos,
        frete: formData.frete,
        outros: formData.outros
      },
      margemContribuicaoUnit: margemUnit,
      margemContribuicaoPct: margemPct
    });

    setShowAddForm(false);
    setFormData({ nome: '', precoVenda: 0, custoMP: 0, comissao: 0, impostos: 0, frete: 0, outros: 0 });
  };

  const simuladorResult = useMemo(() => {
    if (stats.length === 0) return null;
    const topProduto = stats[0];
    const originalMargemTotal = topProduto.margemUnit * 1000; // Assume 1000 units base
    
    const novoPreco = topProduto.precoVenda * (1 + (simulador.variacaoPreco / 100));
    const novoVolume = 1000 * (1 + (simulador.variacaoVolume / 100));
    const novaMargemUnit = novoPreco - topProduto.totalCustosVar;
    const novaMargemTotal = novaMargemUnit * novoVolume;
    
    return {
      original: originalMargemTotal,
      novo: novaMargemTotal,
      impacto: ((novaMargemTotal / originalMargemTotal) - 1) * 100
    };
  }, [stats, simulador]);

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="space-y-8 pb-32">
      <div className="flex justify-between items-center bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-50 blur-3xl rounded-full -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Precificação & Margens</h2>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-[0.2em] flex items-center gap-2">
            <Calculator size={14} className="text-emerald-500" /> Engenharia de Preços e Ponto de Equilíbrio
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="relative z-10 flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-3xl font-black uppercase tracking-widest text-[10px] hover:shadow-xl hover:shadow-emerald-600/20 transition-all font-display"
        >
          {showAddForm ? 'Cancelar' : <><Plus size={16} /> Adicionar Produto/Serviço</>}
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-[40px] border border-slate-100 shadow-2xl p-10 overflow-hidden"
          >
            <form onSubmit={handleAdd} className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Nome do Produto ou Serviço</label>
                      <input 
                        required
                        value={formData.nome}
                        onChange={e => setFormData({...formData, nome: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-700"
                        placeholder="Ex: Consultoria Premium Mensal"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Preço de Venda Praticado (R$)</label>
                          <input 
                            required
                            type="number"
                            value={formData.precoVenda}
                            onChange={e => setFormData({...formData, precoVenda: parseFloat(e.target.value)})}
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-black text-emerald-600"
                          />
                       </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 space-y-4">
                    <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-4">Custos Variáveis Unitários</h4>
                    {[
                      { label: 'Matéria-Prima / Insumo', field: 'custoMP' },
                      { label: 'Comissão de Venda', field: 'comissao' },
                      { label: 'Impostos Diretos', field: 'impostos' },
                      { label: 'Logística / Frete', field: 'frete' },
                      { label: 'Outros Variáveis', field: 'outros' },
                    ].map(c => (
                      <div key={c.field} className="space-y-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase block">{c.label}</label>
                        <input 
                          type="number"
                          value={(formData as any)[c.field]}
                          onChange={e => setFormData({...formData, [c.field]: parseFloat(e.target.value)})}
                          className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-500/50"
                        />
                      </div>
                    ))}
                  </div>
               </div>

               <div className="flex justify-end pt-4">
                 <button type="submit" className="px-12 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-xl transition-all">
                   Salvar Configuração de Preço
                 </button>
               </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         <div className="xl:col-span-2 space-y-6">
            <SectionHeader title="Análise de Margens por Produto" subtitle="Ranking de rentabilidade unitária" icon={BarChart2} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {stats.map((item, idx) => (
                 <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group"
                 >
                    <div className="absolute top-0 right-0 p-6 flex flex-col gap-2">
                       <span className={cn(
                         "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter",
                         item.margemPct >= 40 ? "bg-emerald-50 text-emerald-600" : 
                         item.margemPct >= 20 ? "bg-blue-50 text-blue-600" : 
                         item.margemPct > 0 ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                       )}>
                         {item.margemPct.toFixed(1)}% Margem
                       </span>
                    </div>

                    <div className="space-y-6 pt-4">
                       <div className="space-y-1">
                          <h4 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                             <Package size={20} className="text-emerald-500" /> {item.nome}
                          </h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preço: {formatCurrency(item.precoVenda)}</p>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                             <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">M.C. Unitária</span>
                             <span className="text-lg font-black text-primary">{formatCurrency(item.margemUnit)}</span>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                             <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">P.E. Unitário</span>
                             <span className="text-lg font-black text-slate-700">{item.pontoEquilibrioUnd.toFixed(0)} Und</span>
                          </div>
                       </div>

                       <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                          <div className="text-[10px] font-bold text-slate-400 uppercase">P.E. Financeiro p/ Empresa:</div>
                          <div className="text-sm font-black text-emerald-600">{formatCurrency(item.pontoEquilibrioFin)}</div>
                       </div>
                       
                       <button onClick={() => remove(item.id!)} className="absolute bottom-6 right-6 p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 size={16} />
                       </button>
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>

         <div className="space-y-8">
            <SectionHeader title="Simulador de Impacto" subtitle="Efeito de preço e volume na margem" icon={ArrowRightLeft} />
            
            <div className="bg-slate-900 rounded-[50px] p-10 text-white space-y-10 relative overflow-hidden shadow-2xl">
               <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-500/10 blur-3xl rounded-full"></div>
               
               <div className="relative z-10 space-y-8">
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                         <span className="text-emerald-400">Variação de Preço</span>
                         <span className={cn(simulador.variacaoPreco >= 0 ? "text-emerald-400" : "text-rose-400")}>
                           {simulador.variacaoPreco > 0 ? '+' : ''}{simulador.variacaoPreco}%
                         </span>
                      </div>
                      <input 
                        type="range" min="-30" max="30" step="1"
                        value={simulador.variacaoPreco}
                        onChange={e => setSimulador({...simulador, variacaoPreco: parseInt(e.target.value)})}
                        className="w-full h-2 bg-white/10 rounded-full appearance-none accent-emerald-500 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                         <span className="text-blue-400">Variação de Volume</span>
                         <span className={cn(simulador.variacaoVolume >= 0 ? "text-blue-400" : "text-rose-400")}>
                           {simulador.variacaoVolume > 0 ? '+' : ''}{simulador.variacaoVolume}%
                         </span>
                      </div>
                      <input 
                        type="range" min="-50" max="50" step="1"
                        value={simulador.variacaoVolume}
                        onChange={e => setSimulador({...simulador, variacaoVolume: parseInt(e.target.value)})}
                        className="w-full h-2 bg-white/10 rounded-full appearance-none accent-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {simuladorResult && (
                    <div className="p-8 bg-white/5 rounded-[40px] border border-white/10 space-y-6">
                       <div className="text-center space-y-1">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Impacto Estimado na Margem Total</span>
                          <div className={cn(
                             "text-4xl font-black font-display",
                             simuladorResult.impacto >= 0 ? "text-emerald-400" : "text-rose-400"
                          )}>
                             {simuladorResult.impacto > 0 ? '+' : ''}{simuladorResult.impacto.toFixed(1)}%
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                             <div className="text-[8px] font-bold text-slate-500 uppercase mb-1">Margem Atual (1k Und)</div>
                             <div className="text-xs font-black">{formatCurrency(simuladorResult.original)}</div>
                          </div>
                          <div className="text-center border-l border-white/10">
                             <div className="text-[8px] font-bold text-slate-500 uppercase mb-1">Nova Margem (1k Und)</div>
                             <div className="text-xs font-black text-emerald-400">{formatCurrency(simuladorResult.novo)}</div>
                          </div>
                       </div>
                    </div>
                  )}
               </div>
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-4">
               <div className="flex items-center gap-2 text-primary">
                  <AlertCircle size={18} />
                  <h4 className="text-xs font-black uppercase tracking-widest font-display">Insights de Precificação</h4>
               </div>
               <div className="space-y-3">
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-[10px] font-medium text-emerald-800 leading-relaxed">
                     <span className="font-black uppercase block mb-1">Custo Fixo Coberto</span>
                     A empresa precisa de {formatCurrency(custosFixosTotais)} por mês para operar. O mix de produtos deve gerar essa margem bruta.
                  </div>
                  {stats.some(p => p.margemPct < 25) && (
                    <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 text-[10px] font-medium text-rose-800 leading-relaxed">
                       <span className="font-black uppercase block mb-1">Alerta de Margem Baixa</span>
                       Detectamos produtos com margem inferior a 25%. Verifique o preço de mercado ou otimize custos variáveis.
                    </div>
                  )}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
