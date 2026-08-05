export enum ExecutiveDriverId {
  LIQUIDITY_REAL = 'LIQUIDITY_REAL',
  LIQUIDITY_INSTANT = 'LIQUIDITY_INSTANT',
  FREE_CASH_FLOW = 'FREE_CASH_FLOW',
  WORKING_CAPITAL = 'WORKING_CAPITAL',
  FINANCIAL_AUTONOMY = 'FINANCIAL_AUTONOMY',
  THIRD_PARTY_DEPENDENCY = 'THIRD_PARTY_DEPENDENCY',
  GENERAL_INDEBTEDNESS = 'GENERAL_INDEBTEDNESS',
  CAPITAL_QUALITY = 'CAPITAL_QUALITY',
  EBITDA = 'EBITDA',
  NET_MARGIN = 'NET_MARGIN',
  RETURN_ON_CAPITAL = 'RETURN_ON_CAPITAL',
  SOLVENCY = 'SOLVENCY',
}

export type AnalyticalModule = 'BP' | 'DRE' | 'DFC' | 'DLPA' | 'EFOS' | 'GENERAL';

export interface ExecutiveDriverDefinition {
  id: ExecutiveDriverId;
  label: string;
  shortLabel: string;
  category: string;
  direction: 'positive' | 'negative' | 'neutral'; // 'positive' means higher is better
  baseMateriality: number;
  moduleWeight: Record<AnalyticalModule, number>;
  thresholds: {
    critical: (value: number) => boolean;
    warning: (value: number) => boolean;
    healthy: (value: number) => boolean;
  };
  labels: {
    critical: string;
    warning: string;
    healthy: string;
  };
  narratives: {
    critical: string;
    warning: string;
    healthy: string;
  };
  strategicPriority: {
    critical: string;
    warning: string;
    healthy: string;
  };
  priorityRecommendation: {
    critical: string;
    warning: string;
    healthy: string;
  };
  strategicSignificance?: {
    critical: string;
    warning: string;
    healthy: string;
  };
  institutionalObservation?: {
    critical: string;
    warning: string;
    healthy: string;
  };
}

