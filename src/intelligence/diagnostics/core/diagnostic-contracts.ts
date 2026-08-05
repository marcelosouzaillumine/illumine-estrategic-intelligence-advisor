import { DiagnosticDomain, MaturityLevel } from './diagnostic-types';
import { ScoringEngine } from './scoring-engine';
import { ExecutiveIntelligenceProfile } from '../models/executive-intelligence-profile';
import { DiagnosticExecutionContext } from './diagnostic-types';

export interface MaturityMatrixLevel {
  level: string;
  threshold: number;
  interpretation: string;
  implications: string[];
}

export type DiagnosticMaturityMatrix = Record<MaturityLevel, MaturityMatrixLevel>;

export interface DiagnosticAttentionArea {
  id: string;
  name: string;
  description: string;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  relatedDimensions: string[];
}

export interface DiagnosticIndicator {
  id: string;
  name: string;
  weight: number;
}

export interface DiagnosticDimension {
  id: string;
  name: string;
  description: string;
  weight: number;
  indicators: DiagnosticIndicator[];
}

export interface DiagnosticOption {
  id: string;
  text: string;
  weight: number; // Internal scoring weight
}

export interface DiagnosticQuestion {
  id: string;
  text: string;
  dimensionId: string;
  type: "single_choice" | "multiple_choice" | "scale";
  options: DiagnosticOption[];
}

export interface ExecutiveDiagnostic {
  id: string; // Internal unique ID
  journeyId: string; // External route/journey ID used by Concierge
  name: string;
  domain: DiagnosticDomain;
  description: string;
  dimensions: DiagnosticDimension[];
  questions: DiagnosticQuestion[];
  scoringEngine: ScoringEngine;
  
  // Future extensibility for specific overrides
  generateProfile(context: DiagnosticExecutionContext): Promise<ExecutiveIntelligenceProfile>;
}
