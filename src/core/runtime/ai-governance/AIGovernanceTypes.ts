export interface AIGroundingReference {
  sourceType: 'REPORT' | 'SNAPSHOT' | 'TRACE' | 'VIOLATION' | 'SCENARIO';
  sourceId: string;
  executionId: string;
  reportVersion?: string;
  lineageHash: string;
  confidence: string;
  timestamp: string;
}

export interface AIQueryRequest {
  query: string;
  tenantId: string;
  workspaceId: string;
  userId: string;
  role: string;
  requestedContexts: string[];
}

export interface AIQueryResponse {
  answer: string;
  groundingReferences: AIGroundingReference[];
  blocked: boolean;
  blockReason?: string;
  aiTraceId: string;
  riskLevel: AIResponseRisk;
}

export type AIResponseRisk = 'LOW' | 'MEDIUM' | 'HIGH' | 'BLOCKED_BY_POLICY';

export interface AIAllowedContext {
  contextId: string;
  payload: any;
  lineageHash: string;
}

export interface AIPromptPolicy {
  actionAllowed: boolean;
  violationReason?: string;
}

export interface AITraceRecord {
  aiTraceId: string;
  tenantId: string;
  workspaceId: string;
  userId: string;
  query: string;
  contextSources: string[];
  groundingReferences: AIGroundingReference[];
  responseHash: string;
  riskLevel: AIResponseRisk;
  timestamp: string;
}

export interface AIUsageAuditRecord {
  auditId: string;
  aiTraceId: string;
  event: 'AI_QUERY_STARTED' | 'AI_CONTEXT_RESOLVED' | 'AI_POLICY_BLOCKED' | 'AI_RESPONSE_GENERATED' | 'AI_RESPONSE_BLOCKED' | 'AI_GROUNDING_FAILED' | 'AI_SESSION_CLOSED';
  tenantId: string;
  timestamp: string;
  metadata?: any;
}

export interface InstitutionalCopilotSession {
  sessionId: string;
  tenantId: string;
  workspaceId: string;
  history: { role: 'user' | 'assistant', content: string }[];
}
