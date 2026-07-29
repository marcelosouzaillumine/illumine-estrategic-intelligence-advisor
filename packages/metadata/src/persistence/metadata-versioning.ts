export interface MetadataVersion {
  id: string;
  entityId: string;
  version: number;
  createdAt: string;
  createdBy: string;
  checksum: string;
  status: 'ACTIVE' | 'ARCHIVED';
}

export class MetadataVersioning {
  private versions = new Map<string, MetadataVersion[]>();

  public createVersion(entityId: string, createdBy: string, checksum: string): MetadataVersion {
    const list = this.versions.get(entityId) || [];
    const nextVersionNumber = list.length + 1;

    // Arquivar versão anterior se existir
    list.forEach((v) => (v.status = 'ARCHIVED'));

    const newVer: MetadataVersion = {
      id: `VER-${entityId}-${nextVersionNumber}`,
      entityId,
      version: nextVersionNumber,
      createdAt: new Date().toISOString(),
      createdBy,
      checksum,
      status: 'ACTIVE'
    };

    list.push(newVer);
    this.versions.set(entityId, list);
    return newVer;
  }

  public getActiveVersion(entityId: string): MetadataVersion | undefined {
    const list = this.versions.get(entityId) || [];
    return list.find((v) => v.status === 'ACTIVE');
  }

  public listVersions(entityId: string): MetadataVersion[] {
    return this.versions.get(entityId) || [];
  }
}
