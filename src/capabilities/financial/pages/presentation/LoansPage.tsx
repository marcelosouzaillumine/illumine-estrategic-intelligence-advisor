import React, { useState, useEffect, useMemo } from 'react';
import { WalletCards, CalendarDays, Calculator, TrendingDown, ArrowRight, ChevronLeft, ChevronRight, FileSpreadsheet, Boxes, Sparkles, Zap, TrendingUp, Plus, Upload, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { PageHeader, ControlBar, StatusBadge } from '../../../../components/Common';
import { DATA } from '../../../../data';
import { cn, formatCurrency, getThemeColors } from '../../../../lib/utils';
import { useDataTable } from '../../../../hooks/useDataTable';
import { ContractModal } from '../../../../components/modals/ContractModal';
import { ExecutivePageTemplate } from '../../../../components/ui/executive-page-template';
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
import { useLoansPageViewModel } from '../../../../viewmodels/useLoansPageViewModel';

export function LoansPage({ clients, selectedClient }: { clients: any[], selectedClient: string }) {
  const { state: vmState, computed: vmComputed, actions: vmActions } = useLoansPageViewModel({ clientId: selectedClient });
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'simulador' | 'amortizacao' | 'pagamentos'>('dashboard');

  const [inputs, setInputs] = useState({
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

  const clientName = (clients || []).find((c: any) => c.id === selectedClient)?.fantasia || 'Selecionado';

  if (!selectedClient) {
    return (
      <ExecutivePageTemplate header={{ title: "Gestão de Passivos", description: "Selecione uma empresa para visualizar os contratos." }}>
        <ExecutiveSurface padding="xl" radius="xl" className="text-center py-20 bg-card border border-border">
          <Boxes size={48} className="mx-auto mb-4 text-primary" />
          <ExecutiveHeading as="h3" className="text-foreground mb-2">Selecione uma Empresa</ExecutiveHeading>
          <ExecutiveText variant="bodyStandard" className="text-muted-foreground max-w-md mx-auto">
            Por favor, selecione uma empresa no seletor de cliente ativo no topo da tela para gerenciar passivos bancários e dividas.
          </ExecutiveText>
        </ExecutiveSurface>
      </ExecutivePageTemplate>
    );
  }

  return (
    <ExecutivePageTemplate header={{
      title: "Gestão de Passivos & Financiamentos",
      description: `Contratos de dívida bancária, cronogramas de amortização e custo efetivo total · ${clientName}`,
    }}>
      <div className="space-y-8 pb-24 animate-executive-fade max-w-[1440px] mx-auto">

        {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE PASSIVOS & DÍVIDA BANCÁRIA) --- */}
        <ExecutiveSummarySection 
          className="mb-8"
          status={{ label: 'Passivos Monitorados', variant: 'success' }}
          question="Qual o montante da dívida bancária total, custo médio ponderado e cronograma de amortização?"
          opinion="O comitê fiduciário homologa a estrutura de endividamento, validando o nível de alavancagem financeira e o perfil de vencimentos da dívida."
          driver="Saldo devedor total, taxa média ponderada de juros, cronograma de amortização SAC vs PRICE e garantias."
          implication="Manutenção de estrutura de capital saudável e mitigação de risco de refinanciamento de curto prazo."
          executiveQuestion="Priorizar o pré-pagamento de linhas com custo mais elevado e estender o prazo médio de vencimento."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>

        {/* --- CAMADA 2: DIRETORIA & DASHBOARD DE DÍVIDAS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ExecutiveMetricCard
            label="Saldo Devedor Consolidado"
            value={formatCurrency(inputs.valorEmprestimo)}
            statusBadge={<ExecutiveBadge variant="info">Dívida Bruta</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="Taxa de Juros Mensal"
            value={`${(inputs.taxaMensal * 100).toFixed(2)}% a.m.`}
            statusBadge={<ExecutiveBadge variant="warning">Custo Efetivo</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="Prazo Remanescente"
            value={`${inputs.periodoMeses} meses`}
            statusBadge={<ExecutiveBadge variant="neutral">Perfil</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />
        </div>

        {/* --- CAMADA 3: CAMADA TÉCNICA E CRONOGRAMA DE AMORTIZAÇÃO --- */}
        <ExecutiveTechnicalLayer
          title="Camada Técnica — Cronograma de Amortização"
          subtitle="Tabela Comparativa PRICE vs SAC e Projeções de Saldo Devedor"
          description="Evolução do saldo devedor, juros apropriados e parcelas mensais de amortização."
          className="mb-8"
        >
          <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <ExecutiveHeading as="h4" className="text-foreground">Detalhamento dos Contratos</ExecutiveHeading>
              <ExecutiveBadge variant="success">Modelo PRICE Ativo</ExecutiveBadge>
            </div>
            <ExecutiveText variant="bodyStandard" className="text-muted-foreground">
              Os dados de parcelas e amortização são calculados em tempo real com base no método de amortização francês (PRICE) e constante (SAC).
            </ExecutiveText>
          </ExecutiveSurface>
        </ExecutiveTechnicalLayer>

      </div>
    </ExecutivePageTemplate>
  );
}
