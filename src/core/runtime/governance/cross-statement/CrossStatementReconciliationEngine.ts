// src/core/runtime/governance/cross-statement/CrossStatementReconciliationEngine.ts

export type ReconciliationAxis = 'BP_DFC_CAIXA' | 'DRE_DLPA_RESULTADO' | 'DLPA_DFC_DIVIDENDOS' | 'BP_DLPA_PL';

export interface AxisReconciliationResult {
  axis: ReconciliationAxis;
  passed: boolean;
  expected: number;
  actual: number;
  diffAmount: number;
  toleranceApplied: number;
  fiduciaryWarning?: string;
  recommendedCorrection?: string;
}

export interface CrossStatementReconciliationReport {
  reconciliationStatus: 'PASSED' | 'PASSED_WITH_IMMATERIAL_DIFFERENCE' | 'FAILED';
  failedAxes: ReconciliationAxis[];
  severity: 'NONE' | 'IMMATERIAL' | 'CRÍTICA';
  blockingFlags: string[];
  affectedStatements: string[];
  axesResults: AxisReconciliationResult[];
  auditTrail: string[];
}

export interface ReconciliationEngineParams {
  // BP
  bpCaixaInicial: number;
  bpCaixaFinal: number;
  bpPlFinal: number;
  bpCapitalSocial: number;
  bpReservas: number;
  bpAjustesPatrimoniais: number;
  
  // DRE
  dreLucroLiquido: number;
  
  // DLPA
  dlpaResultadoExercicio: number;
  dlpaDistribuicaoDividendos: number;
  dlpaSaldoFinalLucrosPrejuizos: number;
  
  // DFC
  dfcVariacaoLiquidaCaixa: number;
  dfcPagamentoDividendos: number;
}

export class CrossStatementReconciliationEngine {
  private static BASE_TOLERANCE = 10.0;
  private static RELATIVE_TOLERANCE_PCT = 0.0001; // 0.01%

  private static checkReconciliation(
    axis: ReconciliationAxis,
    expected: number,
    actual: number,
    statements: string[],
    warningMsg: string,
    correctionMsg: string
  ): { result: AxisReconciliationResult; statements: string[] } {
    const diffAmount = Math.abs(expected - actual);
    const maxVal = Math.max(Math.abs(expected), Math.abs(actual));
    const toleranceApplied = Math.max(this.BASE_TOLERANCE, maxVal * this.RELATIVE_TOLERANCE_PCT);

    const passed = diffAmount <= toleranceApplied;

    return {
      result: {
        axis,
        passed,
        expected,
        actual,
        diffAmount,
        toleranceApplied,
        fiduciaryWarning: passed ? undefined : warningMsg,
        recommendedCorrection: passed ? undefined : correctionMsg,
      },
      statements: passed ? [] : statements
    };
  }

