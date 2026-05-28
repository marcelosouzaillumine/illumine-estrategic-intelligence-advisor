// src/core/runtime/KPISemanticIntelligenceEngine.ts

export interface KPISemanticContext {
  kpiId: string;
  rawValue: number;
  semanticInterpretation: string;
}

export function translateKPIsToSemantics(
  ebitdaMargin: number,
  cashConversionRatio: number,
  retentionRatio: number
): KPISemanticContext[] {
  
  const semantics: KPISemanticContext[] = [];

  // EBITDA Margin
  let ebitdaSemantics = '';
  if (ebitdaMargin <= 0) {
    ebitdaSemantics = 'A operação apresenta destruição operacional de valor, indicando ausência de absorção da estrutura fixa atual.';
  } else if (ebitdaMargin < 0.1) {
    ebitdaSemantics = 'Margem operacional frágil, vulnerável a choques de custos ou retração de demanda.';
  } else {
    ebitdaSemantics = 'Estrutura operacional com margem resiliente, evidenciando capacidade de absorção dos custos fixos.';
  }
  semantics.push({ kpiId: 'EBITDA_MARGIN', rawValue: ebitdaMargin, semanticInterpretation: ebitdaSemantics });

  // Cash Conversion
  let conversionSemantics = '';
  if (cashConversionRatio <= 0) {
    conversionSemantics = 'Incapacidade crônica de transformar resultado contábil em liquidez tangível.';
  } else if (cashConversionRatio < 0.5) {
    conversionSemantics = 'Baixa eficiência na conversão de caixa, sugerindo retenção de valor no capital de giro estrutural.';
  } else {
    conversionSemantics = 'Alta eficiência na monetização do resultado, com forte capacidade de geração de liquidez.';
  }
  semantics.push({ kpiId: 'CASH_CONVERSION', rawValue: cashConversionRatio, semanticInterpretation: conversionSemantics });

  // Retention Ratio
  let retentionSemantics = '';
  if (retentionRatio <= 0) {
    retentionSemantics = 'Descapitalização estrutural através de políticas extrativas ou prejuízos recorrentes.';
  } else if (retentionRatio < 0.3) {
    retentionSemantics = 'Retenção marginal, priorizando distribuição ou sofrendo com ineficiência de capitalização orgânica.';
  } else {
    retentionSemantics = 'Cultura fiduciária de preservação patrimonial, direcionando valor para fortalecimento institucional.';
  }
  semantics.push({ kpiId: 'RETENTION_RATIO', rawValue: retentionRatio, semanticInterpretation: retentionSemantics });

  return semantics;
}
