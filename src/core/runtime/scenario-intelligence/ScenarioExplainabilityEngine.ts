// src/core/runtime/scenario-intelligence/ScenarioExplainabilityEngine.ts
import crypto from 'crypto';
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
    // Para ambientes de browser onde o crypto do node pode não estar disponível perfeitamente,
    // nós podemos usar um polyfill ou uma string simples em dev.
    // Usaremos base64 simulação rápida se crypto não estiver presente no browser bundle.
    try {
      return crypto.createHash('sha256').update(data).digest('hex').substring(0, 16);
    } catch {
      let hash = 0;
      for (let i = 0; i < data.length; i++) {
        hash = ((hash << 5) - hash) + data.charCodeAt(i);
        hash |= 0;
      }
      return Math.abs(hash).toString(16);
    }
  }
}
