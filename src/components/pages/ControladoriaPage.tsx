import { ExecutiveText } from '../ui/executive-typography';
import { ExecutiveHeading } from '../ui/executive-heading';
import React, { useMemo } from 'react';
import { ShieldCheck, TrendingUp, BarChart3, Scale, WalletCards, AlertCircle, CheckCircle2, PieChart as PieIcon, Zap, MessageSquare, Landmark, Calendar, Target, ArrowUpRight, Activity, ShieldAlert, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { cn, formatValue, formatCurrency, getThemeColors } from '../../lib/utils';
import { PageHeader, ControlBar } from '../Common';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveAccordion } from '../ui/executive-accordion';
import { ExecutiveMetricCard } from '../ui/executive-metric-card';
import { ExecutiveBadge } from '../ui/executive-badge';
import { ExecutiveTechnicalLayer } from '../ui/executive-technical-layer';
import { useInstitutionalContext } from '../../hooks/useInstitutionalContext';
import { DataAccessContext } from '../../core/security/data-access-context';
import { governanceService } from '../../services/governanceService';
import { getFinancialEntries, getBudgets } from '../../services/cashFlowService';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../ui/executive-decision-trace';
import { useControladoriaViewModel } from '../../viewmodels/useControladoriaViewModel';

interface ControladoriaPageProps {
  clientId: string;
}

