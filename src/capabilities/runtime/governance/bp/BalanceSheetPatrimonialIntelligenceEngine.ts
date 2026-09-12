import { BPSummary } from '../../../../lib/bpEngine';
import { PatrimonialIndicator } from './BalanceSheetFinancialMetricsEngine';
import { sanitize, translate } from '../../../../workspace/runtime/executive-consolidation/ExecutiveSemanticBoundaryGuard';

export class BalanceSheetPatrimonialIntelligenceEngine {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  static generate(bpSummary: BPSummary | undefined, indicators: PatrimonialIndicator[]) {
    if (!bpSummary || indicators.length === 0) {
      return {
        solvencyReading: translate('INDISPONÍVEL'),
        liquidityReading: translate('INDISPONÍVEL'),
        capitalStructureReading: translate('INDISPONÍVEL'),
        capitalPreservationReading: translate('INDISPONÍVEL'),
        assetQualityReading: translate('INDISPONÍVEL'),
        growthCapacityReading: translate('INDISPONÍVEL')
      };
    }

    const solvencyStatus = indicators.find(i => i.metricName.includes('Endividamento Geral'))?.classification || 'Neutro';
    const liquidityStatus = indicators.find(i => i.metricName.includes('Liquidez Corrente'))?.classification || 'Neutro';
    const autonomyStatus = indicators.find(i => i.metricName.includes('Autonomia'))?.classification || 'Neutro';
    
    // Interpretações determinísticas com base no framework institucional
    let solvencyReading = 'O balanço não apresenta riscos estruturais iminentes de solvência.';
    if (solvencyStatus.includes('Alto')) {
      solvencyReading = 'Alavancagem elevada indica pressão na estrutura de obrigações de longo horizonte.';
    } else if (solvencyStatus.includes('Baixo') || solvencyStatus.includes('Controlado')) {
      solvencyReading = 'Estrutura passiva confortável, com dependência de terceiros minimizada.';
    }

    let liquidityReading = 'Equilíbrio aceitável na relação de conversibilidade dos ativos circulantes.';
    if (liquidityStatus.includes('Forte') || liquidityStatus.includes('Saudável') || liquidityStatus.includes('Alta')) {
      liquidityReading = 'Alta disponibilidade para cumprimento de obrigações de ciclo imediato, sugerindo eficiência de caixa.';
    } else if (liquidityStatus.includes('Fraca') || liquidityStatus.includes('Pressionada')) {
      liquidityReading = 'Descompasso crítico entre exigibilidades de ciclo imediato e realização de ativos, demandando atenção à NCG.';
    }

    let capitalStructureReading = 'Composição mista de capital próprio e de terceiros suportando a operação.';
    if (autonomyStatus.includes('Alta') || autonomyStatus.includes('Elevada')) {
      capitalStructureReading = 'A estrutura de capital é suportada majoritariamente por capital próprio (Equity), denotando maturidade patrimonial.';
    } else if (autonomyStatus.includes('Baixa')) {
      capitalStructureReading = 'Financiamento operacional altamente dependente de recursos de terceiros.';
    }

    const capPreservationMetric = indicators.find(i => i.metricName.includes('Loss Absorption Capacity'))?.value;
    let capitalPreservationReading = 'A capacidade de preservação do PL frente a choques segue parâmetros médios do setor.';
    if (capPreservationMetric !== 'INSUFFICIENT_DATA' && typeof capPreservationMetric === 'number') {
      if (capPreservationMetric > 50) {
        capitalPreservationReading = 'Elevada margem de segurança patrimonial, indicando que o capital institucional está altamente preservado contra choques exógenos.';
      } else if (capPreservationMetric < 10) {
        capitalPreservationReading = 'Fragilidade patrimonial com margem reduzida para absorção de prejuízos continuados, indicando erosão acelerada ou estrutura fragilizada.';
      }
    }

    return {
      solvencyReading: sanitize(solvencyReading),
      liquidityReading: sanitize(liquidityReading),
      capitalStructureReading: sanitize(capitalStructureReading),
      capitalPreservationReading: sanitize(capitalPreservationReading),
      assetQualityReading: sanitize('As imobilizações acompanham a característica operacional sem evidências de excessos de iliquidez nos ativos não circulantes.'),
      growthCapacityReading: sanitize('A robustez do capital circulante líquido sinaliza viabilidade para ciclos moderados de expansão sem diluição agressiva.')
    };
  }
}
