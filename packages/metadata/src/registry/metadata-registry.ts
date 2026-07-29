import { MetadataEntity } from '../schemas/entity-schema';
import { eventBus } from '../../../core/src/events/event-bus';

export class MetadataRegistry {
  private entities = new Map<string, MetadataEntity>();

  public registerEntity(entity: MetadataEntity): void {
    this.entities.set(entity.id, entity);
    
    // Dispara evento compulsório no EventBus conforme regra MUST da Fase 1
    eventBus.publish({
      type: 'MetadataUpdated',
      payload: { entityId: entity.id, version: entity.version },
      timestamp: new Date().toISOString(),
      source: 'MetadataRegistry'
    });
  }

  public getEntity(entityId: string): MetadataEntity | undefined {
    return this.entities.get(entityId);
  }

  public listEntities(): MetadataEntity[] {
    return Array.from(this.entities.values());
  }
}

export const metadataRegistry = new MetadataRegistry();
