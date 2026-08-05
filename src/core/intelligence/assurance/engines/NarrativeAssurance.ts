import { ExecutiveIntelligenceOutput } from '../../contracts/ExecutiveIntelligenceOutput';
import { ValidationIssue } from '../contracts/IntelligenceAssuranceResult';

export class NarrativeAssurance {
  public static validate(output: ExecutiveIntelligenceOutput): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // 1. Executive Language Governance
    const narratives = [
      ...(output.diagnostics || []).map(d => d.executiveMessage),
      ...(output.insights || []).map(i => i.description),
    ];

    const forbiddenPhrases = [
      {
        phrase: 'sem risco',
        suggestion: 'baixa exposição financeira considerando os indicadores analisados'
      },
      {
        phrase: 'risco zero',
        suggestion: 'exposição contida'
      },
      {
        phrase: 'perfeito estado',
        suggestion: 'estrutura balanceada'
      }
    ];

    for (const narrative of narratives) {
      if (!narrative) continue;
      const lowerText = narrative.toLowerCase();

      for (const rule of forbiddenPhrases) {
        if (lowerText.includes(rule.phrase)) {
          issues.push({
            id: 'EXECUTIVE_LANGUAGE_GOVERNANCE',
            category: 'Narrative Assurance',
            severity: 'WARNING',
            message: `A narrativa contém a expressão proibida "${rule.phrase}". Substitua por "${rule.suggestion}".`
          });
        }
      }
    }

    // 2. Diagnostic Coherence Validation
    // E.g. "Alta pressão financeira" when liquidity is high and debt is low.
    const liquidity = output.indicators.find(i => i.id === 'current_liquidity')?.value || 0;
    const debt = output.indicators.find(i => i.id === 'third_party_dependency')?.value || 0;

    const hasHighPressurePhrase = narratives.some(n => n?.toLowerCase().includes('alta pressão financeira') || n?.toLowerCase().includes('alto risco'));

    if (hasHighPressurePhrase && liquidity > 2 && debt < 0.3) {
      issues.push({
        id: 'NARRATIVE_CONFLICT_DETECTED',
        category: 'Narrative Assurance',
        severity: 'CRITICAL',
        message: 'A narrativa indica alta pressão financeira, mas os indicadores (liquidez > 2, endividamento < 30%) não sustentam essa tese.'
      });
    }

    return issues;
  }
}
