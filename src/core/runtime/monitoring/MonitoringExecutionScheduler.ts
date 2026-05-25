import { InstitutionalMonitoringEngine } from './InstitutionalMonitoringEngine';
import { MonitoringAlertRegistry } from './MonitoringAlertRegistry';
import { MonitoringExecutionRecord } from './MonitoringTypes';

export class MonitoringExecutionScheduler {
  /**
   * Executa um ciclo manual de monitoramento (MVP).
   * No futuro, isso será migrado para um worker nodejs.
   */
  static runManualCycle(tenantId: string, workspaceId: string, mockContexts: any[]) {
    console.log(`[MonitoringExecutionScheduler] Iniciando ciclo de monitoramento MANUAL para ${tenantId}/${workspaceId}`);
    
    const start = performance.now();
    let generatedCount = 0;
    
    try {
      const alerts = InstitutionalMonitoringEngine.runCycle(tenantId, workspaceId, mockContexts);
      generatedCount = alerts.length;
      
      const record: MonitoringExecutionRecord = {
        monitoringExecutionId: `MON-EXEC-${Date.now()}`,
        tenantId,
        scheduleMode: 'MANUAL',
        alertsGenerated: generatedCount,
        durationMs: performance.now() - start,
        timestamp: new Date().toISOString(),
        status: 'SUCCESS'
      };
      
      MonitoringAlertRegistry.persistExecution(record);
      console.log(`[MonitoringExecutionScheduler] Ciclo concluído. ${generatedCount} alertas gerados.`);
    } catch (e) {
      console.error(`[MonitoringExecutionScheduler] Falha catastrófica no ciclo.`, e);
      MonitoringAlertRegistry.persistExecution({
        monitoringExecutionId: `MON-EXEC-${Date.now()}`,
        tenantId,
        scheduleMode: 'MANUAL',
        alertsGenerated: 0,
        durationMs: performance.now() - start,
        timestamp: new Date().toISOString(),
        status: 'FAILED'
      });
    }
  }
}
