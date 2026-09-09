import { AIPromptPolicy } from './AIGovernanceTypes';

const BANNED_INTENTS = [
  { regex: /recalcular? (bp|balanço|dre)/i, reason: 'Tentativa de recalcular demonstrativo contábil. Use o Runtime Consolidado.' },
  { regex: /alterar? (confidence|confiança)/i, reason: 'Tentativa de mutação de Fiduciary Confidence. Bloqueado.' },
  { regex: /ignorar? (governance|governança|regras)/i, reason: 'Tentativa de Bypass da Active Governance.' },
  { regex: /(crie|estime|chute) (números|valores)/i, reason: 'Tentativa de Geração de Números Aleatórios (Hallucination Bypass).' },
  { regex: /simul(e|ar) fora do (runtime|scenario)/i, reason: 'Simulações devem ocorrer no Scenario Governance Runtime.' }
];

export class AIPromptPolicyEngine {
  static evaluate(query: string): AIPromptPolicy {
    for (const intent of BANNED_INTENTS) {
      if (intent.regex.test(query)) {
        return { actionAllowed: false, violationReason: intent.reason };
      }
    }
    return { actionAllowed: true };
  }
}
