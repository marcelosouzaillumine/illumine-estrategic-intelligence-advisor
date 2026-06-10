import React, { useState, useEffect } from 'react';
import { ShieldCheck, Server, AlertTriangle, Lock, Users, Activity, CheckCircle2, XCircle } from 'lucide-react';
import { executiveRuntime } from '../../services/FiduciaryRuntimeAdapter';
import { InstitutionalDeploymentReadinessOutput } from '../../services/FiduciaryRuntimeAdapter';

export function InstitutionalDeploymentReadinessPage() {
  const [readinessData, setReadinessData] = useState<InstitutionalDeploymentReadinessOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We request the runtime report with a baseline payload to evaluate readiness
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
      console.error('Error generating readiness report:', err);
    }
    if (report && report.deploymentReadiness) {
       setReadinessData(report.deploymentReadiness);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-4 text-zinc-500">
          <Activity className="animate-spin" size={32} />
          <p className="text-xs uppercase tracking-widest">Validating Deployment Readiness...</p>
        </div>
      </div>
    );
  }

  if (!readinessData) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] font-mono text-red-500">
        <AlertTriangle size={48} className="mb-4" />
        <h2 className="text-xl font-bold uppercase">Deployment Readiness Missing</h2>
        <p className="text-sm mt-2 text-red-400">The runtime did not generate the deployment readiness layer.</p>
      </div>
    );
  }

  const isBlocked = readinessData.deploymentBlocked;
  const isFullProduction = readinessData.deploymentReadiness === 'FULL_PRODUCTION_READY';
  const isPilot = readinessData.deploymentReadiness === 'PILOT_READY';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VALIDATED':
      case 'HIGH':
      case 'STABLE':
        return 'text-emerald-400';
      case 'PARTIAL':
      case 'MODERATE':
      case 'CONTROLLED':
        return 'text-yellow-400';
      case 'UNSTABLE':
      case 'UNSAFE':
      case 'LOW':
      case 'BROKEN':
      case 'WEAK':
      case 'INVALID':
      case 'CRITICAL':
        return 'text-red-500';
      default:
        return 'text-zinc-400';
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full text-zinc-100 pb-12 font-sans">
      
      {/* Sovereign Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <Server size={16} />
            <span className="text-[10px] uppercase font-bold tracking-widest font-mono">Deployment Readiness Layer</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Institutional Production Readiness</h1>
          <p className="text-xs text-zinc-500 font-mono mt-1 uppercase tracking-widest">Sovereign Fiduciary Execution Integrity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Main Status Hero Panel */}
        <div className={`xl:col-span-12 p-6 rounded-lg border ${isBlocked ? 'bg-red-950/40 border-red-900/50' : isFullProduction ? 'bg-emerald-950/20 border-emerald-900/50' : 'bg-zinc-900 border-zinc-800'}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-mono mb-2">Readiness Classification</p>
              <h2 className={`text-4xl font-bold tracking-tight mb-4 ${isBlocked ? 'text-red-500' : isFullProduction ? 'text-emerald-400' : 'text-blue-400'}`}>
                {readinessData.deploymentReadiness.replace(/_/g, ' ')}
              </h2>
              <p className="text-sm text-zinc-300 max-w-3xl">{readinessData.readinessNarrative}</p>
            </div>
            <div className="shrink-0 flex items-center justify-center p-4 bg-zinc-950 rounded-full border border-zinc-800">
               {isBlocked ? <Lock size={48} className="text-red-500" /> : <ShieldCheck size={48} className={isFullProduction ? 'text-emerald-500' : 'text-blue-500'} />}
            </div>
          </div>
        </div>

        {/* Deployment Blockers Overlay */}
        {readinessData.blockedDeploymentReasons.length > 0 && (
          <div className="xl:col-span-12 p-5 bg-red-950 border border-red-900 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="text-red-500" size={20} />
              <h3 className="font-bold text-red-400 uppercase tracking-wide text-sm">Deployment Blockers</h3>
            </div>
            <ul className="space-y-2">
              {readinessData.blockedDeploymentReasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-red-300">
                  <XCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
                  <span className="font-mono">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Matrix Panels */}
        <div className="xl:col-span-4 flex flex-col gap-4">
          <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-lg">
            <h3 className="text-xs uppercase tracking-widest text-zinc-400 font-mono mb-4 border-b border-zinc-800 pb-2">Environment Integrity</h3>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-zinc-300">Segregation Status</span>
              <span className={`text-xs font-bold font-mono ${getStatusColor(readinessData.environmentIntegrityStatus)}`}>{readinessData.environmentIntegrityStatus}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-300">Pilot Governance</span>
              <span className={`text-xs font-bold font-mono ${getStatusColor(readinessData.pilotGovernanceStatus)}`}>{readinessData.pilotGovernanceStatus}</span>
            </div>
          </div>

          <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-lg">
            <h3 className="text-xs uppercase tracking-widest text-zinc-400 font-mono mb-4 border-b border-zinc-800 pb-2">Runtime Integrity</h3>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-zinc-300">Deterministic Engine</span>
              <span className={`text-xs font-bold font-mono ${getStatusColor(readinessData.runtimeIntegrityStatus)}`}>{readinessData.runtimeIntegrityStatus}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-zinc-300">Fail-Closed Safeties</span>
              <span className={`text-xs font-bold font-mono ${getStatusColor(readinessData.failClosedIntegrityStatus)}`}>{readinessData.failClosedIntegrityStatus}</span>
            </div>
             <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-zinc-300">Runtime Regression Risk</span>
              <span className={`text-xs font-bold font-mono ${getStatusColor(readinessData.runtimeRegressionRisk)}`}>{readinessData.runtimeRegressionRisk}</span>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/50">
              <p className="text-[10px] text-zinc-500 font-mono break-all">Lineage: {readinessData.lineage?.lineageHash}</p>
            </div>
          </div>
        </div>

        <div className="xl:col-span-8 flex flex-col gap-4">
           {/* Operational Assurance & Recommendations */}
           <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-lg flex-1">
             <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-4">
               <h3 className="text-xs uppercase tracking-widest text-zinc-400 font-mono">Operational Assurance</h3>
               <span className={`text-xs font-bold font-mono px-2 py-1 rounded bg-zinc-950 ${getStatusColor(readinessData.operationalAssuranceStatus)}`}>
                 {readinessData.operationalAssuranceStatus}
               </span>
             </div>

             <div className="mb-6">
                <h4 className="text-[11px] uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-1"><Users size={12}/> Executive Access Governance</h4>
                <div className="bg-zinc-950 p-3 rounded border border-zinc-800">
                   <span className={`text-sm font-bold font-mono ${getStatusColor(readinessData.executiveAccessGovernanceStatus)}`}>
                     {readinessData.executiveAccessGovernanceStatus}
                   </span>
                   <p className="text-xs text-zinc-500 mt-1">Supervises cross-environment executive access and role constraints.</p>
                </div>
             </div>

             {readinessData.operationalRecommendations.length > 0 && (
               <div>
                 <h4 className="text-[11px] uppercase tracking-wider text-zinc-500 mb-2">Operational Recommendations</h4>
                 <ul className="space-y-2">
                   {readinessData.operationalRecommendations.map((rec, idx) => (
                     <li key={idx} className="text-sm text-zinc-300 flex items-start gap-2">
                       <CheckCircle2 size={16} className="text-blue-500 mt-0.5 shrink-0" />
                       <span>{rec}</span>
                     </li>
                   ))}
                 </ul>
               </div>
             )}

             {readinessData.deploymentWarnings.length > 0 && (
               <div className="mt-4 pt-4 border-t border-zinc-800/50">
                 <h4 className="text-[11px] uppercase tracking-wider text-yellow-500 mb-2">Deployment Warnings</h4>
                 <ul className="space-y-2">
                   {readinessData.deploymentWarnings.map((warn, idx) => (
                     <li key={idx} className="text-sm text-yellow-200/80 flex items-start gap-2">
                       <AlertTriangle size={16} className="text-yellow-500 mt-0.5 shrink-0" />
                       <span>{warn}</span>
                     </li>
                   ))}
                 </ul>
               </div>
             )}
           </div>
        </div>

      </div>
    </div>
  );
}
