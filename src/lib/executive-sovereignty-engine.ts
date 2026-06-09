import type {
  ExecutiveSovereigntyProfile,
  ExecutiveSovereigntyInput,
} from './executive-sovereignty-types';

const FIDUCIARY_DISCLAIMER =
  'Esta camada consolida as inteligências institucionais previamente produzidas para avaliar o grau de soberania executiva da organização, sem alterar métricas, indicadores, classificações, scores ou saídas fiduciárias existentes.';

export function buildExecutiveSovereigntyProfile(
  input: ExecutiveSovereigntyInput | undefined,
): ExecutiveSovereigntyProfile | undefined {
  if (!input) return undefined;

  const {
    governanceDigitalTwin,
    esgIntelligence,
    valuationIntelligence,
    benchmarkIntelligence,
    sectorIntelligence,
    capitalAllocationIntelligence,
  } = input;

  if (
    !governanceDigitalTwin &&
    !esgIntelligence &&
    !valuationIntelligence &&
    !benchmarkIntelligence &&
    !sectorIntelligence &&
    !capitalAllocationIntelligence
  ) {
    return undefined;
  }

  const executionCapacity = governanceDigitalTwin?.executionCapacity?.classification || "LOW";
  const valuationReadiness = valuationIntelligence?.valuationReadiness || "LOW";
  const benchmarkPosition = benchmarkIntelligence?.institutionalPosition || "EARLY";
  const esgGovClass = esgIntelligence?.governance?.classification || "LOW";

  let sovereigntyClassification: "FOUNDATIONAL" | "DEVELOPING" | "ADVANCED" | "SOVEREIGN" = "FOUNDATIONAL";

  if (
    executionCapacity === "HIGH" &&
    valuationReadiness === "HIGH" &&
    benchmarkPosition === "LEADING" &&
    esgGovClass === "HIGH"
  ) {
    sovereigntyClassification = "SOVEREIGN";
  } else if (
    (executionCapacity === "HIGH" || executionCapacity === "MODERATE") &&
    valuationReadiness === "HIGH"
  ) {
    sovereigntyClassification = "ADVANCED";
  } else if (
    executionCapacity === "LOW" &&
    valuationReadiness === "LOW"
  ) {
    sovereigntyClassification = "FOUNDATIONAL";
  } else {
    sovereigntyClassification = "DEVELOPING";
  }

  const sovereigntyStrengths: string[] = [];
  const sovereigntyConstraints: string[] = [];
  const sovereigntyDependencies: string[] = [];
  const sovereigntyRisks: string[] = [];
  const sovereigntyOpportunities: string[] = [];

  if (sectorIntelligence?.capabilityAdvantages) {
    sovereigntyStrengths.push(...sectorIntelligence.capabilityAdvantages);
  }
  if (benchmarkIntelligence?.competitiveAdvantages) {
    sovereigntyStrengths.push(...benchmarkIntelligence.competitiveAdvantages.map(a => a.advantage));
  }

  if (sectorIntelligence?.capabilityGaps) {
    sovereigntyConstraints.push(...sectorIntelligence.capabilityGaps);
  }

  if (capitalAllocationIntelligence?.executionAccelerationPriorities) {
    sovereigntyDependencies.push(...capitalAllocationIntelligence.executionAccelerationPriorities);
  }
  if (capitalAllocationIntelligence?.governanceInvestmentPriorities) {
    sovereigntyDependencies.push(...capitalAllocationIntelligence.governanceInvestmentPriorities);
  }
  if (capitalAllocationIntelligence?.strategicInvestmentPriorities) {
    sovereigntyDependencies.push(...capitalAllocationIntelligence.strategicInvestmentPriorities);
  }

  if (esgGovClass === "LOW") {
    sovereigntyRisks.push("Fraqueza estrutural de governança ESG impõe restrições severas à soberania");
  }
  
  if (sectorIntelligence?.sectorOpportunityProfile) {
    sovereigntyOpportunities.push(...sectorIntelligence.sectorOpportunityProfile);
  }

  return {
    sovereigntyClassification,
    sovereigntyStrengths,
    sovereigntyConstraints,
    sovereigntyDependencies,
    sovereigntyRisks,
    sovereigntyOpportunities,
    strategicAutonomyAssessment: `Classificação de Soberania Institucional apurada: Nível ${sovereigntyClassification}.`,
    governanceResilienceAssessment: `Avaliação de prontidão de valuation identificada como ${valuationReadiness}.`,
    capitalAllocationReadiness: `Status primário de alocação de capital processado e consolidado deterministicamente.`,
    institutionalReadinessSummary: `A instituição apresenta capacidade de execução ${executionCapacity} diante dos desafios setoriais e operacionais.`,
    fiduciaryDisclaimer: FIDUCIARY_DISCLAIMER,
  };
}
