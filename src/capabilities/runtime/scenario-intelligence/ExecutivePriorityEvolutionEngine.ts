// src/core/runtime/scenario-intelligence/ExecutivePriorityEvolutionEngine.ts
import { InstitutionalScenarioResult } from './scenario-types';
import { StressTestResult } from './InstitutionalStressTestEngine';
import { ExecutiveActionItem } from '../../../core/runtime/integrity/ExecutiveActionMatrixEngine';

export class ExecutivePriorityEvolutionEngine {
  public static evolve(
    currentMatrix: ExecutiveActionItem[],
    scenarioResult: InstitutionalScenarioResult,
    stressResult?: StressTestResult
  ): ExecutiveActionItem[] {
    
    if (scenarioResult.validation.status !== 'VALID' || !scenarioResult.propagationProfile) {
      return currentMatrix;
    }

    const { nodes } = scenarioResult.propagationProfile;
    const { structuralVulnerabilities } = stressResult || { structuralVulnerabilities: [] };

    // Deep copy for mutation in scenario exploration
    const evolvedMatrix: ExecutiveActionItem[] = JSON.parse(JSON.stringify(currentMatrix));

    // Se houve propagação de Liquidez ou Caixa Operacional (impacto sistêmico)
    const liquidityHit = nodes.find(n => n.dimension === 'LIQUIDITY' && n.impactDirection === 'NEGATIVE');
    const cashBurn = nodes.find(n => n.dimension === 'DFC' && n.metric === 'Caixa Operacional' && n.impactDirection === 'NEGATIVE');

    if (liquidityHit || cashBurn) {
      // Prioridades de tesouraria sofrem agravamento
      evolvedMatrix.forEach(action => {
        if (action.category.includes('Tesouraria') || action.category.includes('Liquidez')) {
          action.priority = 'Alta';
          action.fiduciaryEvidence = `Simulação projeta escalada de risco: ${structuralVulnerabilities.join(' | ')}`;
        }
      });
    }

    // Se houve dependência de Funding
    const fundingNeed = nodes.find(n => n.dimension === 'FUNDING' && n.impactDirection === 'POSITIVE');
    if (fundingNeed) {
      // Adicionar nova ação latente se não existir
      const hasFundingAction = evolvedMatrix.some(a => a.category === 'Funding');
      if (!hasFundingAction) {
        evolvedMatrix.push({
          title: 'Assegurar Linhas de Liquidez Estratégicas',
          priority: fundingNeed.severity === 'CRÍTICA' ? 'Alta' : 'Moderada',
          expectedImpact: 'Garantir sobrevivência frente ao estresse de expansão simulado',
          executionRisk: 'Moderado',
          fiduciaryEvidence: `contexto simulado induz déficit de geração livre forçando alavancagem passiva.`,
          category: 'Funding',
          timeline: 'Imediato',
          monitoringKPI: 'Liquidez Corrente Simulada',
          severity: fundingNeed.severity
        } as ExecutiveActionItem);
      }
    }

    return evolvedMatrix.sort((a, b) => a.priority === 'Alta' ? -1 : 1);
  }
}
