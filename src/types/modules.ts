
export type EixoGestao = 'Gestão Financeira' | 'Gestão Comercial' | 'Gestão Operacional' | 'Gestão de Pessoas' | 'Gestão Administrativa' | 'Governança' | 'Cultura' | 'Inovação' | 'Avaliação de Riscos';

export interface Diretriz {
  id?: string;
  clientId: string;
  missao: string;
  visao: string;
  valores: { nome: string; definicao: string }[];
  updatedAt: any;
  ownerId: string;
}

export type ClassificacaoSWOT = 'Força' | 'Fraqueza' | 'Oportunidade' | 'Ameaça';
export type TipoRisco = 'Estratégico' | 'Financeiro' | 'Operacional' | 'Compliance';
export type Gravidade = 1 | 2 | 3 | 4 | 5; // 1: Pouco Grave, 5: Extremamente Grave
export type Urgencia = 1 | 2 | 3 | 4 | 5; // 1: Pode Esperar, 5: Imediatamente
export type Tendencia = 1 | 2 | 3 | 4 | 5; // 1: Melhora, 5: Agrava rapidamente
export type ImpactoFinanceiro = 1 | 2 | 3 | 4 | 5;

export interface DiagnosticoItem {
  id?: string;
  clientId: string;
  descricao: string;
  eixo: EixoGestao;
  swot: ClassificacaoSWOT;
  tipoRisco: TipoRisco;
  gravidade: Gravidade;
  urgencia: Urgencia;
  tendencia: Tendencia;
  efeitoFinanceiro: 'Receita' | 'EBITDA' | 'Receita + EBITDA' | 'Caixa' | 'Outros';
  impactoFinanceiro: ImpactoFinanceiro;
  custoInvestimento: 'Baixo' | 'Médio' | 'Alto';
  retornoInvestimento: 'Alto em 90 dias' | 'Alto em 180 dias' | 'Alto em 12 meses' | 'Médio' | 'Baixo';
  fivScore: number;
  okrVinculado?: string;
  updatedAt: any;
  ownerId: string;
}

export interface KR {
  id: string;
  descricao: string;
  kpi: string;
  tipo: 'Percentual' | 'Monetário' | 'Unidade';
  meta: number;
  atual: number;
  status: 'Not Started' | 'In Progress' | 'At Risk' | 'Completed';
  progresso: number;
}

export interface ObjetivoOKR {
  id?: string;
  clientId: string;
  titulo: string;
  eixo: EixoGestao;
  responsavel: string;
  periodo: string;
  progressoGeral: number;
  vinculoDiagnostico: string[];
  keyResults: KR[];
  updatedAt: any;
  ownerId: string;
}

export interface ProdutoServico {
  id?: string;
  clientId: string;
  nome: string;
  precoVenda: number;
  custosVariaveis: {
    materiaPrima: number;
    comissao: number;
    impostos: number;
    frete: number;
    outros: number;
  };
  margemContribuicaoUnit: number;
  margemContribuicaoPct: number;
  updatedAt: any;
  ownerId: string;
}
