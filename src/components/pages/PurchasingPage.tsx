
import React, { useState, useEffect, useMemo } from 'react';
import { TrendingDown, Search, ChevronLeft, ChevronRight, Users, ShoppingBag, TrendingUp } from 'lucide-react';
import { usePurchasingAdapter } from '../../adapters/ui/usePurchasingAdapter';
import { PageHeader } from '../Common';
import { SortableHeader } from '../SortableHeader';
import { DATA } from '../../data';
import { cn, formatCurrency } from '../../lib/utils';
import { useDataTable } from '../../hooks/useDataTable';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function KpiCardModeling({ label, value, tone = 'default', helper }: any) {
  return (
    <div className="bg-card p-6 rounded-md border border-border shadow-sm hover:shadow-md transition-all group relative flex flex-col justify-between min-h-[140px]">
      <div>
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3 group-hover:text-foreground transition-colors whitespace-nowrap overflow-hidden text-ellipsis">{label}</p>
        <h3 className={cn(
          "text-2xl font-bold tracking-tight leading-[1.2] whitespace-nowrap text-foreground",
          tone === 'danger' ? "text-destructive" : tone === 'success' ? "text-success" : ""
        )}>{value}</h3>
      </div>
   {helper && <p className="text-[10px] text-muted-foreground mt-4 font-medium italic leading-relaxed">{helper}</p>}
    </div>
  );
}


