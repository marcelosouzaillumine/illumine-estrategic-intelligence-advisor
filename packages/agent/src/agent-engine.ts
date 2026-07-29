import { Logger } from '../../core/src/logging/logger';
import { ImpactCommand } from '../../cli/src/commands/impact';

export interface PRReviewResult {
  prId: string;
  blastRadiusRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendation: 'APPROVE_PR' | 'REQUEST_CHANGES';
  explanations: string[];
  mustAutoMergeForbidden: true;
}

export class ArchitectureAgentEngine {
  public static reviewPR(prId: string, changedFile: string): PRReviewResult {
    Logger.info(`[Architecture Agent] Conduzindo revisão automatizada de PR para: ${prId}`);

    const impact = ImpactCommand.execute(changedFile);

    const result: PRReviewResult = {
      prId,
      blastRadiusRisk: impact.riskLevel,
      recommendation: impact.riskLevel === 'HIGH' || impact.riskLevel === 'CRITICAL' ? 'REQUEST_CHANGES' : 'APPROVE_PR',
      explanations: [
        `Impacto calculado DIE: ${impact.affectedPagesCount} páginas afetadas.`,
        'Salvaguarda Human-in-the-Loop ativa: O merge automático é estritamente proibido. Aguardando revisão do ARB Board.'
      ],
      mustAutoMergeForbidden: true
    };

    Logger.info(`[Architecture Agent] Revisão concluída. Recomendação: ${result.recommendation} | AutoMerge: FORBIDDEN`);
    return result;
  }
}

export class ArchitectureAgentV2 {
  public static auditAndAssistRefactoring(pageId: string): {
    pageId: string;
    migrationPlan: string;
    generatedManifestId: string;
    requiresHumanApproval: boolean;
  } {
    Logger.info(`[Architecture Agent v2] Auditoria preventiva e refatoração assistida para: ${pageId}`);
    return {
      pageId,
      migrationPlan: 'Migração declarativa para EAA Executive Template com L4 Binding',
      generatedManifestId: `${pageId}.page.manifest.yml`,
      requiresHumanApproval: true // Regra MUST Human-in-the-Loop
    };
  }
}
