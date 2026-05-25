import { ConsolidatedOrchestratorInput, EliminatedValueRecord, UnreconciledIntercompany } from '../consolidated-types';
import { ExecutiveIntelligenceReport } from '../../executive-intelligence-runtime';
import { SystemicRiskProfile } from './stress-types';
import { CrossEntityRiskGraph } from './CrossEntityRiskGraph';
import { InstitutionalContagionResolver } from './InstitutionalContagionResolver';
import { SystemicRiskAggregator } from './SystemicRiskAggregator';

export class ConsolidatedStressPropagationEngine {
  private graph: CrossEntityRiskGraph;
  private resolver: InstitutionalContagionResolver;
  private aggregator: SystemicRiskAggregator;

  constructor() {
    this.graph = new CrossEntityRiskGraph();
    this.resolver = new InstitutionalContagionResolver();
    this.aggregator = new SystemicRiskAggregator();
  }

  public propagateStress(
    input: ConsolidatedOrchestratorInput,
    reportsMap: Map<string, ExecutiveIntelligenceReport>,
    eliminatedEntries: EliminatedValueRecord[] = [],
    unreconciled: UnreconciledIntercompany[] = []
  ): SystemicRiskProfile {
    
    // 1. Construir o Grafo de Dependências (Baseado apenas em Edges Reais / Eliminações)
    const baseEdges = this.graph.buildRiskEdges(input.entities, eliminatedEntries, unreconciled, reportsMap);

    // 2. Resolver Contágios Ativos (A restrição epistemológica aplica-se aqui: quem afeta quem)
    const activeContagions = this.resolver.resolveActiveContagions(baseEdges, reportsMap);

    // 3. Agregar Riscos e Gerar o Perfil Sistêmico
    const riskProfile = this.aggregator.aggregate(baseEdges, activeContagions, unreconciled);

    return riskProfile;
  }
}
