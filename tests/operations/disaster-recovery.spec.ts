import { BackupManager } from '../../packages/infrastructure/src/index';

export function testDisasterRecovery(): boolean {
  const result = BackupManager.createBackup('tnt-holding-alpha');

  if (result.status !== 'COMPLETED' || !result.checksum.startsWith('sha256-backup')) {
    throw new Error('Falha no teste de backup e disaster recovery');
  }

  return true;
}
