import { PatrimonialIndicator } from './BalanceSheetFinancialMetricsEngine';
import { PatrimonialScoreBreakdown } from './PatrimonialScoreExplainabilityEngine';

export interface PatrimonialInterpretationOutput {
  patrimonialThesis: string;
  executivePlan: string;
  planFinanceiro: { prazo: string; acao: string };
  planOperacional: { prazo: string; acao: string };
  planGovernanca: { prazo: string; acao: string };
  dominantRiskFamily: string;
  strategicSeverity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'MONITORING';
  strategicSeverityReason: string;
  overallDisclaimer: string | null;
  rationale: string;
  confidence: number;
  lineageHash: string;
  sourceRuntime: string;
}

export class PatrimonialExecutiveInterpretationEngine {
  public static generateInterpretations(
    indicators: PatrimonialIndicator[],
    breakdown: PatrimonialScoreBreakdown,
    ceilingApplied?: boolean,
    hasValidatedCashFlowEvidence: boolean = false,
    isOperationalCashFlowPositive: boolean = false
  ): PatrimonialInterpretationOutput {
    
    // Extracted values for evaluation
    const score = breakdown.globalScore ?? 0;
    const liqReal = indicators.find(i => i.metricName === 'Liquidez Real')?.value as number | 'INSUFFICIENT_DATA';
    const liqSeca = indicators.find(i => i.metricName === 'Liquidez Seca')?.value as number | 'INSUFFICIENT_DATA';
    const lossAbsorption = indicators.find(i => i.metricName === 'Loss Absorption Capacity')?.value as number | 'INSUFFICIENT_DATA';
    const endivGeral = indicators.find(i => i.metricName === 'Endividamento Geral')?.value as number | 'INSUFFICIENT_DATA';
    const compEndiv = indicators.find(i => i.metricName === 'Composição do Endividamento')?.value as number | 'INSUFFICIENT_DATA';
    const equityQuality = indicators.find(i => i.metricName === 'Equity Quality Index')?.classification || '';
    const estoqueConc = indicators.find(i => i.metricName === 'Ativo - Estoques %')?.value as number | 'INSUFFICIENT_DATA';
    const debtCapacity = indicators.find(i => i.metricName === 'Debt Capacity Score')?.value as number | 'INSUFFICIENT_DATA';
    const fundingCapacityVal = indicators.find(i => i.metricName === 'Funding Capacity Ratio')?.value as number | 'INSUFFICIENT_DATA';

    // Strategic Severity Logic
    let strategicSeverity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'MONITORING' = 'MONITORING';
    let strategicSeverityReason = 'Sem vulnerabilidades críticas identificadas';

    if (typeof liqReal === 'number' && liqReal < 0.50) {
      strategicSeverity = 'CRITICAL';
      strategicSeverityReason = `Liquidez Real Crítica (${liqReal.toFixed(2)})`;
    } else if (typeof lossAbsorption === 'number' && lossAbsorption < 2.0) {
      strategicSeverity = 'CRITICAL';
      strategicSeverityReason = `Loss Absorption Crítico (${lossAbsorption.toFixed(1)}x)`;
    } else if (typeof debtCapacity === 'number' && debtCapacity < 50) {
      strategicSeverity = 'HIGH';
      strategicSeverityReason = `Debt Capacity Reduzido (${debtCapacity})`;
    } else if (typeof fundingCapacityVal === 'number' && fundingCapacityVal < 60) {
      strategicSeverity = 'HIGH';
      strategicSeverityReason = `Funding Capacity Limitado (${fundingCapacityVal})`;
    } else if (score < 50) {
      strategicSeverity = 'MODERATE';
      strategicSeverityReason = 'Múltiplos indicadores em alerta (Score Vulnerável)';
    }

    // 1. Tese Patrimonial Hierárquica (Continuidade > Liquidez > Solvência > Preservação > Estrutura > Score)
    let patrimonialThesis = '';
    
    const isLRFragil = typeof liqReal === 'number' && liqReal < 0.75;
    const isLSCritica = typeof liqSeca === 'number' && liqSeca < 1.0;
    const isLACritica = typeof lossAbsorption === 'number' && lossAbsorption < 2.0;
    const isEndivAlto = typeof endivGeral === 'number' && endivGeral > 0.8;
    const isConsumoCap = equityQuality === 'Consumo de Capital' || equityQuality === 'Erosão Patrimonial';

    if (isLRFragil || isLSCritica || isLACritica || isConsumoCap) {
      const issues: string[] = [];
      if (isLRFragil || isLSCritica) issues.push('fragilidade crítica de liquidez');
      if (typeof estoqueConc === 'number' && estoqueConc > 0.4) issues.push('elevado aprisionamento de capital em estoques');
      if (isConsumoCap) issues.push('consumo material do capital originalmente aportado pelos sócios');
      if (isLACritica && !isConsumoCap) issues.push('baixa margem de absorção contra perdas');

      let joinedIssues = '';
      if (issues.includes('fragilidade crítica de liquidez') && issues.includes('consumo material do capital originalmente aportado pelos sócios')) {
        joinedIssues = 'fragilidade crítica de liquidez e consumo material do capital originalmente aportado pelos sócios';
      } else {
        joinedIssues = issues.length > 1 
          ? issues.slice(0, -1).join(', ') + ' e ' + issues[issues.length - 1]
          : issues[0] || 'vulnerabilidades estruturais';
      }

      patrimonialThesis = `A estrutura patrimonial permanece formalmente solvente, porém apresenta ${joinedIssues}.`;
    } else if (isEndivAlto) {
      patrimonialThesis = `A estrutura patrimonial apresenta solvência de curto prazo preservada, mas a elevada alavancagem limita a capacidade de financiar crescimento operacional.`;
    } else {
      if (score >= 80) {
        patrimonialThesis = `A estrutura patrimonial é forte e resiliente, suportando crescimento sustentável com robusta margem de absorção contra choques.`;
      } else if (score >= 60) {
        patrimonialThesis = `A estrutura patrimonial é estável e equilibrada, apresentando indicadores controlados sem exposição severa no curto prazo.`;
      } else {
        patrimonialThesis = `A estrutura patrimonial requer otimização do giro e da estrutura de capital, apesar de não apresentar rompimento imediato de liquidez.`;
      }
    }

    // 2. Plano Executivo (Risco Dominante)
    let executivePlan = '';
    let dominantRiskFamily = '';
    
    let planFinanceiro = { prazo: 'Curto Prazo', acao: 'Manter liquidez de segurança e monitorar covenants.' };
    let planOperacional = { prazo: 'Médio Prazo', acao: 'Otimizar ciclo de conversão de caixa.' };
    let planGovernanca = { prazo: 'Longo Prazo', acao: 'Garantir retenção de lucros compatível com o crescimento sustentável.' };

    // Hierarchy of dominance:
    if (isLRFragil || isLSCritica) {
      dominantRiskFamily = 'Liquidez';
      let causa = 'Descasamento severo entre recebimentos operacionais e obrigações de curto prazo.';
      if (typeof estoqueConc === 'number' && estoqueConc > 0.4) {
        causa = `${(estoqueConc * 100).toFixed(1)}% do ativo concentrado em estoques e obrigações concentradas no curto prazo.`;
      }
      executivePlan = `Risco Dominante: Fragilidade de liquidez estrutural. | Causa Raiz: ${causa} | Ação Estratégica: Reduzir capital aprisionado e alongar passivos operacionais. | KPI: Liquidez Real > 0.75.`;
      
      planFinanceiro = { prazo: 'Curto Prazo', acao: 'Alongar passivos, renegociar dívidas curtas e reforçar posição imediata de liquidez.' };
      planOperacional = { prazo: 'Médio Prazo', acao: 'Reduzir aprisionamento em estoques e acelerar giro de recebíveis.' };
      planGovernanca = { prazo: 'Longo Prazo', acao: 'Estabelecer política restritiva de capital de giro e tesouraria.' };
      
    } else if (isLACritica || isConsumoCap) {
      dominantRiskFamily = 'Preservação de Capital';
      executivePlan = `Risco Dominante: Erosão Patrimonial. | Causa Raiz: Operação consumindo caixa e recursos aportados ao longo do tempo. | Ação Estratégica: Revisão radical do modelo de margem e estancamento da queima de caixa. | KPI: Lucro Líquido e Loss Absorption > 3 anos.`;
      
      planFinanceiro = { prazo: 'Curto Prazo', acao: 'Suspender distribuição de dividendos e novos Capex não-essenciais.' };
      planOperacional = { prazo: 'Médio Prazo', acao: 'Revisão drástica do modelo de margens para estancar a queima de caixa.' };
      planGovernanca = { prazo: 'Longo Prazo', acao: 'Monitorar consumo de capital e elaborar plano formal de recomposição patrimonial.' };
      
    } else if (isEndivAlto) {
      dominantRiskFamily = 'Estrutura de Capital';
      const c = typeof compEndiv === 'number' && compEndiv > 0.6 ? 'Alta concentração de dívida onerosa no curto prazo.' : 'Nível geral de endividamento superior à capacidade de geração de valor.';
      executivePlan = `Risco Dominante: Alavancagem Excessiva. | Causa Raiz: ${c} | Ação Estratégica: Desalavancagem através de retenção de lucros ou troca de dívida curta por longa. | KPI: Debt Capacity Score.`;
      
      planFinanceiro = { prazo: 'Curto Prazo', acao: 'Refinanciar dívidas onerosas e buscar troca de passivo curto por longo.' };
      planOperacional = { prazo: 'Médio Prazo', acao: 'Garantir geração de caixa livre superior ao serviço da dívida.' };
      planGovernanca = { prazo: 'Longo Prazo', acao: 'Definir teto de alavancagem estrutural e política estrita de funding.' };
      
    } else if (breakdown.workingCapitalScore !== null && breakdown.workingCapitalScore < 50) {
      dominantRiskFamily = 'Capital de Giro';
      executivePlan = `Risco Dominante: Estagnação no ciclo financeiro. | Causa Raiz: Prazo médio de recebimento dilatado e/ou giro de estoques lento. | Ação Estratégica: Revisão da política de concessão de crédito e aceleração de recebíveis. | KPI: Necessidade de Capital de Giro (NCG).`;
      
      planFinanceiro = { prazo: 'Curto Prazo', acao: 'Antecipar recebíveis apenas em janelas de oportunidade de custo, sem depender estruturalmente.' };
      planOperacional = { prazo: 'Curto Prazo', acao: 'Acelerar cobrança e restringir política de concessão de crédito.' };
      planGovernanca = { prazo: 'Médio Prazo', acao: 'Auditar políticas de vendas a prazo e giro comercial.' };
      
    } else {
      dominantRiskFamily = 'Otimização Estratégica';
      executivePlan = `Risco Dominante: Não identificado. | Situação: Estrutura equilibrada. | Ação Estratégica: Focar em maximização de retorno sobre o capital investido (ROIC) e eficiência tributária. | KPI: ROIC e EVA.`;
    }

    return {
      patrimonialThesis,
      executivePlan,
      planFinanceiro,
      planOperacional,
      planGovernanca,
      dominantRiskFamily,
      strategicSeverity,
      strategicSeverityReason,
      overallDisclaimer: ceilingApplied ? 'Classificação final limitada por travas fiduciárias protetivas.' : null,
      rationale: 'Interpretação executiva baseada em risco dominante e priorização de conselho.',
      confidence: 100,
      lineageHash: 'PEIE-' + Date.now().toString(16).toUpperCase(),
      sourceRuntime: 'BP_RUNTIME'
    };
  }
}
