import { BPSummary } from '../../../../lib/bpEngine';
import { PatrimonialIndicator } from './BalanceSheetFinancialMetricsEngine';

export class PatrimonialPreservationEngine {
  static getConsumptionMetrics(summary: BPSummary) {
    const amount = summary.lucrosPrejuizos || 0;
    const base = summary.capitalSocial || 0;
    
    if (base === 0 || amount === 0) {
      return {
        capitalConsumedAmount: amount > 0 ? amount : undefined,
        capitalConsumedPercent: 'INSUFFICIENT_DATA',
        capitalConsumptionBase: undefined,
        capitalConsumptionExplanation: 'Dados insuficientes de capital social ou ausência de prejuízos acumulados para calcular o consumo de capital.'
      };
    }

    const percent = (amount / base) * 100;
    return {
      capitalConsumedAmount: amount,
      capitalConsumedPercent: Number(percent.toFixed(1)),
      capitalConsumptionBase: base,
      capitalConsumptionExplanation: `Os prejuízos acumulados (R$ ${amount.toLocaleString('pt-BR')}) consumiram ${percent.toFixed(1)}% do capital social (R$ ${base.toLocaleString('pt-BR')}).`
    };
  }

  static analyze(summary: BPSummary, dreData: any[]): PatrimonialIndicator[] {
    const indicators: PatrimonialIndicator[] = [];
    const family = 'Capital Preservation';

    if (summary.patrimonioLiquido > 0) {
      // 1. Capital Erosion Velocity (CEV)
      let cev = 'INSUFFICIENT_DATA';
      let cevRationale = 'Prejuízo líquido anual não detectado na DRE.';
      let cevClassification = 'NEUTRAL';

      const lucroLiqNode = dreData.find(r => r.id === 'LUCRO_LIQ' || (r.category || '').toLowerCase().includes('lucro líquido') || (r.category || '').toLowerCase().includes('prejuízo líquido'));
      
      let isLoss = false;
      let prejuizo = 0;
      if (lucroLiqNode) {
        const result = lucroLiqNode.computedValue || lucroLiqNode.value || 0;
        if (result < 0) {
          isLoss = true;
          prejuizo = Math.abs(result);
          const yearsToErode = summary.patrimonioLiquido / prejuizo;
          cev = yearsToErode.toFixed(1);
          if (yearsToErode < 2) {
            cevClassification = 'CRITICAL';
            cevRationale = `Patrimônio atual suporta menos de 2 anos (aprox. ${cev} anos) com o ritmo de queima atual.`;
          } else if (yearsToErode <= 5) {
            cevClassification = 'ATTENTION';
            cevRationale = `O patrimônio seria consumido em ${cev} anos mantendo o atual nível de prejuízo.`;
          } else {
            cevClassification = 'HEALTHY';
            cevRationale = `Margem longa de absorção: o patrimônio suporta o prejuízo atual por ${cev} anos.`;
          }
        } else {
          cev = '0';
          cevClassification = 'HEALTHY';
          cevRationale = 'A empresa está gerando lucro líquido, havendo acúmulo (e não erosão) de capital.';
        }
      }

      // Equity Buffer (Margem para Insolvência)
      const equityBuffer = summary.patrimonioLiquido / summary.ativoTotal;
      const bufferClassification = equityBuffer > 0.3 ? 'HEALTHY' : (equityBuffer > 0.1 ? 'ATTENTION' : 'CRITICAL');

      // Liquidity & Debt assessment for recalibration
      const isLiquidityHealthy = summary.passivoCirculante > 0 && (summary.ativoCirculante / summary.passivoCirculante >= 1.0);
      const isDebtHealthy = summary.ativoTotal > 0 && (summary.passivoTotal / summary.ativoTotal <= 0.6);

      // Recalibrated Loss Absorption Capacity
      let lacClassification = cevClassification;
      let lacRationale = cevRationale;

      // Recalibration Logic: Isolated accumulated losses or recent loss shouldn't trigger critical risk if buffers are healthy
      if (lacClassification === 'CRITICAL') {
        if (bufferClassification === 'HEALTHY' && isLiquidityHealthy && isDebtHealthy) {
          lacClassification = 'ATTENTION';
          lacRationale += ' Contudo, a margem de segurança patrimonial, liquidez e endividamento estão saudáveis, mitigando o risco de curto prazo.';
        }
      }

      indicators.push({
        metricName: 'Loss Absorption Capacity',
        value: cev === 'INSUFFICIENT_DATA' ? cev : Number(cev),
        classification: lacClassification,
        severity: lacClassification,
        confidence: 90,
        evidence: { PL: summary.patrimonioLiquido, LucroLiqDRE: lucroLiqNode?.computedValue || 0, Buffer: equityBuffer, LiqHealthy: isLiquidityHealthy, DebtHealthy: isDebtHealthy },
        rationale: lacRationale.replace('anos', 'períodos'),
        lineageHash: `CPE-LAC-${Date.now().toString(16)}`,
        family,
        format: 'decimal'
      });

      indicators.push({
        metricName: 'Capital Erosion Velocity (CEV)',
        value: cev === 'INSUFFICIENT_DATA' ? cev : Number(cev),
        classification: cevClassification,
        severity: cevClassification,
        confidence: 90,
        evidence: { PL: summary.patrimonioLiquido, LucroLiqDRE: lucroLiqNode?.computedValue || 0 },
        rationale: cevRationale,
        lineageHash: `CPE-CEV-${Date.now().toString(16)}`,
        family,
        format: 'decimal'
      });

      // 2. Equity Quality Index (EQI)
      // Caixa / Patrimônio Líquido como simplificação inicial de qualidade de reserva de liquidez versus ativos intangíveis/estoque.
      const pctCaixaNoPL = summary.caixaEquivalentes / summary.patrimonioLiquido;
      const pctIntangivelNoPL = summary.ativoPermanente !== null ? summary.ativoPermanente / summary.patrimonioLiquido : 0;
      
      let eqiClassification = 'NEUTRAL';
      let eqiRationale = '';
      if (pctCaixaNoPL > 0.5) {
        eqiClassification = 'HEALTHY';
        eqiRationale = 'Alta Qualidade (Forte lastro em caixa e reservas líquidas).';
      } else if (pctIntangivelNoPL > 0.7) {
        eqiClassification = 'CRITICAL';
        eqiRationale = 'Qualidade Reduzida (PL fortemente lastreado em ativos permanentes de difícil realização ou ágio).';
      } else {
        eqiClassification = 'ATTENTION';
        eqiRationale = 'Qualidade Moderada (Composição equilibrada, mas dependente da realização de giro).';
      }

      indicators.push({
        metricName: 'Equity Quality Index (EQI)',
        value: pctCaixaNoPL,
        classification: eqiClassification,
        severity: eqiClassification,
        confidence: 85,
        evidence: { PctCaixaNoPL: pctCaixaNoPL, PctIntangivelNoPL: pctIntangivelNoPL },
        rationale: eqiRationale,
        lineageHash: `CPE-EQI-${Date.now().toString(16)}`,
        family,
        format: 'percentage'
      });

      // 3. Equity Buffer (Margem para Insolvência)
      let bufferRationale = 'Margem de solvência: o patrimônio líquido atua como um sólido amortecedor contra choques.';
      if (cevClassification === 'CRITICAL' || cevClassification === 'ATTENTION') {
        bufferRationale = 'O patrimônio líquido ainda oferece capacidade de absorção patrimonial, porém essa proteção encontra-se parcialmente comprometida pela velocidade de consumo de capital observada.';
      } else if (bufferClassification === 'CRITICAL') {
        bufferRationale = 'Margem de segurança crítica, deixando a estrutura suscetível a choques operacionais ou financeiros.';
      }
      
      indicators.push({
        metricName: 'Equity Buffer',
        value: equityBuffer,
        classification: bufferClassification,
        severity: bufferClassification,
        confidence: 95,
        evidence: { PL: summary.patrimonioLiquido, Ativo: summary.ativoTotal },
        rationale: bufferRationale,
        lineageHash: `CPE-BUF-${Date.now().toString(16)}`,
        family,
        format: 'percentage'
      });

      // 4. Survival Index
      let survivalClass = 'Frágil';
      if (lacClassification === 'HEALTHY' && bufferClassification === 'HEALTHY') survivalClass = 'Forte';
      else if (lacClassification === 'ATTENTION' || bufferClassification === 'ATTENTION') survivalClass = 'Moderado';
      else if (lacClassification === 'CRITICAL' && bufferClassification === 'CRITICAL') survivalClass = 'Crítico';

      indicators.push({
        metricName: 'Survival Index',
        value: survivalClass,
        classification: survivalClass === 'Forte' ? 'HEALTHY' : (survivalClass === 'Crítico' ? 'CRITICAL' : 'ATTENTION'),
        severity: survivalClass === 'Forte' ? 'HEALTHY' : (survivalClass === 'Crítico' ? 'CRITICAL' : 'ATTENTION'),
        confidence: 90,
        evidence: { lacClassification, bufferClassification },
        rationale: `Classificação de sobrevivência baseada na margem de absorção e na reserva estrutural.`,
        lineageHash: `CPE-SI-${Date.now().toString(16)}`,
        family,
        format: 'string'
      });

      // 5. Capital Consumed
      const consumptionMetrics = PatrimonialPreservationEngine.getConsumptionMetrics(summary);
      if (consumptionMetrics.capitalConsumedPercent !== 'INSUFFICIENT_DATA') {
        let consClass = 'HEALTHY';
        if ((consumptionMetrics.capitalConsumedPercent as number) > 50) consClass = 'CRITICAL';
        else if ((consumptionMetrics.capitalConsumedPercent as number) > 20) consClass = 'ATTENTION';

        indicators.push({
          metricName: 'Capital Consumido',
          value: (consumptionMetrics.capitalConsumedPercent as number) / 100,
          classification: consClass,
          severity: consClass,
          confidence: 95,
          evidence: consumptionMetrics,
          rationale: consumptionMetrics.capitalConsumptionExplanation,
          lineageHash: `CPE-CC-${Date.now().toString(16)}`,
          family,
          format: 'percentage'
        });
      }
    }

    return indicators;
  }
}
