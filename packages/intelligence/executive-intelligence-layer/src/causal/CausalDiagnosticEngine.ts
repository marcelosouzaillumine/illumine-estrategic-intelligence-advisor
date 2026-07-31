import { FinancialEvidenceContract } from '../contracts/FinancialEvidenceContract';

export class CausalDiagnosticEngine {
  /**
   * Constrói o diagnóstico causal separando rigorosamente fatos, interpretações e hipóteses.
   * Evita "alucinações causais" limitando a IA a afirmar apenas o que os dados matemáticos comprovam.
   * @param financialData Payload validado pelo IntegrityEngine
   * @param businessState Estado gerado pelo ContextEngine
   */
  public static diagnose(financialData: any, businessState: string): FinancialEvidenceContract[] {
    const evidences: FinancialEvidenceContract[] = [];

    const equity = financialData.equity ?? 0;
    const currentAssets = financialData.currentAssets ?? 0;
    const currentLiabilities = financialData.currentLiabilities ?? 0;
    const wc = currentAssets - currentLiabilities;
    const liquidity = currentLiabilities > 0 ? currentAssets / currentLiabilities : 1;

    // Layer A - FATOS (100% Confidence)
    evidences.push({
      level: 'FACT',
      confidence: 100,
      description: `Patrimônio Líquido atualizado em R$ ${(equity / 1000000).toFixed(2)} milhões.`,
      sourceTraceId: 'CORE_FINANCIAL_DATA'
    });

    if (wc < 0) {
      evidences.push({
        level: 'FACT',
        confidence: 100,
        description: `Capital de Giro negativo em R$ ${(Math.abs(wc) / 1000000).toFixed(2)} milhões.`,
        sourceTraceId: 'CORE_FINANCIAL_DATA'
      });
    }

    if (liquidity < 1) {
      evidences.push({
        level: 'FACT',
        confidence: 100,
        description: `Liquidez Corrente em ${liquidity.toFixed(2)}x.`,
        sourceTraceId: 'CORE_FINANCIAL_DATA'
      });
    }

    // Layer B - INTERPRETAÇÃO (85% Confidence)
    if (businessState === 'RISCO DE CONTINUIDADE') {
      evidences.push({
        level: 'INTERPRETATION',
        confidence: 85,
        description: 'A empresa opera com capital próprio insuficiente para absorver oscilações operacionais, aumentando severamente a dependência de fornecedores, instituições financeiras e renegociações de passivos.',
        sourceTraceId: 'CAUSAL_DIAGNOSTIC_ENGINE'
      });
    } else if (businessState === 'RECUPERAÇÃO PATRIMONIAL') {
      evidences.push({
        level: 'INTERPRETATION',
        confidence: 85,
        description: 'A base patrimonial existe, mas a estrutura de capital de curto prazo está comprometida, expondo a operação a riscos de liquidez iminente.',
        sourceTraceId: 'CAUSAL_DIAGNOSTIC_ENGINE'
      });
    }

    // Layer C - HIPÓTESES (45% Confidence - Requer Validação Externa)
    if (businessState === 'RISCO DE CONTINUIDADE' || businessState === 'RECUPERAÇÃO PATRIMONIAL') {
      evidences.push({
        level: 'HYPOTHESIS',
        confidence: 45,
        description: 'A deterioração do capital de giro pode decorrer de: redução de margem operacional, crescimento de despesas financeiras não cobertas pelo EBITDA, descasamento entre recebimento/pagamento ou distribuição excessiva de resultados.',
        sourceTraceId: 'CAUSAL_DIAGNOSTIC_ENGINE'
      });
      evidences.push({
        level: 'HYPOTHESIS',
        confidence: 45,
        description: 'Necessário cruzar com DRE e Fluxo de Caixa para isolar o ofensor primário da degradação de liquidez.',
        sourceTraceId: 'CAUSAL_DIAGNOSTIC_ENGINE'
      });
    }

    return evidences;
  }
}
