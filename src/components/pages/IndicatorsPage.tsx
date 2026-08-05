import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { query, collection, where, onSnapshot, getDocs, limit, startAfter, orderBy } from 'firebase/firestore';
import { usePaginatedData } from '../../hooks/usePaginatedData';
import { TrendingUp, BarChart3, Settings, DollarSign, Waves, Activity, Wallet, Building, Target, ShieldAlert, Zap, ArrowUpRight, Rocket, LayoutGrid, List, ShieldCheck, Users, ChevronRight, Info, Calendar, Lightbulb, Globe, ShoppingBag, Loader2, TrendingDown, Minus, ArrowUp, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../../lib/firebase';
import { formatValue, cn, formatCurrency } from '../../lib/utils';
import { SectionHeader, StatusBadge, PageHeader, ControlBar, KpiValue } from '../Common';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveAccordion } from '../ui/executive-accordion';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';
import { ExecutiveMetricCard } from '../ui/executive-metric-card';
import { ExecutiveBadge } from '../ui/executive-badge';
import { ExecutiveTechnicalLayer } from '../ui/executive-technical-layer';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../ui/executive-decision-trace';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { useIndicatorsPageViewModel } from '../../viewmodels/useIndicatorsPageViewModel';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { FULL_MONTH_LABELS, EIXOS_ORDEM } from '../../constants';
import { useRealIndicatorData } from '../../hooks/useRealIndicatorData';
import { DashboardSkeleton } from '../ui/skeletons';

const GROUP_MAPPING: Record<string, string> = {
  'Performance': 'Administração e Finanças',
  'Operacional': 'Gestão Operacional',
  'Lucratividade': 'Administração e Finanças',
  'Liquidez': 'Administração e Finanças',
  'Atividade': 'Gestão Operacional',
  'Eficiência': 'Gestão Operacional',
  'Caixa': 'Administração e Finanças',
  'Financeiro': 'Administração e Finanças',
  'Patrimonial': 'Administração e Finanças',
  'Risco': 'Governança Corporativa',
  'Estratégico': 'Governança Corporativa',
  'Crescimento': 'Gestão Comercial',
  'Venture': 'Gestão de Inovação',
  'Compliance': 'Governança Corporativa',
  'Governança': 'Governança Corporativa',
  'Pessoas': 'Cultura Organizacional',
  'RH': 'Cultura Organizacional',
  'Marketing': 'Gestão de Marketing',
  'Vendas': 'Gestão Comercial',
  'EBITDA': 'Administração e Finanças',
  'Receita Líquida': 'Administração e Finanças',
  'Lucro Líquido': 'Administração e Finanças',
};

