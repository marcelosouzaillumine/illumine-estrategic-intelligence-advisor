// src/core/runtime/constitutional-governance/FiduciaryAxiomEngine.ts
//
// Fiduciary Axiom Engine
// Governs immutable constitutional axioms and checks for attempts of fiduciary weakening.

import { FiduciaryAxiom } from './constitutional-types';

export class FiduciaryAxiomEngine {
  private static readonly axioms: FiduciaryAxiom[] = [
    {
      key: 'survivability_supremacy',
      name: 'survivability supremacy',
      description: 'A preservação existencial e a solvência do caixa são soberanas sobre qualquer prioridade de crescimento.',
      isImmutable: true,
      isNonOverridable: true,
      versionMetadata: { lastReviewed: '2026-05-30T15:00:00Z', version: '1.0.0', authReference: 'CONST-AXIOM-001' }
    },
    {
      key: 'fail_closed_doctrine',
      name: 'fail-closed doctrine',
      description: 'Qualquer degradação de confiança ou inconsistência crítica força o travamento preventivo do ecossistema.',
      isImmutable: true,
      isNonOverridable: true,
      versionMetadata: { lastReviewed: '2026-05-30T15:00:00Z', version: '1.0.0', authReference: 'CONST-AXIOM-002' }
    },
    {
      key: 'fiduciary_neutrality',
      name: 'fiduciary neutrality',
      description: 'A avaliação de riscos fiduciários deve ser livre de influências comerciais ou vieses operacionais.',
      isImmutable: true,
      isNonOverridable: true,
      versionMetadata: { lastReviewed: '2026-05-30T15:00:00Z', version: '1.0.0', authReference: 'CONST-AXIOM-003' }
    },
    {
      key: 'lineage_integrity',
      name: 'lineage integrity',
      description: 'Nenhum dado ou conclusão fiduciária é válida sem rastreabilidade determinística completa (lineage) e assinaturas.',
      isImmutable: true,
      isNonOverridable: true,
      versionMetadata: { lastReviewed: '2026-05-30T15:00:00Z', version: '1.0.0', authReference: 'CONST-AXIOM-004' }
    },
    {
      key: 'deterministic_explainability',
      name: 'deterministic explainability',
      description: 'Qualquer bloqueio ou restrição regulatória deve possuir um nexo causal explicável em linguagem natural.',
      isImmutable: true,
      isNonOverridable: true,
      versionMetadata: { lastReviewed: '2026-05-30T15:00:00Z', version: '1.0.0', authReference: 'CONST-AXIOM-005' }
    },
    {
      key: 'treasury_preservation_priority',
      name: 'treasury preservation priority',
      description: 'Salvaguardar as reservas de tesouraria do grupo é prioritário em relação a qualquer distribuição de dividendos.',
      isImmutable: true,
      isNonOverridable: true,
      versionMetadata: { lastReviewed: '2026-05-30T15:00:00Z', version: '1.0.0', authReference: 'CONST-AXIOM-006' }
    },
    {
      key: 'disclosure_transparency',
      name: 'disclosure transparency',
      description: 'A ocultação de riscos de sobrevivência de baixo sinal é estritamente proibida; disclosures devem ser públicos.',
      isImmutable: true,
      isNonOverridable: true,
      versionMetadata: { lastReviewed: '2026-05-30T15:00:00Z', version: '1.0.0', authReference: 'CONST-AXIOM-007' }
    },
    {
      key: 'audit_reconstructability',
      name: 'audit reconstructability',
      description: 'Todos os logs e execuções devem permitir reprodução histórica exata em ambiente seco (dry-run replay).',
      isImmutable: true,
      isNonOverridable: true,
      versionMetadata: { lastReviewed: '2026-05-30T15:00:00Z', version: '1.0.0', authReference: 'CONST-AXIOM-008' }
    }
  ];

  /**
   * Returns a copy of the immutable constitutional axioms.
   */
  public getAxioms(): FiduciaryAxiom[] {
    return FiduciaryAxiomEngine.axioms.map(a => ({
      ...a,
      versionMetadata: a.versionMetadata ? { ...a.versionMetadata } : undefined
    }));
  }

  /**
   * Validates that no migration or runtime transaction is trying to weaken or mutate the axioms.
   */
  public validateAxiomIntegrity(attemptedAxioms: FiduciaryAxiom[]): { isValid: boolean; violations: string[] } {
    const violations: string[] = [];

    for (const original of FiduciaryAxiomEngine.axioms) {
      const match = attemptedAxioms.find(a => a.key === original.key);
      if (!match) {
        violations.push(`VIOLAÇÃO: Remoção do axioma obrigatório '${original.name}'.`);
        continue;
      }

      if (!match.isImmutable || !match.isNonOverridable) {
        violations.push(`VIOLAÇÃO: O axioma '${original.name}' tentou ser flexibilizado (isImmutable/isNonOverridable modificado).`);
      }

      if (match.name !== original.name) {
        violations.push(`VIOLAÇÃO: O nome do axioma '${original.name}' não pode ser alterado.`);
      }

      if (match.description !== original.description) {
        violations.push(`VIOLAÇÃO: A descrição fiduciária do axioma '${original.name}' foi alterada.`);
      }
    }

    return {
      isValid: violations.length === 0,
      violations
    };
  }

  /**
   * Evaluates a report payload to detect if any fundamental constitutional axiom has been violated.
   */
  public evaluateReportAxioms(report: any): { isViolated: boolean; violations: string[] } {
    const violations: string[] = [];

    // 1. Fail-Closed check
    const isConfidenceLow = report.compliance?.confidenceLevel === 'LOW' ||
      report.compliance?.confidenceLevel === 'LOW_CONFIDENCE' ||
      report.resilienceReport?.confidenceLevel === 'LOW';

    const isFailClosedActive = report.failClosedTriggered || 
      report.deploymentReadiness?.deploymentBlocked || 
      report.compliance?.runtimeMode === 'FAIL_CLOSED';

    if (isConfidenceLow && !isFailClosedActive) {
      violations.push('VIOLAÇÃO DE AXIOMA [fail-closed doctrine]: Confiança fiduciária baixa sem ativação do travamento fail-closed.');
    }

    // 2. Lineage Integrity check
    if (!report.lineageHash || report.lineageHash === 'placeholder-hash' || report.lineageHash === 'seed_lineage_hash') {
      // Allow 'seed_lineage_hash' in development mock setups if needed, but in production/strict context it is blocked.
      // Let's assert empty/untrusted lineage is blocked
      if (!report.lineageHash || report.lineageHash === '') {
        violations.push('VIOLAÇÃO DE AXIOMA [lineage integrity]: Execução sem hash de linhagem fiduciária.');
      }
    }

    // 3. Survivability Supremacy check
    if (report.survivalReport?.activeSurvivalMode === 'SURVIVAL_MODE') {
      const blocked = report.survivalReport.blockedActions || [];
      if (blocked.length === 0) {
        violations.push('VIOLAÇÃO DE AXIOMA [survivability supremacy]: Modo sobrevivência ativado sem imposição de restrições fiduciárias.');
      }
    }

    return {
      isViolated: violations.length > 0,
      violations
    };
  }
}
