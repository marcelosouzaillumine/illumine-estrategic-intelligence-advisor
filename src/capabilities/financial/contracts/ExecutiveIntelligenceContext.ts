import { IntelligenceTraceability } from './FinancialProvenanceContract';
import { FinancialIndicatorsFact } from '../domain/types/FinancialIndicatorsFact';

export interface IntelligenceContextItem {
    id: string;
    description: string;
}

export interface IntelligenceAssessment extends IntelligenceContextItem {
    type: 'ASSESSMENT';
    indicatorsUsed: string[]; // references keys in facts
}

export interface IntelligenceDiagnosis extends IntelligenceContextItem {
    type: 'DIAGNOSIS';
    assessments: string[]; // IDs of assessments used
}

export interface IntelligenceRisk extends IntelligenceContextItem {
    type: 'RISK';
    level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    diagnosisId: string;
}

export interface IntelligenceRecommendation extends IntelligenceContextItem {
    type: 'RECOMMENDATION';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    diagnosisId: string;
}

export interface CausalRelationship {
    id: string;
    relationshipType: 'MATHEMATICAL' | 'STRUCTURAL' | 'TEMPORAL' | 'CAUSAL_HYPOTHESIS';
    causeId: string; // ID of indicator, fact, or diagnosis
    effectId: string; // ID of indicator, fact, or diagnosis
    description: string;
}

export interface ExecutiveIntelligenceContext {
    companyId: string;
    periodDate: string;
    facts: FinancialIndicatorsFact;
    assessments: IntelligenceAssessment[];
    diagnoses: IntelligenceDiagnosis[];
    risks: IntelligenceRisk[];
    causalRelationships: CausalRelationship[];
    recommendations: IntelligenceRecommendation[];
    provenance: IntelligenceTraceability[];
    constraints: string[]; // Global constraints or bounds
}
