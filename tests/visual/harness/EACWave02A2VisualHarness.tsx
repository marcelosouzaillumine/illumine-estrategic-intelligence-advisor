import React from 'react';
import { ExecutiveDecisionTraceSection } from '../../../src/components/executive-architecture';
import { WorkflowAuditFeed } from '../../../src/components/workflow-governance/WorkflowAuditFeed';
import { ExportHistoryPanel } from '../../../src/components/executive-delivery/ExportHistoryPanel';
import { ClientAccessLogs } from '../../../src/components/ClientAccessLogs';

/**
 * ClientImportHistory depends on xlsx/pdfjs-dist which fail in the test harness build.
 * This inline mock reproduces the exact DOM structure of the migrated component:
 * - Root: grid with 2 columns
 * - Left column: upload form (OUTSIDE trace boundary)
 * - Right column: history feed INSIDE ExecutiveDecisionTraceSection
 */
function ClientImportHistoryMock() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-50 p-6 rounded-2xl border border-border">
          <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4">
            Nova Importação de Dados
          </h4>
          <input type="file" accept=".csv,.xlsx,.xls,.pdf" className="opacity-50" />
        </div>
      </div>

      <ExecutiveDecisionTraceSection aria-label="Histórico de importações do cliente" className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm min-h-[300px]">
          <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">
            Últimas Importações
          </h3>
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-border">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[8px] font-black uppercase text-secondary tracking-widest">DRE</span>
                <span className="text-[8px] font-bold text-muted-foreground">Jun/2026</span>
              </div>
              <p className="text-[11px] font-bold text-primary mb-1">relatorio_dre_jun2026.xlsx</p>
              <p className="text-[9px] text-muted-foreground">Em: 08/07/2026</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-border">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[8px] font-black uppercase text-secondary tracking-widest">BALANÇO</span>
                <span className="text-[8px] font-bold text-muted-foreground">Mai/2026</span>
              </div>
              <p className="text-[11px] font-bold text-primary mb-1">balanco_mai2026.pdf</p>
              <p className="text-[9px] text-muted-foreground">Em: 05/06/2026</p>
            </div>
          </div>
        </div>
      </ExecutiveDecisionTraceSection>
    </div>
  );
}

export default function EACWave02A2VisualHarness() {
  let target = '';
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    target = params.get('target') || '';
  }

  const renderTarget = () => {
    switch (target) {
      case 'workflow-audit':
        return <WorkflowAuditFeed logs={[
          { auditId: 'aud-001', workflowId: 'wf-001', tenantId: 'test-tenant', event: 'STEP_APPROVED', timestamp: '2026-07-10T10:30:00Z', actor: { userId: 'usr-001', name: 'João Silva', role: 'CFO' }, details: 'Aprovação do workflow de DRE Q2' },
          { auditId: 'aud-002', workflowId: 'wf-001', tenantId: 'test-tenant', event: 'WORKFLOW_CREATED', timestamp: '2026-07-10T09:15:00Z', actor: { userId: 'usr-002', name: 'Maria Souza', role: 'Controller' }, details: 'Submissão para aprovação' },
          { auditId: 'aud-003', workflowId: 'wf-001', tenantId: 'test-tenant', event: 'WORKFLOW_CREATED', timestamp: '2026-07-10T08:00:00Z', actor: { userId: 'usr-003', name: 'Carlos Oliveira', role: 'Analyst' } }
        ]} />;
      case 'workflow-audit-empty':
        return <WorkflowAuditFeed logs={[]} />;
      case 'export-history':
        return <ExportHistoryPanel exports={[
          { exportId: 'EXP-2026-001', timestamp: '2026-07-10T12:00:00Z', tenantId: 'test-tenant', runtimeExecutionId: 'exec-001', lineageHash: 'sha256:abcdef0123456789', calibrationProfile: 'balanced', confidenceSnapshot: 'HIGH_CONFIDENCE', reportVersion: '2.1.0', generatedBy: 'system' },
          { exportId: 'EXP-2026-002', timestamp: '2026-07-09T16:30:00Z', tenantId: 'test-tenant', runtimeExecutionId: 'exec-002', lineageHash: 'sha256:9876543210fedcba', calibrationProfile: 'conservative', confidenceSnapshot: 'MEDIUM_CONFIDENCE', reportVersion: '2.1.0', generatedBy: 'system' }
        ]} />;
      case 'export-history-empty':
        return <ExportHistoryPanel exports={[]} />;
      case 'import-history':
        return <ClientImportHistoryMock />;
      case 'access-logs':
        return <ClientAccessLogs clientId="test-client" />;
      default:
        return <div data-testid="harness-error">Target not found: {target}</div>;
    }
  };

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-[1600px] mx-auto w-full">
        {renderTarget()}
      </div>
    </div>
  );
}
