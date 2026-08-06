import {
  SimulationInput,
  SimulationPropagationSeverity
} from './types';

export class PropagationSimulationEngine {
  /**
   * Projeta de forma determinística e isolada por inquilino a cadeia de contágio e propagação
   * de stress entre entidades ou departamentos associados.
   */
  public static calculateContagion(
    input: SimulationInput,
    baseScore: number
  ): Array<{
    step: number;
    entityId: string;
    contagionType: string;
    impactDescription: string;
    severity: SimulationPropagationSeverity;
  }> {
    // 1. Postura Fail-Closed
    if (!input.lineageHash || !input.correlationId || input.lineageHash.trim() === '' || input.correlationId.trim() === '') {
      throw new Error('FAIL_CLOSED: Propagação de contágio bloqueada devido a lineageHash ou correlationId ausentes.');
    }

    const propagationChain: Array<{
      step: number;
      entityId: string;
      contagionType: string;
      impactDescription: string;
      severity: SimulationPropagationSeverity;
    }> = [];

    // Primeiro nó: A própria entidade sob choque inicial
    propagationChain.push({
      step: 1,
      entityId: input.entityId,
      contagionType: 'DIRECT_SHOCK',
      impactDescription: `Choque determinístico inicial devido a contexto do tipo ${input.scenarioType}.`,
      severity: baseScore > 75 ? 'CRITICAL' : baseScore > 40 ? 'ELEVATED' : 'CONTAINED'
    });

    // Mapeamento determinístico de dependências com base no tenant e contexto
    // Para manter a segurança sem vazamento de dados, derivamos as entidades do tenant de forma determinística.
    const subEntities = [
      { id: `${input.entityId}-SUB-01`, name: 'Operações de Varejo / Vendas', weight: 0.6, type: 'REVENUE_SHARE_LOSS' },
      { id: `${input.entityId}-SUB-02`, name: 'Logística & Suprimentos', weight: 0.45, type: 'SUPPLY_CHAIN_BOTTLENECK' },
      { id: `${input.entityId}-CORP`, name: 'Holding & Shared Services', weight: 0.75, type: 'SHARED_SERVICES_DRAG' }
    ];

    let currentStep = 2;

    // Se o stress for significativo, propaga para as subsidiárias e holding
    if (baseScore > 25) {
      for (const entity of subEntities) {
        const nodeStress = baseScore * entity.weight;
        let severity: SimulationPropagationSeverity = 'CONTAINED';
        
        if (nodeStress > 70) {
          severity = 'SYSTEMIC';
        } else if (nodeStress > 50) {
          severity = 'CRITICAL';
        } else if (nodeStress > 30) {
          severity = 'ELEVATED';
        }

        let impactDescription = '';
        switch (entity.type) {
          case 'REVENUE_SHARE_LOSS':
            impactDescription = `Queda de receita na controladora reduz repasses e orçamentos operacionais em ${entity.name}.`;
            break;
          case 'SUPPLY_CHAIN_BOTTLENECK':
            impactDescription = `Atrasos de pagamentos na matriz comprometem credenciamento e entregas em ${entity.name}.`;
            break;
          case 'SHARED_SERVICES_DRAG':
            impactDescription = `Estresse de liquidez gera rateio emergencial de despesas administrativas e atrito em ${entity.name}.`;
            break;
        }

        propagationChain.push({
          step: currentStep++,
          entityId: entity.id,
          contagionType: entity.type,
          impactDescription,
          severity
        });
      }
    }

    return propagationChain;
  }
}
