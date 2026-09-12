import { FinancialIndicatorsFact, Indicator } from '../../domain/types/FinancialIndicatorsFact';
import { ScoringModel, FinancialPositionScore, DimensionScore } from './ScoringModel';

export class HealthScorerV1 implements ScoringModel {
    public readonly version = 'FPS-v1.0';

    evaluate(facts: FinancialIndicatorsFact): FinancialPositionScore {
        const dimensions: DimensionScore[] = [
            this.evaluateLiquidity(facts.currentRatio, facts.quickRatio),
            this.evaluateCapitalStructure(facts.debtToEquityRatio),
            this.evaluateWorkingCapital(facts.ncg, facts.cgl),
            this.evaluateProfitability(facts.roe, facts.netMargin),
        ];

        let totalScore = 0;
        let totalWeight = 0;

        for (const dim of dimensions) {
            totalScore += dim.score * dim.weight;
            totalWeight += dim.weight;
        }

        // Normalize to 100 if weights don't sum to 1
        const finalScore = totalWeight > 0 ? (totalScore / totalWeight) : 0;

        return {
            totalScore: Math.round(finalScore),
            version: this.version,
            dimensions
        };
    }

    private evaluateLiquidity(currentRatio: Indicator, quickRatio: Indicator): DimensionScore {
        let score = 50; // default medium
        if (currentRatio.status === 'CALCULATED' && currentRatio.value !== null) {
            if (currentRatio.value > 1.5) score = 90;
            else if (currentRatio.value > 1.0) score = 70;
            else score = 30;
        }
        
        return {
            dimension: 'Liquidity',
            score,
            weight: 0.30,
            description: 'Capacity to meet short-term obligations.'
        };
    }

    private evaluateCapitalStructure(debtToEquity: Indicator): DimensionScore {
        let score = 50;
        if (debtToEquity.status === 'CALCULATED' && debtToEquity.value !== null) {
            if (debtToEquity.value < 0.5) score = 90;
            else if (debtToEquity.value < 1.0) score = 70;
            else if (debtToEquity.value < 2.0) score = 40;
            else score = 20;
        }

        return {
            dimension: 'Capital Structure',
            score,
            weight: 0.25,
            description: 'Balance of debt vs equity funding.'
        };
    }

    private evaluateWorkingCapital(ncg: Indicator, cgl: Indicator): DimensionScore {
        let score = 50;
        if (ncg.status === 'CALCULATED' && cgl.status === 'CALCULATED' && ncg.value !== null && cgl.value !== null) {
            const treasury = cgl.value - ncg.value;
            if (treasury > 0) score = 85;
            else if (treasury === 0) score = 50;
            else score = 20;
        }

        return {
            dimension: 'Working Capital',
            score,
            weight: 0.25,
            description: 'Fleuriet balance between working capital and needs.'
        };
    }

    private evaluateProfitability(roe: Indicator, netMargin: Indicator): DimensionScore {
        let score = 50;
        if (roe.status === 'CALCULATED' && roe.value !== null) {
            if (roe.value > 0.15) score = 90;
            else if (roe.value > 0.05) score = 65;
            else if (roe.value > 0) score = 45;
            else score = 10;
        }

        return {
            dimension: 'Profitability',
            score,
            weight: 0.20,
            description: 'Return on invested capital and margins.'
        };
    }
}
