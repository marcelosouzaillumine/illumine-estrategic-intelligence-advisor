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
    // Fallback se a API key do Gemini não estiver configurada
    return new Promise(resolve => {
      setTimeout(() => {
        const kpiKeys = Object.keys(req.metrics);
        const kpiText = kpiKeys.length > 0 ? `Com os números atuais apontando para ${kpiKeys[0]} de ${req.metrics[kpiKeys[0]]}, ` : '';
        const principlesText = req.topPrinciples.length > 0 ? req.topPrinciples.slice(0, 2).join(' e ') : 'Integridade e Prudência';

        resolve(`Com base nos resultados atuais da ${req.clientName}, observamos uma oportunidade clara de fortalecer os fundamentos de ${principlesText}. ${kpiText}a situação exige atenção aos detalhes operacionais para garantir a sustentabilidade estrutural do eixo. Sugerimos focar em processos que resguardem a qualidade da entrega enquanto promovem uma cultura de responsabilidade entre as lideranças.`);
      }, 1500);
    });
  }

  try {
    const prompt = `Você é o Motor de Inteligência de Governança (Illumine Advisor), um consultor empresarial sênior especializado em aplicar fundamentos institucionais e princípios universais de gestão à governança corporativa moderna.

Você está analisando a empresa: ${req.clientName} (Setor: ${req.industry}).

Os indicadores atuais (KPIs) do segmento analisado são:
${Object.entries(req.metrics).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

Os Princípios de Governança que regem este eixo estratégico são:
${req.topPrinciples.map(p => `- ${p}`).join('\n')}
${req.scenarios && req.scenarios.length > 0 ? `\nConsidere também estas Situações Reais/Simulações de Decisão relacionadas:\n${req.scenarios.map(s => `- ${s}`).join('\n')}` : ''}

Sua tarefa:
Gere uma "Perspectiva de Governança Integrada" (cerca de 2 a 3 parágrafos curtos) conectando diretamente os resultados e dores indicados pelos KPIs com os princípios de gestão informados.

DIRETRIZES DE ESTILO:
1. Seja prático, executivo, institucional e propositivo.
2. Não utilize linguagem devocional, religiosa ou de pregação.
3. A linguagem deve ser de alta governança corporativa (C-Level).
4. Insira insights práticos que sejam aplicáveis ao setor de atuação do cliente (${req.industry}).
5. Demonstre como a aplicação desses princípios pode resolver gargalos operacionais ou alavancar os indicadores de performance.

Não use saudações. Vá direto para a análise executiva.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "Análise de Governança indisponível no momento.";
  } catch (error) {
    console.error("AI Governance Service Error:", error);
    return "Não foi possível gerar um parecer automático no momento. Por favor, revise manualmente o alinhamento com os princípios de governança.";
  }
}
