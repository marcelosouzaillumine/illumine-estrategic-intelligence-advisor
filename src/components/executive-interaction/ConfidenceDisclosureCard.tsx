import React from 'react';
import { useExecutiveInteraction } from '../../context/executive-interaction/ExecutiveInteractionProvider';
import { BrainCircuit, ShieldCheck, ShieldAlert, Cpu, Layers } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const ConfidenceDisclosureCard: React.FC = () => {
  const { t } = useLanguage();
  const { confidenceDisclosure } = useExecutiveInteraction();

  const {
    confidenceScore,
    confidenceLabel,
    evidenceCoverage,
    lineageIntegrity,
    missingDependencies,
    runtimeMode
  } = confidenceDisclosure;

  return (
    <div className="card-premium p-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-insight" />
            Confiança da Análise Fiduciária
          </h4>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Metodologia baseada em suficiência de evidências e integridade operacional.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-1">{t("overlays.summary_score")}</div>
          <div className="text-3xl font-light text-primary flex items-center gap-1">
            {confidenceScore}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-border/10">
        {/* Pilar 1: Cobertura */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-muted-foreground" /> Cobertura de Evidências
            </span>
            <span className="font-bold">{(evidenceCoverage * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-border/5">
            <div 
              className="bg-primary h-full transition-all duration-500"
              style={{ width: `${evidenceCoverage * 100}%` }}
            />
          </div>
        </div>

        {/* Pilar 2: Lineage */}
        <div className="flex items-center justify-between p-3 bg-slate-950/40 border border-border/10 rounded-xl">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            Integridade
          </span>
          {lineageIntegrity ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Assinado
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-red-400">
              <ShieldAlert className="w-3.5 h-3.5" /> Quebrado
            </span>
          )}
        </div>

        {/* Pilar 3: Runtime Mode */}
        <div className="flex items-center justify-between p-3 bg-slate-950/40 border border-border/10 rounded-xl">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            Modo Runtime
          </span>
          <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${
            runtimeMode === 'production' 
              ? 'text-emerald-400' 
              : runtimeMode === 'staging' 
                ? 'text-amber-400' 
                : 'text-red-400'
          }`}>
            <Cpu className="w-3.5 h-3.5" /> {runtimeMode}
          </span>
        </div>
      </div>

      {missingDependencies.length > 0 && (
        <div className="p-4 bg-amber-500/5 border border-amber-500/15 rounded-xl space-y-2">
          <p className="text-xs font-bold text-amber-450 uppercase tracking-wider">{t("overlays.missing_context_dependencies")}</p>
          <ul className="list-disc list-inside text-[11px] text-amber-550 space-y-1">
            {missingDependencies.map((dep, idx) => (
              <li key={idx}>{dep}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
