// src/core/runtime/audit-assurance/InstitutionalForensicsEngine.ts
//
// Institutional Forensics Engine
// Scans execution trails to detect destructive patterns, recurring loops, and structural fiduciary breaches.

import { AuditTrailEntry } from './audit-types';

export interface ForensicsFinding {
  type: 'DESTRUCTIVE_PATTERN' | 'FIDUCIARY_BREACH' | 'FAILURE_LOOP';
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: string;
}

export class InstitutionalForensicsEngine {
  /**
   * Performs forensics analysis on historical execution trails to isolate structural decay.
   */
  public analyzeTrails(trails: AuditTrailEntry[]): ForensicsFinding[] {
    const findings: ForensicsFinding[] = [];
    if (!trails || trails.length === 0) {
      return findings;
    }

    // 1. Detect Fiduciary Breaches: execution during fail-closed propagation without proper containment
    const breachSteps = trails.filter(
      entry => entry.failClosedPropagation && entry.severityState !== 'FAIL_CLOSED' && entry.severityState !== 'CRITICAL'
    );
    if (breachSteps.length > 0) {
      findings.push({
        type: 'FIDUCIARY_BREACH',
        description: `Identificados ${breachSteps.length} eventos executados sob fail-closed ativo sem mitigação imediata de severidade.`,
        severity: 'CRITICAL',
        timestamp: new Date().toISOString()
      });
    }

    // 2. Detect Destructive Patterns: high frequency of critical alerts indicating structural stress
    const criticalSteps = trails.filter(
      entry => entry.severityState === 'CRITICAL' || entry.severityState === 'BLOCKED'
    );
    if (criticalSteps.length >= 3) {
      findings.push({
        type: 'DESTRUCTIVE_PATTERN',
        description: `Acúmulo de estados críticos/bloqueados (${criticalSteps.length} instâncias) indica fadiga estrutural ou instabilidade recorrente.`,
        severity: 'HIGH',
        timestamp: new Date().toISOString()
      });
    }

    // 3. Detect Failure Loops: repeated entry into fail-closed states
    const failClosedStates = trails.filter(entry => entry.severityState === 'FAIL_CLOSED');
    if (failClosedStates.length > 1) {
      findings.push({
        type: 'FAILURE_LOOP',
        description: `Loop de falha sistêmica detectado: reentrada no estado FAIL_CLOSED por ${failClosedStates.length} vezes.`,
        severity: 'CRITICAL',
        timestamp: new Date().toISOString()
      });
    }

    return findings;
  }
}
