export interface AnalyticalAvailability {
    available: boolean;
    availabilityReason?: {
        type: "INSUFFICIENT_HISTORY" | "NO_COMPARABLE_PERIOD" | "INCOMPLETE_DATA_SOURCE" | "LOW_CONFIDENCE";
        title: string;
        explanation: string;
        impact: string;
    };
}
