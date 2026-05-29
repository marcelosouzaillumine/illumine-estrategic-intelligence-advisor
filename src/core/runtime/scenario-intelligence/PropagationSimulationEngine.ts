// src/core/runtime/scenario-intelligence/PropagationSimulationEngine.ts
import { ScenarioInput, PropagationSimulationProfile, PropagationNode, PropagationEdge } from './scenario-types';

export class PropagationSimulationEngine {
  public static simulate(inputs: ScenarioInput[], contextData: any): PropagationSimulationProfile {
    const nodes: PropagationNode[] = [];
    const edges: PropagationEdge[] = [];
    let integrityScore = 100;
    let maxSeverityLevel = 0; // 0=BAIXA, 1=MODERADA, 2=ALTA, 3=CRÍTICA

    const severityMap = ['BAIXA', 'MODERADA', 'ALTA', 'CRÍTICA'] as const;

    // Helper para adicionar edges e nodes
    const addPropagation = (
      sourceDim: PropagationNode['dimension'], sourceMetric: string, sourceMag: number, sourceSev: number,
      targetDim: PropagationNode['dimension'], targetMetric: string, targetMag: number, targetSev: number,
      mechanism: string
    ) => {
      const srcNode: PropagationNode = { dimension: sourceDim, metric: sourceMetric, impactMagnitude: sourceMag, impactDirection: sourceMag > 0 ? 'POSITIVE' : 'NEGATIVE', severity: severityMap[sourceSev] };
      const tgtNode: PropagationNode = { dimension: targetDim, metric: targetMetric, impactMagnitude: targetMag, impactDirection: targetMag > 0 ? 'POSITIVE' : 'NEGATIVE', severity: severityMap[targetSev] };
      
      if (!nodes.find(n => n.dimension === sourceDim && n.metric === sourceMetric)) nodes.push(srcNode);
      if (!nodes.find(n => n.dimension === targetDim && n.metric === targetMetric)) nodes.push(tgtNode);

      edges.push({ source: srcNode, target: tgtNode, mechanism });
      maxSeverityLevel = Math.max(maxSeverityLevel, sourceSev, targetSev);
    };

    // Lógica determinística baseada na Tese (Aumento de Estoque propaga para DFC)
    for (const input of inputs) {
      if (input.variable === 'INVENTORY_VOLUME' && input.variationPercentage > 0) {
        integrityScore -= 5;
        const ocfImpact = - (input.variationPercentage * 0.8); // 80% do aumento de estoque vira queima de caixa
        addPropagation(
          'BP', 'Estoque', input.variationPercentage, input.variationPercentage > 20 ? 2 : 1,
          'DFC', 'Caixa Operacional', ocfImpact, input.variationPercentage > 20 ? 3 : 2,
          'Retenção de Capital de Giro'
        );
        
        // Propagação Secundária (Caixa Operacional -> Liquidez)
        addPropagation(
          'DFC', 'Caixa Operacional', ocfImpact, input.variationPercentage > 20 ? 3 : 2,
          'LIQUIDITY', 'Liquidez Corrente', ocfImpact * 0.5, input.variationPercentage > 20 ? 3 : 2,
          'Drenagem de Tesouraria'
        );
      }

      if (input.variable === 'REVENUE_VOLUME' && input.variationPercentage < 0) {
        integrityScore -= 10;
        const ebitdaImpact = input.variationPercentage * 1.5; // Alavancagem operacional
        addPropagation(
          'DRE', 'Receita Líquida', input.variationPercentage, input.variationPercentage < -20 ? 3 : 2,
          'DRE', 'EBITDA', ebitdaImpact, input.variationPercentage < -20 ? 3 : 2,
          'Compressão de Margem por Alavancagem'
        );
      }

      if (input.variable === 'CAPEX_VOLUME' && input.variationPercentage > 0) {
        addPropagation(
          'BP', 'Imobilizado', input.variationPercentage, 1,
          'DFC', 'Caixa de Investimentos', -input.variationPercentage, 2,
          'Desembolso de Capital'
        );
        addPropagation(
          'DFC', 'Caixa de Investimentos', -input.variationPercentage, 2,
          'FUNDING', 'Necessidade de Captação', input.variationPercentage, input.variationPercentage > 20 ? 3 : 1,
          'Déficit de Geração Livre'
        );
      }
    }

    return {
      nodes,
      edges,
      structuralIntegrityScore: Math.max(0, integrityScore),
      systemicSeverity: severityMap[maxSeverityLevel]
    };
  }
}
