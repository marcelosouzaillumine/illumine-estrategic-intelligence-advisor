import { TrustValidationResult } from '../contracts/TrustValidationContracts';

export interface ExecutiveCognitiveTrace {
  traceId: string;
  tenantId: string;
  userIdentity: string;
  memoriesRetrieved: any[];
  embeddingsUsed: any[];
  agentsInvoked: string[];
  reasoningVersions: any[];
  evidenceChain: any[];
  trustValidation: TrustValidationResult | null;
  finalDecision: 'ALLOWED' | 'BLOCKED';
  timestamp: Date;
}

export class ExecutiveCognitiveTraceLogger {
  private static traces: Map<string, ExecutiveCognitiveTrace> = new Map();

  static initializeTrace(traceId: string, tenantId: string, userIdentity: string): void {
    this.traces.set(traceId, {
      traceId,
      tenantId,
      userIdentity,
      memoriesRetrieved: [],
      embeddingsUsed: [],
      agentsInvoked: [],
      reasoningVersions: [],
      evidenceChain: [],
      trustValidation: null,
      finalDecision: 'BLOCKED',
      timestamp: new Date()
    });
  }

  static getTrace(traceId: string): ExecutiveCognitiveTrace | undefined {
    return this.traces.get(traceId);
  }

  static commitTrace(traceId: string, update: Partial<ExecutiveCognitiveTrace>): void {
    const existing = this.traces.get(traceId);
    if (existing) {
      this.traces.set(traceId, { ...existing, ...update });
    }
  }

  static finalizeTrace(traceId: string, trustValidation: TrustValidationResult): ExecutiveCognitiveTrace {
    const existing = this.traces.get(traceId);
    if (!existing) {
      throw new Error(`[ExecutiveCognitiveTrace] Trace ${traceId} not found`);
    }
    
    const finalizedTrace: ExecutiveCognitiveTrace = {
      ...existing,
      trustValidation,
      finalDecision: trustValidation.isAllowed ? 'ALLOWED' : 'BLOCKED'
    };
    
    this.traces.set(traceId, finalizedTrace);
    return finalizedTrace;
  }
}
