export interface MetadataRegistryContract {
  registerEntity(entity: any): void;
  getEntity(entityId: string): any;
  listEntities(): any[];
}

export interface RuntimeContract {
  execute(manifest: any): any;
}

export interface CompilerContract {
  compile(manifestRaw: any): any;
}

export interface SEEContract {
  execute(input: any): any;
}

export interface CertificationContract {
  certifyL4(assetId: string): any;
}
