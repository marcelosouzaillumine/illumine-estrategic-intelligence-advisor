import React from 'react';
import { EarlyWarningSignal } from '../../services/FiduciaryRuntimeAdapter';

interface WarningBannerProps {
  warnings: EarlyWarningSignal[];
}

export const TemporalEarlyWarningBanner: React.FC<WarningBannerProps> = ({ warnings }) => {
  if (!warnings || warnings.length === 0) {
    return null; // Dummy Renderer rule: Do not render anything if no official warning is present.
  }

  return (
    <div className="temporal-early-warnings flex flex-col gap-3 my-4">
      {warnings.map((warning, index) => (
        <div 
          key={`${warning.warningType}-${index}`}
          className="warning-banner p-4 bg-red-950 border-l-4 border-red-600 rounded-r-md text-red-50 flex flex-col sm:flex-row sm:items-start justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded uppercase">
                {warning.warningType.replace(/_/g, ' ')}
              </span>
              <span className="text-xs text-red-300 font-mono">
                Cycles: {warning.recurrenceCycles}
              </span>
            </div>
            <p className="text-sm">{warning.description}</p>
          </div>
          <div className="text-right mt-2 sm:mt-0 opacity-70 hover:opacity-100 transition-opacity">
            <div className="text-xs font-mono">Ref: {warning.auditReference}</div>
            <div className="text-xs font-mono">Lineage: {warning.lineageHash.substring(0, 8)}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
