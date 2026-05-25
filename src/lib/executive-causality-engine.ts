import { FinancialMetrics } from './financial-engine';
import { BusinessIdentity } from './business-identity-engine';
import { MasterCausalOutput, evaluateMasterCausality } from './master-causal-engine';

export interface CausalityNarrative {
  causa: string;
  pressao: string;
  consequencia: string;
  decisao: string;
}

export interface ExecutiveCausalityOutput {
  inferredTensions: string[];
  vulnerabilities: string[];
  financialElasticity: {
    status: 'Alta' | 'Média' | 'Baixa' | 'Crítica';
    narrative: string;
  };
  liquidityPressure: {
    status: 'Segura' | 'Atenção' | 'Severa';
    narrative: string;
  };
  structuralFragility: boolean;
  narrativeChain: CausalityNarrative;
  masterCausality?: MasterCausalOutput;
}

export function evaluateExecutiveCausality(
  metrics: FinancialMetrics,
  bpSummary: any,
  scores: any,
  identity: BusinessIdentity
): ExecutiveCausalityOutput {
  if (!metrics || !metrics.hasData) {
    return {
      inferredTensions: ['Sem dados para inferência.'],
      vulnerabilities: ['Sem dados.'],
      financialElasticity: { status: 'Crítica', narrative: 'Dados insuficientes para cálculo de elasticidade.' },
      liquidityPressure: { status: 'Severa', narrative: 'Incapacidade de leitura por ausência de métricas.' },
      structuralFragility: true,
      narrativeChain: {
        causa: 'Amostragem de dados estruturais é inexistente ou insuficiente.',
        pressao: 'Impossibilidade de aplicar modelos paramétricos ao balanço.',
        consequencia: 'A arquitetura do sistema suspende a emissão de predições financeiras.',
        decisao: 'Importar as demonstrações contábeis (DRE e Balanço) atualizadas.'
      },
      masterCausality: evaluateMasterCausality(bpSummary, metrics, identity)
    };
  }

  const masterCausality = evaluateMasterCausality(bpSummary, metrics, identity);

  const {
    liqCorrente, liquidezReal, saldoTesouraria, cgl, ncg,
    autonomiaFinanceira, ebitda, indiceDescapitalizacao,
    concentracaoEstoque, qualidadeEndividamento, dependenciaBancaria,
    margemErroOperacional
  } = metrics;

  const { passivoCirculante: pc, patrimonioLiquido: plValue, ativoCirculante: ac } = bpSummary;

  const isEroding = plValue < 0 || (indiceDescapitalizacao > 0.5 && plValue > 0);
  const isLiquidityCritical = liquidezReal < 0.5 || saldoTesouraria < 0;
  const isInventoryHeavy = concentracaoEstoque > 0.35 && identity.modeloDeNegocio?.includes('Indústria');
  const isAssetHeavy = identity.intensidadeCapital === 'Asset Heavy';
  
  // Tensões Inferidas
  const inferredTensions: string[] = [];
  if (saldoTesouraria < 0) inferredTensions.push('Deficiência aguda de tesouraria de curto prazo.');
  if (cgl < ncg) inferredTensions.push('Capital de giro próprio incapaz de suportar a necessidade operacional.');
  if (isEroding) inferredTensions.push('Deterioração corrosiva da base de patrimônio líquido.');
  if (ebitda < 0) inferredTensions.push('Operação base falhando em gerar caixa orgânico (Ebitda destrutivo).');

  if (inferredTensions.length === 0) {
    inferredTensions.push('Tensões operacionais sob controle institucional.');
  }

  // Vulnerabilidades Inferidas
  const vulnerabilities: string[] = [];
  if (dependenciaBancaria > 0.5) vulnerabilities.push('Exposição bancária e dependência estrutural de crédito elevada.');
  if (isInventoryHeavy && liqCorrente < 1) vulnerabilities.push('Inventário imobilizado travando fluxo de caixa livre.');
  if (qualidadeEndividamento > 0.7) vulnerabilities.push('Asfixia iminente por dívida concentrada no curto prazo.');
  
  if (vulnerabilities.length === 0) {
    vulnerabilities.push('Vulnerabilidades absorvidas pela resiliência do balanço.');
  }

  // Elasticidade Financeira
  let elasticityStatus: 'Alta' | 'Média' | 'Baixa' | 'Crítica' = 'Média';
  let elasticityNarrative = '';
  
  if (cgl > ncg && saldoTesouraria > 0 && ebitda > 0) {
    elasticityStatus = 'Alta';
    elasticityNarrative = 'A operação é autofinanciada, exibindo altíssima margem para absorção de choques de demanda sem risco de ruptura de caixa.';
  } else if (cgl > 0 && ebitda > 0) {
    elasticityStatus = 'Média';
    elasticityNarrative = 'O ciclo de giro tem suporte, mas choques agressivos de mercado podem pressionar rapidamente a liquidez imediata.';
  } else if (ebitda > 0 && saldoTesouraria < 0) {
    elasticityStatus = 'Baixa';
    elasticityNarrative = 'Embora a operação seja rentável (EBITDA positivo), todo o caixa está imobilizado na operação, gerando estresse na tesouraria tática.';
  } else {
    elasticityStatus = 'Crítica';
    elasticityNarrative = 'A empresa opera no limite ou abaixo da margem de sobrevivência, sem nenhuma barreira contra instabilidades ou cortes de crédito.';
  }

  // --- CAUSAL INCONSISTENCY BLOCKERS ---
  // Se a Master Causal Engine bloqueou 'Estabilidade Elevada' ou 'Resiliência Alta', não podemos ter elasticidade Alta
  if (masterCausality.blockedNarratives.includes('Estabilidade Elevada') || masterCausality.blockedNarratives.includes('Resiliência Alta')) {
    if (elasticityStatus === 'Alta' || elasticityStatus === 'Média') {
      elasticityStatus = 'Baixa';
      elasticityNarrative = 'A elasticidade aparente é invalidada por pressões causais estruturais detectadas. O sistema proíbe classificação de resiliência alta sob este cenário.';
    }
  }
  if (masterCausality.scenarios.find(s => s.id === 'PRESSAO_ESTRUTURAL' || s.id === 'CORROSAO_PATRIMONIAL')) {
    elasticityStatus = 'Crítica';
    elasticityNarrative = 'Risco estrutural severo anula qualquer folga temporária. ' + masterCausality.scenarios.map(s => s.description).join(' ');
  }
  // ------------------------------------

  // Pressão de Liquidez
  let liquidityPressure: 'Segura' | 'Atenção' | 'Severa' = 'Atenção';
  let liquidityNarrative = '';
  if (liquidezReal > 1.0 && saldoTesouraria > (ac * 0.1)) {
    liquidityPressure = 'Segura';
    liquidityNarrative = 'Robustez garantida no horizonte de curtíssimo prazo com folga em tesouraria.';
  } else if (isLiquidityCritical) {
    liquidityPressure = 'Severa';
    liquidityNarrative = 'Severa insuficiência para cobrir o passivo circulante exigível, apontando possível ruptura sistêmica de pagamentos no curto prazo.';
  } else {
    liquidityPressure = 'Atenção';
    liquidityNarrative = 'Margem de segurança apertada exigindo sincronização contínua entre recebíveis e fornecedores.';
  }

  // Fragilidade Estrutural
  const structuralFragility = plValue < 0 || (ebitda < 0 && liquidezReal < 0.5);

  // Cadeia Narrativa: CAUSA -> PRESSÃO -> CONSEQUÊNCIA -> DECISÃO
  const narrativeChain: CausalityNarrative = { causa: '', pressao: '', consequencia: '', decisao: '' };

  if (structuralFragility) {
    narrativeChain.causa = ebitda < 0 
      ? 'A operação central falha cronicamente em gerar caixa, validando uma erosão de margens de longo prazo.' 
      : 'As obrigações financeiras corroeram completamente a base histórica de capital (Insolvência Técnica).';
    
    narrativeChain.pressao = 'Isso elimina qualquer elasticidade da tesouraria e asfixia inteiramente o capital de giro mínimo de sobrevivência.';
    
    narrativeChain.consequencia = 'O ecossistema se sustenta exclusivamente sobre rolagem forçada de dívidas e suprime agressivamente a continuidade da empresa.';
    
    narrativeChain.decisao = 'É mandatória a injeção emergencial de capital primário ou execução de turnaround de reestruturação absoluta das despesas e passivos, protegendo o *core* operacional.';

  } else if (isLiquidityCritical) {
    narrativeChain.causa = cgl < ncg 
      ? 'Desalinhamento crítico entre a necessidade de investir na operação e o capital de giro próprio disponível.' 
      : 'Capital imobilizado excessivamente (estoques morosos ou ativos), esvaziando as disponibilidades imediatas.';
      
    narrativeChain.pressao = 'O ciclo restrito força captações de crédito rotativo caro (bancário) constante apenas para garantir folha e fornecedores no mês vigente.';
    
    narrativeChain.consequencia = 'Esse ciclo destrói a margem líquida através de despesas financeiras, arrastando um modelo de negócio saudável para risco insolvente progressivo.';
    
    narrativeChain.decisao = 'Reperfilamento tático de passivos de curto para longo prazo e liquidação sumária de estoques de baixo giro (monetização imediata).';

  } else if (isEroding && ebitda > 0) {
    narrativeChain.causa = 'Carga financeira histórica passada pesando fortemente sobre o balanço de patrimônio, ainda que a operação mensal já seja rentável.';
    narrativeChain.pressao = 'A empresa precisa dedicar uma fatia desproporcional do caixa gerado (EBITDA) para amortizar o serviço da dívida pregressa.';
    narrativeChain.consequencia = 'Drena-se o fluxo de caixa para expansão, dificultando a recuperação total do patrimônio líquido e limitando o crescimento acelerado do negócio.';
    narrativeChain.decisao = 'Manter austeridade, focar a geração de caixa no pagamento dos credores-chave e renegociar spreads para acelerar a proteção de margem residual.';

  } else if (elasticityStatus === 'Alta') {
    narrativeChain.causa = 'A combinação de geração positiva de EBITDA com excelente eficiência no ciclo de conversão (NCG coberto com sobras).';
    narrativeChain.pressao = 'O sistema não enfrenta atritos restritivos em tesouraria, liberando as lideranças da gestão passiva de urgências de caixa.';
    narrativeChain.consequencia = 'A companhia atinge o estágio ótimo de maturidade de capital, acumulando reservas que a blindam contra choques de mercado ou inadimplências sistêmicas.';
    narrativeChain.decisao = 'Ativar política de alocação de capital ofensiva, estudando M&A, novos projetos de CAPEX ou dividendos agressivos, preservando a base mínima operacional.';
  } else {
    // Estabilidade Moderada
    narrativeChain.causa = 'A estrutura operacional roda ajustada ao mercado, com EBITDA adequado, porém com alinhamento restrito entre Ativo Circulante e Obrigações.';
    narrativeChain.pressao = 'O balanço atende às exigências vigentes, exigindo gestão constante e prudencial para evitar que descasamentos eventuais gerem déficit de giro.';
    narrativeChain.consequencia = 'A estabilidade sustenta a operação, mas oferece baixo poder de absorção para uma expansão acelerada sem consumir as linhas protetivas do caixa.';
    narrativeChain.decisao = 'Focar em micro-otimizações (ex: extensão de prazo com fornecedores e melhoria na cobrança) para elevar gradualmente a eficiência institucional sem riscos desnecessários.';
  }

  return {
    inferredTensions,
    vulnerabilities,
    financialElasticity: { status: elasticityStatus, narrative: elasticityNarrative },
    liquidityPressure: { status: liquidityPressure, narrative: liquidityNarrative },
    structuralFragility,
    narrativeChain,
    masterCausality
  };
}
