import { StructuralCapitalSeverity } from './types';

export class StructuralAdvisoryPriorityEngine {
  /**
   * Reordena as prioridades executivas baseadas na severidade estrutural detectada.
   * Quando a severidade é alta ou crítica, prioriza sobrevivência e reestruturação de capital,
   * deferindo recomendações de otimização genérica (ex: ROCE, dividendos).
   */
  static reprioritize(
    severity: StructuralCapitalSeverity,
    originalActionMatrix: string[]
  ): string[] {
    if (severity !== 'HIGH' && severity !== 'CRITICAL') {
      return originalActionMatrix; // Não reordena se não houver severidade estrutural alta
    }

    // Prepend items para crise estrutural
    const structuralPriorities = [
      'Reequilibrar capital operacional: reduzir aprisionamento em ciclo',
      'Reduzir dependência de financiamento operacional por fornecedores',
      'Melhorar cobertura de caixa imediato sobre passivo circulante',
      'Revisar política de transações com partes relacionadas (sócios)',
      'Otimizar conversão de estoque em liquidez imediata'
    ];

    // Defer items (jogar para o final ou remover)
    const deferredKeywords = [
      'Maximizar ROCE',
      'Políticas de dividendos',
      'Dividendos',
      'Otimizar SG&A',
      'ROIC',
      'Expansão'
    ];

    const retainedOriginals = originalActionMatrix.filter(action => {
      // Retém as que NÃO são da lista de adiamento
      return !deferredKeywords.some(keyword => action.includes(keyword));
    });

    const deferredOriginals = originalActionMatrix.filter(action => {
      return deferredKeywords.some(keyword => action.includes(keyword));
    });

    // Constroi a nova matriz
    // Pega as prioridades estruturais, junta com o que sobrou das originais,
    // e no final junta as deferidas se ainda precisarem aparecer.
    return [
      ...structuralPriorities,
      ...retainedOriginals,
      ...deferredOriginals
    ];
  }
}
