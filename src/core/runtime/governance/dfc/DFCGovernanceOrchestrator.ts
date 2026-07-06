import { CashFlowGovernanceOutput } from './CashFlowGovernanceOutput';
import { DFCCashFlowIntegrityGuard } from './DFCCashFlowIntegrityGuard';
import { DFCCashBPDivergenceAudit } from './DFCCashBPDivergenceAudit';
import { DFCShareholderDependencyEngine } from './DFCShareholderDependencyEngine';
import { DFCNarrativeConsistencyAudit } from './DFCNarrativeConsistencyAudit';
import { DFCCausalChainEngine } from './DFCCausalChainEngine';
import { DFCCashFlowExplainabilityEngine } from './DFCCashFlowExplainabilityEngine';
import { DFCRecommendationConsistencyAudit } from './DFCRecommendationConsistencyAudit';

export class DFCGovernanceOrchestrator {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  static orchestrate(
    exerciseYear: number,
    fco: number,
    fci: number,
    fcf: number,
    netVariation: number,
    accountingProfit: number,
    shareholderContributions: number,
    cashEndBP: number,
    cashEndDFC: number,
    runwayMonths: number = 0,
    isRecurrentNegativeFCO: boolean = false,
    receitaLiquida?: number
  ): CashFlowGovernanceOutput {
    
    // 1. Math Integrity
    const integrityCheck = DFCCashFlowIntegrityGuard.validate(fco, fci, fcf, netVariation);
    
    if (!integrityCheck.isValid) {
      return this.buildBlockedOutput(exerciseYear, fco, fci, fcf, netVariation, accountingProfit, shareholderContributions, integrityCheck.blockReason!);
    }

    // 2. Divergence Audit
    const divergence = DFCCashBPDivergenceAudit.evaluate(accountingProfit, fco, cashEndBP, cashEndDFC);
    if (divergence.severity === 'MATHEMATICAL_BLOCKING') {
      return this.buildBlockedOutput(exerciseYear, fco, fci, fcf, netVariation, accountingProfit, shareholderContributions, divergence.explanation!);
    }

    // 3. Shareholder Dependency
    const dependency = DFCShareholderDependencyEngine.evaluate(fco, shareholderContributions, runwayMonths, isRecurrentNegativeFCO);

    // 4. Narrative Consistency
    const narrative = DFCNarrativeConsistencyAudit.evaluate(fco, dependency, divergence.explanation);

    // 5. Causal Chain Engine
    const causal = DFCCausalChainEngine.evaluate(accountingProfit, fco, shareholderContributions, cashEndDFC);
    if (causal.hasBreak) {
      return this.buildBlockedOutput(exerciseYear, fco, fci, fcf, netVariation, accountingProfit, shareholderContributions, causal.breakReason!);
    }

    // 6. Explainability Layer
    const explainability = DFCCashFlowExplainabilityEngine.evaluate(fco, fci, fcf, dependency);

    // 7. Recommendation Consistency Audit
    const recAudit = DFCRecommendationConsistencyAudit.evaluate(fco, dependency, narrative.primaryRecommendation);
    if (!recAudit.isConsistent) {
      return this.buildBlockedOutput(exerciseYear, fco, fci, fcf, netVariation, accountingProfit, shareholderContributions, recAudit.divergenceReason!);
    }

    let cashConversionAnalysis;
    if (receitaLiquida !== undefined && receitaLiquida > 0) {
      const ratio = fco / receitaLiquida;
      const cashConversionPer100Revenue = Math.max(0, ratio * 100);
      let rationale = '';
      if (ratio < 0) {
        rationale = 'A operação está consumindo caixa a cada real faturado, indicando modelo de negócio insustentável no formato atual.';
      } else if (ratio < 0.05) {
        rationale = 'Baixíssima conversão de faturamento em caixa. O esforço comercial não se traduz em liquidez livre.';
      } else if (ratio < 0.15) {
        rationale = 'Conversão moderada de faturamento em caixa livre.';
      } else {
        rationale = 'Alta capacidade de converter vendas diretamente em liquidez para a companhia.';
      }
      cashConversionAnalysis = {
        ratio,
        cashConversionPer100Revenue,
        rationale
      };
    }

    return {
      exerciseYear,
      sourceStatement: 'CASH_FLOW_STATEMENT',
      metrics: {
        fco, fci, fcf, netVariation, accountingProfit, shareholderContributions, receitaLiquida
      },
      classifications: {
        shareholderDependency: dependency,
        cashGenerationStatus: fco > 0 ? 'GERACAO_OPERACIONAL' : 'CONSUMO_OPERACIONAL',
        divergenceSeverity: divergence.severity
      },
      narratives: {
        divergenceExplanation: divergence.explanation,
        executiveSummary: narrative.summary,
        primaryRecommendation: narrative.primaryRecommendation,
        causalNarrative: causal.causalNarrative,
        cashConversionAnalysis
      },
      explainability,
      validation: {
        isValid: true,
        blockReason: null
      }
    };
  }

  private static buildBlockedOutput(
    exerciseYear: number,
    fco: number,
    fci: number,
    fcf: number,
    netVariation: number,
    accountingProfit: number,
    shareholderContributions: number,
    reason: string
  ): CashFlowGovernanceOutput {
    return {
      exerciseYear,
      sourceStatement: 'CASH_FLOW_STATEMENT',
      metrics: {
        fco: isNaN(fco) ? 0 : fco,
        fci: isNaN(fci) ? 0 : fci,
        fcf: isNaN(fcf) ? 0 : fcf,
        netVariation: isNaN(netVariation) ? 0 : netVariation,
        accountingProfit: isNaN(accountingProfit) ? 0 : accountingProfit,
        shareholderContributions: isNaN(shareholderContributions) ? 0 : shareholderContributions
      },
      classifications: {
        shareholderDependency: 'AUTOSSUFICIENTE',
        cashGenerationStatus: 'CONSUMO_OPERACIONAL',
        divergenceSeverity: 'MATHEMATICAL_BLOCKING'
      },
      narratives: {
        divergenceExplanation: null,
        executiveSummary: 'Operação bloqueada por inconsistência severa de dados ou quebra de causalidade.',
        primaryRecommendation: 'Corrigir as demonstrações contábeis antes de prosseguir com a análise executiva.',
        causalNarrative: 'Cadeia causal interrompida devido a bloqueio de governança.'
      },
      explainability: {
        generators: [],
        consumers: [],
        externalDependencies: [],
        recommendationDrivers: []
      },
      validation: {
        isValid: false,
        blockReason: reason
      }
    };
  }
}
