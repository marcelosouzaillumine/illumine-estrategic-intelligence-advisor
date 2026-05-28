import { ShareholderDistributionMetrics } from './capital-governance-types';

export class ShareholderDistributionEngine {
  public static calculate(
    dlpaDoc: any,
    netIncome: number,
    patrimonioLiquido: number,
    caixaEquivalentes: number
  ): ShareholderDistributionMetrics {
    if (!dlpaDoc) {
      return {
        distributedDividends: 0,
        payoutRatio: null,
        distributionDiscipline: 'FALTA_DADO',
        corporateDrainRatio: null,
        narrative: 'Dados de DLPA/DMPL não fornecidos para análise de distribuição.'
      };
    }

    const distributedDividends = Math.abs(Number(
      dlpaDoc.distributedDividends ??
      dlpaDoc.dividendos ??
      dlpaDoc.distribuicoes ??
      dlpaDoc.prolabore ??
      0
    ));

    let payoutRatio: number | null = null;
    let distributionDiscipline: 'DISCIPLINADA' | 'AGRESSIVA' | 'DRENAGEM' | 'SAUDÁVEL' | 'FALTA_DADO' = 'DISCIPLINADA';

    if (netIncome > 0) {
      payoutRatio = distributedDividends / netIncome;
      if (payoutRatio > 1.0) {
        distributionDiscipline = 'DRENAGEM';
      } else if (payoutRatio > 0.6) {
        distributionDiscipline = 'AGRESSIVA';
      } else if (payoutRatio >= 0.25 && payoutRatio <= 0.5) {
        distributionDiscipline = 'SAUDÁVEL';
      } else {
        distributionDiscipline = 'DISCIPLINADA';
      }
    } else {
      if (distributedDividends > 0) {
        distributionDiscipline = 'DRENAGEM'; // Distributing dividends with negative net income is direct equity drain!
      } else {
        distributionDiscipline = 'DISCIPLINADA';
      }
    }

    // Corporate drain ratio relative to Net Equity (PL) or Cash
    let corporateDrainRatio: number | null = null;
    if (patrimonioLiquido > 0) {
      corporateDrainRatio = distributedDividends / patrimonioLiquido;
    } else if (caixaEquivalentes > 0) {
      corporateDrainRatio = distributedDividends / caixaEquivalentes;
    }

    // Narrative
    let narrative = '';
    if (distributionDiscipline === 'DRENAGEM') {
      narrative = 'Drenagem societária crítica detectada. A empresa está realizando distribuições financeiras acima da capacidade de geração econômica líquida do período (ou operando em prejuízo), drenando diretamente o patrimônio da instituição.';
    } else if (distributionDiscipline === 'AGRESSIVA') {
      narrative = `Política de distribuição agressiva (${(payoutRatio ? payoutRatio * 100 : 0).toFixed(1)}% do lucro líquido). A saída excessiva de dividendos limita a capacidade de reinvestimento da empresa.`;
    } else if (distributionDiscipline === 'SAUDÁVEL') {
      narrative = `Distribuição de dividendos saudável e equilibrada (${(payoutRatio ? payoutRatio * 100 : 0).toFixed(1)}% do lucro líquido), remunerando adequadamente os sócios sem asfixiar o capital de giro.`;
    } else if (distributedDividends > 0) {
      narrative = `Distribuição altamente disciplinada e conservadora (${(payoutRatio ? payoutRatio * 100 : 0).toFixed(1)}% do lucro líquido), priorizando a retenção interna dos lucros na operação.`;
    } else {
      narrative = 'Ausência de distribuição de lucros no período. Os acionistas optaram por reinvestimento integral ou a operação não possui lucros acumulados passíveis de distribuição.';
    }

    if (corporateDrainRatio !== null && corporateDrainRatio > 0.1) {
      narrative += ` A retirada societária consome expressivos ${(corporateDrainRatio * 100).toFixed(1)}% do Patrimônio Líquido total, gerando pressão de descapitalização estrutural.`;
    }

    return {
      distributedDividends,
      payoutRatio,
      distributionDiscipline,
      corporateDrainRatio,
      narrative
    };
  }
}
