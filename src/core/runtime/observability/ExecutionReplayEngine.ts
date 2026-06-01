import { ReplayExecutionResult } from './observability-types';
import { RuntimeExecutionRegistry } from './RuntimeExecutionRegistry';
import { ExecutionTraceBuilder } from './ExecutionTraceBuilder';
import { ConsolidatedExecutiveAdvisoryReport } from '../consolidated/advisory/advisoryTypes';

export class ExecutionReplayEngine {
  /**
   * O Replay Engine carrega um registro imutável do Firebase.
   * Ele NÃO RECALCULA absolutamente nada. Se o Advisory daquele minuto estiver com dados errados, o replay
   * reproduzirá os dados errados. A imutabilidade forense é a prioridade.
   */
  static async loadHistoricalReplay(executionId: string): Promise<ReplayExecutionResult | null> {
    const record = await RuntimeExecutionRegistry.getExecution(executionId);
    if (!record) return null;

    const trace = await ExecutionTraceBuilder.getTrace(executionId);
    
    // O snapshot do report foi serializado no próprio record.lineageSnapshot ou similar.
    // Para simplificar a reconstrução sem ter que salvar a árvore de view layer inteira no firebase:
    // A Fase 4 consome ConsolidatedExecutiveAdvisoryReport. 
    // Como combinamos append-only, vamos buscar do record.lineageSnapshot.advisoryReport.
    const snapshotReport: ConsolidatedExecutiveAdvisoryReport = record.lineageSnapshot.advisoryReport as unknown as ConsolidatedExecutiveAdvisoryReport;

    if (!snapshotReport || !trace) {
      console.warn(`[ExecutionReplayEngine] Snapshot incompleto para executionId: ${executionId}`);
      return null;
    }

    return {
      executionRecord: record,
      trace,
      snapshotReport
    };
  }
}
