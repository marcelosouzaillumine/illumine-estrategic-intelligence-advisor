import {
  SimulationInput,
  SimulationConfidenceLevel,
  StrategicStressLevel,
  SimulationIntegrityState
} from './types';

export interface ForecastOutput {
  tenantId: string;
  correlationId: string;
  lineageHash: string;
  generatedAt: string;
  deteriorationVelocity: number; // rate of score decline per cycle
  projectedEscalationTrajectory: string[]; // sequence of escalation steps
  deterministicRiskBand: 'LOW_RISK' | 'MODERATE_RISK' | 'HIGH_RISK' | 'CRITICAL_RISK';
  exposureProgressionLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  forecastConfidence: SimulationConfidenceLevel;
  scenarioStressClassification: StrategicStressLevel;
  liquidityDaysToCrisis: number; // calculated days to liquidity crisis
  governanceInstabilityIndex: number; // 0-100 index of instability
  operationalFatigueIndex: number; // 0-100 index of executive fatigue
  lineageReferences: string[];
  historicalBasisSummary: string;
  assumptions: string[];
  limitations: string[];
}

export class GovernanceForecastEngine {
  /**
   * Projeta tendências de deterioração e estresse fiduciário usando regressão linear
   * simples e ponderações determinísticas de regras.
   */
  public static generateForecast(input: SimulationInput): ForecastOutput {
    // 1. Postura Fail-Closed
    if (!input.lineageHash || !input.correlationId) {
      throw new Error('FAIL_CLOSED: Execução do ForecastEngine bloqueada. Lineage de auditoria incompleta.');
    }

    const generatedAt = new Date().toISOString();
    const cycleCount = input.historicalCycles.length;

    // 2. Verificação de Suficiência Histórica (Mínimo de 3 ciclos)
    let forecastConfidence: SimulationConfidenceLevel = 'HIGH';
    if (cycleCount < 3) {
      forecastConfidence = 'INSUFFICIENT_HISTORY';
    }

    // 3. Projeção de Deterioração de Velocidade
    let deteriorationVelocity = 0;
    let totalAnomalies = 0;
    let totalViolations = 0;
    let initialCash = 0;
    let finalCash = 0;

    if (cycleCount >= 2) {
      const oldestCycle = input.historicalCycles[cycleCount - 1];
      const newestCycle = input.historicalCycles[0];
      
      deteriorationVelocity = (newestCycle.maturityScore - oldestCycle.maturityScore) / (cycleCount - 1);
      
      initialCash = oldestCycle.cashValue;
      finalCash = newestCycle.cashValue;
      
      totalAnomalies = input.historicalCycles.reduce((acc, c) => acc + c.anomaliesCount, 0);
      totalViolations = input.historicalCycles.reduce((acc, c) => acc + c.violationsCount, 0);
    } else {
      // Fallback para único ciclo
      finalCash = input.baseFinancials.caixaEquivalentes || 0;
      initialCash = finalCash;
      totalAnomalies = input.historicalCycles[0]?.anomaliesCount || 0;
      totalViolations = input.historicalCycles[0]?.violationsCount || 0;
    }

    // 4. Previsão de Pressão de Liquidez (Sem probabilidade)
    // Calcula o decréscimo mensal médio de caixa nos ciclos
    let cashBurnRatePerMonth = 0;
    if (cycleCount >= 2 && initialCash > finalCash) {
      cashBurnRatePerMonth = (initialCash - finalCash) / (cycleCount - 1);
    } else if (input.baseFinancials.receitaLiquida && input.baseFinancials.despesasFixas) {
      // Fallback via DRE atual: se despesas > receita
      const netMonthlyIncome = (input.baseFinancials.receitaLiquida - (input.baseFinancials.custosVar || 0) - input.baseFinancials.despesasFixas) / 12;
      if (netMonthlyIncome < 0) {
        cashBurnRatePerMonth = Math.abs(netMonthlyIncome);
      }
    }

    // Converte para base diária
    const dailyCashBurn = cashBurnRatePerMonth / 30;
    const currentCash = input.baseFinancials.caixaEquivalentes || finalCash || 0;

    let liquidityDaysToCrisis = 9999; // Crise inexistente ou estável
    if (dailyCashBurn > 0 && currentCash > 0) {
      liquidityDaysToCrisis = Math.floor(currentCash / dailyCashBurn);
    } else if (currentCash <= 0) {
      liquidityDaysToCrisis = 0; // Já em crise
    }

    // 5. Instabilidade de Governança & Fadiga Operacional (Determinístico)
    const activeWarningsWeight = totalAnomalies * 10;
    const unresolvedViolationsWeight = totalViolations * 15;
    const velocityFactor = deteriorationVelocity < 0 ? Math.abs(deteriorationVelocity) * 20 : 0;

    const governanceInstabilityIndex = Math.min(100, Math.round(activeWarningsWeight + unresolvedViolationsWeight + velocityFactor));
    
    // Fadiga operacional cresce com o volume de incidentes persistentes
    const operationalFatigueIndex = Math.min(100, Math.round((totalAnomalies * 8) + (totalViolations * 12)));

    // 6. Faixas de Risco Determinísticas e Trajetória de Escalada Societária
    let deterministicRiskBand: 'LOW_RISK' | 'MODERATE_RISK' | 'HIGH_RISK' | 'CRITICAL_RISK' = 'LOW_RISK';
    let exposureProgressionLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME' = 'LOW';
    let scenarioStressClassification: StrategicStressLevel = 'LIGHT';

    const currentEscalation = input.activeEscalationLevel || 'MONITOR';
    const projectedEscalationTrajectory: string[] = [currentEscalation];

    if (governanceInstabilityIndex >= 75 || liquidityDaysToCrisis < 60) {
      deterministicRiskBand = 'CRITICAL_RISK';
      exposureProgressionLevel = 'EXTREME';
      scenarioStressClassification = 'EXTREME';
      if (!projectedEscalationTrajectory.includes('MANAGEMENT_ACTION')) projectedEscalationTrajectory.push('MANAGEMENT_ACTION');
      if (!projectedEscalationTrajectory.includes('CFO_INTERVENTION')) projectedEscalationTrajectory.push('CFO_INTERVENTION');
      if (!projectedEscalationTrajectory.includes('BOARD_INTERVENTION')) projectedEscalationTrajectory.push('BOARD_INTERVENTION');
      if (!projectedEscalationTrajectory.includes('CRITICAL_GOVERNANCE_REVIEW')) projectedEscalationTrajectory.push('CRITICAL_GOVERNANCE_REVIEW');
    } else if (governanceInstabilityIndex >= 50 || liquidityDaysToCrisis < 180) {
      deterministicRiskBand = 'HIGH_RISK';
      exposureProgressionLevel = 'HIGH';
      scenarioStressClassification = 'HIGH';
      if (!projectedEscalationTrajectory.includes('MANAGEMENT_ACTION')) projectedEscalationTrajectory.push('MANAGEMENT_ACTION');
      if (!projectedEscalationTrajectory.includes('CFO_INTERVENTION')) projectedEscalationTrajectory.push('CFO_INTERVENTION');
      if (!projectedEscalationTrajectory.includes('BOARD_INTERVENTION')) projectedEscalationTrajectory.push('BOARD_INTERVENTION');
    } else if (governanceInstabilityIndex >= 25 || liquidityDaysToCrisis < 365) {
      deterministicRiskBand = 'MODERATE_RISK';
      exposureProgressionLevel = 'MEDIUM';
      scenarioStressClassification = 'MODERATE';
      if (!projectedEscalationTrajectory.includes('MANAGEMENT_ACTION')) projectedEscalationTrajectory.push('MANAGEMENT_ACTION');
      if (!projectedEscalationTrajectory.includes('CFO_INTERVENTION')) projectedEscalationTrajectory.push('CFO_INTERVENTION');
    }

    // 7. Auditoria de Assunções, Limitações e Linhagem
    const assumptions = [
      'Projeção de caixa assume taxa linear de queima com base nas séries históricas reais.',
      'Considera-se que nenhum ajuste de Capex ou redução de pessoal foi efetuado autonomamente.',
      'Ausência de novos repasses intercompany de liquidez.'
    ];

    const limitations = [
      'Modelo determinístico baseado estritamente na extrapolação matemática de tendências observáveis.',
      forecastConfidence === 'INSUFFICIENT_HISTORY'
        ? 'Histórico insuficiente: a escassez de ciclos (< 3) limita a aderência e eleva a margem de variação estrutural.'
        : 'Cálculo de regressão restrito à janela de amostragem de dados ativos.'
    ];

    const lineageReferences = input.historicalCycles.map(c => c.lineageHash);
    const historicalBasisSummary = `Análise fundamentada em ${cycleCount} ciclos históricos de governança do inquilino ${input.tenantId}.`;

    return {
      tenantId: input.tenantId,
      correlationId: input.correlationId,
      lineageHash: input.lineageHash,
      generatedAt,
      deteriorationVelocity: Number(deteriorationVelocity.toFixed(2)),
      projectedEscalationTrajectory,
      deterministicRiskBand,
      exposureProgressionLevel,
      forecastConfidence,
      scenarioStressClassification,
      liquidityDaysToCrisis,
      governanceInstabilityIndex,
      operationalFatigueIndex,
      lineageReferences,
      historicalBasisSummary,
      assumptions,
      limitations
    };
  }
}
