import React, { useState, useEffect } from 'react';
import { ChartNoAxesCombined, AlertOctagon, ShieldAlert } from 'lucide-react';
import { PageHeader } from '../Common';
import { cn } from '../../lib/utils';
import { InstitutionalBenchmarkEngine } from '../../services/FiduciaryRuntimeAdapter';
import { BenchmarkExecutionRecord } from '../../services/FiduciaryRuntimeAdapter';
import { PrivacyProtectionBadge } from '../benchmarking/PrivacyProtectionBadge';
import { BenchmarkComparisonChart } from '../benchmarking/BenchmarkComparisonChart';
import { ConfidenceBenchmarkPanel } from '../benchmarking/ConfidenceBenchmarkPanel';
import { SectorRiskPatternPanel } from '../benchmarking/SectorRiskPatternPanel';

const SECTORS = [
  { id: 'VAREJO', label: 'Varejo', tag: 'Seguro' },
  { id: 'AEROSPACE', label: 'Aerospace', tag: 'Bloqueado' },
];

export function InstitutionalBenchmarkingPage() {
  const [execution, setExecution] = useState<BenchmarkExecutionRecord | null>(null);
  const [sector, setSector] = useState('VAREJO');

  useEffect(() => {
    const result = InstitutionalBenchmarkEngine.runComparativeAnalysis(sector, 'TIER_3_100M_500M');
    setExecution(result);
  }, [sector]);

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12 pb-32 animate-executive-fade">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <PageHeader
          title="Benchmarking Institucional"
          subtitle="Rede de Inteligência Comparativa. Outputs fiduciários estritamente anonimizados."
          icon={ChartNoAxesCombined}
          transparent
        />
        <PrivacyProtectionBadge />
      </div>

      {/* Sector Selector */}
      <div className="flex items-center gap-2">
        {SECTORS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSector(s.id)}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] rounded-button border transition-all',
              sector === s.id
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-surface-container border-border text-muted-foreground hover:text-foreground hover:bg-surface-container-high'
            )}
          >
            Setor: {s.label}
            <span className={cn(
              'px-1.5 py-0.5 rounded text-[8px] font-black',
              sector === s.id ? 'bg-white/20' : 'bg-surface-container-high'
            )}>
              {s.tag}
            </span>
          </button>
        ))}
      </div>

      {execution?.status === 'BLOCKED_BY_PRIVACY' ? (
        <div className="card-premium p-12 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-20 h-20 rounded-xl bg-critical-soft flex items-center justify-center text-destructive">
            <AlertOctagon size={40} />
          </div>
          <div>
            <h2 className="text-h3 font-medium text-destructive uppercase tracking-widest mb-3">Privacy Blocked</h2>
            <p className="text-body-sm text-muted-foreground max-w-md leading-relaxed font-medium">
              A amostra de dados institucionais solicitada não possui o tamanho mínimo exigido (k-anonymity) para garantir o anonimato estatístico.
            </p>
          </div>
          <div className="text-[10px] font-mono bg-surface-container px-4 py-2 rounded-md text-muted-foreground border border-border">
            Cohort: {execution.cohortSignature}
          </div>
        </div>
      ) : execution?.anonymizedComparison ? (
        <div className="space-y-8">
          <section className="space-y-4">
            <h3 className="text-h3 font-medium text-foreground tracking-tight">Distribuição de Confiança na Rede</h3>
            <ConfidenceBenchmarkPanel distribution={execution.anonymizedComparison.confidenceDistribution} />
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="card-premium p-8 space-y-4">
              <h3 className="text-h3 font-medium text-foreground tracking-tight">Padrões de Risco Setorial ({sector})</h3>
              <SectorRiskPatternPanel sector={sector} />
            </section>
            
            <section className="card-premium p-8 space-y-4">
              <h3 className="text-h3 font-medium text-foreground tracking-tight">Métricas Operacionais</h3>
              <BenchmarkComparisonChart metrics={execution.anonymizedComparison.metrics} />
            </section>
          </div>
        </div>
      ) : null}
    </div>
  );
}
