export interface ScoreDimension {
    value: number;
    weight: number;
    contribution: number;
    interpretation: string;
    evidence: {
        metrics: string[];
    };
    contributingIndicators?: Array<{
        indicator: string;
        value: number | string;
        contribution: number;
        traceability: string;
    }>;
    confidence: string;
}

export interface StructuralEvent {
    type: string;
    severity: "CRITICAL" | "WARNING" | "INFO";
    impact: string;
    evidence: string;
}

export interface FinancialPositionScore {
    overall: {
        value: number;
        classification: string;
        finalStatus: string;
        confidence: string;
        explanation: string;
        structuralEvents: StructuralEvent[];
        evolution?: {
            value: number;
            trend: string;
        };
    };
    dimensions: {
        liquidity: ScoreDimension;
        solvencyAndCapitalStructure: ScoreDimension;
        workingCapital: ScoreDimension;
        assetQuality: ScoreDimension;
        evolution: ScoreDimension;
    };
    methodology: {
        version: string;
        calculatedAt: string;
        dataPeriods: number;
        weights: {
            liquidity: number;
            solvencyAndCapitalStructure: number;
            workingCapital: number;
            assetQuality: number;
            evolution: number;
        }
    };
}
