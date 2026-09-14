import { GraphQuery } from './KnowledgeGraphTypes';
import { GraphAuditLogger } from './GraphAuditLogger';

export class KnowledgeGraphGovernanceEngine {
  static validateQueryScope(query: GraphQuery): boolean {
    if (!query.tenantId) {
      GraphAuditLogger.logEvent('UNKNOWN', 'GRAPH_QUERY_BLOCKED', 'Query bloqueada por ausência de tenantId (Cross-tenant prevention).');
      return false;
    }

    if (!query.requestorId) {
      GraphAuditLogger.logEvent(query.tenantId, 'GRAPH_QUERY_BLOCKED', 'Query bloqueada por ausência de requestorId (Permission Scope).');
      return false;
    }

    // Limitamos profundidade para evitar travamentos ou extrações exaustivas locais
    if (query.maxDepth && query.maxDepth > 3) {
      GraphAuditLogger.logEvent(query.tenantId, 'GRAPH_QUERY_BLOCKED', `Query bloqueada devido a profundidade perigosa (${query.maxDepth} > 3).`);
      return false;
    }

    return true;
  }

  static validateNodeCreation(tenantId: string): boolean {
    if (!tenantId) return false;
    return true;
  }

  static validateEdgeCreation(tenantId: string, lineageHash: string): boolean {
    if (!tenantId || !lineageHash) return false;
    return true;
  }
}
