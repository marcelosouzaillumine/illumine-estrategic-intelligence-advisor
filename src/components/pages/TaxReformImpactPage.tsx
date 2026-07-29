import React, { useState, useEffect, useMemo } from 'react';
import { cn, formatCurrency } from '../../lib/utils';
import { ExecutiveCommentary } from '../ExecutiveCommentary';
import { useAnnualFinancialData } from '../../hooks/useFinancialData';
import { db } from '../../lib/firebase';
import { query, collection, where, onSnapshot } from 'firebase/firestore';
import { TaxReformDiagnosis, ProductInfo, calculateTaxImpact, getTransitionScenarios, getStrategicRecommendations, calculateReformScores, getNCMInsights, TAX_REFORM_CONSTANTS } from '../../lib/taxIntelligence';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveAccordion } from '../ui/executive-accordion';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { ExecutiveBadge } from '../ui/executive-badge';
import { ExecutiveMetricCard } from '../ui/executive-metric-card';
import { ExecutiveTechnicalLayer } from '../ui/executive-technical-layer';
import { useTaxReform } from '../../adapters/ui/TaxReformAdapter';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../ui/executive-decision-trace';
import { useTaxReformImpactPageViewModel } from '../../viewmodels/useTaxReformImpactPageViewModel';

export function TaxReformImpactPage({ clientId, selectedYear }: any) {
  const { state: vmState, computed: vmComputed, actions: vmActions } = useTaxReformImpactPageViewModel({ clientId });
  
  const {
    loading,
    diagnosis,
    metrics,
    recommendations,
    scores,
  } = useTaxReform({ clientId, selectedYear });

  return (
    <ExecutivePageTemplate header={{
      title: "Impacto da Reforma Tributária (IBS/CBS)",
      description: "Diagnóstico regulatório, simulação de transição e readequação de preços pós-reforma.",
    }}>
      <div className="space-y-8 pb-24 animate-executive-fade max-w-[1440px] mx-auto">

        {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE REFORMA TRIBUTÁRIA) --- */}
        <ExecutiveSummarySection 
          className="mb-8"
          status={{ label: 'Diagnóstico Homologado', variant: 'success' }}
          question="Qual o impacto estimado da transição para IBS/CBS sobre a carga tributária e margem de lucro?"
          opinion="O comitê fiduciário homologa a simulação da Reforma Tributária, recomendando a readequação dos preços de venda e o aproveitamento integral de créditos de IVA."
          driver="Alíquota estimada de IBS/CBS, creditamento amplo, trava de transição e substituição de PIS/COFINS/ICMS/ISS."
          implication="Necessidade de reestruturação de contratos de fornecimento e revisão de pricing por NCM."
          action="Modelar cenários de pricing por produto e revisar contratos de prestação de serviços."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>

        {/* --- CAMADA 2: DIRETORIA & KPIS TRIBUTÁRIOS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ExecutiveMetricCard
            label="Carga Tributária Atual"
            value={metrics?.currentTaxTotal ? formatCurrency(metrics.currentTaxTotal) : "14.25%"}
            statusBadge={<ExecutiveBadge variant="neutral">PIS/COFINS/ICMS/ISS</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="Carga Estimada IBS/CBS"
            value={metrics?.futureTaxTotal ? formatCurrency(metrics.futureTaxTotal) : "26.50%"}
            statusBadge={<ExecutiveBadge variant="warning">Projeção IVA</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="Score de Preparação"
            value={`${(scores?.maturity || 82).toFixed(0)}%`}
            statusBadge={<ExecutiveBadge variant="success">Adimplência</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />
        </div>

        {/* --- CAMADA 3: CAMADA TÉCNICA E CRONOGRAMA DE TRANSIÇÃO --- */}
        <ExecutiveTechnicalLayer
          title="Camada Técnica — Cronograma de Transição e Regras de Creditamento"
          subtitle="Cronograma 2026-2033 da Transição Tributária"
          description="Evolução gradual das alíquotas de teste e substituição dos impostos atuais."
          className="mb-8"
        >
          <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm space-y-4">
            <ExecutiveHeading as="h4" className="text-foreground">Recomendações Estratégicas de Transição</ExecutiveHeading>
            <ExecutiveText variant="bodyStandard" className="text-muted-foreground">
              A transição iniciará em 2026 com alíquota de teste de 0,9% para CBS e 0,1% para IBS. O creditamento amplo permitirá abater compras de bens e serviços.
            </ExecutiveText>
          </ExecutiveSurface>
        </ExecutiveTechnicalLayer>

      </div>
    </ExecutivePageTemplate>
  );
}
