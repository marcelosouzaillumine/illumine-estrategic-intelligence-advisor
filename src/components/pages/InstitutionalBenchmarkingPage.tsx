import React, { useState, useEffect } from 'react';
import { ChartNoAxesCombined, AlertOctagon } from 'lucide-react';
import { InstitutionalBenchmarkEngine } from '../../core/runtime/benchmarking/InstitutionalBenchmarkEngine';
import { BenchmarkExecutionRecord } from '../../core/runtime/benchmarking/BenchmarkTypes';
import { PrivacyProtectionBadge } from '../benchmarking/PrivacyProtectionBadge';
import { BenchmarkComparisonChart } from '../benchmarking/BenchmarkComparisonChart';
import { ConfidenceBenchmarkPanel } from '../benchmarking/ConfidenceBenchmarkPanel';
import { SectorRiskPatternPanel } from '../benchmarking/SectorRiskPatternPanel';

export function InstitutionalBenchmarkingPage() {
  const [execution, setExecution] = useState<BenchmarkExecutionRecord | null>(null);
  const [sector, setSector] = useState('VAREJO');

  useEffect(() => {
    // Roda ao carregar e quando o setor muda
    const result = InstitutionalBenchmarkEngine.runComparativeAnalysis(sector, 'TIER_3_100M_500M');
    setExecution(result);
  }, [sector]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in bg-background min-h-screen">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <ChartNoAxesCombined className="text-primary" />
            Benchmarking Institucional
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Rede de Inteligência Comparativa. Outputs fiduciários estritamente anonimizados.
          </p>
        </div>
        <PrivacyProtectionBadge />
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => setSector('VAREJO')}
          className={`px-4 py-2 text-sm font-medium rounded border ${sector === 'VAREJO' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-surface-container border-border text-foreground hover:bg-surface-container/80'}`}
        >
          Setor: Varejo (Seguro)
        </button>
        <button 
          onClick={() => setSector('AEROSPACE')}
          className={`px-4 py-2 text-sm font-medium rounded border ${sector === 'AEROSPACE' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-surface-container border-border text-foreground hover:bg-surface-container/80'}`}
        >
          Setor: Aerospace (Bloqueado)
        </button>
      </div>

      {execution?.status === 'BLOCKED_BY_PRIVACY' ? (
        <div className="p-8 mt-8 border border-rose-500/20 bg-rose-500/5 rounded-lg flex flex-col items-center justify-center text-center">
          <AlertOctagon className="text-rose-500 mb-4" size={48} />
          <h2 className="text-lg font-semibold text-rose-500 uppercase tracking-widest mb-2">Privacy Blocked</h2>
          <p className="text-sm text-foreground max-w-md">
            A amostra de dados institucionais solicitada não possui o tamanho mínimo exigido (k-anonymity) para garantir o anonimato estatístico.
          </p>
          <div className="mt-4 text-xs font-mono bg-background p-2 rounded text-muted-foreground border border-border">
            Cohort: {execution.cohortSignature}
          </div>
        </div>
      ) : execution?.anonymizedComparison ? (
        <div className="space-y-6">
          <section className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Distribuição de Confiança na Rede</h3>
            <ConfidenceBenchmarkPanel distribution={execution.anonymizedComparison.confidenceDistribution} />
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="space-y-4 p-6 bg-surface-container rounded-lg border border-border">
              <h3 className="text-sm font-medium text-foreground">Padrões de Risco Setorial ({sector})</h3>
              <SectorRiskPatternPanel sector={sector} />
            </section>
            
            <section className="space-y-4 p-6 bg-surface-container rounded-lg border border-border">
              <h3 className="text-sm font-medium text-foreground">Métricas Operacionais</h3>
              <BenchmarkComparisonChart metrics={execution.anonymizedComparison.metrics} />
            </section>
          </div>
        </div>
      ) : null}

    </div>
  );
}
