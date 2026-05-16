import { auth } from "../lib/firebase";
import { GoogleGenAI } from '@google/genai';

export interface GovernanceParecerRequest {
  clientName: string;
  industry: string;
  metrics: Record<string, number | string>;
  topPrinciples: string[];
  scenarios?: string[];
}

const getAI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export async function generateGovernanceParecer(req: GovernanceParecerRequest): Promise<string> {
  const ai = getAI();

  if (!ai) {
    // Fallback inteligente se a API key do Gemini não estiver configurada
    return new Promise(resolve => {
      setTimeout(() => {
        const metrics = req.metrics;
        const netProfit = typeof metrics['Lucro Líquido'] === 'number' ? metrics['Lucro Líquido'] : 0;
        const cashBalance = typeof metrics['Saldo de Caixa Real'] === 'number' ? metrics['Saldo de Caixa Real'] : 
                            typeof metrics['Saldo de Caixa'] === 'number' ? metrics['Saldo de Caixa'] : 0;
        
        let insight = `Com base nos resultados atuais da ${req.clientName}, observamos uma oportunidade clara de fortalecer os fundamentos de ${req.topPrinciples.slice(0, 2).join(' e ')}. `;
        
        if (netProfit > 0 && cashBalance < netProfit) {
          insight += `Detectamos uma divergência entre o lucro econômico e a disponibilidade financeira efetiva. Isso sugere que a lucratividade pode estar retida em ativos não líquidos, exigindo cautela na expansão e foco em eficiência de recebimento. `;
        } else if (netProfit > 0) {
          insight += `A saúde econômica está preservada, permitindo que a organização foque em investimentos estruturais e no fortalecimento da cultura de governança. `;
        }

        insight += `A situação exige atenção aos fundamentos de sustentabilidade para garantir a perenidade institucional. Sugerimos focar em processos que resguardem a integridade operacional enquanto promovem uma cultura de responsabilidade e legado.`;

        resolve(insight);
      }, 1000);
    });
  }

  try {
    const prompt = `Você é o MOTOR DE INTELIGÊNCIA ORGANIZACIONAL SISTÊMICA da Illumine.
Sua função não é apenas interpretar indicadores, mas gerar DISCERNIMENTO EMPRESARIAL profundo e estratégico.

Sua análise deve seguir obrigatoriamente o princípio: "DO TODO PARA A PARTE".
Nenhum indicador deve ser lido isoladamente. Cada dado é uma dimensão parcial de um organismo vivo.

CONTEXTO DA ANÁLISE:
- Empresa: ${req.clientName}
- Setor: ${req.industry}
- Eixo em Foco: Governança Representativa e Integridade

DADOS DO MOMENTO (KPIs):
${Object.entries(req.metrics).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

FILTROS DE PRINCÍPIOS (Integrados e Complementares):
${req.topPrinciples.map(p => `- ${p}`).join('\n')}
${req.scenarios && req.scenarios.length > 0 ? `\nDILEMAS E CENÁRIOS SITUACIONAIS:\n${req.scenarios.map(s => `- ${s}`).join('\n')}` : ''}

SUA TAREFA:
Gere um "PARECER DE DISCERNIMENTO SISTÊMICO" (2 a 3 parágrafos sofisticados) que:

1. AVALIE A COERÊNCIA ORGANIZACIONAL: Cruze os KPIs com os Princípios. Se o financeiro está positivo mas a governança está frouxa, identifique o risco invisível.
2. APLIQUE OS 5 FILTROS: Sua análise deve considerar (mesmo que implicitamente) a Sustentabilidade Econômica, Alinhamento ao DNA, Integridade de Governança, Impacto Humano/Cultural e Sustentabilidade de Longo Prazo.
3. INTERPRETE RELAÇÕES DE CAUSA E EFEITO: Como a maturidade neste eixo afeta a perenidade institucional?
4. DETECTE INCOERÊNCIAS: Identifique sinais de fadiga, centralização excessiva ou desalinhamento entre resultados e propósito.

ESTILO E TOM:
- Linguagem executiva, sofisticada, técnica e profunda.
- Evite jargões motivacionais ou superficiais.
- Tom humanizado, mas rigorosamente institucional.
- Foco em legado, responsabilidade e maturidade organizacional.

Não use saudações. Vá direto ao discernimento estratégico.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        temperature: 0.6, // Reduzido ligeiramente para maior consistência estratégica
      }
    });

    return response.text || "Análise de Discernimento indisponível no momento.";
  } catch (error) {
    console.error("AI Governance Service Error:", error);
    return `O Motor de Inteligência encontrou uma oscilação técnica. Contudo, os indicadores de ${req.topPrinciples.slice(0, 1)} sugerem a necessidade de uma revisão estratégica dos processos de governança para assegurar o alinhamento institucional.`;
  }
}
