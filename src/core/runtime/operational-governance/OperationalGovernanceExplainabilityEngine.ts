// src/core/runtime/operational-governance/OperationalGovernanceExplainabilityEngine.ts

import { OperationalEvaluationContext } from './operational-governance-adapter';
import { 
  OperationalGovernanceExplainability, 
  OperationalFrictionEvent, 
  InstitutionalDependencyRisk,
  StrategicExecutionAlignment 
} from './operational-governance-types';

export class OperationalGovernanceExplainabilityEngine {
  static evaluate(
    context: OperationalEvaluationContext,
    frictions: OperationalFrictionEvent[],
    dependencies: InstitutionalDependencyRisk[],
    alignment: StrategicExecutionAlignment
  ): OperationalGovernanceExplainability {
    
    if (context.historicalCyclesCount < 2) {
      return {
        operationalLineage: context.lineageHash,
        executionRationale: 'Não auditável por ausência de profundidade temporal.',
        continuityRationale: 'Indeterminado',
        frictionDecomposition: [],
        dependencyExplanation: 'Mapeamento dependencial inativo.'
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
      operationalLineage: context.lineageHash,
      executionRationale,
      continuityRationale,
      frictionDecomposition,
      dependencyExplanation
    };
  }
}
