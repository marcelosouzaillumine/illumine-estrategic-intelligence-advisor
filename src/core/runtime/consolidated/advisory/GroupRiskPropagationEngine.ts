import { ConsolidatedFinancialOutput } from '../types';
import { CrossEntityCausality, DependencyAnalysis, SystemicRisk } from './advisoryTypes';

export class GroupRiskPropagationEngine {
  static analyze(
    financialOutput: ConsolidatedFinancialOutput,
    dependencies: DependencyAnalysis[],
    causalities: CrossEntityCausality[]
  ): SystemicRisk[] {
    const risks: SystemicRisk[] = [];

    // 1. Risco de Contaminação por Parasitismo (Holding drenando caixa)
    const parasitism = causalities.filter(c => c.causalityType === 'OPERATIONAL_PARASITISM');
    for (const p of parasitism) {
      risks.push({
        riskType: 'TREASURY_CONTAMINATION',
        triggerEntityId: p.primaryEntityId, // Holding
        impactedEntities: [p.secondaryEntityId!], // Filial
        severity: 'SEVERE',
        description: `O dreno estrutural de caixa gerado por ${p.primaryEntityId} pode causar asfixia de liquidez em ${p.secondaryEntityId}, afetando a operação que gera o resultado do grupo.`,
        potentialDominoEffect: true
      });
    }

    // 2. Colapso da Cadeia de Liquidez (Subsidiação Artificial)
    const subsidizations = causalities.filter(c => c.causalityType === 'ARTIFICIAL_SUBSIDIZATION');
    for (const sub of subsidizations) {
      risks.push({
        riskType: 'LIQUIDITY_CHAIN_COLLAPSE',
        triggerEntityId: sub.secondaryEntityId!, // Holding que financia
        impactedEntities: [sub.primaryEntityId], // Filial subsidiada
        severity: 'ELEVATED',
        description: `Se a capacidade de funding de ${sub.secondaryEntityId} for comprometida, a entidade ${sub.primaryEntityId} sofrerá colapso imediato devido à alta dependência intragrupo.`,
        potentialDominoEffect: false
      });
    }

    // 3. Efeito Dominó por Concentração de Receita
    const revInflation = causalities.filter(c => c.causalityType === 'ARTIFICIAL_GROWTH');
    for (const rev of revInflation) {
      risks.push({
        riskType: 'DOMINO_EFFECT',
        triggerEntityId: rev.secondaryEntityId!, // Entidade que compra
        impactedEntities: [rev.primaryEntityId], // Entidade que vende
        severity: 'CRITICAL',
        description: `Falha nas obrigações ou queda na demanda de ${rev.secondaryEntityId} reduzirá artificialmente e materialmente o faturamento de ${rev.primaryEntityId}.`,
        potentialDominoEffect: true
      });
    }

    return risks;
  }
}
