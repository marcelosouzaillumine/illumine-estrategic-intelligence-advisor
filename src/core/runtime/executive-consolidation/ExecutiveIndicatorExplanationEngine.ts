import { BalanceSheetTechnicalIndicatorEngine, TechnicalIndicatorMetadata } from './BalanceSheetTechnicalIndicatorRegistry';

export interface IndicatorExplanation {
  executiveDefinition: string;
  managerialPurpose: string;
  decisionImpact: string;
  classificationReason: string;
  implications: {
    aboveExpected: string;
    belowExpected: string;
  };
}

export class ExecutiveIndicatorExplanationEngine {
  static explain(indicatorName: string, classificationTone?: string): IndicatorExplanation {
    const metadata = BalanceSheetTechnicalIndicatorEngine.getMetadata(indicatorName);

    // Dynamic generation based on metadata and current tone
    let reason = 'Avaliando desempenho com base no referencial metodológico do setor.';
    if (classificationTone === 'success') {
      reason = `Métrica atende ou supera o referencial exigido (${metadata.referenceRange}).`;
    } else if (classificationTone === 'critical') {
      reason = `Métrica em nível crítico, distante do referencial aceitável (${metadata.referenceRange}).`;
    } else if (classificationTone === 'warning') {
      reason = `Métrica em zona de atenção. Requer monitoramento próximo para evitar ruptura do referencial (${metadata.referenceRange}).`;
    }

    return {
      executiveDefinition: metadata.purpose,
      managerialPurpose: metadata.methodologicalNotes,
      decisionImpact: metadata.limitations, // Mapped limitation to decision impact conceptually for now
      classificationReason: reason,
      implications: {
        aboveExpected: 'Pode indicar ineficiência de alocação (se liquidez/ativos ociosos) ou extrema proteção.',
        belowExpected: 'Pode indicar alto risco de solvência ou deficiência de caixa (dependendo do indicador).'
      }
    };
  }
}
