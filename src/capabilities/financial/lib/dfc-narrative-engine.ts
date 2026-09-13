import type { DFCNarrativeInput, DFCNarrative } from "./dfc-narrative-types";

/** Helper to format optional numeric values */
const formatValue = (value?: number) =>
  typeof value === "number" ? value.toLocaleString("pt-BR") : "não disponível";

/**
 * Pure function – never mutates input or any global state.
 * Returns `undefined` when `narrativeContext` is missing, satisfying the constitutional rule.
 */
export function buildDfcNarrative(input: DFCNarrativeInput): DFCNarrative | undefined {
  const {
    narrativeContext,
    fco,
    fci,
    fcf,
    runwayMonths,
    externalCapitalDependency,
    cashGenerationQuality,
    growthFinancingMode,
  } = input;

  if (!narrativeContext) return undefined;

  const disclaimer =
    "Esta narrativa contextualiza a DFC a partir do estágio institucional, sem alterar FCO, FCI, FCF, runway, dependência de capital, scores ou classificações fiduciárias.";

  // Runway wording based on thresholds
  const runwayLabel = (() => {
    if (runwayMonths === undefined) return "informação de runway indisponível";
    if (runwayMonths < 3) return "crítico";
    if (runwayMonths <= 6) return "atenção";
    if (runwayMonths <= 12) return "monitoramento";
    return "confortável";
  })();

  // Institutional stage guard – use only the defined enum values
  const stage = narrativeContext.institutionalStage ?? "UNKNOWN";
  const stagePrefix = (() => {
    switch (stage) {
      case "FORMATION":
        return "Na fase de formação";
      case "SCALING":
        return "Durante a fase de scaling";
      case "SUSTAINABLE":
        return "Na fase sustentável";
      case "RECOVERY":
        return "Em fase de recuperação";
      case "STRESSED":
        return "Em situação de estresse";
      case "TRANSITION":
        return "Em fase de transição";
      default:
        return "No estágio institucional";
    }
  })();

  const fcoNarrative = `${stagePrefix}, o fluxo operacional (FCO) foi de ${formatValue(fco)}.`;
  const fciNarrative = `${stagePrefix}, o fluxo de investimentos (FCI) totalizou ${formatValue(fci)}.`;
  const fcfNarrative = `${stagePrefix}, o fluxo de financiamentos (FCF) resultou em ${formatValue(fcf)}.`;
  const runwayNarrative = `${stagePrefix}, o runway de caixa está classificado como ${runwayLabel}.`;
  const capitalDependencyNarrative =
    externalCapitalDependency !== undefined
      ? `${stagePrefix}, a dependência de capital externo é de ${externalCapitalDependency.toFixed(1)}%.`
      : `${stagePrefix}, a dependência de capital externo não está disponível.`;
  const cashQualityNarrative = cashGenerationQuality
    ? `${stagePrefix}, a qualidade da geração de caixa é considerada ${cashGenerationQuality}.`
    : `${stagePrefix}, a qualidade da geração de caixa não foi avaliada.`;
  const financingModeNarrative = growthFinancingMode
    ? `${stagePrefix}, o crescimento está sendo financiado por ${growthFinancingMode.toLowerCase()}.`
    : `${stagePrefix}, o modo de financiamento do crescimento não está definido.`;

  return {
    fcoNarrative,
    fciNarrative,
    fcfNarrative,
    runwayNarrative,
    capitalDependencyNarrative,
    cashQualityNarrative,
    financingModeNarrative,
    fiduciaryDisclaimer: disclaimer,
  };
}
