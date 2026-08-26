import { describe, it, expect } from 'vitest';
import { NormalizedBalanceSheet } from '../models/NormalizedBalanceSheet';
import { BalanceSheetIntelligenceEngine } from '../../intelligence/BalanceSheetIntelligenceEngine';
import { FinancialRiskEngine } from '../../intelligence/financial-health/FinancialRiskEngine';
import { FleurietAnalysisEngine } from '../../intelligence/working-capital/FleurietAnalysisEngine';
import { CapitalStructureEngine } from '../../intelligence/capital-structure/CapitalStructureEngine';
import { FinancialDiagnosticEngine } from '../../intelligence/financial-health/FinancialDiagnosticEngine';
import { FinancialIndicator } from '../../../../core/intelligence/contracts/ExecutiveIntelligenceOutput';
import { RiskExposure } from '../../../../core/intelligence/contracts/RiskExposure';

describe('Financial Intelligence Foundation Layer™', () => {
  const mockData: NormalizedBalanceSheet = {
    year: 2026,
    assets: {
      currentAssets: 1200,
      nonCurrentAssets: 800,
      cashAndEquivalents: 1100, // Very high cash concentration (55%)
      accountsReceivable: 50,
      inventory: 50,
      fixedAssets: 800,
      total: 2000
    },
    liabilities: {
      currentLiabilities: 100,
      nonCurrentLiabilities: 40,
      suppliers: 50,
      laborObligations: 20,
      taxes: 10,
      financialDebtsShortTerm: 20,
      financialDebtsLongTerm: 40,
      total: 140
    },
    equity: {
      capital: 1000,
      retainedEarnings: 860,
      total: 1860 // 93% Autonomy
    }
  };

  it('calculates Fleuriet correctly', () => {
    // CGL = Equity + NCL - NCA = 1860 + 40 - 800 = 1100
    // NCG = (CA - Cash) - (CL - FDS) = (1200 - 1100) - (100 - 20) = 100 - 80 = 20
    // Treasury = 1100 - 20 = 1080
    const cgl = 1100;
    const ncg = 20;
    const treasury = 1080;

    const result = FleurietAnalysisEngine.analyze(cgl, ncg, treasury);
    expect(result.type).toBe('TYPE_2');
    expect(result.classification).toBe('SÓLIDA');
  });

  it('evaluates Capital Structure correctly', () => {
    const result = CapitalStructureEngine.analyze(mockData);
    expect(result.autonomyRatio).toBeCloseTo(0.93, 2); // 93% autonomy
    expect(result.dependencyClassification).toBe('VERY_LOW');
  });

  it('evaluates Risks correctly', () => {
    const risks = FinancialRiskEngine.analyze(mockData);
    const excessCashRisk = risks.find(r => r.id === 'excess_liquidity_eval');
    
    expect(excessCashRisk).toBeDefined();
    expect(excessCashRisk?.severity).toBe('MEDIUM');
    expect(excessCashRisk?.message).toContain('Mais de 50% dos ativos totais encontram-se em caixa e equivalentes');
  });

  it('generates the correct Diagnostic Interpretation (Cognitive Test)', () => {
    // The scenario: Liquidity 12x, Autonomy 93%, Cash concentration 55%
    // Expectation: Status: STRONG, Attention: Capital allocation efficiency
    
    const indicators: FinancialIndicator[] = [
      { id: 'current_liquidity', name: 'Liquidez Corrente', value: 12, unit: 'x', category: 'LIQUIDITY', status: 'EXCELLENT', interpretation: '' },
      { id: 'debt_ratio', name: 'Endividamento', value: 0.07, unit: '%', category: 'STRUCTURE', status: 'EXCELLENT', interpretation: '' }
    ];

    const risks: RiskExposure[] = [
      {
        id: 'excess_liquidity_eval',
        category: 'Imobilização em Caixa',
        severity: 'MEDIUM',
        metric: 'Caixa / Ativo Total',
        value: 0.55,
        triggerCondition: '>= 50%',
        message: 'Excesso de liquidez. Mais de 50% dos ativos em caixa podem indicar ineficiência na alocação de capital.'
      }
    ];

    const diagnostic = FinancialDiagnosticEngine.analyze(indicators, risks);
    
    // Check interpreted status
    expect(diagnostic.status).toBe('ATTENTION');
    
    // Check narrative intelligence
    expect(diagnostic.attention.some(msg => msg.includes('Mais de 50% dos ativos'))).toBeTruthy();
    expect(diagnostic.strengths.some(msg => msg.includes('Liquidez Corrente'))).toBeTruthy();
    expect(diagnostic.strengths.some(msg => msg.includes('Endividamento'))).toBeTruthy();
    expect(diagnostic.executiveMessage).toContain('exposições pontuais');
  });

  it('integrates full pipeline correctly', () => {
    const output = BalanceSheetIntelligenceEngine.execute(mockData);
    expect((output as any).capabilityId).toBe('financial.balance_sheet_intelligence');
    expect((output as any).status).toBe('SUCCESS');
    expect((output as any).diagnostics[0].status).toBe('VULNERABLE');
    expect((output as any).exposures.length).toBeGreaterThan(0);
    expect((output as any).insights.length).toBeGreaterThan(0);
  });
});
