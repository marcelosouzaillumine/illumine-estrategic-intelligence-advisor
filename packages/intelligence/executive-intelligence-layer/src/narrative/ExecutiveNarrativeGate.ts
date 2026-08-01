import { FinancialIntelligenceAssessment, NarrativePermission } from '../contracts/FinancialIntelligenceAssessment';

export class ExecutiveNarrativeGate {
  /**
   * Avalia a Inteligência Financeira e determina o nível de permissão narrativa.
   */
  public static evaluatePermission(assessment: Omit<FinancialIntelligenceAssessment, 'narrativePermission'>): NarrativePermission {
    if (assessment.integrityStatus === 'BLOCKED') {
      return 'BLOCKED';
    }

    if (
      assessment.solvency.status === 'CRITICAL' ||
      assessment.cashConversion.status === 'CRITICAL' ||
      assessment.earningsQuality.classification === 'LOW'
    ) {
      return 'RESTRICTED';
    }

    if (
      assessment.solvency.status === 'VULNERABLE' ||
      assessment.cashConversion.status === 'ATTENTION'
    ) {
      // É possível ser FULL se as outras áreas compensarem? 
      // Por governança conservadora, vamos manter RESTRICTED
      return 'RESTRICTED';
    }

    return 'FULL';
  }

  /**
   * Modifica ou restringe o bloco narrativo caso a permissão seja insuficiente.
   */
  public static interceptNarrative(
    proposedNarrative: string,
    permission: NarrativePermission,
    assessment: FinancialIntelligenceAssessment
  ): string {
    if (permission === 'BLOCKED') {
      return "Restrição Fiduciária: Diagnóstico bloqueado por inconsistências estruturais severas na base de dados financeiros. Nenhuma recomendação estratégica pode ser emitida até regularização.";
    }

    if (permission === 'RESTRICTED') {
      const risks = [];
      if (assessment.cashConversion.status === 'CRITICAL') risks.push(assessment.cashConversion.alert || 'Conversão crítica de caixa');
      if (assessment.solvency.status === 'CRITICAL') risks.push(...assessment.solvency.alerts);
      if (assessment.earningsQuality.classification === 'LOW') risks.push(...assessment.earningsQuality.drivers);

      return `⚠️ Diagnóstico Restrito: A empresa apresenta riscos iminentes de fundamento financeiro (${risks.join('; ')}). Quaisquer projeções de expansão estão condicionadas à resolução destas vulnerabilidades estruturais.`;
    }

    // FULL permission
    return proposedNarrative;
  }
}
