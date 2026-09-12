export interface DiscoveredPattern {
  readonly patternId: string;
  readonly title: string;
  readonly causeEffectDescription: string;
  readonly observedCorrelation: number;
  readonly sampleCount: number;
}

export class OrganizationalPatternMiner {
  public static mineAggregatedPatterns(): readonly DiscoveredPattern[] {
    return [
      {
        patternId: 'pat-mined-01',
        title: 'Otimização de PMR e Expansão de Caixa',
        causeEffectDescription: 'Empresas que reduzem o Prazo Médio de Recebimento (PMR) tendem a melhorar o caixa livre em 90 dias.',
        observedCorrelation: 0.89,
        sampleCount: 1250
      },
      {
        patternId: 'pat-mined-02',
        title: 'Alerta Antecipado de Liquidez',
        causeEffectDescription: 'Queda na Margem EBITDA combinada com aumento de estoques antecede crise financeira em 84% dos casos.',
        observedCorrelation: 0.94,
        sampleCount: 890
      },
      {
        patternId: 'pat-mined-03',
        title: 'Crescimento Comercial sem Caixa',
        causeEffectDescription: 'Expansão de vendas sem suporte de capital de giro eleva o risco operacional em 2.5x.',
        observedCorrelation: 0.86,
        sampleCount: 1100
      }
    ];
  }
}
