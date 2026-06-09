import { CorrelationContext, RuntimeContext } from "./CorrelationContext";
import { RuntimeLineage } from "./RuntimeLineage";
import { DecisionChain } from "./DecisionChain";

export interface InstitutionalTrace {
  traceId: string;
  correlationContext: CorrelationContext;
  runtimeContext: RuntimeContext;
  lineage: RuntimeLineage;
  decisionChain?: DecisionChain;
  timestamp: string;
}
