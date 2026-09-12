import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import assert from 'node:assert';
import { BalanceSheetExecutiveOpinionBuilder } from '../../workspace/runtime/executive-consolidation/builders/BalanceSheetExecutiveOpinionBuilder';

describe('BalanceSheetScenarioIsolation v7.19', () => {
  it('Should generate strict Critical scenario grammar based on facts', () => {
    const facts: any = { liquidityCurrent: 0.5, financialAutonomy: 0.1 };
    const opinion = BalanceSheetExecutiveOpinionBuilder.buildOpinion(undefined, facts);
    assert.ok(opinion.toLowerCase().includes('dependência crítica'));
    assert.ok(opinion.toLowerCase().includes('liquidez crítica'));
  });

  it('Should generate strict Recovery scenario grammar based on facts', () => {
    const facts: any = { liquidityCurrent: 0.9, financialAutonomy: 0.2 };
    const opinion = BalanceSheetExecutiveOpinionBuilder.buildOpinion(undefined, facts);
    assert.ok(opinion.toLowerCase().includes('alavancagem elevada'));
    assert.ok(opinion.toLowerCase().includes('liquidez em risco'));
  });

  it('Should generate strict Expansion scenario grammar based on facts', () => {
    const facts: any = { liquidityCurrent: 1.6, financialAutonomy: 0.6 };
    const opinion = BalanceSheetExecutiveOpinionBuilder.buildOpinion(undefined, facts);
    assert.ok(opinion.toLowerCase().includes('autonomia sólida'));
    assert.ok(opinion.toLowerCase().includes('liquidez confortável'));
  });

  it('Should generate strict Optimization scenario grammar based on facts', () => {
    const facts: any = { liquidityCurrent: 3.0, financialAutonomy: 0.8 };
    const opinion = BalanceSheetExecutiveOpinionBuilder.buildOpinion(undefined, facts);
    assert.ok(opinion.toLowerCase().includes('estrutura muito sólida'));
    assert.ok(opinion.toLowerCase().includes('liquidez excedente'));
  });
});
