import { MemorySpikeRecord } from './ProfilingTypes';

export class RuntimeMemoryTracker {
  private static spikes: MemorySpikeRecord[] = [];

  /**
   * Monitora indiretamente pico de memória inferindo o tamanho aproximado via stringificação
   * para estruturas vitais como Snapshots, sem travar o runtime.
   */
  static estimatePayloadSize(action: string, payload: any): number {
    try {
      const start = performance.now();
      const stringified = JSON.stringify(payload);
      const bytes = new Blob([stringified]).size;
      const duration = performance.now() - start;

      if (bytes > 5 * 1024 * 1024) { // Warning > 5MB
        this.spikes.push({
          timestamp: new Date().toISOString(),
          action,
          estimatedBytes: bytes
        });
        console.warn(`[RuntimeMemoryTracker] PICO DETECTADO: Payload '${action}' atingiu ${(bytes / 1024 / 1024).toFixed(2)} MB. Serialização levou ${duration.toFixed(2)}ms.`);
      }

      return bytes;
    } catch (e) {
      console.error('[RuntimeMemoryTracker] Falha ao estimar memória', e);
      return 0;
    }
  }

  static getSpikes(): MemorySpikeRecord[] {
    return [...this.spikes];
  }

  static clear() {
    this.spikes = [];
  }
}
