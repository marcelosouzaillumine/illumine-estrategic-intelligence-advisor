// DLPA Narrative Engine
import type { DLPANarrative, DLPANarrativeInput } from "./dlpa-narrative-types";

// Local formatter – pt‑BR locale, returns placeholder when undefined
const formatValue = (value?: number): string =>
  typeof value === "number" ? value.toLocaleString("pt-BR") : "não disponível";

export const buildDlpaNarrative = (
  input: DLPANarrativeInput | undefined
): DLPANarrative | undefined => {
  if (!input?.narrativeContext) return undefined;

  const disclaimer =
    "Esta narrativa contextualiza a DLPA a partir do estágio institucional, sem alterar lucros acumulados, prejuízos acumulados, retenções, distribuições, recomposição patrimonial, preservação de capital, scores ou classificações fiduciárias.";

  return {
    accumulatedProfitNarrative: `Lucros acumulados: ${formatValue(input.accumulatedProfit)}`,
    accumulatedLossNarrative: `Prejuízos acumulados: ${formatValue(input.accumulatedLoss)}`,
    retainedEarningsNarrative: `Retenção de resultados: ${formatValue(input.retainedEarnings)}`,
    distributionNarrative: `Distribuição aos sócios: ${formatValue(input.distribution)}`,
    reinvestmentNarrative: `Reinvestimento: ${formatValue(input.reinvestment)}`,
    patrimonialRecompositionNarrative: `Recomposição patrimonial: ${formatValue(input.patrimonialRecomposition)}`,
    capitalPreservationNarrative: `Preservação de capital: ${formatValue(input.capitalPreservation)}`,
    partnerRemunerationNarrative: input.partnerRemunerationPolicy
      ? `Remuneração dos sócios: ${input.partnerRemunerationPolicy}.`
      : "Remuneração dos sócios: não disponível.",
    fiduciaryDisclaimer: disclaimer,
  };
};
