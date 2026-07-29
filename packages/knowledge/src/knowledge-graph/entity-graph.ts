import { BusinessEntity, Relationship } from '../ontology/business-entity';

export class EntityGraph {
  private entities = new Map<string, BusinessEntity>();

  public addEntity(entity: BusinessEntity): void {
    this.entities.set(entity.id, entity);
  }

  public getEntity(id: string): BusinessEntity | undefined {
    return this.entities.get(id);
  }

  public addRelationship(rel: Relationship): void {
    const source = this.entities.get(rel.sourceId);
    if (source) {
      source.relationships.push(rel);
    }
  }

  public listEntities(): BusinessEntity[] {
    return Array.from(this.entities.values());
  }
}

export const entityGraph = new EntityGraph();
