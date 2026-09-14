import { CertificationRuleEngine } from '../engines/CertificationRuleEngine';
import { CertificationCertificate, CertificationDecision, CertificationPolicy } from '../models/index';
import { EvaluationSnapshot } from '@illumine/architecture-governance-evaluation';

export interface CertificationReplayRequest {
  certificationId: string;
  snapshot: EvaluationSnapshot;
  policy: CertificationPolicy;
}

export interface CertificationReplayResult {
  originalDecision: CertificationDecision;
  replayedDecision: CertificationDecision;
  equivalent: boolean;
  differences: string[];
}

export class CertificationReplayEngine {
  constructor(private ruleEngine: CertificationRuleEngine = new CertificationRuleEngine()) {}

  replay(
    originalCertificate: CertificationCertificate,
    request: CertificationReplayRequest
  ): CertificationReplayResult {
    // 1. Executa novamente o motor com os inputs históricos
    // Assume-se que targetId seja extraído ou inferido das evidências.
    // Para simplificação, pegamos o primeiro targetId das evidências.
    const targetId = request.snapshot.observations[0]?.targetId || 'UNKNOWN';
    
    const replayedDecision = this.ruleEngine.evaluate(
      targetId,
      request.policy,
      request.snapshot
    );

    // 2. Compara decisão
    const original = originalCertificate.decision;
    const differences: string[] = [];

    if (original.status !== replayedDecision.status) {
      differences.push(`Status mismatch: Original=${original.status}, Replayed=${replayedDecision.status}`);
    }

    if (original.policyVersion !== replayedDecision.policyVersion) {
      differences.push(`Policy version mismatch: Original=${original.policyVersion}, Replayed=${replayedDecision.policyVersion}`);
    }

    // 3. Resultado
    return {
      originalDecision: original,
      replayedDecision,
      equivalent: differences.length === 0,
      differences
    };
  }
}
