import { GoogleGenAI, Type } from '@google/genai';
import { FinancialEntry } from '../hooks/useHistoricalDemonstracoes';
import { buildBPHierarchy } from '../lib/bpEngine';
import { calculateFinancialMetrics } from '../lib/financial-engine';
import { calculateScores } from '../lib/score-engine';

const getAI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Chave de API do Gemini não encontrada.');
  }
  return new GoogleGenAI({ apiKey });
};

export interface BoardReportData {
  sumarioExecutivo: {
    diagnostico: string;
    sinteseFinanceira: string;
    sintesePatrimonial: string;
    forcasEstruturais: string[];
    fragilidadesCriticas: string[];
    tendenciaProjetada: string;
    leituraBoard: string;
  };
  scoreConsolidado: {
    classificacaoGeral: string; // ex: AAA, AA, A, B, C, D
    scorePatrimonial: number;
    indiceContinuidade: number;
    elasticidadeFinanceira: number;
    resilienciaEstrutural: number;
    liquidityQuality: number;
    scoreEvolutivo: number;
    outlook: string; // Positivo, Neutro, Negativo
  };
  analiseDemonstracoes: {
    balancoPatrimonial: string;
    dre: string;
    fluxoCaixa: string;
  };
  liquidityIntelligence: {
    diagnosticoSustentabilidade: string;
    qualidadeLiquidez: string;
    riscoEstrangulamento: string;
  };
  capitalDeGiro: {
    interpretacaoSufocamento: string;
    eficienciaConversao: string;
    sustentabilidadeOperacional: string;
  };
  analiseHistorica: {
    evolucaoLiquidez: string;
    evolucaoPatrimonial: string;
    velocidadeDeterioracaoRecuperacao: string;
    maturidadeFinanceira: string;
    tendenciasAceleracao: string[];
  };
  stressTesting: {
    simulacoes: {
      cenario: string;
      impactoEstrutural: string;
      impactoCaixa: string;
      impactoContinuidade: string;
    }[];
  };
  boardIntelligence: {
    fragilidadesEstruturais: string[];
    implicacoesEstrategicas: string[];
    prioridadesConselho: string[];
    riscosSilenciosos: string[];
  };
  actionPlan: {
    prioridade: string;
    urgencia: string; // Alta, Média, Baixa
    impactoEsperado: string;
    horizonteTemporal: string;
  }[];
  cenariosReequilibrio: {
    cenario: string;
    impactoProjetado: string;
  }[];
  parecerTecnico: {
    companhiaSustentavel: string;
    crescimentoSaudavel: string;
    riscoEstrutural: string;
    dependenciaOperacional: string;
    sufocamentoFinanceiro: string;
    caixaSuportaOperacao: string;
    necessidadeCapitalizacao: string;
    riscoDeterioracao: string;
  };
  conclusao: {
    sinteseEstrategica: string;
    principaisRiscos: string[];
    recomendacaoBoard: string;
  };
}

const phase1Schema = {
  type: Type.OBJECT,
  properties: {
    sumarioExecutivo: {
      type: Type.OBJECT,
      properties: {
        diagnostico: { type: Type.STRING },
        sinteseFinanceira: { type: Type.STRING },
        sintesePatrimonial: { type: Type.STRING },
        forcasEstruturais: { type: Type.ARRAY, items: { type: Type.STRING } },
        fragilidadesCriticas: { type: Type.ARRAY, items: { type: Type.STRING } },
        tendenciaProjetada: { type: Type.STRING },
        leituraBoard: { type: Type.STRING }
      },
      required: ["diagnostico", "sinteseFinanceira", "sintesePatrimonial", "forcasEstruturais", "fragilidadesCriticas", "tendenciaProjetada", "leituraBoard"]
    },
    scoreConsolidado: {
      type: Type.OBJECT,
      properties: {
        classificacaoGeral: { type: Type.STRING },
        scorePatrimonial: { type: Type.NUMBER },
        indiceContinuidade: { type: Type.NUMBER },
        elasticidadeFinanceira: { type: Type.NUMBER },
        resilienciaEstrutural: { type: Type.NUMBER },
        liquidityQuality: { type: Type.NUMBER },
        scoreEvolutivo: { type: Type.NUMBER },
        outlook: { type: Type.STRING }
      },
      required: ["classificacaoGeral", "scorePatrimonial", "indiceContinuidade", "elasticidadeFinanceira", "resilienciaEstrutural", "liquidityQuality", "scoreEvolutivo", "outlook"]
    },
    analiseDemonstracoes: {
      type: Type.OBJECT,
      properties: {
        balancoPatrimonial: { type: Type.STRING },
        dre: { type: Type.STRING },
        fluxoCaixa: { type: Type.STRING }
      },
      required: ["balancoPatrimonial", "dre", "fluxoCaixa"]
    }
  },
  required: ["sumarioExecutivo", "scoreConsolidado", "analiseDemonstracoes"]
};

