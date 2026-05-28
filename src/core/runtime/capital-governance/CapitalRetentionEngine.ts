import { CapitalRetentionMetrics } from './capital-governance-types';

export class CapitalRetentionEngine {
  public static calculate(
    dlpaDoc: any,
    netIncome: number
  ): CapitalRetentionMetrics {
    if (!dlpaDoc) {
      return {
        retainedEarnings: 0,
        netIncome: netIncome,
        retentionRate: null,
        retentionEfficiency: 'FALTA_DADO',
        reserveReinforcement: 0,
        narrative: 'Dados de DLPA/DMPL não fornecidos para análise de retenção.'
      };
    }

    const retainedEarnings = Number(
      dlpaDoc.retainedEarnings ??
      dlpaDoc.lucrosRetidos ??
      dlpaDoc.retencao ??
      0
    );

    const reserveReinforcement = Number(
      dlpaDoc.reserveReinforcement ??
      dlpaDoc.reservaLegal ??
      dlpaDoc.reservaLucros ??
      0
    );

    let retentionRate: number | null = null;
    let retentionEfficiency: 'ALTA' | 'MODERADA' | 'INSUFICIENTE' | 'CRÍTICA' | 'FALTA_DADO' = 'MODERADA';

    if (netIncome > 0) {
      retentionRate = retainedEarnings / netIncome;
      if (retentionRate >= 0.5) {
        retentionEfficiency = 'ALTA';
      } else if (retentionRate >= 0.2) {
        retentionEfficiency = 'MODERADA';
      } else if (retentionRate > 0) {
        retentionEfficiency = 'INSUFICIENTE';
      } else {
        retentionEfficiency = 'CRÍTICA';
      }
    } else {
      retentionEfficiency = 'CRÍTICA'; // No net income to retain, capital erosion risk
    }

    let narrative = '';
    if (retentionEfficiency === 'ALTA') {
      narrative = `Excelente postura de fortalecimento patrimonial. A empresa retém ${(retentionRate ? retentionRate * 100 : 0).toFixed(1)}% do lucro líquido gerado no período, capitalizando as reservas para expansão futura ou proteção contra choques de liquidez.`;
    } else if (retentionEfficiency === 'MODERADA') {
      narrative = `Retenção de lucro moderada de ${(retentionRate ? retentionRate * 100 : 0).toFixed(1)}%. O equilíbrio entre distribuição aos acionistas e recomposição das reservas indica alocação sensível de capital.`;
    } else if (retentionEfficiency === 'INSUFICIENTE') {
      narrative = `Retenção de capital insuficiente de ${(retentionRate ? retentionRate * 100 : 0).toFixed(1)}%. A maior parte dos resultados gerados é distribuída ou consumida por despesas societárias, deixando reservas baixas.`;
    } else {
      narrative = 'Ausência de retenção de capital. Todo o lucro do período foi distribuído ou a empresa operou em prejuízo líquido, impossibilitando o fortalecimento das reservas patrimoniais.';
    }

    if (reserveReinforcement > 0) {
      narrative += ` Foi realizado um reforço nominal de R$ ${reserveReinforcement.toLocaleString('pt-BR')} nas reservas estatutárias e legais.`;
    }

    return {
      retainedEarnings,
      netIncome,
      retentionRate,
      retentionEfficiency,
      reserveReinforcement,
      narrative
    };
  }
}
