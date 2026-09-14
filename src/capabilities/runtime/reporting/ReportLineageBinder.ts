import { ReportLineageMetadata } from './ReportingTypes';

export class ReportLineageBinder {
  /**
   * Constrói o vínculo matemático e temporal de um relatório, garantindo
   * que ele aponte exatamente para o momento de execução e para o input original.
   */
  static bindLineage(executionId: string, inputHash: string, version: number, scenarioId?: string): ReportLineageMetadata {
    const timestamp = new Date().toISOString();
    
    // LineageHash é uma assinatura simples do vínculo (Execution + Input + Time + Version)
    // Em um sistema maduro isso seria gerado com SHA-256
    const payload = `${executionId}|${inputHash}|${timestamp}|${version}|${scenarioId || 'NONE'}`;
    const lineageHash = btoa(payload).slice(0, 32);

    return {
      executionId,
      scenarioId,
      inputHash,
      lineageHash,
      runtimeVersion: '1.0.0-phase9',
      reportVersion: version,
      timestamp
    };
  }
}
