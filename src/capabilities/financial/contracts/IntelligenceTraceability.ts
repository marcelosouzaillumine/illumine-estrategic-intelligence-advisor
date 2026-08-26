export type EvidenceLevel =
    | "direct"
    | "derived"
    | "aggregated";

export interface IntelligenceTraceability {
    sourceId: string;
    sourceType: "balance_sheet" | "income_statement" | "cash_flow";
    account?: {
        code?: string;
        name: string;
        value?: number;
        formattedValue?: string;
    };
    metric?: {
        id: string;
        name: string;
        value: number;
        formattedValue: string;
        unit: "currency" | "percentage" | "ratio" | "count";
    };
    period: {
        fiscalYear: number;
    };
    calculation?: {
        formula: string;
        inputs: string[];
    };
    evidenceLevel: EvidenceLevel;
}
