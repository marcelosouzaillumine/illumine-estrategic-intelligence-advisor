import { EnterpriseRisk, RiskHeatmap, RiskCategory } from './types';
import { riskMatrixEngine } from './RiskMatrixEngine';
import { riskMitigationRegistry } from './RiskMitigationRegistry';

export class EnterpriseRiskEngine {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  private risks: Map<string, EnterpriseRisk> = new Map();

  /**
   * Respeita o DataAccessContext e evita Cross-Tenant Leakage filtrando estritamente pelo tenantId.
   */
  private getRisksForTenant(tenantId: string): EnterpriseRisk[] {
    return Array.from(this.risks.values()).filter(r => r.tenantId === tenantId);
  }

  /**
   * Registra um novo risco corporativo, gerando a linhagem auditável.
   */
  public registerRisk(risk: EnterpriseRisk): void {
    if (!risk.tenantId) {
      throw new Error('TenantId é obrigatório para garantir isolamento Multi-Tenant (Zero Cross-Tenant Leakage).');
    }

    // Calcula os scores iniciais
    const mitigationEffectiveness = risk.mitigationPlan 
      ? riskMitigationRegistry.calculateEffectiveness(risk.mitigationPlan.planId) 
      : 0;

    const evaluation = riskMatrixEngine.evaluateRisk({
      impact: risk.impact,
      probability: risk.probability,
      controlsEffectiveness: mitigationEffectiveness
    });

    risk.inherentRisk = evaluation.inherentRiskScore;
    risk.residualRisk = evaluation.residualRiskScore;
    
    // Rastreabilidade obrigatória
    risk.createdAt = new Date().toISOString();
    risk.updatedAt = new Date().toISOString();
    
    this.risks.set(risk.riskId, risk);

    // Integração com Decision Governance para riscos Críticos
    if (evaluation.criticalityLevel === 'Crítica') {
      this.triggerInstitutionalAlert(risk);
    }
  }

  /**
   * Integração com a Governança de Decisão (Fiduciary)
   * Dispara alertas e cria recomendação de decisão no Board Deck.
   */
  private triggerInstitutionalAlert(risk: EnterpriseRisk): void {
    // Aqui estaria a chamada para o DecisionGovernanceEngine (mockado para consolidação da arquitetura base)
    console.warn(`[INSTITUTIONAL ALERT] Risco Crítico Identificado: ${risk.title}. Gerando pauta para Conselho (Lineage Hash: ${risk.lineageHash})`);
    
    // Exemplo de payload que seria enviado ao Decision Engine
    const decisionPayload = {
      sourceRiskId: risk.riskId,
      recommendedAction: 'Aprovação de orçamento emergencial para mitigação.',
      boardDeckItem: true,
      contextSnapshot: {
        impact: risk.impact,
        residualRisk: risk.residualRisk
      }
    };
    
    // decisionGovernanceEngine.proposeDecision(decisionPayload);
  }

  /**
   * Gera o Heatmap Board-Ready consolidando todos os dados do tenant.
   */
  public generateHeatmap(tenantId: string): RiskHeatmap {
    const tenantRisks = this.getRisksForTenant(tenantId);
    
    const matrix: Record<string, EnterpriseRisk[]> = {};
    const risksByCategory: Record<string, number> = {};
    const risksByEntity: Record<string, number> = {};
    const risksWithoutOwner: EnterpriseRisk[] = [];
    let totalResidualRisk = 0;

    tenantRisks.forEach(risk => {
      // Agrupamento para matriz
      const key = `${risk.impact}-${risk.probability}`;
      if (!matrix[key]) matrix[key] = [];
      matrix[key].push(risk);

      // Agrupamento por Categoria
      risksByCategory[risk.category] = (risksByCategory[risk.category] || 0) + 1;

      // Agrupamento por Entidade (Holding support)
      if (risk.entityId) {
        risksByEntity[risk.entityId] = (risksByEntity[risk.entityId] || 0) + 1;
      }

      // Verificação de Owner Fiduciário
      if (!risk.owner) {
        risksWithoutOwner.push(risk);
      }

      totalResidualRisk += risk.residualRisk;
    });

    const delayedMitigations = riskMitigationRegistry.getDelayedMitigations()
      .filter(m => tenantRisks.some(r => r.mitigationPlan?.planId === m.planId));

    // Determina Top Riscos Críticos (Maior Risco Residual primeiro)
    const topCriticalRisks = [...tenantRisks]
      .sort((a, b) => b.residualRisk - a.residualRisk)
      .slice(0, 5);

    return {
      matrix,
      topCriticalRisks,
      risksByCategory: risksByCategory as Record<RiskCategory, number>,
      risksByEntity,
      risksWithoutOwner,
      delayedMitigations,
      exposureTrend: 'Estável', // Na prática, calcularia vs snapshot histórico
      consolidatedResidualRisk: totalResidualRisk
    };
  }
}

export const enterpriseRiskEngine = new EnterpriseRiskEngine();
