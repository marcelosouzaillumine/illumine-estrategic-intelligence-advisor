import { ExecutiveAssessmentResult } from './LiquidityExecutiveAssessmentEngine';
import { ExecutiveNarrativeVariations } from './ExecutiveNarrativeVariations';

export class AssetQualityExecutiveAssessmentEngine {
  public static assess(indicators: any[], bpSummary: any): ExecutiveAssessmentResult {
    const findValue = (name: string) => Number(indicators?.find(i => i.metricName === name)?.value || 0);
    
    // Qualidade do Ativo: concentração em estoques 35%, caixa/disponível 25%, imobilização 20%, concentração de contas críticas 20%.
    const ativoTotal = bpSummary?.ativoTotal || 1;
    const ativoCirculante = bpSummary?.ativoCirculante || 1;
    
    const concentracaoEstoque = (bpSummary?.estoques || 0) / ativoCirculante;
    const caixaDisponivel = (bpSummary?.caixaEquivalentes || 0) / ativoTotal;
    const imobilizacao = (bpSummary?.ativoNaoCirculante || 0) / ativoTotal;
    const contasCriticas = ((bpSummary?.clientes || 0) + (bpSummary?.outrosCreditos || 0)) / ativoCirculante;
    
    // Normalize heuristically
    // Lower stock concentration is better
    const normEstoque = Math.min(Math.max((1 - concentracaoEstoque) * 100, 0), 100);
    // Higher cash available is better up to a point
    const normCaixa = Math.min(Math.max((caixaDisponivel / 0.2) * 100, 0), 100);
    // Lower imobilizacao is generally better for liquidity/quality unless it's a heavy asset industry. We'll use a standard heuristic.
    const normImob = Math.min(Math.max((1 - imobilizacao) * 100, 0), 100);
    // Lower critical accounts concentration is better
    const normCriticas = Math.min(Math.max((1 - contasCriticas) * 100, 0), 100);

    const score = (normEstoque * 0.35) + (normCaixa * 0.25) + (normImob * 0.20) + (normCriticas * 0.20);
    
    let healthStatus: 'EXCELLENT' | 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'NEUTRAL' | 'INSUFFICIENT_DATA' = 'HEALTHY';
    let primaryDriverKpi = 'Imobilização do Ativo';

    if (score >= 80) {
      healthStatus = 'EXCELLENT';
      primaryDriverKpi = 'Caixa/Ativo';
    } else if (score >= 50) {
      healthStatus = 'HEALTHY';
      primaryDriverKpi = 'Imobilização do Ativo';
    } else if (score >= 30) {
      healthStatus = 'WARNING';
      primaryDriverKpi = 'Concentração de Estoques';
    } else {
      healthStatus = 'CRITICAL';
      primaryDriverKpi = 'Imobilização do Ativo';
    }

    const narrative = ExecutiveNarrativeVariations.get('ASSET_QUALITY', healthStatus, bpSummary);
    const primaryDriver = narrative.primaryDriver;
    const executiveNarrative = narrative.executiveNarrative;
    const justification = narrative.justification;
    const managerialImplication = narrative.managerialImplication ?? narrative.justification;
    const priorityAction = narrative.priorityAction;

    return {
      healthStatus,
      score: Math.round(score),
      primaryDriver,
      primaryDriverKpi,
      executiveNarrative,
      justification,
      managerialImplication,
      priorityAction,
      confidence: 'Alta'
    };
  }
}
