import React, { useState, useEffect } from 'react';
import { ChartNoAxesCombined, AlertOctagon, ShieldAlert } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../../../components/Common';
import { cn } from '../../../../lib/utils';
import { InstitutionalBenchmarkEngine } from '../../../../services/FiduciaryRuntimeAdapter';
import { BenchmarkExecutionRecord } from '../../../../services/FiduciaryRuntimeAdapter';
import { PrivacyProtectionBadge } from '../../../../components/benchmarking/PrivacyProtectionBadge';
import { BenchmarkComparisonChart } from '../../../../components/benchmarking/BenchmarkComparisonChart';
import { ConfidenceBenchmarkPanel } from '../../../../components/benchmarking/ConfidenceBenchmarkPanel';
import { SectorRiskPatternPanel } from '../../../../components/benchmarking/SectorRiskPatternPanel';
import { ExecutivePageTemplate } from '../../../../components/ui/executive-page-template';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveAccordion } from '../../../../components/ui/executive-accordion';
import { ExecutiveEmptyState } from '../../../../components/ui/executive-empty-state';
import { ExecutiveHeading } from '../../../../components/ui/executive-heading';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { ExecutiveBadge } from '../../../../components/ui/executive-badge';
import { ExecutiveSummarySection } from '../../../../components/ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../../../../components/ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../../../../components/ui/executive-decision-trace';
import { ExecutiveTechnicalLayer } from '../../../../components/ui/executive-technical-layer';
import { useInstitutionalBenchmarkingPageViewModel } from '../../../../viewmodels/useInstitutionalBenchmarkingPageViewModel';

const SECTORS = [
  { id: 'VAREJO', label: 'Varejo', tag: 'Seguro' },
  { id: 'AEROSPACE', label: 'Aerospace', tag: 'Bloqueado' },
];

export function InstitutionalBenchmarkingPage() {
  const { state: vmState, computed: vmComputed, actions: vmActions } = useInstitutionalBenchmarkingPageViewModel({ clientId: '' });
  const [execution, setExecution] = useState<BenchmarkExecutionRecord | null>(null);
  const [sector, setSector] = useState('VAREJO');

  useEffect(() => {
    const result = InstitutionalBenchmarkEngine.runComparativeAnalysis(sector, 'TIER_3_100M_500M');
    setExecution(result);
  }, [sector]);

  return (
    <ExecutivePageTemplate header={{
      title: "Benchmarking Institucional Setorial",
      description: "Rede de Inteligência Comparativa. Outputs fiduciários estritamente anonimizados via K-Anonymity.",
    }}>
      <div className="space-y-8 pb-24 animate-executive-fade max-w-[1440px] mx-auto">

        {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE BENCHMARKING SETORIAL) --- */}
        <ExecutiveSummarySection 
          className="mb-8"
          status={{ label: 'Métricas Comparadas', variant: 'success' }}
          question="Como a performance da empresa se posiciona frente aos concorrentes do mesmo segmento (peers)?"
          opinion="O comitê fiduciário homologa a análise comparativa setorial, validando a posição competitiva e a garantia de privacidade K-Anonymity."
          driver="Percentil setorial de margem EBITDA, giro de ativos, prazo médio de estoque e rating de liquidez."
          implication="Identificação clara de gargalos operacionais e oportunidades de otimização frente aos melhores do setor."
          executiveQuestion="Definir plano de ação para alinhar as métricas de capital de giro aos benchmarks da faixa de topo."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>

        {/* --- CAMADA 2: DIRETORIA & SELETOR DE SETOR E PAINEL COMPARATIVO --- */}
        <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm mb-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <ExecutiveHeading as="h3" className="text-foreground">Painel Comparativo de pares (Peers)</ExecutiveHeading>
              <ExecutiveText variant="caption" className="text-muted-foreground">Selecione o setor para visualizar as estatísticas anonimizadas.</ExecutiveText>
            </div>
            <PrivacyProtectionBadge />
          </div>

          <div className="flex items-center gap-3">
            {SECTORS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSector(s.id)}
                className={cn(
                  "px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all flex items-center gap-2",
                  sector === s.id
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-surface-container/30 border-border text-muted-foreground hover:bg-surface-container"
                )}
              >
                Setor: {s.label}
                <ExecutiveBadge variant={sector === s.id ? "info" : "neutral"}>
                  {s.tag}
                </ExecutiveBadge>
              </button>
            ))}
          </div>

          {execution?.anonymizedComparison && (
            <div className="space-y-6 pt-4">
              <ConfidenceBenchmarkPanel distribution={execution.anonymizedComparison.confidenceDistribution} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-surface-container/30 border border-border rounded-2xl">
                  <ExecutiveHeading as="h4" className="text-foreground mb-4">Padrões de Risco Setorial ({sector})</ExecutiveHeading>
                  <SectorRiskPatternPanel sector={sector} />
                </div>

                <div className="p-6 bg-surface-container/30 border border-border rounded-2xl">
                  <ExecutiveHeading as="h4" className="text-foreground mb-4">Métricas Operacionais Comparadas</ExecutiveHeading>
                  <BenchmarkComparisonChart metrics={execution.anonymizedComparison.metrics} />
                </div>
              </div>
            </div>
          )}
        </ExecutiveSurface>

        {/* --- CAMADA 3: CAMADA TÉCNICA E PRIVACIDADE DE DADOS --- */}
        <ExecutiveTechnicalLayer
          title="Camada Técnica — Algoritmo K-Anonymity"
          subtitle="Isolamento de Privacidade Criptográfica"
          description="Garantia estatística de impossibilidade de reidentificação de dados individuais."
          className="mb-8"
        >
          <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm">
            <ExecutiveHeading as="h4" className="text-foreground mb-2">Protocolo de Privacidade Fiduciária</ExecutiveHeading>
            <ExecutiveText variant="bodyStandard" className="text-muted-foreground">
              Apenas coortes com no mínimo N organizações são liberadas para exibição comparativa.
            </ExecutiveText>
          </ExecutiveSurface>
        </ExecutiveTechnicalLayer>

      </div>
    </ExecutivePageTemplate>
  );
}
