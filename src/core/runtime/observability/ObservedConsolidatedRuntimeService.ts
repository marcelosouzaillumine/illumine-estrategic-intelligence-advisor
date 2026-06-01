import { ConsolidatedFinancialInput } from '../consolidated/types';
import { ConsolidatedExecutiveAdvisoryReport } from '../consolidated/advisory/advisoryTypes';
import { ConsolidatedGroupInput } from '../consolidated/data/dataTypes';
import { ConsolidatedDataModelValidator } from '../consolidated/data/ConsolidatedDataModelValidator';
import { EconomicGroupModel } from '../consolidated/data/GroupOnboardingRepository';
import { IntercompanyRelationModel } from '../consolidated/data/IntercompanyRelationRepository';
import { ConsolidatedDataValidationGateway } from '../consolidated/data/ConsolidatedDataValidationGateway';
import { ConsolidatedFinancialOrchestrator } from '../consolidated/ConsolidatedFinancialOrchestrator';
import { ConsolidatedAdvisoryOrchestrator } from '../consolidated/advisory/ConsolidatedAdvisoryOrchestrator';

import { RuntimeExecutionRegistry } from './RuntimeExecutionRegistry';
import { RuntimeExecutionLogger } from './RuntimeExecutionLogger';
import { ExecutionTraceBuilder } from './ExecutionTraceBuilder';
import { ConfidenceTimelineEngine } from './ConfidenceTimelineEngine';
import { GovernanceViolationHistory } from './GovernanceViolationHistory';
import { RuntimeExecutionRecord, GovernanceViolationRecord, ExecutionStatus } from './observability-types';

/**
 * Service Wrapper de Observabilidade.
 * Atua como condutor único do Motor Consolidado. Ele não mexe nos cálculos, apenas observa
 * os Inputs e Outputs dos Orquestradores Puros e grava telemetria longitudinal.
 */
export class ObservedConsolidatedRuntimeService {
  
  static async run(rawInput: ConsolidatedGroupInput): Promise<ConsolidatedExecutiveAdvisoryReport> {
    const executionId = crypto.randomUUID();
    const trace = new ExecutionTraceBuilder(executionId);
    
    await RuntimeExecutionLogger.logEvent(executionId, 'RUNTIME_STARTED');
    trace.startStage('DATA_VALIDATION');

    try {
      // 1. Pre-Flight Check (Validator estrutural)
      const modelValidation = ConsolidatedDataModelValidator.validate(rawInput as unknown as EconomicGroupModel, [], (rawInput as unknown as { intercompanyRelations?: IntercompanyRelationModel[] }).intercompanyRelations || []);
      if (!modelValidation.isValid) {
        await RuntimeExecutionLogger.logEvent(executionId, 'DATA_VALIDATION_FAILED', { errors: modelValidation.errors });
        throw new Error('Data Model estruturalmente inválido. Execução abortada.');
      }

      // 2. Transforma Input
      const consolidatedInput: ConsolidatedFinancialInput = ConsolidatedDataValidationGateway.transform(rawInput);
      trace.endStage('SUCCESS');

      // 3. Financial Runtime
      await RuntimeExecutionLogger.logEvent(executionId, 'CONSOLIDATION_STARTED');
      trace.startStage('FINANCIAL_ORCHESTRATOR');
      
      const financialOutput = ConsolidatedFinancialOrchestrator.run(consolidatedInput);
      
      trace.endStage('SUCCESS');
      await RuntimeExecutionLogger.logEvent(executionId, 'CONSOLIDATION_COMPLETED');

      // 4. Advisory Runtime
      await RuntimeExecutionLogger.logEvent(executionId, 'ADVISORY_STARTED');
      trace.startStage('ADVISORY_ORCHESTRATOR');
      
      const advisoryReport = ConsolidatedAdvisoryOrchestrator.run(financialOutput, consolidatedInput.entities);
      
      trace.endStage('SUCCESS');
      await RuntimeExecutionLogger.logEvent(executionId, 'ADVISORY_COMPLETED');

      // 5. Calcula as degradações para gerar logs granulares
      const confidenceInitial = 'HIGH'; // Em tese a inicial vem do input
      const confidenceFinal = advisoryReport.finalConfidence;
      
      if (confidenceFinal !== confidenceInitial) {
        await RuntimeExecutionLogger.logEvent(executionId, 'CONFIDENCE_DEGRADED', { from: confidenceInitial, to: confidenceFinal });
      }

      let status: ExecutionStatus = 'COMPLETED';
      if (advisoryReport.violations.some(v => v.severity === 'CRITICAL')) {
        status = 'BLOCKED';
        await RuntimeExecutionLogger.logEvent(executionId, 'GOVERNANCE_BLOCK_TRIGGERED');
      }

      // 6. Prepara Gravação Assíncrona do Record Mestre
      const finishedTrace = await trace.flushAndSave();

      // Mapeia violations para o modelo persistente
      const mappedViolations: GovernanceViolationRecord[] = advisoryReport.violations.map(v => ({
        violationId: crypto.randomUUID(),
        executionId,
        groupId: rawInput.groupId,
        severity: v.severity === 'HIGH' ? 'CRITICAL' : v.severity === 'MEDIUM' ? 'WARNING' : 'INFO',
        source: v.sourceEngine || 'UNKNOWN',
        timestamp: new Date().toISOString(),
        message: v.message,
        affectedEntities: ('affectedEntities' in v) ? (v as unknown as { affectedEntities: string[] }).affectedEntities : [],
        runtimeStage: 'UNKNOWN',
        resolved: false
      }));

      const record: RuntimeExecutionRecord = {
        executionId,
        runtimeType: 'CONSOLIDATED_ADVISORY',
        timestamp: new Date().toISOString(),
        groupId: rawInput.groupId,
        entityIds: rawInput.entities.map(e => e.id),
        runtimeVersion: '1.0.0',
        confidenceInitial,
        confidenceFinal,
        violations: mappedViolations,
        warnings: advisoryReport.strategicAlerts,
        systemicRisks: advisoryReport.systemicRisks,
        runtimeDurationMs: finishedTrace.totalDurationMs,
        executionStatus: status,
        advisoryHash: crypto.randomUUID(), // Hash de integridade simulado
        lineageSnapshot: {
           inputHash: '...',
           advisoryReport: advisoryReport as unknown // O Snapshot integral do report gerado
        }
      };

      // 7. Persiste os registros finais em background (não precisa dar await absoluto para travar a tela)
      Promise.all([
        RuntimeExecutionRegistry.registerExecution(record),
        GovernanceViolationHistory.recordViolations(mappedViolations),
        ConfidenceTimelineEngine.recordConfidence({
          executionId,
          groupId: rawInput.groupId,
          timestamp: new Date().toISOString(),
          confidence: confidenceFinal,
          reason: 'Consolidated Runtime Execution',
          fiscalYear: rawInput.fiscalYear
        })
      ]).catch(err => console.error('[ObservedConsolidatedRuntimeService] Background observability error:', err));
      
      await RuntimeExecutionLogger.logEvent(executionId, 'EXECUTION_COMPLETED');

      // 8. Retorna o output exato e imutável para a View Layer do Context
      return advisoryReport;

    } catch (err: any) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      trace.endStage('FAILED', { error: errorMsg });
      await trace.flushAndSave();
      await RuntimeExecutionLogger.logEvent(executionId, 'EXECUTION_FAILED', { error: errorMsg });
      throw err;
    }
  }
}
