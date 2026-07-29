import { metadataRegistry } from '../../../metadata/src/registry/metadata-registry';

export class MetadataAdapter {
  public static resolveEntity(entityId: string) {
    return metadataRegistry.getEntity(entityId);
  }
}
