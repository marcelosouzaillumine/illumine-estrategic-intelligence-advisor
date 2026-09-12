// src/core/runtime/strategic-intelligence/ExpansionSustainabilityEngine.ts

import { StrategicEvaluationContext, ExpansionSustainability, StrategicPosture } from './strategic-intelligence-types';

export class ExpansionSustainabilityEngine {
  static evaluate(context: StrategicEvaluationContext, posture: StrategicPosture): ExpansionSustainability {
    
    if (context.metadata.historicalCyclesCount < 2) {
      return {
        isSustainable: true,
        structuralCapacity: 'INSUFFICIENT',
        financialSustainability: 'SUSTAINABLE',
        institutionalAbsorption: 'STABLE',
        rationale: 'Dados insuficientes para validar a sustentabilidade estrutural observável.'
      };
    }

    const isExpanding = (context.metrics.scaleEfficiency.recGrowth && context.metrics.scaleEfficiency.recGrowth > 0.05) || false;
    const ocf = context.metrics.financialMetrics.ocf;
    const { fundingDependenceLevel } = context.capitalStructure;
    
    let isSustainable = true;
    let structuralCapacity: 'HIGH' | 'MODERATE' | 'LOW' | 'INSUFFICIENT' = 'HIGH';
    let financialSustainability: 'SUSTAINABLE' | 'PRESSURED' | 'UNSUSTAINABLE' = 'SUSTAINABLE';
    let institutionalAbsorption: 'STABLE' | 'STRAINED' | 'OVERLOADED' = 'STABLE';
    let rationale = 'A trajetória direcional atual encontra-se dentro dos limites estruturais e financeiros fiduciários.';

    if (isExpanding) {
      if (ocf < 0) {
        financialSustainability = 'UNSUSTAINABLE';
        structuralCapacity = 'LOW';
        isSustainable = false;
        rationale = 'Expansão não financiada pela operação (Negative OCF). Crescimento altamente dependente de eventos de liquidez.';
      } else if (fundingDependenceLevel === 'HIGH' || fundingDependenceLevel === 'CRITICAL') {
        financialSustainability = 'PRESSURED';
        structuralCapacity = 'MODERATE';
        rationale = 'Expansão sustentada, porém com pressão sobre a estrutura de funding (alta dependência).';
      }

      if (context.operationalGovernance?.executionIntegrity?.status === 'EXECUTION_UNDER_COORDINATION_STRAIN') {
        institutionalAbsorption = 'STRAINED';
        isSustainable = false;
        rationale += ' Capacidade de absorção institucional pressionada sob o ritmo de execução.';
      }
    } else {
      if (ocf < 0 && fundingDependenceLevel === 'CRITICAL') {
        financialSustainability = 'UNSUSTAINABLE';
        structuralCapacity = 'LOW';
        isSustainable = false;
        rationale = 'Trajetória estrutural apresenta insustentabilidade financeira base primária independente de expansão.';
      }
    }

    return {
      isSustainable,
      structuralCapacity,
      financialSustainability,
      institutionalAbsorption,
      rationale: rationale.trim()
    };
  }
}
