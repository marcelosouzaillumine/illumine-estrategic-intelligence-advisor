import { InstitutionalIntegrityScore, ComplianceAuditTrail } from './types';
import { whistleblowingEngine } from './WhistleblowingEngine';
import { conductCodeRegistry } from './ConductCodeRegistry';
import { esgGovernanceEngine } from './ESGGovernanceEngine';
import { ethicsCommitteeRuntime } from './EthicsCommitteeRuntime';

export class InstitutionalIntegrityEngine {
  /**
   * Consolida todos os vetores éticos e de governança do Tenant para gerar o Score de Integridade.
   */
  public generateIntegrityScore(tenantId: string, activeUserIds: string[]): InstitutionalIntegrityScore {
    if (!tenantId) throw new Error('TenantId obrigatório para motor de Integridade.');

    // 1. Extrai Gaps de Compliance (Aceites pendentes)
    const complianceGaps = conductCodeRegistry.checkComplianceGaps(tenantId, activeUserIds);
    const totalGaps = complianceGaps.reduce((acc, gap) => acc + gap.nonCompliantUserIds.length, 0);

    // 2. Extrai Denúncias Abertas
    const openReports = whistleblowingEngine.getReportsForTenant(tenantId).filter(r => 
      r.status !== 'Concluído com Sanção' && 
      r.status !== 'Arquivado por Insuficiência' && 
      r.status !== 'Arquivado como Improcedente'
    );
    
    // 3. Extrai Sanções Recentes (Violações Ativas)
    const recentDecisions = ethicsCommitteeRuntime.getDecisionsForTenant(tenantId).filter(d => !!d.sanctionApplied);

    // 4. Extrai Score ESG
    const esgScore = esgGovernanceEngine.getLatestScore(tenantId);
    const esgAlignment = esgScore ? esgScore.consolidatedScore : 100;

    // --- CÁLCULO DA INTEGRIDADE (100 base) ---
    let integrityScore = 100;

    // Penalidade por Gaps de aceite (-1 pt por gap)
    integrityScore -= Math.min(20, totalGaps);

    // Penalidade por denúncias ativas de severidade alta
    const criticalReports = openReports.filter(r => r.severity === 'Crítica' || r.severity === 'Sistêmica').length;
    integrityScore -= (criticalReports * 5);

    // Penalidade por violações julgadas e sancionadas
    integrityScore -= (recentDecisions.length * 10);

    // Ajuste pelo ESG
    if (esgAlignment < 70) integrityScore -= 10;

    integrityScore = Math.max(0, Math.min(100, integrityScore));

    const timestamp = new Date().toISOString();
    const scoreId = `INT-SCORE-${Date.now()}`;

    const score: InstitutionalIntegrityScore = {
      scoreId,
      tenantId,
      integrityScore,
      complianceGaps: totalGaps,
      openWhistleblowingReports: openReports.length,
      activeViolations: recentDecisions.length,
      esgAlignment,
      trend: integrityScore >= 80 ? 'Estável' : 'Atenção' as unknown as "Estável" | "Deteriorando" | "Melhorando", // tipagem mockada para trend
      auditTrail: [{
        auditId: `AUDIT-INT-${Date.now()}`,
        action: 'INTEGRITY_SCORE_GENERATED',
        actorHash: 'INTEGRITY_ENGINE',
        timestamp,
        details: `Score de Integridade calculado em ${integrityScore}/100.`
      }],
      lineageHash: `LIN-INT-${tenantId}-${scoreId}`,
      createdAt: timestamp,
      updatedAt: timestamp,
      confidenceScore: 95
    };

    // Ajuste fino do trend
    if (integrityScore < 60) score.trend = 'Deteriorando';
    else if (integrityScore > 90) score.trend = 'Melhorando';

    return score;
  }
}

export const institutionalIntegrityEngine = new InstitutionalIntegrityEngine();
