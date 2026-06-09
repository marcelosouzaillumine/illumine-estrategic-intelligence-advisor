import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { ConstitutionalLineageInformation } from '../../../services/FiduciaryRuntimeAdapter';
import { Network, Fingerprint, GitMerge } from 'lucide-react';

interface Props {
  lineage: ConstitutionalLineageInformation;
}

export const ConstitutionalLineagePanel: React.FC<Props> = ({ lineage }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-gray-900 border border-border rounded-lg p-6 h-full">
      <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
        <Network className="w-5 h-5 text-primary" />
        {t('cgd.panels.lineage')}
      </h3>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-black/40 rounded-lg border border-border">
            <span className="text-xs text-muted-foreground uppercase font-semibold">{t('cgd.lineage.constitutionalHash')}</span>
            <div className="text-sm font-mono text-primary mt-1 truncate">{lineage.constitutionalHash}</div>
          </div>
          <div className="p-3 bg-black/40 rounded-lg border border-border">
            <span className="text-xs text-muted-foreground uppercase font-semibold">{t('cgd.lineage.runtimeHash')}</span>
            <div className="text-sm font-mono text-blue-300 mt-1 truncate">{lineage.runtimeHash}</div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div className="flex items-center gap-3">
            <Fingerprint className="w-5 h-5 text-muted-foreground" />
            <div>
              <div className="text-sm text-muted-foreground">{t('cgd.lineage.traceability')}</div>
              <div className="text-xs text-muted-foreground font-mono mt-0.5">{lineage.traceabilityStatus}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-white font-medium">{lineage.evidenceCount}</div>
            <div className="text-xs text-muted-foreground">{t('cgd.lineage.evidenceCount')}</div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3 flex items-center gap-2">
            <GitMerge className="w-4 h-4" />
            {t('cgd.lineage.propagation')}
          </h4>
          <div className="flex flex-wrap gap-2">
            {lineage.propagationLineage.map((step, idx) => (
              <span key={idx} className="px-3 py-1 bg-primary text-primary text-xs rounded-full border border-primary">
                {step}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
