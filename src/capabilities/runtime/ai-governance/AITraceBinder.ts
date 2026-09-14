import { AITraceRecord, AIResponseRisk, AIGroundingReference } from './AIGovernanceTypes';

export class AITraceBinder {
  static bind(
    tenantId: string, 
    workspaceId: string, 
    userId: string, 
    query: string, 
    contextSources: string[], 
    groundingReferences: AIGroundingReference[], 
    responseHash: string, 
    riskLevel: AIResponseRisk
  ): AITraceRecord {
    return {
      aiTraceId: `AITRACE-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      tenantId,
      workspaceId,
      userId,
      query,
      contextSources,
      groundingReferences,
      responseHash,
      riskLevel,
      timestamp: new Date().toISOString()
    };
  }
}
