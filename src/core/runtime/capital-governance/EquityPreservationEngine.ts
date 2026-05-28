import { EquityPreservationMetrics } from './capital-governance-types';

export class EquityPreservationEngine {
  public static calculate(
    dlpaDoc: any,
    netIncome: number,
    patrimonioLiquido: number
  ): EquityPreservationMetrics {
    if (!dlpaDoc) {
      return {
        equityChange: 0,
        replenishmentIndex: null,
        equityErosionDetected: false,
        preservationStatus: 'FALTA_DADO',
        narrative: 'Dados de DLPA/DMPL não fornecidos para análise de preservação.'
      };
    }

    const distributedDividends = Math.abs(Number(
      dlpaDoc.distributedDividends ??
      dlpaDoc.dividendos ??
      dlpaDoc.distribuicoes ??
      0
    ));

    const capitalInjections = Number(
      dlpaDoc.partnerCapitalInjections ??
      dlpaDoc.capitalInflows ??
      0
    );

    // Net change in equity from capital governance activities
    const equityChange = Number(
      dlpaDoc.equityChange ??
      (netIncome - distributedDividends + capitalInjections)
    );

    const equityErosionDetected = equityChange < 0 || (patrimonioLiquido < 0);

    let replenishmentIndex: number | null = null;
    if (netIncome > 0 && equityChange > 0) {
      replenishmentIndex = equityChange / netIncome;
    }

    let preservationStatus: 'PRESERVADO' | 'ESTÁVEL' | 'EROSÃO_PARCIAL' | 'EROSÃO_SEVERA' | 'FALTA_DADO' = 'ESTÁVEL';
    if (equityChange > 0) {
      preservationStatus = 'PRESERVADO';
    } else if (Math.abs(equityChange) <= (patrimonioLiquido * 0.02)) {
      preservationStatus = 'ESTÁVEL';
    } else if (patrimonioLiquido > 0 && Math.abs(equityChange) < (patrimonioLiquido * 0.15)) {
      preservationStatus = 'EROSÃO_PARCIAL';
    } else {
      preservationStatus = 'EROSÃO_SEVERA';
    }

    // Narrative
    let narrative = '';
    if (preservationStatus === 'PRESERVADO') {
      narrative = `O patrimônio líquido da instituição foi preservado e fortalecido, apresentando expansão líquida de R$ ${equityChange.toLocaleString('pt-BR')} impulsionada pela retenção de lucros ou novos aportes.`;
    } else if (preservationStatus === 'ESTÁVEL') {
      narrative = 'O patrimônio líquido permaneceu estável no período, com as saídas societárias correspondendo adequadamente aos resultados gerados.';
    } else if (preservationStatus === 'EROSÃO_PARCIAL') {
      narrative = `Alerta de descapitalização. O patrimônio líquido encolheu R$ ${Math.abs(equityChange).toLocaleString('pt-BR')} no período, indicando que a operação está consumindo reservas históricas acumuladas.`;
    } else {
      narrative = `Erosão severa do patrimônio líquido registrada (redução de R$ ${Math.abs(equityChange).toLocaleString('pt-BR')}). Prejuízos operacionais sucessivos ou excesso de retiradas societárias comprometem seriamente a solvência do negócio.`;
    }

    if (replenishmentIndex !== null && replenishmentIndex > 0) {
      narrative += ` A taxa de recomposição patrimonial é de ${(replenishmentIndex * 100).toFixed(1)}% em relação ao lucro líquido, sinalizando acumulação de capital saudável.`;
    }

    return {
      equityChange,
      replenishmentIndex,
      equityErosionDetected,
      preservationStatus,
      narrative
    };
  }
}
