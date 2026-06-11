import { ExecutiveAnalysisContext } from './StrategicOpinionConsistencyEngine';
import { ExecutiveKPI } from './ExecutiveSynthesisTypes';

export class SynthesisMetricsResolver {
  public static extractKPIs(context: ExecutiveAnalysisContext): ExecutiveKPI[] {
    const kpis: ExecutiveKPI[] = [];

    // Safety check
    if (!context.primaryIndicators && !context.technicalDrivers) {
      return kpis;
    }

    const { primaryIndicators = {}, technicalDrivers = {} } = context;

    switch (context.moduleContext) {
      case 'BP':
        // Solidez / Liquidez / Capital
        if (technicalDrivers['liquidezReal']) {
          const liqReal = Number(technicalDrivers['liquidezReal']);
          kpis.push({
            label: 'Liquidez Real',
            value: liqReal.toFixed(2),
            trend: liqReal >= 1.2 ? 'positive' : liqReal < 1.0 ? 'negative' : 'neutral'
          });
        }
        if (technicalDrivers['endividamentoGeral']) {
          const endiv = Number(technicalDrivers['endividamentoGeral']);
          kpis.push({
            label: 'Endividamento',
            value: `${(endiv * 100).toFixed(1)}%`,
            trend: endiv < 0.5 ? 'positive' : endiv > 0.7 ? 'negative' : 'neutral'
          });
        }
        if (technicalDrivers['autonomiaFinanceira']) {
          const auto = Number(technicalDrivers['autonomiaFinanceira']);
          kpis.push({
            label: 'Autonomia',
            value: `${(auto * 100).toFixed(1)}%`,
            trend: auto >= 0.4 ? 'positive' : auto < 0.25 ? 'negative' : 'neutral'
          });
        }
        break;

      case 'DRE':
        if (technicalDrivers['receitaBruta'] !== undefined) {
          kpis.push({
            label: 'Receita',
            value: this.formatCurrency(Number(technicalDrivers['receitaBruta'])),
            trend: 'neutral'
          });
        } else if (technicalDrivers['receitaLiquida'] !== undefined) {
            kpis.push({
              label: 'Receita Líquida',
              value: this.formatCurrency(Number(technicalDrivers['receitaLiquida'])),
              trend: 'neutral'
            });
        }
        if (technicalDrivers['ebitda'] !== undefined) {
          const ebitda = Number(technicalDrivers['ebitda']);
          kpis.push({
            label: 'EBITDA',
            value: this.formatCurrency(ebitda),
            trend: ebitda > 0 ? 'positive' : ebitda < 0 ? 'negative' : 'neutral'
          });
        }
        if (technicalDrivers['margemEbitda'] !== undefined) {
          const margem = Number(technicalDrivers['margemEbitda']);
          kpis.push({
            label: 'Margem EBITDA',
            value: `${(margem * 100).toFixed(1)}%`,
            trend: margem > 0.15 ? 'positive' : margem < 0.05 ? 'negative' : 'neutral'
          });
        }
        break;

      case 'DFC':
        if (technicalDrivers['fco'] !== undefined) {
          const fco = Number(technicalDrivers['fco']);
          kpis.push({
            label: 'Geração Operacional (FCO)',
            value: this.formatCurrency(fco),
            trend: fco > 0 ? 'positive' : 'negative'
          });
        }
        if (technicalDrivers['runway'] !== undefined) {
          const runway = Number(technicalDrivers['runway']);
          kpis.push({
            label: 'Runway',
            value: `${runway} meses`,
            trend: runway >= 12 ? 'positive' : runway < 6 ? 'negative' : 'neutral'
          });
        }
        if (technicalDrivers['caixaLivre'] !== undefined) {
            const fcf = Number(technicalDrivers['caixaLivre']);
            kpis.push({
              label: 'Caixa Livre (FCF)',
              value: this.formatCurrency(fcf),
              trend: fcf > 0 ? 'positive' : 'negative'
            });
        }
        break;

      case 'DLPA':
        if (technicalDrivers['lucroLiquido'] !== undefined) {
            const ll = Number(technicalDrivers['lucroLiquido']);
            kpis.push({
              label: 'Lucro Líquido',
              value: this.formatCurrency(ll),
              trend: ll > 0 ? 'positive' : 'negative'
            });
        }
        if (technicalDrivers['dividendosPagos'] !== undefined) {
            const div = Number(technicalDrivers['dividendosPagos']);
            kpis.push({
              label: 'Dividendos',
              value: this.formatCurrency(div),
              trend: 'neutral'
            });
        }
        if (technicalDrivers['payoutRatio'] !== undefined) {
            const payout = Number(technicalDrivers['payoutRatio']);
            kpis.push({
                label: 'Payout',
                value: `${(payout * 100).toFixed(1)}%`,
                trend: payout <= 0.5 ? 'positive' : 'neutral'
            });
        }
        break;
        
      default:
        // Fallback for general global score
        if (context.globalScore !== undefined) {
            kpis.push({
                label: 'Score Consolidado',
                value: context.globalScore.toFixed(1),
                trend: context.globalScore >= 70 ? 'positive' : context.globalScore < 40 ? 'negative' : 'neutral'
            });
        }
    }

    return kpis;
  }

  private static formatCurrency(val: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  }
}
