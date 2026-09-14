import { ExecutivePageTemplate } from '../../../../components/ui/executive-page-template';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { ExecutiveHeading } from '../../../../components/ui/executive-heading';
import React, { useState, useEffect, useMemo } from 'react';
import { WalletCards, TrendingUp, Sparkles, PieChart as PieChartIcon, BarChart3, ArrowUpRight, ArrowDownRight, Plus, Search, Filter, Calendar, ChevronRight, Activity, Briefcase, ShieldCheck, Target, Download, Trash2, Coins, Percent, TrendingDown, Info, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Pie, Cell, Legend } from 'recharts';
import { useAssetManagementPageAdapter } from '../../../../adapters/ui/useAssetManagementPageAdapter';
import { cn, formatCurrency, getThemeColors } from '../../../../lib/utils';
import { DATA } from '../../../../data';
import { FULL_MONTH_LABELS } from '../../../../constants';
import { PageHeader, Semaphore, ControlBar, StatusBadge } from '../../../../components/Common';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveAccordion } from '../../../../components/ui/executive-accordion';
import { ExecutiveEmptyState } from '../../../../components/ui/executive-empty-state';
import { ExecutiveMetricCard } from '../../../../components/ui/executive-metric-card';
import { ExecutiveBadge } from '../../../../components/ui/executive-badge';
import { ExecutiveTechnicalLayer } from '../../../../components/ui/executive-technical-layer';
import { AssetModal } from '../../../../components/modals/AssetModal';
import { fetchBenchmarks, MarketBenchmark } from '../../../../services/marketService';
import { DashboardSkeleton } from '../../../../components/ui/skeletons';
import { ExecutiveSummarySection } from '../../../../components/ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../../../../components/ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../../../../components/ui/executive-decision-trace';
import { useAssetManagementViewModel } from '../../../../viewmodels/useAssetManagementViewModel';

