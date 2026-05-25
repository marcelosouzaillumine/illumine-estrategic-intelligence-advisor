import { ScenarioPropagationResult, ScenarioShock, ScenarioNarrative, ProjectedConfidence } from './ScenarioTypes';

export class ScenarioNarrativeEngine {
  /**
   * Gera o Advisory Preditivo (linguagem executiva determinística) do Cenário.
   * Não utiliza IAs Generativas em runtime para garantir auditabilidade.
   */
  static generateNarrative(shocks: ScenarioShock[], propagation: ScenarioPropagationResult, finalConfidence: ProjectedConfidence): ScenarioNarrative {
    const stress = propagation.stressResult;
    const vulnerabilities: string[] = [];

    let summary = `Sob um cenário submetido a ${shocks.length} vetores de choque institucional, `;

    if (stress.collapsedEntities.length > 0) {
      summary += `o grupo enfrenta ruptura de resiliência. As entidades ${stress.collapsedEntities.join(', ')} indicam colapso de solvência. `;
      vulnerabilities.push('Risco direto de Insolvência e Quebra de Entidades Operacionais.');
    } else {
      if (stress.groupSolvencyStatus === 'SOLVENT') {
        summary += `a estrutura corporativa mantém solvência, demonstrando resiliência aos impactos de curto e médio prazo. `;
      } else {
        summary += `o grupo entra em zona de vulnerabilidade, necessitando de injeção de capital circulante ou manobras de desmobilização. `;
      }
    }

    if (stress.monthsToLiquidityCrisis < 12) {
       summary += `Projeta-se exaustão de caixa em ${stress.monthsToLiquidityCrisis} meses no horizonte simulado. `;
       vulnerabilities.push(`Asfixia de Tesouraria Projetada para ${stress.monthsToLiquidityCrisis} meses.`);
    }

    const intercompanyRisks = propagation.propagatedViolations.filter(v => v.message.includes('Calote intragrupo'));
    if (intercompanyRisks.length > 0) {
       vulnerabilities.push(`Contaminação Cruzada: Mútuos ameaçados pela quebra de originadores. Risco material sistêmico.`);
    }

    if (finalConfidence === 'CRITICAL_STRESS') {
       summary += `Devido à gravidade, a Confiança Projetada (Projected Confidence) declina para CRITICAL STRESS, bloqueando governanças de expansão passivas.`;
    }

    return {
      executiveSummary: summary.trim(),
      keyVulnerabilities: vulnerabilities
    };
  }
}
