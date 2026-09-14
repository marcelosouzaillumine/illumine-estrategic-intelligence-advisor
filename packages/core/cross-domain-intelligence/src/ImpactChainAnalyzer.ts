import { Identifier } from '@illumine/core-primitives';
import { CorporateDimensionType } from '@illumine/semantic-model';

export interface ImpactStep {
  readonly stepIndex: number;
  readonly domain: CorporateDimensionType;
  readonly metricCode: string;
  readonly expectedChangeDescription: string;
}

export interface CrossDomainImpactChain {
  readonly chainId: Identifier;
  readonly rootDomain: CorporateDimensionType;
  readonly steps: ImpactStep[];
}

export class ImpactChainAnalyzer {
  public static buildCrossDomainChain(rootMetric: string): CrossDomainImpactChain {
    if (rootMetric === 'TURNOVER') {
      return {
        chainId: 'chain-turnover-ebitda',
        rootDomain: 'PEOPLE',
        steps: [
          { stepIndex: 1, domain: 'PEOPLE', metricCode: 'TURNOVER', expectedChangeDescription: 'Turnover elevado em P&D' },
          { stepIndex: 2, domain: 'OPERATIONS', metricCode: 'PROD_EFFICIENCY', expectedChangeDescription: 'Redução de produtividade no ciclo de entrega' },
          { stepIndex: 3, domain: 'FINANCE', metricCode: 'OPEX_COST', expectedChangeDescription: 'Aumento de custos com contratação e horas extras' },
          { stepIndex: 4, domain: 'FINANCE', metricCode: 'EBITDA', expectedChangeDescription: 'Redução na margem EBITDA' }
        ]
      };
    }

    return {
      chainId: `chain-${rootMetric}`,
      rootDomain: 'FINANCE',
      steps: []
    };
  }
}
