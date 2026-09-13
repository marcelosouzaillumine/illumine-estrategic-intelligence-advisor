import React, { useMemo } from 'react';
import { Loader2, FileArchive } from 'lucide-react';
import { useBoardPackDataLoader } from '../../../../components/pages/governance/BoardPackDataLoader';
import { SovereignBoardPackPage } from '../../../../components/pages/governance/SovereignBoardPackPage';
import { FiduciaryRuntimeAdapter } from '../../../../services/FiduciaryRuntimeAdapter';
import { ExecutivePageTemplate } from '../../../../components/ui/executive-page-template';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveAccordion } from '../../../../components/ui/executive-accordion';
import { ExecutiveEmptyState } from '../../../../components/ui/executive-empty-state';
import { ExecutiveHeading } from '../../../../components/ui/executive-heading';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { ExecutiveBadge } from '../../../../components/ui/executive-badge';
import { ExecutiveMetricCard } from '../../../../components/ui/executive-metric-card';
import { ExecutiveSummarySection } from '../../../../components/ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../../../../components/ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../../../../components/ui/executive-decision-trace';
import { ExecutiveTechnicalLayer } from '../../../../components/ui/executive-technical-layer';
import { useInstitutionalBoardPackPageViewModel } from '../../../../viewmodels/useInstitutionalBoardPackPageViewModel';

interface InstitutionalBoardPackPageProps {
  clients?: any[];
  selectedClient?: string;
  selectedMonth?: number;
  selectedYear?: number;
}

export function InstitutionalBoardPackPage({ clients, selectedClient, selectedMonth, selectedYear }: InstitutionalBoardPackPageProps) {
  const { state: vmState, computed: vmComputed, actions: vmActions } = useInstitutionalBoardPackPageViewModel({ clientId: selectedClient });
  const filterYear = selectedYear || new Date().getFullYear();
  const { payload, loading } = useBoardPackDataLoader(selectedClient || '', filterYear, clients);

  const result = useMemo(() => {
    if (loading) return null;
    try {
      if (payload && !payload.isMockData) {
        const boardPack = FiduciaryRuntimeAdapter.generateBoardPack(payload);
        return { boardPack, dataMode: 'REAL' as const };
      }
      return { boardPack: null, dataMode: 'MOCK' as const };
    } catch (error) {
      console.error('[InstitutionalBoardPackPage] Compilation error:', error);
      return { boardPack: null, dataMode: 'ERROR' as const };
    }
  }, [payload, loading]);

  return (
    <ExecutivePageTemplate header={{
      title: "Board Pack de Governança Institucional",
      description: "Compilação executiva oficial para reuniões de Conselho de Administração.",
    }}>
      <div className="space-y-8 pb-24 animate-executive-fade max-w-[1440px] mx-auto">

        {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE BOARD PACK) --- */}
        <ExecutiveSummarySection 
          className="mb-8"
          status={{ label: 'Board Pack Compilado', variant: 'success' }}
          question="Qual a síntese fiduciária consolidada a ser apresentada aos conselheiros e acionistas?"
          opinion="O comitê fiduciário homologa o Board Pack oficial, atestando a exatidão das demonstrações contábeis e dos indicadores estratégicos de governança."
          driver="Parecer de auditabilidade, síntese de DRE/BP, score de sustentabilidade e recomendações do CFO."
          implication="Suporte a decisões fiduciárias seguras e transparência na prestação de contas."
          executiveQuestion="Pautar os pontos de atenção destacados no parecer para deliberação do conselho."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>

        {/* --- CAMADA 2: DIRETORIA & KPIS SINTÉTICOS DO BOARD PACK --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ExecutiveMetricCard
            label="Status de Compilação"
            value="Concluído / Auditado"
            statusBadge={<ExecutiveBadge variant="success">Fiduciário</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="Versão do Relatório"
            value="1.0 Final"
            statusBadge={<ExecutiveBadge variant="info">Assinado Digitalmente</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="Modo de Dados"
            value={result?.dataMode === 'REAL' ? 'Base Real Sincronizada' : 'Ambiente Sandbox'}
            statusBadge={<ExecutiveBadge variant={result?.dataMode === 'REAL' ? 'success' : 'warning'}>{result?.dataMode === 'REAL' ? 'Oficial' : 'Simulação'}</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />
        </div>

        {/* --- CAMADA 3: CAMADA TÉCNICA E DOCUMENTAÇÃO SOCIETÁRIA --- */}
        <ExecutiveTechnicalLayer
          title="Camada Técnica de Documentação do Board Pack"
          subtitle="Apresentação Executiva e Parecer Fiduciário"
          description="Compilação formal para distribuição e arquivo fiduciário do conselho."
          className="mb-8"
        >
          <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm">
            {result?.boardPack ? (
              <SovereignBoardPackPage boardPack={result.boardPack} dataMode={result.dataMode} />
            ) : (
              <ExecutiveText variant="bodyStandard" className="text-muted-foreground">
                Aguardando compilação do pacote fiduciário.
              </ExecutiveText>
            )}
          </ExecutiveSurface>
        </ExecutiveTechnicalLayer>

      </div>
    </ExecutivePageTemplate>
  );
}
