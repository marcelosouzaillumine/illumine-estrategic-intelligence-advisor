import React from 'react';
import { AlertTriangle, ShieldCheck, Activity, TrendingUp, TrendingDown, Anchor, Shield } from 'lucide-react';

interface InstitutionalLifecycleSurfaceProps {
  activeSurvivalMode: string;
  activeRecoveryStage: string;
  regressionDetected: boolean;
  resilienceClassification: string;
  antifragilityValidated: boolean;
  confidenceLevel: string;
}

export function InstitutionalLifecycleSurface({
  activeSurvivalMode,
  activeRecoveryStage,
  regressionDetected,
  resilienceClassification,
  antifragilityValidated,
  confidenceLevel
}: InstitutionalLifecycleSurfaceProps) {
  
  const isFailClosed = confidenceLevel !== 'HIGH';

  const stages = [
    {
      id: 'collapse',
      label: 'Collapse',
      icon: <AlertTriangle size={16} />,
      isActive: activeSurvivalMode === 'SURVIVAL_MODE' && activeRecoveryStage === 'NONE',
      color: 'bg-red-900 border-red-700 text-red-100',
      inactiveColor: 'bg-zinc-900 border-zinc-800 text-zinc-600'
    },
    {
      id: 'survival',
      label: 'Survival',
      icon: <Anchor size={16} />,
      isActive: activeSurvivalMode === 'SURVIVAL_MODE' || activeRecoveryStage === 'RECOVERY_STAGE_1_PENDING',
      color: 'bg-orange-900 border-orange-700 text-orange-100',
      inactiveColor: 'bg-zinc-900 border-zinc-800 text-zinc-600'
    },
    {
      id: 'stabilization',
      label: 'Stabilization',
      icon: <Activity size={16} />,
      isActive: activeRecoveryStage === 'RECOVERY_STAGE_1' || activeRecoveryStage === 'RECOVERY_MONITORING',
      color: 'bg-yellow-900 border-yellow-700 text-yellow-100',
      inactiveColor: 'bg-zinc-900 border-zinc-800 text-zinc-600'
    },
    {
      id: 'recovery',
      label: 'Recovery',
      icon: <TrendingUp size={16} />,
      isActive: activeRecoveryStage === 'RECOVERY_STAGE_2' || activeRecoveryStage === 'RECOVERY_STAGE_3' || activeRecoveryStage === 'FULL_REAUTHORIZATION',
      color: 'bg-blue-900 border-blue-700 text-blue-100',
      inactiveColor: 'bg-zinc-900 border-zinc-800 text-zinc-600'
    },
    {
      id: 'regression',
      label: 'Regression',
      icon: <TrendingDown size={16} />,
      isActive: regressionDetected,
      color: 'bg-red-800 border-red-600 text-red-50',
      inactiveColor: 'bg-zinc-900 border-zinc-800 text-zinc-600'
    },
    {
      id: 'resilience',
      label: 'Resilience',
      icon: <Shield size={16} />,
      isActive: resilienceClassification === 'RESILIENT' || resilienceClassification === 'ADAPTIVE',
      color: 'bg-primary border-primary text-primary',
      inactiveColor: 'bg-zinc-900 border-zinc-800 text-zinc-600'
    },
    {
      id: 'antifragility',
      label: 'Antifragility',
      icon: <ShieldCheck size={16} />,
      isActive: resilienceClassification === 'ANTIFRAGILE' && antifragilityValidated && !isFailClosed,
      color: 'bg-emerald-900 border-emerald-700 text-emerald-100',
      inactiveColor: 'bg-zinc-900 border-zinc-800 text-zinc-600'
    }
  ];

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg w-full font-mono">
      <h3 className="text-zinc-400 text-xs font-semibold tracking-wider uppercase mb-6 flex items-center gap-2">
        Institutional Lifecycle Surface
      </h3>
      <div className="flex flex-wrap md:flex-nowrap gap-2 justify-between items-center w-full relative">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-zinc-800 -z-0 hidden md:block"></div>
        
        {stages.map((stage) => {
          const isMuted = isFailClosed && stage.id === 'antifragility';
          const activeClass = (stage.isActive && !isMuted) ? stage.color : stage.inactiveColor;
          
          return (
            <div 
              key={stage.id} 
              className={`z-10 flex flex-col items-center justify-center p-3 rounded border w-full md:w-32 transition-colors ${activeClass}`}
            >
              <div className="mb-2">
                {stage.icon}
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-center">
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
      
      {isFailClosed && (
        <div className="mt-4 p-3 bg-red-950/50 border border-red-900/50 rounded flex items-start gap-3">
          <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-red-400 text-xs font-bold uppercase">Garantia Fiduciária Ativa</p>
            <p className="text-red-300 text-xs mt-1">A visualização de estágios otimistas do ciclo de vida está retida até que se atinja alta confiança longitudinal. (Fail-Closed)</p>
          </div>
        </div>
      )}
    </div>
  );
}
