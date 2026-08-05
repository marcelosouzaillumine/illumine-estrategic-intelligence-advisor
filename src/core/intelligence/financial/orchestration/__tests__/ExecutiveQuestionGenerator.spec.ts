import { describe, it, expect, beforeEach } from 'vitest';
import { ExecutiveQuestionGenerator } from '../ExecutiveQuestionGenerator';
import { FinancialInsight } from '../FinancialInsightRegistry';

describe('ExecutiveQuestionGenerator', () => {
  let generator: ExecutiveQuestionGenerator;

  beforeEach(() => {
    generator = new ExecutiveQuestionGenerator();
  });

  it('should synthesize a unified question when multiple risks are present', () => {
    const findings: FinancialInsight[] = [
      { finding: 'CASH_DEPENDENCY_RISK', origin: 'X', severity: 'HIGH', confidence: 100, period: '2025' },
      { finding: 'VALUE_DESTRUCTION_RISK', origin: 'Y', severity: 'HIGH', confidence: 100, period: '2025' }
    ];

    const questions = generator.generate(findings);
    expect(questions[0]).toContain("acelerar crescimento sem comprometer a continuidade operacional");
  });

  it('should fallback to a default question if no findings', () => {
    const questions = generator.generate([]);
    expect(questions[0]).toContain("estabilidade atual do negócio suporta alavancagem");
  });
});
