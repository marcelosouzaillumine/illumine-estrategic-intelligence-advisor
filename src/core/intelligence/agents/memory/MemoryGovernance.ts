import { ExecutiveMemoryArtifact } from './contracts/ExecutiveMemoryArtifact';
import { MemoryConfidenceLevel } from './contracts/MemoryConfidenceLevel';

export class MemoryGovernance {
  public validateArtifact(artifact: ExecutiveMemoryArtifact): ExecutiveMemoryArtifact {
    // 1. Nunca armazenar decisão automática
    if (artifact.type === 'DECISION_CONTEXT' && artifact.source.user === 'ExecutiveFinancialAgent') {
      throw new Error("Governance Violation: Automated agents cannot create decisions. Decision must be human-validated.");
    }

    // 2. Diferenciar hipótese de fato (reforçar)
    if (artifact.source.user !== 'Financial Intelligence Engine' && artifact.confidence === MemoryConfidenceLevel.FACT) {
      // Se um humano ou agente declarou um fato, rebaixa para hipótese validada
      artifact.confidence = MemoryConfidenceLevel.VALIDATED_INSIGHT;
    }

    // 3. Origem obrigatória
    if (!artifact.source || !artifact.source.user || !artifact.source.timestamp) {
      throw new Error("Governance Violation: Memory artifact is missing source traceability.");
    }

    return artifact;
  }
}
