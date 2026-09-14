export class OrchestrationProfiler {
  /**
   * Envelopa a execução para medir o tempo exato e reportar na telemetria.
   */
  static profile<T>(name: string, executionBlock: () => T): { result: T, elapsedMs: number } {
    const start = performance.now();
    const result = executionBlock();
    const elapsedMs = performance.now() - start;
    
    // O Orchestrator pegará esse tempo e injetará no RuntimeTelemetryEngine
    return { result, elapsedMs };
  }
}
