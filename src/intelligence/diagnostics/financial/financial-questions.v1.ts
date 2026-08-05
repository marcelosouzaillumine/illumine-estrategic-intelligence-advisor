import { DiagnosticQuestion } from '../core/diagnostic-contracts';

// We map options to internal maturity score approximations (0 to 100 or 1 to 5)
// Option 1 maps to Initial, Option 5 maps to Excellence.

export const FINANCIAL_QUESTIONS_V1: DiagnosticQuestion[] = [
  {
    id: 'fq_liquidity_1',
    dimensionId: 'dim_liquidity',
    type: 'single_choice',
    text: 'Como a organização monitora e projeta a disponibilidade de caixa?',
    options: [
      { id: 'opt_1', text: 'Não existe acompanhamento formal; atuamos apenas com o saldo diário.', weight: 1 },
      { id: 'opt_2', text: 'Realizamos projeções de curto prazo para garantir pagamentos do mês.', weight: 2 },
      { id: 'opt_3', text: 'Acompanhamos o fluxo de caixa de forma estruturada, com visibilidade para os próximos meses.', weight: 3 },
      { id: 'opt_4', text: 'Utilizamos indicadores de liquidez e cenários preditivos para antecipar desvios de caixa.', weight: 4 },
      { id: 'opt_5', text: 'O fluxo financeiro é totalmente integrado à estratégia, operando com modelos estocásticos e antecipação máxima.', weight: 5 }
    ]
  },
  {
    id: 'fq_profitability_1',
    dimensionId: 'dim_profitability',
    type: 'single_choice',
    text: 'Como a rentabilidade e a formação de preços são avaliadas nas operações?',
    options: [
      { id: 'opt_1', text: 'Baseamos os preços no mercado, sem clareza exata da margem interna.', weight: 1 },
      { id: 'opt_2', text: 'Avaliamos a margem bruta da empresa no final do mês através do DRE.', weight: 2 },
      { id: 'opt_3', text: 'Possuímos visão clara de rentabilidade por linha de negócio, produto ou serviço.', weight: 3 },
      { id: 'opt_4', text: 'Analisamos não apenas a rentabilidade, mas os vetores que impactam a geração de valor econômico.', weight: 4 },
      { id: 'opt_5', text: 'A gestão de valor é sistêmica; alocamos capital ativamente para maximizar o ROIC global da organização.', weight: 5 }
    ]
  },
  {
    id: 'fq_working_capital_1',
    dimensionId: 'dim_working_capital',
    type: 'single_choice',
    text: 'Como é tratada a necessidade de capital de giro (NCG) da organização?',
    options: [
      { id: 'opt_1', text: 'Não mensuramos NCG, frequentemente precisamos recorrer a bancos de última hora.', weight: 1 },
      { id: 'opt_2', text: 'Conhecemos nossos prazos médios, mas não atuamos de forma pró-ativa para otimizá-los.', weight: 2 },
      { id: 'opt_3', text: 'Acompanhamos o Ciclo de Conversão de Caixa e tentamos alinhar prazos de clientes e fornecedores.', weight: 3 },
      { id: 'opt_4', text: 'O capital de giro é otimizado ativamente através de políticas financeiras e negociações estratégicas.', weight: 4 },
      { id: 'opt_5', text: 'O ecossistema financeiro é estruturado para gerar autofinanciamento estrutural contínuo.', weight: 5 }
    ]
  },
  {
    id: 'fq_governance_1',
    dimensionId: 'dim_governance',
    type: 'single_choice',
    text: 'Quão confiáveis e tempestivas são as informações financeiras que embasam decisões?',
    options: [
      { id: 'opt_1', text: 'Muitas vezes as informações são imprecisas e os números não batem.', weight: 1 },
      { id: 'opt_2', text: 'As informações chegam consolidadas, porém com muito atraso no fechamento do mês.', weight: 2 },
      { id: 'opt_3', text: 'Os relatórios de DRE e Fluxo de Caixa são confiáveis e analisados tempestivamente pela liderança.', weight: 3 },
      { id: 'opt_4', text: 'Além da tempestividade, utilizamos dashboards dinâmicos para auditoria contínua e análise executiva.', weight: 4 },
      { id: 'opt_5', text: 'A governança dos dados financeiros é total, permitindo fechamento em tempo real (continuous accounting).', weight: 5 }
    ]
  },
  {
    id: 'fq_planning_1',
    dimensionId: 'dim_planning',
    type: 'single_choice',
    text: 'Como sua organização realiza planejamento financeiro atualmente?',
    options: [
      { id: 'opt_1', text: 'Não existe um processo estruturado de planejamento formalizado.', weight: 1 },
      { id: 'opt_2', text: 'O planejamento acontece principalmente baseado na reprodução do histórico anterior.', weight: 2 },
      { id: 'opt_3', text: 'Existe um orçamento anual (budget) periódico com acompanhamento de indicadores.', weight: 3 },
      { id: 'opt_4', text: 'Cenários alternativos são utilizados ativamente (forecast) para apoiar o recálculo de rotas.', weight: 4 },
      { id: 'opt_5', text: 'A organização utiliza modelos preditivos e rolling-forecasts integrados a todo o S&OP.', weight: 5 }
    ]
  }
];
