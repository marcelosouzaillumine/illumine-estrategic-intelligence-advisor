import React from 'react';
import { Radar, Play, Loader2, AlertCircle, Clock } from 'lucide-react';
import { PageHeader } from '../../Common';
import { MonitoringAlertFeed } from '../../monitoring/MonitoringAlertFeed';
import { useInstitutionalMonitoringViewModel } from '../../../capabilities/assessment-monitoring/presentation/view-models/useInstitutionalMonitoringViewModel';

export function InstitutionalMonitoringPage() {
  const { alerts, isRunning, lastExecution, handleRunCycle } = useInstitutionalMonitoringViewModel();

  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12 pb-32 animate-executive-fade">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <PageHeader
          title="Monitoramento Institucional"
          subtitle="Vigilância contínua de Risco Sistêmico, Liquidez e Confidence."
          icon={Radar}
          transparent
        />
        <button
          onClick={handleRunCycle}
          disabled={isRunning}
          className="btn-executive flex items-center gap-2 shrink-0 disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Executando Ciclo...
            </>
          ) : (
            <>
              <Play size={15} fill="currentColor" />
              Run Monitoring Cycle
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Métricas Sidebar */}
        <div className="md:col-span-1 space-y-4">
          <h3 className="text-h3 font-medium text-foreground tracking-tight">Métricas Consolidadas</h3>
          <div className="card-premium p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-md bg-critical-soft flex items-center justify-center text-destructive">
                <AlertCircle size={18} />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Alertas Ativos</p>
                <p className="text-h3 font-medium text-foreground tabular-nums">{alerts.length}</p>
              </div>
            </div>
            <div className="border-t border-border pt-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-md bg-surface-container flex items-center justify-center text-muted-foreground">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Última Execução</p>
                <p className="text-body-sm font-medium text-foreground">
                  {lastExecution
                    ? new Date(lastExecution.timestamp).toLocaleTimeString()
                    : 'Pendente'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Alert Feed */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-h3 font-medium text-foreground tracking-tight">Alertas Fiduciários</h3>
          <MonitoringAlertFeed alerts={alerts} />
        </div>
      </div>
    </div>
  );
}
