import { formatCurrency } from './utils';

export interface DreMetrics {
  recLiquida: number;
  lucroBruto: number;
  pontoEquilibrio: number;
  gapEquilibrio: number;
  indiceCoberturaOperacional: number;
  margemSegurancaValor: number;
  cmvVal: number;
  cmvCritical: number;
  cmvLabel: string;
  capacidadeAbsorcaoEstrutura: number;
  margemOperacional: number;
  margemLiquida: number;
  indiceDespesasAdministrativas: number;
  indiceDespesasFinanceiras: number;
  breakEvenDays: number;
  indiceConversaoOperacional: number;
  ebitda: number;
  recGrowth: number;
  ebitdaGrowth: number;
  internalAuditErrors: string[];
}

export function generateDreInsights(metrics: DreMetrics) {
  const {
    recLiquida,
    lucroBruto,
    pontoEquilibrio,
    gapEquilibrio,
    indiceCoberturaOperacional,
    margemSegurancaValor,
    cmvVal,
    cmvCritical,
    cmvLabel,
    capacidadeAbsorcaoEstrutura,
    margemOperacional,
    margemLiquida,
    indiceDespesasAdministrativas,
    indiceDespesasFinanceiras,
    breakEvenDays,
    indiceConversaoOperacional,
    ebitda,
    recGrowth,
    ebitdaGrowth,
    internalAuditErrors
  } = metrics;

  // 1. PERFORMANCE NOTE
  let performanceNote = "Aguardando dados para análise operacional estrutural.";
  if (recLiquida > 0 && pontoEquilibrio > 0) {
    if (recLiquida < pontoEquilibrio) {
      performanceNote = `Risco Estrutural Identificado: A operação não absorve o seu ponto de equilíbrio (${formatCurrency(pontoEquilibrio)}). Existe um gap de geração operacional na ordem de ${formatCurrency(Math.abs(gapEquilibrio))}, caracterizando um déficit de capacidade de absorção da estrutura instalada. A operação sustenta apenas ${indiceCoberturaOperacional.toFixed(2)}% do necessário para o break-even.`;
    } else {
      performanceNote = `A operação demonstra sustentabilidade estrutural, superando o ponto de equilíbrio (${formatCurrency(pontoEquilibrio)}) e gerando uma capacidade de absorção positiva. A geração operacional absorveu a estrutura existente com margem de segurança efetiva de ${formatCurrency(margemSegurancaValor)} no período.`;
    }
  }

  // 2. SCALE EFFICIENCY INTELLIGENCE
  let scaleCategory = 'Análise Inicial';
  let scaleColor = 'text-slate-400';
  
  if (recGrowth > 0 && ebitdaGrowth > recGrowth) {
      scaleCategory = 'Crescimento Saudável';
      scaleColor = 'text-emerald-400';
  } else if (recGrowth > 0 && ebitdaGrowth > 0 && ebitdaGrowth <= recGrowth) {
      scaleCategory = 'Absorção de Estrutura';
      scaleColor = 'text-blue-400';
  } else if (recGrowth > 0 && ebitdaGrowth < 0) {
      scaleCategory = 'Crescimento Destrutivo';
      scaleColor = 'text-rose-400';
  } else if (recGrowth <= 0 && ebitdaGrowth < 0) {
      scaleCategory = 'Destruição de Valor';
      scaleColor = 'text-red-500';
  } else if (recGrowth < 0 && ebitdaGrowth > 0) {
      scaleCategory = 'Eficiência sob Retração';
      scaleColor = 'text-amber-400';
  }

  // 3. SYSTEM ALERTS
  const systemAlerts = [];
  internalAuditErrors.forEach(err => {
     systemAlerts.push({ type: 'danger', msg: err });
  });

  if (recLiquida > 0) {
      if (recLiquida < pontoEquilibrio) systemAlerts.push({ type: 'warning', msg: 'Escala Insuficiente: Faturamento abaixo do ponto de equilíbrio contábil.' });
      if (margemOperacional < 0) systemAlerts.push({ type: 'danger', msg: 'Operação Sensível: Margem Operacional destruindo valor.' });
      if (capacidadeAbsorcaoEstrutura < 1) systemAlerts.push({ type: 'warning', msg: 'Estrutura Pressionada: Incapacidade de absorver despesas fixas atuais.' });
      if (indiceDespesasFinanceiras > 10) systemAlerts.push({ type: 'warning', msg: 'Pressão Administrativa Elevada e dependência de capital externo.' });
  }

  // 4. SMART INSIGHTS
  const smartInsights = [];
  if (recLiquida > 0) {
      const margemBrutaVal = (lucroBruto / recLiquida) * 100;
      
      let problemaPrincipal = '';
      let problemaSecundario = '';
      let potencial = '';
      let risco = '';
      let recomendacao = '';

      if (cmvVal > cmvCritical) {
         problemaPrincipal = `Custo do produto/serviço (${cmvLabel}) em patamar crítico (${cmvVal.toFixed(2)}%), esmagando a margem de contribuição.`;
         recomendacao = `Revisar precificação imediatamente ou renegociar contratos de fornecimento base.`;
      } else if (capacidadeAbsorcaoEstrutura < 1) {
         problemaPrincipal = `Baixa absorção da estrutura administrativa. A operação atual não paga os custos fixos.`;
         recomendacao = `Ampliar escala comercial sem crescimento proporcional da estrutura fixa.`;
      } else if (margemOperacional < 0) {
         problemaPrincipal = `Operação em prejuízo operacional, consumindo o caixa gerado.`;
         recomendacao = `Revisar eficiência do núcleo operacional e cortar despesas fixas não-essenciais.`;
      } else if (margemOperacional > 0 && margemLiquida < 0) {
         problemaPrincipal = `A operação core é lucrativa, mas o alto peso de despesas financeiras destrói o resultado líquido.`;
         recomendacao = `Priorizar reestruturação de dívidas e substituição por captação mais barata.`;
      } else {
         problemaPrincipal = `Nenhum gargalo primário crítico identificado.`;
         recomendacao = `Focar em expansão de market-share e proteção de margem.`;
      }

      if (indiceDespesasAdministrativas > 20 && capacidadeAbsorcaoEstrutura >= 1) {
         problemaSecundario = `Pressão administrativa moderada, consumindo parcela considerável da margem.`;
      } else if (breakEvenDays > 365) {
         problemaSecundario = `Escala operacional insuficiente para cobertura dos custos fixos anuais.`;
      } else if (margemBrutaVal < 20) {
         problemaSecundario = `Margem bruta baixa restringe o poder de reinvestimento.`;
      } else {
         problemaSecundario = `Operação rodando com gargalos secundários sob controle.`;
      }

      if (margemBrutaVal > 30) {
         potencial = `A margem bruta permanece forte (${margemBrutaVal.toFixed(2)}%), indicando alta eficiência no núcleo da atividade.`;
      } else if (indiceConversaoOperacional > 50) {
         potencial = `Excelente conversão de resultados em caixa operacional.`;
      } else {
         potencial = `Modelo de negócio com margens apertadas necessitando volume para gerar caixa.`;
      }

      if (capacidadeAbsorcaoEstrutura < 1) {
         risco = `A permanência do atual volume operacional pode pressionar o caixa no curto/médio prazo.`;
      } else if (indiceDespesasFinanceiras > 10) {
         risco = `Exposição elevada ao risco de juros e dependência contínua de alavancagem externa.`;
      } else {
         risco = `Risco estrutural baixo. A operação se sustenta de forma autônoma.`;
      }

      smartInsights.push({ category: 'Problema Principal', text: problemaPrincipal, color: 'text-rose-600', bg: 'bg-rose-100', dot: 'bg-rose-500' });
      smartInsights.push({ category: 'Problema Secundário', text: problemaSecundario, color: 'text-amber-600', bg: 'bg-amber-100', dot: 'bg-amber-500' });
      smartInsights.push({ category: 'Potencial Operacional', text: potencial, color: 'text-emerald-600', bg: 'bg-emerald-100', dot: 'bg-emerald-500' });
      smartInsights.push({ category: 'Risco Estrutural', text: risco, color: 'text-rose-400', bg: 'bg-rose-50 border border-rose-100', dot: 'bg-rose-400' });
      smartInsights.push({ category: 'Recomendação Estratégica', text: recomendacao, color: 'text-blue-600', bg: 'bg-blue-100', dot: 'bg-blue-500' });
  }

  return {
    performanceNote,
    scaleCategory,
    scaleColor,
    systemAlerts,
    smartInsights
  };
}