const phase2Schema = {
  type: Type.OBJECT,
  properties: {
    liquidityIntelligence: {
      type: Type.OBJECT,
      properties: {
        diagnosticoSustentabilidade: { type: Type.STRING },
        qualidadeLiquidez: { type: Type.STRING },
        riscoEstrangulamento: { type: Type.STRING }
      },
      required: ["diagnosticoSustentabilidade", "qualidadeLiquidez", "riscoEstrangulamento"]
    },
    capitalDeGiro: {
      type: Type.OBJECT,
      properties: {
        interpretacaoSufocamento: { type: Type.STRING },
        eficienciaConversao: { type: Type.STRING },
        sustentabilidadeOperacional: { type: Type.STRING }
      },
      required: ["interpretacaoSufocamento", "eficienciaConversao", "sustentabilidadeOperacional"]
    },
    analiseHistorica: {
      type: Type.OBJECT,
      properties: {
        evolucaoLiquidez: { type: Type.STRING },
        evolucaoPatrimonial: { type: Type.STRING },
        velocidadeDeterioracaoRecuperacao: { type: Type.STRING },
        maturidadeFinanceira: { type: Type.STRING },
        tendenciasAceleracao: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["evolucaoLiquidez", "evolucaoPatrimonial", "velocidadeDeterioracaoRecuperacao", "maturidadeFinanceira", "tendenciasAceleracao"]
    }
  },
  required: ["liquidityIntelligence", "capitalDeGiro", "analiseHistorica"]
};

const phase3Schema = {
  type: Type.OBJECT,
  properties: {
    stressTesting: {
      type: Type.OBJECT,
      properties: {
        simulacoes: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              cenario: { type: Type.STRING },
              impactoEstrutural: { type: Type.STRING },
              impactoCaixa: { type: Type.STRING },
              impactoContinuidade: { type: Type.STRING }
            },
            required: ["cenario", "impactoEstrutural", "impactoCaixa", "impactoContinuidade"]
          }
        }
      },
      required: ["simulacoes"]
    },
    boardIntelligence: {
      type: Type.OBJECT,
      properties: {
        fragilidadesEstruturais: { type: Type.ARRAY, items: { type: Type.STRING } },
        implicacoesEstrategicas: { type: Type.ARRAY, items: { type: Type.STRING } },
        prioridadesConselho: { type: Type.ARRAY, items: { type: Type.STRING } },
        riscosSilenciosos: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["fragilidadesEstruturais", "implicacoesEstrategicas", "prioridadesConselho", "riscosSilenciosos"]
    },
    actionPlan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          prioridade: { type: Type.STRING },
          urgencia: { type: Type.STRING },
          impactoEsperado: { type: Type.STRING },
          horizonteTemporal: { type: Type.STRING }
        },
        required: ["prioridade", "urgencia", "impactoEsperado", "horizonteTemporal"]
      }
    },
    cenariosReequilibrio: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          cenario: { type: Type.STRING },
          impactoProjetado: { type: Type.STRING }
        },
        required: ["cenario", "impactoProjetado"]
      }
    },
    parecerTecnico: {
      type: Type.OBJECT,
      properties: {
        companhiaSustentavel: { type: Type.STRING },
        crescimentoSaudavel: { type: Type.STRING },
        riscoEstrutural: { type: Type.STRING },
        dependenciaOperacional: { type: Type.STRING },
        sufocamentoFinanceiro: { type: Type.STRING },
        caixaSuportaOperacao: { type: Type.STRING },
        necessidadeCapitalizacao: { type: Type.STRING },
        riscoDeterioracao: { type: Type.STRING }
      },
      required: ["companhiaSustentavel", "crescimentoSaudavel", "riscoEstrutural", "dependenciaOperacional", "sufocamentoFinanceiro", "caixaSuportaOperacao", "necessidadeCapitalizacao", "riscoDeterioracao"]
    },
    conclusao: {
      type: Type.OBJECT,
      properties: {
        sinteseEstrategica: { type: Type.STRING },
        principaisRiscos: { type: Type.ARRAY, items: { type: Type.STRING } },
        recomendacaoBoard: { type: Type.STRING }
      },
      required: ["sinteseEstrategica", "principaisRiscos", "recomendacaoBoard"]
    }
  },
  required: ["stressTesting", "boardIntelligence", "actionPlan", "cenariosReequilibrio", "parecerTecnico", "conclusao"]
};

