import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { ConstitutionalGovernanceDashboardOutput } from '../../../services/FiduciaryRuntimeAdapter';
import { ConstitutionalAxiomPanel } from './ConstitutionalAxiomPanel';
import { ConstitutionalRestrictionPanel } from './ConstitutionalRestrictionPanel';
import { ConstitutionalEnforcementPanel } from './ConstitutionalEnforcementPanel';
import { ConstitutionalLineagePanel } from './ConstitutionalLineagePanel';
import { ConstitutionalConfidencePanel } from './ConstitutionalConfidencePanel';
import { Shield } from 'lucide-react';

interface Props {
  dashboardData: ConstitutionalGovernanceDashboardOutput;
}

export const ConstitutionalGovernanceDashboardPanel: React.FC<Props> = ({ dashboardData }) => {
  const { t } = useLanguage();

  const isQuarantined = !!dashboardData.quarantineState;

  return (
    <div className="w-full space-y-6 mt-12 mb-12">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <Shield className="w-8 h-8 text-blue-500" />
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">{t('cgd.title')}</h2>
          <p className="text-sm text-muted-foreground">{t('cgd.subtitle')}</p>
        </div>
      </div>

      {isQuarantined && dashboardData.quarantineState && (
        <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-lg flex flex-col gap-3">
          <h3 className="text-xl font-bold text-red-400 flex items-center gap-2">
            <Shield className="w-6 h-6" />
            {t('cgd.quarantine.title')}
          </h3>
          <p className="text-red-200">{dashboardData.quarantineState.reason}</p>
          <div className="mt-4 pt-4 border-t border-red-500/20">
            <span className="text-sm text-red-400/80 font-medium block mb-2">{t('cgd.quarantine.suppressed')}</span>
            <div className="flex flex-wrap gap-2">
              {dashboardData.quarantineState.suppressedSystems.map((sys, idx) => (
                <span key={idx} className="px-3 py-1 bg-red-500/10 text-red-300 text-xs rounded-full border border-red-500/20">
                  {sys}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {!isQuarantined && (
          <div className="xl:col-span-2">
            <ConstitutionalAxiomPanel axioms={dashboardData.axiomStatus} />
          </div>
        )}

        {dashboardData.confidenceBreakdown && !isQuarantined && (
          <div className="xl:col-span-1">
            <ConstitutionalConfidencePanel confidence={dashboardData.confidenceBreakdown} />
          </div>
        )}

        <div className={isQuarantined ? "xl:col-span-3" : "xl:col-span-1"}>
          <ConstitutionalRestrictionPanel restrictions={dashboardData.restrictions} />
        </div>

        <div className={isQuarantined ? "xl:col-span-3" : "xl:col-span-1"}>
          <ConstitutionalEnforcementPanel actions={dashboardData.enforcementActions} />
        </div>

        {dashboardData.lineageInformation && (
          <div className="xl:col-span-1">
            <ConstitutionalLineagePanel lineage={dashboardData.lineageInformation} />
          </div>
        )}
      </div>

    </div>
  );
};
