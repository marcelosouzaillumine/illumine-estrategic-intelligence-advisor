import { describe, it, expect } from 'vitest';
import { FinancialPositionProduct } from '../../../experience/products/FinancialPositionProduct';
import { BalanceSheetExecutiveViewModelBuilder } from '../../../runtime/executive-consolidation/BalanceSheetExecutiveViewModelBuilder';

// Mock context for generation
const mockContext = {
  intelligence: {
    financialPosition: {
      filterYear: 2026,
      bpSummary: { ativoTotal: 1000, passivoTotal: 500, plValue: 500, pc: 200, ac: 300 },
      financialAnalyticsViewModel: {},
      patrimonialIntelligenceReport: {
        patrimonialClassification: 'SAUDÁVEL',
      },
      strategicTensions: [],
      bpExecutiveAnalysisContext: {
        analysisYear: 2026,
        generatedAt: new Date().toISOString(),
        moduleContext: 'BP',
        fiduciaryClassification: 'SAUDÁVEL',
        mathematicalClassification: 'STABLE',
        globalScore: 85,
        primaryIndicators: {},
        technicalDrivers: [],
        contextualAlerts: []
      }
    }
  }
} as any;

describe('Executive Semantic Purity Enforcement (Wave 1.4.8)', () => {

  const forbiddenTerms = [
    // Explicit English
    'approve', 'approval', 'recommend', 'recommended', 'execute', 'execution', 'plan', 'owner', 'deadline', 'decision', 'strategy', 'action', 'roadmap', 'priority', 'scenario', 'optimized scenario', 'strategy recommendation', 'dividend distribution', 'action plan', 'kpi shift',
    // Explicit Portuguese
    'decisão', 'decidir', 'aprovação', 'aprovar', 'recomendação', 'recomendado', 'executar', 'execução', 'plano', 'prazo de execução', 'cenário otimizado', 'ação tática', 'prioridade estratégica', 'melhoria', 'otimização', 'sugestão', 'orientação', 'cenário', 'alternativa',
    // Implicit Portuguese
    'deve avaliar', 'precisa', 'necessita', 'convém', 'aconselha', 'recomenda', 'implementar', 'é aconselhável', 'seria adequado', 'sugere-se', 'cabe implementar', 'vale considerar', 'próximo passo'
  ];

  it('Balance Sheet ViewModel must not contain any forbidden prescriptive terms', () => {
    // We build the view model
    const viewModel = BalanceSheetExecutiveViewModelBuilder.build(mockContext as any);
    
    const extractStringValues = (obj: any): string[] => {
      let strings: string[] = [];
      if (typeof obj === 'string') {
        strings.push(obj.toLowerCase());
      } else if (Array.isArray(obj)) {
        obj.forEach(item => strings.push(...extractStringValues(item)));
      } else if (obj !== null && typeof obj === 'object') {
        Object.values(obj).forEach(val => strings.push(...extractStringValues(val)));
      }
      return strings;
    };
    
    // Convert the entire view model to a string payload to search for banned terms
    const payloadString = extractStringValues(viewModel).join(' ');
    
    // Log the JSON string to a file for inspection
    require('fs').writeFileSync('/Users/marcelosouza/.gemini/antigravity-ide/brain/315d9311-d301-4a25-9742-00796c8b0c1e/scratch/viewModelDump.json', JSON.stringify(viewModel, null, 2));

    const foundTerms = forbiddenTerms.filter(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'i');
      return regex.test(payloadString);
    });

    if (foundTerms.length > 0) {
      console.error(`Found forbidden terms in ViewModel: ${foundTerms.join(', ')}`);
    }

    expect(foundTerms.length).toBe(0);
  });
  
  it('FinancialPositionProduct must be strictly analytical', () => {
    expect(FinancialPositionProduct.productType).toBe('GOVERNANCE_PRODUCT');
    expect(FinancialPositionProduct.experience.rules.decisionAuthority).toBe(false);
    expect(FinancialPositionProduct.experience.rules.canRecommend).toBe(false);
    expect(FinancialPositionProduct.experience.rules.canExecute).toBe(false);
    expect(FinancialPositionProduct.experience.rules.canCreateGovernanceDecision).toBe(false);
    expect(FinancialPositionProduct.office).toBe('CFO_OFFICE');
  });

});