function compactFinancialData(data: FinancialEntry[]) {
  // Aggregate data by year and category to reduce token usage
  const yearly = data.reduce((acc, curr) => {
    if (!acc[curr.year]) acc[curr.year] = { receitas: 0, despesas: 0, ativo: 0, passivo: 0, pl: 0, lucro: 0, caixa: 0 };
    
    const cat = (curr.conta || '').toLowerCase();
    const val = Number(curr.val || 0);
    const type = (curr.type || '').toLowerCase();

    if (type.includes('receita') || cat.includes('receita')) acc[curr.year].receitas += val;
    if (type.includes('despesa') || type.includes('custo') || cat.includes('despesa')) acc[curr.year].despesas += val;
    if (type === 'ativo') acc[curr.year].ativo += val;
    if (type === 'passivo') acc[curr.year].passivo += val;
    if (type.includes('pl') || type.includes('patrimônio')) acc[curr.year].pl += val;
    if (cat.includes('lucro') || cat.includes('resultado do exerc')) acc[curr.year].lucro += val;
    if (cat.includes('caixa') || cat.includes('disponibilidad')) acc[curr.year].caixa += val;

    return acc;
  }, {} as Record<number, any>);

  return JSON.stringify(yearly, null, 2);
}

const BASE_PROMPT = `Você é um motor de Advisory Corporativo de Alto Nível (Illumine Corporate Intelligence).
O relatório deve possuir padrão institucional de board reporting, governance analytics e corporate resilience.
A IA deve operar como sistema de análise causal, motor de inteligência patrimonial e distress operational intelligence.
Linguagem formal, altamente executiva e profunda.
NÃO use alarmismo exagerado nem otimismo cego. Baseie-se apenas nos dados.

REGRAS OBRIGATÓRIAS (MASTER ENGINE):
1. Proibição de Contradição: Nunca contradiga a liquidez, tesouraria, patrimônio líquido ou estrutura de capital.
2. Expressões Proibidas: Nunca use 'colchão patrimonial', 'conforto financeiro', 'situação equilibrada' ou 'estabilidade' se o Patrimônio Líquido for negativo ou a Liquidez Corrente < 1.
3. EBITDA Positivo com PL Negativo: O EBITDA positivo não elimina a insolvência técnica. A narrativa deve ser: 'A operação ainda preserva capacidade de geração operacional, porém a estrutura financeira permanece pressionada e dependente de reestruturação.'
4. Severidade Extrema: É estritamente PROIBIDO o uso de 'colapso definitivo', 'falência inevitável' ou 'empresa inviável' a menos que EXATAMENTE todas as seguintes condições sejam verdadeiras e comprovadas pelos dados: EBITDA negativo, fluxo operacional negativo recorrente e liquidez imediata próxima a zero. Caso contrário, utilize termos de prudência como 'estresse severo' ou 'risco crítico de liquidez'.

DADOS HISTÓRICOS (6 ANOS):
`;

