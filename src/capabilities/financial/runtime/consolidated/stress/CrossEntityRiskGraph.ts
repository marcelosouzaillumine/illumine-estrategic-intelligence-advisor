import { EntityInputPayload, EliminatedValueRecord, UnreconciledIntercompany } from '../consolidated-types';
import { ContagionEdge } from './stress-types';
import { SharedLiabilityStressEngine } from './SharedLiabilityStressEngine';
import { CrossEntityCashDependencyResolver } from './CrossEntityCashDependencyResolver';
import { ExecutiveIntelligenceReport } from '../../../../core/runtime/executive-intelligence-runtime';

/**
 * Mapeia as conexões matemáticas/estruturais entre as entidades.
 * Só cria uma aresta (Edge) se houver prova contábil, garantindo a governança epistemológica.
 */
export class CrossEntityRiskGraph {
  
  private sharedLiabilityEngine = new SharedLiabilityStressEngine();
  private cashDependencyResolver = new CrossEntityCashDependencyResolver();

  public buildRiskEdges(
    entities: EntityInputPayload[],
    eliminatedEntries: EliminatedValueRecord[],
    unreconciled: UnreconciledIntercompany[],
    reportsMap: Map<string, ExecutiveIntelligenceReport>
  ): ContagionEdge[] {
    let edges: ContagionEdge[] = [];

    // 1. Arestas baseadas em Mútuos Eliminados (Funding Dependency)
    for (const elim of eliminatedEntries) {
      if (elim.type === 'Mutuo') {
        // Se A (source) financiou B (target) com Mútuo:
        // A é o fornecedor de fundos, B é o tomador.
        // O Risco flui de B para A (Se B quebra, A perde o dinheiro).
        // Mas também flui de A para B (Se A corta o funding, B quebra).
        
        edges.push({
          sourceEntity: elim.sourceEntityId,
          targetEntity: elim.targetEntityId,
          propagationType: 'FINANCIAL',
          causalReason: `Dependência de Funding comprovada via Mútuo eliminado de ${elim.amount}`,
          confidence: 'DIRECT_EXPOSURE',
          propagationWeight: 0.8, // Alto peso por ser financeiro direto
          affectedMetrics: ['runway', 'liquidity'],
          lineage: `[EDGE] ${elim.sourceEntityId} provê funding via mútuo para ${elim.targetEntityId}`
        });

        // Contágio reverso (Target falhando asfixia Source)
        edges.push({
          sourceEntity: elim.targetEntityId, // B
          targetEntity: elim.sourceEntityId, // A
          propagationType: 'FINANCIAL',
          causalReason: `Risco de calote em Mútuo de ${elim.amount}`,
          confidence: 'DIRECT_EXPOSURE',
          propagationWeight: 0.5, // Impacto moderado (A pode sobreviver se for grande)
          affectedMetrics: ['runway'],
          lineage: `[EDGE] ${elim.targetEntityId} deve ${elim.amount} para ${elim.sourceEntityId}`
        });
      }

      if (elim.type === 'Intercompany Revenue' || elim.type === 'Intercompany Expense') {
        // Aresta operacional (Supply/Services)
        edges.push({
          sourceEntity: elim.sourceEntityId,
          targetEntity: elim.targetEntityId,
          propagationType: 'OPERATIONAL',
          causalReason: `Dependência Operacional / Receita Intragrupo de ${elim.amount}`,
          confidence: 'DIRECT_EXPOSURE',
          propagationWeight: 0.6,
          affectedMetrics: ['ebitda', 'netMargin'],
          lineage: `[EDGE] Receita cruzada mapeada entre ${elim.sourceEntityId} e ${elim.targetEntityId}`
        });
      }
    }

    // 2. Arestas baseadas em itens Não Reconciliados
    for (const unrec of unreconciled) {
      if (unrec.targetEntityId) {
         edges.push({
           sourceEntity: unrec.sourceEntityId,
           targetEntity: unrec.targetEntityId,
           propagationType: 'FINANCIAL',
           causalReason: `Risco de contágio não mensurado (Unreconciled Intercompany: ${unrec.discrepancy})`,
           confidence: 'LOW_CONFIDENCE_PROPAGATION',
           propagationWeight: 0.3,
           affectedMetrics: ['composite'],
           lineage: `[EDGE] Desvio material não conciliado entre ${unrec.sourceEntityId} e ${unrec.targetEntityId}`
         });
      }
    }

    // 3. Arestas baseadas em Shared Liabilities (Garantias/Avais)
    const sharedLiabilityEdges = this.sharedLiabilityEngine.extractSharedLiabilities(entities);
    edges = edges.concat(sharedLiabilityEdges);

    // 4. Arestas baseadas em Dependência de Caixa Centralizado
    const cashDependencyEdges = this.cashDependencyResolver.extractCashDependencies(entities, reportsMap);
    edges = edges.concat(cashDependencyEdges);

    return edges;
  }
}
