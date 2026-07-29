import { MetadataEntity } from '../schemas/entity-schema';
import { MetadataVersioning, MetadataVersion } from './metadata-versioning';
import { eventBus } from '../../../core/src/events/event-bus';

export class MetadataRepository {
  private storage = new Map<string, MetadataEntity>();
  private versioning = new MetadataVersioning();

  public async saveEntity(entity: MetadataEntity, author: string): Promise<MetadataVersion> {
    this.storage.set(entity.id, entity);

    const checksum = `sha256-ent-${entity.id}-${entity.version}`;
    const versionRecord = this.versioning.createVersion(entity.id, author, checksum);

    // Dispara o evento MetadataUpdated compulsório no EventBus
    await eventBus.publish({
      type: 'MetadataUpdated',
      payload: { entityId: entity.id, version: versionRecord.version, author },
      timestamp: new Date().toISOString(),
      source: 'MetadataRepository'
    });

    return versionRecord;
  }

  public getEntity(entityId: string): MetadataEntity | undefined {
    return this.storage.get(entityId);
  }

  public rollbackToVersion(entityId: string, versionNumber: number): MetadataEntity | undefined {
    const versions = this.versioning.listVersions(entityId);
    const target = versions.find((v) => v.version === versionNumber);
    if (target) {
      target.status = 'ACTIVE';
      return this.storage.get(entityId);
    }
    return undefined;
  }
}

export const metadataRepository = new MetadataRepository();
