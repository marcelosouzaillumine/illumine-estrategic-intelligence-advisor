import { NormalizedDre, DreDataset } from '../../infrastructure/adapters/DreNormalizer';
import { AnalyticalAvailability } from '../../../../core/contracts/AnalyticalAvailability';

export interface OperationalMetricValue {
    id: string;
    name: string;
    category: 'growth' | 'profitability' | 'efficiency' | 'conversion';
    value: number;
    previousValue: number | null;
    absoluteVariation: number | null;
    percentageVariation: number | null;
    historicalSeries: number[];
    confidence: 'high' | 'medium' | 'low';
}

export interface OperationalMetrics extends AnalyticalAvailability {
    period: {
        currentYear: number;
        previousYear: number | null;
    };
    revenueGrowth: OperationalMetricValue;
    grossMargin: OperationalMetricValue;
    ebitdaMargin: OperationalMetricValue;
    netMargin: OperationalMetricValue;
    operatingEfficiency: OperationalMetricValue; // OPEX / Net Revenue
    ebitdaConversion: OperationalMetricValue;    // EBITDA / Net Revenue
}

export class OperationalMetricsEngine {
    public static calculate(dataset: DreDataset): OperationalMetrics {
        const { current, history } = dataset;
        const currentYear = current.period.year;
        
        let prevYearIndex = history.findIndex(h => h.period.year === currentYear) - 1;
        if (prevYearIndex < 0 && history.length > 1 && history[history.length - 1].period.year === currentYear) {
            prevYearIndex = history.length - 2;
        }

        const previous = prevYearIndex >= 0 ? history[prevYearIndex] : null;

        const revGrowth = this.buildMetric('revenueGrowth', 'Crescimento da Receita Líquida', 'growth', current, previous, history, 
            d => d.revenue.netRevenue
        );
        // If it's growth, the formula is (current - prev) / prev. 
        // We adjust percentageVariation directly for growth metric.
        if (revGrowth.previousValue && revGrowth.previousValue > 0) {
            revGrowth.value = (revGrowth.value / revGrowth.previousValue) - 1;
            // The absolute variation of revenue is the nominal difference
            revGrowth.absoluteVariation = (current.revenue.netRevenue - previous!.revenue.netRevenue);
            revGrowth.percentageVariation = revGrowth.value; // It IS the variation
        } else {
            revGrowth.value = 0;
            revGrowth.percentageVariation = null;
        }

        return {
            available: true,
            period: {
                currentYear,
                previousYear: previous ? previous.period.year : null
            },
            revenueGrowth: revGrowth,
            grossMargin: this.buildMetric('grossMargin', 'Margem Bruta', 'profitability', current, previous, history, 
                d => d.revenue.netRevenue > 0 ? (d.margins.grossProfit / d.revenue.netRevenue) : 0
            ),
            ebitdaMargin: this.buildMetric('ebitdaMargin', 'Margem EBITDA', 'profitability', current, previous, history, 
                d => d.revenue.netRevenue > 0 ? (d.operationalResult.ebitda / d.revenue.netRevenue) : 0
            ),
            netMargin: this.buildMetric('netMargin', 'Margem Líquida', 'profitability', current, previous, history, 
                d => d.revenue.netRevenue > 0 ? (d.netResult.netIncome / d.revenue.netRevenue) : 0
            ),
            operatingEfficiency: this.buildMetric('operatingEfficiency', 'Eficiência Operacional (OPEX/Receita)', 'efficiency', current, previous, history, 
                d => d.revenue.netRevenue > 0 ? (d.expenses.opex / d.revenue.netRevenue) : 0
            ),
            ebitdaConversion: this.buildMetric('ebitdaConversion', 'Conversão de EBITDA', 'conversion', current, previous, history, 
                d => d.revenue.netRevenue > 0 ? (d.operationalResult.ebitda / d.revenue.netRevenue) : 0
            ) // Basically identical to EBITDA Margin in this simple model, but Semantically tracks the ability to turn ops into cash/ebitda
        };
    }

    private static buildMetric(
        id: string, 
        name: string, 
        category: 'growth' | 'profitability' | 'efficiency' | 'conversion',
        current: NormalizedDre, 
        previous: NormalizedDre | null, 
        history: NormalizedDre[],
        extractor: (d: NormalizedDre) => number
    ): OperationalMetricValue {
        
        const value = extractor(current);
        const previousValue = previous ? extractor(previous) : null;
        
        let absoluteVariation = null;
        let percentageVariation = null;

        if (previousValue !== null) {
            absoluteVariation = value - previousValue;
            if (previousValue !== 0) {
                // Since most metrics here are margins/ratios, the percentage variation of a margin 
                // is often represented as bps or just absolute difference. We will store the relative percentage change.
                percentageVariation = (value / previousValue) - 1;
            }
        }

        const historicalSeries = history.map(h => extractor(h));
        const hasMissingData = history.some(h => h.revenue.netRevenue === 0);

        return {
            id,
            name,
            category,
            value,
            previousValue,
            absoluteVariation,
            percentageVariation,
            historicalSeries,
            confidence: hasMissingData ? 'low' : 'high'
        };
    }
}
