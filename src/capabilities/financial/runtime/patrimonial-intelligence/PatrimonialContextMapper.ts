import { FinancialRuntimeContext, BlockedConclusion } from "../financial-context/FinancialRuntimeContextTypes";

export class PatrimonialContextMapper {
  public static mapRestrictionsToPatrimonialBlocks(context: FinancialRuntimeContext): BlockedConclusion[] {
    const inheritedBlocks = [...context.blockedConclusions];
    
    if (context.runtimeGuards.failClosedTriggered) {
      inheritedBlocks.push({
        conclusionType: "ALL_PATRIMONIAL_CONCLUSIONS",
        deterministicTrigger: "FinancialRuntimeContext fail-closed active",
        limitationCreated: "Entire patrimonial governance engine is blocked.",
        sourceRule: "Propagation Integrity Mapper"
      });
    }
    
    return inheritedBlocks;
  }

  public static generateLineageHash(context: FinancialRuntimeContext): string {
    const raw = `${context.institutionalBusinessProfile.segmentoOperacional}_${context.contextualConfidence}_${context.blockedConclusions.length}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return `PAT_LIN_${Math.abs(hash).toString(16).toUpperCase()}`;
  }
}
