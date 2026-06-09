import { RuntimeCacheManager } from '../core/runtime/cache/RuntimeCacheManager';
import { WorkspaceCacheBoundary } from '../core/runtime/cache/WorkspaceCacheBoundary';

function runTenantIsolationStress() {
  console.log('Iniciando Tenant Isolation Stress Test...');

  // Injecting mock cache for Tenant A
  RuntimeCacheManager.set('secret-report', { data: 'CONFIDENTIAL A' }, { tenantId: 'TENANT-A', workspaceId: 'WS-1', role: 'ADVISOR', userId: '1' });
  
  // Try to access from Tenant B
  const leakAttempt = RuntimeCacheManager.get('secret-report', { tenantId: 'TENANT-B', workspaceId: 'WS-2', role: 'ADVISOR', userId: '2' });
  
  if (leakAttempt) {
    console.error('❌ CRITICAL: CROSS-TENANT LEAKAGE DETECTADO!');
    process.exit(1);
  }

  console.log('✅ Tentativa de Leakage Cross-Tenant bloqueada com sucesso.');

  // Trigger Workspace Switch
  WorkspaceCacheBoundary.purgeOnSwitch('WS-1', 'WS-3');

  const cacheAfterSwitch = RuntimeCacheManager.get('secret-report', { tenantId: 'TENANT-A', workspaceId: 'WS-1', role: 'ADVISOR', userId: '1' });
  if (cacheAfterSwitch) {
    console.error('❌ CRITICAL: Cache sobreviveu à troca de Workspace!');
    process.exit(1);
  }

  console.log('✅ Workspace Boundary Test Passou.');
}

runTenantIsolationStress();
