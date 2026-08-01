import { ExecutiveDiagnosis } from '../contracts/ExecutiveDiagnosis';
import { NarrativeBlock } from '../contracts/ExecutiveEvidencePackage';

export class ExecutiveNarrativeRenderer {
  /**
   * Traduz o diagnóstico institucional (frio, estruturado) em prosa de negócios (Narrative Blocks).
   * Não pensa, apenas renderiza as restrições e direcionamentos do ExecutiveDiagnosis.
   */
  public static render(diagnosis: ExecutiveDiagnosis): NarrativeBlock[] {
    const blocks: NarrativeBlock[] = [];

    // Bloco Principal (Condição Financeira)
    blocks.push({
      type: 'DIAGNOSIS',
      title: 'Condição Financeira Institucional',
      body: diagnosis.executiveSummary,
      confidence: 100, // Confiança na política é sempre 100%. A evidência é tratada no pacote.
      priority: diagnosis.financialState.status === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
      source: 'Executive Policy Engine',
      recommendation: `Modo de operação: ${diagnosis.decisionMode}. Foco em: ${diagnosis.primaryDriver}.`,
      evidenceRefs: [],
      validationStatus: diagnosis.financialState.evidenceIntegrity === 'REJECTED' ? 'BLOCKED' : 'VALIDATED',
      causalRelationship: true
    });

    // Bloco de Restrições (Bloqueios Ativos)
    if (diagnosis.blockedActions.length > 0) {
      blocks.push({
        type: 'MONITORING',
        title: 'Restrições Ativas de Governança',
        body: `As seguintes intenções executivas estão sob bloqueio fiduciário imediato: ${diagnosis.blockedActions.join(', ')}.`,
        confidence: 100,
        priority: 'CRITICAL',
        source: 'Decision Intent Guard',
        recommendation: 'Aderir estritamente à política de preservação de valor institucional.',
        evidenceRefs: [],
        validationStatus: diagnosis.financialState.evidenceIntegrity === 'REJECTED' ? 'BLOCKED' : 'VALIDATED',
        causalRelationship: true
      });
    }

    return blocks;
  }
}
