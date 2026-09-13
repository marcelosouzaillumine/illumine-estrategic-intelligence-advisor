

import React, { useState, useEffect } from 'react';
import { Radar, Play, Loader2, AlertCircle, Clock } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../../../components/Common';
import { MonitoringExecutionScheduler } from '../../../../services/FiduciaryRuntimeAdapter';
import { MonitoringAlertRegistry } from '../../../../services/FiduciaryRuntimeAdapter';
import { MonitoringAlert } from '../../../../services/FiduciaryRuntimeAdapter';
import { MonitoringAlertFeed } from '../../../../components/monitoring/MonitoringAlertFeed';
import { ExecutivePageTemplate } from '../../../../components/ui/executive-page-template';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveAccordion } from '../../../../components/ui/executive-accordion';
import { ExecutiveEmptyState } from '../../../../components/ui/executive-empty-state';
import { ExecutiveHeading } from '../../../../components/ui/executive-heading';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../../../../components/ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../../../../components/ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../../../../components/ui/executive-decision-trace';
import { useInstitutionalMonitoringPageViewModel } from '../../../../viewmodels/useInstitutionalMonitoringPageViewModel';
import { useExecutiveFormatter } from "../../../../core/localization";

export function InstitutionalMonitoringPage() {
    const formatter = useExecutiveFormatter();
  // Adapter: useInstitutionalMonitoringPageAdapter
  // ViewModel: useInstitutionalMonitoringPageViewModel
  const { state: vmState, computed: vmComputed, actions: vmActions } = useInstitutionalMonitoringPageViewModel({ clientId: '' });
  const portal = createPortal;
  const [alerts, setAlerts] = useState<MonitoringAlert[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Mock Tenant
  const mockTenant = 'TENANT-HQ';
  const mockWorkspace = 'WS-1';

  useEffect(() => {
      const formatter = useExecutiveFormatter();
    // Carrega do Registry passivamente ao montar (Simula sync)
    setAlerts(MonitoringAlertRegistry.getActiveAlerts(mockTenant, mockWorkspace));
  }, []);

  const handleRunCycle = () => {
      const formatter = useExecutiveFormatter();
    setIsRunning(true);
    
    // Simula um delay UX para demonstrar o scheduler executando
    setTimeout(() => {
        const formatter = useExecutiveFormatter();
      const mockContexts = [
        {
          tenantId: mockTenant,
          workspaceId: mockWorkspace,
          groupId: 'GROUP-A',
          historicalConfidences: ['HIGH', 'HIGH', 'MEDIUM', 'LOW'],
          lineageHash: 'HASH-DRIFT-1'
        }
      ];

      MonitoringExecutionScheduler.runManualCycle(mockTenant, mockWorkspace, mockContexts);
      setAlerts(MonitoringAlertRegistry.getActiveAlerts(mockTenant, mockWorkspace));
      setIsRunning(false);
    }, 1000);
  };

  const lastExecution = MonitoringAlertRegistry.getExecutions().slice(-1)[0];

  return (
    <ExecutivePageTemplate header={{
      title: "Monitoramento Institucional",
      description: "Vigilância contínua de Risco Sistêmico, Liquidez e Confidence.",
    }}>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">

        <div className="flex items-center gap-3">
          <StatusBadge status="Verde" label="Monitor de Alertas Ativo" />
        </div>
        <button
          onClick={handleRunCycle}
          disabled={isRunning}
          className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-zinc-800 transition-colors shrink-0 disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Executando Ciclo...
            </>
          ) : (
            <>
              <Play size={15} fill="currentColor" className="text-secondary" />
              Run Monitoring Cycle
            </>
          )}
        </button>
      
      </div>

      <div className="mt-12 mb-8 border-t border-border pt-8" />
      <ExecutiveAccordion
        title="Painel de Monitoramento de Risco e Incidentes"
        subtitle="Analise os alertas fiduciários ativos e métricas de execução."
        variant="analytics"
        defaultExpanded
      >

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
                    ? formatter.date(lastExecution.timestamp, { hour: '2-digit', minute: '2-digit' })
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
       <ExecutiveSummarySection 
         status={{ label: 'Monitoramento Ativo', variant: 'success' }}
         question="Qual a telemetria de risco sistêmico e estabilidade dos alertas?"
         opinion="O comitê fiduciário homologa os motores de vigilância contínua para contenção antecipada de anomalias."
         driver="Vigilância de liquidez, incidentes mapeados, score de confidence e logs de auditoria."
         implication="Resposta em tempo real a discrepâncias operacionais ou financeiras."
         executiveQuestion="Acompanhar os feeds de alertas críticos diariamente no dashboard executivo."
       >
         <ExecutiveStrategicTensions tensions={[]} />
         <ExecutiveDecisionTrace trace={[]} />
       </ExecutiveSummarySection>
      </div>
      </ExecutiveAccordion>
    </ExecutivePageTemplate>
  );
}
