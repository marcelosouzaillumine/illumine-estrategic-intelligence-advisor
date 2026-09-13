import React from 'react';

interface FiduciaryContinuityPanelProps {
  activeSurvivalMode: string;
  activeRecoveryStage: string;
  regressionDetected: boolean;
  resilienceClassification: string;
  antifragilityValidated: boolean;
  institutionalRecoveryConfidence: string;
  treasuryProtectionLevel: string;
  institutionalContinuityRisk: string;
  confidenceLevel: string;
}

export function FiduciaryContinuityPanel({
  activeSurvivalMode,
  activeRecoveryStage,
  regressionDetected,
  resilienceClassification,
  antifragilityValidated,
  institutionalRecoveryConfidence,
  treasuryProtectionLevel,
  institutionalContinuityRisk,
  confidenceLevel
}: FiduciaryContinuityPanelProps) {
  
  const isFailClosed = confidenceLevel !== 'HIGH';

  const renderBadge = (label: string, value: string, isCriticalState: boolean = false, isNeutral: boolean = false) => {
    let bgColor = 'bg-zinc-900 text-zinc-300 border-zinc-700';
    
    if (isCriticalState) {
      bgColor = 'bg-red-950 text-red-400 border-red-800';
    } else if (!isNeutral) {
      if (['HIGH', 'STRONG', 'ANTIFRAGILE', 'RESILIENT', 'FULL_REAUTHORIZATION'].includes(value)) {
        bgColor = isFailClosed ? 'bg-zinc-800 text-zinc-500 border-zinc-700' : 'bg-emerald-950 text-emerald-400 border-emerald-800';
      } else if (['MODERATE', 'STABLE', 'RECOVERY_STAGE_2', 'RECOVERY_STAGE_3'].includes(value)) {
        bgColor = 'bg-blue-950 text-blue-400 border-blue-800';
      } else if (['LOW', 'ERODED', 'FRAGILE', 'INSTITUTIONALLY_FRAGILE', 'SURVIVAL_MODE'].includes(value)) {
        bgColor = 'bg-orange-950 text-orange-400 border-orange-800';
      }
    }

    // Override antifragility if fail closed
    let displayValue = value;
    if (value === 'ANTIFRAGILE' && (!antifragilityValidated || isFailClosed)) {
      displayValue = 'LOCKED (ADAPTIVE)';
      bgColor = 'bg-zinc-900 text-zinc-500 border-zinc-800';
    }

    if (value === 'UNKNOWN' || isFailClosed && !isCriticalState) {
      bgColor = 'bg-zinc-900 text-zinc-500 border-zinc-800';
    }

    return (
      <div className={`p-3 border rounded-md flex flex-col justify-center ${bgColor}`}>
        <span className="text-[10px] uppercase tracking-widest opacity-70 mb-1">{label}</span>
        <span className="text-sm font-bold tracking-wider">{displayValue}</span>
      </div>
    );
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg w-full font-mono flex flex-col h-full">
      <h3 className="text-zinc-400 text-xs font-semibold tracking-wider uppercase mb-6">
        Fiduciary Continuity State
      </h3>
      
      <div className="grid grid-cols-2 gap-3 mb-4 flex-grow">
        {renderBadge('Survival Mode', activeSurvivalMode, activeSurvivalMode === 'SURVIVAL_MODE')}
        {renderBadge('Recovery Stage', activeRecoveryStage, false)}
        {renderBadge('Regression', regressionDetected ? 'DETECTED' : 'NONE', regressionDetected)}
        {renderBadge('Resilience Class', resilienceClassification, resilienceClassification === 'INSTITUTIONALLY_FRAGILE')}
      </div>

      <div className="border-t border-zinc-800 pt-4 mt-2">
        <h4 className="text-[10px] text-zinc-500 uppercase tracking-widest mb-3">Institutional Protection Metrics</h4>
        <div className="grid grid-cols-3 gap-2">
          {renderBadge('Recovery Conf.', institutionalRecoveryConfidence)}
          {renderBadge('Treasury Prot.', treasuryProtectionLevel)}
          {renderBadge('Continuity Risk', institutionalContinuityRisk, institutionalContinuityRisk === 'HIGH')}
        </div>
      </div>
    </div>
  );
}
