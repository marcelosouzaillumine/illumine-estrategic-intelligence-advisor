// src/core/runtime/operational-governance/OperationalGovernanceExplainabilityEngine.ts

import { 
  OperationalFrictionEvent,
  InstitutionalDependencyRisk,
  StrategicExecutionAlignment
} from './operational-governance-types';
import { OperationalEvaluationContext } from './operational-governance-adapter';
import { ExplainabilityOutput } from '../../../core/runtime/shared/runtime-contracts';
import { ExplainabilityLevel } from '../../../core/runtime/shared/runtime-constitutional-types';

export class OperationalGovernanceExplainabilityEngine {
  static evaluate(
    context: OperationalEvaluationContext,
    frictions: OperationalFrictionEvent[],
    dependencies: InstitutionalDependencyRisk[],
    alignment: StrategicExecutionAlignment
  ): ExplainabilityOutput {
    
    if (context.historicalCyclesCount < 2) {
      return {
        structuralDrivers: [],
        propagationChains: [],
        evidence: [],
        confidenceDecomposition: {},
        lineageReferences: [context.lineageHash],
        level: 'UNVERIFIABLE' as ExplainabilityLevel
      };
    }

    const frictionDecomposition = frictions.map(f => f.description);
    
    let dependencyExplanation = dependencies.length > 0
      ? `Detectados ${dependencies.length} vetores de dependência estrutural que expõem a continuidade da execução.`
      : 'A topologia de execução não apresenta altas dependências institucionais críticas imediatas.';

    let executionRationale = 'A execução preserva integridade operacional alinhada aos fundamentos.';
    if (!alignment.isAligned) {
      executionRationale = alignment.tensions.join(' | ');
    } else if (frictions.length > 0) {
      executionRationale = 'A execução é viável, porém sob atrito constante mensurado no runtime.';
    }

    const continuityRationale = context.activeSurvivalMode === 'SURVIVAL_MODE' 
      ? 'A sobrevivência fiduciária atua como principal restritor da alocação contínua de recursos.'
      : 'As margens de continuidade são ditadas primariamente pela eficiência da absorção operacional.';

    return {
      structuralDrivers: [executionRationale, continuityRationale],
      propagationChains: frictionDecomposition,
      evidence: [dependencyExplanation],
      confidenceDecomposition: {},
      lineageReferences: [context.lineageHash],
      level: 'DETERMINISTIC' as ExplainabilityLevel
    };
  }
}

