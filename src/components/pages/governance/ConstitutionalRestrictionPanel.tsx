import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { ConstitutionalRestriction } from '../../../services/FiduciaryRuntimeAdapter';
import { Lock, AlertCircle } from 'lucide-react';

interface Props {
  restrictions: ConstitutionalRestriction[];
}

export const ConstitutionalRestrictionPanel: React.FC<Props> = ({ restrictions }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 h-full">
      <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
        <Lock className="w-5 h-5 text-red-400" />
        {t('cgd.panels.restrictions')}
      </h3>
      {restrictions.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed border-gray-800 rounded-lg bg-gray-900/50">
          <p className="text-gray-500">{t('cgd.empty.restrictions')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {restrictions.map((r, idx) => (
            <div key={idx} className="p-4 rounded-md border border-red-500/20 bg-red-500/5 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-medium text-red-200">{r.type}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-semibold">
                    {r.level}
                  </span>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">{r.origin}</span>
                </div>
                <p className="text-sm text-gray-400">{r.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
