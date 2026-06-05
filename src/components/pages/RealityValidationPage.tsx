import React, { useEffect, useState } from 'react';
import { Radar, Loader2, Database } from 'lucide-react';
import { PageHeader } from '../Common';
import { GoldenDatasetRegistry } from '../../services/FiduciaryRuntimeAdapter';
import { GoldenDatasetIsolationEngine } from '../../services/FiduciaryRuntimeAdapter';
import { GoldenDatasetProfile } from '../../services/FiduciaryRuntimeAdapter';
import { GoldenDatasetExplorer } from '../reality-validation/GoldenDatasetExplorer';
import { OperationalStressDashboard } from '../reality-validation/OperationalStressDashboard';
import { InstitutionalComplexityViewer } from '../reality-validation/InstitutionalComplexityViewer';
import { ExecutiveUXHeatmap } from '../reality-validation/ExecutiveUXHeatmap';
import { OperationalScalePanel } from '../reality-validation/OperationalScalePanel';
import { CrossTenantStressViewer } from '../reality-validation/CrossTenantStressViewer';
import { RuntimeStabilityPanel } from '../reality-validation/RuntimeStabilityPanel';
import { RealityValidationTimeline } from '../reality-validation/RealityValidationTimeline';

const TENANT_ID = 'TENANT-REALITY-VALIDATION';

export function RealityValidationPage() {
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
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12 pb-32 animate-executive-fade">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <PageHeader
          title="Reality Validation Center"
          subtitle="Validação operacional enterprise com Golden Datasets isolados. Sandbox in-memory. Produção intocada."
          icon={Radar}
          transparent
        />
        <div className="flex items-center gap-2 px-4 py-2 bg-surface-container border border-border rounded-md shrink-0">
          <Database size={14} className="text-muted-foreground" />
          <span className="text-[10px] font-bold text-foreground uppercase tracking-widest">{datasets.length} Golden Datasets</span>
          <span className="text-[10px] text-muted-foreground font-mono ml-2">{TENANT_ID}</span>
        </div>
      </div>

      {/* Main Layout */}
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
      </div>
    </div>
  );
}
