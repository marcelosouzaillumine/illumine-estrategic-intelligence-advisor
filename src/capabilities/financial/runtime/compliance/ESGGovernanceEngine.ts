import { ESGIndicator, ESGScore, ComplianceAuditTrail } from './types';

export class ESGGovernanceEngine {
  private indicators: Map<string, ESGIndicator> = new Map();
  private scores: Map<string, ESGScore> = new Map();

  /**
   * Registra ou atualiza um indicador ESG consolidado de um Tenant.
   */
  public registerIndicator(indicator: ESGIndicator): void {
    if (!indicator.tenantId) throw new Error('TenantId obrigatório para governança ESG.');
    this.indicators.set(indicator.indicatorId, indicator);
  }

  /**
   * Calcula o Score ESG Institucional baseado nos indicadores ativos e aplica penalidades por fragilidade ética.
   */
  public calculateInstitutionalESGScore(
    tenantId: string, 
    ethicsPenalties: number = 0 // Fornecido pela InstitutionalIntegrityEngine
  ): ESGScore {
    
    const tenantIndicators = Array.from(this.indicators.values()).filter(i => i.tenantId === tenantId);
    
    let envScore = 0, envCount = 0;
    let socScore = 0, socCount = 0;
    let govScore = 0, govCount = 0;

    for (const ind of tenantIndicators) {
      // Mock de cálculo: Média das métricas vs Target
      let indScore = 0;
      if (ind.metrics.length > 0) {
        indScore = ind.metrics.reduce((acc, m) => acc + (m.targetValue ? (m.value / m.targetValue) * 100 : 100), 0) / ind.metrics.length;
      }

      if (ind.pillar === 'Ambiental') { envScore += indScore; envCount++; }
      if (ind.pillar === 'Social') { socScore += indScore; socCount++; }
      if (ind.pillar === 'Governança') { govScore += indScore; govCount++; }
    }

    envScore = envCount > 0 ? Math.min(100, envScore / envCount) : 100; // 100 é base se não houver dados
    socScore = socCount > 0 ? Math.min(100, socScore / socCount) : 100;
    govScore = govCount > 0 ? Math.min(100, govScore / govCount) : 100;

    // Governança sofre penalidade direta de comitês de ética
    govScore = Math.max(0, govScore - ethicsPenalties);

    const consolidatedScore = Math.round((envScore * 0.3) + (socScore * 0.3) + (govScore * 0.4));
    
    const timestamp = new Date().toISOString();
    const scoreId = `ESG-SCORE-${Date.now()}`;

    const esgScore: ESGScore = {
      scoreId,
      tenantId,
      environmentalScore: Math.round(envScore),
      socialScore: Math.round(socScore),
      governanceScore: Math.round(govScore),
      consolidatedScore,
      auditTrail: [{
        auditId: `AUDIT-ESG-${Date.now()}`,
        action: 'SCORE_CALCULATED',
        actorHash: 'ESG_ENGINE',
        timestamp,
        details: `Score calculado. Penalidade Ética aplicada na Governança: -${ethicsPenalties} pts.`
      }],
      lineageHash: `LIN-ESG-${tenantId}-${scoreId}`,
      createdAt: timestamp,
      updatedAt: timestamp,
      confidenceScore: 90
    };

    this.scores.set(tenantId, esgScore); // Mantém apenas o mais atual no Map para simplicidade
    return esgScore;
  }

  public getLatestScore(tenantId: string): ESGScore | null {
    return this.scores.get(tenantId) || null;
  }
}

export const esgGovernanceEngine = new ESGGovernanceEngine();
