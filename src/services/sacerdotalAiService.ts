import { auth } from "../lib/firebase";
import { GoogleGenAI } from '@google/genai';

export interface SacerdotalParecerRequest {
  clientName: string;
  industry: string;
  metrics: Record<string, number | string>;
  topPrinciples: string[];
}

const getAI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export async function generateSacerdotalParecer(req: SacerdotalParecerRequest): Promise<string> {
  const ai = getAI();

  if (!ai) {
    // Fallback se a API key do Gemini não estiver configurada
    return new Promise(resolve => {
      setTimeout(() => {
        const kpiKeys = Object.keys(req.metrics);
        const kpiText = kpiKeys.length > 0 ? `Com os números atuais apontando para ${kpiKeys[0]} de ${req.metrics[kpiKeys[0]]}, ` : '';
        const principlesText = req.topPrinciples.length > 0 ? req.topPrinciples.slice(0, 2).join(' e ') : 'Mordomia e Prudência';

        resolve(`Com base nos resultados atuais da ${req.clientName}, observamos uma oportunidade clara de fortalecer os princípios de ${principlesText}. ${kpiText}a situação exige atenção aos detalhes operacionais para garantir a sustentabilidade estrutural do eixo. Sugerimos focar em processos que resguardem a qualidade da entrega enquanto promovem uma cultura de responsabilidade entre as lideranças.`);
      }, 1500);
    });
  }

  try {
    const prompt = `Você é o Motor de Inteligência Sacerdotal (Illumine Advisor), um consultor empresarial especializado em aplicar princípios bíblicos milenares à gestão moderna de negócios.

Você está analisando a empresa: ${req.clientName} (Setor: ${req.industry}).

Os indicadores atuais (KPIs) do segmento analisado são:
${Object.entries(req.metrics).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

Os Princípios Sacerdotais que regem este eixo estratégico são:
${req.topPrinciples.map(p => `- ${p}`).join('\n')}

Sua tarefa:
Gere uma "Perspectiva Sacerdotal Integrada" (cerca de 2 a 3 parágrafos curtos) conectando diretamente os resultados e dores indicados pelos KPIs com os princípios bíblicos informados.
Seja prático, executivo e inspirador. Não faça pregações religiosas. A linguagem deve ser de alta governança corporativa e você DEVE inserir insights práticos que façam total sentido e sejam aplicáveis ao setor de atuação do cliente (${req.industry}).
Diga como a aplicação prática desse princípio pode resolver a dor ou alavancar os indicadores mostrados no contexto da indústria do cliente.

Não use saudações. Vá direto para a análise.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "Análise Sacerdotal indisponível no momento.";
  } catch (error) {
    console.error("AI Sacerdotal Service Error:", error);
    return "Não foi possível gerar um parecer automático no momento. Por favor, revise manualmente o alinhamento com os princípios.";
  }
}
