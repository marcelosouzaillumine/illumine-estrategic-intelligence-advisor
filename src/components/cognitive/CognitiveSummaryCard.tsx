import React from 'react';

interface CognitiveSummaryCardProps {
  title: string;
  summary: string;
  confidenceLevel: string;
  evidenceCount: number;
}

export const CognitiveSummaryCard: React.FC<CognitiveSummaryCardProps> = ({
  title,
  summary,
  confidenceLevel,
  evidenceCount
}) => {
  
  const getColorClasses = (level: string) => {
    switch(level) {
      case 'DETERMINISTIC': return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
      case 'HIGH': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
      case 'MODERATE': return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
      default: return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    }
  };

  return (
    <div className="p-8 mb-8 bg-surface-container/50 border border-border shadow-sm rounded-xl">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">
            Cognitive Query Engine Output
          </span>
          <h2 className="text-2xl font-bold text-primary mb-3">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {summary}
          </p>
        </div>
        <div className="w-full md:w-64 flex flex-col gap-4">
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">
              Nível de Confiança
            </span>
            <span className={`inline-block px-3 py-1 text-sm font-bold rounded-full border ${getColorClasses(confidenceLevel)}`}>
              {confidenceLevel}
            </span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">
              Sustentação Direta
            </span>
            <h4 className="text-lg font-medium text-foreground">
              {evidenceCount} Evidências Indexadas
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};
