export const DATA: any = {
  clientes: [] as any[],
  dre: [] as any[],
  indicadores: [] as any[],
  bp: [] as any[],
  caixa: [] as any[],
  fluxoCaixaDetalhado: {} as any,
  accountPlanPadrão: [] as any[],
  premissas: {
    tributarias: {
      simplesNacional: [
        { 
          anexo: 'I (Comércio)', 
          descricao: 'Empresas de comércio (lojas, varejo, etc.)',
          faixas: [
            { ate: 180000, aliq: 0.04, deducao: 0 },
            { ate: 360000, aliq: 0.073, deducao: 5940 },
            { ate: 720000, aliq: 0.095, deducao: 13860 },
            { ate: 1800000, aliq: 0.107, deducao: 22500 },
            { ate: 3600000, aliq: 0.143, deducao: 87300 },
            { ate: 4800000, aliq: 0.19, deducao: 378000 }
          ]
        },
        { 
          anexo: 'II (Indústria)', 
          descricao: 'Indústrias e fábricas em geral',
          faixas: [
            { ate: 180000, aliq: 0.045, deducao: 0 },
            { ate: 360000, aliq: 0.078, deducao: 5940 },
            { ate: 720000, aliq: 0.10, deducao: 13860 },
            { ate: 1800000, aliq: 0.112, deducao: 22500 },
            { ate: 3600000, aliq: 0.147, deducao: 85500 },
            { ate: 4800000, aliq: 0.30, deducao: 720000 }
          ]
        },
        { 
          anexo: 'III (Serviços)', 
          descricao: 'Locação de bens móveis, serviços de creche, agências de viagem, escritórios contábeis, medicina, etc.',
          fatorR: 'Aplicável: Se Fator R >= 28%, tributa por este anexo. Caso contrário, Anexo V.',
          faixas: [
            { ate: 180000, aliq: 0.06, deducao: 0 },
            { ate: 360000, aliq: 0.112, deducao: 9360 },
            { ate: 720000, aliq: 0.135, deducao: 17640 },
            { ate: 1800000, aliq: 0.16, deducao: 35640 },
            { ate: 3600000, aliq: 0.21, deducao: 125640 },
            { ate: 4800000, aliq: 0.33, deducao: 648000 }
          ]
        },
        { 
          anexo: 'IV (Serviços)', 
          descricao: 'Construção civil, serviços de vigilância, limpeza, advocacia, etc.',
          obs: 'Não inclui a CPP (Contribuição Patronal Previdenciária) na guia do Simples.',
          faixas: [
            { ate: 180000, aliq: 0.045, deducao: 0 },
            { ate: 360000, aliq: 0.09, deducao: 8100 },
            { ate: 720000, aliq: 0.102, deducao: 12420 },
            { ate: 1800000, aliq: 0.14, deducao: 39780 },
            { ate: 3600000, aliq: 0.22, deducao: 183780 },
            { ate: 4800000, aliq: 0.33, deducao: 828000 }
          ]
        },
        { 
          anexo: 'V (Serviços)', 
          descricao: 'Auditoria, jornalismo, tecnologia, publicidade, engenharia, etc.',
          fatorR: 'Aplicável: Se Fator R < 28%, tributa por este anexo. Caso contrário, Anexo III.',
          faixas: [
            { ate: 180000, aliq: 0.155, deducao: 0 },
            { ate: 360000, aliq: 0.18, deducao: 4500 },
            { ate: 720000, aliq: 0.195, deducao: 9900 },
            { ate: 1800000, aliq: 0.205, deducao: 17100 },
            { ate: 3600000, aliq: 0.23, deducao: 62100 },
            { ate: 4800000, aliq: 0.305, deducao: 540000 }
          ]
        }
      ],
      lucroPresumido: {
        presuncao: [
          { atividade: 'Revenda de Combustíveis (Gasolina e Diesel)', irpj: 0.016, csll: 0.12 },
          { atividade: 'Venda de produtos / Mercadorias', irpj: 0.08, csll: 0.12 },
          { atividade: 'Atividades imobiliárias (Loteamento, incorporação)', irpj: 0.08, csll: 0.12 },
          { atividade: 'Serviços de transporte (exceto de carga)', irpj: 0.16, csll: 0.12 },
          { atividade: 'Serviços de transporte de carga', irpj: 0.08, csll: 0.12 },
          { atividade: 'Serviços Hospitalares e Auxiliares de Diagnóstico', irpj: 0.08, csll: 0.12 },
          { atividade: 'Serviços em Geral (Profissões Regulamentadas)', irpj: 0.32, csll: 0.32 },
          { atividade: 'Intermediação de Negócios', irpj: 0.32, csll: 0.32 },
          { atividade: 'Administração, locação ou cessão de bens e direitos', irpj: 0.32, csll: 0.32 }
        ],
        federal: [
          { imposto: 'IRPJ', base: 0.32, aliq: 0.15 },
          { imposto: 'CSLL', base: 0.32, aliq: 0.09 },
          { imposto: 'PIS', base: 1.0, aliq: 0.0065 },
          { imposto: 'COFINS', base: 1.0, aliq: 0.03 }
        ],
        municipal: { imposto: 'ISS', aliq_min: 0.02, aliq_max: 0.05 }
      },
      lucroReal: {
        modelos: [
          {
            nome: 'Não Cumulativo',
            descricao: 'Regra geral para empresas do Lucro Real. Permite o desconto de créditos sobre insumos, energia, aluguéis, etc.',
            pis: 0.0165,
            cofins: 0.076,
            obs: 'Crédito permitido sobre aquisições.'
          },
          {
            nome: 'Cumulativo',
            descricao: 'Aplicável a exceções específicas (ex: receitas de telemarketing, transporte de passageiros, etc.)',
            pis: 0.0065,
            cofins: 0.03,
            obs: 'Sem direito a crédito sobre insumos.'
          },
          {
            nome: 'Híbrido (Misto)',
            descricao: 'Quando a empresa possui receitas tributadas em ambos os regimes (cumulativo e não cumulativo).',
            pis: 'Variável',
            cofins: 'Variável',
            obs: 'Exige segregação de receitas e créditos.'
          }
        ],
        federal: [
          { imposto: 'IRPJ', aliq: 0.15, adicional: 0.10, teto_mensal: 20000, base: 'Lucro Líquido Ajustado' },
          { imposto: 'CSLL', aliq: 0.09, base: 'Lucro Líquido Ajustado' }
        ]
      }
    },
    economicas: [
      { 
        categoria: 'Taxas de Juros e Política Monetária',
        fonte: 'BCB - Histórico de Taxas',
        url: 'https://www.bcb.gov.br/controleinflacao/historicotaxasjuros',
        historico: [
          { data: 'Nov/25', valor: 14.25 },
          { data: 'Jan/26', valor: 14.50 },
          { data: 'Mar/26', valor: 14.65 },
          { data: 'Mai/26', valor: 14.65 }
        ],
        indicadores: [
          { nome: 'Taxa Selic Vigente', valor: '14.50% a.a.', status: 'Estável', obs: 'Referência: Maio/2026' },
          { nome: 'Meta Selic (Próximo Período)', valor: '14.50% a.a.', status: 'Expectativa de Manutenção', obs: 'Expectativa Copom Focus' },
          { nome: 'CDI Over', valor: '14.40% a.a.', status: 'Sincronizado', obs: 'Média de mercado' }
        ]
      },
      { 
        categoria: 'Tesouro Direto (Rendimento de Títulos)',
        fonte: 'Tesouro Nacional',
        url: 'https://tesourodireto.com.br/produtos/dados-sobre-titulos/rendimento-dos-titulos',
        indicadores: [
          { nome: 'Tesouro Selic 2029', valor: 'Selic + 0.16%', status: 'Alta Demanda', obs: 'Taxa indicativa' },
          { nome: 'Tesouro IPCA+ 2035', valor: '6.22% + IPCA', status: 'Rendimento Real', obs: 'Proteção IPC' },
          { nome: 'Tesouro Prefixado 2026', valor: '11.12% a.a.', status: 'Vencimento Próximo', obs: 'Garantido no vencimento' }
        ]
      },
      { 
        categoria: 'Inflação e Metas (BCB)',
        fonte: 'BCB - Metas de Inflação',
        url: 'https://www.bcb.gov.br/controleinflacao/metainflacao',
        indicadores: [
          { nome: 'Meta de Inflação 2026', valor: '3.00%', status: 'Vigente', obs: 'CMN' },
          { nome: 'Intervalo de Tolerância', valor: '+/- 1.50%', status: 'Vigente', obs: 'Limite Superior: 4.5%' },
          { nome: 'IPCA Esperado (Focus)', valor: '4.39%', status: 'Alinhado', obs: 'Acumulado 12 meses' }
        ]
      },
      { 
        categoria: 'Dados FGV CEQEF (Database)',
        fonte: 'FGV IBRE - CEQEF',
        url: 'https://ceqef.fgv.br/banco-de-dados',
        indicadores: [
          { nome: 'Equity Risk Premium (ERP)', valor: '8.19%', status: 'Atualizado', obs: 'Ref: Fevereiro/2026' },
          { nome: 'IGP-M (Acumulado Mensal)', valor: '0.89%', status: 'Alta', obs: 'Ref: Maio/2026' },
          { nome: 'ICE (Clima Econômico)', valor: '96.2 pts', status: 'Recuperação', obs: 'Ref: Abril/2026' },
          { nome: 'IE (Expectativas)', valor: '98.9 pts', status: 'Otimista', obs: 'Ref: Maio/2026' }
        ]
      },
      { 
        categoria: 'Câmbio e Moedas Estrangeiras',
        fonte: 'Mercado Financeiro (Fechamento Comercial)',
        url: 'https://www.infomoney.com.br/ferramentas/cambio/',
        historico: [
          { data: 'Mai/21', valor: 5.23, label: 'Dólar' },
          { data: 'Nov/21', valor: 5.61, label: 'Dólar' },
          { data: 'Mai/22', valor: 4.80, label: 'Dólar' },
          { data: 'Nov/22', valor: 5.31, label: 'Dólar' },
          { data: 'Mai/23', valor: 4.98, label: 'Dólar' },
          { data: 'Nov/23', valor: 4.85, label: 'Dólar' },
          { data: 'Mai/24', valor: 5.07, label: 'Dólar' },
          { data: 'Nov/24', valor: 5.48, label: 'Dólar' },
          { data: 'Mai/25', valor: 5.25, label: 'Dólar' },
          { data: 'Nov/25', valor: 5.18, label: 'Dólar' },
          { data: 'Mar/26', valor: 5.32, label: 'Dólar' },
          { data: 'Mai/26', valor: 4.9809, label: 'Dólar' }
        ],
        indicadores: [
          { nome: 'Dólar Comercial (Fechamento)', valor: 'R$ 4,9809', status: 'Estável', obs: 'Cotação Real: 14/05/2026' },
          { nome: 'Euro Comercial (Fechamento)', valor: 'R$ 5,772', status: 'Estável', obs: 'Cotação Real: 14/05/2026' },
          { nome: 'Variação Cambial Mensal', valor: '-0.45%', status: 'Alinhado', obs: 'Cenário base' }
        ]
      }
    ]
  },
  contasPagar: [],
  contasReceber: [],
  viabilidade: [],
  emprestimos: [],
  compras: [],
  posicaoFinanceira: []
};

