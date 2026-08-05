import { CapabilityAdapter } from '../../../core/intelligence/runtime/CapabilityResolver';
import { BalanceSheetNormalizer } from '../infrastructure/adapters/BalanceSheetNormalizer';
import { BalanceSheetIntelligenceEngine } from '../domain/engines/BalanceSheetIntelligenceEngine';
import { IntelligenceAssuranceEngine } from '../../../core/intelligence/assurance/engines/IntelligenceAssuranceEngine';

export class FinancialCapabilityAdapter implements CapabilityAdapter {
  public readonly id = 'financial.balance_sheet_intelligence';
  public readonly type = 'FINANCIAL_INTELLIGENCE';
  public readonly version = '1.0.0';

  public async adapt(rawInput: any): Promise<any> {
    // Legacy integration: the adapter does the basic domain work so it can feed the Cognitive Pipeline
    const normalizedData = BalanceSheetNormalizer.normalize(rawInput);
    const assuranceEngine = new IntelligenceAssuranceEngine();
    const dataIntegrityResult = assuranceEngine.assureDataIntegrity(normalizedData);
    
    // The Financial Engine handles pure calculation and domain reasoning
    const legacyOutput = BalanceSheetIntelligenceEngine.execute(normalizedData);
    const finalAssuranceResult = assuranceEngine.assureIntelligenceReasoning(legacyOutput, dataIntegrityResult, normalizedData);
    
    // We package this up into an object that the new Executive Cognitive Runtime can process
    return {
      source: 'BalanceSheetIntelligenceEngine',
      legacyOutput,
      assurance: finalAssuranceResult,
      rawInput
    };
  }
}
