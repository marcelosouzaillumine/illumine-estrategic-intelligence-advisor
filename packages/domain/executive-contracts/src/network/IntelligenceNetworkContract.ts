import { ExecutiveContextEnvelope } from './ExecutiveContextEnvelope';
import { ExecutivePolicyContract } from './ExecutivePolicyContract';
import { IntelligenceRouteContract } from './IntelligenceRouteContract';
import { IntelligenceObservabilityContract } from './IntelligenceObservabilityContract';

export interface IntelligenceNetworkContract {
  readonly networkOrchestrationId: string;
  readonly companyId: string;
  readonly contextEnvelope: ExecutiveContextEnvelope;
  readonly evaluatedPolicy: ExecutivePolicyContract;
  readonly activeRoute: IntelligenceRouteContract;
  readonly observabilityTrace: IntelligenceObservabilityContract;
  readonly status: 'ORCHESTRATED_SUCCESS' | 'POLICY_BLOCKED' | 'ROUTING_FAILED';
}

export * from './ExecutiveContextEnvelope';
export * from './ExecutivePolicyContract';
export * from './IntelligenceCapabilityDescriptor';
export * from './IntelligenceRouteContract';
export * from './IntelligenceObservabilityContract';
