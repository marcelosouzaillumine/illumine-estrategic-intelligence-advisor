import { GoogleGenAI, Type } from '@google/genai';
import { db, auth } from '../lib/firebase';
import { collection, doc, writeBatch, serverTimestamp, setDoc, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { DATA } from '../data';
import { GOVERNANCE_PRINCIPLES } from '../lib/governanceIntelligence';

// Initialize the SDK with the Vite env variable
// The user will need to define VITE_GEMINI_API_KEY in .env.local
const getAI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Chave de API do Gemini não encontrada. Por favor, adicione VITE_GEMINI_API_KEY ao seu arquivo .env.local.');
  }
  return new GoogleGenAI({ apiKey });
};

export interface AICompanyData {
  clientData: {
    razao: string;
    fantasia: string;
    cnpj: string;
    segmento: string;
    subsetor: string;
    regime: string;
    cnae: string;
    porte: string;
    cidade: string;
    endereco: string;
    capitalSocial: number;
    faturamentoMensal: number;
  };
  assumptions: {
    wacc: number;
    multiple: number;
    growth: number;
    ipca: number;
    selic: number;
  };
  historicalRevenueBase: number;
  ebitdaMargin: number;
  strategicReport: {
    challenges: string[];
    opportunities: string[];
    governance: string;
    operationalFlow: string;
    dashboardIdeas: string[];
    growthSuggestions: string[];
  };
  axisDescriptions: {
    governanca: string;
    cultura: string;
    financeiro: string;
    inovacao: string;
    marketing: string;
    comercial: string;
    operacional: string;
  };
  diretrizes: {
    missao: string;
    visao: string;
    valores: string[];
  };
  employees: { nome: string; salarioBase: number }[];
  pricing: { nome: string; precoVenda: number; margemContribuicaoPct: number }[];
  payables: { fornecedor: string; documento: string; valor: number }[];
  receivables: { cliente: string; documento: string; valor: number }[];
  diagnostico: {
    descricao: string;
    swot: string;
    eixo: string;
    gravidade: number;
    urgencia: number;
    tendencia: number;
    impactoFinanceiro: number;
  }[];
  okrs: {
    titulo: string;
    eixo: string;
    responsavel: string;
    keyResults: { titulo: string; tipo: string; meta: number }[];
  }[];
}

const companySchema = {
  type: Type.OBJECT,
  properties: {
    clientData: {
      type: Type.OBJECT,
      properties: {
        razao: { type: Type.STRING },
        fantasia: { type: Type.STRING },
        cnpj: { type: Type.STRING },
        segmento: { type: Type.STRING },
        subsetor: { type: Type.STRING },
        regime: { type: Type.STRING },
        cnae: { type: Type.STRING },
        porte: { type: Type.STRING },
        cidade: { type: Type.STRING },
        endereco: { type: Type.STRING },
        capitalSocial: { type: Type.NUMBER },
        faturamentoMensal: { type: Type.NUMBER }
      },
      required: ["razao", "fantasia", "cnpj", "segmento", "subsetor", "regime", "cnae", "porte", "cidade", "endereco", "capitalSocial", "faturamentoMensal"]
    },
    assumptions: {
      type: Type.OBJECT,
      properties: {
        wacc: { type: Type.NUMBER },
        multiple: { type: Type.NUMBER },
        growth: { type: Type.NUMBER },
        ipca: { type: Type.NUMBER },
        selic: { type: Type.NUMBER }
      },
      required: ["wacc", "multiple", "growth", "ipca", "selic"]
    },
    historicalRevenueBase: { type: Type.NUMBER },
    ebitdaMargin: { type: Type.NUMBER },
    strategicReport: {
      type: Type.OBJECT,
      properties: {
        challenges: { type: Type.ARRAY, items: { type: Type.STRING } },
        opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
        governance: { type: Type.STRING },
        operationalFlow: { type: Type.STRING },
        dashboardIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
        growthSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["challenges", "opportunities", "governance", "operationalFlow", "dashboardIdeas", "growthSuggestions"]
    },
    axisDescriptions: {
      type: Type.OBJECT,
      properties: {
        governanca: { type: Type.STRING },
        cultura: { type: Type.STRING },
        financeiro: { type: Type.STRING },
        inovacao: { type: Type.STRING },
        marketing: { type: Type.STRING },
        comercial: { type: Type.STRING },
        operacional: { type: Type.STRING }
      },
      required: ["governanca", "cultura", "financeiro", "inovacao", "marketing", "comercial", "operacional"]
    },
    diretrizes: {
      type: Type.OBJECT,
      properties: {
        missao: { type: Type.STRING },
        visao: { type: Type.STRING },
        valores: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["missao", "visao", "valores"]
    },
    employees: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: { nome: { type: Type.STRING }, salarioBase: { type: Type.NUMBER } },
        required: ["nome", "salarioBase"]
      }
    },
    pricing: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: { nome: { type: Type.STRING }, precoVenda: { type: Type.NUMBER }, margemContribuicaoPct: { type: Type.NUMBER } },
        required: ["nome", "precoVenda", "margemContribuicaoPct"]
      }
    },
    payables: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: { fornecedor: { type: Type.STRING }, documento: { type: Type.STRING }, valor: { type: Type.NUMBER } },
        required: ["fornecedor", "documento", "valor"]
      }
    },
    receivables: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: { cliente: { type: Type.STRING }, documento: { type: Type.STRING }, valor: { type: Type.NUMBER } },
        required: ["cliente", "documento", "valor"]
      }
    },
    diagnostico: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          descricao: { type: Type.STRING },
          swot: { type: Type.STRING },
          eixo: { type: Type.STRING },
          gravidade: { type: Type.NUMBER },
          urgencia: { type: Type.NUMBER },
          tendencia: { type: Type.NUMBER },
          impactoFinanceiro: { type: Type.NUMBER }
        },
        required: ["descricao", "swot", "eixo", "gravidade", "urgencia", "tendencia", "impactoFinanceiro"]
      }
    },
    okrs: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          titulo: { type: Type.STRING },
          eixo: { type: Type.STRING },
          responsavel: { type: Type.STRING },
          keyResults: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: { titulo: { type: Type.STRING }, tipo: { type: Type.STRING }, meta: { type: Type.NUMBER } },
              required: ["titulo", "tipo", "meta"]
            }
          }
        },
        required: ["titulo", "eixo", "responsavel", "keyResults"]
      }
    }
  },
  required: ["clientData", "assumptions", "historicalRevenueBase", "ebitdaMargin", "strategicReport", "axisDescriptions", "diretrizes", "employees", "pricing", "payables", "receivables", "diagnostico", "okrs"]
};