export async function generateBoardReportFull(companyName: string, financialData: FinancialEntry[], onProgress: (step: string) => void): Promise<BoardReportData> {
  const ai = getAI();
  const compactedData = compactFinancialData(financialData);

  // Deterministic Score Calculation
  const years = Array.from(new Set(financialData.map(d => d.year))).sort((a, b) => b - a);
  const latestYear = years[0];
  const previousYear = years[1];

  const latestData = financialData.filter(d => d.year === latestYear);
  const previousData = financialData.filter(d => d.year === previousYear);

  const bpRows = latestData.filter(d => ['BP', 'Balanço Patrimonial'].includes(d.docType) || ['ativo', 'passivo', 'patrimônio líquido', 'pl'].includes(d.type));
  const dreRows = latestData.filter(d => ['DRE', 'DRE Contábil', 'DRE Gerencial'].includes(d.docType));

  const { summary: bpSummary } = buildBPHierarchy(bpRows);
  
  let ebitda = 0;
  let lucroLiquido = 0;
  dreRows.forEach(r => {
    const cat = (r.conta || '').toLowerCase();
    const val = Number(r.val || r.valor || 0);
    if (cat === 'ebitda' || cat === 'lajida') ebitda = val;
    if (cat.includes('lucro') && (cat.includes('líquido') || cat.includes('liquido'))) lucroLiquido = val;
  });

  const metrics = calculateFinancialMetrics(bpSummary, ebitda, lucroLiquido);
  
  let prevPl = 0;
  if (previousYear) {
    const prevBpRows = previousData.filter(d => ['BP', 'Balanço Patrimonial'].includes(d.docType) || ['ativo', 'passivo', 'patrimônio líquido', 'pl'].includes(d.type));
    const { summary: prevBpSummary } = buildBPHierarchy(prevBpRows);
    prevPl = prevBpSummary.patrimonioLiquido;
  }

  const scores = calculateScores(bpSummary, metrics, dreRows.length, prevPl);

  const dataContext = `${BASE_PROMPT}\nEMPRESA: ${companyName}\n${compactedData}\n\n
SCORES OBRIGATÓRIOS (Use exatamente estes valores no relatório, não os invente):
- Score Patrimonial: ${scores.resilienciaGlobal.toFixed(0)}/100
- Índice de Continuidade: ${scores.indiceContinuidade.toFixed(0)}/100
- Score Evolutivo: ${scores.hsEvolucao.toFixed(0)}/100
- Resiliência Estrutural: ${scores.hsEstrutura.toFixed(0)}/100
- Elasticidade Financeira: ${scores.hsCapitalGiro.toFixed(0)}/100
- Liquidity Quality: ${scores.hsLiquidez.toFixed(0)}/100
`;

  // Fase 1
  onProgress("Analisando Patrimônio e DRE (Fase 1/3)...");
  const p1 = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `${dataContext}GERAR: Sumário Executivo, Score Consolidado e Análise das Demonstrações. 
    Copie EXATAMENTE os SCORES OBRIGATÓRIOS para a seção scoreConsolidado e não crie scores diferentes. 
    Lembre-se de interpretar causalidade, diferenciar patrimônio de liquidez.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: phase1Schema as any,
    }
  });

  const phase1Result = JSON.parse(p1.text!);

  // Fase 2
  onProgress("Medindo Liquidez e Resiliência Histórica (Fase 2/3)...");
  const p2 = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `${dataContext}GERAR: Liquidity Quality Intelligence, Inteligência de Capital de Giro e Análise Histórica/Evolutiva.
    Diferencie crescimento saudável de crescimento drenante.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: phase2Schema as any,
    }
  });

  const phase2Result = JSON.parse(p2.text!);

  // Fase 3
  onProgress("Projetando Cenários e Parecer Técnico (Fase 3/3)...");
  const p3 = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `${dataContext}GERAR: Stress Testing, Board Intelligence, Action Plan Executivo, Cenários de Reequilíbrio, Parecer Técnico e Conclusão.
    Responda se a companhia é sustentável, se o crescimento é saudável, se existe risco estrutural.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: phase3Schema as any,
    }
  });

  const phase3Result = JSON.parse(p3.text!);

  onProgress("Finalizando renderização do PDF...");
  return {
    ...phase1Result,
    ...phase2Result,
    ...phase3Result
  };
}
