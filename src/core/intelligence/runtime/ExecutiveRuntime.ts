import { ExecutiveSession, ExecutionMode, ReasoningMode } from './ExecutiveSession';
import { ExecutiveReasoningContext } from '../contracts/ExecutiveReasoningContext';
import { ExecutiveIntelligenceOutput } from '../contracts/ExecutiveIntelligenceOutput';
import { CapabilityResolver } from './CapabilityResolver';
import { EventPublisher } from './contracts/Event';

export interface RuntimeConfig {
  version: string;
  featureFlags: Record<string, boolean>;
  globalVariables: Record<string, any>;
}

export class ExecutiveRuntime {
  private activeSessions: Map<string, ExecutiveSession> = new Map();
  private eventPublisher?: EventPublisher;

  constructor(
    private readonly config: RuntimeConfig,
    private readonly capabilityResolver: CapabilityResolver,
    eventPublisher?: EventPublisher
  ) {
    this.eventPublisher = eventPublisher;
  }

  public createSession(
    userId: string,
    workspaceId: string,
    capabilityId: string,
    executionMode: ExecutionMode,
    reasoningMode: ReasoningMode,
    context: ExecutiveReasoningContext
  ): ExecutiveSession {
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const executionId = `exec_${Date.now()}`;
    const traceId = `trace_${Date.now()}`;
    const correlationId = `corr_${Date.now()}`;

    const session: ExecutiveSession = {
      sessionId,
      executionId,
      correlationId,
      traceId,
      tenantId: 'default_tenant',
      userId,
      workspaceId,
      capabilityId,
      locale: 'pt-BR',
      timezone: 'America/Sao_Paulo',
      executionMode,
      reasoningMode,
      featureFlags: { ...this.config.featureFlags },
      runtimeVariables: { ...this.config.globalVariables },
      runtimeVersion: this.config.version,
      knowledgeVersion: '1.0.0', // To be fetched dynamically in the future
      ontologyVersion: '1.0.0',
      context,
      memory: {
        retrieveRelevantMemories: async () => [],
        storeMemory: async () => {},
        getMemoryTrace: () => []
      } // Dummy memory for now
    };

    this.activeSessions.set(sessionId, session);
    return session;
  }

  public async execute(
    session: ExecutiveSession,
    rawInput: any,
    executionStages: Array<(session: ExecutiveSession, data: any) => Promise<any>>
  ): Promise<ExecutiveIntelligenceOutput> {
    const startTime = Date.now();

    try {
      // 1. Resolve Adapter and Normalize Input
      const adapter = this.capabilityResolver.resolve(session.capabilityId);
      let currentData = await adapter.adapt(rawInput);

      // 2. Execute Stages Sequentially
      for (const stage of executionStages) {
        currentData = await stage(session, currentData);
      }

      // Output should have been constructed by the final stage (e.g., GovernancePipeline)
      const output = currentData as ExecutiveIntelligenceOutput;

      // Ensure meta is injected
      output.meta = {
        runtimeVersion: session.runtimeVersion,
        knowledgeVersion: session.knowledgeVersion,
        ontologyVersion: session.ontologyVersion,
        processingTimeMs: Date.now() - startTime,
        pipelineId: 'default_pipeline', // In future, this comes from a Pipeline Graph
        sessionId: session.sessionId,
        executionId: session.executionId,
      };

      return output;
    } catch (error: any) {
      // In a real scenario, handle error, publish event, etc.
      throw new Error(`Execution failed: ${error.message}`);
    } finally {
      this.activeSessions.delete(session.sessionId);
    }
  }
}
