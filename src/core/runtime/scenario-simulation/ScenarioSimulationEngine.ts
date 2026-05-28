import {
  SimulationInput,
  SimulationOutput,
  SimulationConfidenceLevel,
  SimulationIntegrityState,
  StrategicStressLevel,
  SimulationPropagationSeverity
} from './types';

export class ScenarioSimulationEngine {
  /**
   * Executa a simulação determinística de cenários a partir de inputs do Runtime.
   * Totalmente isolado em memória (non-mutating), rastreável e fail-closed.
   */
  public static run(input: SimulationInput): SimulationOutput {
    // 1. Postura Fail-Closed - Rejeitar se lineageHash ou correlationId estiverem ausentes
    if (!input.lineageHash || !input.correlationId || input.lineageHash.trim() === '' || input.correlationId.trim() === '') {
      throw new Error('FAIL_CLOSED: Execução de simulação bloqueada devido a lineageHash ou correlationId ausentes.');
    }

    const generatedAt = new Date().toISOString();
    const sourceRuntimeReferences = ['RuntimeTraceLogger', 'InstitutionalMemoryRegistry'];

    // 2. Verificação de Suficiência Histórica (Mínimo de 3 ciclos)
    let confidenceLevel: SimulationConfidenceLevel = 'HIGH';
    let integrityState: SimulationIntegrityState = 'VERIFIED';

    if (input.historicalCycles.length < 3) {
      confidenceLevel = 'INSUFFICIENT_HISTORY';
      integrityState = 'DEGRADED';
    }

    // 3. Projeção de Deterioração (Velocidade e Score)
    const baseMaturity = input.historicalCycles.length > 0 
      ? input.historicalCycles[0].maturityScore 
      : 70; // fallback neutro
    
    // Velocidade histórica baseada na diferença entre o primeiro e o último ciclo
    let historicalVelocity = 0;
    if (input.historicalCycles.length >= 2) {
      const first = input.historicalCycles[input.historicalCycles.length - 1].maturityScore;
      const last = input.historicalCycles[0].maturityScore;
      historicalVelocity = (last - first) / (input.historicalCycles.length - 1);
    }

    // Fator de escala do horizonte temporal
    let horizonMultiplier = 1.0;
    let horizonDays = 30;
    switch (input.horizon) {
      case '30_DAYS':
        horizonMultiplier = 1.1;
        horizonDays = 30;
        break;
      case '90_DAYS':
        horizonMultiplier = 1.3;
        horizonDays = 90;
        break;
      case '180_DAYS':
        horizonMultiplier = 1.6;
        horizonDays = 180;
        break;
      case '365_DAYS':
        horizonMultiplier = 2.2;
        horizonDays = 365;
        break;
    }

    // Multiplicadores específicos de cada cenário de stress
    let scenarioMultiplier = 1.0;
    let deteriorationCategory = 'Deterioração estável dentro de limites projetados.';

    switch (input.scenarioType) {
      case 'LIQUIDITY_STRESS':
      case 'CASH_FLOW_CONTRACTION':
        scenarioMultiplier = 1.8;
        deteriorationCategory = 'Pressão severa sobre disponibilidades de caixa e fluxo operacional.';
        break;
      case 'OPERATIONAL_COLLAPSE':
      case 'EXECUTION_FAILURE':
        scenarioMultiplier = 2.0;
        deteriorationCategory = 'Degradação acelerada dos ciclos de entrega e capacidade produtiva.';
        break;
      case 'MARGIN_DETERIORATION':
        scenarioMultiplier = 1.5;
        deteriorationCategory = 'Redução das margens de contribuição devido a custos operacionais crescentes.';
        break;
      case 'GOVERNANCE_BREAKDOWN':
      case 'FIDUCIARY_ESCALATION':
        scenarioMultiplier = 2.5;
        deteriorationCategory = 'Risco iminente de desalinhamento de conduta e quebra de conformidade.';
        break;
      case 'SUPPLIER_DEPENDENCY':
        scenarioMultiplier = 1.4;
        deteriorationCategory = 'Exposição de margem por concentração excessiva em fornecedores críticos.';
        break;
      case 'MULTI_ENTITY_CONTAGION':
        scenarioMultiplier = 2.2;
        deteriorationCategory = 'Contágio financeiro por empréstimos intercompany e obrigações cruzadas.';
        break;
      case 'STRATEGIC_DRIFT':
        scenarioMultiplier = 1.3;
        deteriorationCategory = 'Afastamento gradual dos objetivos de longo prazo por desvio de escopo.';
        break;
    }

    // Cálculo determinístico do score final de deterioração (0 a 100)
    // Se o histórico for insuficiente, aumentamos o risco implícito (fail-closed)
    const baseAnomalyWeight = input.historicalCycles.reduce((sum, c) => sum + c.anomaliesCount, 0) / Math.max(1, input.historicalCycles.length);
    const impliedRisk = (baseAnomalyWeight * 8) + (historicalVelocity < 0 ? Math.abs(historicalVelocity) * 15 : 0);
    
    let projectedScore = Math.min(100, Math.max(10, impliedRisk * scenarioMultiplier * horizonMultiplier));
    if (confidenceLevel === 'INSUFFICIENT_HISTORY') {
      projectedScore = Math.min(100, projectedScore + 15); // penalidade por falta de histórico
    }

    const calculatedVelocity = Number((historicalVelocity * scenarioMultiplier * horizonMultiplier).toFixed(2));

    // 4. Trajetória de Escalada Societária
    let activeLevel = input.activeEscalationLevel || 'MONITOR';
    const trajectory: string[] = [activeLevel];
    let deterministicRiskBand: 'LOW_RISK' | 'MODERATE_RISK' | 'HIGH_RISK' | 'CRITICAL_RISK' = 'LOW_RISK';

    if (projectedScore > 75) {
      deterministicRiskBand = 'CRITICAL_RISK';
      if (!trajectory.includes('MANAGEMENT_ACTION')) trajectory.push('MANAGEMENT_ACTION');
      if (!trajectory.includes('CFO_INTERVENTION')) trajectory.push('CFO_INTERVENTION');
      if (!trajectory.includes('BOARD_INTERVENTION')) trajectory.push('BOARD_INTERVENTION');
      if (!trajectory.includes('CRITICAL_GOVERNANCE_REVIEW')) trajectory.push('CRITICAL_GOVERNANCE_REVIEW');
      activeLevel = 'CRITICAL_GOVERNANCE_REVIEW';
    } else if (projectedScore > 50) {
      deterministicRiskBand = 'HIGH_RISK';
      if (!trajectory.includes('MANAGEMENT_ACTION')) trajectory.push('MANAGEMENT_ACTION');
      if (!trajectory.includes('CFO_INTERVENTION')) trajectory.push('CFO_INTERVENTION');
      if (!trajectory.includes('BOARD_INTERVENTION')) trajectory.push('BOARD_INTERVENTION');
      activeLevel = 'BOARD_INTERVENTION';
    } else if (projectedScore > 25) {
      deterministicRiskBand = 'MODERATE_RISK';
      if (!trajectory.includes('MANAGEMENT_ACTION')) trajectory.push('MANAGEMENT_ACTION');
      if (!trajectory.includes('CFO_INTERVENTION')) trajectory.push('CFO_INTERVENTION');
      activeLevel = 'CFO_INTERVENTION';
    } else {
      deterministicRiskBand = 'LOW_RISK';
      if (activeLevel !== 'MONITOR' && !trajectory.includes('MANAGEMENT_ACTION')) {
        trajectory.push('MANAGEMENT_ACTION');
        activeLevel = 'MANAGEMENT_ACTION';
      }
    }

    // 5. Nível de Exposição Estratégica (Exposure Progression Level)
    let exposureLevel = 'LOW';
    let exposureDesc = 'Exposição residual e contida nos limites toleráveis.';
    if (projectedScore >= 80) {
      exposureLevel = 'EXTREME';
      exposureDesc = 'Exposição extrema. Risco crítico de interrupção operacional ou liquidez negativa.';
    } else if (projectedScore >= 60) {
      exposureLevel = 'HIGH';
      exposureDesc = 'Exposição alta. Sinais visíveis de estresse estrutural e necessidade de intervenção.';
    } else if (projectedScore >= 30) {
      exposureLevel = 'MEDIUM';
      exposureDesc = 'Exposição moderada. Recomenda-se acompanhamento e mitigação preventiva.';
    }

    // 6. Classificação de Estresse do Cenário
    let stressClassification: StrategicStressLevel = 'LIGHT';
    if (projectedScore >= 75) stressClassification = 'EXTREME';
    else if (projectedScore >= 50) stressClassification = 'HIGH';
    else if (projectedScore >= 25) stressClassification = 'MODERATE';

    // 7. Cadeia de Propagação (Propagation Chain)
    const propagationChain = [];
    propagationChain.push({
      step: 1,
      entityId: input.entityId,
      contagionType: 'DIRECT_SHOCK',
      impactDescription: `Impacto inicial do cenário ${input.scenarioType} com duração estimada de ${horizonDays} dias.`,
      severity: projectedScore > 75 ? 'CRITICAL' : projectedScore > 40 ? 'ELEVATED' : 'CONTAINED' as SimulationPropagationSeverity
    });

    if (input.scenarioType === 'LIQUIDITY_STRESS' || input.scenarioType === 'CASH_FLOW_CONTRACTION') {
      propagationChain.push({
        step: 2,
        entityId: input.entityId,
        contagionType: 'WORKING_CAPITAL_COMPRESSION',
        impactDescription: 'Redução do caixa circulante força o adiamento de pagamentos de fornecedores e compromissos fiscais.',
        severity: projectedScore > 50 ? 'CRITICAL' : 'ELEVATED' as SimulationPropagationSeverity
      });
    }

    if (input.scenarioType === 'MULTI_ENTITY_CONTAGION') {
      propagationChain.push({
        step: 2,
        entityId: 'SUB-ENTITY-1',
        contagionType: 'INTERCOMPANY_LOAN_DEFAULT',
        impactDescription: 'Incapacidade da controladora de honrar adiantamentos compromete caixa operacional de subsidiárias.',
        severity: 'CRITICAL' as SimulationPropagationSeverity
      });
      propagationChain.push({
        step: 3,
        entityId: 'HOLDING-LEVEL',
        contagionType: 'GUARANTOR_EXPOSURE',
        impactDescription: 'Acionamento de garantias corporativas cruzadas do grupo societário.',
        severity: 'SYSTEMIC' as SimulationPropagationSeverity
      });
    }

    // 8. Premissas, Limitações e Dependências de Linha de Base
    const assumptions = [
      `Cenário simulado sob hipótese de persistência de estresse tipo ${input.scenarioType}.`,
      'Taxas de juros operacionais e câmbio mantidos constantes em linha com a última leitura contábil.',
      'Ausência de novos aportes de capital externo ou captação de dívida emergencial no período.'
    ];

    const limitations = [
      'Projeções lineares matemáticas que desconsideram choques macroeconômicos exógenos não modelados.',
      confidenceLevel === 'INSUFFICIENT_HISTORY'
        ? 'Histórico insuficiente (< 3 ciclos): projeção possui margem elevada de incerteza estrutural.'
        : 'Modelo calibrado estritamente sobre a série temporal de histórico fornecida.'
    ];

    const dependencies = [
      'Integridade das tabelas de indicadores reais e balanços históricos do inquilino.',
      'Sincronismo de lineage com o ledger de auditoria corporativa.'
    ];

    const historicalBasisIds = input.historicalCycles.map(c => c.lineageHash);

    return {
      tenantId: input.tenantId,
      correlationId: input.correlationId,
      lineageHash: input.lineageHash,
      sourceRuntimeReferences,
      confidenceLevel,
      integrityState,
      generatedAt,
      scenarioType: input.scenarioType,
      horizon: input.horizon,
      projectedDeterioration: {
        score: Math.round(projectedScore),
        velocity: calculatedVelocity,
        description: deteriorationCategory
      },
      projectedEscalation: {
        targetLevel: activeLevel,
        trajectory,
        deterministicRiskBand
      },
      exposureProgression: {
        level: exposureLevel,
        description: exposureDesc
      },
      stressClassification,
      propagationChain,
      assumptions,
      limitations,
      dependencies,
      historicalBasisIds
    };
  }
}
