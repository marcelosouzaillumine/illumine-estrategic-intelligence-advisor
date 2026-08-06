type FinancialMetrics = any;
import { BPSummary } from '../../../lib/bpEngine';
import { evaluateExecutiveCausality } from '../../../lib/executive-causality-engine';
import { BusinessIdentity } from '../../../lib/business-identity-engine';

export interface CausalityAdapterOutput {
  event: string;
  rootCause: string;
  financialPropagation: string;
  absorptionCapacity: string;
  strategicImpact: string;
  insights: {
    category: string;
    text: string;
    colorClass: string;
    bgClass: string;
    dotClass: string;
  }[];
}

export function translateCausalityInterpretation(
  metrics: FinancialMetrics | undefined,
  bpSummary: BPSummary | undefined,
  scores: any,
  identity: BusinessIdentity
): CausalityAdapterOutput {
  
  if (!metrics || !metrics.hasData || !bpSummary) {
    return {
      event: 'Dados insuficientes para análise de eventos',
      rootCause: 'Dados insuficientes para identificar a causa raiz',
      financialPropagation: 'Dados insuficientes para avaliar a propagação financeira',
      absorptionCapacity: 'Dados insuficientes para determinar a capacidade de absorção',
      strategicImpact: 'Dados insuficientes para projetar o impacto estratégico',
      insights: []
    };
  }

  const executiveCausality = evaluateExecutiveCausality(metrics, bpSummary, scores, identity);
  const { narrativeChain, financialElasticity, liquidityPressure, vulnerabilities, inferredTensions, masterCausality } = executiveCausality;

  // Extrair evento primário (ex: PRESSAO_ESTRUTURAL ou contexto mais grave)
  let event = 'Estabilidade Operacional';
  if (masterCausality && masterCausality.scenarios.length > 0) {
    // Pega o contexto de maior gravidade ou o primeiro
    const criticalScenarios = masterCausality.scenarios.filter(s => s.severity === 'Alta' || s.severity === 'Crítica');
    if (criticalScenarios.length > 0) {
      event = criticalScenarios[0].name;
    } else {
      event = masterCausality.scenarios[0].name;
    }
  } else if (inferredTensions.length > 0 && inferredTensions[0] !== 'Tensões operacionais sob controle institucional.') {
    event = inferredTensions[0];
  }

  const rootCause = narrativeChain.causa || 'Ciclo financeiro em estabilidade estrutural provisória.';
  const financialPropagation = narrativeChain.pressao || 'O balanço atende às exigências vigentes sem gerar déficit crônico.';
  const absorptionCapacity = financialElasticity.narrative || 'Capacidade moderada de absorção de choques de ciclo imediato.';
  const strategicImpact = narrativeChain.consequencia ? `${narrativeChain.consequencia} ${narrativeChain.decisao}` : 'As condições atuais suportam a continuidade, mas exigem governança no giro.';

  const insights = [];

  if (vulnerabilities.length > 0 && vulnerabilities[0] !== 'Vulnerabilidades absorvidas pela resiliência do balanço.') {
    insights.push({
      category: 'Vulnerabilidade Primária',
      text: vulnerabilities[0],
      colorClass: 'text-rose-600',
      bgClass: 'bg-rose-100',
      dotClass: 'bg-rose-500'
    });
  }

  if (liquidityPressure.status !== 'Segura') {
    insights.push({
      category: 'Pressão de Liquidez',
      text: liquidityPressure.narrative,
      colorClass: liquidityPressure.status === 'Severa' ? 'text-red-600' : 'text-amber-600',
      bgClass: liquidityPressure.status === 'Severa' ? 'bg-red-100' : 'bg-amber-100',
      dotClass: liquidityPressure.status === 'Severa' ? 'bg-red-500' : 'bg-amber-500'
    });
  } else {
    insights.push({
      category: 'Tranquilidade Operacional',
      text: liquidityPressure.narrative,
      colorClass: 'text-emerald-600',
      bgClass: 'bg-emerald-100',
      dotClass: 'bg-emerald-500'
    });
  }

  return {
    event,
    rootCause,
    financialPropagation,
    absorptionCapacity,
    strategicImpact,
    insights
  };
}
