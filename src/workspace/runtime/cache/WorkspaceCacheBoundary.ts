import { RuntimeCacheManager } from './RuntimeCacheManager';
import { RuntimeProfiler } from '../../../core/runtime/profiling/RuntimeProfiler';
import { QueryPerformanceTracker } from '../../../core/runtime/profiling/QueryPerformanceTracker';
import { RuntimeMemoryTracker } from '../../../core/runtime/profiling/RuntimeMemoryTracker';

export class WorkspaceCacheBoundary {
  /**
   * Executado sempre que o WorkspaceSwitcher é acionado.
   * Assegura que nada sobreviva à troca de cliente.
   */
  static purgeOnSwitch(oldWorkspaceId: string, newWorkspaceId: string) {
    console.log(`[WorkspaceCacheBoundary] Purgando caches do workspace antigo: ${oldWorkspaceId}`);
    
    RuntimeCacheManager.deleteWorkspaceCache(oldWorkspaceId);
    
    // Limpar profilings para não misturar estatísticas entre tenants
    RuntimeMemoryTracker.clear();
    QueryPerformanceTracker.clear();

    console.log(`[WorkspaceCacheBoundary] Ambiente higienizado para o workspace: ${newWorkspaceId}`);
  }

  static purgeOnLogout() {
    console.log(`[WorkspaceCacheBoundary] Logout detectado. Purgando RAM inteira.`);
    RuntimeCacheManager.clearAll();
    RuntimeMemoryTracker.clear();
    QueryPerformanceTracker.clear();
  }
}
