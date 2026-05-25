import { MonitoringAlertRegistry } from './MonitoringAlertRegistry';
import { MonitoringRuleEngine } from './MonitoringRuleEngine';
import { MonitoringAlert } from './MonitoringTypes';

export class InstitutionalMonitoringEngine {
  /**
   * Avalia todo o ecossistema institucional disponível no momento da execução.
   * Não recalcula nada, apenas submete o estado às regras.
   */
  static runCycle(tenantId: string, workspaceId: string, availableContexts: any[]): MonitoringAlert[] {
    const generatedAlerts: MonitoringAlert[] = [];

    for (const ctx of availableContexts) {
      // Garante que o contexto não cruza a fronteira do tenant antes de avaliar
      if (ctx.tenantId !== tenantId) {
        console.error(`[InstitutionalMonitoringEngine] Bloqueio Crítico: Tentativa de avaliar contexto de outro tenant (${ctx.tenantId}) no tenant atual (${tenantId}).`);
        continue;
      }

      const alerts = MonitoringRuleEngine.runRules(ctx);
      alerts.forEach(alert => {
        generatedAlerts.push(alert);
        MonitoringAlertRegistry.persistAlert(alert);
      });
    }

    return generatedAlerts;
  }
}
