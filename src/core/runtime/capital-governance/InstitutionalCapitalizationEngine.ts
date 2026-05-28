import { InstitutionalCapitalizationMetrics } from './capital-governance-types';

export class InstitutionalCapitalizationEngine {
  public static calculate(
    dlpaDoc: any,
    bpSummary: any
  ): InstitutionalCapitalizationMetrics {
    if (!dlpaDoc && !bpSummary) {
      return {
        capitalSocial: 0,
        lucrosRetidosAcumulados: 0,
        capitalizationIndex: null,
        maturityRating: 'FALTA_DADO',
        narrative: 'Dados não fornecidos para análise de capitalização institucional.'
      };
    }

    const capitalSocial = Number(
      dlpaDoc?.capitalSocial ??
      bpSummary?.capitalSocial ??
      0
    );

    const lucrosRetidosAcumulados = Number(
      dlpaDoc?.lucrosRetidosAcumulados ??
      dlpaDoc?.lucrosAcumulados ??
      bpSummary?.lucrosAcumulados ??
      bpSummary?.reservaLucros ??
      0
    );

    const reserves = Number(dlpaDoc?.reservaLegal ?? 0) + Number(dlpaDoc?.reservaLucros ?? 0);
    const totalEquity = Number(bpSummary?.patrimonioLiquido ?? (capitalSocial + lucrosRetidosAcumulados + reserves));
    const totalAssets = Number(bpSummary?.ativoTotal ?? 1);

    const capitalizationIndex = totalAssets > 0 ? (totalEquity / totalAssets) : null;

    let maturityRating: 'MADURA' | 'EM_DESENVOLVIMENTO' | 'FRÁGIL' | 'FALTA_DADO' = 'EM_DESENVOLVIMENTO';

    if (capitalizationIndex !== null) {
      if (capitalizationIndex >= 0.50 && lucrosRetidosAcumulados > 0) {
        maturityRating = 'MADURA';
      } else if (capitalizationIndex >= 0.25) {
        maturityRating = 'EM_DESENVOLVIMENTO';
      } else {
        maturityRating = 'FRÁGIL';
      }
    }

    // Narrative
    let narrative = '';
    if (maturityRating === 'MADURA') {
      narrative = `Excelente solidez de capitalização institucional (Índice de Autonomia Patrimonial de ${(capitalizationIndex ? capitalizationIndex * 100 : 0).toFixed(1)}%). O patrimônio líquido representa a maior parte dos ativos financiados, atestando baixo risco de insolvência.`;
    } else if (maturityRating === 'EM_DESENVOLVIMENTO') {
      narrative = `Nível de capitalização moderado (Patrimônio Líquido cobre ${(capitalizationIndex ? capitalizationIndex * 100 : 0).toFixed(1)}% do Ativo). A estrutura está em fase de maturação patrimonial intermediária.`;
    } else {
      narrative = `Alerta de descapitalização estrutural (Patrimônio Líquido representa apenas ${(capitalizationIndex ? capitalizationIndex * 100 : 0).toFixed(1)}% dos ativos). A dependência de capital de terceiros é excessiva, fragilizando a governança fiduciária do negócio.`;
    }

    if (lucrosRetidosAcumulados > 0) {
      narrative += ` A empresa detém R$ ${lucrosRetidosAcumulados.toLocaleString('pt-BR')} em lucros retidos de exercícios anteriores, servindo como almofada de segurança.`;
    }

    return {
      capitalSocial,
      lucrosRetidosAcumulados,
      capitalizationIndex,
      maturityRating,
      narrative
    };
  }
}
