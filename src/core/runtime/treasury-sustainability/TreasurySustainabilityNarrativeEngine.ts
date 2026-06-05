export class TreasurySustainabilityNarrativeEngine {
  /**
   * Generates a consequence-oriented treasury sustainability narrative based on score/metrics.
   */
  public static evaluate(efsiScore: number, fco: number, runwayMonths: number): string {
    if (fco < 0 || runwayMonths < 3 || efsiScore < 50) {
      return 'A tesouraria apresenta baixa sustentabilidade. A continuidade da operação depende da reversão da queima operacional de caixa e da redução da dependência de aportes externos.';
    } else if (efsiScore < 80 || runwayMonths < 6) {
      return 'A tesouraria permanece funcional, porém ainda vulnerável a oscilações de liquidez.';
    } else {
      return 'A geração operacional demonstra capacidade consistente de sustentar a liquidez institucional.';
    }
  }
}
