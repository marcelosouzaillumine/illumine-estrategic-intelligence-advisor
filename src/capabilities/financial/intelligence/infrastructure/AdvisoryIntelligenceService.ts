
import { auth } from "../../../../lib/firebase";
import { FinancialPattern } from "../../../../lib/financialIntelligence";

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
  const endpoint = import.meta.env.VITE_ADVISORY_API_URL || "/api/generate-advisory-parecer";
  const user = auth.currentUser;
  if (!user) {
    return "Faça login para gerar o parecer automático.";
  }

  try {
    const token = await user.getIdToken();
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(req),
    });
    if (!response.ok) {
      throw new Error(`advisory_api_failed_${response.status}`);
    }

    const body = await response.json();
    return body.text || "Evidências indisponíveis.";
  } catch (error) {
    console.error("AI Advisory Service Error:", error);
    return "Estado indisponível. Por favor, revise manualmente os indicadores destacados no dashboard.";
  }
}
