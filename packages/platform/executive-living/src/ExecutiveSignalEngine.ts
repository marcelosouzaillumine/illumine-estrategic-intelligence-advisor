import { ExecutiveSignalContract } from '@illumine/executive-contracts';
import { ExecutiveEventStreamItem } from './ExecutiveAwarenessEngine';

export class ExecutiveSignalEngine {
  public static convertEventsToSignals(events: ExecutiveEventStreamItem[]): ExecutiveSignalContract[] {
    return events.map((evt) => ({
      signalId: `sig-${evt.eventId}`,
      eventId: evt.eventId,
      severity: evt.severity,
      title: `${evt.category}: ${evt.impactDescription}`,
      descriptionText: evt.impactDescription,
      priorityScore: evt.priority,
      expectedImpactText: `Impacto direto na liquidez e governança corporativa (${evt.origin}).`,
      urgencyLevel: evt.severity === 'CRITICAL' ? 'IMMEDIATE' : evt.severity === 'IMPORTANT' ? 'HIGH' : 'MODERATE',
      nonActionConsequenceText: 'Nossa ausência de ação pode comprometer a meta trimestral de EBITDA.',
      explainabilityJustificationText: `Sinal derivado de evidência empírica: ${evt.evidenceText}`,
      evidenceReferences: [evt.evidenceText]
    }));
  }
}
