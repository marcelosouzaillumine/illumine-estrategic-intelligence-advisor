import { OperationalMetrics } from '../OperationalMetricsEngine';

export interface OperationalDimensionScore {
    name: string;
    value: number;
    weight: number;
}

export interface OperationalScore {
    composite: number;
    dimensions: {
        growth: OperationalDimensionScore;
        grossProfitability: OperationalDimensionScore;
        operatingEfficiency: OperationalDimensionScore;
        ebitdaPerformance: OperationalDimensionScore;
        netProfitability: OperationalDimensionScore;
    };
    confidence: 'high' | 'medium' | 'low';
    available: boolean;
}

export class OperationalScoreEngine {
    public static calculate(metrics: OperationalMetrics, periodsAnalyzed: number): OperationalScore {
        if (!metrics.available) {
            return this.emptyScore();
        }

        const growthScore = this.scoreGrowth(metrics.revenueGrowth.value);
        const grossScore = this.scoreMargin(metrics.grossMargin.value, 0.3, 0.15); // >30% is great, <15% is bad
        const efficiencyScore = this.scoreEfficiency(metrics.operatingEfficiency.value); // Lower OPEX ratio is better
        const ebitdaScore = this.scoreMargin(metrics.ebitdaMargin.value, 0.2, 0.05);
        const netScore = this.scoreMargin(metrics.netMargin.value, 0.1, 0.02);

        const composite = (
            (growthScore * 0.20) +
            (grossScore * 0.20) +
            (efficiencyScore * 0.15) +
            (ebitdaScore * 0.30) +
            (netScore * 0.15)
        );

        let confidence: 'high' | 'medium' | 'low' = 'low';
        if (periodsAnalyzed >= 4) confidence = 'high';
        else if (periodsAnalyzed >= 2) confidence = 'medium';

        return {
            composite: Math.round(composite),
            available: true,
            confidence,
            dimensions: {
                growth: { name: 'Growth', value: growthScore, weight: 20 },
                grossProfitability: { name: 'Gross Profitability', value: grossScore, weight: 20 },
                operatingEfficiency: { name: 'Operating Efficiency', value: efficiencyScore, weight: 15 },
                ebitdaPerformance: { name: 'EBITDA Performance', value: ebitdaScore, weight: 30 },
                netProfitability: { name: 'Net Profitability', value: netScore, weight: 15 }
            }
        };
    }

    private static scoreGrowth(value: number | null): number {
        if (value === null) return 50;
        if (value >= 0.199) return 100;
        if (value >= 0.099) return 80;
        if (value >= 0) return 60;
        if (value >= -0.10) return 30;
        return 0;
    }

    private static scoreMargin(value: number | null, excellentThreshold: number, warningThreshold: number): number {
        if (value === null) return 50;
        if (value >= excellentThreshold) return 100;
        if (value >= warningThreshold) return 70;
        if (value > 0) return 40;
        return 0;
    }

    private static scoreEfficiency(opexRatio: number | null): number {
        if (opexRatio === null) return 50;
        // OPEX as % of Revenue. Less is more efficient.
        if (opexRatio <= 0.15) return 100; // < 15% OPEX
        if (opexRatio <= 0.30) return 80;
        if (opexRatio <= 0.50) return 50;
        if (opexRatio <= 0.70) return 20;
        return 0;
    }

    private static emptyScore(): OperationalScore {
        return {
            composite: 0,
            available: false,
            confidence: 'low',
            dimensions: {
                growth: { name: 'Growth', value: 0, weight: 20 },
                grossProfitability: { name: 'Gross Profitability', value: 0, weight: 20 },
                operatingEfficiency: { name: 'Operating Efficiency', value: 0, weight: 15 },
                ebitdaPerformance: { name: 'EBITDA Performance', value: 0, weight: 30 },
                netProfitability: { name: 'Net Profitability', value: 0, weight: 15 }
            }
        };
    }
}
