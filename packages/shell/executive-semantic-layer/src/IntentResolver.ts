export enum ExecutiveIntent {
  PAGE_PURPOSE = 'PAGE_PURPOSE',
  PAGE_USAGE = 'PAGE_USAGE',
  KPI_EXPLANATION = 'KPI_EXPLANATION',
  GRAPH_ANALYSIS = 'GRAPH_ANALYSIS',
  TABLE_ANALYSIS = 'TABLE_ANALYSIS',
  RISK_ANALYSIS = 'RISK_ANALYSIS',
  RECOMMENDATION = 'RECOMMENDATION',
  EXECUTIVE_SUMMARY = 'EXECUTIVE_SUMMARY',
  COMPARISON = 'COMPARISON',
  TREND = 'TREND',
  ALERT = 'ALERT',
  UNKNOWN = 'UNKNOWN'
}

export class IntentResolver {
  static resolve(query: string): ExecutiveIntent {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('função desta página') || lowerQuery.includes('para que serve') || lowerQuery.includes('funcao desta pagina') || lowerQuery.includes('o que faz esta página')) {
      return ExecutiveIntent.PAGE_PURPOSE;
    }

    if (lowerQuery.includes('como utilizar') || lowerQuery.includes('como usar esta página')) {
      return ExecutiveIntent.PAGE_USAGE;
    }
    
    if (lowerQuery.includes('significa este indicador') || lowerQuery.includes('explica este kpi') || lowerQuery.includes('o que é este indicador') || lowerQuery.includes('este kpi')) {
      return ExecutiveIntent.KPI_EXPLANATION;
    }

    if (lowerQuery.includes('risco') || lowerQuery.includes('ameaça') || lowerQuery.includes('vulnerabilidade')) {
      return ExecutiveIntent.RISK_ANALYSIS;
    }

    if (lowerQuery.includes('recomenda') || lowerQuery.includes('o que devo fazer') || lowerQuery.includes('ação') || lowerQuery.includes('acao')) {
      return ExecutiveIntent.RECOMMENDATION;
    }

    if (lowerQuery.includes('gráfico') || lowerQuery.includes('grafico') || lowerQuery.includes('chart')) {
      return ExecutiveIntent.GRAPH_ANALYSIS;
    }

    if (lowerQuery.includes('tabela')) {
      return ExecutiveIntent.TABLE_ANALYSIS;
    }

    if (lowerQuery.includes('comparar') || lowerQuery.includes('vs') || lowerQuery.includes('diferença')) {
      return ExecutiveIntent.COMPARISON;
    }

    if (lowerQuery.includes('tendência') || lowerQuery.includes('tendencia') || lowerQuery.includes('projeção') || lowerQuery.includes('futuro')) {
      return ExecutiveIntent.TREND;
    }

    if (lowerQuery.includes('resumo') || lowerQuery.includes('síntese') || lowerQuery.includes('sintese')) {
      return ExecutiveIntent.EXECUTIVE_SUMMARY;
    }

    return ExecutiveIntent.UNKNOWN;
  }
}
