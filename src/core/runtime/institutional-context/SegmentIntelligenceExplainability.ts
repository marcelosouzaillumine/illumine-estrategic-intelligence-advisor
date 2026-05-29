import { SegmentIntelligenceProfile } from "./SegmentIntelligenceTypes";

export function generateExecutiveExplanation(profile: SegmentIntelligenceProfile): string {
  let explanation = `The organization operates in the ${profile.segmentClassification || 'Unknown'} segment. `;
  
  if (profile.confidenceLevel === "RESTRICTED") {
    explanation += "Due to missing core institutional data, the system restricts strong downstream diagnostics. ";
  }

  if (!profile.downstreamRuntimeRestrictions.allowStaticLiquidityInterpretation) {
    explanation += "There is a structural Capital Cycle Mismatch (e.g. inventory-heavy, long cycles, or healthcare repasses); static liquidity metrics must not be read in isolation. ";
  }

  if (!profile.downstreamRuntimeRestrictions.allowStandardProfitabilityMetrics) {
    explanation += "As a non-profit/NGO, profitability metrics have been replaced by Institutional Sustainability parameters. ";
  }
  
  if (!profile.downstreamRuntimeRestrictions.allowPatrimonialScoring && profile.assetIntensityProfile === "ASSET_LIGHT") {
    explanation += "The operation is Asset-Light; standard patrimonial accumulation expectations do not apply. ";
  }

  return explanation.trim();
}