export const modelData = {
  fileName: "Modelo_Viabilidade_v1.xlsx",
  inputs: [
    ["Premissa", "Valor", "Unidade", "Descritivo", "", "", "", ""],
    ["Crescimento Anual", 0.15, "%", "Estimativa conservadora de market share", "", "", "", ""],
    ["Taxa de Desconto (WACC)", 0.12, "%", "Custo médio ponderado de capital", "", "", "", ""],
    ["Investimento Inicial", 2500000, "R$", "Capex total para estrutura", "", "", "", ""],
    ["Imposto de Renda", 0.15, "%", "Aliquota padrão (IRPJ + Adicional)", "", "", "", ""],
    ["CSLL", 0.09, "%", "Contribuição Social sobre Lucro Líquido", "", "", "", ""],
    ["Capital de Giro (DSO)", 45, "dias", "Prazo médio de recebimento", "", "", "", ""],
    ["Inflação Projetada", 0.045, "%", "IPCA médio esperado", "", "", "", ""],
  ],
  dreAnual: {
    headers: [2026, 2027, 2028, 2029, 2030],
    rows: [
      { item: "Receita Operacional Bruta", values: [12000000, 13800000, 15870000, 18250500, 20988075] },
      { item: "Impostos s/ Faturamento", values: [-1800000, -2070000, -2380500, -2737575, -3148211] },
      { item: "Receita Líquida", values: [10200000, 11730000, 13489500, 15512925, 17839864] },
      { item: "CPV (Custos)", values: [-5100000, -5865000, -6744750, -7756463, -8919932] },
      { item: "Lucro Bruto", values: [5100000, 5865000, 6744750, 7756463, 8919932] },
      { item: "Despesas Administrativas", values: [-1200000, -1320000, -1452000, -1597200, -1756920] },
      { item: "Investimentos em Marketing", values: [-600000, -690000, -793500, -912525, -1049404] },
      { item: "EBITDA", values: [3300000, 3855000, 4499250, 5246738, 6113608] },
      { item: "Depreciação e Amortização", values: [-250000, -250000, -250000, -250000, -250000] },
      { item: "Lucro Operacional - EBIT", values: [3050000, 3605000, 4249250, 4996738, 5863608] },
      { item: "Resultado Financeiro", values: [-150000, -135000, -121500, -109350, -98415] },
      { item: "LAIR", values: [2900000, 3470000, 4127750, 4887388, 5765193] },
      { item: "Imposto de Renda / CSLL", values: [-986000, -1179800, -1403435, -1661712, -1960166] },
      { item: "Lucro Líquido", values: [1914000, 2290200, 2724315, 3225676, 3805027] },
    ]
  },
  dreMensal: {
    headers: Array.from({ length: 60 }, (_, i) => ({ mes: (i % 12) + 1, ano: 2026 + Math.floor(i / 12) })),
    rows: [
      { item: "Receita Operacional Bruta", sign: "+", values: Array.from({ length: 60 }, (_, i) => 1000000 * Math.pow(1.012, i)) },
      { item: "Custos de Venda", sign: "-", values: Array.from({ length: 60 }, (_, i) => -425000 * Math.pow(1.012, i)) },
      { item: "Margem de Contribuição", sign: "=", values: Array.from({ length: 60 }, (_, i) => 575000 * Math.pow(1.012, i)) },
      { item: "Despesas Fixas", sign: "-", values: Array.from({ length: 60 }, () => -180000) },
      { item: "EBITDA Mensal", sign: "=", values: Array.from({ length: 60 }, (_, i) => (575000 * Math.pow(1.012, i)) - 180000) },
    ]
  },
  bpAnual: {
    headers: [2026, 2027, 2028, 2029, 2030],
    rows: [
      { item: "Caixa", values: [1200000, 2800000, 4950000, 7800000, 11200000] },
      { item: "Ativos Permanentes", values: [2250000, 2000000, 1750000, 1500000, 1250000] },
      { item: "Total de Ativos", values: [3450000, 4800000, 6700000, 9300000, 12450000] },
      { item: "Empréstimos Bancários", values: [1500000, 1200000, 900000, 600000, 300000] },
      { item: "Patrimônio Líquido", values: [1950000, 3600000, 5800000, 8700000, 12150000] },
    ]
  }
};
