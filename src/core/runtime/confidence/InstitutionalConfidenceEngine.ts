export type ConfidenceClassification = 'HIGH_CONFIDENCE' | 'MODERATE_CONFIDENCE' | 'LOW_CONFIDENCE';

export interface ConfidenceAssessment {
  classification: ConfidenceClassification;
  score: number;
  rationale: string;
}

export class InstitutionalConfidenceEngine {
  static evaluate(
    hasBP: boolean,
    hasDFC: boolean,
    historicoCiclos: number,
    isChartOfAccountsSimplified: boolean,
    hasAuditErrors: boolean
  ): ConfidenceAssessment {
    let score = 0;
    const rationales: string[] = [];

    // 1. Completude dos Dados (Peso: 25%)
    if (!isChartOfAccountsSimplified) {
      score += 25;
      rationales.push('Plano de contas detalhado fornece excelente completude.');
    } else {
      rationales.push('Plano de contas simplificado reduz a granularidade da análise.');
    }

    // 2. Consistência Contábil (Peso: 25%)
    if (!hasAuditErrors) {
      score += 25;
      rationales.push('Sem divergências contábeis matemáticas ou estruturais primárias.');
    } else {
      rationales.push('Foram detectadas divergências na validação de auditoria interna.');
    }

    // 3. Histórico Disponível (Peso: 20%)
    if (historicoCiclos >= 3) {
      score += 20;
      rationales.push('Série histórica longa (>= 3 anos) permite previsibilidade de tendência.');
    } else if (historicoCiclos === 2) {
      score += 10;
      rationales.push('Histórico limitado (apenas 1 ano base) restringe análise de longo horizonte.');
    } else {
      rationales.push('Ausência de histórico comparável impede validação de evolução estrutural.');
    }

    // 4. Reconciliação com BP (Peso: 15%)
    if (hasBP) {
      score += 15;
      rationales.push('Estrutura de capital patrimonial (BP) disponível para cruzamento fiduciário.');
    } else {
      rationales.push('Falta validação patrimonial direta via Balanço Patrimonial.');
    }

    // 5. Reconciliação com DFC (Peso: 15%)
    if (hasDFC) {
      score += 15;
      rationales.push('Validação transacional garantida pela presença da DFC.');
    } else {
      rationales.push('Falta reconciliação explícita de caixa operacional (DFC).');
    }

    let classification: ConfidenceClassification = 'LOW_CONFIDENCE';
    let rationale = '';

    if (score > 80) {
      classification = 'HIGH_CONFIDENCE';
      rationale = 'Alto grau de confiança nas conclusões geradas: os dados estão completos, reconciliados com múltiplas demonstrações e sustentados por histórico confiável.';
    } else if (score >= 60) {
      classification = 'MODERATE_CONFIDENCE';
      rationale = 'Grau moderado de confiança: embora haja rastreabilidade base razoável, faltam componentes cruzados (ex: histórico limitado, simplificações). Recomenda-se leitura cautelosa.';
    } else {
      classification = 'LOW_CONFIDENCE';
      rationale = 'Baixa confiabilidade: premissas dependem de inputs fragmentados ou inconsistentes. Não utilizar este relatório para aprovação de crédito ou M&A sem due diligence contábil.';
    }

    return {
      classification,
      score,
      rationale
    };
  }
}