export const EXECUTIVE_DRIVER_CATALOG: Record<ExecutiveDriverId, ExecutiveDriverDefinition> = {
  [ExecutiveDriverId.LIQUIDITY_REAL]: {
    id: ExecutiveDriverId.LIQUIDITY_REAL,
    label: "Liquidez Real",
    shortLabel: "Liquidez",
    category: "Cash & Liquidity",
    direction: "positive",
    baseMateriality: 1.0,
    moduleWeight: { BP: 1.0, DRE: 0.5, DFC: 0.8, DLPA: 0.8, EFOS: 0.9, GENERAL: 1.0 },
    thresholds: {
      critical: (val) => val < 1.0,
      warning: (val) => val >= 1.0 && val < 3.0,
      healthy: (val) => val >= 3.0
    },
    labels: {
      critical: "Liquidez Real Crítica",
      warning: "Liquidez sob Pressão",
      healthy: "Liquidez Real Confortável"
    },
    narratives: {
      critical: "liquidez real sob pressão imediata de obrigações de curto prazo",
      warning: "compressão da capacidade de liquidação, requerendo otimização de capital de giro",
      healthy: "ampla folga de liquidez"
    },
    strategicPriority: {
      critical: "Recomposição de caixa e renegociação emergencial",
      warning: "Otimização de capital de giro e gestão de recebíveis",
      healthy: "Alocação eficiente de excedentes e preservação do poder econômico do capital"
    },
    priorityRecommendation: {
      critical: "Renegociar passivos de curto prazo e preservar caixa imediatamente.",
      warning: "Alongar perfil da dívida e otimizar prazos operacionais.",
      healthy: "Instituir política formal de alocação de excedentes e reinvestimento na operação."
    }
  },
  [ExecutiveDriverId.LIQUIDITY_INSTANT]: {
    id: ExecutiveDriverId.LIQUIDITY_INSTANT,
    label: "Liquidez Instantânea",
    shortLabel: "Caixa Disponível",
    category: "Cash & Liquidity",
    direction: "positive",
    baseMateriality: 0.9,
    moduleWeight: { BP: 0.9, DRE: 0.3, DFC: 0.9, DLPA: 0.7, EFOS: 0.8, GENERAL: 0.8 },
    thresholds: {
      critical: (val) => val < 0.5,
      warning: (val) => val >= 0.5 && val < 1.0,
      healthy: (val) => val >= 1.0
    },
    labels: {
      critical: "Liquidez Instantânea Crítica",
      warning: "Caixa Livre em Atenção",
      healthy: "Disponibilidades Robustas"
    },
    narratives: {
      critical: "risco de ruptura no curtíssimo prazo por baixo saldo em tesouraria",
      warning: "caixa livre em patamar mínimo, indicando baixo colchão de liquidez",
      healthy: "forte posição de caixa, mitigando riscos de choques de liquidez"
    },
    strategicPriority: {
      critical: "Gestão emergencial de tesouraria",
      warning: "Revisão de buffer de caixa operacional",
      healthy: "Otimização do retorno de aplicações"
    },
    priorityRecommendation: {
      critical: "Suspender saídas não essenciais e reter todo o caixa gerado.",
      warning: "Elevar saldo mínimo de segurança da tesouraria.",
      healthy: "Rentabilizar o caixa com foco em preservação e liquidez."
    }
  },
  [ExecutiveDriverId.FREE_CASH_FLOW]: {
    id: ExecutiveDriverId.FREE_CASH_FLOW,
    label: "Fluxo de Caixa Operacional",
    shortLabel: "FCO",
    category: "Cash & Liquidity",
    direction: "positive",
    baseMateriality: 1.0,
    moduleWeight: { BP: 0.6, DRE: 0.7, DFC: 1.0, DLPA: 0.7, EFOS: 1.0, GENERAL: 1.0 },
    thresholds: {
      critical: (val) => val < 0,
      warning: (val) => val === 0, // rarely exact zero, but serves as warning boundary
      healthy: (val) => val > 0
    },
    labels: {
      critical: "Caixa Operacional Negativo",
      warning: "Geração Operacional Estagnada",
      healthy: "Forte Geração de Caixa"
    },
    narratives: {
      critical: "queima crônica de caixa pela operação, dependendo de recursos externos",
      warning: "incapacidade de gerar excedentes operacionais suficientes",
      healthy: "operação altamente geradora de caixa livre, autofinanciando o ciclo"
    },
    strategicPriority: {
      critical: "Reversão urgente da queima de caixa",
      warning: "Eficientização operacional e comercial",
      healthy: "Expansão baseada em reinvestimento próprio"
    },
    priorityRecommendation: {
      critical: "Identificar vazamentos de caixa e estancar perdas operacionais de imediato.",
      warning: "Revisar precificação e custos para elevar a conversão em caixa.",
      healthy: "Sustentar a qualidade do ciclo operacional limitando dependência de terceiros."
    }
  },
  [ExecutiveDriverId.FINANCIAL_AUTONOMY]: {
    id: ExecutiveDriverId.FINANCIAL_AUTONOMY,
    label: "Autonomia Financeira",
    shortLabel: "Autonomia",
    category: "Capital",
    direction: "positive",
    baseMateriality: 0.8,
    moduleWeight: { BP: 1.0, DRE: 0.2, DFC: 0.3, DLPA: 0.9, EFOS: 0.5, GENERAL: 0.8 },
    thresholds: {
      // Input values could be raw percentages (e.g., 40 for 40%) or decimals (0.4)
      critical: (val) => { const n = val <= 1.0 ? val * 100 : val; return n < 40; },
      warning: (val) => { const n = val <= 1.0 ? val * 100 : val; return n >= 40 && n < 80; },
      healthy: (val) => { const n = val <= 1.0 ? val * 100 : val; return n >= 80; }
    },
    labels: {
      critical: "Autonomia Financeira Comprometida",
      warning: "Autonomia Financeira Moderada",
      healthy: "Autonomia Financeira Robusta"
    },
    narratives: {
      critical: "base patrimonial fragilizada com alto grau de imobilização de recursos de terceiros",
      warning: "estrutura de capital equilibrada, mas com margem de absorção limitada",
      healthy: "estrutura de capital altamente independente e sólida"
    },
    strategicPriority: {
      critical: "Aporte de capital estruturante ou alienação de ativos",
      warning: "Manutenção da disciplina de capital e rentabilização do PL",
      healthy: "Preservação da autonomia e expansão orgânica sustentável"
    },
    priorityRecommendation: {
      critical: "Convocar os sócios para deliberação de capitalização estruturante.",
      warning: "Evitar novas rodadas de endividamento sem contrapartida clara de retorno.",
      healthy: "Manter política restrita de captações, financiando o crescimento prioritariamente com capital próprio."
    }
  },
  [ExecutiveDriverId.GENERAL_INDEBTEDNESS]: {
    id: ExecutiveDriverId.GENERAL_INDEBTEDNESS,
    label: "Endividamento Geral",
    shortLabel: "Endividamento",
    category: "Capital",
    direction: "negative",
    baseMateriality: 0.85,
    moduleWeight: { BP: 1.0, DRE: 0.5, DFC: 0.6, DLPA: 0.7, EFOS: 0.8, GENERAL: 0.9 },
    thresholds: {
      critical: (val) => val > 60,
      warning: (val) => val > 30 && val <= 60,
      healthy: (val) => val <= 30
    },
    labels: {
      critical: "Endividamento Geral Crítico",
      warning: "Pressão de Alavancagem",
      healthy: "Baixo Endividamento Geral"
    },
    narratives: {
      critical: "forte comprometimento do capital pela elevada concentração de dívidas",
      warning: "elevação da carga financeira, indicando necessidade de controle de alavancagem",
      healthy: "perfil de passivos saudável com mínima dependência onerosa"
    },
    strategicPriority: {
      critical: "Desalavancagem acelerada",
      warning: "Controle estrito de novas captações",
      healthy: "Manutenção do perfil de passivos conservador"
    },
    priorityRecommendation: {
      critical: "Deflagrar plano imediato de reperfilamento ou amortização de passivos.",
      warning: "Limitar novos endividamentos apenas a projetos com TIR superior ao custo da dívida.",
      healthy: "Preservar a capacidade de endividamento apenas para movimentos estratégicos."
    }
  },
  [ExecutiveDriverId.THIRD_PARTY_DEPENDENCY]: {
    id: ExecutiveDriverId.THIRD_PARTY_DEPENDENCY,
    label: "Dependência de Capital de Terceiros",
    shortLabel: "Dependência de Terceiros",
    category: "Capital",
    direction: "negative",
    baseMateriality: 0.75,
    moduleWeight: { BP: 0.9, DRE: 0.3, DFC: 0.4, DLPA: 0.5, EFOS: 0.6, GENERAL: 0.7 },
    thresholds: {
      critical: (val) => val > 1.0,
      warning: (val) => val > 0.3 && val <= 1.0,
      healthy: (val) => val <= 0.3
    },
    labels: {
      critical: "Dependência Crítica de Terceiros",
      warning: "Dependência Moderada de Terceiros",
      healthy: "Baixa Dependência de Capital"
    },
    narratives: {
      critical: "exposição excessiva ao capital externo e vulnerabilidade sistêmica",
      warning: "nível controlado de participação de capital alheio",
      healthy: "financiamento suportado essencialmente por fundos próprios"
    },
    strategicPriority: {
      critical: "Redução da exposição a credores",
      warning: "Equilíbrio sustentável entre passivo exigível e patrimônio",
      healthy: "Alavancagem tática seleta"
    },
    priorityRecommendation: {
      critical: "Desenvolver alternativas não onerosas de financiamento para redução da dependência.",
      warning: "Avaliar o impacto de cada passivo novo no grau de dependência da companhia.",
      healthy: "Utilizar a baixa dependência como diferencial para captações com taxas premium."
    }
  },
  [ExecutiveDriverId.SOLVENCY]: {
    id: ExecutiveDriverId.SOLVENCY,
    label: "Patrimônio Líquido",
    shortLabel: "Solvência",
    category: "Capital",
    direction: "positive",
    baseMateriality: 1.0,
    moduleWeight: { BP: 1.0, DRE: 0.2, DFC: 0.2, DLPA: 1.0, EFOS: 0.5, GENERAL: 1.0 },
    thresholds: {
      critical: (val) => val < 0,
      warning: (val) => val >= 0 && val < 50000, // Conceptually low buffer
      healthy: (val) => val >= 50000
    },
    labels: {
      critical: "Patrimônio Líquido a Descoberto",
      warning: "Reserva de Solvência Moderada",
      healthy: "Fundamentos Patrimoniais Robustos"
    },
    narratives: {
      critical: "insolvência técnica material com destruição de valor aos acionistas",
      warning: "capacidade restrita de absorver choques sem comprometer o capital social",
      healthy: "patrimônio líquido robusto com forte estabilidade financeira"
    },
    strategicPriority: {
      critical: "Proteção contra quebra técnica e recuperação de capital",
      warning: "Retenção progressiva de resultados",
      healthy: "Manutenção da proteção fiduciária"
    },
    priorityRecommendation: {
      critical: "Decretar imediatamente plano de reestruturação de capital.",
      warning: "Reter parcela maior de lucros para fortalecimento progressivo do PL.",
      healthy: "Manter o rigor na distribuição de lucros para proteger a perpetuidade."
    }
  },
  [ExecutiveDriverId.NET_MARGIN]: {
    id: ExecutiveDriverId.NET_MARGIN,
    label: "Margem Líquida",
    shortLabel: "Margem",
    category: "Profitability",
    direction: "positive",
    baseMateriality: 0.8,
    moduleWeight: { BP: 0.2, DRE: 1.0, DFC: 0.3, DLPA: 0.7, EFOS: 0.8, GENERAL: 0.8 },
    thresholds: {
      critical: (val) => val < 0,
      warning: (val) => val >= 0 && val < 0.05, // < 5% margin
      healthy: (val) => val >= 0.05
    },
    labels: {
      critical: "Destruição de Valor Líquido",
      warning: "Rentabilidade Líquida Mínima",
      healthy: "Retorno Líquido Consistente"
    },
    narratives: {
      critical: "perdas econômicas que corroem o patrimônio, indicando inviabilidade na estrutura atual",
      warning: "baixa conversão de receitas em valor final, deixando pouca margem para reinvestimentos",
      healthy: "alta eficiência na proteção do resultado contra despesas não operacionais e impostos"
    },
    strategicPriority: {
      critical: "Estancamento imediato de prejuízos corporativos",
      warning: "Eficiência fiscal, financeira e de despesas não operacionais",
      healthy: "Distribuição de dividendos sustentável ou reinvestimento"
    },
    priorityRecommendation: {
      critical: "Identificar se a perda decorre da operação (EBITDA) ou do peso financeiro/fiscal.",
      warning: "Realizar plano de redução de despesas fixas para proteger o bottom-line.",
      healthy: "Sustentar a política atual e avaliar novos canais de monetização."
    }
  },
  [ExecutiveDriverId.EBITDA]: {
    id: ExecutiveDriverId.EBITDA,
    label: "EBITDA Operacional",
    shortLabel: "EBITDA",
    category: "Profitability",
    direction: "positive",
    baseMateriality: 0.9,
    moduleWeight: { BP: 0.3, DRE: 1.0, DFC: 0.7, DLPA: 0.5, EFOS: 0.9, GENERAL: 0.9 },
    thresholds: {
      critical: (val) => val < 0,
      warning: (val) => val === 0, 
      healthy: (val) => val > 0
    },
    labels: {
      critical: "EBITDA Negativo",
      warning: "Baixa Força Operacional",
      healthy: "Robustez de Geração Operacional"
    },
    narratives: {
      critical: "operação deficitária em sua essência, sem capacidade de pagar nem mesmo os custos fixos diretos",
      warning: "geração operacional marginal e altamente sensível a variações de custo",
      healthy: "excelência na execução core business, provendo ampla margem para serviço da dívida"
    },
    strategicPriority: {
      critical: "Reestruturação total do modelo de negócio (turnaround)",
      warning: "Otimização de custos variáveis e estratégia comercial",
      healthy: "Estratégia agressiva de captura de mercado e ganho de escala"
    },
    priorityRecommendation: {
      critical: "Rever modelo de precificação e custos; a operação atualmente sangra valor.",
      warning: "Focar estritamente no controle de SG&A e revisão de tabela de preços.",
      healthy: "Aproveitar o forte spread operacional para financiar inovações."
    }
  },
  [ExecutiveDriverId.WORKING_CAPITAL]: {
    id: ExecutiveDriverId.WORKING_CAPITAL,
    label: "Capital de Giro Líquido",
    shortLabel: "Capital de Giro",
    category: "Cash & Liquidity",
    direction: "positive",
    baseMateriality: 0.7,
    moduleWeight: { BP: 0.8, DRE: 0.2, DFC: 0.5, DLPA: 0.4, EFOS: 0.7, GENERAL: 0.6 },
    thresholds: {
      critical: (val) => val < 0,
      warning: (val) => val >= 0 && val < 10000, 
      healthy: (val) => val >= 10000
    },
    labels: {
      critical: "Capital de Giro Negativo",
      warning: "Restrição de Giro",
      healthy: "Folga de Capital de Giro"
    },
    narratives: {
      critical: "incapacidade sistêmica de financiar o próprio ciclo, forçando alongamento com fornecedores ou atrasos",
      warning: "financiamento operacional no limite, vulnerável a qualquer descasamento pontual",
      healthy: "capacidade superior de cobrir o ciclo com recursos próprios já realizados"
    },
    strategicPriority: {
      critical: "Injeção emergencial para capital de giro",
      warning: "Negociação ativa do ciclo de conversão (receber antes, pagar depois)",
      healthy: "Desconto comercial em antecipações ou ampliação estratégica de crédito a clientes"
    },
    priorityRecommendation: {
      critical: "Estruturar operações de desconto de recebíveis de forma provisória.",
      warning: "Equacionar os prazos médios de recebimento (PMR) e pagamento (PMP).",
      healthy: "Otimizar o custo de capital evitando tomar linhas de giro onerosas sem necessidade."
    }
  },
  // Default fallbacks and placeholders can be mapped here as well
  [ExecutiveDriverId.CAPITAL_QUALITY]: {
    id: ExecutiveDriverId.CAPITAL_QUALITY,
    label: "Qualidade do Capital",
    shortLabel: "Qualidade Capital",
    category: "Capital",
    direction: "positive",
    baseMateriality: 0.5,
    moduleWeight: { BP: 0.7, DRE: 0.1, DFC: 0.1, DLPA: 0.6, EFOS: 0.2, GENERAL: 0.5 },
    thresholds: {
      critical: () => false, // Hard to measure universally
      warning: () => false,
      healthy: () => true
    },
    labels: {
      critical: "Capital Artificializado",
      warning: "Qualidade sob Observação",
      healthy: "Capital Íntegro"
    },
    narratives: {
      critical: "composição de capital inflada por ativos não realizáveis",
      warning: "dependência moderada de artifícios contábeis",
      healthy: "qualidade cristalina das reservas e capital subscrito"
    },
    strategicPriority: {
      critical: "Saneamento contábil e patrimonial",
      warning: "Revisão da integridade de reservas",
      healthy: "Aprovação fiduciária das contas"
    },
    priorityRecommendation: {
      critical: "Realizar baixa ou impairment imediato de ativos tóxicos.",
      warning: "Limitar reconhecimento de lucros não realizados.",
      healthy: "Prosseguir com a execução do plano orçamentário regular."
    }
  },
  [ExecutiveDriverId.RETURN_ON_CAPITAL]: {
    id: ExecutiveDriverId.RETURN_ON_CAPITAL,
    label: "Retorno sobre o Patrimônio (ROE)",
    shortLabel: "Retorno",
    category: "Profitability",
    direction: "positive",
    baseMateriality: 0.8,
    moduleWeight: { BP: 0.4, DRE: 0.9, DFC: 0.5, DLPA: 0.9, EFOS: 0.7, GENERAL: 0.8 },
    thresholds: {
      critical: (val) => val < 0,
      warning: (val) => val >= 0 && val < 0.10, // Under 10%
      healthy: (val) => val >= 0.10
    },
    labels: {
      critical: "Retorno ao Acionista Negativo",
      warning: "Retorno Subótimo ao Acionista",
      healthy: "Retorno Acima do Custo de Capital"
    },
    narratives: {
      critical: "destruição direta do valor originalmente investido",
      warning: "rentabilidade incapaz de justificar o prêmio de risco do negócio",
      healthy: "geração sustentável de prêmio ao sócio superando o custo de oportunidade"
    },
    strategicPriority: {
      critical: "Estancar perda de valor aos sócios",
      warning: "Realinhamento de metas de margem e expansão",
      healthy: "Perpetuação do diferencial competitivo e reinvestimento na proteção de mercado"
    },
    priorityRecommendation: {
      critical: "Avaliar encerramento de unidades de negócio estruturalmente deficitárias.",
      warning: "Reposicionar o mix de produtos e serviços para maior margem de contribuição.",
      healthy: "Potencializar o prêmio investindo agressivamente nas linhas de maior TIR."
    }
  }
};
