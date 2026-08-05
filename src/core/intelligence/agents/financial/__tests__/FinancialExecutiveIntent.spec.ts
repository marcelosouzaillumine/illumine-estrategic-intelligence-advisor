import { describe, it, expect, beforeEach } from 'vitest';
import { FinancialIntentClassifier, FinancialExecutiveIntent } from '../FinancialExecutiveIntent';

describe('FinancialIntentClassifier', () => {
  let classifier: FinancialIntentClassifier;

  beforeEach(() => {
    classifier = new FinancialIntentClassifier();
  });

  it('should correctly classify CAUSE_INVESTIGATION', () => {
    const intent = classifier.classify('Por que meu caixa caiu?');
    expect(intent).toBe(FinancialExecutiveIntent.CAUSE_INVESTIGATION);
  });

  it('should correctly classify DECISION_SUPPORT', () => {
    const intent = classifier.classify('Devemos investir na nova fábrica?');
    expect(intent).toBe(FinancialExecutiveIntent.DECISION_SUPPORT);
  });

  it('should correctly classify BOARD_PREPARATION', () => {
    const intent = classifier.classify('O que devo levar ao conselho amanhã?');
    expect(intent).toBe(FinancialExecutiveIntent.BOARD_PREPARATION);
  });

  it('should fallback to UNKNOWN for random chatter', () => {
    const intent = classifier.classify('Olá, tudo bem?');
    expect(intent).toBe(FinancialExecutiveIntent.UNKNOWN);
  });
});
