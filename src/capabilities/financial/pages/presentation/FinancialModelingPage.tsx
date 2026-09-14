import React, { useState, useMemo, useEffect } from 'react';
import { LayoutGrid, Activity, FileText, Coins, BookOpen, Settings2, AlertTriangle, ShieldCheck, Upload, Plus, TrendingUp, LayoutDashboard, Presentation, Scale, Compass, Fingerprint, Target, Globe, ClipboardList, BarChart3, PieChart, Zap, Briefcase, Calculator, CreditCard, ArrowUpRight, CircleDollarSign, List, Landmark, Boxes, Rocket, LineChart, Percent, ShoppingBag, HardDrive, Layers, Bell, Users, Trash2, Save, Loader2, CheckCircle2 } from 'lucide-react';


import { db, handleFirestoreError, OperationType } from '../../../../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, AreaChart, Area } from 'recharts';
import { PageHeader, StatusBadge } from '../../../../components/Common';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveAccordion } from '../../../../components/ui/executive-accordion';
import { ExecutiveEmptyState } from '../../../../components/ui/executive-empty-state';
import { ExecutiveMetricCard } from '../../../../components/ui/executive-metric-card';
import { ExecutiveBadge } from '../../../../components/ui/executive-badge';
import { ExecutiveHeading } from '../../../../components/ui/executive-heading';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { ExecutiveSummarySection } from '../../../../components/ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../../../../components/ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../../../../components/ui/executive-decision-trace';
import { ExecutiveTechnicalLayer } from '../../../../components/ui/executive-technical-layer';
import { ExecutivePageTemplate } from '../../../../components/ui/executive-page-template';
import { useFinancialModelingPageViewModel } from '../../../../viewmodels/useFinancialModelingPageViewModel';

export function FinancialModelingPage({ clients, selectedClient, setSelectedClient }: { clients: any[], selectedClient: string, setSelectedClient: (id: string) => void }) {
  const { state: vmState, computed: vmComputed, actions: vmActions } = useFinancialModelingPageViewModel({ clientId: selectedClient });
  const [tab, setTab] = useState("configuracao");

  const activeClient = useMemo(() => 
    clients.find(c => c.id === selectedClient) || clients[0]
  , [clients, selectedClient]);

  const clientName = activeClient?.fantasia || activeClient?.name || 'Cliente';

  return (
    <ExecutivePageTemplate header={{
      title: "Modelagem Financeira Estrutural",
      description: `Projeção estratégica de 5 anos, DRE gerencial, fluxo de caixa e balanço patrimonial · ${clientName}`,
    }}>
      <div className="space-y-8 pb-24 animate-executive-fade max-w-[1440px] mx-auto">

        {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE MODELAGEM FINANCEIRA) --- */}
        <ExecutiveSummarySection 
          className="mb-8"
          status={{ label: 'Modelo Homologado', variant: 'success' }}
          question="Como estão projetadas as DREs gerenciais, fluxo de caixa livre (FCFF) e balanços para os próximos 5 anos?"
          opinion="O comitê fiduciário homologa os modelos de projeção de longo prazo, atestando a coerência das taxas de desconto, inflação e premissas operacionais."
          driver="Projeção de 5 anos, margem EBITDA esperada, variação de NCG e plano de CAPEX."
          implication="Garantia de solidez na sustentação de planos de expansão e captação de dívida de longo prazo."
          executiveQuestion="Revisar os parâmetros de inflação e taxa Selic no início de cada ciclo orçamentário anual."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>

        {/* --- CAMADA 2: DIRETORIA & KPIS DE PROJEÇÃO --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ExecutiveMetricCard
            label="Horizonte de Projeção"
            value="5 Anos (2026-2030)"
            statusBadge={<ExecutiveBadge variant="info">Plano Estrutural</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="IPCA Target (Ano Base)"
            value="3.85% a.a."
            statusBadge={<ExecutiveBadge variant="neutral">Premissa Macro</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="Selic Target"
            value="14.65% a.a."
            statusBadge={<ExecutiveBadge variant="warning">Taxa Desconto</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />
        </div>

        {/* --- CAMADA 3: CAMADA TÉCNICA E MODELO DE PROJEÇÃO --- */}
        <ExecutiveTechnicalLayer
          title="Camada Técnica — Projeções Financeiras de 5 Anos"
          subtitle="DRE Gerencial, Fluxo de Caixa Livre e Balanço Patrimonial"
          description="Demonstrativos de projeção com base nos lançamentos contábeis e premissas orçamentárias."
          className="mb-8"
        >
          <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm space-y-4">
            <ExecutiveHeading as="h4" className="text-foreground">Variáveis do Modelo Estrutural</ExecutiveHeading>
            <ExecutiveText variant="bodyStandard" className="text-muted-foreground">
              O engine de projeção consolida automaticamente as estimativas de receita bruta, variação de NCG e amortização de empréstimos sob o regime fiduciário.
            </ExecutiveText>
          </ExecutiveSurface>
        </ExecutiveTechnicalLayer>

      </div>
    </ExecutivePageTemplate>
  );
}
