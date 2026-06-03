import { CashBoardDecision, CashConfidenceLevel, CashConstraintDiagnosis, OperationalCashBurn, ShareholderDependency, CashSustainability } from './CashIntelligenceTypes';

export class CashBoardDecisionSupportEngine {
  public static evaluate(
    fco: number,
    constraint: CashConstraintDiagnosis,
    burn: OperationalCashBurn,
    dependency: ShareholderDependency,
    sustainability: CashSustainability,
    runwayMonths: number,
    confidenceLevel: CashConfidenceLevel
  ): CashBoardDecision {
    const isBurning = fco < 0;

    const cashGenerationAssessment = isBurning 
      ? 'Não, a operação é deficitária e consome caixa.' 
      : 'Sim, a operação é superavitária e gera caixa.';

    const primaryConstraint = constraint.rationale;

    let runwayAssessment = '';
    if (runwayMonths >= 12) {
      runwayAssessment = 'A organização possui fôlego de sobrevivência (runway) superior a 12 meses.';
    } else if (runwayMonths > 0) {
      runwayAssessment = `Sobrevivência estimada crítica de ${runwayMonths.toFixed(1)} meses.`;
    } else {
      runwayAssessment = 'Sem runway disponível (liquidez operacional esgotada).';
    }

    const shareholderDependency = dependency.rationale;

    let boardOutlook = '';
    if (sustainability.classification === 'AUTOSSUSTENTADA') {
      boardOutlook = 'Se nada for feito, a operação continuará gerando caixa e expandindo organicamente sua liquidez.';
    } else if (sustainability.classification === 'INSUSTENTAVEL') {
      boardOutlook = 'Se nada for feito, a organização esgotará sua liquidez no curto prazo, entrando em colapso financeiro estrutural sem novos aportes ou forte redução de queima.';
    } else if (sustainability.classification === 'DEPENDENTE_DE_CAPITAL') {
      boardOutlook = 'Se nada for feito, a organização continuará altamente dependente de injeções de capital dos sócios, diluindo sócios ou aumentando risco de crédito.';
    } else {
      boardOutlook = 'O cenário apresenta transição. Sem otimizações no ciclo financeiro, poderá não atingir a total independência de capital externo.';
    }

    let immediateAction = 'Manter o monitoramento rigoroso dos indicadores de capital de giro e preservar as reservas de liquidez.';
    if (constraint.primaryConstraint === 'ESTOQUES') {
      immediateAction = 'Aprovar otimização imediata do ciclo de estoques e reduzir o prazo médio de estocagem (PME) para liberar caixa.';
    } else if (constraint.primaryConstraint === 'RECEBIVEIS') {
      immediateAction = 'Rever política de concessão de crédito a clientes e acelerar a cobrança de faturas vencidas para recompor liquidez.';
    } else if (constraint.primaryConstraint === 'CONSUMO_OPERACIONAL') {
      immediateAction = 'Implementar plano emergencial de corte de despesas fixas (Overhead) para reduzir a queima operacional de caixa.';
    } else if (constraint.primaryConstraint === 'CAPEX') {
      immediateAction = 'Controlar rigorosamente novos investimentos (CAPEX) e suspender temporariamente gastos não essenciais.';
    } else if (constraint.primaryConstraint === 'PARTES_RELACIONADAS') {
      immediateAction = 'Suspender repasses não operacionais e adiantamentos financeiros a sócios ou partes relacionadas.';
    }

    const isOperationSelfSustaining = isBurning 
      ? 'Não. A continuidade operacional observada no exercício dependeu de capitalização societária para compensar a geração operacional negativa de caixa.'
      : 'Sim. A operação gera recursos suficientes para se autossustentar, sem dependência imediata de novas capitalizações societárias.';

    return {
      cashGenerationAssessment,
      primaryConstraint,
      runwayAssessment,
      shareholderDependency,
      boardOutlook,
      immediateAction,
      confidenceLevel,
      isOperationSelfSustaining
    };
  }
}
