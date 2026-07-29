

import React, { useEffect, useState } from 'react';
import { Radar, Loader2, Database } from 'lucide-react';
import { PageHeader, StatusBadge } from '../Common';
import { GoldenDatasetRegistry } from '../../services/FiduciaryRuntimeAdapter';
import { GoldenDatasetIsolationEngine } from '../../services/FiduciaryRuntimeAdapter';
import { GoldenDatasetProfile } from '../../services/FiduciaryRuntimeAdapter';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveAccordion } from '../ui/executive-accordion';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { GoldenDatasetExplorer } from '../reality-validation/GoldenDatasetExplorer';
import { OperationalStressDashboard } from '../reality-validation/OperationalStressDashboard';
import { InstitutionalComplexityViewer } from '../reality-validation/InstitutionalComplexityViewer';
import { ExecutiveUXHeatmap } from '../reality-validation/ExecutiveUXHeatmap';
import { OperationalScalePanel } from '../reality-validation/OperationalScalePanel';
import { CrossTenantStressViewer } from '../reality-validation/CrossTenantStressViewer';
import { RuntimeStabilityPanel } from '../reality-validation/RuntimeStabilityPanel';
import { RealityValidationTimeline } from '../reality-validation/RealityValidationTimeline';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../ui/executive-decision-trace';
import { useRealityValidationPageViewModel } from '../../viewmodels/useRealityValidationPageViewModel';

const TENANT_ID = 'TENANT-REALITY-VALIDATION';

export function RealityValidationPage() {
  // Adapter: useRealityValidationPageAdapter
  // ViewModel: useRealityValidationPageViewModel
  const { state: vmState, computed: vmComputed, actions: vmActions } = useRealityValidationPageViewModel({ clientId: '' });
  const portal = createPortal;
  const [initialized, setInitialized] = useState(false);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(null);
  const [datasets, setDatasets] = useState<GoldenDatasetProfile[]>([]);

  useEffect(() => {
    GoldenDatasetIsolationEngine.clearSandbox(TENANT_ID);
    const all = GoldenDatasetRegistry.getAll();
    all.forEach(ds => GoldenDatasetIsolationEngine.loadDataset(TENANT_ID, ds));
    setDatasets(GoldenDatasetIsolationEngine.getDatasets(TENANT_ID));
    setSelectedDatasetId(all[0]?.datasetId ?? null);
    setInitialized(true);

    return () => {
      GoldenDatasetIsolationEngine.clearSandbox(TENANT_ID);
    };
  }, []);

  const selectedDataset = datasets.find(d => d.datasetId === selectedDatasetId) ?? null;

  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-[400px] gap-3 text-muted-foreground">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-body-sm font-medium uppercase tracking-widest">Carregando Reality Validation Center...</span>
      </div>
    );
  }

  return (
    <ExecutivePageTemplate header={{
      title: "Reality Validation Center",
      description: "Validação operacional enterprise com Golden Datasets isolados. Sandbox in-memory. Produção intocada.",
    }}>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">

        <div className="flex items-center gap-3">
          <StatusBadge status="Verde" label="Reality Isolation Active" />
        </div>
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest shrink-0">
          <Database size={14} className="text-emerald-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest">{datasets.length} Golden Datasets</span>
          <span className="text-[10px] text-muted-foreground font-mono ml-2">{TENANT_ID}</span>
        </div>
      
      </div>

      <div className="mt-12 mb-8 border-t border-border pt-8" />
      <ExecutiveAccordion
        title="Painel de Grounding e Validação"
        subtitle="Analise os testes de estresse fiduciários nos datasets controlados."
        variant="analytics"
        defaultExpanded
      >

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Dataset Explorer */}
        <div className="space-y-6">
          <GoldenDatasetExplorer
            datasets={datasets}
            selectedId={selectedDatasetId}
            onSelect={setSelectedDatasetId}
          />
          <ExecutiveUXHeatmap />
        </div>

        {/* Right: Detail Panels */}
        <div className="lg:col-span-2 space-y-6">
          {selectedDataset ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <OperationalStressDashboard tenantId={TENANT_ID} dataset={selectedDataset} />
                <InstitutionalComplexityViewer tenantId={TENANT_ID} dataset={selectedDataset} />
              </div>
              <RealityValidationTimeline dataset={selectedDataset} />
            </>
          ) : (
            <div className="flex items-center justify-center h-48 border border-dashed border-border/50 rounded-lg text-muted-foreground">
              Selecione um Golden Dataset para visualizar os detalhes.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <OperationalScalePanel tenantId={TENANT_ID} />
            <CrossTenantStressViewer tenantIds={datasets.map(d => d.datasetId)} />
            <RuntimeStabilityPanel tenantId={TENANT_ID} />
          </div>
        </div>
       <ExecutiveSummarySection 
         status={{ label: 'Ambiente Validado', variant: 'success' }}
         question="Como os Golden Datasets asseguram a fidelidade nos testes de estresse operacional?"
         opinion="O comitê fiduciário valida o sandbox in-memory, atestando a integridade das simulações de estresse."
         driver="Datasets isolados, métricas de estabilidade de runtime e testes cross-tenant."
         implication="Garantia de tolerância a falhas sem impacto nos dados de produção."
         action="Executar rotinas de estresse antes de qualquer promoção de release para produção."
       >
         <ExecutiveStrategicTensions tensions={[]} />
         <ExecutiveDecisionTrace trace={[]} />
       </ExecutiveSummarySection>
      </div>
      </ExecutiveAccordion>
    </ExecutivePageTemplate>
  );
}
