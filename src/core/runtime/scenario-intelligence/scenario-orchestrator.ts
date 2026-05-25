import { ExecutiveIntelligenceRuntime, ExecutiveIntelligenceReport } from '../executive-intelligence-runtime';
import { 
  ScenarioSimulationInput, 
  ScenarioOutput, 
  ScenarioType, 
  ScenarioParameter,
  BaseSnapshot,
  ProjectedSnapshot,
  DeltaAnalysis,
  ScenarioRisks,
  ScenarioExecutiveSummary,
  ScenarioConfidence
} from './scenario-types';
import { calculateScenarioConfidence } from './scenario-confidence-engine';
import { cloneAndMutateRawData } from './scenario-models';

/**
 * ScenarioSimulationOrchestrator
 * Única camada autorizada a gerar projeções na plataforma.
 * Opera via "Safe Clone -> Mutate -> Re-run -> Delta Analysis".
 */
export class ScenarioSimulationOrchestrator {
  private runtimeEngine: ExecutiveIntelligenceRuntime;

  constructor() {
    // Instancia o núcleo oficial para garantir que toda inteligência
    // seja gerada pelas mesmas regras do dado histórico.
    this.runtimeEngine = new ExecutiveIntelligenceRuntime();
  }

  public simulate(input: ScenarioSimulationInput): ScenarioOutput {
    const { rawInput, scenarioType, parameters, projectionMonths } = input;

    // 1. SAFE CLONE + MUTAÇÕES
    const projectedRawData = cloneAndMutateRawData(rawInput, scenarioType, parameters);

    // 2. RECONSTRUIR O RUNTIME (RE-RUN COMPLETO)
    const baseReport = this.runtimeEngine.generateExecutiveReport(rawInput);
    const projectedReport = this.runtimeEngine.generateExecutiveReport(projectedRawData);

    // 3. BASE SNAPSHOT
    const baseSnapshot: BaseSnapshot = {
      timestamp: new Date().toISOString(),
      baseEbitda: baseReport.scores.operational, // Approximate, ideally use raw metrics
      baseRunway: baseReport.scores.financial,
      baseCash: baseReport.scores.structural,
      baseDebt: baseReport.scores.composite,
      baseLiquidity: baseReport.scores.financial
    };

    // 4. PROJECTED SNAPSHOT
    const projectedSnapshot: ProjectedSnapshot = {
      projectedReport
    };

    // 5. DELTA ANALYSIS
    const deltaAnalysis: DeltaAnalysis = {
      ebitdaDelta: projectedReport.scores.operational - baseReport.scores.operational,
      runwayDelta: projectedReport.scores.financial - baseReport.scores.financial,
      cashDelta: projectedReport.scores.structural - baseReport.scores.structural,
      liquidityDelta: projectedReport.scores.financial - baseReport.scores.financial,
      debtDelta: projectedReport.scores.composite - baseReport.scores.composite,
      isDestructive: projectedReport.scores.composite < baseReport.scores.composite && projectedReport.scores.operational < baseReport.scores.operational,
      deltaSummary: 'Análise de variação concluída com sucesso via engine oficial.'
    };

    // 6. RISKS
    const scenarioRisks: ScenarioRisks = {
      identifiedRisks: projectedReport.advisory.actionMatrix,
      systemicRisks: [] // Would map from MasterCausal if we deeply extracted it
    };

    // 7. EXECUTIVE SUMMARY
    const executiveSummary: ScenarioExecutiveSummary = {
      scenarioName: `Simulação: ${scenarioType}`,
      scenarioType,
      hypothesis: this.buildHypothesis(scenarioType),
      conclusion: projectedReport.advisory.executiveSummary,
      recommendedAction: projectedReport.advisory.priorityFocus
    };

    // 8. CONFIDENCE
    // Mocking base length as 3 for now (would come from actual rawData history)
    const confidence = calculateScenarioConfidence(scenarioType, parameters, projectionMonths, 3);

    // 9. PACKAGE
    return {
      id: `SIM-${Date.now()}`,
      type: scenarioType,
      baseSnapshot,
      projectedSnapshot,
      deltaAnalysis,
      scenarioCausality: {} as any, // Mock for now or extract from projectedReport
      scenarioRisks,
      executiveSummary,
      confidence
    };
  }

  private buildHypothesis(type: ScenarioType): string {
    switch(type) {
      case 'SUSTAINABLE_GROWTH': return 'Expansão de receita com margem e OPEX controlados.';
      case 'DESTRUCTIVE_GROWTH': return 'Expansão agressiva com queima de margem e explosão de custos.';
      case 'TREASURY_STRESS': return 'Piora no ciclo financeiro com dilatação de recebimentos.';
      case 'RUNWAY_COLLAPSE': return 'Aumento de custos fixos causando esgotamento de caixa.';
      case 'CAPITAL_DEPENDENCY': return 'Injeção de dívida para sustentar operação deficitária.';
      default: return 'Simulação contrafactual padronizada.';
    }
  }
}
