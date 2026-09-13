import { KnowledgeNodeType, KnowledgeEdgeType } from './KnowledgeGraphTypes';

export class EntityRelationshipMapper {
  static getValidEdgeTypes(sourceType: KnowledgeNodeType, targetType: KnowledgeNodeType): KnowledgeEdgeType[] {
    // Mapeamento rígido de quais relações fazem sentido semanticamente. Evita grafos caóticos.
    const map: Record<string, KnowledgeEdgeType[]> = {
      'ALERT->WORKFLOW': ['TRIGGERED', 'RELATED_TO'],
      'WORKFLOW->DECISION': ['GENERATED', 'ESCALATED_TO'],
      'DECISION->USER': ['APPROVED_BY'],
      'ECONOMIC_GROUP->ENTITY': ['BELONGS_TO'],
      'ENTITY->SYSTEMIC_RISK': ['CAUSED', 'OBSERVED_IN'],
      'GOVERNANCE_VIOLATION->DECISION': ['CAUSED'],
      'GOVERNANCE_VIOLATION->ALERT': ['TRIGGERED']
    };

    const key = `\${sourceType}->\${targetType}`;
    return map[key] || ['RELATED_TO', 'LINKED_TO'];
  }
}
