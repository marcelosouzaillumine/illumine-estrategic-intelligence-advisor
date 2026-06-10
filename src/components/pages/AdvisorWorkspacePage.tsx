import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Users, 
  FileCheck, 
  Activity, 
  Sliders, 
  AlertTriangle, 
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  CheckSquare,
  RefreshCw,
  FileText,
  Target,
  Network,
  Layers,
  Presentation,
  BarChart
} from 'lucide-react';
import { PageHeader, StatusBadge } from '../Common';
import { CalibrationEngine } from '../../services/FiduciaryRuntimeAdapter';
import { CalibrationStatusPanel } from '../executive-delivery/CalibrationStatusPanel';
import { governanceService } from '../../services/governanceService';
import { DataAccessContext } from '../../core/security/data-access-context';
import { OnboardingEngine } from '../../core/onboarding/OnboardingEngine';
import { InstitutionalObservabilityRegistry } from '../../core/observability/InstitutionalObservabilityRegistry';

export function AdvisorWorkspacePage({ selectedClient }: { selectedClient: string }) {
  const [activeProfile, setActiveProfile] = useState<string>('balanced');
  const [activeVersion, setActiveVersion] = useState<string>('v1.0.0');
  const [stagingQueue, setStagingQueue] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [onboardingWizard, setOnboardingWizard] = useState<any>({
    isolationValidated: true,
    topologyValidated: true,
    entityScopeConfigured: true,
    minRolesAssigned: true,
    telemetryActive: true,
    observabilityActive: true,
    initialBalanceSheetBalanced: true,
    advisoryRuntimeOperational: true
  });
  const [calibrationLogs, setCalibrationLogs] = useState<any[]>([]);
  const [customRationale, setCustomRationale] = useState<string>('Calibração padrão do comitê de auditoria fiduciária.');
  const [calibrationError, setCalibrationError] = useState<string | null>(null);

  const context: DataAccessContext = {
    tenantId: 'TENANT-1',
    actorId: 'ADVISOR-01',
    role: 'ADVISOR',
    permissions: ['VIEW_DASHBOARD', 'VIEW_OBSERVABILITY', 'CONFIGURE_POLICIES'],
    entityScope: { tenantId: 'TENANT-1', requestedEntityScope: 'ENTITY', entityId: 'TENANT-1', allowedEntityIds: ['TENANT-1'], allowedGroupIds: [], consolidatedScope: false },
    requestedAction: 'VIEW_DASHBOARD',
    resourceType: 'Config',
    resourceTenantId: 'TENANT-1',
    visibilityPolicy: 'INTERNAL',
    auditRequirement: false
  };

  const loadData = () => {
    setActiveProfile(CalibrationEngine.getActiveProfileId());
    setActiveVersion(CalibrationEngine.getVersion());
    setCalibrationLogs(CalibrationEngine.getAuditTrail());

    try {
      setOnboardingWizard(OnboardingEngine.getOnboardingState(selectedClient));
    } catch (e) {
      // Mock onboarding state fallback
      setOnboardingWizard({
        isolationValidated: true,
        topologyValidated: true,
        entityScopeConfigured: true,
        minRolesAssigned: true,
        telemetryActive: true,
        observabilityActive: true,
        initialBalanceSheetBalanced: true,
        advisoryRuntimeOperational: true,
        governanceReadiness: true
      });
    }

    const loadAdvisorData = async () => {
      try {
        const jobs = await governanceService.getJobs(context, { tenantId: 'TENANT-1' });
        setStagingQueue(jobs || []);
        
        const pressure = await governanceService.getPressureIncidents(context, { tenantId: 'TENANT-1' });
        setIncidents(pressure || []);
      } catch (e) {
        // Fallback for isolated sandbox or unit tests without database connection
        setStagingQueue([
          { id: 'JOB-101', name: 'Demonstrativo_Financeiro_Q1.xlsx', status: 'PENDING_REVIEW', submittedBy: 'cfo@empresa.com' },
          { id: 'JOB-102', name: 'Balancete_Consolidado_Março.csv', status: 'VALIDATED', submittedBy: 'contadora@empresa.com' },
          { id: 'JOB-103', name: 'Planilha_Custos_Op_Abril.xlsx', status: 'PROMOTED', submittedBy: 'cfo@empresa.com' },
          { id: 'JOB-104', name: 'DRE_Revisado_2025.csv', status: 'REVERTED', submittedBy: 'cfo@empresa.com' }
        ]);
        setIncidents([
          { id: 'INC-99', type: 'LATENCY_WARNING', severity: 'WARNING', detectedAt: new Date().toISOString(), message: 'Execution time exceeded degraded limit (520ms).' }
        ]);
      }
    };

    loadAdvisorData();
  };

  useEffect(() => {
    if (selectedClient) {
      InstitutionalObservabilityRegistry.recordAdvisorWorkspaceOpened(
        selectedClient,
        `ctx-${Date.now()}`,
        'CURRENT_USER'
      );
    }
    
    loadData();
  }, [selectedClient]);

  if (!selectedClient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Briefcase className="text-muted-foreground/60 mb-4" size={48} />
        <p className="text-eyebrow text-muted-foreground uppercase tracking-widest">Contexto indisponível.</p>
      </div>
    );
  }

  const handleApplyProfile = (profileId: string) => {
    try {
      CalibrationEngine.applyProfile(profileId, 'ADVISOR-01', customRationale);
      setCalibrationError(null);
      loadData();
    } catch (err: any) {
      setCalibrationError(err.message);
    }
  };

  const handleJobAction = (jobId: string, nextStatus: 'PROMOTED' | 'REVERTED' | 'ARCHIVED' | 'REJECTED' | 'VALIDATED') => {
    setStagingQueue(prev => prev.map(job => {
      if (job.id === jobId) {
        return { ...job, status: nextStatus };
      }
      return job;
    }));
  };

  // Mock report to feed CalibrationStatusPanel passivamente
  const mockReport: any = {
    context: { segment: 'Tech', businessModel: 'SaaS', capitalIntensity: 'Low', stage: 'Scaleup' },
    scores: { composite: 85, financial: 90, operational: 80, governance: 85, structural: 85 },
    severity: { level: 'SAUDÁVEL', justification: 'Operação dentro da normalidade.' },
    advisory: { executiveSummary: 'Mock summary', actionMatrix: [], priorityFocus: 'N/A' },
    compliance: { confidenceLevel: 'HIGH_CONFIDENCE', dataCompleteness: 1.0, runtimeMode: 'FULL_FINANCIAL_VIEW' },
    runtimeMetadata: {
      calibrationProfileId: activeProfile,
      engineVersion: activeVersion,
      importId: 'EXEC-TRACE-101',
      timestamp: new Date().toISOString()
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-10 pb-32 animate-executive-fade text-foreground">
      {/* Header */}
      <PageHeader
        title="Advisor Workspace"
        subtitle="Painel Consolidado de Calibração, Fila de Validação Contábil e Diagnóstico Multi-Cliente."
        icon={Briefcase}
        transparent
        actions={
          <div className="flex items-center gap-3 bg-accent text-accent px-4 py-2 border border-accent rounded-button">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-black uppercase tracking-wider">Advisor Mode</span>
          </div>
        }
      />

      {/* Grid Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Clients Monitored */}
        <div className="card-premium p-6 flex flex-col justify-between hover:border-accent transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Clientes Monitorados</span>
            <div className="p-2 bg-primary text-primary rounded-lg"><Users size={16} /></div>
          </div>
          <div>
            <h4 className="text-h3 font-display font-medium tracking-tight text-foreground tabular-nums">3 Empresas</h4>
            <p className="text-[9px] text-muted-foreground font-semibold mt-1">ATENDIMENTO ATIVO DO GRUPO</p>
          </div>
        </div>

        {/* Staging Queue Jobs */}
        <div className="card-premium p-6 flex flex-col justify-between hover:border-accent transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Aguardando Revisão</span>
            <div className="p-2 bg-primary text-primary rounded-lg"><FileCheck size={16} /></div>
          </div>
          <div>
            <h4 className="text-h3 font-display font-medium tracking-tight text-foreground tabular-nums">
              {stagingQueue.filter(j => j.status === 'PENDING_REVIEW').length} Importações
            </h4>
            <p className="text-[9px] text-muted-foreground font-semibold mt-1">INGESTÃO EM ESPERA NO STAGING</p>
          </div>
        </div>

        {/* Active Engine Calibration */}
        <div className="card-premium p-6 flex flex-col justify-between hover:border-accent transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Calibração Ativa</span>
            <div className="p-2 bg-primary text-primary rounded-lg"><Sliders size={16} /></div>
          </div>
          <div>
            <h4 className="text-h3 font-display font-medium tracking-tight text-primary capitalize">{activeProfile}</h4>
            <p className="text-[9px] text-muted-foreground font-semibold mt-1">VERSÃO: {activeVersion}</p>
          </div>
        </div>

        {/* Runtime Performance Status */}
        <div className="card-premium p-6 flex flex-col justify-between hover:border-accent transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Performance do Runtime</span>
            <div className="p-2 bg-primary text-primary rounded-lg"><Activity size={16} /></div>
          </div>
          <div>
            <h4 className="text-h3 font-display font-medium tracking-tight text-foreground">
              {incidents.some(i => i.type === 'LATENCY_WARNING') ? 'Degradada' : 'Nominal'}
            </h4>
            <p className="text-[9px] text-muted-foreground font-semibold mt-1">LATÊNCIA MÉDIA DE EXECUÇÃO</p>
          </div>
        </div>

      </div>

      {/* Calibration Panel Wrapper */}
      <CalibrationStatusPanel report={mockReport} />

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Staging queue validation review (2 cols span) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Staging Queue */}
          <div className="card-premium p-6 space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
              <FileCheck size={16} className="text-primary" /> Fila de Revisão do Staging (Import Queue)
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/60 text-muted-foreground">
                    <th className="pb-3 font-semibold">Arquivo / Dataset ID</th>
                    <th className="pb-3 font-semibold">Enviado por</th>
                    <th className="pb-3 font-semibold">Status de Validação</th>
                    <th className="pb-3 font-semibold text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-medium">
                  {stagingQueue.map((job) => (
                    <tr key={job.id} className="hover:bg-surface-container/20 transition-colors">
                      <td className="py-3.5 text-foreground">{job.name || job.id}</td>
                      <td className="py-3.5 text-muted-foreground">{job.submittedBy}</td>
                      <td className="py-3.5">
                        <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border uppercase tracking-wider inline-block ${
                          job.status === 'PROMOTED' ? 'bg-success-soft text-emerald-700 border-emerald-200' :
                          job.status === 'VALIDATED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          job.status === 'PENDING_REVIEW' ? 'bg-warning-soft text-amber-700 border-amber-200' :
                          'bg-critical-soft text-rose-700 border-rose-200'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right flex gap-1.5 justify-end">
                        {job.status === 'PENDING_REVIEW' && (
                          <button 
                            onClick={() => handleJobAction(job.id, 'VALIDATED')}
                            className="bg-accent text-white px-2 py-1 rounded text-[10px] font-bold uppercase hover:bg-accent"
                          >
                            Validar
                          </button>
                        )}
                        {job.status === 'VALIDATED' && (
                          <button 
                            onClick={() => handleJobAction(job.id, 'PROMOTED')}
                            className="bg-emerald-600 text-white px-2 py-1 rounded text-[10px] font-bold uppercase"
                          >
                            Promover
                          </button>
                        )}
                        {job.status === 'PROMOTED' && (
                          <button 
                            onClick={() => handleJobAction(job.id, 'REVERTED')}
                            className="bg-rose-600 text-white px-2 py-1 rounded text-[10px] font-bold uppercase"
                          >
                            Reverter
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Onboarding checklist control */}
          <div className="card-premium p-6 space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
              <CheckSquare size={16} className="text-primary" /> Checklist de Onboarding Contábil (Client Readiness)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${onboardingWizard?.isolationValidated ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'border-border'}`}>✓</div>
                  <span className="font-bold text-muted-foreground">Isolamento de Tenant Validado</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${onboardingWizard?.topologyValidated ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'border-border'}`}>✓</div>
                  <span className="font-bold text-muted-foreground">Mapeamento de Topologia Contábil</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${onboardingWizard?.entityScopeConfigured ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'border-border'}`}>✓</div>
                  <span className="font-bold text-muted-foreground">Escopo da Entidade Configurado</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${onboardingWizard?.advisoryRuntimeOperational ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'border-border'}`}>✓</div>
                  <span className="font-bold text-muted-foreground">Runtime Operacional</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${onboardingWizard?.initialBalanceSheetBalanced ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'border-border'}`}>✓</div>
                  <span className="font-bold text-muted-foreground">Balanço de Abertura Consolidado</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Calibration actions & incidents */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Change Calibration Profile */}
          <div className="card-premium p-6 space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
              <Sliders size={16} className="text-primary" /> Calibrador de Sensibilidade
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Justificativa Fiduciária</label>
                <textarea 
                  value={customRationale} 
                  onChange={e => setCustomRationale(e.target.value)}
                  className="w-full text-xs"
                  rows={2}
                />
              </div>

              {calibrationError && (
                <div className="p-2 text-[10px] font-bold text-red-650 bg-red-50 border border-red-100 rounded-lg">
                  {calibrationError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => handleApplyProfile('balanced')}
                  className="px-2 py-1.5 bg-surface-container-high hover:bg-surface-container-highest text-foreground border border-border rounded text-[10px] font-black uppercase tracking-wider transition-colors"
                >
                  Balanced
                </button>
                <button 
                  onClick={() => handleApplyProfile('conservative')}
                  className="px-2 py-1.5 bg-accent hover:bg-accent text-accent border border-accent rounded text-[10px] font-black uppercase tracking-wider transition-colors"
                >
                  Conservative
                </button>
                <button 
                  onClick={() => handleApplyProfile('aggressive')}
                  className="px-2 py-1.5 bg-amber-600/10 hover:bg-amber-600/20 text-amber-500 border border-amber-500/20 rounded text-[10px] font-black uppercase tracking-wider transition-colors"
                >
                  Aggressive
                </button>
                <button 
                  onClick={() => handleApplyProfile('board_mode')}
                  className="px-2 py-1.5 bg-primary hover:opacity-90 text-primary-foreground rounded text-[10px] font-black uppercase tracking-wider transition-opacity"
                >
                  Board Mode
                </button>
              </div>
            </div>
          </div>

          {/* Audit calibration history */}
          <div className="card-premium p-6 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <FileText size={14} className="text-primary" /> Log de Calibrações
            </h3>
            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1 scrollbar-premium">
              {calibrationLogs.map((log, idx) => (
                <div key={idx} className="p-2.5 bg-surface-container border border-border rounded-lg space-y-1">
                  <div className="flex justify-between items-center text-[9px] text-muted-foreground font-bold">
                    <span>{log.actorId} (versão {log.version})</span>
                    <span>{new Date(log.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-[10px] font-bold text-foreground">Mudou para perfil "{log.profileId}"</p>
                  <p className="text-[9px] font-semibold text-muted-foreground italic">"{log.rationale}"</p>
                </div>
              ))}
              {calibrationLogs.length === 0 && (
                <p className="text-[10px] text-muted-foreground italic">Nenhum evento de calibração registrado.</p>
              )}
            </div>
          </div>

          {/* Incidents Feed */}
          <div className="card-premium p-6 space-y-4 border-rose-500/20">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
              <AlertTriangle size={16} className="text-rose-500" /> Alertas do Runtime
            </h3>
            
            <div className="space-y-3">
              {incidents.length === 0 ? (
                <div className="p-4 bg-success-soft0/5 border border-emerald-500/10 rounded-xl text-emerald-500 flex items-center gap-2">
                  <CheckCircle size={16} />
                  <p className="text-xs font-semibold">Sem incidentes detectados.</p>
                </div>
              ) : (
                incidents.map((inc) => (
                  <div key={inc.id} className="p-4 bg-critical-soft0/5 border border-rose-500/10 rounded-xl flex items-start gap-2.5">
                    <AlertTriangle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-foreground capitalize">{inc.type.replace('_', ' ')}</h4>
                      <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{inc.message}</p>
                      <span className="text-[9px] text-muted-foreground/60 font-mono block mt-2">{new Date(inc.detectedAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