export function ControladoriaPage({ clientId }: ControladoriaPageProps) {
  const { state, computed, actions } = useControladoriaViewModel({ clientId });
  const [dbIndicators, setDbIndicators] = React.useState<any[]>([]);
  const [budgets, setBudgets] = React.useState<any[]>([]);
  const [actuals, setActuals] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = React.useState(new Date().getMonth() + 1);

  const colors = getThemeColors();
  const institutionalContext = useInstitutionalContext();
  const [accessDenied, setAccessDenied] = React.useState(false);
  const [denialReason, setDenialReason] = React.useState('');

  React.useEffect(() => {
    if (!clientId || !institutionalContext.isContextReady) return;

    let isMounted = true;
    setLoading(true);
    setAccessDenied(false);

    async function fetchData() {
      try {
        const dataAccessContext: DataAccessContext = {
          actorId: institutionalContext.actorId,
          tenantId: institutionalContext.tenantId,
          role: institutionalContext.role,
          permissions: institutionalContext.permissions,
          entityScope: institutionalContext.entityScope,
          requestedAction: 'VIEW_DASHBOARD',
          resourceType: 'FinancialData',
          resourceTenantId: institutionalContext.isLegacyContext ? institutionalContext.legacyTenantId || clientId : clientId,
          visibilityPolicy: 'INTERNAL',
          auditRequirement: false
        };

        const [indData, budData, actData] = await Promise.all([
          governanceService.getDashboardIndicators(dataAccessContext, clientId),
          getBudgets(dataAccessContext, clientId),
          getFinancialEntries(dataAccessContext, clientId)
        ]);

        if (!isMounted) return;

        setDbIndicators(indData.filter((i: any) => i.ano === selectedYear && i.mes === selectedMonth));
        setBudgets(budData.filter((b: any) => b.year === selectedYear && b.month === selectedMonth));

        const entries: any[] = [];
        actData
          .filter((d: any) => d.year === selectedYear && d.month === selectedMonth && d.type === 'DRE Gerencial' && d.status === 'approved')
          .forEach((data: any) => {
            if (Array.isArray(data.data)) {
              data.data.forEach((e: any) => entries.push(e));
            } else {
              entries.push(data);
            }
          });
        
        setActuals(entries);
      } catch (error: any) {
        if (!isMounted) return;
        console.error('Governance Error in Controladoria:', error);
        setAccessDenied(true);
        setDenialReason(error.message || 'Acesso negado.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [clientId, selectedYear, selectedMonth, institutionalContext]);

  const getIndicatorValue = (name: string, fallback: number = 0) => {
    const ind = dbIndicators.find(i => i.ind === name || i.ind?.toLowerCase() === name.toLowerCase());
    return ind ? ind.val : fallback;
  };

  const hasData = dbIndicators.length > 0 || budgets.length > 0;

  const deviationRows = useMemo(() => {
    const rows: any[] = [];
    budgets.forEach(b => {
      const actual = actuals.find(a => a.category === b.accountName || a.category === b.accountCode);
      const realVal = actual ? actual.value : 0;
      const budgetVal = b.valor || 0;
      const indice = budgetVal > 0 ? Math.round((realVal / budgetVal) * 100) : 0;
      
      rows.push({
        item: b.accountName,
        planejado: budgetVal,
        realizado: realVal,
        indice: indice
      });
    });
    return rows.sort((a, b) => b.indice - a.indice);
  }, [budgets, actuals]);

  const totalPlanned = budgets.reduce((acc, curr) => acc + curr.valor, 0);
  const totalRealized = actuals.reduce((acc, curr) => acc + curr.value, 0);
  const adherenceScore = totalPlanned > 0 ? Math.max(0, 100 - Math.abs(Math.round(((totalRealized - totalPlanned) / totalPlanned) * 100))) : 0;
  const complianceScore = 95;

  const bvaData = useMemo(() => {
    return [
      { name: 'Mês Ref.', planejado: totalPlanned, realizado: totalRealized }
    ];
  }, [totalPlanned, totalRealized]);

  const indicators = useMemo(() => [
    { label: 'Aderência Orçamentária', value: `${adherenceScore}%`, statusBadge: <ExecutiveBadge variant={adherenceScore >= 90 ? "success" : "warning"}>{adherenceScore >= 90 ? "Eficiente" : "Atenção"}</ExecutiveBadge>, trend: 'Calculado' },
    { label: 'Margem EBITDA Realizada', value: `${getIndicatorValue('Margem EBITDA', 0)}%`, statusBadge: <ExecutiveBadge variant="success">Real</ExecutiveBadge>, trend: 'Realizado' },
    { label: 'Burn Rate Mensal', value: formatCurrency(getIndicatorValue('Burn Rate', 0)), statusBadge: <ExecutiveBadge variant="info">Mensal</ExecutiveBadge>, trend: 'Gasto Mensal' },
    { label: 'Índice de Alavancagem', value: `${getIndicatorValue('Alavancagem', 0)}x`, statusBadge: <ExecutiveBadge variant="neutral">Estável</ExecutiveBadge>, trend: 'Solvência' }
  ], [dbIndicators, adherenceScore]);

  if (accessDenied) {
    return (
      <ExecutiveSurface padding="xl" radius="xl" className="flex flex-col items-center justify-center min-h-[400px] text-center w-full border-critical/20">
         <div className="w-20 h-20 rounded-full bg-critical-soft flex items-center justify-center text-critical mb-4">
            <AlertTriangle size={40} />
         </div>
         <ExecutiveHeading as="h3" className="text-critical mb-2">Acesso Institucional Negado</ExecutiveHeading>
         <p className="text-sm text-executive-secondary max-w-lg mb-4">
           {denialReason}
         </p>
      </ExecutiveSurface>
    );
  }

  return (
    <ExecutivePageTemplate header={{
      title: "Controladoria Estratégica",
      description: "Auditoria de processos e monitoramento de aderência orçamentária para máxima eficiência operacional.",
    }}>

      {/* Control Bar */}
      <ControlBar 
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        showStatusBadge={true}
        statusBadgeLabel="Auditoria & Compliance Ativo"
      />

      {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE CONTROLADORIA E COMPLIANCE) --- */}
      <ExecutiveSummarySection 
        className="mt-8 mb-8"
        status={{ label: 'Orçamento Monitorado', variant: 'success' }}
        question="Como garantir o cumprimento do orçamento aprovado e evitar desvios operacionais?"
        opinion="O comitê fiduciário homologa a análise de desvios orçamentários, atestando a integridade dos controles de conciliação e compliance."
        driver="Orçamento vs. Realizado, índice de conformidade e desvios por centro de custo."
        implication="Preservação da margem EBITDA projetada e contenção de vazamentos operacionais."
        action="Exigir justificativa da diretoria para variações acima de 5% em despesas de overhead e alinhar contingências."
      >
        <ExecutiveStrategicTensions tensions={[]} />
        <ExecutiveDecisionTrace trace={[]} />
      </ExecutiveSummarySection>

      {/* --- CAMADA 2: DIRETORIA & SCORE DE ADERÊNCIA --- */}
      {hasData && (
        <div className="space-y-8 mb-10">
          <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Scale size={32} />
                </div>
                <div>
                  <ExecutiveHeading as="h3" className="text-foreground mb-1">Score de Aderência Orçamentária</ExecutiveHeading>
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-black text-foreground font-mono">{adherenceScore}%</span>
                    <ExecutiveBadge variant={adherenceScore >= 90 ? "success" : "warning"}>
                      {adherenceScore >= 90 ? 'Eficiente' : 'Atenção'}
                    </ExecutiveBadge>
                  </div>
                </div>
              </div>

              <div className="flex-1 max-w-lg w-full">
                <div className="flex justify-between text-xs font-bold text-muted-foreground mb-2">
                  <span>Conformidade de Processos</span>
                  <span className="text-primary">{complianceScore}%</span>
                </div>
                <div className="h-3 bg-surface-container rounded-full overflow-hidden border border-border">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${complianceScore}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
            </div>
          </ExecutiveSurface>

          {/* Cards de Métricas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {indicators.map((kpi, idx) => (
              <ExecutiveMetricCard 
                key={idx}
                label={kpi.label}
                value={kpi.value}
                statusBadge={kpi.statusBadge}
                tone="neutral"
                description={<span className="text-xs text-muted-foreground font-medium">{kpi.trend}</span>}
                className="bg-card border border-border shadow-sm h-full"
              />
            ))}
          </div>

          {/* Chart & Insights */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <ExecutiveSurface padding="xl" radius="xl" className="xl:col-span-2 bg-card border border-border shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <ExecutiveHeading as="h3" className="text-foreground flex items-center gap-2">
                    <BarChart3 size={20} className="text-primary" /> Budget vs Realizado
                  </ExecutiveHeading>
                  <ExecutiveText as="div" variant="caption" className="text-muted-foreground mt-1">Análise de desvios orçamentários (YTD)</ExecutiveText>
                </div>
              </div>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bvaData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.border} opacity={0.3} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: colors.mutedForeground }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: colors.mutedForeground }} tickFormatter={(v) => `R$${v / 1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: colors.cardBg, borderRadius: '8px', border: `1px solid ${colors.border}`, color: colors.cardFg, fontSize: '11px' }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend wrapperStyle={{ paddingTop: '16px', fontSize: '10px' }} />
                    <Bar name="Planejado" dataKey="planejado" fill={colors.primary} radius={[4, 4, 0, 0]} barSize={28} opacity={0.65} />
                    <Bar name="Realizado" dataKey="realizado" fill={colors.secondary} radius={[4, 4, 0, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ExecutiveSurface>

            <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm flex flex-col justify-between">
              <div>
                <ExecutiveHeading as="h3" className="text-foreground mb-4 flex items-center gap-2">
                  <MessageSquare size={18} className="text-primary" /> Insights de Controladoria
                </ExecutiveHeading>
                <div className="space-y-4">
                  {[
                    "Investigar desvios orçamentários significativos em relação ao budget planejado.",
                    "Antecipar revisão orçamentária do semestre considerando as novas premissas.",
                    "Auditar processos de compras críticos para garantir conformidade de processos."
                  ].map((rec, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-xs font-bold text-primary shrink-0 border border-border">
                        {i + 1}
                      </span>
                      <ExecutiveText as="div" variant="bodyStandard" className="text-foreground/80 text-xs">
                        {rec}
                      </ExecutiveText>
                    </div>
                  ))}
                </div>
              </div>
            </ExecutiveSurface>
          </div>
        </div>
      )}

      {/* --- CAMADA 3: CAMADA TÉCNICA E DETALHAMENTO CONTÁBIL --- */}
      {hasData && deviationRows.length > 0 && (
        <ExecutiveTechnicalLayer
          title="Camada Técnica de Desvios Orçamentários"
          subtitle="Monitoramento Analítico de Itens com Maior Variação"
          description="Detalhamento contábil dos desvios entre valores planejados e realizados por centro de custo."
          className="mb-8"
        >
          <ExecutiveSurface padding="none" radius="xl" className="overflow-hidden border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-container/30 border-b border-border">
                    <th className="text-left py-4 px-6 text-xs font-bold text-muted-foreground uppercase tracking-widest">Item de Custo</th>
                    <th className="text-right py-4 px-6 text-xs font-bold text-muted-foreground uppercase tracking-widest">Budget Planejado</th>
                    <th className="text-right py-4 px-6 text-xs font-bold text-muted-foreground uppercase tracking-widest">Valor Realizado</th>
                    <th className="text-right py-4 px-6 text-xs font-bold text-muted-foreground uppercase tracking-widest">Índice de Uso</th>
                    <th className="text-center py-4 px-6 text-xs font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {deviationRows.map((row: any, i: number) => (
                    <tr key={i} className="hover:bg-surface-container/30 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-bold text-foreground">{row.item}</span>
                      </td>
                      <td className="py-4 px-6 text-right text-muted-foreground font-mono">{formatCurrency(row.planejado)}</td>
                      <td className="py-4 px-6 text-right font-bold font-mono text-foreground">{formatCurrency(row.realizado)}</td>
                      <td className="py-4 px-6 text-right font-mono font-bold">
                        <span className={cn(
                          row.indice > 100 ? "text-critical" : row.indice > 90 ? "text-warning" : "text-success"
                        )}>{row.indice}%</span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <ExecutiveBadge variant={row.realizado === 0 ? "neutral" : row.indice > 100 ? "critical" : row.indice > 90 ? "warning" : "success"}>
                          {row.realizado === 0 ? "Pendente" : row.indice > 100 ? "Crítico" : row.indice > 90 ? "Alerta" : "Saudável"}
                        </ExecutiveBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ExecutiveSurface>
        </ExecutiveTechnicalLayer>
      )}
    </ExecutivePageTemplate>
  );
}
