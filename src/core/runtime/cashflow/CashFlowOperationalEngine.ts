import { CashFlowOperationalMetrics } from './cashflow-types';

export class CashFlowOperationalEngine {
  public static calculate(
    cashFlowDoc: any,
    ebitda: number
  ): CashFlowOperationalMetrics {
    if (!cashFlowDoc) {
      return {
        operatingCashFlow: 0,
        ebitda: ebitda,
        ebitdaToCashConversion: null,
        ebitdaConversionQuality: 'FALTA_DADO',
        selfSufficiencyIndex: null,
        isSelfSustained: false,
        narrative: 'Dados de DFC não fornecidos para análise operacional.'
      };
    }

    const operatingCashFlow = Number(
      cashFlowDoc.operatingCashFlow ??
      cashFlowDoc.caixaOperacional ??
      cashFlowDoc.fco ??
      0
    );

    const fixedCashOutflows = Number(
      cashFlowDoc.recurringFixedCashOutflows ??
      cashFlowDoc.saidasFixas ??
      0
    );

    // EBITDA to Cash Conversion
    let ebitdaToCashConversion: number | null = null;
    let ebitdaConversionQuality: 'EXCELENTE' | 'SAUDÁVEL' | 'LIMITADA' | 'CRÍTICA' | 'FALTA_DADO' = 'SAUDÁVEL';

    if (ebitda !== 0) {
      ebitdaToCashConversion = operatingCashFlow / ebitda;
      if (ebitda > 0) {
        if (ebitdaToCashConversion >= 0.8) {
          ebitdaConversionQuality = 'EXCELENTE';
        } else if (ebitdaToCashConversion >= 0.5) {
          ebitdaConversionQuality = 'SAUDÁVEL';
        } else if (ebitdaToCashConversion >= 0.1) {
          ebitdaConversionQuality = 'LIMITADA';
        } else {
          ebitdaConversionQuality = 'CRÍTICA';
        }
      } else {
        // EBITDA negative
        if (operatingCashFlow > 0) {
          ebitdaConversionQuality = 'EXCELENTE'; // EBITDA negative but operations generated positive cash (working capital release, etc.)
        } else {
          ebitdaConversionQuality = 'CRÍTICA'; // Both EBITDA and cash flow negative
        }
      }
    } else {
      if (operatingCashFlow > 0) {
        ebitdaConversionQuality = 'EXCELENTE';
      } else if (operatingCashFlow < 0) {
        ebitdaConversionQuality = 'CRÍTICA';
      } else {
        ebitdaConversionQuality = 'LIMITADA';
      }
    }

    // Self sufficiency
    let selfSufficiencyIndex: number | null = null;
    let isSelfSustained = false;

    if (fixedCashOutflows > 0) {
      selfSufficiencyIndex = operatingCashFlow / fixedCashOutflows;
      isSelfSustained = operatingCashFlow >= fixedCashOutflows;
    } else {
      isSelfSustained = operatingCashFlow > 0;
    }

    // Narratives
    let narrative = '';
    if (operatingCashFlow > 0) {
      if (ebitdaConversionQuality === 'EXCELENTE' || ebitdaConversionQuality === 'SAUDÁVEL') {
        narrative = 'A operação demonstra forte capacidade de geração de caixa operacional, convertendo eficientemente o resultado econômico (EBITDA) em liquidez disponível.';
      } else {
        narrative = 'Embora a operação tenha gerado caixa positivo, a taxa de conversão do EBITDA é limitada, sugerindo retenção relevante de recursos no capital de giro ou descasamento temporário.';
      }
    } else {
      if (ebitda > 0) {
        narrative = 'O negócio apresenta EBITDA positivo, porém com destruição operacional de caixa. Há um claro desequilíbrio estrutural no capital de giro consumindo toda a geração econômica.';
      } else {
        narrative = 'A operação é deficitária tanto sob a ótica econômica (EBITDA negativo) quanto financeira (consumo de caixa operacional), demonstrando incapacidade de autofinanciamento.';
      }
    }

    if (isSelfSustained) {
      narrative += ' As entradas operacionais são suficientes para cobrir integralmente a estrutura fixa recorrente.';
    } else if (operatingCashFlow > 0) {
      narrative += ' No entanto, as entradas operacionais cobrem apenas parcialmente as obrigações fixas da estrutura.';
    } else {
      narrative += ' A operação exige aportes ou financiamento externo contínuo para manter as atividades básicas.';
    }

    return {
      operatingCashFlow,
      ebitda,
      ebitdaToCashConversion,
      ebitdaConversionQuality,
      selfSufficiencyIndex,
      isSelfSustained,
      narrative
    };
  }
}
