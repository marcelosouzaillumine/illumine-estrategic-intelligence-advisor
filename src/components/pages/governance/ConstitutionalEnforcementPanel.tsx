import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { ConstitutionalEnforcementAction } from '../../../services/FiduciaryRuntimeAdapter';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

interface Props {
  actions: ConstitutionalEnforcementAction[];
}

export const ConstitutionalEnforcementPanel: React.FC<Props> = ({ actions }) => {
  const { t } = useLanguage();

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'WARNING': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'INTERVENTION': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'VETO': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'QUARANTINE': return 'text-primary bg-primary border-primary';
      default: return 'text-gray-400 bg-gray-800 border-gray-700';
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 h-full">
      <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
        <ShieldAlert className="w-5 h-5 text-orange-400" />
        {t('cgd.panels.enforcement')}
      </h3>
      {actions.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed border-gray-800 rounded-lg bg-gray-900/50">
          <p className="text-gray-500">{t('cgd.empty.enforcement')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {actions.map((act, idx) => (
            <div key={idx} className={`p-4 rounded-md border flex flex-col gap-2 ${getSeverityStyle(act.severity)}`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-medium text-sm">{act.trigger}</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-black/40 font-semibold uppercase tracking-widest">
                  {t(`cgd.enforcementLevels.${act.severity}`)}
                </span>
              </div>
              <p className="text-sm opacity-80">{act.description}</p>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-black/10">
                <span className="text-xs opacity-60 font-mono">{act.actionId}</span>
                <span className="text-xs opacity-60">
                  {new Date(act.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
