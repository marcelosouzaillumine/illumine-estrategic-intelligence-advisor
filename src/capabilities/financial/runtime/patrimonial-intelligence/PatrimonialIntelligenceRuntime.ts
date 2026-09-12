import { FinancialRuntimeContext } from "../financial-context/FinancialRuntimeContextTypes";
import { 
  PatrimonialIntelligenceOutput, 
  BPDataIntegrityStatus, 
  PatrimonialDiagnosis,
  INVENTORY_LIQUIDITY_DISTORTION_THRESHOLD
} from "./PatrimonialIntelligenceTypes";
import { PatrimonialContextMapper } from "./PatrimonialContextMapper";

export interface SimpleBPSummary {
  ativoTotal: number;
  ativoCirculante: number;
  passivoTotal: number;
  passivoCirculante: number;
  patrimonioLiquido: number;
  estoques: number;
  caixaEquivalentes?: number;
  clientes?: number;
  isBalanced: boolean;
}

export class PatrimonialIntelligenceRuntime {
  
  public evaluatePatrimonialStructure(
    context: FinancialRuntimeContext | undefined, 
    bpData: SimpleBPSummary | undefined
  ): PatrimonialIntelligenceOutput {
    
    if (!context) {
      return this.failClosed("MISSING_CONTEXT", "FinancialRuntimeContext is completely missing.");
    }

    const auditTrail: string[] = ["Context injection validated."];
    const blockedConclusions = PatrimonialContextMapper.mapRestrictionsToPatrimonialBlocks(context);
    const lineageHash = PatrimonialContextMapper.generateLineageHash(context);
    
    const output: PatrimonialIntelligenceOutput = {
      patrimonialDiagnosis: [],
      bpDataIntegrityStatus: "VALIDATED",
      contextualAdjustmentsApplied: [],
      blockedPatrimonialConclusions: blockedConclusions,
      allowedPatrimonialConclusions: [],
      requiredDisclosures: [...context.requiredDisclosures],
      interpretationWarnings: [...context.interpretationWarnings],
      legacyEngineMigrationNotes: [],
      confidenceLevel: context.contextualConfidence,
      sourceContextReference: lineageHash,
      auditTrail,
      lineageHash
    };

    if (!bpData) {
      output.bpDataIntegrityStatus = "MISSING";
      output.confidenceLevel = "RESTRICTED";
      output.patrimonialDiagnosis.push({
        code: "INCONSISTENT_BP_DATA_PREVENTS_DIAGNOSIS",
        executiveExplanation: "BP data is entirely missing."
      });
      return output;
    }

    if (!bpData.isBalanced || bpData.ativoTotal === 0 || bpData.passivoTotal === 0) {
      output.bpDataIntegrityStatus = "INCONSISTENT";
      output.confidenceLevel = "RESTRICTED";
      output.patrimonialDiagnosis.push({
        code: "INCONSISTENT_BP_DATA_PREVENTS_DIAGNOSIS",
        executiveExplanation: "Balance sheet does not reconcile or contains zeroed critical totals."
      });
      output.blockedPatrimonialConclusions.push({
        conclusionType: "ALL_PATRIMONIAL_CONCLUSIONS",
        deterministicTrigger: "BP Unbalanced or Empty",
        limitationCreated: "Engine failed closed due to corrupted BP.",
        sourceRule: "BP Integrity Guard"
      });
      return output;
    }

    if (bpData.ativoCirculante === 0 || bpData.passivoCirculante === 0) {
      output.bpDataIntegrityStatus = "PARTIAL";
      output.confidenceLevel = "LOW";
      auditTrail.push("BP data is partial (missing current asset/liability structures).");
    }

    const hasFatalBlock = blockedConclusions.some(c => c.conclusionType === "ALL_PATRIMONIAL_CONCLUSIONS" || c.conclusionType === "ALL_DOWNSTREAM_EVALUATION" || c.conclusionType === "STRONG_DIAGNOSIS");
    
    if (hasFatalBlock) {
      output.patrimonialDiagnosis.push({
        code: "INSUFFICIENT_CONTEXT_FOR_STRONG_DIAGNOSIS",
        executiveExplanation: "Context restrictions prevent any strong patrimonial diagnosis."
      });
      output.confidenceLevel = "RESTRICTED";
      return output;
    }

    const segProfile = context.segmentIntelligenceProfile;

    if (segProfile.assetIntensityProfile === "ASSET_LIGHT") {
      output.patrimonialDiagnosis.push({
        code: "ASSET_LIGHT_STRUCTURE_VALIDATED",
        executiveExplanation: "Asset-light operation recognized. Low fixed assets are not penalized."
      });
      output.contextualAdjustmentsApplied.push("Bypassed generic low-fixed-asset penalization.");
      output.legacyEngineMigrationNotes.push("LOW_FIXED_ASSET_PENALTY_SUSPENDED_FOR_ASSET_LIGHT");
    }

    if (segProfile.workingCapitalCycleProfile === "MISMATCH_RISK") {
      if (segProfile.segmentClassification.toLowerCase().includes("hospital") || segProfile.segmentClassification.toLowerCase().includes("saúde")) {
         output.patrimonialDiagnosis.push({
           code: "HEALTHCARE_RECEIVABLES_REQUIRE_REPASSE_VALIDATION",
           executiveExplanation: "Healthcare operation detected. Receivables involve repasses/glosas and require deeper validation."
         });
         output.requiredDisclosures.push("Receivables aging must be verified before strong liquidity conclusions.");
      } else {
         output.patrimonialDiagnosis.push({
           code: "CAPITAL_CYCLE_RISK_REQUIRES_CASH_VALIDATION",
           executiveExplanation: "Structural capital cycle mismatch. Standard current ratio is misleading."
         });
         output.requiredDisclosures.push("Cash conversion cycle and aging must be validated.");
      }
      output.legacyEngineMigrationNotes.push("CURRENT_RATIO_STRONG_CONCLUSION_BLOCKED");
    }

    if (bpData.ativoCirculante > 0) {
      const inventoryRatio = bpData.estoques / bpData.ativoCirculante;
      if (inventoryRatio > INVENTORY_LIQUIDITY_DISTORTION_THRESHOLD) {
        output.patrimonialDiagnosis.push({
          code: "APPARENT_LIQUIDITY_DISTORTED_BY_INVENTORY",
          executiveExplanation: `Inventory represents ${(inventoryRatio*100).toFixed(1)}% of current assets, distorting apparent liquidity.`
        });
        output.contextualAdjustmentsApplied.push(`Applied INVENTORY_LIQUIDITY_DISTORTION_THRESHOLD (${INVENTORY_LIQUIDITY_DISTORTION_THRESHOLD}) check.`);
        output.requiredDisclosures.push("Inventory aging and obsolescence risk must be evaluated.");
      }
    }

    if (!context.allowedConclusions.find(c => c.conclusionType === "STANDARD_PROFITABILITY_SCORING") || segProfile.segmentClassification.toLowerCase().includes("ong")) {
       output.patrimonialDiagnosis.push({
         code: "NGO_SUSTAINABILITY_REQUIRES_RESTRICTED_FUND_SEPARATION",
         executiveExplanation: "NGO detected. Profitability logic replaced with Sustainability logic."
       });
       output.legacyEngineMigrationNotes.push("GENERIC_PROFITABILITY_INTERPRETATION_BLOCKED_FOR_NGO");
       output.requiredDisclosures.push("Restricted vs Unrestricted funds must be separated.");
    }

    if (segProfile.revenueModelSensitivity === "PROJECT_BASED") {
       output.patrimonialDiagnosis.push({
         code: "PROJECT_BASED_CONCENTRATION_RISK",
         executiveExplanation: "Project-based operation implies irregular cash flow and receivable concentration risk."
       });
       output.requiredDisclosures.push("Receivables concentration by project/client must be reviewed.");
    }

    if (segProfile.institutionalMaturityContext === "EARLY_STAGE" || context.requiredContextBeforeExecution.historicalDensityValidated === false) {
       output.blockedPatrimonialConclusions.push({
         conclusionType: "LONGITUDINAL_MATURITY_CLAIMS",
         deterministicTrigger: "Early stage or low historical density",
         limitationCreated: "Refusing to emit historical maturity claims.",
         sourceRule: "Contextual Density Guard"
       });
       output.requiredDisclosures.push("Longitudinal evaluation is disabled due to short operational history.");
    }

    if (output.patrimonialDiagnosis.length === 0) {
      output.patrimonialDiagnosis.push({
        code: "PATRIMONIAL_STRUCTURE_HEALTHY",
        executiveExplanation: "Patrimonial structure does not flag any critical contextual distortions."
      });
      output.allowedPatrimonialConclusions.push("Standard liquidity interpretation allowed.");
    }

    auditTrail.push("Context-Aware rules successfully applied.");
    
    return output;
  }

  private failClosed(reason: string, details: string): PatrimonialIntelligenceOutput {
    return {
      patrimonialDiagnosis: [{
        code: "INSUFFICIENT_CONTEXT_FOR_STRONG_DIAGNOSIS",
        executiveExplanation: details
      }],
      bpDataIntegrityStatus: "MISSING",
      contextualAdjustmentsApplied: [],
      blockedPatrimonialConclusions: [{
        conclusionType: "ALL_PATRIMONIAL_CONCLUSIONS",
        deterministicTrigger: reason,
        limitationCreated: details,
        sourceRule: "Mandatory Context Guard"
      }],
      allowedPatrimonialConclusions: [],
      requiredDisclosures: [],
      interpretationWarnings: ["Runtime failed closed due to missing or invalid context."],
      legacyEngineMigrationNotes: [],
      confidenceLevel: "RESTRICTED",
      sourceContextReference: "NONE",
      auditTrail: ["FAIL_CLOSED triggered."],
      lineageHash: "FAIL_CLOSED"
    };
  }
}
