import { CorrelationContext, RuntimeContext } from "../../types/observability/CorrelationContext";
import { RuntimeLineage } from "../../types/observability/RuntimeLineage";
import { DecisionChain } from "../../types/observability/DecisionChain";
import { InstitutionalTrace } from "../../types/observability/InstitutionalTrace";

export class TraceChainBuilder {
  private correlationContext?: CorrelationContext;
  private runtimeContext?: RuntimeContext;
  private lineage?: RuntimeLineage;
  private decisionChain?: DecisionChain;

  createCorrelationContext(tenantId: string, userId: string, role: string, clientId?: string): this {
    this.correlationContext = {
      correlationId: `CORR-${crypto.randomUUID()}`,
      tenantId,
      userId,
      role,
      clientId
    };
    return this;
  }

  attachTenantContext(tenantId: string): this {
    if (this.correlationContext) {
      this.correlationContext.tenantId = tenantId;
    }
    return this;
  }

  attachRuntimeContext(engineId: string, engineVersion: string, runtimeAuthority: string): this {
    this.runtimeContext = { engineId, engineVersion, runtimeAuthority };
    return this;
  }

  attachInputLineage(sourceType: RuntimeLineage["sourceType"], sourceId: string): this {
    this.lineage = {
      lineageId: `LIN-${crypto.randomUUID()}`,
      sourceType,
      sourceId,
      timestamp: new Date().toISOString()
    };
    return this;
  }

  attachDecisionOutput(decisionChainId: string, engineId: string, actionTaken: string): this {
    if (!this.decisionChain) {
      this.decisionChain = {
        decisionChainId,
        originCorrelationId: this.correlationContext?.correlationId || "",
        decisions: []
      };
    }
    
    this.decisionChain.decisions.push({
      decisionId: `DEC-${crypto.randomUUID()}`,
      engineId,
      actionTaken,
      timestamp: new Date().toISOString()
    });
    
    return this;
  }

  finalizeTrace(): InstitutionalTrace {
    if (!this.correlationContext || !this.runtimeContext || !this.lineage) {
      throw new Error("Trace cannot be finalized without Context and Lineage");
    }

    return {
      traceId: `TRC-${crypto.randomUUID()}`,
      correlationContext: this.correlationContext,
      runtimeContext: this.runtimeContext,
      lineage: this.lineage,
      decisionChain: this.decisionChain,
      timestamp: new Date().toISOString()
    };
  }
}
