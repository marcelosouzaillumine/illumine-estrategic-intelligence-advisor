import { OperationalMetrics } from '../OperationalMetricsEngine';
import { RiskExposure } from '../../../../../core/intelligence/contracts/RiskExposure';

export class OperationalRiskRules {
    public static evaluate(metrics: OperationalMetrics): RiskExposure[] {
        if (!metrics.available) return [];

        const exposures: RiskExposure[] = [];

        this.evaluateRevenueGrowth(metrics, exposures);
        this.evaluateGrossMargin(metrics, exposures);
        this.evaluateEbitdaMargin(metrics, exposures);
        this.evaluateOperatingEfficiency(metrics, exposures);
        this.evaluateNetMargin(metrics, exposures);

        return exposures;
    }

    private static evaluateRevenueGrowth(metrics: OperationalMetrics, exposures: RiskExposure[]) {
        const growth = metrics.revenueGrowth;
        if (growth.value === null || growth.previousValue === null) return;

        if (growth.value < 0) {
            exposures.push({
                id: 'revenue_contraction',
                category: 'Crescimento',
                severity: growth.value < -0.1 ? 'CRITICAL' : 'HIGH', // >10% retraction is critical
                metric: 'Crescimento da Receita Líquida',
                value: growth.value,
                triggerCondition: '< 0%',
                message: 'Retração observada no volume de receitas em relação ao período anterior.'
            });
        } else if (growth.value > 0) {
            // We can also emit positive exposures / strengths. The Signal engine will classify it.
            exposures.push({
                id: 'revenue_expansion',
                category: 'Crescimento',
                severity: 'LOW', // Positive signal usually maps to low severity / strength
                metric: 'Crescimento da Receita Líquida',
                value: growth.value,
                triggerCondition: '> 0%',
                message: 'Expansão observada no volume de receitas em relação ao período anterior.'
            });
        }
    }

    private static evaluateGrossMargin(metrics: OperationalMetrics, exposures: RiskExposure[]) {
        const margin = metrics.grossMargin;
        if (margin.value === null || margin.absoluteVariation === null) return;

        if (margin.absoluteVariation < -0.03) { // 300 bps compression
            exposures.push({
                id: 'gross_margin_compression',
                category: 'Rentabilidade Bruta',
                severity: 'HIGH',
                metric: 'Margem Bruta',
                value: margin.value,
                triggerCondition: 'Variação < -3%',
                message: 'Compressão relevante da margem bruta identificada no período.'
            });
        }
    }

    private static evaluateEbitdaMargin(metrics: OperationalMetrics, exposures: RiskExposure[]) {
        const margin = metrics.ebitdaMargin;
        if (margin.value === null || margin.absoluteVariation === null) return;

        if (margin.absoluteVariation < -0.02) { // 200 bps
            exposures.push({
                id: 'ebitda_margin_compression',
                category: 'Rentabilidade Operacional',
                severity: 'HIGH',
                metric: 'Margem EBITDA',
                value: margin.value,
                triggerCondition: 'Variação < -2%',
                message: 'Compressão da margem EBITDA identificada.'
            });
        } else if (margin.absoluteVariation > 0.02) {
            exposures.push({
                id: 'ebitda_margin_expansion',
                category: 'Rentabilidade Operacional',
                severity: 'LOW',
                metric: 'Margem EBITDA',
                value: margin.value,
                triggerCondition: 'Variação > 2%',
                message: 'Expansão da margem EBITDA identificada.'
            });
        }

        if (margin.value < 0) {
            exposures.push({
                id: 'ebitda_negative',
                category: 'Rentabilidade Operacional',
                severity: 'CRITICAL',
                metric: 'Margem EBITDA',
                value: margin.value,
                triggerCondition: '< 0%',
                message: 'Geração operacional de caixa (EBITDA) negativa.'
            });
        }
    }

    private static evaluateOperatingEfficiency(metrics: OperationalMetrics, exposures: RiskExposure[]) {
        const efficiency = metrics.operatingEfficiency; // OPEX / Net Revenue
        const growth = metrics.revenueGrowth;
        
        if (efficiency.value === null || efficiency.previousValue === null || efficiency.absoluteVariation === null) return;

        // If OPEX as % of revenue grew significantly
        if (efficiency.absoluteVariation > 0.03) {
            exposures.push({
                id: 'opex_weight_growth',
                category: 'Eficiência Operacional',
                severity: 'HIGH',
                metric: 'OPEX / Receita Líquida',
                value: efficiency.value,
                triggerCondition: 'Variação > 3%',
                message: 'Crescimento da representatividade do OPEX em relação à receita.'
            });
        }

        // Specific Constitutional Check: OPEX growing faster than Revenue
        if (growth.value !== null && growth.value > 0) {
             // We need raw OPEX growth. Since we don't have it directly in metrics, we approximate via ratio.
             // If OPEX/Rev ratio increased while Revenue grew, it mathematically means OPEX grew faster than Revenue.
             if (efficiency.value > efficiency.previousValue) {
                  exposures.push({
                      id: 'opex_growing_above_revenue',
                      category: 'Eficiência Operacional',
                      severity: 'MEDIUM',
                      metric: 'Expansão de Estrutura',
                      value: efficiency.value,
                      triggerCondition: 'Crescimento OPEX > Crescimento Receita',
                      message: 'A estrutura operacional (OPEX) cresceu em ritmo superior à expansão da receita.'
                  });
             }
        }
    }

    private static evaluateNetMargin(metrics: OperationalMetrics, exposures: RiskExposure[]) {
        const margin = metrics.netMargin;
        if (margin.value === null) return;

        if (margin.value < 0) {
            exposures.push({
                id: 'net_loss',
                category: 'Rentabilidade Líquida',
                severity: 'CRITICAL',
                metric: 'Margem Líquida',
                value: margin.value,
                triggerCondition: '< 0%',
                message: 'Resultado líquido final negativo no período analisado.'
            });
        }
    }
}
