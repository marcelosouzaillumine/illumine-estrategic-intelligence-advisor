import React from 'react';
import { useExecutiveInteraction } from '../../context/executive-interaction/ExecutiveInteractionProvider';
import { Layers, CheckCircle2, AlertOctagon } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const EvidenceCoveragePanel: React.FC = () => {
  const { t } = useLanguage();
  const { confidenceDisclosure } = useExecutiveInteraction();
  const { evidenceCoverage } = confidenceDisclosure;

  const categories = [
    { name: 'Dados Contábeis (Balanço, DRE, DFC)', weight: 0.4, status: 'fully_validated' },
    { name: 'Cadeia Fiduciária e Alçadas', weight: 0.3, status: 'fully_validated' },
    { name: 'Histórico Causal de 36 Meses', weight: 0.2, status: evidenceCoverage >= 0.9 ? 'fully_validated' : 'partial' },
    { name: 'Mitigações e Exposição de Riscos', weight: 0.1, status: evidenceCoverage >= 0.8 ? 'fully_validated' : 'partial' }
  ];

  return (
    <div className="card-premium p-8 space-y-6">
      <div>
        <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" />
          Mapeamento de Cobertura de Evidências
        </h4>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          Detalhamento do peso estatístico de cada pilar de análise fiduciária.
        </p>
      </div>

      <div className="space-y-4">
        {categories.map((cat, idx) => {
          const isComplete = cat.status === 'fully_validated';
          return (
            <div key={idx} className="p-4 bg-slate-950/40 border border-border/10 rounded-xl flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{cat.name}</p>
                <p className="text-[10px] text-muted-foreground">{t("overlays.score_weight")} {(cat.weight * 100).toFixed(0)}%</p>
              </div>
              <div>
                {isComplete ? (
                  <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 100% Validado
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-amber-400">
                    <AlertOctagon className="w-3.5 h-3.5" /> Parcial
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
