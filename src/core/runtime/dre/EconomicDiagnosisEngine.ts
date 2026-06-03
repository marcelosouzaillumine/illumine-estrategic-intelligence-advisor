import { NormalizedDREPayload } from './DREExecutiveDataMapper';
import { RevenueEconomicStructureOutput } from './RevenueEconomicStructureEngine';
import { BreakEvenAnalysisOutput } from './BreakEvenAnalysisEngine';
import { OperationalAbsorptionOutput } from './OperationalAbsorptionEngine';
import { EconomicBurnRateOutput } from './EconomicBurnRateEngine';
import { ExecutiveMetricResult } from './ExecutiveEmptyStatePolicy';
import { DRERecoverabilityGovernanceEngine } from './DRERecoverabilityGovernanceEngine';

export interface EconomicDiagnosisInput {
  normalizedDRE: NormalizedDREPayload;
  revenueEconomicStructure: ExecutiveMetricResult<RevenueEconomicStructureOutput>;
  breakEvenAnalysis: ExecutiveMetricResult<BreakEvenAnalysisOutput>;
  operationalAbsorption: ExecutiveMetricResult<OperationalAbsorptionOutput>;
  economicBurnRate: ExecutiveMetricResult<EconomicBurnRateOutput>;
}

export interface EconomicDiagnosisOutput {
  valueCreationAssessment: string;
  primaryConstraint: string;
  recoverabilityAssessment: string;
  strategicPriority: string;
  boardOutlook: string;
}

export class EconomicDiagnosisEngine {
  public static evaluate(input: EconomicDiagnosisInput): EconomicDiagnosisOutput {
    if (!input.normalizedDRE.netRevenue.value && input.normalizedDRE.netRevenue.source.startsWith('MISSING')) {
      return {
        valueCreationAssessment: 'Indeterminado',
        primaryConstraint: 'Indeterminado',
        recoverabilityAssessment: 'Indeterminado',
        strategicPriority: 'Indeterminado',
        boardOutlook: 'Dados insuficientes para análise executiva desta seção.'
      };
    }

    const { netProfit, grossMargin, adminExpenses, netRevenue, breakEvenCoverage } = input.normalizedDRE;

    // 1. Gera Valor?
    let valueCreationAssessment = 'Não';
    if (netProfit.value > 0) valueCreationAssessment = 'Sim';

    // 2. Primary Constraint
    let primaryConstraint = 'Ausência de Restrições Estruturais';
    if (netProfit.value < 0) {
      if (grossMargin.value <= 0.1) {
        primaryConstraint = 'Margem de contribuição apertada';
      } else if (Math.abs(adminExpenses.value) > netRevenue.value) {
        primaryConstraint = 'Escala insuficiente';
      } else {
        primaryConstraint = 'Estrutura de custos inflexível';
      }
    }

    // 3. Recoverability
    const coveragePct = (breakEvenCoverage?.value ?? 0) * 100;
    const recoverabilityAssessment = DRERecoverabilityGovernanceEngine.evaluate(
      coveragePct,
      grossMargin.value
    );

    // 4. Strategic Priority
    let strategicPriority = 'Expansão acelerada e ganho de market-share';
    if (primaryConstraint === 'Escala insuficiente') {
      strategicPriority = 'Crescimento da receita com preservação de margem';
    } else if (primaryConstraint === 'Margem de contribuição apertada') {
      strategicPriority = 'Otimização de preços e custos diretos';
    } else if (primaryConstraint === 'Estrutura de custos inflexível') {
      strategicPriority = 'Redimensionamento de estrutura fixa';
    }

    // 5. Board Outlook
    let boardOutlook = 'A empresa está preparada para captar valor ou acelerar crescimento sem risco estrutural iminente.';
    if (netProfit.value < 0) {
      boardOutlook = 'A operação continuará destruindo valor econômico e ampliando a pressão sobre a rentabilidade futura.';
    }

    return {
      valueCreationAssessment,
      primaryConstraint,
      recoverabilityAssessment,
      strategicPriority,
      boardOutlook
    };
  }
}
