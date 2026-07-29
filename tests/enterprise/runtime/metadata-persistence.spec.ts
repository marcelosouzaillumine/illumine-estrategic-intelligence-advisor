import { metadataRepository } from '../../../packages/metadata/src/persistence/metadata-repository';

export async function testMetadataPersistence(): Promise<boolean> {
  const versionRecord = await metadataRepository.saveEntity(
    {
      id: 'financial_ledger',
      version: '1.0.0',
      name: 'Financial Ledger',
      domain: 'Finance',
      architecture: 'EAA',
      fields: [{ id: 'balance', labelKey: 'Saldo', type: 'currency', required: true }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: 'EnterpriseTestRunner',
      status: 'STABLE'
    },
    'usr-architect'
  );

  if (versionRecord.version !== 1 || versionRecord.status !== 'ACTIVE') {
    throw new Error('Falha no teste de persistência e versionamento de metadados');
  }

  const rolledBack = metadataRepository.rollbackToVersion('financial_ledger', 1);
  if (!rolledBack || rolledBack.id !== 'financial_ledger') {
    throw new Error('Falha no teste de rollback de metadados');
  }

  return true;
}
