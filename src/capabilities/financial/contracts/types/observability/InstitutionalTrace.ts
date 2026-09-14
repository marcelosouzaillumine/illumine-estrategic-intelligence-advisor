import { CorrelationContext, RuntimeContext } from "../../../../../types/observability/CorrelationContext";
import { RuntimeLineage } from "../../../../../types/observability/RuntimeLineage";
import { DecisionChain } from "../../../../../types/observability/DecisionChain";

export interface InstitutionalTrace {
  traceId: string;
  correlationContext: CorrelationContext;
  runtimeContext: RuntimeContext;
  lineage: RuntimeLineage;
  decisionChain?: DecisionChain;
  timestamp: string;
}
