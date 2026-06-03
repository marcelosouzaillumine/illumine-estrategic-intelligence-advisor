import { PatrimonialIndicator } from './BalanceSheetFinancialMetricsEngine';
import { PatrimonialScoreBreakdown } from './PatrimonialScoreExplainabilityEngine';
import { CrossStatementLiquidityInterpreter } from '../../cross-statement/CrossStatementLiquidityInterpreter';

export interface PatrimonialNarrative {
  family: string;
  narrative: string;
}

export interface PatrimonialInterpretationOutput {
  narratives: PatrimonialNarrative[];
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
    const narratives: PatrimonialNarrative[] = [];

    // --- LIQUIDEZ ---
    {
      let narrative = '';
      const liqScore = breakdown.liquidityScore ?? 0;
      const liqSeca = indicators.find(i => i.metricName === 'Liquidez Seca')?.severity || 'INSUFFICIENT_DATA';
      const liqImediata = indicators.find(i => i.metricName === 'Liquidez Imediata')?.severity || 'INSUFFICIENT_DATA';
      const liqCorrente = indicators.find(i => i.metricName === 'Liquidez Corrente')?.severity || 'INSUFFICIENT_DATA';
      const hasLiquidityRisk = liqCorrente === 'CRITICAL' || liqSeca === 'CRITICAL' || breakdown.liquidityCriticalRiskDriver === true;

      if (hasValidatedCashFlowEvidence) {
        narrative = CrossStatementLiquidityInterpreter.interpret(
          hasLiquidityRisk || liqScore < 50,
          hasValidatedCashFlowEvidence,
          isOperationalCashFlowPositive
        );
      } else {
        if (liqSeca === 'CRITICAL' && liqImediata === 'CRITICAL') {
          narrative = 'Embora a liquidez corrente permaneça superior a 1,0, a baixa liquidez seca e imediata indicam dependência relevante da conversão de estoques e recebíveis para cumprimento das obrigações de curto prazo.';
        } else if (liqScore >= 80) {
          narrative = 'A organização apresenta estrutura de liquidez resiliente e folgada, garantindo o cumprimento de obrigações sem pressionar o caixa ou depender exclusivamente da venda de estoques.';
        } else if (liqScore < 50 && liqSeca === 'CRITICAL') {
          narrative = 'A estrutura de liquidez apresenta fragilidade relevante, com baixa capacidade de cobertura sem forte dependência da conversão de estoques para cumprir compromissos de curto prazo.';
        } else if (liqCorrente === 'ATTENTION') {
          narrative = 'A liquidez corrente está em nível de atenção, exigindo rigor no descasamento de prazos entre recebimentos operacionais e o vencimento do passivo exigível.';
        } else if (liqScore >= 50) {
          narrative = 'O perfil de liquidez é estável, suportando as obrigações imediatas, mas sem folgas estruturais expressivas que permitam grandes desvios no ciclo operacional.';
        } else {
          narrative = 'Dados insuficientes ou mistos para inferir a solidez estrutural de liquidez de curto prazo.';
        }
      }

      narratives.push({ family: 'Liquidez', narrative });
    }

    // --- CAPITAL DE GIRO ---
    {
      let narrative = '';
      const wcScore = breakdown.workingCapitalScore ?? 0;
      const cgl = indicators.find(i => i.metricName === 'Capital de Giro Líquido');
      const tesouraria = indicators.find(i => i.metricName === 'Saldo de Tesouraria');

      const isCglNegative = cgl?.value !== 'INSUFFICIENT_DATA' && (cgl?.value as number) < 0;
      const isTesourariaNegative = tesouraria?.value !== 'INSUFFICIENT_DATA' && (tesouraria?.value as number) < 0;
      const liqSeca = indicators.find(i => i.metricName === 'Liquidez Seca')?.severity || 'INSUFFICIENT_DATA';
      const liqImediata = indicators.find(i => i.metricName === 'Liquidez Imediata')?.severity || 'INSUFFICIENT_DATA';
      const hasLiquidityRisk = liqSeca === 'CRITICAL' || liqImediata === 'CRITICAL';

      if (isTesourariaNegative && isCglNegative) {
        narrative = 'A operação demanda capital superior à capacidade de autofinanciamento, pressionando severamente a tesouraria e configurando quadro de stress operacional de curto prazo.';
      } else if (isTesourariaNegative) {
        narrative = 'A necessidade de capital de giro supera a folga operacional (CGL), exigindo alavancagem adicional ou supressão de caixa para sustentar o ciclo atual.';
      } else if (hasLiquidityRisk) {
        narrative = 'O capital de giro líquido permanece positivo e oferece suporte à operação. Entretanto, a concentração relevante dos recursos em estoques reduz a velocidade de conversão em liquidez imediata.';
      } else if (wcScore >= 80) {
        narrative = 'O capital de giro líquido financia confortavelmente a operação, gerando saldo positivo de tesouraria e protegendo o caixa contra oscilações de mercado.';
      } else if (wcScore >= 50) {
        narrative = 'O capital de giro sustenta a operação sem sobras significativas, indicando equilíbrio sensível a atrasos de recebimento ou lentidão de estoques.';
      } else {
        narrative = 'Relação de capital de giro não apresenta margens claras, exigindo monitoramento ativo do ciclo financeiro.';
      }

      narratives.push({ family: 'Capital de Giro', narrative });
    }

