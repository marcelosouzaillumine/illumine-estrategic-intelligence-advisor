import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { ExecutiveNarrative } from '../../../core/runtime/executive/types';

interface RuntimeDisclosureBannerProps {
  narrative: ExecutiveNarrative;
}

export const RuntimeDisclosureBanner: React.FC<RuntimeDisclosureBannerProps> = ({ narrative }) => {
  const isLowConfidence = narrative.confidence === 'LOW';
  const hasCritical = narrative.violations.some(v => v.severity === 'CRITICAL');

  return (
    <div className={`w-full p-4 flex items-center justify-between border-b ${isLowConfidence || hasCritical ? 'bg-red-900 text-white' : 'bg-slate-900 text-white'}`}>
      <div className="flex items-center gap-3">
        {isLowConfidence || hasCritical ? <AlertTriangle className="w-5 h-5 text-red-400" /> : <ShieldCheck className="w-5 h-5 text-emerald-400" />}
        <div>
          <h4 className="font-semibold uppercase tracking-wider text-xs">Runtime Disclosure</h4>
          <p className="text-sm">
            Mode: {narrative.sourceRuntime} | Confidence: <span className="font-bold">{narrative.confidence}</span>
          </p>
        </div>
      </div>
      {narrative.violations.length > 0 && (
        <div className="text-xs font-mono bg-black/50 px-3 py-1 rounded">
          {narrative.violations.length} Active Violations Detected
        </div>
      )}
    </div>
  );
};
