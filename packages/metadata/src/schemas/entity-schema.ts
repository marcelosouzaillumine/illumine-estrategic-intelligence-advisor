export interface MetadataField {
  id: string;
  labelKey: string;
  type: 'string' | 'number' | 'boolean' | 'currency' | 'date' | 'select';
  required: boolean;
}

export interface MetadataEntity {
  id: string;
  version: string;
  name: string;
  domain: string;
  architecture: 'EAA' | 'EFA';
  fields: MetadataField[];
  createdAt: string;
  updatedAt: string;
  owner: string;
  status: 'DRAFT' | 'STABLE' | 'DEPRECATED';
}
