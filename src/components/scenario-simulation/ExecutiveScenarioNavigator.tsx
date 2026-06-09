import React, { useState } from 'react';
import { useScenarioSimulation } from '../../context/scenario-simulation/ScenarioSimulationProvider';
import { SandboxConfig } from '../../services/FiduciaryRuntimeAdapter';
import { useLanguage } from '../../contexts/LanguageContext';
import { InvestigationLauncherWrapper } from '../investigation/InvestigationLauncherWrapper';

export const ExecutiveScenarioNavigator: React.FC = () => {
  const { t } = useLanguage();
  const {
    sandboxActions,
    applySandboxAction,
    removeSandboxAction,
    clearSandbox,
    sandboxResult
  } = useScenarioSimulation();

  const [intensity, setIntensity] = useState<number>(0.5);

  const availableActions: Array<{
    type: SandboxConfig['actionType'];
    label: string;
    description: string;
  }> = [
    {
      type: 'HIRING_FREEZE',
      label: t('scenario.actions.hiringFreeze.label'),
      description: t('scenario.actions.hiringFreeze.desc')
    },
    {
      type: 'DEBT_INCREASE',
      label: t('scenario.actions.debtIncrease.label'),
      description: t('scenario.actions.debtIncrease.desc')
    },
    {
      type: 'SUPPLIER_CONCENTRATION',
      label: t('scenario.actions.supplierConcentration.label'),
      description: t('scenario.actions.supplierConcentration.desc')
    },
    {
      type: 'RESTRUCTURING',
      label: t('scenario.actions.restructuring.label'),
      description: t('scenario.actions.restructuring.desc')
    },
    {
      type: 'EXPANSION',
      label: t('scenario.actions.expansion.label'),
      description: t('scenario.actions.expansion.desc')
    },
    {
      type: 'OPERATIONAL_CONTRACTION',
      label: t('scenario.actions.operationalContraction.label'),
      description: t('scenario.actions.operationalContraction.desc')
    }
  ];

  const handleActionToggle = (type: SandboxConfig['actionType']) => {
    const isActive = sandboxActions.some(a => a.actionType === type);
    if (isActive) {
      removeSandboxAction(type);
    } else {
      applySandboxAction({ actionType: type, intensity });
    }
  };

  return (
    <div className="card-premium p-8 space-y-8 relative overflow-hidden group hover:border-secondary/30 transition-all duration-500 bg-surface-container/30 backdrop-blur-xl border-white/5 shadow-2xl">
      <div className="flex justify-between items-center border-b border-border/40 pb-5">
        <h4 className="text-sm font-medium text-foreground tracking-tight">
          {t('scenario.sandbox.title')}
        </h4>
        {sandboxActions.length > 0 && (
          <button
            onClick={clearSandbox}
            className="text-[10px] font-mono text-rose-500 hover:text-rose-600 uppercase border border-rose-500/20 px-3 py-1 rounded-full bg-rose-500/10 cursor-pointer transition-all duration-200"
          >
            {t('scenario.sandbox.clearAll')}
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Intensidade */}
        <div className="flex flex-col gap-3 p-5 bg-surface-container/40 border border-border/40 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-secondary/40 to-secondary w-full opacity-50"></div>
          <div className="flex justify-between text-[11px] font-mono font-bold tracking-widest text-muted-foreground">
            <span>{t('scenario.sandbox.intensity')}</span>
            <span className="text-secondary font-black">{(intensity * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={intensity}
            onChange={(e) => setIntensity(parseFloat(e.target.value))}
            className="w-full accent-secondary h-1.5 bg-surface-container-high rounded-lg cursor-pointer"
          />
        </div>

        {/* Grade de Decisões */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {availableActions.map((act) => {
            const activeAction = sandboxActions.find(a => a.actionType === act.type);
            const isActive = !!activeAction;

            return (
              <button
                key={act.type}
                onClick={() => handleActionToggle(act.type)}
                className={`p-5 border rounded-2xl text-left transition-all duration-300 flex flex-col justify-between gap-3 cursor-pointer relative overflow-hidden ${
                  isActive
                    ? 'border-secondary/50 bg-secondary/10 text-secondary shadow-[0_8px_32px_rgba(255,133,82,0.15)] ring-1 ring-secondary/20 scale-[1.02] z-10'
                    : 'border-border/40 bg-surface-container/20 text-muted-foreground hover:border-secondary/30 hover:bg-surface-container/50 hover:text-foreground'
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent pointer-events-none" />
                )}
                <div className="relative z-10 flex items-start justify-between gap-2">
                  <span className={`text-xs font-semibold tracking-wider uppercase block ${isActive ? 'text-secondary font-bold' : 'text-foreground'}`}>
                    {act.label}
                  </span>
                  <div onClick={(e) => e.stopPropagation()}>
                    <InvestigationLauncherWrapper 
                      tenantId="SYSTEM_TENANT" 
                      nodeId={act.type} 
                      originSurface="SCENARIO" 
                    />
                  </div>
                </div>
                <div className="relative z-10">
                  <p className="text-[10.5px] leading-relaxed mt-1.5 opacity-80">
                    {act.description}
                  </p>
                </div>

                {isActive && (
                  <div className="mt-2 text-[9px] font-mono tracking-widest font-bold flex justify-between w-full border-t border-secondary/20 pt-2 text-secondary/90">
                    <span>{t('scenario.sandbox.statusSimulated')}</span>
                    <span>{t('scenario.sandbox.intensityLabel', { value: (activeAction.intensity * 100).toFixed(0) })}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {sandboxResult && (
        <div className="p-4 bg-secondary/5 border border-secondary/20 rounded-xl flex justify-between items-center font-mono text-xs shadow-[0_0_20px_rgba(255,133,82,0.1)]">
          <span className="text-muted-foreground font-semibold uppercase tracking-wider">{t('scenario.sandbox.stressDelta')}</span>
          <span className={`font-bold tracking-wide ${sandboxResult.stressDelta <= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {sandboxResult.stressDelta > 0 ? t('scenario.sandbox.scoreImpactPositive', { value: String(sandboxResult.stressDelta) }) : t('scenario.sandbox.scoreImpactNegative', { value: String(sandboxResult.stressDelta) })}
          </span>
        </div>
      )}
    </div>
  );
};
