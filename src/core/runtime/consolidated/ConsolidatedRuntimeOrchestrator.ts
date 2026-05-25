import { ExecutiveIntelligenceRuntime, ExecutiveIntelligenceReport } from '../executive-intelligence-runtime';
import { ConsolidatedOrchestratorInput } from './consolidated-types';
import { MultiEntityExecutionPlanner } from './MultiEntityExecutionPlanner';
import { EntityRuntimeExecutor } from './EntityRuntimeExecutor';
import { ConsolidatedOutputAssembler } from './ConsolidatedOutputAssembler';
import { IntercompanyEliminationEngine } from './IntercompanyEliminationEngine';

export class ConsolidatedRuntimeOrchestrator {
  private planner: MultiEntityExecutionPlanner;
  private executor: EntityRuntimeExecutor;
  private assembler: ConsolidatedOutputAssembler;
  private legacyRuntime: ExecutiveIntelligenceRuntime;
  private eliminationEngine: IntercompanyEliminationEngine;

  constructor() {
    this.planner = new MultiEntityExecutionPlanner();
    this.executor = new EntityRuntimeExecutor();
    this.assembler = new ConsolidatedOutputAssembler();
    this.legacyRuntime = new ExecutiveIntelligenceRuntime();
    this.eliminationEngine = new IntercompanyEliminationEngine();
  }

  /**
   * Ponto de entrada oficial para a execução consolidadada.
   * Se receber um payload legacy (sem entities), roda em modo pass-through (Single-Entity).
   */
  public runConsolidatedAnalysis(input: any): ExecutiveIntelligenceReport {
    
    // 1. Detectar Single-Entity (Pass-Through)
    if (!input.entities || !Array.isArray(input.entities) || input.entities.length === 0) {
      console.log('[ConsolidatedRuntimeOrchestrator] Single-Entity Mode detectado. Executando pass-through.');
      return this.legacyRuntime.generateExecutiveReport(input);
    }

    const typedInput = input as ConsolidatedOrchestratorInput;

    if (typedInput.entities.length === 1) {
       console.log('[ConsolidatedRuntimeOrchestrator] Single-Entity (1 nó na topologia) detectado. Executando pass-through.');
       return this.legacyRuntime.generateExecutiveReport(typedInput.entities[0].rawData);
    }

    console.log(`[ConsolidatedRuntimeOrchestrator] Multi-Entity Mode detectado para ${typedInput.entities.length} entidades.`);

    // 2. Multi-Entity Execution Pipeline
    const executionPlan = this.planner.planExecution(typedInput);
    
    const reportsMap = new Map<string, ExecutiveIntelligenceReport>();

    for (const entityInput of executionPlan) {
      const report = this.executor.execute(entityInput);
      reportsMap.set(entityInput.entityId, report);
    }

    // 2.5 Fase 3: Intercompany Elimination Engine
    const eliminationResult = this.eliminationEngine.executeElimination(typedInput);

    // 3. Assembler
    const consolidatedReport = this.assembler.assemble(typedInput.groupId, reportsMap, eliminationResult);

    return consolidatedReport;
  }
}
