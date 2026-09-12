import { 
  UniversalCashIndicators, 
  FinancingReclassification, 
  FinancialRuntimeContext 
} from './CashIntelligenceTypes';

export class UniversalCashIndicatorsEngine {
  /**
   * Calcula os 7 indicadores universais fiduciários obrigatórios.
   */
  public static evaluate(
    fco: number,
    fcf: number,
    ebitda: number,
    capitalizacaoExterna: number,
    fornecedores: number,
    passivoCirculante: number,
    variacaoEstoque: number,
    contasRelacionadas: number | null,
    patrimonioLiquido: number,
    monthsCount: number,
    availableCash: number,
    context?: FinancialRuntimeContext
  ): UniversalCashIndicators {
    
    // 1. Burn Rate Operacional
    let burnRateMensal = 0;
    let burnClassification: 'LOW_BURN' | 'MODERATE_BURN' | 'HIGH_BURN' | 'CRITICAL_BURN' | 'NOT_APPLICABLE' = 'NOT_APPLICABLE';
    
    if (fco < 0) {
      burnRateMensal = Math.abs(fco) / monthsCount;
      if (burnRateMensal < 10000) burnClassification = 'LOW_BURN';
      else if (burnRateMensal < 50000) burnClassification = 'MODERATE_BURN';
      else if (burnRateMensal < 200000) burnClassification = 'HIGH_BURN';
      else burnClassification = 'CRITICAL_BURN';
    }
    
    // 2. Cash Runway Institucional
    let runwayMonths = 99;
    let runwayClassification: 'HEALTHY' | 'PRESSURED' | 'CRITICAL' | 'SURVIVAL_MODE' = 'HEALTHY';
    
    if (burnRateMensal > 0) {
      runwayMonths = availableCash / burnRateMensal;
      if (runwayMonths >= 6) runwayClassification = 'HEALTHY';
      else if (runwayMonths >= 3) runwayClassification = 'PRESSURED';
      else if (runwayMonths >= 1) runwayClassification = 'CRITICAL';
      else runwayClassification = 'SURVIVAL_MODE';
    }

    // 3. Dependência de Capitalização
    const dependenciaDeCapitalizacao = fco < 0 ? capitalizacaoExterna / Math.abs(fco) : 0;

    // 4. Dependência de Fornecedores
    const dependenciaFornecedores = passivoCirculante > 0 ? fornecedores / passivoCirculante : 0;
    const alertFornecedores = dependenciaFornecedores > 0.6 ? 'OPERATING_SUPPLIER_DEPENDENCY' : 'NORMAL';

    // 5. Aprisionamento de Capital em Estoque
    let aprisionamentoEstoque = 0;
    let alertEstoque: 'WORKING_CAPITAL_TRAP' | 'NORMAL' = 'NORMAL';
    if (fco < 0 && variacaoEstoque > 0) {
      aprisionamentoEstoque = Math.abs(variacaoEstoque) / Math.abs(fco);
      if (aprisionamentoEstoque > 0.3) {
        // Exceção contextual
        if (context?.industrySegment !== 'MANUFACTURING') {
          alertEstoque = 'WORKING_CAPITAL_TRAP';
        }
      }
    }

    // 6. Exposição com Partes Relacionadas
    let exposicaoRelacionadas: number | 'NOT_AVAILABLE' = 'NOT_AVAILABLE';
    let alertRelacionadas: 'RELATED_PARTY_EXPOSURE_ALERT' | 'NORMAL' | 'NOT_AVAILABLE' = 'NOT_AVAILABLE';
    
    if (contasRelacionadas !== null && patrimonioLiquido !== 0) {
      exposicaoRelacionadas = contasRelacionadas / Math.abs(patrimonioLiquido);
      alertRelacionadas = exposicaoRelacionadas > 0.1 ? 'RELATED_PARTY_EXPOSURE_ALERT' : 'NORMAL';
    }

    // 7. Conversão EBITDA -> Caixa
    const conversaoEbitdaCaixa = ebitda !== 0 ? fco / ebitda : 0;
    const alertEbitda: 'SYNTHETIC_PROFIT_ALERT' | 'NORMAL' = (ebitda > 0 && fco < 0) ? 'SYNTHETIC_PROFIT_ALERT' : 'NORMAL';

    // 8. Reclassificação Fiduciária do FCF
    let classificacaoFCF: FinancingReclassification = 'UNSPECIFIED_EXTERNAL_SUPPORT';
    if (fcf > 0) {
      if (fco < 0 && runwayMonths < 3) {
        classificacaoFCF = 'DISTRESS_FINANCING';
      } else if (fco < 0) {
        classificacaoFCF = 'SURVIVAL_CAPITALIZATION'; // Or LEVERAGED_SURVIVAL depending on debt vs equity, simplified here
      } else if (fco > 0) {
        classificacaoFCF = 'STRATEGIC_EXPANSION_CAPITAL';
      }
    }

    return {
      burnRateOperacional: {
        value: burnRateMensal,
        classification: burnClassification
      },
      cashRunwayInstitucional: {
        months: runwayMonths,
        classification: runwayClassification
      },
      dependenciaDeCapitalizacao: {
        value: dependenciaDeCapitalizacao
      },
      dependenciaFornecedores: {
        value: dependenciaFornecedores,
        alert: alertFornecedores
      },
      aprisionamentoCapitalEstoque: {
        value: aprisionamentoEstoque,
        alert: alertEstoque
      },
      exposicaoPartesRelacionadas: {
        value: exposicaoRelacionadas,
        alert: alertRelacionadas
      },
      conversaoEbitdaCaixa: {
        value: conversaoEbitdaCaixa,
        alert: alertEbitda
      },
      classificacaoFiduciariaFCF: classificacaoFCF
    };
  }
}
