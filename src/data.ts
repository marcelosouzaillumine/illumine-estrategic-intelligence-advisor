export const DATA = {
  clientes: [],
  dre: [],
  indicadores: [],
  bp: [],
  caixa: [],
  fluxoCaixaDetalhado: {},
  accountPlanPadrão: [],
  premissas: {
    economicas: [],
    tributarias: {
      simplesNacional: [],
      lucroPresumido: {
        presuncao: [],
        federal: [],
        municipal: {
          aliq_min: 0,
          aliq_max: 0
        }
      },
      lucroReal: {
        modelos: [],
        federal: []
      }
    }
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