export function IndicatorsPage({ clients, selectedClient, selectedMonth, selectedYear }: any) {
  const { t } = useTranslation('executive');
  const { state: vmState, computed: vmComputed, actions: vmActions } = useIndicatorsPageViewModel({ clientId: selectedClient });

  const [periodType, setPeriodType] = useState<'mensal' | 'anual'>('mensal');
  const [filterMonth, setFilterMonth] = useState(selectedMonth);
  const [filterYear, setFilterYear] = useState(selectedYear);
  const [filterGroup, setFilterGroup] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filters = useMemo(() => {
    const list = [
      { field: 'clientId', operator: '==', value: selectedClient },
      { field: 'ano', operator: '==', value: filterYear }
    ];
    if (periodType === 'mensal') {
      list.push({ field: 'mes', operator: '==', value: filterMonth });
    }
    return list;
  }, [selectedClient, filterYear, filterMonth, periodType]);

  const { data: indicators, loading, hasMore, fetchNextPage, reset } = usePaginatedData({
    collectionName: 'indicators',
    filters,
    pageSize: 12
  });

  const { kpis: calculatedKPIs } = useRealIndicatorData(selectedClient, periodType === 'anual' ? 0 : filterMonth, filterYear);

  useEffect(() => { reset(); }, [selectedClient, filterYear, filterMonth, periodType]);
  useEffect(() => { setFilterYear(selectedYear); setFilterMonth(selectedMonth); }, [selectedYear, selectedMonth]);

  const years = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => current - i);
  }, []);

  const { grouped, summary, groups, healthScore } = useMemo(() => {
    let finalIndicators = [...indicators];

    const getVal = (label: string) => {
      if (label === 'Faturamento' && calculatedKPIs.revenue > 0) return formatCurrency(calculatedKPIs.revenue);
      if (label === 'EBITDA' && calculatedKPIs.ebitda > 0) return formatCurrency(calculatedKPIs.ebitda);
      if (label === 'Ativos' && calculatedKPIs.totalAssets > 0) return formatCurrency(calculatedKPIs.totalAssets);
      if (label === 'Passivos' && calculatedKPIs.totalLiabilities > 0) return formatCurrency(calculatedKPIs.totalLiabilities);
      const found = finalIndicators.find(i => i.ind?.toLowerCase().includes(label.toLowerCase()));
      return found ? formatValue(found.val, found.un) : '---';
    };

    const stats = [
      { label: 'Faturamento', value: getVal('Faturamento'), icon: BarChart3 },
      { label: 'EBITDA', value: getVal('EBITDA'), icon: Zap },
      { label: 'Ativos Totais', value: getVal('Ativos'), icon: TrendingUp },
      { label: 'Passivos Totais', value: getVal('Passivos'), icon: ShieldAlert }
    ];

    const healthScore = finalIndicators.length > 0 ? Math.round(
      finalIndicators.reduce((acc, curr) => {
        const val = curr.sem === 'Verde' ? 100 : curr.sem === 'Amarelo' ? 60 : 30;
        return acc + val;
      }, 0) / finalIndicators.length
    ) : 85;

    return { grouped: {}, summary: stats, groups: [], healthScore };
  }, [indicators, calculatedKPIs]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <ExecutivePageTemplate header={{
      title: "Análise de KPIs",
      description: "Monitoramento avançado de performance e eixos estratégicos em tempo real.",
    }}>
      <div className="space-y-8 pb-24 animate-executive-fade max-w-[1440px] mx-auto">
        
        {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE KPIS E SCORE DE SAÚDE) --- */}
        <ExecutiveSummarySection 
          className="mb-8"
          status={{ label: 'Métricas Validadas', variant: 'success' }}
          question="Como está o desempenho consolidado dos indicadores nos 6 eixos de gestão?"
          opinion="O comitê fiduciário homologa os indicadores de performance, atestando a consistência dos faróis e o atingimento das metas projetadas."
          driver="Evolução do Score de Saúde, desvios operacionais e atingimento de metas nos eixos corporativos."
          implication="Visibilidade total para tomada de decisão fundamentada e correção tempestiva de rota."
          executiveQuestion="Manter plano de ação ativo para os indicadores sinalizados com farol amarelo ou vermelho."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>

        {/* --- CAMADA 2: DIRETORIA & SCORE DE SAÚDE E PAINÉIS DE RESUMO --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Health Score Panel */}
          <div className="lg:col-span-4">
            <ExecutiveSurface padding="xl" radius="xl" className="h-full bg-card border border-border shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <ExecutiveHeading as="h4" className="text-foreground">Score de Saúde Consolidado</ExecutiveHeading>
                    <ExecutiveText variant="caption" className="text-muted-foreground">Maturidade Operacional</ExecutiveText>
                  </div>
                </div>
                <ExecutiveBadge variant={healthScore >= 80 ? "success" : healthScore >= 60 ? "warning" : "critical"}>
                  {healthScore >= 80 ? t('executive:status.optimized') : healthScore >= 60 ? t('executive:status.attention') : t('executive:status.critical')}
                </ExecutiveBadge>
              </div>

              <div className="flex items-baseline gap-2 my-2">
                <span className="text-5xl font-black font-mono text-foreground">{healthScore}</span>
                <span className="text-muted-foreground text-sm font-bold">/ 100</span>
              </div>

              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-xs font-bold text-muted-foreground">
                  <span>Eficiência Estratégica</span>
                  <span className="text-primary font-mono">{healthScore}%</span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden border border-border">
                  <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${healthScore}%` }} />
                </div>
              </div>
            </ExecutiveSurface>
          </div>

          {/* Summary KPIs */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {summary.map((stat, idx) => (
              <ExecutiveMetricCard
                key={idx}
                label={stat.label}
                value={String(stat.value)}
                statusBadge={<ExecutiveBadge variant="neutral">Consolidado</ExecutiveBadge>}
                tone="neutral"
                description={<span className="text-xs text-muted-foreground font-medium">Indicador Chave</span>}
                className="bg-card border border-border shadow-sm h-full"
              />
            ))}
          </div>
        </div>

        {/* --- CAMADA 3: CAMADA TÉCNICA E DETALHAMENTO DE KPIS --- */}
        <ExecutiveTechnicalLayer
          title="Camada Técnica de Indicadores"
          subtitle="Tabela e Grade Analítica de KPIs por Eixo"
          description="Detalhamento analítico por categoria, unidade de medida, frequência e variação de metas."
          className="mb-8"
        >
          <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <ExecutiveHeading as="h3" className="text-foreground">Lançamentos de Performance</ExecutiveHeading>
              <span className="text-xs text-muted-foreground font-bold">{indicators.length} Indicadores Carregados</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {indicators.map((r: any) => (
                <div key={r.id || r.ind} className="p-5 bg-surface-container/30 border border-border rounded-2xl space-y-3">
                  <div className="flex justify-between items-start">
                    <ExecutiveHeading as="h4" className="text-foreground font-bold">{r.ind}</ExecutiveHeading>
                    <ExecutiveBadge variant={r.sem === 'Verde' ? 'success' : r.sem === 'Amarelo' ? 'warning' : 'critical'}>
                      {r.sem || 'Pendente'}
                    </ExecutiveBadge>
                  </div>
                  <div className="text-2xl font-black font-mono text-foreground">
                    {formatValue(r.val, '')} {r.un}
                  </div>
                  <div className="text-xs text-muted-foreground flex justify-between pt-2 border-t border-border">
                    <span>Competência: {r.comp || `${filterMonth}/${filterYear}`}</span>
                    <span className="font-bold text-primary">{r.group || 'Geral'}</span>
                  </div>
                </div>
              ))}
            </div>
          </ExecutiveSurface>
        </ExecutiveTechnicalLayer>

      </div>
    </ExecutivePageTemplate>
  );
}
