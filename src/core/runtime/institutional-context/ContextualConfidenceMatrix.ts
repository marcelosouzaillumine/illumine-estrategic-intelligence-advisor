import { InstitutionalBusinessProfile } from "../institutional-identity/InstitutionalBusinessProfile";
import { InstitutionalConfidenceMatrix, ConfidenceLevel } from "./SegmentIntelligenceTypes";

export function calculateConfidenceMatrix(profile: InstitutionalBusinessProfile): InstitutionalConfidenceMatrix {
  let completenessScore = 0;
  const expectedFields = [
    "segmentoOperacional",
    "modeloOperacional",
    "intensidadeEstoque",
    "intensidadeCapital",
    "perfilCicloFinanceiro",
    "perfilMargem"
  ];

  let missingCore = false;

  for (const field of expectedFields) {
    if (profile[field as keyof InstitutionalBusinessProfile]) {
      completenessScore += 1;
    } else {
      if (field === "segmentoOperacional" || field === "modeloOperacional") {
        missingCore = true;
      }
    }
  }

  const dataCompleteness = completenessScore / expectedFields.length;
  
  const structuralClarity = missingCore ? 0.0 : (dataCompleteness > 0.8 ? 1.0 : 0.5);
  const historicalDensityProxy = dataCompleteness > 0.5 ? 1.0 : 0.2; 

  let overallConfidence: ConfidenceLevel = "HIGH";

  if (missingCore || dataCompleteness < 0.4) {
    overallConfidence = "RESTRICTED";
  } else if (dataCompleteness < 0.8) {
    overallConfidence = "MODERATE";
  }

  return {
    overallConfidence,
    dataCompleteness,
    structuralClarity,
    historicalDensityProxy
  };
}
