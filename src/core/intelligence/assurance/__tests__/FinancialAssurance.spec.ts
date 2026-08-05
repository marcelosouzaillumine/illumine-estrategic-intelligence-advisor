// @ts-nocheck
import { IntelligenceAssuranceEngine } from '../engines/IntelligenceAssuranceEngine';
import { NormalizedBalanceSheet } from '../../../../capabilities/financial/domain/models/NormalizedBalanceSheet';
import { ExecutiveIntelligenceOutput } from '../../contracts/ExecutiveIntelligenceOutput';

describe('FinancialAssurance', () => {
  const mockNormalizedData: NormalizedBalanceSheet = {
    year: 2024,
    assets: {
      currentAssets: 600,
      nonCurrentAssets: 400,
      cashAndEquivalents: 100,
      accountsReceivable: 300,
      inventory: 150,
      fixedAssets: 250,
      total: 1000
    },
    liabilities: {
      currentLiabilities: 300,
      nonCurrentLiabilities: 200,
      suppliers: 100,
      laborObligations: 50,
      taxes: 50,
      financialDebtsShortTerm: 100,
      financialDebtsLongTerm: 150,
      total: 500
    },
    equity: {
      capital: 300,
      retainedEarnings: 200,
      total: 500
    }
  };

  const mockOutput: ExecutiveIntelligenceOutput = {
    
    status: 'SUCCESS',
    confidence: { score: 100, level: 'HIGH', factors: [] },
    indicators: [
      {
        id: 'current_liquidity',
        name: 'Liquidez Corrente',
        value: 2.0,
        unit: 'x',
        category: 'LIQUIDITY',
        status: 'STRONG',
        interpretation: ''
      },
      {
        id: 'third_party_dependency',
        name: 'Endividamento Geral',
        value: 0.5,
        unit: '%',
        category: 'STRUCTURE',
        status: 'NEUTRAL',
        interpretation: ''
      }
    ],
    diagnostics: [
      {
        status: 'WARNING',
        strengths: [],
        attention: [],
        executiveMessage: 'Estrutura operando em perfeito estado sem risco relevante.' // Triggering Narrative Governance
      }
    ],
    exposures: [],
    insights: [],
    evidence: {}
  };

  it('should detect language governance violations', () => {
    const engine = new IntelligenceAssuranceEngine();
    const dataIntegrity = engine.assureDataIntegrity(mockNormalizedData);
    expect(dataIntegrity.status).toBe('VALID');

    const assurance = engine.assureIntelligenceReasoning(mockOutput, dataIntegrity, mockNormalizedData);
    
    // Contains forbidden terms
    const forbiddenIssues = assurance.issues.filter(i => i.id === 'EXECUTIVE_LANGUAGE_GOVERNANCE');
    expect(forbiddenIssues.length).toBeGreaterThan(0);
    expect(forbiddenIssues.some(i => i.message.includes('perfeito estado'))).toBe(true);
    expect(forbiddenIssues.some(i => i.message.includes('sem risco'))).toBe(true);
  });
});
