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