  public static evaluate(params: ReconciliationEngineParams): CrossStatementReconciliationReport {
    const axesResults: AxisReconciliationResult[] = [];
    let failedAxes: ReconciliationAxis[] = [];
    let blockingFlags: string[] = [];
    const affectedStatementsSet = new Set<string>();
    const auditTrail: string[] = [];
    let hasImmaterialDiff = false;

    // Eixo A: BP <-> DFC (Caixa)
    // Regra: BP.CaixaFinal - BP.CaixaInicial = DFC.VariacaoLiquidaCaixa
    const expectedVariacaoCaixa = params.bpCaixaFinal - params.bpCaixaInicial;
    const eixoCaixa = this.checkReconciliation(
      'BP_DFC_CAIXA',
      expectedVariacaoCaixa,
      params.dfcVariacaoLiquidaCaixa,
      ['BP', 'DFC'],
      `Ruptura de conciliação de caixa: a variação de disponibilidades no BP (${expectedVariacaoCaixa}) não reflete a Geração Líquida no DFC (${params.dfcVariacaoLiquidaCaixa}).`,
      'Revisar as atividades operacionais, de investimento e de financiamento no DFC para igualar à variação do BP.'
    );
    axesResults.push(eixoCaixa.result);
    if (!eixoCaixa.result.passed) {
      failedAxes.push('BP_DFC_CAIXA');
      eixoCaixa.statements.forEach(s => affectedStatementsSet.add(s));
      blockingFlags.push('CAIXA_DESBALANCEADO');
      auditTrail.push(eixoCaixa.result.fiduciaryWarning!);
    } else if (eixoCaixa.result.diffAmount > 0) {
      hasImmaterialDiff = true;
      auditTrail.push(`Eixo Caixa aprovado com diferença imaterial de ${eixoCaixa.result.diffAmount}.`);
    }

    // Eixo B: DRE <-> DLPA (Resultado)
    // Regra: DRE.LucroLiquido = DLPA.ResultadoExercicio
    const eixoResultado = this.checkReconciliation(
      'DRE_DLPA_RESULTADO',
      params.dreLucroLiquido,
      params.dlpaResultadoExercicio,
      ['DRE', 'DLPA'],
      `Divergência de resultado: o lucro líquido reportado na DRE (${params.dreLucroLiquido}) diverge da apropriação feita no DLPA (${params.dlpaResultadoExercicio}).`,
      'Ajustar o Resultado do Exercício no DLPA para ser exatamente igual ao Lucro Líquido final da DRE.'
    );
    axesResults.push(eixoResultado.result);
    if (!eixoResultado.result.passed) {
      failedAxes.push('DRE_DLPA_RESULTADO');
      eixoResultado.statements.forEach(s => affectedStatementsSet.add(s));
      blockingFlags.push('RESULTADO_DESBALANCEADO');
      auditTrail.push(eixoResultado.result.fiduciaryWarning!);
    } else if (eixoResultado.result.diffAmount > 0) {
      hasImmaterialDiff = true;
      auditTrail.push(`Eixo Resultado aprovado com diferença imaterial de ${eixoResultado.result.diffAmount}.`);
    }

    // Eixo C: DLPA <-> DFC (Dividendos)
    // Regra: DLPA.DistribuicaoDividendos = DFC.PagamentoDividendos
    // Assumption: we treat both as absolute positive values representing the outflow
    const dlpaDiv = Math.abs(params.dlpaDistribuicaoDividendos);
    const dfcDiv = Math.abs(params.dfcPagamentoDividendos);
    const eixoDividendos = this.checkReconciliation(
      'DLPA_DFC_DIVIDENDOS',
      dlpaDiv,
      dfcDiv,
      ['DLPA', 'DFC'],
      `Fuga de capital não reconciliada: os lucros distribuídos no DLPA (${dlpaDiv}) divergem da saída efetiva de caixa no DFC (${dfcDiv}).`,
      'Lançar o pagamento de dividendos correspondente no Fluxo de Caixa de Financiamento.'
    );
    axesResults.push(eixoDividendos.result);
    if (!eixoDividendos.result.passed) {
      failedAxes.push('DLPA_DFC_DIVIDENDOS');
      eixoDividendos.statements.forEach(s => affectedStatementsSet.add(s));
      blockingFlags.push('DIVIDENDOS_DESBALANCEADOS');
      auditTrail.push(eixoDividendos.result.fiduciaryWarning!);
    } else if (eixoDividendos.result.diffAmount > 0) {
      hasImmaterialDiff = true;
      auditTrail.push(`Eixo Dividendos aprovado com diferença imaterial de ${eixoDividendos.result.diffAmount}.`);
    }

    // Eixo D: BP <-> DLPA (Patrimônio Líquido)
    // Regra: BP.PLFinal = BP.CapitalSocial + DLPA.SaldoFinalLucrosPrejuizos + Reservas + AjustesPatrimoniais
    const plCalculado = params.bpCapitalSocial + params.dlpaSaldoFinalLucrosPrejuizos + params.bpReservas + params.bpAjustesPatrimoniais;
    const eixoPL = this.checkReconciliation(
      'BP_DLPA_PL',
      params.bpPlFinal,
      plCalculado,
      ['BP', 'DLPA'],
      `Inconsistência de Patrimônio Líquido: PL reportado no Balanço (${params.bpPlFinal}) difere da composição contábil [Capital + Lucros/Prejuízos Acumulados + Reservas + Ajustes] (${plCalculado}).`,
      'Revisar a contabilização de reservas ou lucros acumulados para equalizar o Patrimônio Líquido.'
    );
    axesResults.push(eixoPL.result);
    if (!eixoPL.result.passed) {
      failedAxes.push('BP_DLPA_PL');
      eixoPL.statements.forEach(s => affectedStatementsSet.add(s));
      blockingFlags.push('PL_DESBALANCEADO');
      auditTrail.push(eixoPL.result.fiduciaryWarning!);
    } else if (eixoPL.result.diffAmount > 0) {
      hasImmaterialDiff = true;
      auditTrail.push(`Eixo Patrimonial aprovado com diferença imaterial de ${eixoPL.result.diffAmount}.`);
    }

    // Determina o status global
    let reconciliationStatus: 'PASSED' | 'PASSED_WITH_IMMATERIAL_DIFFERENCE' | 'FAILED' = 'PASSED';
    let severity: 'NONE' | 'IMMATERIAL' | 'CRÍTICA' = 'NONE';

    if (failedAxes.length > 0) {
      reconciliationStatus = 'FAILED';
      severity = 'CRÍTICA';
      blockingFlags.push('INCONSISTÊNCIA_CONTÁBIL_SEVERA');
      auditTrail.push(`Reconciliação FAILED. Eixos reprovados: ${failedAxes.join(', ')}`);
    } else if (hasImmaterialDiff) {
      reconciliationStatus = 'PASSED_WITH_IMMATERIAL_DIFFERENCE';
      severity = 'IMMATERIAL';
      auditTrail.push(`Reconciliação PASSED com diferenças imateriais aceitas na tolerância.`);
    } else {
      reconciliationStatus = 'PASSED';
      severity = 'NONE';
      auditTrail.push(`Reconciliação PASSED. Todos os eixos matematicamente exatos.`);
    }

    return {
      reconciliationStatus,
      failedAxes,
      severity,
      blockingFlags,
      affectedStatements: Array.from(affectedStatementsSet),
      axesResults,
      auditTrail
    };
  }
}
