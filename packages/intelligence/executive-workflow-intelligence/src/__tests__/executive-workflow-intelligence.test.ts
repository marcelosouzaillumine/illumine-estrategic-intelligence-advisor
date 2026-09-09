/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import {
  DecisionCommandEnvelopeResolver,
  ApprovalFlowEngine,
  ActionRegistryEngine,
  ExecutiveWorkflowOrchestrator,
  ExecutiveTrustLedgerEngine,
  ExecutionEngine,
  WorkflowOutcomeEngine
} from '../index';

describe('Wave 19.4 — Executive Workflow Governance (EWI v1.0)', () => {
  it('should create DecisionCommandEnvelope and evaluate approval matrix', () => {
    const envelope = DecisionCommandEnvelopeResolver.createEnvelope('dec-01', 'FinancialAgent', 'HIGH', 'Otimização de EBITDA');
    expect(envelope.riskLevel).toBe('HIGH');
    expect(envelope.requiredApproval).toBe('EXECUTIVE');

    const req = ApprovalFlowEngine.evaluateApprovalRequirement(envelope);
    expect(req.requiresHumanApproval).toBe(true);
    expect(req.requiredRole).toBe('EXECUTIVE');
  });

  it('should orchestrate workflow and record entry in ExecutiveTrustLedger', () => {
    const envelope = DecisionCommandEnvelopeResolver.createEnvelope('dec-02', 'FinancialAgent', 'MEDIUM', 'Otimização de Margem');
    const wf = ExecutiveWorkflowOrchestrator.orchestrateWorkflow('empresa-01', envelope);

    expect(wf.workflowId).toBe('wf-empresa-01-dec-02');
    expect(wf.currentStage).toBe('HUMAN_APPROVAL');
    expect(wf.trustLedger.approvalStatus).toBe('PENDING');
  });

  it('should execute approved action and measure outcome feedback', () => {
    const envelope = DecisionCommandEnvelopeResolver.createEnvelope('dec-03', 'FinancialAgent', 'LOW', 'Ajuste Orçamentário Menor');
    const ledgerEntry = ExecutiveTrustLedgerEngine.recordEntry(envelope, 'APPROVED', 'user-exec-01');

    const result = ExecutionEngine.executeAction(ledgerEntry);
    expect(result.isSuccess).toBe(true);
    expect(result.executionAdapterUsed).toBe('GovernedExecutionAdapter');

    const outcome = WorkflowOutcomeEngine.measureOutcome('wf-03', 2.5);
    expect(outcome.isTargetAchieved).toBe(true);
    expect(outcome.learningFeedbackSignal).toBe('REINFORCE');
  });
});
