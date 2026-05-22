export type DreAccountType = 'SINTETICA' | 'ANALITICA' | 'RESULTADO_CALCULADO';
export type DreNatureza = 'RECEITA' | 'DEDUCAO' | 'CUSTO' | 'DESPESA' | 'DEPRECIACAO_AMORTIZACAO' | 'FINANCEIRO' | 'OUTRAS_RECEITAS_DESPESAS' | 'TRIBUTO_SOBRE_LUCRO' | 'RESULTADO';

export interface DreAccount {
  id: string;
  nome: string;
  codigo?: string;
  tipo: DreAccountType;
  natureza: DreNatureza;
  parentId: string | null;
  ordem: number;
  aceitaLancamento: boolean;
  calculaAutomaticamente: boolean;
  formula?: string;
}

export const DRE_OFFICIAL_STRUCTURE: DreAccount[] = [
  { id: "ROB", nome: "(+) Receita Operacional Bruta", tipo: "SINTETICA", natureza: "RECEITA", parentId: null, ordem: 1, aceitaLancamento: false, calculaAutomaticamente: true, formula: "SUM(children)" },
  { id: "DED", nome: "(-) Deduções da Receita Bruta", tipo: "SINTETICA", natureza: "DEDUCAO", parentId: null, ordem: 2, aceitaLancamento: false, calculaAutomaticamente: true, formula: "SUM(children)" },
  { id: "ROL", nome: "(=) Receita Operacional Líquida", tipo: "RESULTADO_CALCULADO", natureza: "RESULTADO", parentId: null, ordem: 3, aceitaLancamento: false, calculaAutomaticamente: true, formula: "ROB - DED" },
  { id: "CUSTOS", nome: "(-) Custo Mercadorias/Produtos/Serviços Vendidos", tipo: "SINTETICA", natureza: "CUSTO", parentId: null, ordem: 4, aceitaLancamento: false, calculaAutomaticamente: true, formula: "SUM(children)" },
  { id: "LUCRO_BRUTO", nome: "(=) Lucro Bruto", tipo: "RESULTADO_CALCULADO", natureza: "RESULTADO", parentId: null, ordem: 5, aceitaLancamento: false, calculaAutomaticamente: true, formula: "ROL - CUSTOS" },
  { id: "DESP_OPER", nome: "(-) Despesas Operacionais", tipo: "SINTETICA", natureza: "DESPESA", parentId: null, ordem: 6, aceitaLancamento: false, calculaAutomaticamente: true, formula: "SUM(children)" },
  { id: "EBITDA", nome: "(=) EBITDA", tipo: "RESULTADO_CALCULADO", natureza: "RESULTADO", parentId: null, ordem: 7, aceitaLancamento: false, calculaAutomaticamente: true, formula: "LUCRO_BRUTO - DESP_OPER" },
  { id: "DEP_AMORT", nome: "(-) Depreciação e Amortização", tipo: "SINTETICA", natureza: "DEPRECIACAO_AMORTIZACAO", parentId: null, ordem: 8, aceitaLancamento: false, calculaAutomaticamente: true, formula: "SUM(children)" },
  { id: "EBIT", nome: "(=) Resultado Operacional Líquido (EBIT)", tipo: "RESULTADO_CALCULADO", natureza: "RESULTADO", parentId: null, ordem: 9, aceitaLancamento: false, calculaAutomaticamente: true, formula: "EBITDA - DEP_AMORT" },
  { id: "RESULT_FIN", nome: "(+/-) Resultado Financeiro", tipo: "SINTETICA", natureza: "FINANCEIRO", parentId: null, ordem: 10, aceitaLancamento: false, calculaAutomaticamente: true, formula: "SUM(children)" },
  { id: "OUTRAS_REC_DESP", nome: "(+/-) Outras Receitas / Despesas Operacionais", tipo: "SINTETICA", natureza: "OUTRAS_RECEITAS_DESPESAS", parentId: null, ordem: 11, aceitaLancamento: false, calculaAutomaticamente: true, formula: "SUM(children)" },
  { id: "RAIR_CSLL", nome: "(=) Resultado Antes de IR e CSLL", tipo: "RESULTADO_CALCULADO", natureza: "RESULTADO", parentId: null, ordem: 12, aceitaLancamento: false, calculaAutomaticamente: true, formula: "EBIT + RESULT_FIN + OUTRAS_REC_DESP" },
  { id: "PROV_IR_CSLL", nome: "(-) Provisões IRPJ/CSLL", tipo: "SINTETICA", natureza: "TRIBUTO_SOBRE_LUCRO", parentId: null, ordem: 13, aceitaLancamento: false, calculaAutomaticamente: true, formula: "SUM(children)" },
  { id: "LUCRO_LIQ", nome: "(=) Lucro Líquido do Exercício", tipo: "RESULTADO_CALCULADO", natureza: "RESULTADO", parentId: null, ordem: 14, aceitaLancamento: false, calculaAutomaticamente: true, formula: "RAIR_CSLL - PROV_IR_CSLL" }
];
