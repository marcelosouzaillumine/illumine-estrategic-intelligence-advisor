import { AdvisoryContext, ArchitectureSignal, ArchitectureNarrative, AdvisoryEvidenceGraph, EvidenceNode } from '../models/index';

export interface ArchitecturePatternAnalyzer {
  analyze(context: AdvisoryContext): ArchitectureSignal[];
}
