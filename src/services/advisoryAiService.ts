
import { GoogleGenAI } from "@google/genai";
import { FinancialPattern } from "../lib/financialIntelligence";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface AdvisoryReportRequest {
  clientName: string;
  industry: string;
  month: string;
  year: number;
  metrics: Record<string, number | string>;
  patterns: FinancialPattern[];
  mvv?: { missao: string; visao: string; valores: string[] };
  topDiagnostico?: string[];
  okrsEmRisco?: string[];
}

export async function generateAdvisoryParecer(req: AdvisoryReportRequest): Promise<string> {
  try {
    const prompt = `
      Você é um CFO Estratégico e Consultor Sênior de uma Big 4 (como Deloitte ou McKinsey).
      Sua tarefa é gerar um "Parecer Executivo" para o cliente ${req.clientName}, do setor ${req.industry}, referente a ${req.month}/${req.year}.

      DADOS FINANCEIROS DO PERÍODO:
      ${JSON.stringify(req.metrics, null, 2)}

      PADRÕES DETECTADOS PELO SISTEMA:
      ${req.patterns.map(p => `- ${p.name}: ${p.description}`).join('\n')}

      CONTEXTO ESTRATÉGICO (DIRETRIZES MVV):
      - Missão: ${req.mvv?.missao || 'Não informada'}
      - Visão: ${req.mvv?.visao || 'Não informada'}
      - Valores: ${req.mvv?.valores?.join(', ') || 'Não informados'}

      PRINCIPAIS RISCOS/PROBLEMAS (DIAGNÓSTICO):
      ${req.topDiagnostico?.map(d => `- ${d}`).join('\n') || 'Nenhum item crítico.'}

      OKRs EM RISCO:
      ${req.okrsEmRisco?.map(o => `- ${o}`).join('\n') || 'Nenhum OKR em risco crítico.'}

      DIRETRIZES DO RELATÓRIO:
      1. Integre os números financeiros com o propósito da empresa (Missão/Visão). O parecer deve mostrar como o financeiro está ajudando ou atrapalhando a atingir a Visão.
      2. Seja direto, técnico mas acessível, e altamente propositivo.
      3. Explique a "Implicação Estratégica" dos números.
      4. Considere os itens do Diagnóstico e OKRs em risco para fundamentar as recomendações.
      5. Termine com 3 recomendações claras de curto prazo (Quick Wins).
      6. O tom deve ser de "Advisor de Confiança".
      7. Use Português do Brasil.
      8. Formate em Markdown (mas não use # de título, use apenas negrito e listas).

      GERAR PARECER:
    `;

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
    });

    return response.text || "Não foi possível extrair o texto do parecer.";
  } catch (error) {
    console.error("AI Advisory Service Error:", error);
    return "Não foi possível gerar um parecer automático no momento. Por favor, revise manualmente os indicadores destacados no dashboard.";
  }
}