export function AssetManagementPage({ clientId, selectedYear, selectedMonth }: any) {
  const { state, computed, actions } = useAssetManagementViewModel({ clientId, selectedYear, selectedMonth });
  const { assets, loading } = state;

  const [year, setYear] = useState(selectedYear || 2026);
  const [month, setMonth] = useState(selectedMonth || 5);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any>(null);

  const totalValue = assets.reduce((acc, curr) => acc + (curr.value || 0), 0);
  const totalProfit = assets.reduce((acc, curr) => acc + (curr.profit || 0), 0);
  
  const monthlyYield = totalValue > 0 
    ? assets.reduce((acc, curr) => acc + ((curr.change || 0) * (curr.value || 0)), 0) / totalValue 
    : 0;

  const cumulativeYield = (totalValue > 0 && (totalValue - totalProfit) > 0)
    ? (totalProfit / (totalValue - totalProfit)) * 100 
    : 0;

  const filteredAssets = assets.filter(asset => 
    (asset.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (asset.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!clientId) {
    return (
      <ExecutivePageTemplate header={{ title: "Gestão de Ativos", description: "Selecione uma empresa para visualizar o painel." }}>
        <ExecutiveSurface padding="xl" radius="xl" className="text-center py-20 bg-card border border-border">
          <Briefcase size={48} className="mx-auto mb-4 text-primary" />
          <ExecutiveHeading as="h3" className="text-foreground mb-2">Selecione uma Empresa</ExecutiveHeading>
          <ExecutiveText variant="bodyStandard" className="text-muted-foreground max-w-md mx-auto">
            Por favor, selecione uma empresa no seletor de cliente ativo no topo da tela para visualizar a carteira patrimonial.
          </ExecutiveText>
        </ExecutiveSurface>
      </ExecutivePageTemplate>
    );
  }

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <ExecutivePageTemplate header={{
      title: "Gestão de Ativos Financeiros",
      description: "Monitoramento de portfólio, alocação estratégica e análise de performance patrimonial.",
    }}>
      <div className="space-y-8 pb-24 animate-executive-fade max-w-[1440px] mx-auto">

        {/* Bar de Controles */}
        <div className="flex justify-between items-center mb-6">
          <ControlBar 
            selectedYear={year}
            setSelectedYear={setYear}
            selectedMonth={month}
            setSelectedMonth={setMonth}
          />
          <button 
            onClick={() => {
              setEditingAsset(null);
              setIsModalOpen(true);
            }}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-widest shadow-md hover:scale-105 transition-all flex items-center gap-2"
          >
            <Plus size={16} /> NOVO ATIVO
          </button>
        </div>

        {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE GESTÃO PATRIMONIAL) --- */}
        <ExecutiveSummarySection 
          className="mb-8"
          status={{ label: 'Carteira Homologada', variant: 'success' }}
          question="Qual o valor de mercado, liquidez e rentabilidade da carteira de ativos do grupo?"
          opinion="O comitê fiduciário homologa a gestão de ativos, validando o patrimônio total e a adequação da política de alocação de liquidez."
          driver="Patrimônio total acumulado, yield real acima da inflação e diversificação por classe."
          implication="Preservação de capital e otimização do custo de oportunidade da tesouraria."
          executiveQuestion="Manter rebalanceamento periódico para garantir alocação em conformidade com as diretrizes do conselho."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>

        {/* --- CAMADA 2: DIRETORIA & KPIS PATRIMONIAIS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <ExecutiveMetricCard
            label="Patrimônio Total"
            value={formatCurrency(totalValue)}
            statusBadge={<ExecutiveBadge variant="info">Valor de Mercado</ExecutiveBadge>}
            tone="neutral"
            description={<span className="text-xs text-muted-foreground font-medium">Consolidado da Carteira</span>}
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="Rentabilidade (Mês)"
            value={`${monthlyYield.toFixed(2)}%`}
            statusBadge={<ExecutiveBadge variant={monthlyYield >= 0 ? "success" : "critical"}>{monthlyYield >= 0 ? "Positivo" : "Negativo"}</ExecutiveBadge>}
            tone="neutral"
            description={<span className="text-xs text-muted-foreground font-medium">{formatCurrency(totalProfit)}</span>}
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="Acumulado Total"
            value={`${cumulativeYield.toFixed(2)}%`}
            statusBadge={<ExecutiveBadge variant={cumulativeYield >= 0 ? "success" : "critical"}>Desde o Início</ExecutiveBadge>}
            tone="neutral"
            description={<span className="text-xs text-muted-foreground font-medium">Retorno Histórico</span>}
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="Yield Real (Est.)"
            value={`${(monthlyYield - 0.45).toFixed(2)}%`}
            statusBadge={<ExecutiveBadge variant={(monthlyYield - 0.45) >= 0 ? "success" : "warning"}>Acima da Inflação</ExecutiveBadge>}
            tone="neutral"
            description={<span className="text-xs text-muted-foreground font-medium">IPCA Descontado</span>}
            className="bg-card border border-border shadow-sm h-full"
          />
        </div>

        {/* --- CAMADA 3: CAMADA TÉCNICA E TABELA DE ATIVOS --- */}
        <ExecutiveTechnicalLayer
          title="Camada Técnica de Ativos"
          subtitle="Registro Analítico de Ativos e Alocação de Liquidez"
          description="Detalhamento por classe de ativo, valor de aplicação, cotação atual e variação percentual."
          className="mb-8"
        >
          <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Buscar ativo ou classe..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-border rounded-xl text-xs font-semibold outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <span className="text-xs text-muted-foreground font-bold">{filteredAssets.length} Ativos Registrados</span>
            </div>

            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-surface-container/30 border-b border-border text-muted-foreground font-bold uppercase tracking-wider">
                    <th className="p-4">Ativo</th>
                    <th className="p-4">Categoria</th>
                    <th className="p-4 text-right">Valor Inicial</th>
                    <th className="p-4 text-right">Valor Atual</th>
                    <th className="p-4 text-right">Lucro/Prejuízo</th>
                    <th className="p-4 text-right">Variação (Mês)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-surface-container/30 transition-colors">
                      <td className="p-4 font-bold text-foreground">{asset.name}</td>
                      <td className="p-4">
                        <ExecutiveBadge variant="neutral">{asset.category}</ExecutiveBadge>
                      </td>
                      <td className="p-4 text-right font-mono text-muted-foreground">{formatCurrency(asset.initialValue || 0)}</td>
                      <td className="p-4 text-right font-mono font-bold text-foreground">{formatCurrency(asset.value || 0)}</td>
                      <td className={cn("p-4 text-right font-mono font-bold", (asset.profit || 0) >= 0 ? "text-success" : "text-critical")}>
                        {formatCurrency(asset.profit || 0)}
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-foreground">
                        {asset.change ? `${asset.change.toFixed(2)}%` : '---'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ExecutiveSurface>
        </ExecutiveTechnicalLayer>

        {isModalOpen && (
          <AssetModal 
            clientId={clientId}
            asset={editingAsset}
            onClose={() => setIsModalOpen(false)}
          />
        )}

      </div>
    </ExecutivePageTemplate>
  );
}
