export const healthyFixture = {
  driverSecundario1Text: 'Aumento de ticket médio em clientes B2B',
  driverSecundario2Text: 'Redução de inadimplência em 5%',
  outlookAnalysis: 'A projeção de caixa para os próximos 6 meses é favorável com crescimento orgânico',
  primaryDriverAnalysis: 'Adoção massiva do novo produto X',
  priorityRecommendation: 'Investir em marketing digital para escalar o novo produto',
  strategicPriority: 'Expansão de mercado (Market Share)',
  summaryAnalysis: 'O resultado consolidado demonstra forte liquidez',
  hasDivergence: false,
  divergenceText: ''
};

export const criticalFixture = {
  driverSecundario1Text: 'Atraso na entrega de insumos',
  driverSecundario2Text: 'Aumento do custo da dívida',
  outlookAnalysis: 'Risco de ruptura de caixa no próximo trimestre devido a vencimentos',
  primaryDriverAnalysis: 'Queda na margem bruta motivada por câmbio',
  priorityRecommendation: 'Renegociar prazos com fornecedores e travar câmbio',
  strategicPriority: 'Sobrevivência Financeira',
  summaryAnalysis: 'Alerta vermelho para a operação principal',
  hasDivergence: false,
  divergenceText: ''
};

export const longTextFixture = {
  driverSecundario1Text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(5),
  driverSecundario2Text: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '.repeat(5),
  outlookAnalysis: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. '.repeat(5),
  primaryDriverAnalysis: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. '.repeat(5),
  priorityRecommendation: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. '.repeat(5),
  strategicPriority: 'Strategic Priority Long Text '.repeat(5),
  summaryAnalysis: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. '.repeat(5),
  hasDivergence: false,
  divergenceText: ''
};

export const recalculatingFixture = {
  ...healthyFixture,
  hasDivergence: true,
  divergenceText: 'Recalculando os componentes devido a divergência no período selecionado. Por favor, aguarde.'
};
