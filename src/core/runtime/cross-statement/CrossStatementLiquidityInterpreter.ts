export class CrossStatementLiquidityInterpreter {
  /**
   * Interpreta a liquidez cruzando a posição de Balanço Patrimonial (BP) com a geração de Caixa Operacional (DFC).
   * 
   * @param isLiquidityPressured Verdadeiro se Liquidez Seca/Corrente do BP estiver baixa.
   * @param hasValidatedCashFlowEvidence Verdadeiro se DFC estiver presente, validada e consistente.
   * @param isOperationalCashFlowPositive Verdadeiro se FCO > 0.
   */
  public static interpret(
    isLiquidityPressured: boolean,
    hasValidatedCashFlowEvidence: boolean,
    isOperationalCashFlowPositive: boolean
  ): string {
    if (!hasValidatedCashFlowEvidence) {
      if (isLiquidityPressured) {
        return 'A qualidade da liquidez não pôde ser validada devido à ausência de evidência confiável de fluxo de caixa.';
      }
      return 'Posição patrimonial estável, porém a ausência de DFC impede a validação da geração estrutural de caixa.';
    }

    if (isLiquidityPressured) {
      if (isOperationalCashFlowPositive) {
        return 'A liquidez estrutural encontra-se pressionada, porém a operação mantém capacidade de geração de caixa.';
      } else {
        return 'A liquidez estrutural encontra-se pressionada e a operação não demonstra geração sustentável de caixa.';
      }
    } else {
      if (isOperationalCashFlowPositive) {
        return 'A organização apresenta posição de liquidez confortável, sustentada por forte geração operacional de caixa.';
      } else {
        return 'A organização possui liquidez confortável no momento, mas a queima de caixa operacional (FCO negativo) pode deteriorar essa posição estrutural a médio ciclo.';
      }
    }
  }
}
