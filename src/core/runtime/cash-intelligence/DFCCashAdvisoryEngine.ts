import { DFCCashAdvisory, CashConfidenceLevel, CashBoardDecision, CashSustainability } from './CashIntelligenceTypes';

export class DFCCashAdvisoryEngine {
  public static evaluate(
    fco: number,
    boardDecision: CashBoardDecision,
    sustainability: CashSustainability,
    confidenceLevel: CashConfidenceLevel
  ): DFCCashAdvisory {
    const situacaoAtual = fco <= 0 ? 'A operação consome caixa.' : boardDecision.cashGenerationAssessment;
    const restricaoPrincipal = fco <= 0 ? 'Estrutura operacional deficitária.' : boardDecision.primaryConstraint;
    const dependenciaCapital = fco <= 0 ? 'Dependência crítica dos sócios.' : boardDecision.shareholderDependency;
    const sustentabilidadeStr = fco <= 0 ? 'Runway reduzido.' : boardDecision.runwayAssessment;
    const outlook = fco <= 0 ? 'Se nada for feito, a liquidez disponível será insuficiente para sustentar a continuidade operacional.' : boardDecision.boardOutlook;
    const boardPriority = fco <= 0 ? 'Reduzir consumo operacional e restaurar autonomia financeira.' : 'Manter monitoramento rigoroso.';

    let parecerConsolidado = '';
    let interpretacaoExecutiva = '';

    if (fco <= 0) {
      interpretacaoExecutiva = 'A liquidez observada depende majoritariamente de aportes dos sócios e não da geração operacional recorrente.';
      parecerConsolidado = 'A companhia encontra-se em fase de estruturação e ainda não alcançou autossuficiência financeira operacional. O caixa permaneceu positivo no exercício prioritariamente em função da capitalização realizada pelos sócios. A operação consumiu recursos líquidos durante o exercício e apresentou runway reduzido para o estágio atual. Recomendação: A prioridade fiduciária para os próximos ciclos deve concentrar-se na redução da queima operacional de caixa, aceleração da conversão de receitas em liquidez e construção de autonomia financeira progressiva.';
    } else {
      interpretacaoExecutiva = 'A liquidez observada é sustentada de forma autônoma pela geração operacional recorrente de recursos.';
      parecerConsolidado = 'A companhia demonstra capacidade de autossuficiência financeira operacional, gerando caixa positivo no período e criando liquidez de forma consistente.';
    }

    return {
      situacaoAtual,
      restricaoPrincipal,
      dependenciaCapital,
      sustentabilidade: sustentabilidadeStr,
      outlook,
      parecerConsolidado,
      confidenceLevel,
      interpretacaoExecutiva,
      boardPriority
    };
  }
}
