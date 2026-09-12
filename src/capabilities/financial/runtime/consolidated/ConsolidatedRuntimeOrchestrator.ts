import { ExecutiveIntelligenceRuntime, ExecutiveIntelligenceReport } from '../../core/runtime/executive-intelligence-runtime';
import { ConsolidatedOrchestratorInput } from './consolidated-types';
import { MultiEntityExecutionPlanner } from './MultiEntityExecutionPlanner';
import { EntityRuntimeExecutor } from './EntityRuntimeExecutor';
import { ConsolidatedOutputAssembler } from './ConsolidatedOutputAssembler';
import { IntercompanyEliminationEngine } from './IntercompanyEliminationEngine';
import { ConsolidatedStressPropagationEngine } from './stress/ConsolidatedStressPropagationEngine';
import { TenantGovernanceEnforcer, TenantExecutionContext, LegacyTenantContextAdapter } from '../tenancy/hardening';
import { RuntimeTelemetryEngine } from '../telemetry/RuntimeTelemetryEngine';
import { OrchestrationProfiler } from '../performance/OrchestrationProfiler';
import { DAGExecutionOptimizer } from '../performance/DAGExecutionOptimizer';
import { LazyExecutionCoordinator } from '../performance/LazyExecutionCoordinator';
import { RuntimePerformanceMonitor } from '../performance/RuntimePerformanceMonitor';
import { tenantScopedRuntimeCache } from '../performance/TenantScopedRuntimeCache';
import { SovereignCacheKey } from '../performance/types';

export class ConsolidatedRuntimeOrchestrator {
  private planner: MultiEntityExecutionPlanner;
  private executor: EntityRuntimeExecutor;
  private assembler: ConsolidatedOutputAssembler;
  private legacyRuntime: ExecutiveIntelligenceRuntime;
  private eliminationEngine: IntercompanyEliminationEngine;
  private stressEngine: ConsolidatedStressPropagationEngine;

  constructor() {
    this.planner = new MultiEntityExecutionPlanner();
    this.executor = new EntityRuntimeExecutor();
    this.assembler = new ConsolidatedOutputAssembler();
    this.legacyRuntime = new ExecutiveIntelligenceRuntime();
    this.eliminationEngine = new IntercompanyEliminationEngine();
    this.stressEngine = new ConsolidatedStressPropagationEngine();
  }

  /**
   * Ponto de entrada oficial para a execução consolidadada.
   * Se receber um payload legacy (sem entities), roda em modo pass-through (Single-Entity).
   */
  public runConsolidatedAnalysis(input: any): ExecutiveIntelligenceReport {
    
    // 1. Detectar Single-Entity (Pass-Through)
    const rawInput = input as Record<string, unknown>;
    if (!rawInput.entities || !Array.isArray(rawInput.entities) || rawInput.entities.length === 0) {
      console.log('[ConsolidatedRuntimeOrchestrator] Single-Entity Mode detectado. Executando pass-through.');
      
      // Condição 1: Adapter apenas para single-entity legados se o tenantContext não existir
      let contextToValidate = rawInput.tenantContext;
      if (!contextToValidate) {
         contextToValidate = LegacyTenantContextAdapter.createLegacyContext(
           (rawInput.entityId as string) || 'legacy_single_entity'
         );
      }
      
      TenantGovernanceEnforcer.enforceConsolidationBoundaries(
        contextToValidate as TenantExecutionContext,
        [], // não há entities explícitas aqui
        { groupId: (rawInput.groupId as string) || 'default', nodes: [], edges: [], intercompanyOperations: [] }
      );

      return this.legacyRuntime.generateExecutiveReport(input as unknown as Record<string, unknown>);
    }

    const typedInput = input as unknown as ConsolidatedOrchestratorInput;

    // Fail-Closed Validation
    TenantGovernanceEnforcer.enforceConsolidationBoundaries(
      typedInput.tenantContext,
      typedInput.entities as unknown as never[], // Assuming TenantGovernanceEnforcer expects EntityGraphNode[]
      { groupId: typedInput.groupId, nodes: [], edges: [], intercompanyOperations: [] } // Fake topology para satisfazer contrato temporariamente, depois podemos pegar a real
    );

    const telemetrySession = RuntimeTelemetryEngine.startTelemetrySession(
      typedInput.tenantContext.tenantId,
      `EXEC-${Date.now()}`,
      `CORR-${Date.now()}`,
      typedInput.tenantContext.runtimeScope,
      'CONSOLIDATION_TOPOLOGY'
    );

    const { optimizedNodes, cycleWarnings } = DAGExecutionOptimizer.optimizeTopology({
      groupId: typedInput.groupId,
      nodes: typedInput.entities.map(e => ({ id: e.entityId, tenantId: typedInput.tenantContext.tenantId, name: e.entityId, type: 'LEGAL_ENTITY', ownershipPercentage: 100 })),
      edges: [],
      intercompanyOperations: []
    });

    if (typedInput.entities.length === 1) {
       console.log('[ConsolidatedRuntimeOrchestrator] Single-Entity (1 nó na topologia) detectado. Executando pass-through.');
       return this.legacyRuntime.generateExecutiveReport(typedInput.entities[0].rawData);
    }

    console.log(`[ConsolidatedRuntimeOrchestrator] Multi-Entity Mode detectado para ${typedInput.entities.length} entidades.`);

    // 2. Multi-Entity Execution Pipeline
    const executionPlan = this.planner.planExecution(typedInput);
    
    const { result: reportsMap, elapsedMs: executionCost } = OrchestrationProfiler.profile('Entities Execution', () => {
      const map = new Map<string, ExecutiveIntelligenceReport>();
      for (const entityInput of executionPlan) {
        const report = this.executor.execute(entityInput);
        map.set(entityInput.entityId, report);
      }
      return map;
    });

    // 2.5 Fase 3: Intercompany Elimination Engine
    const eliminationResult = this.eliminationEngine.executeElimination(typedInput);

    // 2.7 Fase 4: Consolidated Stress Propagation Engine
    const stressExecution = LazyExecutionCoordinator.executeSafely(
      'ConsolidatedStressPropagation',
      false, // Não é permitido deferred default para stress core ainda, apenas se a interface solicitar (mantido false para retrocompatibilidade)
      true, // Temos os dados
      () => this.stressEngine.propagateStress(
        typedInput, 
        reportsMap, 
        eliminationResult.eliminatedEntries, 
        eliminationResult.unreconciledIntercompany
      )
    );

    const stressProfile = stressExecution.data!;

    // 3. Assembler
    const consolidatedReport = this.assembler.assemble(typedInput.groupId, reportsMap, eliminationResult, stressProfile);

    // Finaliza telemetria passiva
    const telemetryData = RuntimeTelemetryEngine.endTelemetrySession(telemetrySession);
    if (telemetryData) {
      const warnings = RuntimePerformanceMonitor.analyzeTelemetry(telemetryData);
      if (warnings.length > 0) {
        console.warn(`[RuntimePerformanceMonitor] Warnings: `, warnings);
      }
    }

    return consolidatedReport;
  }
}
