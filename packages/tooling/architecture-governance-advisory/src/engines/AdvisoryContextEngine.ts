import { AdvisoryContext, AdvisorySnapshot, ArchitectureSignal, ArchitectureNarrative } from '../models/index';
import { DependencyTopologyAnalyzer } from '../analyzers/DependencyTopologyAnalyzer';
import { BoundaryEvolutionAnalyzer } from '../analyzers/BoundaryEvolutionAnalyzer';
import { ChangeConcentrationAnalyzer } from '../analyzers/ChangeConcentrationAnalyzer';
import { EvolutionAccelerationAnalyzer } from '../analyzers/EvolutionAccelerationAnalyzer';
import * as crypto from 'crypto';

export class AdvisoryContextEngine {
  private analyzers = [
    new DependencyTopologyAnalyzer(),
    new BoundaryEvolutionAnalyzer(),
    new ChangeConcentrationAnalyzer(),
    new EvolutionAccelerationAnalyzer()
  ];

  constructor(private readonly engineVersion: string = 'G4.0') {}

  generateAdvisory(context: AdvisoryContext): AdvisorySnapshot {
    const signals: ArchitectureSignal[] = [];
    
    // 1. Coleta determinística de Sinais
    for (const analyzer of this.analyzers) {
      signals.push(...analyzer.analyze(context));
    }

    // 2. Geração da Narrativa Factual
    const narratives: ArchitectureNarrative[] = [];
    
    if (signals.length > 0) {
      const statements = signals.map(s => ({
        text: `A subject ${s.subject} exibiu o padrão estrutural ${s.type} na categoria ${s.category}.`,
        derivedFromSignalId: s.id
      }));

      // Cria um grafo de evidências combinado
      const allNodes = signals.flatMap(s => s.evidenceGraph.nodes);
      const uniqueNodes = Array.from(new Map(allNodes.map(n => [n.id, n])).values());
      const evidenceGraph = { nodes: uniqueNodes, edges: [] };

      // Deterministic hash based on statement IDs and types to prove immutability
      const hashInput = statements.map(s => s.derivedFromSignalId).sort().join('|');
      const deterministicHash = crypto.createHash('sha256').update(hashInput).digest('hex');

      narratives.push({
        id: `NARR-${Date.now()}`,
        subject: context.targetSubject,
        statements,
        evidenceGraph,
        generatedBy: 'ADVISORY_ENGINE',
        deterministicHash
      });
    }

    return {
      version: this.engineVersion,
      targetSubject: context.targetSubject,
      periodStart: context.periodStart,
      periodEnd: context.periodEnd,
      signals,
      narratives,
      generatedBy: {
        engineVersion: this.engineVersion,
        timestamp: new Date().toISOString()
      }
    };
  }
}
