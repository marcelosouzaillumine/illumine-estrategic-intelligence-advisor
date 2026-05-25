import { EarlyWarningSignal, WarningSeverity, PredictiveRiskEvent, DeteriorationCategory } from './EarlyWarningTypes';
import { RiskSignalAggregator } from './RiskSignalAggregator';
import { PredictiveGovernanceDetector } from './PredictiveGovernanceDetector';
import { GraphPatternWarningEngine } from './GraphPatternWarningEngine';
import { BenchmarkDeviationDetector } from './BenchmarkDeviationDetector';
import { ScenarioDeteriorationWatcher } from './ScenarioDeteriorationWatcher';
import { EarlyWarningGovernanceEngine } from './EarlyWarningGovernanceEngine';
import { WarningEvidenceBinder } from './WarningEvidenceBinder';
import { EarlyWarningAuditLogger } from './EarlyWarningAuditLogger';
import { GovernanceDeteriorationIndex } from './GovernanceDeteriorationIndex';

export class EarlyWarningSignalEngine {
  // Mock persistency
  private static signals: EarlyWarningSignal[] = [];

  static executeDetection(tenantId: string): PredictiveRiskEvent | null {
    if (!tenantId) return null;

    const executionId = `EXEC-EW-${Date.now()}`;

    const workflowSignals = PredictiveGovernanceDetector.detectGovernanceDeterioration(tenantId);
    const graphSignals = GraphPatternWarningEngine.detectGraphAnomalies(tenantId);
    const benchmarkSignals = BenchmarkDeviationDetector.detectDeviations(tenantId);
    const scenarioSignals = ScenarioDeteriorationWatcher.watchScenarios(tenantId);

    const allSignals = [...workflowSignals, ...graphSignals, ...benchmarkSignals, ...scenarioSignals];
    const riskScore = RiskSignalAggregator.aggregateSignals(allSignals);

    GovernanceDeteriorationIndex.calculateIndex(tenantId, riskScore);

    const thresholds = EarlyWarningGovernanceEngine.getSeverityThresholds();

    const generatedSignals: EarlyWarningSignal[] = [];

    if (riskScore >= thresholds.HIGH) {
      const evidence = WarningEvidenceBinder.bindEvidence(
        tenantId,
        'Múltiplas anomalias institucionais convergindo para asfixia de liquidez e falha em aprovações.',
        executionId,
        ['ALERT-LIQ-01'], // mocks
        ['WF-CAP-001', 'WF-CAP-002'],
        ['SCN-STR-01'],
        ['PATT-KG-09']
      );

      if (EarlyWarningGovernanceEngine.validateSignalCreation(tenantId, evidence.evidenceId)) {
        const signal: EarlyWarningSignal = {
          signalId: `SIG-EW-${Date.now()}`,
          tenantId,
          category: 'LIQUIDITY_SUFFOCATION',
          severity: 'CRITICAL',
          predictiveConfidence: EarlyWarningGovernanceEngine.determinePredictiveConfidence(allSignals.length),
          title: 'Asfixia de Liquidez Progressiva',
          description: 'A rede fiduciária aponta para falência de liquidez nos próximos 6 meses baseada em paralisia de decisões e deterioração sistêmica.',
          evidence,
          createdAt: new Date().toISOString()
        };
        
        this.signals.push(signal);
        generatedSignals.push(signal);
        EarlyWarningAuditLogger.logEvent(tenantId, 'EARLY_WARNING_CREATED', `Sinal Crítico Emitido: ${signal.title}`);
      }
    }

    EarlyWarningAuditLogger.logEvent(tenantId, 'PREDICTIVE_EXECUTION_COMPLETED', `Execução ${executionId} gerou ${generatedSignals.length} sinais.`);

    if (generatedSignals.length === 0) return null;

    return {
      eventId: `PRED-EVT-${Date.now()}`,
      tenantId,
      trend: 'WORSENING',
      relatedSignals: generatedSignals,
      timestamp: new Date().toISOString()
    };
  }

  static getSignals(tenantId: string): EarlyWarningSignal[] {
    return this.signals.filter(s => s.tenantId === tenantId);
  }

  static clearSignals(tenantId: string): void {
    this.signals = this.signals.filter(s => s.tenantId !== tenantId);
  }
}