const financialStatementSchema = {
  type: Type.OBJECT,
  properties: {
    documents: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING }, // "Balanço Patrimonial", "DRE", "DFC", "DLPA"
          year: { type: Type.NUMBER },
          month: { type: Type.NUMBER }, // 12 for annual, 1-12 for monthly
          cnpj: { type: Type.STRING, description: "CNPJ encontrado no cabeçalho ou rodapé do documento" },
          confidenceScore: { type: Type.NUMBER, description: "Nível de confiança da extração de 0 a 100" },
          periodoDocumento: { type: Type.STRING, description: "Texto original do período encontrado no documento (ex: 'Período: 01/01/2024 a 31/12/2024')" },
          entries: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                value: { type: Type.NUMBER }
              },
              required: ["category", "value"]
            }
          }
        },
        required: ["type", "year", "month", "entries", "confidenceScore"]
      }
    }
  },
  required: ["documents"]
};

export const generateAICompanyPayload = async (
  segment: string, 
  description: string = '',
  axisDescriptions?: {
    governanca: string;
    cultura: string;
    financeiro: string;
    inovacao: string;
    marketing: string;
    comercial: string;
    operacional: string;
  }
): Promise<AICompanyData> => {
  try {
    const ai = getAI();
    
    const axisContext = axisDescriptions ? `
CONTEXTO POR EIXO DE GESTÃO:
- Governança Corporativa: ${axisDescriptions.governanca}
- Cultura Organizacional: ${axisDescriptions.cultura}
- Gestão Administrativa e Financeira: ${axisDescriptions.financeiro}
- Gestão de Inovação: ${axisDescriptions.inovacao}
- Gestão de Marketing: ${axisDescriptions.marketing}
- Gestão Comercial: ${axisDescriptions.comercial}
- Gestão Operacional: ${axisDescriptions.operacional}
` : '';

    const prompt = `Você é o ARQUITETO DE EVOLUÇÃO E DISCERNIMENTO ORGANIZACIONAL da Illumine.
Sua missão é criar uma Empresa Modelo que personifique a excelência em Gestão Sistêmica e Governança Representativa.

SEGMENTO: "${segment}"
CARACTERÍSTICAS/RELATO GERAL: "${description}"
${axisContext}

PRINCÍPIOS DE CRIAÇÃO:
1. DO TODO PARA A PARTE: A empresa não é apenas financeira. Ela é um sistema humano, cultural, econômico e institucional. Integre o DNA (Missão/Visão/Valores) com a operação real.
2. COERÊNCIA SISTÊMICA: Os dados devem ser INTEGRADOS. Se há lucro mas o relato aponta problemas de cultura, as dívidas ou o turnover devem refletir esse risco invisível.
3. PILARES DE GESTÃO: Utilize as descrições de cada pilar de gestão acima para fundamentar KPIs, OKRs e Diagnósticos de forma harmônica.
4. DISCERNIMENTO FINANCEIRO: Diferencie e integre Regime de Caixa e Regime de Competência. O caixa demonstra liquidez, a competência demonstra viabilidade econômica.

DIRETRIZES TÉCNICAS:
1. clientData.regime: DEVE ser exatamente "Lucro Real", "Lucro Presumido" ou "Simples Nacional".
2. Faturamento e Custos: Devem ser coerentes com o porte e o estágio de maturidade descrito.
3. Diagnósticos (IVE): Gere 2 itens (swot: "Força", "Fraqueza", "Oportunidade", "Ameaça"; eixo: nomes oficiais dos pilares de gestão; gravidade/urgencia/tendencia/impacto: 1 a 5).
4. OKR: Gere 1 OKR estratégico que resolva uma incoerência detectada entre os pilares de gestão.
5. Relatório Estratégico: Deve ser profundo, abordando desafios de governança, sustentabilidade e legado.
6. Pessoas e Cultura: Reflita o impacto humano nos salários e na estrutura de funcionários.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: companySchema as any,
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Erro ao gerar conteúdo com a IA.");
    }

    return JSON.parse(text) as AICompanyData;
  } catch (error) {
    console.warn("Gemini API Error or Rate Limit. Using local fallback template.", error);
    return getFallbackPayload(segment);
  }
};

const getFallbackPayload = (segment: string): AICompanyData => {
  const baseRevenue = 1200000 + Math.random() * 800000;
  return {
    clientData: {
      razao: `${segment.toUpperCase()} SOLUTIONS LTDA`,
      fantasia: `Illumine ${segment} Modelo`,
      cnpj: "00.000.000/0001-00",
      segmento: segment,
      subsetor: "Tecnologia e Serviços",
      regime: "Lucro Real",
      cnae: "62.01-5/01",
      porte: "Médio",
      cidade: "São Paulo",
      endereco: "Av. Paulista, 1000",
      capitalSocial: 500000,
      faturamentoMensal: baseRevenue / 12
    },
    historicalRevenueBase: baseRevenue,
    ebitdaMargin: 0.18 + (Math.random() * 0.1),
    assumptions: {
      wacc: 12.5,
      multiple: 8,
      growth: 15,
      ipca: 4.5,
      selic: 10.75
    },
    strategicReport: {
      challenges: ["Escalabilidade", "Retenção de Talentos"],
      opportunities: ["Expansão Digital", "Novos Mercados"],
      governance: "Processos em estruturação",
      operationalFlow: "Fluxo padrão otimizado",
      dashboardIdeas: ["Margem por Produto", "Liquidez Imediata"],
      growthSuggestions: ["Aumento de ticket médio", "Redução de churn"]
    },
    axisDescriptions: {
      governanca: "Processos em estruturação",
      cultura: "Cultura de resultados",
      financeiro: "Gestão conservadora",
      inovacao: "Foco em melhoria incremental",
      marketing: "Marketing digital ativo",
      comercial: "Vendas diretas",
      operacional: "Operação padronizada"
    },
    diretrizes: {
      missao: `Ser referência em excelência no segmento de ${segment}.`,
      visao: `Liderar o mercado de ${segment} até 2030.`,
      valores: ["Transparência", "Ética", "Resultados"]
    },
    employees: [
      { nome: "C-Level Executivo", salarioBase: 18000 },
      { nome: "Gerente de Operações", salarioBase: 12000 },
      { nome: "Time Técnico", salarioBase: 8000 }
    ],
    pricing: [
      { nome: "Serviço Premium", precoVenda: 5000, margemContribuicaoPct: 45 },
      { nome: "Solução Standard", precoVenda: 2500, margemContribuicaoPct: 35 }
    ],
    diagnostico: [
      { descricao: "Forte posicionamento de mercado", swot: "Força", eixo: "Gestão Comercial", gravidade: 1, urgencia: 1, tendencia: 1, impactoFinanceiro: 4 },
      { descricao: "Dependência de poucos fornecedores", swot: "Fraqueza", eixo: "Gestão Operacional", gravidade: 4, urgencia: 3, tendencia: 3, impactoFinanceiro: 3 }
    ],
    okrs: [
      { 
        titulo: "Expansão de Market Share", 
        eixo: "Gestão Comercial", 
        responsavel: "Diretoria", 
        keyResults: [
          { titulo: "Aumentar base de clientes em 20%", tipo: "Percentual", meta: 20 },
          { titulo: "Novo faturamento mensal", tipo: "Financeiro", meta: 500000 }
        ] 
      }
    ],
    payables: [{ fornecedor: "Cloud Provider", documento: "NF-99", valor: baseRevenue * 0.05 }],
    receivables: [{ cliente: "Cliente VIP 01", documento: "FAT-01", valor: baseRevenue * 0.1 }]
  };
};

export const createAICompanyInFirestore = async (aiData: AICompanyData) => {
  if (!auth.currentUser) throw new Error('Usuário não autenticado.');

  const clientId = doc(collection(db, 'clients')).id;

  // 1. Validar Enums Críticos
  const validRegimes = ['Lucro Real', 'Lucro Presumido', 'Simples Nacional'];
  const finalRegime = validRegimes.includes(aiData.clientData.regime) ? aiData.clientData.regime : 'Lucro Presumido';

  // 2. Create Client Document first
  try {
    await setDoc(doc(db, 'clients', clientId), {
      ...aiData.clientData,
      isModel: true,
      regime: finalRegime,
      regimeReal: 'Não Cumulativo',
      cnae: aiData.clientData.cnae || '00.000-0/00',
      status: 'Ativo',
      ownerId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      aiAnalysis: aiData.strategicReport,
      rbt12: (aiData.clientData.faturamentoMensal || 0) * 12,
      folhaFgts: 8,
      folhaInssPatronal: 20,
      folhaInssFuncionario: 11,
      folhaMultaFgts: 40,
      folhaTabelaIRRF: [
        { base: 2259.20, aliquota: 0, deducao: 0 },
        { base: 2826.65, aliquota: 7.5, deducao: 169.44 },
        { base: 3751.05, aliquota: 15, deducao: 381.44 },
        { base: 4664.68, aliquota: 22.5, deducao: 662.77 },
        { base: 999999, aliquota: 27.5, deducao: 896.00 }
      ]
    });
    console.log('Client document created successfully.');

    // O Plano de Contas padrão será criado usando addDoc em paralelo para não pesar no batch
    const accountPlanPromises = DATA.accountPlanPadrão.map(acc => {
      return addDoc(collection(db, 'account_plans'), {
        ...acc,
        clientId,
        planType: 'accounting',
        status: acc.status || 'Ativa',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: auth.currentUser!.uid
      });
    });
    await Promise.all(accountPlanPromises);
    console.log('Account plans created successfully.');

  } catch (err: any) {
    console.error('Error creating client document/account plans:', err);
    throw new Error('Falha de permissão ao criar documento do cliente.');
  }

  // Helper function to commit batches in chunks of 450 to avoid the 500 limit
  const commitBatch = async (b: any) => {
    try {
      await b.commit();
    } catch (err: any) {
      console.error('Error committing batch:', err);
      throw new Error(`Falha ao gravar dados: ${err.message}`);
    }
  };

  let currentBatch = writeBatch(db);
  let opCount = 0;

  const addToBatch = async (docRef: any, data: any) => {
    currentBatch.set(docRef, data);
    opCount++;
    if (opCount >= 450) {
      await commitBatch(currentBatch);
      currentBatch = writeBatch(db);
      opCount = 0;
    }
  };

  // 2. Historical Data (Last 5 Years)
  const currentYearBase = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYearBase - 4 + i);
  let baseRevenue = aiData.historicalRevenueBase;
  const ebitdaMargin = aiData.ebitdaMargin;
  const monthlyRev = baseRevenue / 12;
  
  for (const year of years) {
    const growthRate = 1 + (0.15 + (Math.random() * 0.15));
    const revenue = year === years[0] ? baseRevenue : baseRevenue * Math.pow(growthRate, years.indexOf(year));
    const ebitda = revenue * ebitdaMargin;
    const remainingCosts = revenue - ebitda;
    const cogs = remainingCosts * 0.6;
    const opex = remainingCosts * 0.4;
    const depr = revenue * 0.05;
    const ebit = ebitda - depr;
    const finResult = -revenue * 0.02;
    const lair = ebit + finResult;
    const irpj = lair > 0 ? lair * 0.34 : 0;
    const netIncome = lair - irpj;

    const dreEntries = [
      { category: 'Receita Operacional Bruta', value: revenue * 1.15 },
      { category: '(-) Deduções e Impostos', value: -(revenue * 0.15) },
      { category: 'Receita Líquida', value: revenue },
      { category: '(-) Custos (CPV/CSP)', value: -cogs },
      { category: 'Lucro Bruto', value: revenue - cogs },
      { category: '(-) Despesas Operacionais', value: -opex },
      { category: 'EBITDA', value: ebitda },
      { category: '(-) Depreciação e Amortização', value: -depr },
      { category: 'EBIT', value: ebit },
      { category: '(+/-) Resultado Financeiro', value: finResult },
      { category: 'LAIR (Lucro Antes do IR)', value: lair },
      { category: '(-) Provisão IR/CSLL', value: -irpj },
      { category: 'Lucro Líquido', value: netIncome },
    ];

    for (const entry of dreEntries) {
      await addToBatch(doc(collection(db, 'financial_entries')), {
        clientId,
        type: 'DRE',
        category: entry.category,
        value: entry.value,
        competence: `${year}-12`,
        year,
        month: 12,
        createdBy: auth.currentUser!.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    const assetsBase = revenue * 0.8;
    const liabilitiesBase = revenue * 0.3;
    const equityBase = assetsBase - liabilitiesBase;

    const bpEntries = [
      { category: 'Ativo Circulante', value: assetsBase * 0.6, tipo: 'ativo' },
      { category: 'Ativo Não Circulante', value: assetsBase * 0.4, tipo: 'ativo' },
      { category: 'Passivo Circulante', value: liabilitiesBase * 0.8, tipo: 'passivo' },
      { category: 'Passivo Não Circulante', value: liabilitiesBase * 0.2, tipo: 'passivo' },
      { category: 'Patrimônio Líquido', value: equityBase, tipo: 'passivo' },
    ];

    for (const entry of bpEntries) {
      await addToBatch(doc(collection(db, 'financial_entries')), {
        clientId,
        type: 'BP',
        category: entry.category,
        value: entry.value,
        tipo: entry.tipo,
        competence: `${year}-12`,
        year,
        month: 12,
        createdBy: auth.currentUser!.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
  }

  // 2. Complete History (Last 5 Years = 60 months)
  const today = new Date();
  const historyMonths = 60;
  
  for (let i = 0; i < historyMonths; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const m = d.getMonth() + 1;
    const y = d.getFullYear();
    
    const seasonality = 1 + Math.sin((m / 12) * Math.PI * 2) * 0.1;
    const randomness = 0.9 + Math.random() * 0.2;
    const growthFactor = Math.pow(1.01, historyMonths - i); // ~12% annual growth back in time
    
    const monthlyRevenue = (aiData.historicalRevenueBase / 12) * growthFactor * seasonality * randomness;
    const monthlyEbitda = monthlyRevenue * aiData.ebitdaMargin;
    
    const kpis = [
      { ind: 'Receita Líquida', val: monthlyRevenue, un: 'R$' },
      { ind: 'EBITDA', val: monthlyEbitda, un: 'R$' },
      { ind: 'Lucro Líquido', val: monthlyEbitda * 0.6, un: 'R$' },
      { ind: 'Margem EBITDA', val: aiData.ebitdaMargin * 100, un: '%' },
      { ind: 'Margem Líquida', val: (aiData.ebitdaMargin * 0.6) * 100, un: '%' },
      { ind: 'Faturamento Bruto', val: monthlyRevenue * 1.15, un: 'R$' },
      { ind: 'Saldo em Caixa', val: monthlyRevenue * (0.4 + Math.random() * 0.2), un: 'R$' },
      { ind: 'Fluxo de Caixa Operacional', val: monthlyEbitda * 0.8, un: 'R$' },
      { ind: 'Liquidez Corrente', val: 1.5 + Math.random(), un: 'x' },
      { ind: 'Valor de Mercado', val: monthlyEbitda * 12 * (aiData.assumptions.multiple || 6), un: 'R$' },
      { ind: 'Múltiplo', val: aiData.assumptions.multiple || 6, un: 'x' },
      { ind: 'WACC', val: aiData.assumptions.wacc || 12, un: '%' },
      { ind: 'IVE', val: 10 + Math.random() * 10, un: '%' },
      { ind: 'OKRs', val: 40 + Math.random() * 40, un: '%' },
      { ind: 'LTV/CAC', val: 3 + Math.random(), un: 'x' },
      { ind: 'Churn Rate', val: 2 + Math.random(), un: '%' },
      { ind: 'Ticket Médio', val: monthlyRevenue / 50, un: 'R$' },
      { ind: 'PMR', val: 30 + Math.round(Math.random() * 30), un: 'dias' },
      { ind: 'Inadimplência', val: 2 + Math.random() * 3, un: '%' },
    ];

    for (const kpi of kpis) {
      await addToBatch(doc(collection(db, 'indicators')), {
        clientId,
        ind: kpi.ind,
        val: kpi.val,
        un: kpi.un,
        ano: y,
        mes: m,
        sem: kpi.val < 0 ? 'Vermelho' : 'Verde',
        cat: 'Histórico',
        createdBy: auth.currentUser!.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp() // Added to be safe
      });
    }

    const dreEntries = [
      { category: 'Receita Líquida', value: monthlyRevenue },
      { category: 'Lucro Líquido', value: monthlyEbitda * 0.6 },
      { category: 'EBITDA', value: monthlyEbitda }
    ];

    for (const entry of dreEntries) {
      await addToBatch(doc(collection(db, 'financial_entries')), {
        clientId,
        type: 'DRE',
        category: entry.category,
        value: entry.value,
        year: y,
        month: m,
        mes: m,
        ano: y,
        competence: `${y}-${String(m).padStart(2, '0')}`,
        createdBy: auth.currentUser!.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
  }

  // 2.2 Future Projections (Next 5 Years = 60 months)
  const projectionMonths = 60;
  const targetGrowth = 1.25; // 25% annual growth target
  
  for (let i = 1; i <= projectionMonths; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
    const m = d.getMonth() + 1;
    const y = d.getFullYear();
    
    const seasonality = 1 + Math.sin((m / 12) * Math.PI * 2) * 0.1;
    const growthFactor = Math.pow(targetGrowth, i / 12);
    
    const projectedRevenue = (aiData.historicalRevenueBase / 12) * growthFactor * seasonality;
    const projectedEbitda = projectedRevenue * (aiData.ebitdaMargin * 1.1); // Efficiency gains
    
    const kpis = [
      { ind: 'Faturamento Bruto', val: projectedRevenue * 1.15, un: 'R$' },
      { ind: 'Receita Líquida', val: projectedRevenue, un: 'R$' },
      { ind: 'EBITDA', val: projectedEbitda, un: 'R$' },
      { ind: 'Lucro Líquido', val: projectedEbitda * 0.7, un: 'R$' },
      { ind: 'Margem EBITDA', val: (aiData.ebitdaMargin * 1.1) * 100, un: '%' },
      { ind: 'Valor de Mercado', val: projectedEbitda * 12 * (aiData.assumptions.multiple || 8), un: 'R$' },
      { ind: 'OKRs', val: 70 + Math.random() * 20, un: '%' },
    ];

    for (const kpi of kpis) {
      await addToBatch(doc(collection(db, 'indicators')), {
        clientId,
        ind: kpi.ind,
        val: kpi.val,
        un: kpi.un,
        ano: y,
        mes: m,
        sem: 'Verde',
        cat: 'Projetado',
        isProjection: true,
        createdBy: auth.currentUser!.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp() // Added to be safe
      });
    }
  }

  // Final commit for the remaining operations
  if (opCount > 0) {
    await commitBatch(currentBatch);
  }

  // Commit client_assumptions separately for easier debugging
  const assumptionsBatch = writeBatch(db);
  assumptionsBatch.set(doc(collection(db, 'client_assumptions')), {
    clientId,
    receitas: [],
    custos: [],
    crescimento: aiData.assumptions.growth || 0,
    updatedAt: serverTimestamp(),
  });
  try {
    await assumptionsBatch.commit();
    console.log('Assumptions batch committed successfully.');
  } catch (err: any) {
    console.error('Error committing assumptions batch:', err);
    throw new Error(`Falha ao gravar premissas: ${err.message}`);
  }

  // === SEQUENTIAL WRITES: Operational Modules (one at a time to isolate failures) ===
  const currentYearMonth = new Date().toISOString().substring(0, 7); // YYYY-MM
  const getValidSwot = (val: string) => ['Força', 'Fraqueza', 'Oportunidade', 'Ameaça'].includes(val) ? val : 'Força';
  const getValidEixo = (val: string) => ['Governança Corporativa', 'Cultura Organizacional', 'Administração e Finanças', 'Gestão de Inovação', 'Gestão de Marketing', 'Gestão Comercial', 'Gestão Operacional'].includes(val) ? val : 'Gestão Comercial';

  try {
    await addDoc(collection(db, 'diretrizes'), {
      clientId,
      ownerId: auth.currentUser.uid,
      missao: aiData.diretrizes.missao,
      visao: aiData.diretrizes.visao,
      valores: aiData.diretrizes.valores,
      updatedAt: serverTimestamp()
    });
    console.log('diretrizes created.');
  } catch (err: any) {
    console.error('FAIL diretrizes:', err);
    throw new Error(`Falha em diretrizes: ${err.message}`);
  }

    // Já criado acima via aiData.employees se disponível, mas vamos garantir aqui se falhar
    console.log('employees setup handled via aiData.');

  try {
    const fluxoDiario = [];
    const contasPagar = [];
    const contasReceber = [];
    
    let saldo = monthlyRev * 0.5;
    
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dataStr = date.toISOString().split('T')[0];
      const entradas = (monthlyRev / 30) * (0.8 + Math.random() * 0.4);
      const saidas = (monthlyRev * 0.8 / 30) * (0.8 + Math.random() * 0.4);
      
      fluxoDiario.push({
        "Data": dataStr,
        "Saldo Inicial": saldo,
        "Entradas": entradas,
        "Saídas": saidas,
        "Saldo Final": saldo + entradas - saidas
      });
      saldo = saldo + entradas - saidas;
      
      if (i % 3 === 0) {
        contasPagar.push({
           clientId,
           vencimento: dataStr,
           emissao: dataStr,
           fornecedor: "Fornecedor " + i,
           documento: "NF-" + (1000 + i),
           valor: saidas * 1.5,
           status: i === 0 ? "Em atraso" : "A vencer",
           observação: "Gerado por IA"
        });
        contasReceber.push({
           clientId,
           vencimento: dataStr,
           emissao: dataStr,
           cliente: "Cliente " + i,
           documento: "FAT-" + (2000 + i),
           valor: entradas * 1.2,
           status: i === 0 ? "Em atraso" : "A vencer",
           observação: "Gerado por IA"
        });
      }
    }
    
    for (const p of contasPagar) {
      try {
        await addDoc(collection(db, 'payables'), {
          ...p, 
          ownerId: auth.currentUser!.uid, 
          createdBy: auth.currentUser!.uid, 
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } catch (err: any) {
        console.error('FAIL payable:', err, p);
        throw new Error(`Falha em payables: ${err.message}`);
      }
    }
    
    for (const r of contasReceber) {
      try {
        await addDoc(collection(db, 'receivables'), {
          ...r, 
          ownerId: auth.currentUser!.uid, 
          createdBy: auth.currentUser!.uid, 
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } catch (err: any) {
        console.error('FAIL receivable:', err, r);
        throw new Error(`Falha em receivables: ${err.message}`);
      }
    }
    
    try {
      await addDoc(collection(db, 'cash_flows'), {
        clientId,
        ownerId: auth.currentUser!.uid,
        Fluxo_Diario: fluxoDiario,
        Contas_Receber: contasReceber.map(r => ({ Vencimento: r.vencimento, Cliente: r.cliente, Valor: r.valor, Status: r.status })),
        Contas_Pagar: contasPagar.map(p => ({ Vencimento: p.vencimento, Fornecedor: p.fornecedor, Valor: p.valor, Status: p.status, Observação: p.observação })),
        Passivo_Vencido: [],
        KPIs: [],
        updatedAt: serverTimestamp()
      });
    } catch (err: any) {
      console.error('FAIL cash_flows:', err);
      throw new Error(`Falha em cash_flows: ${err.message}`);
    }
    
    try {
      const investment1 = monthlyRev * 5;
      await addDoc(collection(db, 'viability_projects'), {
        cl: clientId,
        ownerId: auth.currentUser!.uid,
        proj: "P0001",
        nome: "Abertura de nova filial",
        unidadeNegocio: "Varejo",
        filial: "Filial Sul",
        vpl: `R$ ${(investment1 * 1.5).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`,
        tir: "15.5%",
        payback: "24 meses",
        il: "1.5",
        conclusao: "Em Análise",
        fluxo: [
          { mes: 0, valor: -investment1, acumulado: -investment1 },
          { mes: 12, valor: investment1 * 0.4, acumulado: -investment1 * 0.6 },
          { mes: 24, valor: investment1 * 0.6, acumulado: 0 },
          { mes: 36, valor: investment1 * 0.8, acumulado: investment1 * 0.8 },
        ],
        paybackMesNum: 24,
        updatedAt: serverTimestamp()
      });

      const investment2 = monthlyRev * 8;
      await addDoc(collection(db, 'viability_projects'), {
        cl: clientId,
        ownerId: auth.currentUser!.uid,
        proj: "P0002",
        nome: "Ampliação da parte produtiva",
        unidadeNegocio: "Indústria",
        filial: "Matriz",
        vpl: `R$ ${(investment2 * 1.8).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`,
        tir: "18.2%",
        payback: "36 meses",
        il: "1.8",
        conclusao: "Em Execução",
        fluxo: [
          { mes: 0, valor: -investment2, acumulado: -investment2 },
          { mes: 12, valor: investment2 * 0.2, acumulado: -investment2 * 0.8 },
          { mes: 24, valor: investment2 * 0.3, acumulado: -investment2 * 0.5 },
          { mes: 36, valor: investment2 * 0.5, acumulado: 0 },
          { mes: 48, valor: investment2 * 0.8, acumulado: investment2 * 0.8 },
        ],
        paybackMesNum: 36,
        updatedAt: serverTimestamp()
      });
    } catch (err: any) {
      console.error('FAIL viability:', err);
      throw new Error(`Falha em viability_projects: ${err.message}`);
    }
    
    try {
      const positions = [
        { banco: "Itaú", saldoAtual: monthlyRev * 1.5 },
        { banco: "Bradesco", saldoAtual: monthlyRev * 0.8 },
        { banco: "Caixa Econômica", saldoAtual: monthlyRev * 0.5 }
      ];
      for (const pos of positions) {
        await addDoc(collection(db, 'financial_positions'), {
          clientId,
          banco: pos.banco,
          saldoAtual: pos.saldoAtual,
          updatedAt: serverTimestamp()
        });
      }
    } catch (err: any) {
      console.error('FAIL financial_positions:', err);
    }

    for (const emp of (aiData.employees || [])) {
      await addDoc(collection(db, 'employees'), {
        clientId,
        ownerId: auth.currentUser!.uid,
        nome: emp.nome,
        salarioBase: emp.salarioBase,
        updatedAt: serverTimestamp()
      });
    }
    console.log('employees created from aiData.');

    try {
      const purchasesData = [
        { produto: "Notebooks Corporativos", qtd: 5 },
        { produto: "Licenças Software XYZ", qtd: 10 },
        { produto: "Mobiliário de Escritório", qtd: 3 }
      ];
      for (const pur of purchasesData) {
        await addDoc(collection(db, 'purchases'), {
          clientId,
          produto: pur.produto,
          qtd: pur.qtd,
          updatedAt: serverTimestamp()
        });
      }
    } catch (err: any) {
      console.error('FAIL purchases:', err);
    }

    try {
      const currentYear = parseInt(currentYearMonth.split('-')[0]);
      const currentMonth = parseInt(currentYearMonth.split('-')[1]);
      
      const indicatorsData = [
        // Gestão Financeira
        { ind: "Liquidez Corrente", val: 1.2 + Math.random(), un: 'x', cat: 'Administração e Finanças' },
        { ind: "Endividamento Geral", val: 30 + Math.random() * 20, un: '%', cat: 'Administração e Finanças' },
        { ind: "PMR (Prazo Médio Recebimento)", val: 30 + Math.round(Math.random() * 15), un: 'dias', cat: 'Administração e Finanças' },
        
        // Cultura Organizacional
        { ind: "eNPS (Clima)", val: 60 + Math.random() * 30, un: 'pts', cat: 'Cultura Organizacional' },
        { ind: "Absenteísmo", val: 1 + Math.random() * 2, un: '%', cat: 'Cultura Organizacional' },
        
        // Gestão de Marketing
        { ind: "Custo por Lead (CPL)", val: 15 + Math.random() * 20, un: 'R$', cat: 'Gestão de Marketing' },
        { ind: "CAC (Custo de Aquisição)", val: monthlyRev * 0.05 / 10, un: 'R$', cat: 'Gestão de Marketing' },
        { ind: "ROI em Marketing", val: 3 + Math.random() * 4, un: 'x', cat: 'Gestão de Marketing' },
        
        // Comercial
        { ind: "Taxa de Conversão", val: 15 + Math.random() * 15, un: '%', cat: 'Gestão Comercial' },
        { ind: "Ticket Médio", val: 500 + Math.random() * 1000, un: 'R$', cat: 'Gestão Comercial' },
        { ind: "Churn Rate", val: 1 + Math.random() * 3, un: '%', cat: 'Gestão Comercial' },
        
        // Operação
        { ind: "OEE (Eficiência Global)", val: 70 + Math.random() * 20, un: '%', cat: 'Gestão Operacional' },
        { ind: "Nível de Serviço (SLA)", val: 90 + Math.random() * 9, un: '%', cat: 'Gestão Operacional' },
        { ind: "Desperdício/Perdas", val: 1 + Math.random() * 4, un: '%', cat: 'Gestão Operacional' },
        
        // Inovação
        { ind: "Índice de Vitalidade", val: 10 + Math.random() * 15, un: '%', cat: 'Gestão de Inovação' },
        { ind: "Projetos em Execução", val: 2 + Math.round(Math.random() * 3), un: 'un', cat: 'Gestão de Inovação' },
        
        // Governança e Compliance
        { ind: "Índice de Maturidade", val: 50 + Math.random() * 40, un: '%', cat: 'Governança Corporativa' },
        { ind: "Compliance Score", val: 70 + Math.random() * 25, un: '%', cat: 'Governança Corporativa' },
        { ind: "Tone at the Top", val: 60 + Math.random() * 30, un: '%', cat: 'Compliance', setor: 'Compliance' },
        { ind: "Gestão de Riscos", val: 40 + Math.random() * 40, un: '%', cat: 'Compliance', setor: 'Compliance' },
        { ind: "Comunicação", val: 30 + Math.random() * 50, un: '%', cat: 'Compliance', setor: 'Compliance' },
        { ind: "Canais de Denúncia", val: 50 + Math.random() * 40, un: '%', cat: 'Compliance', setor: 'Compliance' },
        { ind: "Diligência Terceiros", val: 20 + Math.random() * 60, un: '%', cat: 'Compliance', setor: 'Compliance' },
        { ind: "Privacidade/LGPD", val: 60 + Math.random() * 30, un: '%', cat: 'Compliance', setor: 'Compliance' }
      ];

      for (const ind of indicatorsData) {
        await addDoc(collection(db, 'indicators'), {
          clientId,
          createdBy: auth.currentUser!.uid,
          ano: currentYear,
          mes: currentMonth,
          ind: ind.ind,
          val: ind.val,
          un: ind.un,
          cat: ind.cat,
          setor: (ind as any).setor || '',
          sem: ind.val > 0 ? 'Verde' : 'Vermelho',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    } catch (err: any) {
      console.error('FAIL indicators:', err);
    }
    
    console.log('cash_flows, payables, receivables, viability created.');
  } catch (err: any) {
    if (!err.message.includes('Falha em')) {
      console.error('FAIL cash flow modules setup:', err);
      throw new Error(`Falha no setup de fluxo: ${err.message}`);
    }
    throw err;
  }

  try {
    for (const prod of (aiData.pricing || [])) {
      await addDoc(collection(db, 'precificacao'), {
        clientId,
        ownerId: auth.currentUser!.uid,
        nome: prod.nome,
        ncm: "8517.12.31", // NCM Simulado para impacto tributário
        precoVenda: Math.abs(prod.precoVenda) || 1,
        custosVariaveis: {},
        margemContribuicaoUnit: Math.abs(prod.precoVenda) * (Math.min(Math.abs(prod.margemContribuicaoPct), 99) / 100),
        margemContribuicaoPct: Math.min(Math.abs(prod.margemContribuicaoPct), 99),
        updatedAt: serverTimestamp()
      });
    }
    console.log('precificacao created.');
  } catch (err: any) {
    console.error('FAIL precificacao:', err);
    throw new Error(`Falha em precificacao: ${err.message}`);
  }

  try {
    for (const diag of (aiData.diagnostico || [])) {
      const g = Math.max(1, Math.min(5, Math.round(diag.gravidade)));
      const u = Math.max(1, Math.min(5, Math.round(diag.urgencia)));
      const t = Math.max(1, Math.min(5, Math.round(diag.tendencia)));
      const i = Math.max(1, Math.min(5, Math.round(diag.impactoFinanceiro)));
      
      await addDoc(collection(db, 'diagnostico'), {
        clientId,
        ownerId: auth.currentUser!.uid,
        descricao: diag.descricao,
        swot: getValidSwot(diag.swot),
        eixo: getValidEixo(diag.eixo),
        tipoRisco: 'Operacional',
        gravidade: g,
        urgencia: u,
        tendencia: t,
        impactoFinanceiro: i,
        iveScore: g * u * t * i,
        updatedAt: serverTimestamp()
      });
    }
    console.log('diagnostico created.');
  } catch (err: any) {
    console.error('FAIL diagnostico:', err);
    throw new Error(`Falha em diagnostico: ${err.message}`);
  }

  try {
    for (const okr of (aiData.okrs || [])) {
      await addDoc(collection(db, 'okrs'), {
        clientId,
        ownerId: auth.currentUser!.uid,
        titulo: okr.titulo,
        eixo: getValidEixo(okr.eixo),
        responsavel: okr.responsavel || 'CEO',
        periodo: 'Q1',
        progressoGeral: 0,
        keyResults: (okr.keyResults || []).slice(0, 25),
        updatedAt: serverTimestamp()
      });
    }
    console.log('okrs created.');
  } catch (err: any) {
    console.error('FAIL okrs:', err);
    throw new Error(`Falha em okrs: ${err.message}`);
  }

  // Payables and receivables: soft failure - don't block main seeder
  try {
    for (const payable of (aiData.payables || [])) {
      await addDoc(collection(db, 'payables'), {
        clientId,
        createdBy: auth.currentUser!.uid,
        fornecedor: String(payable.fornecedor || 'Fornecedor Simulado').substring(0, 199),
        documento: String(payable.documento || 'NF-001').substring(0, 99),
        valor: Math.max(1, Math.abs(Number(payable.valor) || 100)),
        vencimento: `${currentYearMonth}-15`,
        status: 'A vencer' as const,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
  } catch (err) {
    console.warn('Payables não criados (sem bloqueio):', err);
  }

  try {
    for (const rec of (aiData.receivables || [])) {
      await addDoc(collection(db, 'receivables'), {
        clientId,
        createdBy: auth.currentUser!.uid,
        cliente: String(rec.cliente || 'Cliente Simulado').substring(0, 199),
        documento: String(rec.documento || 'NF-001').substring(0, 99),
        valor: Math.max(1, Math.abs(Number(rec.valor) || 100)),
        vencimento: `${currentYearMonth}-10`,
        status: 'A vencer' as const,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
  } catch (err) {
    console.warn('Receivables não criados (sem bloqueio):', err);
  }

  // === NEW SEEDING: Budgets ===
  try {
    const budgetYears = [new Date().getFullYear(), new Date().getFullYear() + 1];
    for (const year of budgetYears) {
      for (let month = 1; month <= 12; month++) {
        // Create 2-3 budget items per month
        const accounts = DATA.accountPlanPadrão.slice(0, 3);
        for (const acc of accounts) {
          await addDoc(collection(db, 'budgets'), {
            clientId,
            year,
            month,
            accountId: '', // Will be matched by code/name in the UI usually, or we can just seed with generic data
            accountCode: acc.code,
            accountName: acc.name,
            unidade: 'Geral',
            filial: 'Matriz',
            centroCusto: 'Administrativo',
            valor: (aiData.historicalRevenueBase / 12) * 0.1 * (0.9 + Math.random() * 0.2),
            type: 'Budget',
            status: 'Approved',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            createdBy: auth.currentUser!.uid
          });
        }
      }
    }
    console.log('budgets created.');
  } catch (err) {
    console.warn('FAIL budgets:', err);
  }

  // === NEW SEEDING: Governance Diagnostics ===
  try {
    const mockResponses: Record<string, number> = {};
    GOVERNANCE_PRINCIPLES.forEach(p => {
      mockResponses[p.id] = 3 + Math.floor(Math.random() * 3); // 3-5 range
    });

    const axisScores: Record<string, number> = {};
    const axes = ['Governança Corporativa', 'Cultura Organizacional', 'Gestão Administrativa e Financeira', 'Gestão de Inovação', 'Gestão de Marketing', 'Gestão Comercial', 'Gestão Operacional'];
    axes.forEach(e => {
      axisScores[e] = 70 + Math.random() * 25;
    });

    const govDiagnosis = await generateGovernanceDiagnosis(axisScores, [], aiData.clientData.fantasia);
    
    await addDoc(collection(db, 'governance_diagnostics'), {
      clientId,
      date: serverTimestamp(),
      maturityScore: 75 + Math.random() * 15,
      alignmentScore: 80 + Math.random() * 10,
      classification: 'Consolidada',
      responses: mockResponses,
      diagnosis: govDiagnosis,
      axisScores: axisScores,
      createdAt: serverTimestamp()
    });
    console.log('governance_diagnostics created.');
  } catch (err) {
    console.warn('FAIL governance_diagnostics:', err);
  }

  // === NEW SEEDING: Asset Portfolio ===
  try {
    const assetsData = [
      { name: "CDB Liquidez Diária", category: "Renda Fixa", value: monthlyRev * 5, profit: monthlyRev * 0.05, status: "Stable", change: 0.88 },
      { name: "Fundo Ações ESG", category: "Ações", value: monthlyRev * 3, profit: monthlyRev * 0.15, status: "Bullish", change: 2.45 },
      { name: "Tesouro IPCA+ 2035", category: "Tesouro", value: monthlyRev * 4, profit: monthlyRev * 0.08, status: "Stable", change: 1.12 },
      { name: "COE Internacional S&P500", category: "Internacional", value: monthlyRev * 2, profit: -monthlyRev * 0.02, status: "Correction", change: -1.20 }
    ];

    for (const asset of assetsData) {
      await addDoc(collection(db, 'assets'), {
        clientId,
        ...asset,
        ownerId: auth.currentUser!.uid,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      });
    }
    console.log('assets created.');
  } catch (err) {
    console.warn('FAIL assets:', err);
  }

  return clientId;
};

const governanceDiagnosisSchema = {
  type: Type.OBJECT,
  properties: {
    resumoExecutivo: { type: Type.STRING },
    diagnosticoOrganizacional: { type: Type.STRING },
    principaisRiscos: { type: Type.ARRAY, items: { type: Type.STRING } },
    gargalosSistemicos: { type: Type.ARRAY, items: { type: Type.STRING } },
    desalinhamentosCriticos: { type: Type.ARRAY, items: { type: Type.STRING } },
    potenciaisOcultos: { type: Type.ARRAY, items: { type: Type.STRING } },
    recomendacoesPrioritarias: { type: Type.ARRAY, items: { type: Type.STRING } },
    planoAcaoSugerido: { type: Type.ARRAY, items: { type: Type.STRING } },
    correlacaoEntreEixos: { type: Type.STRING },
    parecerExecutivo: { type: Type.STRING }
  },
  required: [
    "resumoExecutivo", 
    "diagnosticoOrganizacional", 
    "principaisRiscos", 
    "gargalosSistemicos", 
    "desalinhamentosCriticos", 
    "potenciaisOcultos", 
    "recomendacoesPrioritarias", 
    "planoAcaoSugerido", 
    "correlacaoEntreEixos", 
    "parecerExecutivo"
  ]
};

export const generateGovernanceDiagnosis = async (
  scores: Record<string, number>, 
  indicators: any[],
  companyName: string
) => {
  try {
    const ai = getAI();
    
    const prompt = `Você é o ARQUITETO DE EVOLUÇÃO E DISCERNIMENTO ORGANIZACIONAL da Illumine.
Sua missão é gerar um Diagnóstico Sistêmico Profundo que transcenda a simples análise de números.

Siga o princípio: "DO TODO PARA A PARTE".
Considere a empresa como um organismo vivo onde Governança, Cultura, Estratégia e Operação estão intrinsecamente ligadas.

DADOS PARA ANÁLISE:
- Empresa: "${companyName}"
- MATURIDADE POR EIXO (Percepção): ${JSON.stringify(scores, null, 2)}
- INDICADORES REAIS (Realidade): ${JSON.stringify(indicators.slice(0, 15).map(i => ({ ind: i.ind, val: i.val, un: i.un })), null, 2)}

SUA TAREFA:
Gere um diagnóstico institucional de alto nível (C-Level) aplicando os 5 FILTROS DE COERÊNCIA:
1. SUSTENTABILIDADE ECONÔMICA: Os resultados financeiros sustentam o crescimento?
2. ALINHAMENTO AO DNA: A cultura e a estratégia refletem a identidade da empresa?
3. INTEGRIDADE DE GOVERNANÇA: Há transparência e responsabilidade institucional?
4. IMPACTO HUMANO/CULTURAL: Como a operação afeta as pessoas e o clima?
5. SUSTENTABILIDADE DE LONGO PRAZO: A estrutura atual garante a perenidade?

DIRETRIZES DE ESTILO E CONTEÚDO:
- Identifique INCOERÊNCIAS: Por exemplo, um alto score de maturidade em Cultura com indicadores de turnover elevados.
- Analise a CORRELAÇÃO ENTRE EIXOS: Como a fragilidade na Governança impacta a Eficiência Operacional.
- Use linguagem SOFISTICADA, profunda e estratégica.
- Foco em DISCERNIMENTO, LEGADO e RESPONSABILIDADE.
- Evite termos motivacionais, genéricos ou superficiais.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: governanceDiagnosisSchema as any,
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Governance Diagnosis Error:", error);
    return {
      resumoExecutivo: "A organização apresenta um nível de maturidade em estruturação, com pontos de atenção em Governança.",
      diagnosticoOrganizacional: "Equilíbrio moderado entre os eixos, mas com gargalos na operação.",
      principaisRiscos: ["Risco de centralização decisória", "Passivo oculto por falta de compliance"],
      gargalosSistemicos: ["Lentidão na resposta comercial"],
      desalinhamentosCriticos: ["Diferença entre discurso ético e prática financeira"],
      potenciaisOcultos: ["Alta capacidade de inovação subutilizada"],
      recomendacoesPrioritarias: ["Fortalecer rituais de Accountability", "Revisar precificação"],
      planoAcaoSugerido: ["Implantar conselho consultivo em 90 dias"],
      correlacaoEntreEixos: "A fragilidade financeira está impactando a capacidade de inovação.",
      parecerExecutivo: "Foco imediato na estruturação de processos de governança para sustentar o crescimento."
    };
  }
};

export interface AIFinancialDocument {
  type: string;
  year: number;
  month: number;
  cnpj?: string;
  confidenceScore?: number;
  periodoDocumento?: string;
  entries: { category: string; value: number }[];
}

export const parseFinancialStatementWithAI = async (text: string, customInstructions?: string): Promise<AIFinancialDocument[]> => {
  try {
    console.log(`[AI] Processing text of length: ${text.length}. Preview: ${text.substring(0, 500)}...`);
    if (text.length < 50) {
      console.warn("[AI] Text is too short, document might be an image/scanned PDF without OCR.");
    }

    const ai = getAI();
    
    const customPromptSection = customInstructions?.trim() ? `
INSTRUÇÕES ESPECÍFICAS DESTE CLIENTE (TREINAMENTO DE LEITURA):
"""
${customInstructions}
"""
Atenção máxima a estas instruções! Elas descrevem o padrão exato de como este cliente formata seus relatórios. Use-as para mapear colunas, encontrar contas ou ignorar lixos do PDF.
` : '';

    const prompt = `Você é um CFO Especialista em Auditoria e Contabilidade. 
Sua tarefa é ler o texto extraído de um documento contábil e estruturá-lo em dados financeiros.

REGRAS DE OURO PARA ESTE DOCUMENTO:
1. LAYOUT MULTI-COLUNA E MULTI-ANO: O texto frequentemente contém duas colunas de valores (ex: 2024 e 2025). Você DEVE criar um objeto de documento DISTINTO para CADA ANO.
2. DOCUMENTOS MISTOS (BP + DRE): É extremamente comum que o mesmo PDF contenha o Balanço Patrimonial nas primeiras páginas e a DRE nas páginas seguintes. Você DEVE separar isso! Se encontrar contas de Ativo/Passivo e também contas de Receita/Despesa, gere objetos separados.
   Exemplo esperado para um PDF com BP e DRE de 2024 e 2025:
   - Objeto 1: type="Balanço Patrimonial", year=2024
   - Objeto 2: type="Balanço Patrimonial", year=2025
   - Objeto 3: type="DRE", year=2024
   - Objeto 4: type="DRE", year=2025
3. TIPOS VÁLIDOS: O campo "type" DEVE ser estritamente "Balanço Patrimonial" ou "DRE" ou "DFC". Não invente outros tipos.
4. IDENTIFICAÇÃO DE VALORES: Se uma linha tem "Categoria Valor1 Valor2", o Valor1 pertence ao ano anterior e o Valor2 ao ano mais recente.
5. SINAIS NEGATIVOS: Fique atento a sinais de menos "-" soltos entre o nome da conta e o valor, ou nomes de conta que começam com "(-)". Esses valores DEVEM ser retornados como números NEGATIVOS.
6. FORMATO NUMÉRICO: Converta o padrão brasileiro (1.234,56) para o padrão computacional (1234.56).
7. MÊS: Use 12 para balanços e DREs de encerramento de exercício, a menos que o texto indique outro mês.
8. METADADOS OBRIGATÓRIOS: Você deve retornar o nível de confiança (confidenceScore) da sua extração (0-100). Se o PDF parece ilegível ou muito confuso, diminua a nota.
9. CNPJ e PERÍODO: Tente localizar o CNPJ e o texto literal do período da demonstração e retorne nas propriedades correspondentes.
${customPromptSection}
TEXTO EXTRAÍDO:
"""
${text}
"""

Retorne os dados seguindo estritamente o schema JSON definido.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: financialStatementSchema as any,
      }
    });

    const aiText = response.text;
    console.log(`[AI] Raw Response:`, aiText);
    
    if (!aiText) {
      throw new Error("A Inteligência Artificial retornou uma resposta vazia.");
    }

    const data = JSON.parse(aiText);
    const docs = data.documents || [];
    
    if (docs.length === 0) {
      throw new Error(`A IA não encontrou dados válidos no texto extraído. (Caracteres lidos do PDF: ${text.length}). Se o número de caracteres for muito baixo (ex: < 100), significa que o PDF é uma "foto" ou imagem digitalizada e não contém texto selecionável (necessita OCR).`);
    }

    return docs as AIFinancialDocument[];
  } catch (error) {
    console.error("AI Financial Parsing Error:", error);
    throw error;
  }
};
