import { ConsolidatedFinancialOutput } from '../types';
import { CrossEntityCausality, DependencyAnalysis, SystemicRisk } from './advisoryTypes';
import { formatEntityName } from '../EntityFormatter';

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
        triggerEntityId: p.primaryEntityId,
        impactedEntities: [p.secondaryEntityId!],
        severity: 'SEVERE',
        description: `O dreno estrutural de caixa gerado por ${formatEntityName(p.primaryEntityId)} pode causar asfixia de liquidez em ${formatEntityName(p.secondaryEntityId!)}, afetando a operação que gera o resultado do grupo.`,
        potentialDominoEffect: true
      });
    }

    // 2. Colapso da Cadeia de Liquidez (Subsidiação Artificial)
    const subsidizations = causalities.filter(c => c.causalityType === 'ARTIFICIAL_SUBSIDIZATION');
    for (const sub of subsidizations) {
      risks.push({
        riskType: 'LIQUIDITY_CHAIN_COLLAPSE',
        triggerEntityId: sub.secondaryEntityId!,
        impactedEntities: [sub.primaryEntityId],
        severity: 'ELEVATED',
        description: `Se a capacidade de funding de ${formatEntityName(sub.secondaryEntityId!)} for comprometida, a entidade ${formatEntityName(sub.primaryEntityId)} sofrerá colapso imediato devido à alta dependência intragrupo.`,
        potentialDominoEffect: false
      });
    }

    // 3. Efeito Dominó por Concentração de Receita
    const revInflation = causalities.filter(c => c.causalityType === 'ARTIFICIAL_GROWTH');
    for (const rev of revInflation) {
      risks.push({
        riskType: 'DOMINO_EFFECT',
        triggerEntityId: rev.secondaryEntityId!,
        impactedEntities: [rev.primaryEntityId],
        severity: 'CRITICAL',
        description: `Falha nas obrigações ou queda na demanda de ${formatEntityName(rev.secondaryEntityId!)} reduzirá artificialmente e materialmente o faturamento de ${formatEntityName(rev.primaryEntityId)}.`,
        potentialDominoEffect: true
      });
    }

    return risks;
  }
}
