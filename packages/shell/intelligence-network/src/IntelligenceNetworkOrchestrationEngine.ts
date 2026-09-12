import { IntelligenceNetworkContract } from '@illumine/executive-contracts';
import { ExecutiveContextAssembler } from './ExecutiveContextAssembler';
import { ExecutiveContextEnrichment } from './ExecutiveContextEnrichment';
import { ExecutiveContextValidator } from './ExecutiveContextValidator';
import { ExecutivePolicyEngine } from './ExecutivePolicyEngine';
import { IntelligenceRoutingEngine } from './IntelligenceRoutingEngine';
import { IntelligenceObservabilityEngine } from './IntelligenceObservabilityEngine';

export class IntelligenceNetworkOrchestrationEngine {
  public static orchestrateNetwork(companyId: string, domain: string): IntelligenceNetworkContract {
    const rawContext = ExecutiveContextAssembler.assembleBaseContext(companyId, domain);
    const enrichedContext = ExecutiveContextEnrichment.enrichContext(rawContext);
    const validatedContext = ExecutiveContextValidator.validateEnvelope(enrichedContext);

    const evaluatedPolicy = ExecutivePolicyEngine.evaluatePolicy(validatedContext);

    if (!evaluatedPolicy.isExecutionAllowed) {
      const failedRoute = IntelligenceRoutingEngine.routeContext(validatedContext);
      const obsTrace = IntelligenceObservabilityEngine.recordTrace(validatedContext, evaluatedPolicy, failedRoute);

      return {
        networkOrchestrationId: `net-orch-${companyId}-${Date.now()}`,
        companyId,
        contextEnvelope: validatedContext,
        evaluatedPolicy,
        activeRoute: failedRoute,
        observabilityTrace: obsTrace,
        status: 'POLICY_BLOCKED'
      };
    }

    const activeRoute = IntelligenceRoutingEngine.routeContext(validatedContext);
    const observabilityTrace = IntelligenceObservabilityEngine.recordTrace(validatedContext, evaluatedPolicy, activeRoute);

    return {
      networkOrchestrationId: `net-orch-${companyId}-${Date.now()}`,
      companyId,
      contextEnvelope: validatedContext,
      evaluatedPolicy,
      activeRoute,
      observabilityTrace,
      status: 'ORCHESTRATED_SUCCESS'
    };
  }
}
