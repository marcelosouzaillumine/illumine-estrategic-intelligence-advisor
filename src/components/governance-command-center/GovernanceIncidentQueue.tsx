import React from 'react';
import { useCommandCenter } from '../../context/governance-command-center/GovernanceCommandCenterProvider';
import { GovernanceIncident } from '../../services/FiduciaryRuntimeAdapter';

export const GovernanceIncidentQueue: React.FC = () => {
  const {
    activeIncidents,
    selectedIncident,
    setSelectedIncident,
    acknowledgeIncident,
    superviseIncident,
    escalateIncident,
    containIncident,
    resolveIncident,
    commandIntegrity
  } = useCommandCenter();

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'SYSTEMIC':
        return 'text-rose-400 border-rose-500/30 bg-rose-950/20';
      case 'CRITICAL':
        return 'text-red-400 border-red-500/30 bg-red-950/20';
      case 'HIGH':
        return 'text-amber-400 border-amber-500/30 bg-amber-950/20';
      case 'MODERATE':
        return 'text-cyan-400 border-cyan-500/30 bg-cyan-950/20';
      default:
        return 'text-slate-400 border-slate-800 bg-slate-900/40';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RESOLVED':
        return 'text-emerald-400 border-emerald-500/20 bg-emerald-950/15';
      case 'CONTAINED':
        return 'text-emerald-500 border-emerald-500/10 bg-emerald-950/10';
      case 'ESCALATED':
        return 'text-rose-400 border-rose-500/20 bg-rose-950/15';
      case 'UNDER_SUPERVISION':
        return 'text-cyan-400 border-cyan-500/20 bg-cyan-950/15';
      case 'FAIL_CLOSED':
        return 'text-rose-400 border-rose-500/20 bg-rose-950/15 animate-pulse';
      case 'ACKNOWLEDGED':
        return 'text-amber-400 border-amber-500/20 bg-amber-950/15';
      default:
        return 'text-blue-400 border-blue-500/20 bg-blue-950/15';
    }
  };

  const isActionsDisabled = commandIntegrity === 'FAIL_CLOSED';

  return (
    <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-4">
      <div className="flex justify-between items-center border-b border-slate-850 pb-2">
        <h4 className="text-slate-400 font-semibold tracking-wider uppercase text-xs font-mono">
          Incident Supervision Queue
        </h4>
        <span className="text-[10px] font-mono text-slate-500 uppercase">
          {activeIncidents.length} IN SCOPE
        </span>
      </div>

      <div className="space-y-3">
        {activeIncidents.map(({ incident, currentStatus, isCollapsed }) => {
          const isSelected = selectedIncident?.incidentId === incident.incidentId;
          const severityStyle = getSeverityStyle(incident.severity);
          const statusStyle = getStatusBadge(currentStatus);

          return (
            <div
              key={incident.incidentId}
              onClick={() => setSelectedIncident(incident)}
              className={`p-4 border rounded-xl transition-all duration-200 cursor-pointer flex flex-col gap-3 ${
                isSelected
                  ? 'border-cyan-500 bg-cyan-950/10'
                  : 'border-slate-850 bg-slate-900/20 hover:border-slate-800'
              } ${isCollapsed ? 'opacity-40 hover:opacity-100' : ''}`}
            >
              {/* Header do Incidente */}
              <div className="flex justify-between items-start gap-4 flex-wrap">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${severityStyle}`}>
                      {incident.severity}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${statusStyle}`}>
                      {currentStatus.replace('_', ' ')}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">ENTITY: {incident.entityId}</span>
                  </div>
                  <h5 className="text-xs font-mono font-bold text-slate-100 mt-1">{incident.title}</h5>
                </div>
                <span className="text-[10px] font-mono text-slate-500">
                  {new Date(incident.detectedAt).toLocaleTimeString()}
                </span>
              </div>

              {/* Descrição expandida se selecionado */}
              {isSelected && (
                <div className="space-y-4 border-t border-slate-850 pt-3 animate-fadeIn">
                  <p className="text-slate-400 text-xs leading-relaxed font-sans">
                    {incident.description}
                  </p>

                  {/* Ações de Comando */}
                  <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-900/60 mt-1">
                    {currentStatus === 'OPEN' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          acknowledgeIncident(incident.incidentId);
                        }}
                        disabled={isActionsDisabled}
                        className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-350 hover:text-white font-mono text-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ACKNOWLEDGE
                      </button>
                    )}

                    {(currentStatus === 'ACKNOWLEDGED' || currentStatus === 'OPEN') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          superviseIncident(incident.incidentId);
                        }}
                        disabled={isActionsDisabled}
                        className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-350 hover:text-white font-mono text-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        SUPERVISE
                      </button>
                    )}

                    {currentStatus !== 'ESCALATED' && currentStatus !== 'RESOLVED' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          escalateIncident(incident.incidentId);
                        }}
                        disabled={isActionsDisabled}
                        className="px-2.5 py-1 rounded bg-rose-950/20 border border-rose-500/20 hover:border-rose-400 text-rose-400 hover:text-rose-300 font-mono text-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ESCALATE
                      </button>
                    )}

                    {currentStatus !== 'CONTAINED' && currentStatus !== 'RESOLVED' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          containIncident(incident.incidentId);
                        }}
                        disabled={isActionsDisabled}
                        className="px-2.5 py-1 rounded bg-emerald-950/20 border border-emerald-500/20 hover:border-emerald-400 text-emerald-450 hover:text-emerald-300 font-mono text-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        CONTAIN
                      </button>
                    )}

                    {currentStatus !== 'RESOLVED' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          resolveIncident(incident.incidentId);
                        }}
                        disabled={isActionsDisabled}
                        className="px-2.5 py-1 rounded bg-emerald-500 text-slate-950 font-bold font-mono text-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        RESOLVE
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
