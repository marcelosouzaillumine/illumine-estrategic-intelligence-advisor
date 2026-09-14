import { GovernanceIncident, GovernanceIncidentStatus } from './types';

export class ExecutiveSupervisionEngine {
  /**
   * Filtra e prioriza incidentes para consumo executivo de forma a mitigar a fadiga de decisão.
   * NUNCA oculta ou colapsa incidentes de severidade SYSTEMIC ou CRITICAL, ou que estejam em estado de FAIL_CLOSED.
   * Não recalcula severidades originais nem altera o significado fiduciário dos registros.
   */
  public static prioritizeForExecutive(
    items: Array<{ incident: GovernanceIncident; currentStatus: GovernanceIncidentStatus }>,
    maxVisibleSecondary: number = 3
  ): Array<{ incident: GovernanceIncident; currentStatus: GovernanceIncidentStatus; isCollapsed: boolean }> {
    const result: Array<{ incident: GovernanceIncident; currentStatus: GovernanceIncidentStatus; isCollapsed: boolean }> = [];

    // Separar críticos (nunca colapsam) e secundários
    const criticalItems = items.filter(
      item =>
        item.incident.severity === 'SYSTEMIC' ||
        item.incident.severity === 'CRITICAL' ||
        item.currentStatus === 'FAIL_CLOSED'
    );

    const secondaryItems = items.filter(
      item =>
        item.incident.severity !== 'SYSTEMIC' &&
        item.incident.severity !== 'CRITICAL' &&
        item.currentStatus !== 'FAIL_CLOSED'
    );

    // Críticos vão direto com isCollapsed = false
    criticalItems.forEach(item => {
      result.push({ ...item, isCollapsed: false });
    });

    // Secundários são limitados: se houver algum item crítico, colapsamos todos os secundários para mitigar fadiga.
    // Caso contrário, os primeiros N ficam abertos, o resto colapsa.
    const hasCritical = criticalItems.length > 0;
    secondaryItems.forEach((item, index) => {
      const shouldCollapse = hasCritical || index >= maxVisibleSecondary;
      result.push({ ...item, isCollapsed: shouldCollapse });
    });

    return result;
  }
}
