import { useState, useEffect } from 'react';
import { MonitoringExecutionScheduler, MonitoringAlertRegistry, MonitoringAlert } from '../../../../services/FiduciaryRuntimeAdapter';

export function useInstitutionalMonitoringViewModel() {
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

  const lastExecution = MonitoringAlertRegistry.getExecutions().slice(-1)[0];

  return {
    alerts,
    isRunning,
    lastExecution,
    handleRunCycle
  };
}
