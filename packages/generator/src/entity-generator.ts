import { MetadataEntity } from '../../metadata/src/schemas/entity-schema';

export class EntityGenerator {
  public static generateEntity(domain: string, entityName: string): MetadataEntity {
    return {
      id: entityName.toLowerCase(),
      version: '1.0.0',
      name: entityName,
      domain,
      architecture: 'EFA',
      fields: [
        { id: 'id', labelKey: 'ID', type: 'string', required: true },
        { id: 'name', labelKey: 'Nome', type: 'string', required: true }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: 'ArchitectureGenerator',
      status: 'STABLE'
    };
  }
}
