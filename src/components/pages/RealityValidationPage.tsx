import React, { useEffect, useState } from 'react';
import { Radar } from 'lucide-react';
import { GoldenDatasetRegistry } from '../../core/runtime/reality-validation/GoldenDatasetRegistry';
import { GoldenDatasetIsolationEngine } from '../../core/runtime/reality-validation/GoldenDatasetIsolationEngine';
import { GoldenDatasetProfile } from '../../core/runtime/reality-validation/RealityValidationTypes';
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
    return <div className="p-8 text-muted-foreground">Carregando Reality Validation Center...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in bg-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Radar className="text-primary" />
            Reality Validation Center
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Validação operacional enterprise com Golden Datasets isolados. Sandbox in-memory. Produção intocada.
          </p>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <div className="font-bold text-foreground">{datasets.length} Golden Datasets</div>
          <div>Sandbox: {TENANT_ID}</div>
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
