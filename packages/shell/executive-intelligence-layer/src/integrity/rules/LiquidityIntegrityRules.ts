import { IntegrityBlocker } from '../FinancialIntegrityResult';

export class LiquidityIntegrityRules {
  /**
   * Rule Group 3 — Liquidez
   * Detecta se a liquidez estrutural aponta insuficiência para operações básicas,
   * forçando uma análise de risco e não apenas um comentário suave.
   */
  public static validate(financialData: any): IntegrityBlocker | null {
    if (financialData.currentAssets !== undefined && financialData.currentLiabilities !== undefined) {
      if (financialData.currentLiabilities > 0) {
        const liquidity = financialData.currentAssets / financialData.currentLiabilities;
        if (liquidity < 1.0) {
          return {
            severity: 'WARNING', // Liquidez < 1 não bloqueia tudo, mas alerta (pode ser modelo de negócio como Varejo)
            category: 'STRUCTURAL',
            rule: 'LIQUIDITY_INSUFFICIENCY',
            message: `A empresa apresenta insuficiência estrutural de ativos circulantes para cobertura das obrigações de curto prazo (Liquidez: ${liquidity.toFixed(2)}).`
          };
        }
      }
    }
    return null;
  }
}
