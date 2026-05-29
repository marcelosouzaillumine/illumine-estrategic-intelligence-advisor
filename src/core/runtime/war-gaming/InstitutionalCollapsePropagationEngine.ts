// src/core/runtime/war-gaming/InstitutionalCollapsePropagationEngine.ts

import { CrisisInput, CrisisPropagationNode } from './war-gaming-types';

export class InstitutionalCollapsePropagationEngine {
  /**
   * Deterministic propagation mapping based on standard corporate financial structures.
   */
  public static propagate(
    inputs: CrisisInput[],
    baselineMetrics: {
      receita: number;
      margemContribuicaoPct: number;
      custosFixos: number;
      ebitda: number;
      prazoMedioFornecedores: number;
      estoques: number;
    }
  ): CrisisPropagationNode[] {
    const nodes: CrisisPropagationNode[] = [];

    inputs.forEach(input => {
      if (input.type === 'REVENUE_COMPRESSION') {
        const simulatedReceita = Math.max(0, baselineMetrics.receita * (1 - input.magnitude));
        const variance = (simulatedReceita - baselineMetrics.receita) / (baselineMetrics.receita || 1);
        
        nodes.push({
          nodeId: 'NODE_REV_1',
          variable: 'Receita Líquida',
          baselineValue: baselineMetrics.receita,
          simulatedValue: simulatedReceita,
          variancePercentage: variance,
          severity: Math.abs(variance) > 0.3 ? 'RUPTURA' : 'ALTA',
          causalLinkTo: 'NODE_MC_1',
          rationale: `Contração de receita projetada em ${(input.magnitude * 100).toFixed(1)}%.`
        });

        const simulatedMC = simulatedReceita * baselineMetrics.margemContribuicaoPct;
        const baselineMC = baselineMetrics.receita * baselineMetrics.margemContribuicaoPct;
        const mcVariance = (simulatedMC - baselineMC) / (baselineMC || 1);

        nodes.push({
          nodeId: 'NODE_MC_1',
          variable: 'Margem de Contribuição',
          baselineValue: baselineMC,
          simulatedValue: simulatedMC,
          variancePercentage: mcVariance,
          severity: Math.abs(mcVariance) > 0.3 ? 'CRÍTICA' : 'ALTA',
          causalLinkTo: 'NODE_EBITDA_1',
          rationale: 'Erosão de margem decorrente da queda primária de receita.'
        });

        const simulatedEbitda = simulatedMC - baselineMetrics.custosFixos;
        const ebitdaVariance = (simulatedEbitda - baselineMetrics.ebitda) / (Math.abs(baselineMetrics.ebitda) || 1);
        
        nodes.push({
          nodeId: 'NODE_EBITDA_1',
          variable: 'EBITDA',
          baselineValue: baselineMetrics.ebitda,
          simulatedValue: simulatedEbitda,
          variancePercentage: ebitdaVariance,
          severity: simulatedEbitda < 0 ? 'RUPTURA' : (Math.abs(ebitdaVariance) > 0.5 ? 'CRÍTICA' : 'ALTA'),
          causalLinkTo: 'NODE_CASH_1',
          rationale: 'Pressão estrutural na capacidade de geração primária de caixa devido à alavancagem operacional.'
        });
      }

      if (input.type === 'SUPPLIER_SHOCK') {
         const simulatedPrazo = Math.max(0, baselineMetrics.prazoMedioFornecedores * (1 - input.magnitude));
         const pVariance = (simulatedPrazo - baselineMetrics.prazoMedioFornecedores) / (baselineMetrics.prazoMedioFornecedores || 1);

         nodes.push({
           nodeId: 'NODE_SUP_1',
           variable: 'Prazo Médio de Fornecedores',
           baselineValue: baselineMetrics.prazoMedioFornecedores,
           simulatedValue: simulatedPrazo,
           variancePercentage: pVariance,
           severity: Math.abs(pVariance) > 0.4 ? 'CRÍTICA' : 'MODERADA',
           causalLinkTo: 'NODE_CASH_1',
           rationale: `Ruptura na cadeia de fornecimento exige aceleração de pagamento em ${(input.magnitude * 100).toFixed(1)}%.`
         });
      }
    });

    return nodes;
  }
}
