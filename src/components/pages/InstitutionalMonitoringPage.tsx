import React, { useState, useEffect } from 'react';
import { Radar, Play } from 'lucide-react';
import { MonitoringExecutionScheduler } from '../../core/runtime/monitoring/MonitoringExecutionScheduler';
import { MonitoringAlertRegistry } from '../../core/runtime/monitoring/MonitoringAlertRegistry';
import { MonitoringAlert } from '../../core/runtime/monitoring/MonitoringTypes';
import { MonitoringAlertFeed } from '../monitoring/MonitoringAlertFeed';

export function InstitutionalMonitoringPage() {
  const [alerts, setAlerts] = useState<MonitoringAlert[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Mock Tenant
  const mockTenant = 'TENANT-HQ';
  const mockWorkspace = 'WS-1';

  useEffect(() => {
    // Carrega do Registry passivamente ao montar (Simula sync)
    setAlerts(MonitoringAlertRegistry.getActiveAlerts(mockTenant, mockWorkspace));
  }, []);

  const handleRunCycle = () => {
    setIsRunning(true);
    
    // Simula um delay UX para demonstrar o scheduler executando
    setTimeout(() => {
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

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in bg-background min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Radar className="text-primary" />
            Monitoramento Institucional
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Vigilância contínua de Risco Sistêmico, Liquidez e Confidence.
          </p>
        </div>
        
        <button
          onClick={handleRunCycle}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {isRunning ? (
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
              Executando Ciclo...
            </span>
          ) : (
            <>
              <Play size={16} fill="currentColor" />
              Run Scheduled Monitoring Cycle
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 border-r border-border pr-6">
          <h3 className="text-sm font-medium text-foreground mb-4">Métricas Consolidadas</h3>
          <div className="space-y-4">
            <div className="p-4 bg-surface-container rounded-lg border border-border">
              <span className="text-xs text-muted-foreground block">Alertas Ativos</span>
              <span className="text-2xl font-bold text-foreground">{alerts.length}</span>
            </div>
            <div className="p-4 bg-surface-container rounded-lg border border-border">
              <span className="text-xs text-muted-foreground block">Última Execução</span>
              <span className="text-sm font-medium text-foreground">
                {MonitoringAlertRegistry.getExecutions().length > 0 
                  ? new Date(MonitoringAlertRegistry.getExecutions().slice(-1)[0].timestamp).toLocaleTimeString()
                  : 'Pendente'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <h3 className="text-sm font-medium text-foreground mb-4">Alertas Fiduciários (Feed)</h3>
          <MonitoringAlertFeed alerts={alerts} />
        </div>
      </div>
    </div>
  );
}
