import { InstitutionalNode } from "../../types/knowledge-graph/InstitutionalNode";
import { InstitutionalRelationship } from "../../types/knowledge-graph/InstitutionalRelationship";
import { GraphRepository } from "./storage/GraphRepository";
import { PersistentGraphNode } from "../../types/knowledge-graph/PersistentGraphNode";
import { PersistentGraphRelationship } from "../../types/knowledge-graph/PersistentGraphRelationship";

export class InstitutionalGraphRegistry {
  // In-memory storage for V1 / active session
  private static nodes: Map<string, InstitutionalNode> = new Map();
  private static relationships: Map<string, InstitutionalRelationship> = new Map();
  
  // Repository for persistence
  private static repository: GraphRepository | null = null;
  private static currentTenantId: string = 'UNKNOWN_TENANT';
  private static currentCorrelationId: string = 'UNKNOWN_CORRELATION';

  static setRepository(repo: GraphRepository, tenantId: string, correlationId: string): void {
    this.repository = repo;
    this.currentTenantId = tenantId;
    this.currentCorrelationId = correlationId;
  }

  static getRepository(): GraphRepository | null {
    return this.repository;
  }

  static getCurrentTenantId(): string {
    return this.currentTenantId;
  }

  static getCurrentCorrelationId(): string {
    return this.currentCorrelationId;
  }

  static registerNode(node: InstitutionalNode): void {
    this.nodes.set(node.nodeId, node);
    
    // Asynchronous persistence
    if (this.repository) {
      const persistentNode: PersistentGraphNode = {
        ...node,
        tenantId: this.currentTenantId,
        correlationId: this.currentCorrelationId,
        lineageId: 'N/A', // Assuming managed by another layer or passed down
        sourceEngine: 'InstitutionalGraphRegistry',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.repository.saveNode(persistentNode).catch(err => {
        console.warn('[InstitutionalGraphRegistry] Failed to persist node:', err);
      });
    }
  }

  static registerRelationship(relationship: InstitutionalRelationship): void {
    this.relationships.set(relationship.relationshipId, relationship);
    
    // Asynchronous persistence
    if (this.repository) {
      const persistentRel: PersistentGraphRelationship = {
        ...relationship,
        tenantId: this.currentTenantId,
        correlationId: this.currentCorrelationId,
        lineageId: 'N/A',
        sourceEngine: 'InstitutionalGraphRegistry',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.repository.saveRelationship(persistentRel).catch(err => {
        console.warn('[InstitutionalGraphRegistry] Failed to persist relationship:', err);
      });
    }
  }

  static getNode(nodeId: string): InstitutionalNode | undefined {
    return this.nodes.get(nodeId);
  }

  static getRelationships(): InstitutionalRelationship[] {
    return Array.from(this.relationships.values());
  }

  static getAllNodes(): InstitutionalNode[] {
    return Array.from(this.nodes.values());
  }

  static clear(): void {
    this.nodes.clear();
    this.relationships.clear();
  }
}
