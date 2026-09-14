import { ExecutiveQuestion } from '../domain/ExecutiveQuestion';
import { TechnicalAssessmentPackage } from '../contracts/TechnicalAssessmentPackage';
import { BoardPackage } from '../contracts/BoardPackage';
import { RiskItem } from '../contracts/ExecutiveEvidencePackage';

export class ExecutiveDeliberationSupportEngine {
  /**
   * Avalia um pacote de pareceres técnicos à luz de uma questão executiva,
   * aplicando políticas institucionais para gerar a Deliberação (BoardPackage).
   */
  public static deliberate(
    question: ExecutiveQuestion,
    assessmentPackage: TechnicalAssessmentPackage,
    institutionalPolicies?: any // Placeholder for actual policy engine payload
  ): BoardPackage {
    
    // 1. Gather all restrictions across domains
    const allRestrictions: string[] = [];
    if (assessmentPackage.financialAssessment) allRestrictions.push(...(assessmentPackage.financialAssessment.limitations || []));
    if (assessmentPackage.economicAssessment) allRestrictions.push(...(assessmentPackage.economicAssessment.limitations || []));
    if (assessmentPackage.cashAssessment) allRestrictions.push(...(assessmentPackage.cashAssessment.limitations || []));

    // 2. Identify Conflicts and Options
    const conflicts: string[] = [];
    const options = [
      { id: 'OPT-1', name: 'Proceder Conforme Proposto', description: 'Avançar com a intenção original da questão estratégica.', impact: [] as string[] },
      { id: 'OPT-2', name: 'Pausar ou Reprovar', description: 'Bloquear ou adiar a decisão devido a riscos excessivos.', impact: ['Preservação de capital', 'Custo de oportunidade'] }
    ];
    const tradeoffs: string[] = [];

    const criticalStates = [
      assessmentPackage.financialAssessment?.executiveState,
      assessmentPackage.economicAssessment?.executiveState,
      assessmentPackage.cashAssessment?.executiveState
    ];

    if (criticalStates.includes('CRITICAL')) {
      conflicts.push('A ambição da questão estratégica diverge da realidade de sobrevivência do momento (Estado Crítico detectado).');
      options[0].impact.push('Risco extremo de solvência');
      tradeoffs.push('Proceder com a ação pode levar à insolvência, enquanto pausar garante a continuidade do negócio.');
    } else if (allRestrictions.length > 0) {
      conflicts.push('A ação entra em conflito com restrições institucionais apontadas (Margem, Liquidez).');
      options[0].impact.push('Possível aperto de liquidez no curto prazo');
      tradeoffs.push('Executar o plano gerará crescimento, mas requererá alavancagem não planejada ou aperto no caixa.');
    }

    // 3. Assemble the BoardPackage
    return {
      id: `BPKG-${Date.now()}`,
      sessionId: assessmentPackage.sessionId,
      generatedAt: new Date(),
      
      executiveQuestion: question,
      contextSnapshot: question.decisionContext?.currentState || 'N/A',
      
      assessments: assessmentPackage,
      
      conflictsIdentified: conflicts,
      optionsConsidered: options,
      tradeoffs: tradeoffs,
      risks: this.aggregateRisks(assessmentPackage),
      
      expectedOutcomes: [],
      
      reviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      institutionalMemory: 'Simulação inicial - Aguardando deliberação humana.'
    };
  }

  private static aggregateRisks(pkg: TechnicalAssessmentPackage): RiskItem[] {
    const risks: RiskItem[] = [];
    let idCounter = 1;

    const extract = (assessment?: any) => {
      if (assessment && assessment.criticalFindings) {
        assessment.criticalFindings.forEach((r: string) => {
          risks.push({
            id: `RSK-${idCounter++}`,
            description: r,
            severity: assessment.executiveState === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
            mitigation: 'Monitoramento contínuo das premissas.'
          });
        });
      }
    };

    extract(pkg.financialAssessment);
    extract(pkg.economicAssessment);
    extract(pkg.cashAssessment);

    return risks;
  }
}
