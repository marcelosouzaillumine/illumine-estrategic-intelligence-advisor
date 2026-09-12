// src/core/runtime/pilot-operations/PilotObservabilityEngine.ts

import { PilotTelemetryEvent } from './types';

export class PilotObservabilityEngine {
  /**
   * Log an operational telemetry event safely, sanitizing inputs.
   */
  public static logEvent(
    tenantId: string,
    actorId: string,
    actionType: string,
    durationMs?: number,
    hasError?: boolean,
    rawPayload?: any
  ): PilotTelemetryEvent {
    // SECURITY CONTRAINT: Never log raw payloads or query parameters to avoid data leakage
    if (rawPayload) {
      const sensitiveKeys = ['bpData', 'dreData', 'financials', 'justification', 'password', 'token', 'comment'];
      const keys = Object.keys(rawPayload);
      const containsSensitive = keys.some(k => sensitiveKeys.includes(k.toLowerCase()) || k.includes('Value') || k.includes('Data'));
      
      if (containsSensitive) {
        throw new Error('VIOLAÇÃO DE GOVERNANÇA TELEMETRIA: Bloqueio de log contendo dados sensíveis de negócio ou inputs executivos.');
      }
    }

    // Strict validation
    if (!tenantId || !actorId || !actionType) {
      throw new Error('VIOLAÇÃO DE CONTEXTO: Evento de telemetria requer tenantId, actorId e actionType.');
    }

    return {
      eventId: `EV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      tenantId,
      actorId,
      actionType,
      timestamp: new Date().toISOString(),
      durationMs,
      hasError: !!hasError
    };
  }

  /**
   * Calculate interaction velocity (events per minute/cycle) and detect cognitive friction/overloads.
   */
  public static analyzeCognitiveSignals(
    events: PilotTelemetryEvent[],
    timeWindowSeconds: number = 60
  ) {
    const now = Date.now();
    const windowStart = now - (timeWindowSeconds * 1000);

    const recentEvents = events.filter(e => new Date(e.timestamp).getTime() >= windowStart);
    const interactionVelocity = recentEvents.length;

    // A velocity greater than 20 operations per minute suggests potential executive cognitive panic/looping
    let status: 'NORMAL' | 'HIGH' | 'CRITICAL' = 'NORMAL';
    let overloadsCount = 0;

    if (interactionVelocity > 25) {
      status = 'CRITICAL';
      overloadsCount = Math.floor((interactionVelocity - 25) / 5) + 1;
    } else if (interactionVelocity > 10) {
      status = 'HIGH';
      overloadsCount = 1;
    }

    return {
      interactionVelocity,
      status,
      overloadsCount,
      analyzedAt: new Date().toISOString()
    };
  }
}
