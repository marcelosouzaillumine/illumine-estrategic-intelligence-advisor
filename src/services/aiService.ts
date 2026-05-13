import { GoogleGenAI, Type } from '@google/genai';
import { db, auth } from '../lib/firebase';
import { collection, doc, writeBatch, serverTimestamp, setDoc, addDoc } from 'firebase/firestore';
import { DATA } from '../data';

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
  required: ["clientData", "assumptions", "historicalRevenueBase", "ebitdaMargin", "strategicReport", "diretrizes", "employees", "pricing", "payables", "receivables", "diagnostico", "okrs"]
};

export const generateAICompanyPayload = async (segment: string, description: string = ''): Promise<AICompanyData> => {
  try {
    const ai = getAI();
    
    const prompt = `Você é um CFO sênior, Consultor Estratégico e RH atuando na criação de uma Empresa Modelo.
SEGMENTO: "${segment}"
CARACTERÍSTICAS/RELATO: "${description}"

Crie uma empresa realista e SISTÊMICA. Os dados devem estar INTEGRADOS: se o relato diz que a empresa tem problemas de caixa, o faturamento e as contas a pagar/receber devem refletir isso.

Siga exatamente as diretrizes:
1. clientData.regime DEVE ser exatamente um destes: "Lucro Real", "Lucro Presumido", "Simples Nacional".
2. Defina CNAE válido e faturamento mensal coerente com o porte e segmento.
3. Gere 3 funcionários (employees) com salários condizentes com a descrição.
4. Gere 2 produtos principais (pricing) com margens realistas (ex: 45 para 45%).
5. Gere 2 contas a pagar (payables) e 2 a receber (receivables). Se o relato menciona problemas de caixa, crie valores que justifiquem isso.
6. Gere Missão, Visão e Valores alinhados com o relato.
7. Gere 2 itens de diagnóstico empresarial (IVE). (swot DEVE ser: "Força", "Fraqueza", "Oportunidade" ou "Ameaça". eixo DEVE ser "Comercial", "Operacional", "Gestão Financeira", etc. gravidade, urgencia, tendencia, impactoFinanceiro entre 1 e 5). Devem refletir os desafios do relato.
8. Gere 1 OKR estratégico (eixo DEVE ser "Comercial", "Operacional", "Inovação", etc) que ajude a resolver um dos problemas citados.
9. Gere relatório estratégico completo (desafios, oportunidades, governança, fluxo operacional).
10. Defina historicalRevenueBase e ebitdaMargin que façam sentido com o segmento e o momento da empresa descrito.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: companySchema,
      }
    });

    if (!response.text) {
      throw new Error("Erro ao gerar conteúdo com a IA.");
    }

    return JSON.parse(response.text) as AICompanyData;
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
      { descricao: "Forte posicionamento de mercado", swot: "Força", eixo: "Comercial", gravidade: 1, urgencia: 1, tendencia: 1, impactoFinanceiro: 4 },
      { descricao: "Dependência de poucos fornecedores", swot: "Fraqueza", eixo: "Operacional", gravidade: 4, urgencia: 3, tendencia: 3, impactoFinanceiro: 3 }
    ],
    okrs: [
      { 
        titulo: "Expansão de Market Share", 
        eixo: "Comercial", 
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
  const getValidEixo = (val: string) => ['Governança', 'Cultura', 'Gestão', 'Inovação', 'Marketing', 'Comercial', 'Operação'].includes(val) ? val : 'Comercial';

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
    
    const monthlyRev = baseRevenue / 12;
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
        { ind: "Liquidez Corrente", val: 1.2 + Math.random(), un: 'x', cat: 'Gestão' },
        { ind: "Endividamento Geral", val: 30 + Math.random() * 20, un: '%', cat: 'Gestão' },
        { ind: "PMR (Prazo Médio Recebimento)", val: 30 + Math.round(Math.random() * 15), un: 'dias', cat: 'Gestão' },
        
        // Cultura
        { ind: "Turnover Rate (%)", val: 3 + Math.random() * 5, un: '%', cat: 'Cultura' },
        { ind: "eNPS (Clima)", val: 60 + Math.random() * 30, un: 'pts', cat: 'Cultura' },
        { ind: "Absenteísmo", val: 1 + Math.random() * 2, un: '%', cat: 'Cultura' },
        
        // Marketing
        { ind: "Custo por Lead (CPL)", val: 15 + Math.random() * 20, un: 'R$', cat: 'Marketing' },
        { ind: "CAC (Custo de Aquisição)", val: monthlyRev * 0.05 / 10, un: 'R$', cat: 'Marketing' },
        { ind: "ROI em Marketing", val: 3 + Math.random() * 4, un: 'x', cat: 'Marketing' },
        
        // Comercial
        { ind: "Taxa de Conversão", val: 15 + Math.random() * 15, un: '%', cat: 'Comercial' },
        { ind: "Ticket Médio", val: 500 + Math.random() * 1000, un: 'R$', cat: 'Comercial' },
        { ind: "Churn Rate", val: 1 + Math.random() * 3, un: '%', cat: 'Comercial' },
        
        // Operação
        { ind: "OEE (Eficiência Global)", val: 70 + Math.random() * 20, un: '%', cat: 'Operação' },
        { ind: "Nível de Serviço (SLA)", val: 90 + Math.random() * 9, un: '%', cat: 'Operação' },
        { ind: "Desperdício/Perdas", val: 1 + Math.random() * 4, un: '%', cat: 'Operação' },
        
        // Inovação
        { ind: "Índice de Vitalidade", val: 10 + Math.random() * 15, un: '%', cat: 'Inovação' },
        { ind: "Projetos em Execução", val: 2 + Math.round(Math.random() * 3), un: 'un', cat: 'Inovação' },
        
        // Governança
        { ind: "Índice de Maturidade", val: 50 + Math.random() * 40, un: '%', cat: 'Governança' },
        { ind: "Compliance Score", val: 70 + Math.random() * 25, un: '%', cat: 'Governança' }
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

  return clientId;
};
