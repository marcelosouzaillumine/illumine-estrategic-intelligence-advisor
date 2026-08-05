import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { TrendingDown, Search, ChevronLeft, ChevronRight, Users, ShoppingBag, TrendingUp } from 'lucide-react';
import { usePurchasingAdapter } from '../../../adapters/ui/usePurchasingAdapter';
import { usePurchasingViewModel } from '../../../viewmodels/usePurchasingViewModel';
import { PageHeader, StatusBadge } from '../../Common';
import { ExecutiveAccordion } from '../../ui/executive-accordion';
import { ExecutiveEmptyState } from '../../ui/executive-empty-state';
import { ExecutivePageTemplate } from '../../ui/executive-page-template';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveHeading } from '../../ui/executive-heading';
import { ExecutiveText } from '../../ui/executive-typography';
import { ExecutiveMetricCard } from '../../ui/executive-metric-card';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveSummarySection } from '../../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../../ui/executive-decision-trace';
import { ExecutiveTechnicalLayer } from '../../ui/executive-technical-layer';
import { usePurchasingPageViewModel } from '../../../viewmodels/usePurchasingPageViewModel';
import { SortableHeader } from '../../SortableHeader';
import { cn, formatCurrency } from '../../../lib/utils';
import { useDataTable } from '../../../hooks/useDataTable';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function PurchasingPage({ clients, selectedClient }: { clients: any[], selectedClient: string }) {
  const { state: vmState, computed: vmComputed, actions: vmActions } = usePurchasingPageViewModel({ clientId: selectedClient });
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { orders, loading: loadingPurchases } = usePurchasingAdapter(selectedClient);

  useEffect(() => {
    setLoading(loadingPurchases);
    if (!loadingPurchases && orders) {
      setItems(orders);
    }
  }, [loadingPurchases, orders]);

  const stats = useMemo(() => {
    let totalRealizedSpend = 0;
    let totalSavingsGenerated = 0;

    items.forEach(item => {
      const selected = item.fornecedores?.find((f: any) => f.selecionado);
      const prices = item.fornecedores?.map((f: any) => f.valorUnit) || [];
      const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
      
      const currentPrice = selected?.valorUnit || 0;
      const quantity = item.qtd || 0;

      totalRealizedSpend += currentPrice * quantity;
      totalSavingsGenerated += (maxPrice - currentPrice) * quantity;
    });

    return { 
      totalSpend: totalRealizedSpend, 
      totalEconomy: totalSavingsGenerated, 
    };
  }, [items]);

  return (
    <ExecutivePageTemplate header={{
      title: "Gestão de Compras & Suprimentos",
      description: "Análise comparativa de cotações, economia gerada e saving em negociações com fornecedores.",
    }}>
      <div className="space-y-8 pb-24 animate-executive-fade max-w-[1440px] mx-auto">

        {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE COMPRAS & SAVINGS) --- */}
        <ExecutiveSummarySection 
          className="mb-8"
          status={{ label: 'Cotações Homologadas', variant: 'success' }}
          question="Qual o volume total de suprimentos contratados e a taxa de saving em cotações?"
          opinion="O comitê fiduciário homologa os processos de compras, destacando a disciplina na tomada de preços e a economia gerada em insumos estratégicos."
          driver="Gasto total realizado, saving acumulado versus maior cotação e concentração de compras por fornecedor."
          implication="Redução direta do CPV/CMV e aumento de margem bruta através de suprimentos eficientes."
          executiveQuestion="Exigir obrigatoriedade de no mínimo 3 cotações para ordens de compra acima de R$ 50 mil."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>

        {/* --- CAMADA 2: DIRETORIA & KPIS DE COMPRAS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ExecutiveMetricCard
            label="Gasto Total Realizado"
            value={formatCurrency(stats.totalSpend)}
            statusBadge={<ExecutiveBadge variant="info">Executado</ExecutiveBadge>}
            tone="neutral"
            description={<span className="text-xs text-muted-foreground font-medium">Volume de Compras</span>}
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="Economia Gerada (Saving)"
            value={formatCurrency(stats.totalEconomy)}
            statusBadge={<ExecutiveBadge variant="success">Saving Acumulado</ExecutiveBadge>}
            tone="neutral"
            description={<span className="text-xs text-muted-foreground font-medium">Economia em Cotações</span>}
            className="bg-card border border-border shadow-sm h-full"
          />
        </div>

        {/* --- CAMADA 3: CAMADA TÉCNICA E ITENS COMPRADOS --- */}
        <ExecutiveTechnicalLayer
          title="Camada Técnica de Suprimentos"
          subtitle="Tabela Analítica de Ordens de Compra e Insumos"
          description="Detalhamento de insumos, quantidade contratada e fornecedores cotados."
          className="mb-8"
        >
          <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <ExecutiveHeading as="h4" className="text-foreground">Insumos e Matérias-Primas</ExecutiveHeading>
              <ExecutiveBadge variant="neutral">{items.length} Itens Cotados</ExecutiveBadge>
            </div>

            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-surface-container/30 border-b border-border text-muted-foreground font-bold uppercase tracking-wider">
                    <th className="p-4">Insumo / Produto</th>
                    <th className="p-4 text-right">Quantidade</th>
                    <th className="p-4">Centro de Custo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-surface-container/30 transition-colors">
                      <td className="p-4 font-bold text-foreground">{item.produto || item.nome}</td>
                      <td className="p-4 text-right font-mono font-bold text-foreground">{item.qtd || 1}</td>
                      <td className="p-4 text-muted-foreground">{item.centroCusto || 'Operacional'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ExecutiveSurface>
        </ExecutiveTechnicalLayer>

      </div>
    </ExecutivePageTemplate>
  );
}
