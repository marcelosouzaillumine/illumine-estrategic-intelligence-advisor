import React, { useState, useEffect } from 'react';
import { Activity, ArrowLeftRight, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw, User, FileText, Database, History, HelpCircle, Clock, Ban, Archive, ChevronRight } from 'lucide-react';
import { PageHeader, StatusBadge } from '../Common';
import { PilotRollbackProtocol } from '../../services/FiduciaryRuntimeAdapter';
import { ImportReviewQueue } from '../../services/FiduciaryRuntimeAdapter';
import { ConnectorAuditLogger } from '../../services/FiduciaryRuntimeAdapter';
import { auth } from '../../lib/firebase';
import { ImportedDataset, RollbackAuditEntry } from '../../services/FiduciaryRuntimeAdapter';
import { cn } from '../../lib/utils';

export function PilotMonitoringDashboard() {
  const [selectedTenant, setSelectedTenant] = useState<string>('TENANT-HQ');
  const [actorId, setActorId] = useState<string>('');
  const [justification, setJustification] = useState<string>('');
  const [rollbackScope, setRollbackScope] = useState<'DATASET' | 'PROMOTION' | 'SNAPSHOT'>('DATASET');
  const [targetImportId, setTargetImportId] = useState<string>('');
  
  // UI feedback states
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Sync logged in user actorId
  useEffect(() => {
    if (auth.currentUser) {
      setActorId(auth.currentUser.email || auth.currentUser.uid);
    } else {
      setActorId('OPERATOR-SYS');
    }
  }, [refreshTrigger]);

  // Read data fiduciarily from Core Runtime / Governance Layers (no local logic)
  const metrics = PilotRollbackProtocol.calculateMetrics(selectedTenant);
  const allQueue = ImportReviewQueue.getAll();
  const tenantQueue = ImportReviewQueue.getQueueForTenant(selectedTenant, 'WS-1');
  const auditLogs = ConnectorAuditLogger.getLogsForTenant(selectedTenant);
  const rollbackLogs = PilotRollbackProtocol.getRollbackAuditTrail().filter(r => r.tenantId === selectedTenant);

  // Extract unique tenantIds from queue to populate tenant selector
  const availableTenants = Array.from(new Set([
    'TENANT-HQ', 
    'PILOT-TENANT-HQ',
    ...allQueue.map(d => d.tenantId)
  ])).filter(Boolean);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleExecuteRollback = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      let result: RollbackAuditEntry;
      
      if (rollbackScope === 'DATASET') {
        if (!targetImportId) {
          throw new Error('Por favor, selecione um Dataset (Import ID) para reverter.');
        }
        result = await PilotRollbackProtocol.rollbackDataset(
          targetImportId,
          selectedTenant,
          actorId,
          justification
        );
      } else if (rollbackScope === 'PROMOTION') {
        if (!targetImportId) {
          throw new Error('Por favor, selecione um Dataset (Import ID) para despromover.');
        }
        result = await PilotRollbackProtocol.rollbackPromotion(
          targetImportId,
          selectedTenant,
          actorId,
          justification
        );
      } else {
        result = await PilotRollbackProtocol.rollbackTenantSnapshot(
          selectedTenant,
          actorId,
          justification
        );
      }

      setSuccessMessage(`Reversão Governada registrada com sucesso! ID de Auditoria: ${result.rollbackId}`);
      setJustification('');
      setTargetImportId('');
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro inesperado ao processar o rollback fiduciário.');
    }
  };

  // Determine eligible importIds for target dropdown based on scope selection
  const eligibleDatasets = tenantQueue.filter(d => {
    if (rollbackScope === 'DATASET') {
      return d.status !== 'REVERTED';
    }
    if (rollbackScope === 'PROMOTION') {
      return d.status === 'APPROVED' || d.status === 'PUBLISHED' || d.promotedToRuntime;
    }
    return false;
  });

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12 pb-32 animate-executive-fade text-foreground">
      {/* Page Header */}
      <PageHeader
        title="Painel Operacional Piloto"
        subtitle="Observabilidade de Ingestão Fiduciária, Histórico de Validação de Staging e Console de Rollback Governado."
        icon={Activity}
        transparent
        actions={
          <div className="flex items-center gap-4 bg-surface-container/60 p-2 rounded-button border border-border shadow-xs">
            <span className="text-body-sm font-semibold uppercase tracking-wider text-muted-foreground pl-2">Tenant Piloto:</span>
            <select
              value={selectedTenant}
              onChange={(e) => setSelectedTenant(e.target.value)}
              className="text-body-sm font-bold uppercase tracking-widest bg-transparent cursor-pointer border-none outline-none focus:ring-0 text-secondary"
            >
              {availableTenants.map(t => (
                <option key={t} value={t} className="bg-card text-foreground">{t}</option>
              ))}
            </select>
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-muted-foreground hover:text-secondary"
              title="Recarregar Dados"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        }
      />

      {/* Operational Metrics Cards (Loaded from PilotRollbackProtocol.calculateMetrics, strictly passive) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="card-premium p-6 flex flex-col justify-between hover:border-secondary/30 transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Total Ingerido</span>
            <div className="p-2 bg-secondary/10 text-secondary rounded-lg"><Database size={16} /></div>
          </div>
          <div>
            <h4 className="text-h3 font-display font-medium tracking-tight">{metrics.totalUploads}</h4>
            <p className="text-[9px] text-muted-foreground font-semibold mt-1">DATASETS EM STAGING</p>
          </div>
        </div>

        <div className="card-premium p-6 flex flex-col justify-between hover:border-success/30 transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Taxa de Aprovação</span>
            <div className="p-2 bg-success-soft text-success rounded-lg"><CheckCircle2 size={16} /></div>
          </div>
          <div>
            <h4 className="text-h3 font-display font-medium tracking-tight text-success">{metrics.approvalRate}%</h4>
            <p className="text-[9px] text-muted-foreground font-semibold mt-1">APROVADO & PROMOVIDO</p>
          </div>
        </div>

        <div className="card-premium p-6 flex flex-col justify-between hover:border-destructive/30 transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Rejeição & Reversão</span>
            <div className="p-2 bg-critical-soft text-destructive rounded-lg"><Ban size={16} /></div>
          </div>
          <div>
            <h4 className="text-h3 font-display font-medium tracking-tight text-destructive">{metrics.rejectionRate}%</h4>
            <p className="text-[9px] text-muted-foreground font-semibold mt-1">REVERTIDO OU REJEITADO</p>
          </div>
        </div>

        <div className="card-premium p-6 flex flex-col justify-between hover:border-secondary/30 transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Trust Level Médio</span>
            <div className="p-2 bg-secondary/10 text-secondary rounded-lg"><ShieldCheck size={16} /></div>
          </div>
          <div>
            <h4 className="text-h3 font-display font-medium tracking-tight">{metrics.averageConfidenceScore}%</h4>
            <p className="text-[9px] text-muted-foreground font-semibold mt-1">CONFIDENCE INDEX</p>
          </div>
        </div>

        <div className="card-premium p-6 flex flex-col justify-between hover:border-secondary/30 transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Tempo Onboarding</span>
            <div className="p-2 bg-secondary/10 text-secondary rounded-lg"><Clock size={16} /></div>
          </div>
          <div>
            <h4 className="text-h3 font-display font-medium tracking-tight">{metrics.averageOnboardingTimeSeconds}s</h4>
            <p className="text-[9px] text-muted-foreground font-semibold mt-1">MÉDIA DE SUBMISSÃO</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Staging Queue & Rollback Console */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Staging Queue Datasets & Failed Ingestions Logs (2 cols span) */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Active Staging Datasets */}
          <div className="card-premium p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-secondary/10 flex items-center justify-center text-secondary">
                <Database size={16} />
              </div>
              <div>
                <h3 className="text-h3 font-medium tracking-tight">Alfândega de Staging</h3>
                <p className="text-body-sm text-muted-foreground mt-0.5">Fila de datasets ingeridos para {selectedTenant} aguardando governança fiduciária.</p>
              </div>
            </div>

            {tenantQueue.length === 0 ? (
              <div className="py-12 text-center bg-surface-container/50 border border-dashed border-border rounded-2xl flex flex-col items-center">
                <FileText size={40} className="text-muted-foreground/40 mb-3" />
                <p className="text-body-sm font-bold text-muted-foreground">Nenhum dataset registrado em Staging para este tenant.</p>
                <p className="text-[11px] text-muted-foreground/60 mt-1">Carregue dados usando os modais de importação.</p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-border rounded-xl">
                <table className="w-full text-left text-body-sm">
                  <thead className="bg-surface-container border-b border-border">
                    <tr>
                      <th className="px-4 py-3 font-bold text-muted-foreground uppercase tracking-widest text-[9px]">Import ID</th>
                      <th className="px-4 py-3 font-bold text-muted-foreground uppercase tracking-widest text-[9px]">Tipo</th>
                      <th className="px-4 py-3 font-bold text-muted-foreground uppercase tracking-widest text-[9px]">Connector</th>
                      <th className="px-4 py-3 font-bold text-muted-foreground uppercase tracking-widest text-[9px]">Status</th>
                      <th className="px-4 py-3 font-bold text-muted-foreground uppercase tracking-widest text-[9px]">Confiança</th>
                      <th className="px-4 py-3 font-bold text-muted-foreground uppercase tracking-widest text-[9px]">Alertas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card">
                    {tenantQueue.map((dataset) => (
                      <tr key={dataset.importId} className="hover:bg-surface-container/20 group">
                        <td className="px-4 py-3 font-mono font-bold text-foreground text-xs">{dataset.importId.substring(0, 14)}...</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs font-semibold">{dataset.datasetType || 'FINANCIAL'}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{dataset.connectorId}</td>
                        <td className="px-4 py-3">
                          <StatusBadge 
                            status={
                              dataset.status === 'PUBLISHED' ? 'Ativo' :
                              dataset.status === 'APPROVED' ? 'Ativo' :
                              dataset.status === 'REJECTED' ? 'Inativo' :
                              dataset.status === 'REVERTED' ? 'Inativo' : 'Pendente'
                            } 
                            label={dataset.status} 
                          />
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider",
                            dataset.trustLevel === 'HIGH' || dataset.trustLevel === 'INSTITUTIONAL' ? "bg-emerald-100/50 text-emerald-800" :
                            dataset.trustLevel === 'MEDIUM' ? "bg-amber-100/50 text-amber-800" : "bg-rose-100/50 text-rose-800"
                          )}>
                            {dataset.trustLevel}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {dataset.blockingWarnings && dataset.blockingWarnings.length > 0 ? (
                            <span className="text-destructive font-bold text-[10px] flex items-center gap-1">
                              <AlertTriangle size={11} className="shrink-0" />
                              {dataset.blockingWarnings.length} warnings
                            </span>
                          ) : (
                            <span className="text-success font-bold text-[10px] flex items-center gap-1">
                              <ShieldCheck size={11} className="shrink-0" />
                              Nenhum
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Failed Ingestion / Audit Logs */}
          <div className="card-premium p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-critical-soft flex items-center justify-center text-destructive">
                <AlertTriangle size={16} />
              </div>
              <div>
                <h3 className="text-h3 font-medium tracking-tight">Falhas de Ingestão & Bloqueios</h3>
                <p className="text-body-sm text-muted-foreground mt-0.5">Logs de tentativas bloqueadas pelas regras rígidas da governança fiduciária.</p>
              </div>
            </div>

            {auditLogs.filter(l => l.event === 'IMPORT_FAILED').length === 0 ? (
              <p className="text-body-sm text-muted-foreground font-medium italic py-2">
                Nenhuma falha de ingestão auditada para este tenant.
              </p>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {auditLogs.filter(l => l.event === 'IMPORT_FAILED').map((log) => (
                  <div key={log.auditId} className="p-4 bg-destructive/5 border border-destructive/10 rounded-xl flex gap-3">
                    <Ban size={16} className="text-destructive shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-body-sm font-bold text-destructive">{log.details || 'Falha de Validação'}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">
                        Import ID: {log.importId || 'N/A'} · Operador: {log.actorId} · {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Fiduciary Rollback Console (Governance Gate Form) */}
        <div className="xl:col-span-1 space-y-8">
          
          <div className="card-premium p-8 bg-card/60 backdrop-blur-md border border-border/80 shadow-md space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-secondary/10 flex items-center justify-center text-secondary">
                <History size={16} />
              </div>
              <div>
                <h3 className="text-h3 font-medium tracking-tight">Rollback Console</h3>
                <p className="text-body-sm text-muted-foreground mt-0.5">Reversão de transações e estado do runtime.</p>
              </div>
            </div>

            {/* Warning Alert about Soft Rollback */}
            <div className="p-4 bg-warning-soft border border-warning/20 rounded-xl text-warning flex items-start gap-2.5">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <div className="text-[10px] leading-relaxed">
                <p className="font-bold uppercase tracking-wider mb-0.5">Soft Rollback Fiduciário</p>
                <p className="text-warning/80">Esta operação reverte estados de staging e despromove publicações de runtime sem apagar a linhagem fiduciária e logs de auditoria.</p>
              </div>
            </div>

            {/* Feedback Alerts */}
            {successMessage && (
              <div className="p-4 bg-success-soft border border-success/20 rounded-xl text-success flex items-start gap-2.5">
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                <p className="text-xs font-semibold leading-normal">{successMessage}</p>
              </div>
            )}

            {errorMessage && (
              <div className="p-4 bg-critical-soft border border-destructive/20 rounded-xl text-destructive flex items-start gap-2.5">
                <Ban size={16} className="shrink-0 mt-0.5" />
                <p className="text-xs font-semibold leading-normal">{errorMessage}</p>
              </div>
            )}

            {/* Governance Form */}
            <form onSubmit={handleExecuteRollback} className="space-y-4 text-xs font-medium text-muted-foreground">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Escopo de Reversão</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['DATASET', 'PROMOTION', 'SNAPSHOT'] as const).map(scope => (
                    <button
                      key={scope}
                      type="button"
                      onClick={() => {
                        setRollbackScope(scope);
                        setTargetImportId('');
                      }}
                      className={cn(
                        "py-2 rounded-lg border text-center transition-all font-bold tracking-wider uppercase text-[9px]",
                        rollbackScope === scope 
                          ? "border-secondary bg-secondary/5 text-secondary" 
                          : "border-border bg-background hover:bg-surface-container"
                      )}
                    >
                      {scope === 'SNAPSHOT' ? 'Snapshot' : scope === 'PROMOTION' ? 'Promoção' : 'Dataset'}
                    </button>
                  ))}
                </div>
              </div>

              {rollbackScope !== 'SNAPSHOT' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Selecionar Target (Import ID)</label>
                  {eligibleDatasets.length === 0 ? (
                    <div className="p-3 bg-surface-container border border-border rounded-lg text-center text-muted-foreground italic">
                      Nenhum dataset elegível para este escopo
                    </div>
                  ) : (
                    <select
                      value={targetImportId}
                      onChange={(e) => setTargetImportId(e.target.value)}
                      required
                      className="w-full bg-background border border-border text-foreground font-mono rounded-lg px-3 py-2 text-xs outline-none"
                    >
                      <option value="">Selecione o Dataset ID...</option>
                      {eligibleDatasets.map(d => (
                        <option key={d.importId} value={d.importId}>
                          {d.importId.substring(0, 12)}... ({d.status})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {rollbackScope === 'SNAPSHOT' && (
                <div className="p-3 bg-surface-container/60 border border-border rounded-lg space-y-1">
                  <p className="text-[10px] font-bold text-foreground uppercase tracking-wider">Tenant Alvo</p>
                  <p className="text-xs font-bold text-secondary font-mono">{selectedTenant}</p>
                  <p className="text-[9.5px] text-muted-foreground leading-relaxed mt-1">Todos os datasets promovidos/publicados deste tenant serão retornados para o estado Staging PENDING_REVIEW.</p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Operador Autorizado (actorId)</label>
                <div className="flex items-center bg-surface-container border border-border rounded-lg px-3 py-2">
                  <User size={14} className="text-muted-foreground/60 mr-2" />
                  <input
                    type="text"
                    value={actorId}
                    onChange={(e) => setActorId(e.target.value)}
                    required
                    placeholder="actorId do auditor fiduciário"
                    className="bg-transparent border-none p-0 outline-none text-foreground w-full focus:ring-0 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Justificativa Detalhada (Mín. 10 Chars)</label>
                <textarea
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  required
                  placeholder="Justificativa fiduciária para a auditoria de reversão contábil..."
                  rows={3}
                  className="w-full bg-background border border-border text-foreground rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-secondary/25"
                />
              </div>

              <button
                type="submit"
                disabled={justification.length < 10 || (rollbackScope !== 'SNAPSHOT' && !targetImportId)}
                className="w-full py-3 bg-secondary hover:bg-secondary/90 disabled:opacity-55 disabled:cursor-not-allowed text-secondary-foreground text-xs font-black uppercase tracking-widest rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck size={14} />
                Executar Reversão Governada
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* Reversion History Audit Log (Audit Trail) */}
      <div className="card-premium p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-secondary/10 flex items-center justify-center text-secondary">
            <History size={16} />
          </div>
          <div>
            <h3 className="text-h3 font-medium tracking-tight">Histórico de Reversões (Rollback History)</h3>
            <p className="text-body-sm text-muted-foreground mt-0.5">Logs auditáveis e permanentes de todas as intervenções de governança fiduciária executadas.</p>
          </div>
        </div>

        {rollbackLogs.length === 0 ? (
          <div className="py-8 text-center bg-surface-container/30 border border-dashed border-border rounded-xl">
            <p className="text-body-sm font-bold text-muted-foreground italic">Nenhum evento de rollback registrado para este tenant.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-body-sm">
              <thead className="bg-surface-container border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-bold text-muted-foreground uppercase tracking-widest text-[9px]">Audit ID</th>
                  <th className="px-4 py-3 font-bold text-muted-foreground uppercase tracking-widest text-[9px]">Escopo</th>
                  <th className="px-4 py-3 font-bold text-muted-foreground uppercase tracking-widest text-[9px]">Dataset Alvo</th>
                  <th className="px-4 py-3 font-bold text-muted-foreground uppercase tracking-widest text-[9px]">Auditado por</th>
                  <th className="px-4 py-3 font-bold text-muted-foreground uppercase tracking-widest text-[9px]">Justificativa</th>
                  <th className="px-4 py-3 font-bold text-muted-foreground uppercase tracking-widest text-[9px]">Status Anterior</th>
                  <th className="px-4 py-3 font-bold text-muted-foreground uppercase tracking-widest text-[9px]">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {rollbackLogs.map((log) => (
                  <tr key={log.rollbackId} className="hover:bg-surface-container/20">
                    <td className="px-4 py-3 font-mono font-bold text-foreground text-xs">{log.rollbackId}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-secondary/10 text-secondary border border-secondary/20 rounded text-[9px] font-black uppercase tracking-wider">
                        {log.scope}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-muted-foreground text-xs">{log.importId ? log.importId.substring(0, 12) + '...' : 'N/A (Tenant)'}</td>
                    <td className="px-4 py-3 text-foreground text-xs font-semibold">{log.actorId}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs max-w-xs truncate" title={log.justification}>{log.justification}</td>
                    <td className="px-4 py-3">
                      <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">{log.previousStatus}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(log.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
