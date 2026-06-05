import { useLanguage } from '../../contexts/LanguageContext';
import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, FileSignature, Server, AlertOctagon, 
  CheckCircle2, XCircle, ChevronRight, Fingerprint, Lock, ShieldAlert, Activity
} from 'lucide-react';
import { executiveRuntime } from '../../services/FiduciaryRuntimeAdapter';
import { InstitutionalOnboardingOutput } from '../../services/FiduciaryRuntimeAdapter';

export function InstitutionalOnboardingControlCenterPage() {
  const { translateLabel: t } = useLanguage();
  const [onboardingData, setOnboardingData] = useState<InstitutionalOnboardingOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let report: any = {};
    try {
      report = executiveRuntime.generateExecutiveReport({
        clientProfile: { id: 'default' },
        rawFinancialData: {
          bpSummary: { ativoTotal: 1000, passivoTotal: 1000, patrimonioLiquido: 500, caixaEquivalentes: 200 },
          ebitda: 100,
          lucroLiquido: 50,
          historicalCyclesCount: 3,
          filterYear: 2026,
          allHistoryData: []
        },
        bpData: [],
        dreData: [],
        dlpaData: []
      });
    } catch (err) {
      console.error('Error generating onboarding report:', err);
    }
    
    if (report && report.institutionalOnboarding) {
       setOnboardingData(report.institutionalOnboarding);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-4 text-zinc-500">
          <Activity className="animate-spin" size={32} />
          <p className="text-xs uppercase tracking-widest">{t("onboarding.evaluating")}</p>
        </div>
      </div>
    );
  }

  if (!onboardingData) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] font-mono text-red-500">
        <AlertOctagon size={48} className="mb-4" />
        <h2 className="text-xl font-bold uppercase">{t("onboarding.data_missing")}</h2>
        <p className="text-sm mt-2 text-red-400">{t("onboarding.no_runtime_data")}</p>
      </div>
    );
  }

  const {
    onboardingStage,
    onboardingBlocked,
    tenantProvisioningStatus,
    organizationalReadinessStatus,
    fiduciaryValidationStatus,
    tenantIsolationStatus,
    activationGovernanceStatus,
    deploymentInheritanceStatus,
    unresolvedSetupIssues,
    blockedActivationReasons,
    onboardingNarrative,
    lineageHash
  } = onboardingData;

  const isFullOperation = onboardingStage === 'FULL_INSTITUTIONAL_OPERATION';
  const isPilot = onboardingStage === 'PILOT_ACTIVATION';

  const stages = [
    'PRE_ONBOARDING',
    'TENANT_PROVISIONED',
    'FIDUCIARY_VALIDATION',
    'PILOT_ACTIVATION',
    'LIMITED_OPERATION',
    'FULL_INSTITUTIONAL_OPERATION'
  ];

  const currentStageIdx = stages.indexOf(onboardingStage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VALIDATED':
      case 'PROVISIONED':
      case 'AUTHORIZED':
      case 'HIGH':
        return 'text-emerald-400';
      case 'PARTIAL':
      case 'LIMITED':
      case 'MODERATE':
      case 'PENDING':
        return 'text-yellow-400';
      case 'INCOMPLETE':
      case 'UNSAFE':
      case 'BLOCKED':
      case 'NOT_PROVISIONED':
      case 'INVALID':
      case 'LOW':
        return 'text-red-500';
      default:
        return 'text-zinc-400';
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full text-zinc-100 pb-12 bg-zinc-950 p-6 rounded-3xl border border-zinc-800 font-mono">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <Building2 size={16} />
            <span className="text-[10px] uppercase font-bold tracking-widest font-mono">Client Activation Control</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{t("onboarding.control_center")}</h1>
          <p className="text-xs text-zinc-500 font-mono mt-1 uppercase tracking-widest">{t("onboarding.subtitle")}</p>
        </div>
        {lineageHash && (
          <div className="text-[10px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span>{t("onboarding.audit_lineage")}</span>
            <span className="font-bold text-zinc-300">{lineageHash.substring(0, 16)}...</span>
          </div>
        )}
      </div>

      {/* Main Activation Banner */}
      <div className={`p-6 rounded-2xl border ${onboardingBlocked ? 'bg-red-950/40 border-red-900/50' : isFullOperation ? 'bg-emerald-950/20 border-emerald-900/50' : 'bg-zinc-900 border-zinc-800'}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-mono mb-2">{t("onboarding.current_stage")}</p>
            <h2 className={`text-4xl font-black tracking-tight mb-4 ${onboardingBlocked ? 'text-red-500' : isFullOperation ? 'text-emerald-400' : 'text-blue-400'}`}>
              {onboardingStage.replace(/_/g, ' ')}
            </h2>
            <p className="text-sm text-zinc-300 max-w-3xl">{onboardingNarrative}</p>
          </div>
          <div className="shrink-0 flex items-center justify-center p-4 bg-zinc-950 rounded-full border border-zinc-800">
             {onboardingBlocked ? <Lock size={48} className="text-red-500" /> : <ShieldAlert size={48} className={isFullOperation ? 'text-emerald-500' : 'text-blue-500'} />}
          </div>
        </div>
      </div>

      {/* Onboarding Lifecycle Timeline */}
      <div className="py-4 border-b border-zinc-800 overflow-x-auto">
         <div className="flex items-center min-w-[800px]">
            {stages.map((stage, idx) => {
              const isActive = idx === currentStageIdx;
              const isPast = idx < currentStageIdx;
              const isBlockedStage = onboardingBlocked && isActive;
              
              return (
                <React.Fragment key={stage}>
                  <div className={`flex flex-col items-center gap-2 relative z-10 w-32 ${isBlockedStage ? 'text-red-500' : isActive ? 'text-blue-400' : isPast ? 'text-emerald-500' : 'text-zinc-600'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${isBlockedStage ? 'bg-red-950 border-red-500' : isActive ? 'bg-blue-950 border-blue-400' : isPast ? 'bg-emerald-950 border-emerald-500' : 'bg-zinc-900 border-zinc-700'}`}>
                      {isBlockedStage ? <XCircle size={12} /> : isPast ? <CheckCircle2 size={12} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                    </div>
                    <span className="text-[9px] uppercase font-bold text-center leading-tight tracking-widest">{stage.replace(/_/g, ' ')}</span>
                  </div>
                  {idx < stages.length - 1 && (
                    <div className="flex-1 h-0.5 bg-zinc-800 relative -top-3">
                       <div className="h-full bg-emerald-500 transition-all" style={{ width: isPast ? '100%' : '0%' }} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
         </div>
      </div>

      {/* Blockers Overlay */}
      {blockedActivationReasons.length > 0 && (
        <div className="p-5 bg-red-950/50 border border-red-900/70 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <AlertOctagon className="text-red-500" size={18} />
            <h3 className="font-bold text-red-400 uppercase tracking-wide text-xs">{t("onboarding.blockers")}</h3>
          </div>
          <ul className="space-y-2">
            {blockedActivationReasons.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-red-300">
                <XCircle size={14} className="mt-0.5 shrink-0 text-red-500" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sub-Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
        
        {/* Tenant Provisioning Surface */}
        <div className="bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800 space-y-4">
          <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <Server size={14} /> {t("onboarding.tenant_provisioning")}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-400">{t("onboarding.provisioning_status")}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-800 bg-zinc-950 ${getStatusColor(tenantProvisioningStatus)}`}>{tenantProvisioningStatus}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-400">{t("onboarding.tenant_isolation")}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-800 bg-zinc-950 ${getStatusColor(tenantIsolationStatus)}`}>{tenantIsolationStatus}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-400">{t("onboarding.deployment_inheritance")}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-800 bg-zinc-950 ${getStatusColor(deploymentInheritanceStatus)}`}>{deploymentInheritanceStatus}</span>
            </div>
          </div>
        </div>

        {/* Fiduciary Validation Panel */}
        <div className="bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800 space-y-4">
          <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <FileSignature size={14} /> {t("onboarding.doc_governance")}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-400">{t("onboarding.org_readiness")}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-800 bg-zinc-950 ${getStatusColor(organizationalReadinessStatus)}`}>{organizationalReadinessStatus}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-400">{t("onboarding.fiduciary_signoff")}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-800 bg-zinc-950 ${getStatusColor(fiduciaryValidationStatus)}`}>{fiduciaryValidationStatus}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-400">{t("onboarding.activation_gov")}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-800 bg-zinc-950 ${getStatusColor(activationGovernanceStatus)}`}>{activationGovernanceStatus}</span>
            </div>
          </div>
        </div>

        {/* Unresolved Issues */}
        <div className="bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800 space-y-4">
          <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <Fingerprint size={14} /> {t("onboarding.audit_trail")}
          </h3>
          <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
            {unresolvedSetupIssues.length === 0 ? (
              <p className="text-xs text-emerald-500 flex items-center gap-2">
                <CheckCircle2 size={12} /> {t("onboarding.no_critical_issues")}
              </p>
            ) : (
              unresolvedSetupIssues.map((issue, i) => (
                <p key={i} className="text-[10px] text-red-400 border-l border-red-500/50 pl-2">
                  {issue}
                </p>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
