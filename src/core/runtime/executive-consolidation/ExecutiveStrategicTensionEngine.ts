export type StrategicTensionSeverity = 'CRITICAL' | 'WARNING' | 'OPPORTUNITY';

export interface StrategicTension {
  id: string;
  title: string;
  description: string;
  severity: StrategicTensionSeverity;
  dimensionsInvolved: string[];
}

export class ExecutiveStrategicTensionEngine {
  /**
   * Avalia as métricas patrimoniais e identifica tensões estratégicas transversais.
   * Futuramente, pode consumir `patrimonialIntelligenceReport.tensions`.
   */
  public static evaluate(metrics: any): StrategicTension[] {
    const tensions: StrategicTension[] = [];

    // Tensão: Liquidez vs Ociosidade
    if (metrics.currentRatio && metrics.currentRatio > 5 && metrics.returnOnEquity && metrics.returnOnEquity < 10) {
      tensions.push({
        id: 'TENSION_LIQUIDITY_IDLE',
        title: 'Liquidez Excessiva vs. Capital Ocioso',
        description: 'A empresa mantém liquidez excessivamente alta enquanto o retorno sobre o capital próprio (ROE) permanece baixo. O capital está sobreprotegido e subutilizado.',
        severity: 'WARNING',
        dimensionsInvolved: ['Proteção Financeira', 'Geração de Valor']
      });
    }

    // Tensão: Baixo Endividamento vs Oportunidade
    if (metrics.debtToEquity && metrics.debtToEquity < 0.2 && metrics.returnOnCapitalEmployed && metrics.returnOnCapitalEmployed > 20) {
      tensions.push({
        id: 'TENSION_UNDERLEVERAGED',
        title: 'Baixo Endividamento vs. Alta Produtividade',
        description: 'Estrutura de capital extremamente conservadora combinada com alto retorno operacional. Há espaço seguro para alavancagem estratégica.',
        severity: 'OPPORTUNITY',
        dimensionsInvolved: ['Estrutura Patrimonial', 'Geração de Valor']
      });
    }

    // Tensão: Risco de Liquidez vs Ciclo Financeiro
    if (metrics.currentRatio && metrics.currentRatio < 1 && metrics.financialCycle && metrics.financialCycle > 60) {
      tensions.push({
        id: 'TENSION_LIQUIDITY_CYCLE',
        title: 'Vulnerabilidade de Liquidez vs. Ciclo Alongado',
        description: 'Liquidez corrente pressionada combinada com um ciclo financeiro longo. O descasamento de prazos está drenando o caixa operacional.',
        severity: 'CRITICAL',
        dimensionsInvolved: ['Proteção Financeira', 'Estrutura Patrimonial']
      });
    }

    return tensions;
  }
}
