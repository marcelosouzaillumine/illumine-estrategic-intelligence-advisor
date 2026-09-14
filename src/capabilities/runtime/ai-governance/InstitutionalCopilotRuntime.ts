import { AIQueryRequest, AIQueryResponse, AIGroundingReference } from './AIGovernanceTypes';
import { AIPromptPolicyEngine } from './AIPromptPolicyEngine';
import { AIContextResolver } from './AIContextResolver';
import { AIResponseGroundingEngine } from './AIResponseGroundingEngine';
import { AIHallucinationGuard } from './AIHallucinationGuard';
import { AITraceBinder } from './AITraceBinder';
import { AIUsageAuditLogger } from './AIUsageAuditLogger';
import { LLMProvider } from './providers/LLMProvider';
import { TenantIsolationKernel } from '../../../../packages/security/tenant-isolation-kernel/src';
import { CognitiveTrustGate } from '../../../../packages/security/cognitive-trust-gate/src';

export class InstitutionalCopilotRuntime {
  private provider: LLMProvider;

  constructor(provider: LLMProvider) {
    this.provider = provider;
  }

  async processQuery(request: AIQueryRequest): Promise<AIQueryResponse> {
    const traceId = `AITRACE-TEMP-${Date.now()}`;
    const ctx = request.tenantIsolationContext;

    // 0. Kernel Validation
    TenantIsolationKernel.validateContext(ctx);

    AIUsageAuditLogger.logEvent('AI_QUERY_STARTED', traceId, ctx.tenantId);

    // 1. Policy Evaluation
    const policy = AIPromptPolicyEngine.evaluate(request.query);
    if (!policy.actionAllowed) {
      AIUsageAuditLogger.logEvent('AI_POLICY_BLOCKED', traceId, ctx.tenantId, { reason: policy.violationReason });
      return {
        answer: '',
        groundingReferences: [],
        blocked: true,
        blockReason: policy.violationReason,
        aiTraceId: traceId,
        riskLevel: 'BLOCKED_BY_POLICY'
      };
    }

    // 2. Resolve Context
    const allowedContexts = await AIContextResolver.resolveContext(request);
    AIUsageAuditLogger.logEvent('AI_CONTEXT_RESOLVED', traceId, ctx.tenantId, { count: allowedContexts.length });

    // 3. Grounding Extraction
    let groundings: AIGroundingReference[];
    try {
      groundings = AIResponseGroundingEngine.extractGrounding(allowedContexts);
    } catch (e: unknown) {
      AIUsageAuditLogger.logEvent('AI_GROUNDING_FAILED', traceId, ctx.tenantId);
      return {
        answer: 'INSUFFICIENT_GROUNDED_CONTEXT: Não possuo base institucional suficiente para responder.',
        groundingReferences: [],
        blocked: true,
        blockReason: 'Falta de Contexto Fiduciário',
        aiTraceId: traceId,
        riskLevel: 'BLOCKED_BY_POLICY'
      };
    }

    // 4. Generate Response (LLM)
    const rawResponse = await this.provider.generateResponse(request.query, allowedContexts);

    // 5. Hallucination Guard
    const guardedResponse = AIHallucinationGuard.validate(rawResponse, allowedContexts);
    
    // 6. Trace Binding
    const finalTrace = AITraceBinder.bind(
      ctx.tenantId,
      ctx.organizationId, // Fallback to organizationId for workspaceId compatibility
      ctx.userId,
      request.query,
      allowedContexts.map(c => c.contextId),
      groundings,
      'HASH-MOCK-RESPONSE',
      guardedResponse.riskLevel
    );

    // 6.5 Cognitive Trust Gate Enforcement
    CognitiveTrustGate.enforceRelease(ctx, {
      content: guardedResponse.answer,
      evidenceUsed: groundings,
      generationTraceId: finalTrace.aiTraceId
    });

    AIUsageAuditLogger.logEvent('AI_RESPONSE_GENERATED', finalTrace.aiTraceId, ctx.tenantId);

    return {
      answer: guardedResponse.answer,
      groundingReferences: groundings,
      blocked: false,
      aiTraceId: finalTrace.aiTraceId,
      riskLevel: finalTrace.riskLevel
    };
  }
}
