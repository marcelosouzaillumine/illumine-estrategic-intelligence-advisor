import { NormalizedDREPayload } from './DREExecutiveDataMapper';
import { EconomicDiagnosisOutput } from './EconomicDiagnosisEngine';

export class DREBoardAdvisoryEngine {
  public static generateSynthesis(normalizedDRE: NormalizedDREPayload, diagnosis: EconomicDiagnosisOutput): string {
    if (!normalizedDRE.netRevenue.value && normalizedDRE.netRevenue.source.startsWith('MISSING')) {
      return 'Dados insuficientes para análise executiva desta seção.';
    }

    const { primaryConstraint, recoverabilityAssessment, strategicPriority, boardOutlook } = diagnosis;
    const receitaLiquida = normalizedDRE.netRevenue.value;
    const lucroLiquido = normalizedDRE.netProfit.value;
    const margemBruta = normalizedDRE.grossMargin.value * 100;
    
    const isPrejuizo = lucroLiquido < 0;
    
    // Constrói um parágrafo executivo coeso focado na DRE
    const synthesis = `A companhia encerrou o exercício em ${isPrejuizo ? 'estágio inicial de estruturação operacional' : 'estágio de geração operacional'}, apresentando receita líquida de R$ ${(receitaLiquida/1000).toFixed(1).replace('.', ',')} mil e ${isPrejuizo ? 'prejuízo líquido' : 'lucro líquido'} de R$ ${(Math.abs(lucroLiquido)/1000).toFixed(1).replace('.', ',')} mil.
Embora a margem bruta de ${margemBruta.toFixed(1).replace('.', ',')}% demonstre potencial de geração de valor na atividade principal, a principal restrição econômica identificada está ligada a: ${primaryConstraint.toLowerCase()}.
Sob a ótica de recuperabilidade, o modelo demonstra potencial de reversão ${recoverabilityAssessment.toLowerCase()}, e a prioridade estratégica para os próximos ciclos deve concentrar-se em: ${strategicPriority.toLowerCase()}.
${boardOutlook}`;
    
    return synthesis;
  }
}
