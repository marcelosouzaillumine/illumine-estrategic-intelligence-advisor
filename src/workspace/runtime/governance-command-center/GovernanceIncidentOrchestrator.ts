import {
  GovernanceIncident,
  GovernanceSupervisionEvent,
  GovernanceIncidentStatus,
  SupervisionActionType,
  GovernanceIncidentSeverity
} from './types';

export class GovernanceIncidentOrchestrator {
  /**
   * Deriva o status atual de um incidente a partir de um fluxo de eventos de supervisão.
   * Mantém o registro do incidente original 100% imutável.
   */
  public static deriveStatus(
    incident: GovernanceIncident,
    events: GovernanceSupervisionEvent[]
  ): GovernanceIncidentStatus {
    const incidentEvents = events
      .filter(e => e.incidentId === incident.incidentId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    if (incidentEvents.length === 0) {
      return 'OPEN';
    }

    const lastEvent = incidentEvents[incidentEvents.length - 1];

    switch (lastEvent.supervisionAction) {
      case 'ACKNOWLEDGE':
        return 'ACKNOWLEDGED';
      case 'SUPERVISION':
        return 'UNDER_SUPERVISION';
      case 'ESCALATION':
        return 'ESCALATED';
      case 'CONTAINMENT':
        return 'CONTAINED';
      case 'RESOLUTION':
        return 'RESOLVED';
      default:
        return 'OPEN';
    }
  }

  /**
   * Cria um novo evento de supervisão append-only para alteração de estado.
   * Não altera o registro do incidente original de forma alguma.
   */
  public static createSupervisionEvent(
    incident: GovernanceIncident,
    action: SupervisionActionType,
    actorId: string,
    details?: string
  ): GovernanceSupervisionEvent {
    // Postura Fail-Closed
    if (!incident.lineageHash || !incident.correlationId || !incident.tenantId) {
      throw new Error('FAIL_CLOSED: Evento de supervisão bloqueado devido a integridade de lineage incompleta.');
    }

    return {
      eventId: `event-${incident.incidentId}-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`, // Math.random ok para geração de ID único (não afeta regras de simulação determinística)
      incidentId: incident.incidentId,
      tenantId: incident.tenantId,
      correlationId: incident.correlationId,
      lineageHash: incident.lineageHash,
      actorId,
      timestamp: new Date().toISOString(),
      supervisionAction: action,
      details
    };
  }

  /**
   * Agrupa incidentes de um inquilino e retorna seu status e ordenação prioritária.
   */
  public static getPrioritizedIncidents(
    incidents: GovernanceIncident[],
    events: GovernanceSupervisionEvent[],
    tenantId: string
  ): Array<{ incident: GovernanceIncident; currentStatus: GovernanceIncidentStatus }> {
    // Isolamento estrito de inquilino (tenant isolation)
    const tenantIncidents = incidents.filter(i => i.tenantId === tenantId);

    return tenantIncidents
      .map(incident => ({
        incident,
        currentStatus: this.deriveStatus(incident, events)
      }))
      .sort((a, b) => {
        // Ordenar por gravidade: SYSTEMIC > CRITICAL > HIGH > MODERATE > LOW
        const severityWeight: Record<GovernanceIncidentSeverity, number> = {
          SYSTEMIC: 5,
          CRITICAL: 4,
          HIGH: 3,
          MODERATE: 2,
          LOW: 1
        };

        const weightA = severityWeight[a.incident.severity] || 0;
        const weightB = severityWeight[b.incident.severity] || 0;

        if (weightA !== weightB) {
          return weightB - weightA;
        }

        // Critério secundário: mais recente primeiro
        return new Date(b.incident.detectedAt).getTime() - new Date(a.incident.detectedAt).getTime();
      });
  }
}
