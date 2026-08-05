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
    'approve', 'approval', 'recommend', 'recommended', 'execute', 'execution', 'plan', 'owner', 'deadline', 'decision', 'strategy', 'action', 'roadmap', 'priority',
    // Explicit Portuguese
    'decisão', 'decidir', 'aprovação', 'aprovar', 'recomendação', 'recomendado', 'executar', 'execução', 'plano', 'prazo de execução', 'cenário otimizado', 'ação tática', 'prioridade estratégica',
    // Implicit Portuguese
    'deve avaliar', 'precisa', 'necessita', 'convém', 'aconselha', 'recomenda', 'implementar', 'é aconselhável', 'seria adequado', 'sugere-se', 'cabe implementar', 'vale considerar', 'próximo passo'
  ];

  it('Balance Sheet ViewModel must not contain any forbidden prescriptive terms', () => {
    // We build the view model
    const viewModel = BalanceSheetExecutiveViewModelBuilder.build(mockContext as any);
    
    // Convert the entire view model to a string payload to search for banned terms
    const payloadString = JSON.stringify(viewModel).toLowerCase();
    
    // Log the JSON string to a file for inspection
    require('fs').writeFileSync('/Users/marcelosouza/.gemini/antigravity-ide/brain/315d9311-d301-4a25-9742-00796c8b0c1e/scratch/viewModelDump.json', JSON.stringify(viewModel, null, 2));

    const foundTerms = forbiddenTerms.filter(term => payloadString.includes(term.toLowerCase()));

    if (foundTerms.length > 0) {
      console.error(`Found forbidden terms in ViewModel: ${foundTerms.join(', ')}`);
    }

    expect(foundTerms.length).toBe(0);
  });
  
  it('FinancialPositionProduct must be strictly analytical', () => {
    expect(FinancialPositionProduct.productType).toBe('INTELLIGENCE_PRODUCT');
    expect(FinancialPositionProduct.decisionAuthority).toBe(false);
    expect(FinancialPositionProduct.office).toBe('CFO_OFFICE');
  });

});
