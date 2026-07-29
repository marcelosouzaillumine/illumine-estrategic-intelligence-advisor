import { MetadataRegistry } from '../src/registry/metadata-registry';

export function testMetadataPackage(): boolean {
  const registry = new MetadataRegistry();
  registry.registerEntity({
    id: 'customer',
    version: '1.0.0',
    name: 'Customer',
    domain: 'CRM',
    architecture: 'EFA',
    fields: [{ id: 'id', labelKey: 'ID', type: 'string', required: true }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    owner: 'TestRunner',
    status: 'STABLE'
  });

  const retrieved = registry.getEntity('customer');
  if (!retrieved || retrieved.name !== 'Customer') {
    throw new Error('Falha no teste do MetadataRegistry');
  }

  return true;
}
