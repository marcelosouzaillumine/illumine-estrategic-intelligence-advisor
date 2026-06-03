import { DFCCashAdvisory, CashConfidenceLevel, CashBoardDecision, CashSustainability } from './CashIntelligenceTypes';

export class DFCCashAdvisoryEngine {
  public static evaluate(
    fco: number,
    boardDecision: CashBoardDecision,
    sustainability: CashSustainability,
    confidenceLevel: CashConfidenceLevel
  ): DFCCashAdvisory {
    const situacaoAtual = boardDecision.cashGenerationAssessment;
    const restricaoPrincipal = boardDecision.primaryConstraint;
    const dependenciaCapital = boardDecision.shareholderDependency;
    const sustentabilidadeStr = boardDecision.runwayAssessment;
    const outlook = boardDecision.boardOutlook;

    let parecerConsolidado = '';
    let interpretacaoExecutiva = '';

    if (fco < 0) {
      interpretacaoExecutiva = 'A liquidez observada depende majoritariamente de aportes dos sócios e não da geração operacional recorrente.';
      parecerConsolidado = 'A companhia encontra-se em fase de estruturação e ainda não alcançou autossuficiência financeira operacional. O caixa permaneceu positivo no exercício prioritariamente em função da capitalização realizada pelos sócios. A operação consumiu recursos líquidos durante o exercício e apresentou runway reduzido para o estágio atual. Recomendação: A prioridade fiduciária para os próximos ciclos deve concentrar-se na redução da queima operacional de caixa, aceleração da conversão de receitas em liquidez e construção de autonomia financeira progressiva.';
    } else {
      interpretacaoExecutiva = 'A liquidez observada é sustentada de forma autônoma pela geração operacional recorrente de recursos.';
      parecerConsolidado = 'A companhia demonstra capacidade de autossuficiência financeira operacional, gerando caixa positivo no período e reduzindo a dependência de fontes externas. A continuidade das operações e a preservação de liquidez estão asseguradas no curto prazo. Recomendação: A prioridade fiduciária deve concentrar-se na otimização do ciclo financeiro, preservação de excedentes de caixa para investimentos estratégicos e manutenção do controle rigoroso de capital de giro.';
    }

    return {
      situacaoAtual,
      restricaoPrincipal,
      dependenciaCapital,
      sustentabilidade: sustentabilidadeStr,
      outlook,
      parecerConsolidado,
      confidenceLevel,
      interpretacaoExecutiva
    };
  }
}
