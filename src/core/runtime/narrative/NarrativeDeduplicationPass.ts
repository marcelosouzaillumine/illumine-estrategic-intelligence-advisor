export const NarrativeDeduplicationPass = {
  clean(narrative: string): string {
    let cleaned = narrative;

    // 1. Remover redundâncias lexicais exatas/estruturais
    cleaned = cleaned.replace(/fase de operação em estruturação/gi, 'fase de estruturação operacional');
    cleaned = cleaned.replace(/fase de operação madura/gi, 'fase de maturação operacional');
    cleaned = cleaned.replace(/fase de operação inicial/gi, 'fase inicial de operação');

    // 2. Resolver duplicação de contexto sobre histórico
    // Se a narrativa já cita limitações por ser apenas um exercício, limpar qualquer outro residual do runtime.
    if (cleaned.includes('Como há apenas um exercício financeiro disponível') || cleaned.includes('A suficiência contextual restrita impede')) {
      cleaned = cleaned.replace(/Histórico insuficiente para análise evolutiva[^\.]*\.?/gi, '');
      cleaned = cleaned.replace(/Histórico insuficiente para inferência evolutiva[^\.]*\.?/gi, '');
      cleaned = cleaned.replace(/as análises de tendência requerem ao menos dois exercícios financeiros[^\.]*\.?/gi, '');
      cleaned = cleaned.replace(/o runtime limita inferências evolutivas[^\.]*\.?/gi, '');
    }

    // 3. Limpeza de espaços duplos
    cleaned = cleaned.replace(/\s{2,}/g, ' ').trim();

    return cleaned;
  }
};
