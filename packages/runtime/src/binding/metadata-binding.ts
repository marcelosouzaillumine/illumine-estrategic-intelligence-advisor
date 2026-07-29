import { MetadataEntity } from '../../../metadata/src/schemas/entity-schema';
import { PageManifest } from '../engine/manifest-loader';

export class MetadataBinding {
  public static bindEntityToManifest(entity: MetadataEntity): PageManifest {
    return {
      id: `${entity.domain}.${entity.id}`,
      type: entity.architecture,
      layout: {
        template: entity.architecture === 'EAA' ? 'ExecutiveDashboard' : 'MasterDetail'
      },
      widgets: entity.fields.map((f) => `FIELD_${f.id.toUpperCase()}`)
    };
  }
}
