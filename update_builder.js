const fs = require('fs');
const file = 'src/core/runtime/executive-consolidation/BalanceSheetExecutiveViewModelBuilder.ts';
let content = fs.readFileSync(file, 'utf8');

// The replacement logic:
const newBuildMethod = `
  public static build(executiveReport: any, mode: 'strict' | 'safe' = 'safe', filterYear?: number, directBpSummary?: any, directIndicators?: any[]): BalanceSheetExecutiveViewModel {
    const rawReport = executiveReport || {};
    const {
      assessments,
      indicators
    } = rawReport.patrimonialIntelligenceReport || {};

    const interpretations = rawReport.patrimonialIntelligenceReport?.executiveInterpretation || rawReport.patrimonialIntelligenceReport?.interpretations;

    // --- Phase 1: Facts Builder ---
    const finalIndicators = directIndicators && directIndicators.length > 0 ? directIndicators : (indicators && indicators.length > 0 ? indicators : (rawReport.rawFinancialData?.financialIndicators || []));
    const facts = BalanceSheetExecutiveFactsBuilder.build(rawReport, finalIndicators, directBpSummary);

    // Se faltar o relatório, preparamos o technicalLayer baseado APENAS nos facts e abortamos o resto com buildEmpty merging
    if (!rawReport.patrimonialIntelligenceReport) {
      const technicalLayerFallback = TechnicalLayerBuilder.build(
        finalIndicators,
        (key: string) => DisplaySemanticResolver.resolve('label', key) || key,
        undefined, // Sem painéis de decisão
        facts,
        undefined // Sem cenário
      );
      const emptyBase = this.buildEmpty();
      return {
        ...emptyBase,
        technicalLayer: { families: technicalLayerFallback } as any
      };
    }

    // --- Phase 2: Decision Policy Layer ---
`;

content = content.replace(/public static build\(.*?\{([\s\S]*?)\/\/ --- Phase 2: Decision Policy Layer ---/, newBuildMethod.trim() + '\n    // --- Phase 2: Decision Policy Layer ---');

fs.writeFileSync(file, content, 'utf8');
