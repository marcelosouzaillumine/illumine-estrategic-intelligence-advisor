import { BPSummary } from '../../../../lib/bpEngine';
import { PatrimonialIndicator } from './BalanceSheetFinancialMetricsEngine';

export class CapitalPreservationEngine {
  static analyze(summary: BPSummary, dreData: any[]): PatrimonialIndicator[] {
    const indicators: PatrimonialIndicator[] = [];
    const family = 'Capital Preservation';

    if (summary.patrimonioLiquido > 0) {
      // 1. Capital Erosion Velocity (CEV)
      let cev = 'INSUFFICIENT_DATA';
      let cevRationale = 'Prejuízo líquido anual não detectado na DRE.';
      let cevClassification = 'NEUTRAL';

      const lucroLiqNode = dreData.find(r => r.id === 'LUCRO_LIQ' || (r.category || '').toLowerCase().includes('lucro líquido') || (r.category || '').toLowerCase().includes('prejuízo líquido'));
      if (lucroLiqNode) {
        const result = lucroLiqNode.computedValue || lucroLiqNode.value || 0;
        if (result < 0) {
          const prejuizo = Math.abs(result);
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

      indicators.push({
        metricName: 'Loss Absorption Capacity',
        value: cev === 'INSUFFICIENT_DATA' ? cev : Number(cev),
        classification: cevClassification,
        severity: cevClassification,
        confidence: 90,
        evidence: { PL: summary.patrimonioLiquido, LucroLiqDRE: lucroLiqNode?.computedValue || 0 },
        rationale: cevRationale.replace('anos', 'períodos'),
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
      // Ativo Total - Passivo Total (Que é o próprio PL, mas medido percentualmente frente ao Passivo)
      const equityBuffer = summary.patrimonioLiquido / summary.ativoTotal;
      const bufferClassification = equityBuffer > 0.3 ? 'HEALTHY' : (equityBuffer > 0.1 ? 'ATTENTION' : 'CRITICAL');
      
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
      if (cevClassification === 'HEALTHY' && bufferClassification === 'HEALTHY') survivalClass = 'Forte';
      else if (cevClassification === 'ATTENTION' || bufferClassification === 'ATTENTION') survivalClass = 'Moderado';
      else if (cevClassification === 'CRITICAL' && bufferClassification === 'CRITICAL') survivalClass = 'Crítico';

      indicators.push({
        metricName: 'Survival Index',
        value: survivalClass,
        classification: survivalClass === 'Forte' ? 'HEALTHY' : (survivalClass === 'Crítico' ? 'CRITICAL' : 'ATTENTION'),
        severity: survivalClass === 'Forte' ? 'HEALTHY' : (survivalClass === 'Crítico' ? 'CRITICAL' : 'ATTENTION'),
        confidence: 90,
        evidence: { cevClassification, bufferClassification },
        rationale: `Classificação de sobrevivência baseada na margem de absorção e na reserva estrutural.`,
        lineageHash: `CPE-SI-${Date.now().toString(16)}`,
        family,
        format: 'string'
      });
    }

    return indicators;
  }
}
