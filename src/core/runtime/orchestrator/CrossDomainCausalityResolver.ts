import { InstitutionalContextProfile } from '../institutional-context/types';
import { ContinuityStatus } from '../institutional-memory/InstitutionalContinuityResolver';

export type DomainSignals = {
  dreRevenueGrowth: boolean;
  dreMarginExpansion: boolean;
  dfcCashBurn: boolean;
  dfcOperationalCashFlowNegative: boolean;
  bpWorkingCapitalPressure: boolean;
  bpHighLeverage: boolean;
};

export type InstitutionalCausality = {
  primaryEvent: string;
  rootCause: string;
  systemicPropagation: string;
  executiveInsight: string;
};

export class CrossDomainCausalityResolver {
  /**
   * Soberano na interpretação simultânea de tensões inter-domínios.
   */
  public static resolve(
    signals: DomainSignals,
    ctx: InstitutionalContextProfile,
    isFailClosedActive: boolean,
    continuityStatus: ContinuityStatus = 'INCONCLUSIVO'
  ): InstitutionalCausality {
    if (isFailClosedActive) {
      return {
        primaryEvent: 'Análise Estrutural Indisponível',
        rootCause: 'Dados insuficientes para estabelecimento de causalidade fiduciária.',
        systemicPropagation: 'Risco de interpretação enviesada contido pelo Fail-Closed.',
        executiveInsight: 'Aguardando inputs estruturais completos.'
      };
    }

    // TENSÃO: Crescimento (DRE) com Queima de Caixa Operacional (DFC/BP)
    if (signals.dreRevenueGrowth && (signals.dfcOperationalCashFlowNegative || signals.bpWorkingCapitalPressure)) {
      if (continuityStatus === 'DETERIORAÇÃO_PROGRESSIVA' || continuityStatus === 'RISCO_RECORRENTE') {
        return {
          primaryEvent: 'Crescimento destrutivo continuado com asfixia crônica de liquidez.',
          rootCause: 'O ciclo de conversão de caixa continua deteriorando frente à tração de vendas.',
          systemicPropagation: 'Risco iminente de colapso de capital de giro.',
          executiveInsight: 'A expansão não-financiada tornou-se estruturalmente insustentável. Intervenção imediata.'
        };
      }
      return {
        primaryEvent: 'Expansão operacional suportada por pressão crescente de liquidez.',
        rootCause: 'O ciclo de conversão de caixa não acompanha o ritmo de tração de vendas.',
        systemicPropagation: 'Drenagem de capital de giro e aumento da dependência de terceiros.',
        executiveInsight: 'Desacelerar expansão não-financiada ou priorizar alongamento de passivos operacionais.'
      };
    }

    // TENSÃO: Rentabilidade (DRE) com Alavancagem Alta (BP)
    if (signals.dreMarginExpansion && signals.bpHighLeverage) {
      return {
        primaryEvent: 'Geração de valor operacional consumida pela estrutura de capital.',
        rootCause: 'Custo de serviço da dívida neutraliza ganhos reais de margem EBITDA.',
        systemicPropagation: 'Vulnerabilidade a choques de juros ou quebra de covenants.',
        executiveInsight: 'Focar dividendos e fluxo livre exclusivamente em desalavancagem estrutural.'
      };
    }

    // TENSÃO: Estagnação DRE com Queima de Caixa DFC
    if (!signals.dreRevenueGrowth && !signals.dreMarginExpansion && signals.dfcCashBurn) {
      return {
        primaryEvent: 'Asfixia combinada: estagnação comercial e erosão de liquidez.',
        rootCause: 'Despesa fixa incompatível com o platô de tração do segmento.',
        systemicPropagation: 'Consumo acelerado de oxigênio (caixa) com baixo retorno residual.',
        executiveInsight: 'Implementar pacote de turnaround emergencial focando em preservação absoluta de caixa.'
      };
    }

    // PADRÃO SAUDÁVEL
    if (signals.dreRevenueGrowth && signals.dreMarginExpansion && !signals.dfcOperationalCashFlowNegative && !signals.bpHighLeverage) {
      const isSingleYear = ctx.legacy?.historicalDensity === 'LOW_HISTORICAL_DENSITY' || 
                           ctx.legacy?.historicalDensity === 'SINGLE_YEAR_ONLY';
      
      if (isSingleYear) {
        return {
          primaryEvent: 'Eficiência de curto prazo estabilizada, com geração de caixa.',
          rootCause: 'Sincronia momentânea entre ciclo de vendas e conversão de caixa.',
          systemicPropagation: 'Aumento estático da margem de segurança patrimonial.',
          executiveInsight: 'Consolidar este patamar antes de assumir novos compromissos estruturais.'
        };
      }

      return {
        primaryEvent: 'Expansão operacional sustentável e autocorrigida pelo fluxo de caixa.',
        rootCause: 'Ciclos de conversão eficientes e ganho escalar de margens reais.',
        systemicPropagation: 'Robustez de liquidez e independência de capital externo.',
        executiveInsight: 'Cenário favorável para investimentos de capex ou distribuição controlada de dividendos.'
      };
    }

    // Fallback conservador
    return {
      primaryEvent: 'Estrutura em transição ou sem vetor dominante unificado.',
      rootCause: 'Fatores multidirecionais diluindo a causalidade principal.',
      systemicPropagation: 'Risco moderado decorrente da falta de clareza em conversão direcional.',
      executiveInsight: 'Manter postura neutra e focar em visibilidade de curto prazo.'
    };
  }
}
