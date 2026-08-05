import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useIndicatorsAdapter } from '../../adapters/ui/useIndicatorsAdapter';
import { BarChart3, TrendingUp, ShieldCheck, Target, Activity, Zap, FileText, FileDown, MessageSquarePlus, Layout, CheckCircle2, ShieldAlert, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { formatCurrency, cn, formatValue } from '../../lib/utils';
import { useModuleData } from '../../hooks/useModuleData';
import { useRealIndicatorData } from '../../hooks/useRealIndicatorData';
import { useAllFinancialData } from '../../hooks/useFinancialData';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { evaluateFinancialRules } from '../../lib/governanceIntelligence';
import { GovernanceInsightPanel } from '../GovernanceInsightPanel';
import { PageHeader, StatusBadge } from '../Common';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveAccordion } from '../ui/executive-accordion';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';
import { ExecutiveMetricCard } from '../ui/executive-metric-card';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { ExecutiveBadge } from '../ui/executive-badge';
import { ExecutiveTechnicalLayer } from '../ui/executive-technical-layer';
import { Button } from '../ui/button';
import { RelatorioDemonstracoes5Anos } from './RelatorioDemonstracoes5Anos';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../ui/executive-decision-trace';
import { useRelatorioExecutivoPageViewModel } from '../../viewmodels/useRelatorioExecutivoPageViewModel';
import { ObjetivoOKR as OKR, DiagnosticoItem as Diagnostico, Diretriz as Diretrizes } from '../../types/modules';

interface RelatorioExecutivoPageProps {
  clientId: string;
  selectedMonth: number;
  selectedYear: number;
}

export function RelatorioExecutivoPage({ clientId, selectedMonth, selectedYear }: RelatorioExecutivoPageProps) {
  const { state: vmState, computed: vmComputed, actions: vmActions } = useRelatorioExecutivoPageViewModel({ clientId });
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportType, setReportType] = useState<string>('full');

  const { kpis } = useRealIndicatorData(clientId, selectedMonth, selectedYear);

  return (
    <ExecutivePageTemplate header={{
      title: "Relatório Executivo Estratégico",
      description: "Consolidação mensal de performance, parecer fiduciário e síntese para o Conselho.",
    }}>
      <div className="space-y-8 pb-24 animate-executive-fade max-w-[1440px] mx-auto">

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <select 
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="bg-card border border-border rounded-xl px-4 py-2.5 text-xs font-semibold outline-none text-foreground"
          >
            <option value="full">Relatório Executivo Completo</option>
            <option value="governance">Foco em Governança</option>
            <option value="financial">Foco em Finanças</option>
            <option value="demonstracoes-5-anos">Demonstrações 5 Anos</option>
          </select>
        </div>

        {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE RELATÓRIO EXECUTIVO) --- */}
        <ExecutiveSummarySection 
          className="mb-8"
          status={{ label: 'Relatório Homologado', variant: 'success' }}
          question="Qual a síntese consolidada dos resultados, governança e roadmap do ciclo?"
          opinion="O comitê fiduciário homologa o Relatório Executivo do ciclo, atestando a exatidão das demonstrações contábeis e dos indicadores estratégicos."
          driver="Evolução da receita, margem EBITDA, liquidez e atingimento de metas operacionais."
          implication="Garantia de reporte executivo preciso para o Conselho e acionistas."
          executiveQuestion="Apresentar as recomendações fiduciárias na próxima reunião ordinária de conselho."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>

        {/* --- CAMADA 2: DIRETORIA & KPIS SINTÉTICOS --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <ExecutiveMetricCard
            label="Receita Líquida"
            value={formatCurrency(kpis?.revenue || 0)}
            statusBadge={<ExecutiveBadge variant="info">Faturamento</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="EBITDA"
            value={formatCurrency(kpis?.ebitda || 0)}
            statusBadge={<ExecutiveBadge variant={(kpis?.ebitda || 0) >= 0 ? "success" : "critical"}>Operacional</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="Saldo em Caixa"
            value={formatCurrency(kpis?.saldoCaixa || 0)}
            statusBadge={<ExecutiveBadge variant="success">Liquidez</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="Passivo Total"
            value={formatCurrency(kpis?.totalLiabilities || 0)}
            statusBadge={<ExecutiveBadge variant="warning">Obrigações</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />
        </div>

        {/* --- CAMADA 3: CAMADA TÉCNICA E DEMONSTRAÇÕES COMPONENTIZADAS --- */}
        <ExecutiveTechnicalLayer
          title="Camada Técnica de Demonstrações Executivas"
          subtitle="Compilação de Demonstrações Contábeis e Parecer de Auditabilidade"
          description="Relatórios detalhados com carimbo fiduciário e lineage-certified trace."
          className="mb-8"
        >
          <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm">
            {reportType === 'demonstracoes-5-anos' ? (
              <RelatorioDemonstracoes5Anos clientId={clientId} selectedYear={selectedYear} />
            ) : (
              <div className="space-y-4">
                <ExecutiveHeading as="h4" className="text-foreground">Parecer Fiduciário de Encerramento do Ciclo</ExecutiveHeading>
                <ExecutiveText variant="bodyStandard" className="text-muted-foreground leading-relaxed">
                  As demonstrações financeiras foram auditadas e consolidadas sob o princípio fiduciário da transparência máxima. Todas as métricas foram extraídas das bases originais sem truncamento.
                </ExecutiveText>
              </div>
            )}
          </ExecutiveSurface>
        </ExecutiveTechnicalLayer>

      </div>
    </ExecutivePageTemplate>
  );
}
