// src/core/runtime/scenario-intelligence/ScenarioExplainabilityEngine.ts
import { sha256 } from '../../../workspace/runtime/executive/types';
import { PropagationSimulationProfile, ScenarioConstraintValidation, ScenarioExplainabilityPayload } from './scenario-types';

export class ScenarioExplainabilityEngine {
  public static generatePayload(
    baselineContext: any,
    simulationInputs: any[],
    validation: ScenarioConstraintValidation,
    propagationProfile?: PropagationSimulationProfile
  ): ScenarioExplainabilityPayload {
    
    // Hashing para garantir integridade e rastreabilidade (Lineage)
    const baselineHash = this.createHash(JSON.stringify(baselineContext || {}));
    const simulationHash = this.createHash(JSON.stringify(simulationInputs));
    const lineageHash = this.createHash(`${baselineHash}:${simulationHash}:${validation.status}`);

    const constraintTriggers: string[] = [];
    if (validation.status !== 'VALID') {
      constraintTriggers.push(`Trigger: ${validation.reason}`);
    }

    const propagationRationale: string[] = [];
    if (propagationProfile) {
      propagationProfile.edges.forEach(edge => {
        propagationRationale.push(`[${edge.source.dimension}] ${edge.source.metric} impactou [${edge.target.dimension}] ${edge.target.metric} via mecanismo estrutural: ${edge.mechanism}`);
      });
    }

    return {
      baselineHash,
      simulationHash,
      lineageHash,
      constraintTriggers,
      propagationRationale
    };
  }

  private static createHash(data: string): string {
    return sha256(data).substring(0, 16);
  }
}
