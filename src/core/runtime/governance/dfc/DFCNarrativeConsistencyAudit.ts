import { ShareholderDependencyStatus } from './CashFlowGovernanceOutput';

export class DFCNarrativeConsistencyAudit {
  static evaluate(
    fco: number,
    dependencyStatus: ShareholderDependencyStatus,
    divergenceExplanation: string | null
  ): { summary: string; primaryRecommendation: string } {
    
    let summary = '';
    let recommendation = '';

    // 1. Geração de Caixa Saudável
    if (fco > 0 && dependencyStatus === 'AUTOSSUFICIENTE') {
      summary = `A operação comprova autossuficiência fiduciária, gerando caixa operacional positivo (R$ ${fco.toFixed(2)}) e sustentando suas atividades sem necessidade de captação ou aportes societários adicionais.`;
      recommendation = `Preservar a eficiência do capital de giro e direcionar o excedente de caixa livre para expansão estratégica, amortização de passivos caros ou distribuição estruturada de dividendos.`;
    } 
    // 2. Dependência Crítica
    else if (dependencyStatus === 'DEPENDENCIA_CRITICA') {
      summary = `A operação consome caixa livre severamente e demonstra dependência crítica de aportes dos sócios para fechamento da demonstração. O capital societário está sendo direcionado para cobrir gargalos operacionais e não para fomento de valor.`;
      recommendation = `Congelar qualquer expansão estrutural que exija consumo adicional de caixa. O foco imediato deve ser a reestruturação da margem operacional e otimização do ciclo de conversão de caixa antes de novas rodadas de capitalização.`;
    }
    // 3. Dependência Relevante/Moderada
    else if (dependencyStatus === 'DEPENDENCIA_RELEVANTE' || dependencyStatus === 'DEPENDENCIA_MODERADA') {
      summary = `A operação não consegue se sustentar exclusivamente com geração interna de caixa, exigindo financiamento parcial externo ou societário. O modelo atual drena liquidez em ritmo moderado.`;
      recommendation = `Mapear e neutralizar os gargalos de capital de giro (contas a receber e estoques). Reduzir a dependência estrutural dos sócios escalonando gradativamente o retorno ao ponto de equilíbrio de caixa (breakeven operacional).`;
    }
    // 4. Fallback
    else {
      summary = `A operação gerou fluxo operacional de R$ ${fco.toFixed(2)}. Análise adicional é requerida para atestar a qualidade dessa geração.`;
      recommendation = `Monitorar as linhas de variação de capital de giro para garantir a sustentabilidade estrutural do caixa.`;
    }

    // Append explainable divergence if exists
    if (divergenceExplanation) {
      summary += `\n\n[Alerta de Divergência]: ${divergenceExplanation}`;
    }

    return { summary, primaryRecommendation: recommendation };
  }
}
