import { 
  CertificationDecision, 
  CertificationPolicy, 
  CertificationRule, 
  PolicyId 
} from '../models/index';
import { EvaluationSnapshot } from '@illumine/architecture-governance-evaluation';
import { EvidenceReference } from '@illumine/architecture-governance-registry';

export class CertificationRuleEngine {
  
  public evaluate(
    targetCapabilityId: string, 
    policy: CertificationPolicy, 
    snapshot: EvaluationSnapshot
  ): CertificationDecision {
    const evidences: EvidenceReference[] = [];
    let isCertified = true;

    // Look for observations related to the target capability
    const observations = snapshot.observations.filter(o => o.targetId === targetCapabilityId);
    
    // Evaluate each rule
    for (const rule of policy.rules) {
      const [namespace, metric] = rule.input.split('.');
      if (namespace !== 'EvaluationObservation') continue; // only support observations for now
      
      const observation = observations.find(o => o.metric === metric);
      if (!observation) {
        // Missing evidence means failure according to AR-CERT-001
        isCertified = false;
        continue;
      }
      
      evidences.push({
        type: 'evaluation-observation',
        sourceId: snapshot.id,
        targetId: observation.id,
        discoveryMethod: 'Architecture Certification Engine',
        confidence: 1.0
      });
      
      const passed = this.evaluateCondition(observation.value, rule.operator, rule.threshold);
      if (!passed) {
        isCertified = false;
      }
    }

    return {
      status: isCertified ? 'CERTIFIED' : 'NOT_CERTIFIED',
      policyId: policy.id,
      policyVersion: policy.version,
      evidenceReferences: evidences,
      evaluatedAt: new Date()
    };
  }

  private evaluateCondition(value: any, operator: string, threshold: any): boolean {
    const v = Number(value);
    const t = Number(threshold);
    if (isNaN(v) || isNaN(t)) {
      if (operator === '==') return value === threshold;
      if (operator === '!=') return value !== threshold;
      return false;
    }
    
    switch (operator) {
      case '<': return v < t;
      case '<=': return v <= t;
      case '>': return v > t;
      case '>=': return v >= t;
      case '==': return v === t;
      case '!=': return v !== t;
      default: return false;
    }
  }
}
