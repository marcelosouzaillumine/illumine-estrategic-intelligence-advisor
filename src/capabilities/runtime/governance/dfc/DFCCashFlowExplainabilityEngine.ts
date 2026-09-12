import { ShareholderDependencyStatus } from './CashFlowGovernanceOutput';

export interface DFCCashFlowExplainabilityOutput {
  generators: string[];
  consumers: string[];
  externalDependencies: string[];
  recommendationDrivers: string[];
}

export class DFCCashFlowExplainabilityEngine {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  static evaluate(
    fco: number,
    fci: number,
    fcf: number,
    dependencyStatus: ShareholderDependencyStatus
  ): DFCCashFlowExplainabilityOutput {
    
    const generators: string[] = [];
    const consumers: string[] = [];
    const externalDependencies: string[] = [];
    const recommendationDrivers: string[] = [];

    if (fco > 0) generators.push('Operação (Geração de Caixa Livre)');
    else consumers.push('Operação (Queima de Capital de Giro / Prejuízo)');

    if (fci > 0) generators.push('Desinvestimentos (Liquidação de Ativos)');
    else if (fci < 0) consumers.push('Investimentos (CAPEX / Expansão)');

    if (fcf > 0) {
      generators.push('Financiamentos/Aportes (Entrada de Capital Externo)');
      if (dependencyStatus === 'DEPENDENCIA_CRITICA' || dependencyStatus === 'DEPENDENCIA_RELEVANTE') {
        externalDependencies.push('Capitalização Societária para Cobrir FCO Negativo');
        recommendationDrivers.push('Risco de Diluição / Necessidade de Breakeven de Caixa');
      } else {
        externalDependencies.push('Capitalização Estratégica (M&A / Expansão Opex)');
      }
    } else if (fcf < 0) {
      consumers.push('Amortização de Dívidas / Distribuição de Dividendos');
      if (fco > 0) {
        recommendationDrivers.push('Sustentabilidade Comprovada (Pagamento de Passivos/Sócios via FCO)');
      }
    }

    if (dependencyStatus === 'AUTOSSUFICIENTE') {
      recommendationDrivers.push('Expansão Autofinanciada Viável');
    }

    if (dependencyStatus === 'DEPENDENCIA_CRITICA') {
      recommendationDrivers.push('Congelamento de CAPEX / Redução Urgente de OPEX');
    }

    return { generators, consumers, externalDependencies, recommendationDrivers };
  }
}
