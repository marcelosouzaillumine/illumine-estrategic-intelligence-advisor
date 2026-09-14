import { AnalyticalAvailability } from '../../../../core/contracts/AnalyticalAvailability';

export class AnalyticalEvidenceResolver {
    static resolveMissingHistory(): AnalyticalAvailability {
        return {
            available: false,
            availabilityReason: {
                type: "INSUFFICIENT_HISTORY",
                title: "Insufficient Analytical Evidence",
                explanation: "Historical period unavailable (minimum 2 comparable periods required).",
                impact: "Trend analysis cannot be concluded."
            }
        };
    }

    static resolveMissingTechnicalData(): AnalyticalAvailability {
        return {
            available: false,
            availabilityReason: {
                type: "INCOMPLETE_DATA_SOURCE",
                title: "Technical Evidence Unavailable",
                explanation: "Insufficient metrics to construct the structural analytical tables.",
                impact: "Low-level structural inspection cannot be rendered."
            }
        };
    }
}