    // --- ESTRUTURA DE CAPITAL ---
    {
      let narrative = '';
      const capScore = breakdown.capitalStructureScore ?? 0;
      const endividamento = indicators.find(i => i.metricName === 'Endividamento Geral');
      const compEndiv = indicators.find(i => i.metricName === 'Composição do Endividamento');

      const isEndivHigh = endividamento?.severity === 'CRITICAL';
      const isCompShortTerm = compEndiv?.severity === 'CRITICAL';

      if (isEndivHigh && isCompShortTerm) {
        narrative = 'A estrutura de capital apresenta alto risco, com forte dependência de recursos de terceiros concentrados no curto prazo, limitando a capacidade de investimento e aumentando o risco de insolvência.';
      } else if (isEndivHigh) {
        narrative = 'A companhia opera com alavancagem estrutural elevada, aumentando o perfil de risco fiduciário e a sensibilidade a choques nos custos de captação.';
      } else if (isCompShortTerm) {
        narrative = 'Apesar do volume global de dívida, há concentração perigosa de obrigações no curto prazo (pressão de rolagem ou liquidação imediata).';
      } else if (capScore >= 80) {
        narrative = 'A estrutura de capital é sólida, com alta autonomia financeira e baixa dependência estrutural de passivos onerosos ou de terceiros.';
      } else {
        narrative = 'A estrutura de capital é moderada, mantendo o equilíbrio de longo prazo, embora possua dependência habitual de capitais de terceiros.';
      }

      narratives.push({ family: 'Estrutura de Capital', narrative });
    }

    // --- IMOBILIZAÇÃO ---
    {
      let narrative = '';
      const immobScore = breakdown.assetImmobilizationScore ?? 0;
      const ipl = indicators.find(i => i.metricName === 'Imobilização do Patrimônio Líquido');

      if (ipl?.severity === 'CRITICAL') {
        narrative = 'A imobilização do capital próprio atingiu níveis críticos, significando que recursos de terceiros estão sendo usados para financiar ativos permanentes.';
      } else if (immobScore >= 80) {
        narrative = 'Baixa imobilização do capital próprio, garantindo alta flexibilidade estrutural e deixando o patrimônio livre para girar a operação.';
      } else if (immobScore >= 50) {
        narrative = 'Índice de imobilização adequado, com capital próprio suficiente para cobrir os ativos permanentes e apoiar marginalmente o capital de giro.';
      } else {
        narrative = 'Nível de imobilização em atenção, reduzindo a flexibilidade patrimonial em cenários de stress.';
      }

      narratives.push({ family: 'Imobilização', narrative });
    }

    return {
      narratives,
      overallDisclaimer: ceilingApplied ? 'Apesar da pontuação agregada indicar determinada estabilidade estrutural, riscos patrimoniais específicos limitam a classificação fiduciária final da organização.' : null,
      rationale: 'Narrativas determinísticas geradas com base na severidade dos indicadores e nas métricas críticas fiduciárias.',
      confidence: 100,
      lineageHash: 'PEIE-' + Date.now().toString(16).toUpperCase(),
      sourceRuntime: 'BP_RUNTIME'
    };
  }
}
