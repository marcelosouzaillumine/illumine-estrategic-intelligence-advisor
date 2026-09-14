export interface IntelligenceObservation { text: string; }
export interface IntelligenceEvidence { text: string; }
export interface IntelligenceInterpretation { text: string; }
import { IntelligenceTraceability } from './IntelligenceTraceability';

export type SignalMateriality =
    | "low"
    | "moderate"
    | "high"
    | "critical";

export type SignalPersistence =
    | "conjunctural"
    | "structural"
    | "unknown";

export type SignalHorizon =
    | "short_term"
    | "medium_term"
    | "long_term"
    | "unknown";

export type SignalConfidence =
    | "low"
    | "medium"
    | "high";

export interface IntelligenceSignal {
    id: string;
    category: "liquidity" | "capital_structure" | "working_capital" | "solvency" | "asset_quality" | "debt_structure" | "financial_stress";
    severity: "informational" | "attention" | "critical";
    materiality: SignalMateriality;
    persistence: SignalPersistence;
    horizon: SignalHorizon;
    confidence: SignalConfidence;
    observation: IntelligenceObservation;
    evidence: IntelligenceEvidence;
    interpretation: IntelligenceInterpretation;
    sourceMetric?: { name: string; value: string; };
    
    // Gate 7: Evidence Graph Strict Fields
    metric?: string;
    value?: number;
    threshold?: string;
    period?: number;
    direction?: string;
    epistemicLimit?: "DETERMINABLE" | "PARTIALLY_DETERMINABLE" | "NOT_DETERMINABLE";

    relatedQuestion?: string; // originSignalId
    traceability?: IntelligenceTraceability;
}