export function PurchasingPage({ clients, selectedClient }: { clients: any[], selectedClient: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    sort,
    toggleSort,
    currentPage,
    setCurrentPage,
    totalPages,
    filteredData: filteredItems,
    paginatedData: paginatedItems
  } = useDataTable(items, {
    searchFields: ['produto', 'centroCusto'],
    initialSort: { key: 'produto', direction: 'asc' as const },
    itemsPerPage: 10
  });

  const { purchases, loading: loadingPurchases } = usePurchasingAdapter(selectedClient);

  useEffect(() => {
    setLoading(loadingPurchases);
    if (!loadingPurchases && purchases) {
      setItems(purchases);
    }
  }, [loadingPurchases, purchases]);

  const stats = useMemo(() => {
    let totalRealizedSpend = 0;
    let totalSavingsGenerated = 0;
    let totalMarketBenchmark = 0;
    let totalTargetSpend = 0;

    items.forEach(item => {
      const selected = item.fornecedores?.find((f: any) => f.selecionado);
      const prices = item.fornecedores?.map((f: any) => f.valorUnit) || [];
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
      const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
      
      const currentPrice = selected?.valorUnit || 0;
      const quantity = item.qtd || 0;

      totalRealizedSpend += currentPrice * quantity;
      // Precision: Savings are calculated as (Highest Market Quote - Chosen Quote) * Volume
      totalSavingsGenerated += (maxPrice - currentPrice) * quantity;
      totalMarketBenchmark += maxPrice * quantity;
      totalTargetSpend += minPrice * quantity;
    });

    const efficiencyRate = totalMarketBenchmark > 0 
      ? (totalSavingsGenerated / totalMarketBenchmark) * 100 
      : 0;

    return { 
      totalSpend: totalRealizedSpend, 
      totalEconomy: totalSavingsGenerated, 
      potentialSpend: totalTargetSpend,
      marketBenchmark: totalMarketBenchmark,
      efficiencyRate
    };
  }, [items]);

  const abcFornecedores = useMemo(() => {
    const grouped: any = {};
    items.forEach(item => {
      const selected = item.fornecedores?.find((f: any) => f.selecionado);
      if (selected) {
        grouped[selected.nome] = (grouped[selected.nome] || 0) + (selected.valorUnit * item.qtd);
      }
    });
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value: value as number }))
      .sort((a, b) => b.value - a.value);
  }, [items]);

  const abcProdutos = useMemo(() => {
    return items.map(item => {
      const selected = item.fornecedores?.find((f: any) => f.selecionado);
      return {
        name: item.produto,
        value: (selected?.valorUnit || 0) * item.qtd
      };
    }).sort((a, b) => b.value - a.value);
  }, [items]);

  return (
    <div className="space-y-10 pb-20 animate-executive-fade">
      <PageHeader 
        title="Gestão de Compras"
        subtitle="Análise comparativa de fornecedores, economia gerada e curva ABC de insumos."
        icon={ShoppingBag}
        actions={
          <div className="flex bg-card border border-border rounded-md px-4 py-2 shadow-sm items-center gap-4">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Economia Acumulada</span>
            <span className="text-success font-black text-sm flex items-center gap-1.5">
              <TrendingDown size={14} />
              {formatCurrency(Math.floor(stats.totalEconomy))}
            </span>
          </div>
        }
      />


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCardModeling label="Gasto Total Realizado" value={formatCurrency(stats.totalSpend)} tone="default" />
        <KpiCardModeling label="Economia Direta" value={formatCurrency(stats.totalEconomy)} tone="success" helper="Diferença para o maior preço orçado" />
        <KpiCardModeling label="Benchmark / Alvo" value={formatCurrency(stats.potentialSpend)} tone="default" helper="Se comprado tudo no menor preço" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[40px] border border-border shadow-sm">
          <div className="flex items-center justify-between mb-8">
             <div>
       <h3 className="text-sm font-bold text-executive-secondary">ABC por Fornecedor</h3>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Concentração do Volume de Compras</p>
             </div>
             <div className="p-2 bg-slate-50 rounded-xl">
               <Users size={18} className="text-secondary" />
             </div>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={abcFornecedores}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-executive-primary)', fontWeight: 600 }} />
                <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                   formatter={(v: number) => formatCurrency(v)}
                />
                <Bar dataKey="value" fill="currentColor" radius={[0, 4, 4, 0]} barSize={15} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[40px] border border-border shadow-sm">
          <div className="flex items-center justify-between mb-8">
             <div>
       <h3 className="text-sm font-bold text-executive-secondary">Principais Itens (ABC)</h3>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Produtos com maior impacto financeiro</p>
             </div>
             <div className="p-2 bg-blue-50 rounded-xl">
               <ShoppingBag size={18} className="text-blue-500" />
             </div>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={abcProdutos}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {abcProdutos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['var(--color-executive-primary)', 'var(--color-executive-primary)', 'var(--color-executive-primary)', 'var(--color-executive-primary)'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                   formatter={(v: number) => formatCurrency(v)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white border border-border rounded-[40px] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-slate-50/50 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-4 top-3 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Pesquisar produto ou unidade..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:ring-2 focus:ring-secondary/10 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-border">
                <SortableHeader label="Produto / Unidade" sortKey="produto" currentSort={sort} onSort={toggleSort} />
                <SortableHeader label="Qtd / Consumo" sortKey="qtd" currentSort={sort} onSort={toggleSort} align="center" />
                { [1,2,3].map(i => (
                  <th key={i} className="px-4 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Fornecedor {i}</th>
                ))}
                <th className="px-5 md:px-8 py-3 md:py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Economia Gerada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedItems.map(item => {
                const selected = item.fornecedores?.find((f: any) => f.selecionado);
                const prices = item.fornecedores?.map((f: any) => f.valorUnit) || [];
                const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
                const economy = (maxPrice - (selected?.valorUnit || 0)) * item.qtd;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 md:px-8 py-3 md:py-5">
                      <div className="flex flex-col">
            <span className="text-sm font-bold text-executive-secondary">{item.produto}</span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{item.centroCusto}</span>
                      </div>
                    </td>
                    <td className="px-4 py-5 text-center">
                      <span className="text-xs font-black text-muted-foreground">{item.qtd} un.</span>
                    </td>
                    {item.fornecedores?.map((f: any, idx: number) => (
                      <td key={idx} className="px-4 py-5 text-center">
                        <div className={cn(
                          "p-2 rounded-xl border transition-all",
                          f.selecionado ? "bg-primary/5 border-primary/20" : "bg-white border-border"
                        )}>
             <p className="text-[9px] font-black text-executive-secondary uppercase">{f.nome}</p>
                          <p className={cn(
                            "text-xs font-black mt-1",
                            f.selecionado ? "text-primary" : "text-muted-foreground"
                          )}>{formatCurrency(f.valorUnit)}</p>
                          {f.selecionado && <span className="text-[8px] bg-primary text-white px-1.5 py-0.5 rounded-full uppercase mt-1 inline-block">Selecionado</span>}
                        </div>
                      </td>
                    ))}
                    <td className="px-5 md:px-8 py-3 md:py-5 text-right">
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-black text-emerald-600">+{formatCurrency(economy)}</span>
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            economy > 1000 ? "bg-success-soft0 animate-pulse" : "bg-emerald-300"
                          )} />
                        </div>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Saving por Volume ({item.qtd} un.)</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-4">
            Página {currentPage} de {totalPages || 1}
          </div>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={18} className="text-muted-foreground" />
            </button>
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-all"
            >
              <ChevronRight size={18} className="text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-primary p-12 rounded-[40px] text-white overflow-hidden relative shadow-2xl shadow-primary/20">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 w-full space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
              <TrendingUp size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Projeção de Eficiência Anual</span>
            </div>
            <h3 className="text-3xl font-black leading-tight">Impacto da Gestão de Compras no Resultado</h3>
            <p className="w-full text-white/70 text-base leading-relaxed font-medium">
              A eficiência de negociação atual é de <strong>{stats.efficiencyRate.toFixed(1)}%</strong> sobre o maior preço orçado. Sua projeção anual indica uma redução de custos de <strong>{formatCurrency(stats.totalEconomy * 12)}</strong> diretamente no LAJIDA através da gestão de volume de compra.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
             <div className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/10 min-w-[200px] w-full">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">Economia Mensal</p>
                <p className="text-3xl font-black">{formatCurrency(stats.totalEconomy)}</p>
             </div>
             <div className="bg-secondary p-8 rounded-3xl shadow-xl min-w-[200px] w-full">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">Saving Projetado (12m)</p>
                <p className="text-3xl font-black">{formatCurrency(stats.totalEconomy * 12)}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
