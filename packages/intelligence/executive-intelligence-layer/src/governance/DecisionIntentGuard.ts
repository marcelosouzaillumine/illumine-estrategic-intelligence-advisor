import { ExecutivePolicy } from '../policy/ExecutivePolicyRules';

export interface DecisionIntentResult {
  status: "APPROVED" | "BLOCKED" | "UNKNOWN";
  intent: string;
  reason?: string;
  requiredAction?: string;
}

export class DecisionIntentGuard {
  /**
   * Bloqueia intenções que violam a Política Executiva (ExecutivePolicy).
   */
  public static validate(intent: string, policy: ExecutivePolicy): DecisionIntentResult {
    if (!intent) {
      return { status: 'UNKNOWN', intent: 'No Intent' };
    }

    const intentLower = intent.toLowerCase();
    
    // Simplification of intent checking for demonstration
    let blockedActionMatched = policy.blockedActions.find(blocked => 
      intentLower.includes(blocked.toLowerCase()) || 
      (blocked === 'Expansão' && intentLower.includes('expandir')) ||
      (blocked === 'Dividendos' && intentLower.includes('dividendo'))
    );

    if (blockedActionMatched) {
      return {
        status: "BLOCKED",
        intent,
        reason: `${blockedActionMatched} incompatível com o modo de decisão institucional (${policy.decisionMode}).`,
        requiredAction: `Foco restrito às ações permitidas: ${policy.allowedActions.join(', ')}.`
      };
    }

    return {
      status: "APPROVED",
      intent
    };
  }
}
