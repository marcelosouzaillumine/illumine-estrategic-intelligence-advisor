import { ExecutiveReasoningContext } from '../contracts/ExecutiveReasoningContext';
import { ExecutiveMemory } from '../memory/ExecutiveMemory';

export type ExecutionMode = 'Simulation' | 'Production' | 'Replay';
export type ReasoningMode = 'Deterministic' | 'Probabilistic' | 'Hybrid';

export interface ExecutiveSession {
  sessionId: string;
  executionId: string;
  correlationId: string;
  traceId: string;
  tenantId: string;
  userId: string;
  workspaceId: string;
  capabilityId: string;
  
  locale: string;
  timezone: string;
  
  executionMode: ExecutionMode;
  reasoningMode: ReasoningMode;
  
  featureFlags: Record<string, boolean>;
  runtimeVariables: Record<string, any>;
  
  runtimeVersion: string;
  knowledgeVersion: string;
  ontologyVersion: string;

  context: ExecutiveReasoningContext;
  memory: ExecutiveMemory;
}
