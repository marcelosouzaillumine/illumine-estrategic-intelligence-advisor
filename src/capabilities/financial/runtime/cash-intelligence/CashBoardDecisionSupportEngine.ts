import { CashBoardDecision, CashConfidenceLevel, CashConstraintDiagnosis, OperationalCashBurn, ShareholderDependency, CashSustainability, RevenueCashConversion } from './CashIntelligenceTypes';
import { RunwayClassificationEngine } from './RunwayClassificationEngine';
import { ExecutiveAnalysisContext } from '../../../../core/runtime/executive-consolidation';
import { ExecutivePrimaryMotiveConsistencyEngine } from '../../../../core/runtime/executive-consolidation';

export class CashBoardDecisionSupportEngine {
  public static evaluate(
    fco: number,
    constraint: CashConstraintDiagnosis,
    burn: OperationalCashBurn,
    dependency: ShareholderDependency,
    sustainability: CashSustainability,
    runwayMonths: number,
    confidenceLevel: CashConfidenceLevel,
    cashConversionAnalysis: RevenueCashConversion,
    context?: ExecutiveAnalysisContext
  ): CashBoardDecision {
    const isBurning = fco <= 0;

    const cashGenerationAssessment = isBurning 
      ? 'Não, a operação consome caixa.' 
      : 'Sim, a operação é superavitária e gera caixa.';

    const rawPrimaryConstraint = isBurning 
      ? 'Estrutura operacional deficitária.' 
      : constraint.rationale;

    let primaryConstraint = rawPrimaryConstraint;
    if (context) {
      const motive = ExecutivePrimaryMotiveConsistencyEngine.deriveExecutivePrimaryMotive(context, rawPrimaryConstraint);
      primaryConstraint = motive.label;
    }

    const runwayAssessment = (() => {
      const safeRunway = typeof runwayMonths === 'number' && !isNaN(runwayMonths) ? runwayMonths : 0;
      const classification = RunwayClassificationEngine.classify(safeRunway);
      const label = RunwayClassificationEngine.getLabel(classification);
      return `Runway ${label} (${safeRunway.toFixed(1).replace('.', ',')} meses)`;
    })();

    const shareholderDependency = isBurning 
      ? 'Dependência crítica dos sócios.' 
      : dependency.rationale;

    const boardOutlook = isBurning 
      ? 'Se nada for feito, a liquidez disponível será insuficiente para sustentar a continuidade operacional.' 
      : (sustainability.classification === 'AUTOSSUSTENTADA' 
          ? 'Se nada for feito, a operação continuará gerando caixa e expandindo organicamente sua liquidez.' 
          : 'O contexto apresenta transição. Sem otimizações no ciclo financeiro, poderá não atingir a total independência de capital externo.');

    let immediateAction = 'Manter o monitoramento rigoroso dos indicadores de capital de giro e preservar as reservas de liquidez.';
    if (isBurning) {
      immediateAction = 'Implementar plano emergencial de corte de despesas fixas (Overhead) para reduzir a queima operacional de caixa.';
    } else if (constraint.primaryConstraint === 'ESTOQUES') {
      immediateAction = 'Aprovar otimização imediata do ciclo de estoques e reduzir o ciclo médio de estocagem (PME) para liberar caixa.';
    } else if (constraint.primaryConstraint === 'RECEBIVEIS') {
      immediateAction = 'Rever política de concessão de crédito a clientes e acelerar a cobrança de faturas vencidas para recompor liquidez.';
    } else if (constraint.primaryConstraint === 'CAPEX') {
      immediateAction = 'Controlar rigorosamente novos investimentos (CAPEX) e suspender temporariamente gastos não essenciais.';
    } else if (constraint.primaryConstraint === 'PARTES_RELACIONADAS') {
      immediateAction = 'Suspender repasses não operacionais e adiantamentos financeiros a sócios ou partes relacionadas.';
    }

    const isOperationSelfSustaining = isBurning 
      ? 'Não. A continuidade operacional dependeu de capitalização societária.'
      : 'Sim. A operação gera recursos suficientes para se autossustentar, sem dependência imediata de novas capitalizações societárias.';

    const revenueConversionAssessment = isBurning
      ? `Para cada R$100 vendidos, R$${Math.abs(cashConversionAnalysis?.cashConversionPer100Revenue || 48)} foram consumidos pela operação.`
      : `Para cada R$100 vendidos, R$${Math.abs(cashConversionAnalysis?.cashConversionPer100Revenue || 0)} foram gerados pela operação.`;

    const boardPriorityAssessment = 'Reduzir a queima operacional de caixa e restaurar a autonomia financeira.';

    const acaoMelhoraLiquidez = isBurning
      ? 'Redução imediata de despesas operacionais fixas (Overhead) para conter a queima de caixa.'
      : (constraint.primaryConstraint === 'ESTOQUES'
          ? 'Liquidação promocional de estoques de baixa rotatividade e ajuste no ritmo de compras.'
          : (constraint.primaryConstraint === 'RECEBIVEIS'
              ? 'Antecipação de recebíveis de cartões/boletos e intensificação de cobrança de inadimplentes.'
              : 'Suspensão de novos investimentos (CAPEX) não essenciais para preservar o saldo em tesouraria.'));

    return {
      cashGenerationAssessment,
      primaryConstraint,
      runwayAssessment,
      shareholderDependency,
      boardOutlook,
      immediateAction,
      confidenceLevel,
      isOperationSelfSustaining,
      revenueConversionAssessment,
      boardPriorityAssessment,
      acaoMelhoraLiquidez
    };
  }
}
