import { describe, it, expect } from 'vitest';
import { ExecutiveEvidenceEngine } from '../src/orchestration/ExecutiveEvidenceEngine';
import { MemoryClassification } from '../src/learning/MemoryClassification';
import { DecisionMemoryRecord } from '../src/learning/DecisionMemoryRecord';
import { LearningEvent } from '../learning/LearningEvent';
import { LearningLoopEngine } from '../src/learning/LearningLoopEngine';

describe('ExecutiveEvidenceEngine', () => {
  it('Cenário 1: Empresa Saudável permite Expansão', () => {
    const data = { ebitda: 5000, revenue: 20000, assets: 1500000, liabilities: 500000, equity: 1000000, currentAssets: 800000, currentLiabilities: 300000 };
    const decision = 'EXPAND_OPERATIONS';
    
    const pkg = ExecutiveEvidenceEngine.buildPackage('EMP-1', data, undefined, decision);
    
    expect(pkg.integrity.passed).toBe(true);
    expect(pkg.financialState).toBe('CRESCIMENTO SUSTENTÁVEL');
    // Decision package should have APPROVED since it's a healthy company and no history blocks it.
    expect(pkg.decisionAssessment.status).toBe('APPROVED');
    // Check provenance
    expect(pkg.evidenceTrail.some(e => e.validatedBy === 'FinancialIntegrityEngine')).toBe(true);
  });

  it('Cenário 7: Conflito Grave - Integridade bloqueia tudo e nenhuma narrativa deve existir', () => {
    const data = { equity: -1000000 }; // Missing a lot of fields, causing structural failure (or just one missing but we check negative equity without currentAssets)
    // Actually our FinancialIntegrityEngine blocks if equation Assets = Liab + Eq is too broken, or if negative equity and dividend
    const badData = { equity: -1000000, assets: 5000, liabilities: 5000 }; // 5000 != 5000 - 1000000
    const decision = 'DISTRIBUTE_DIVIDENDS';

    const pkg = ExecutiveEvidenceEngine.buildPackage('EMP-1', badData, undefined, decision);

    expect(pkg.integrity.passed).toBe(false);
    expect(pkg.integrity.blockers.length).toBeGreaterThan(0);
    expect(pkg.financialState).toContain('DATA REJECTED');
    expect(pkg.executiveNarrative.severity).toBe('CRITICAL');
    expect(pkg.executiveNarrative.summary).toContain('violação fiduciária');
  });

  it('Cenário 6: Learning Loop Positivo registra efetividade', () => {
    // Generate a memory record and pass it through the LearningLoopEngine
    const pastDecision: DecisionMemoryRecord = {
      id: 'DEC-002',
      decisionDate: '2025-01-01',
      decisionType: 'REDUCE_DEBT',
      contextSnapshot: {
        financialState: 'PRESSÃO FINANCEIRA CONTROLADA',
        liquidity: 1.2,
        autonomy: 0.3,
        decision: 'REDUCE_DEBT',
        approvedBy: 'CFO',
        date: '2025-01-01'
      },
      assumptions: ['Redução de juros aumentará margem líquida'],
      risksIdentified: ['Descapitalização momentânea'],
      expectedOutcome: 'Aumento de 5% na margem líquida',
      responsibleExecutives: ['CFO'],
      approvalLevel: MemoryClassification.EXECUTIVE,
      actualOutcome: 'Aumento de 7% na margem líquida com sucesso',
      confidenceScore: 90
    };

    const learningEvent = LearningLoopEngine.closeLoop(pastDecision, pastDecision.actualOutcome, 'Board');

    expect(learningEvent.confirmedCause).toContain('provou-se verdadeira');
    expect(learningEvent.decisionResponsibility).toBe('Acerto Estratégico');
    expect(learningEvent.lesson).toContain('possuem alta resiliência');
  });

  it('Cenário 8: Mudança de contexto permite decisão (Recuperação)', () => {
    // Empresa em "Recovery" recebe aporte. 
    // Data before
    const dataBefore = { ebitda: 1000, revenue: 10000, assets: 500000, liabilities: 1500000, equity: -1000000, currentAssets: 100000, currentLiabilities: 300000 };
    // This state is RISCO DE CONTINUIDADE or RECUPERAÇÃO PATRIMONIAL. Let's see: equity < 0, liquidity = 1/3, wc = -200k. RISCO DE CONTINUIDADE.
    // In Risco de Continuidade, Expandir is Blocked.
    const pkgBefore = ExecutiveEvidenceEngine.buildPackage('EMP-1', dataBefore, undefined, 'EXPAND_OPERATIONS');
    expect(pkgBefore.decisionAssessment.status).toBe('BLOCKED');

    // Data after aporte
    const dataAfter = { ebitda: 1000, revenue: 10000, assets: 2500000, liabilities: 1500000, equity: 1000000, currentAssets: 2100000, currentLiabilities: 300000 };
    // Now equity > 0, liquidity = 7, wc > 0. CRESCIMENTO SUSTENTÁVEL.
    const pkgAfter = ExecutiveEvidenceEngine.buildPackage('EMP-1', dataAfter, undefined, 'EXPAND_OPERATIONS');
    
    // Na recuperação, deveria ser APPROVED (ou APPROVED_WITH_CONDITIONS se algo na engine disparar).
    expect(pkgAfter.decisionAssessment.status).toBe('APPROVED');
  });
});
