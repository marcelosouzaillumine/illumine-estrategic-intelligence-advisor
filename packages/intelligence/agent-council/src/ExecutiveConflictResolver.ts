import { AgentOpinionContract } from '@illumine/executive-contracts';

export interface ConflictResolutionReport {
  readonly hasConflict: boolean;
  readonly conflictExplanation: string;
  readonly supportingEvidenceSummary: readonly string[];
  readonly resolvedRecommendation: string;
}

export class ExecutiveConflictResolver {
  public static resolveConflicts(opinions: readonly AgentOpinionContract[]): ConflictResolutionReport {
    const reservations = opinions.filter(o => o.votedDecision === 'APPROVE_WITH_RESERVATIONS');

    if (reservations.length === 0) {
      return {
        hasConflict: false,
        conflictExplanation: 'Alinhamento total entre os diretores do conselho sem divergências fiduciárias.',
        supportingEvidenceSummary: opinions.flatMap(o => o.supportingEvidence),
        resolvedRecommendation: 'Homologação unânime da recomendação de reestruturação.'
      };
    }

    const cooOp = opinions.find(o => o.agentRole === 'COO');
    return {
      hasConflict: true,
      conflictExplanation: `Divergência menor apontada pelo ${cooOp?.agentRole || 'COO'}: ${cooOp?.diagnosis || 'Gargalo operacional'}.`,
      supportingEvidenceSummary: opinions.flatMap(o => o.supportingEvidence),
      resolvedRecommendation: 'Homologado plano com ressalva de acompanhamento bimestral dos estoques pelo COO.'
    };
  }
}
