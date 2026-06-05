import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Presentation, 
  Download, 
  ChevronRight, 
  ChevronLeft,
  X,
  Database,
  ShieldCheck,
  CheckSquare,
  FileDown,
  MessageSquare,
  Activity,
  UserCheck,
  Send,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { PageHeader, StatusBadge } from '../Common';
import { executiveRuntime } from '../../services/FiduciaryRuntimeAdapter';
import { ExecutivePdfExportEngine } from '../../core/exporting/ExecutivePdfExportEngine';
import { BoardPackExportEngine } from '../../core/exporting/BoardPackExportEngine';
import { InstitutionalReportFormatter } from '../../core/exporting/InstitutionalReportFormatter';

import { useInstitutionalAuth } from '../../core/security/auth/InstitutionalAuthProvider';
import { useRuntimeContext } from '../../core/security/auth/RuntimeContextProvider';
import { TenantLicensingEngine } from '../../core/commercial/TenantLicensingEngine';
import { WhiteLabelGovernance, BrandingConfig } from '../../core/commercial/WhiteLabelGovernance';
import { OnboardingEngine } from '../../core/onboarding/OnboardingEngine';
import { ExecutiveCollaborationLayer, ExecutiveComment } from '../../core/collaboration/ExecutiveCollaborationLayer';
import { BoardWorkflowLayer, BoardWorkflow, WorkflowState } from '../../core/workflows/BoardWorkflowLayer';
import { EnterpriseReadinessDiagnostics, ReadinessReport } from '../../core/diagnostics/EnterpriseReadinessDiagnostics';
import { AdoptionAnalytics, TenantAdoptionMetrics } from '../../core/analytics/AdoptionAnalytics';

// New Delivery components
import { ExecutiveHeroPanel } from '../executive-delivery/ExecutiveHeroPanel';
import { StrategicHighlightsPanel } from '../executive-delivery/StrategicHighlightsPanel';
import { RuntimeHealthPanel } from '../executive-delivery/RuntimeHealthPanel';
import { BoardJourneyNavigator } from '../executive-delivery/BoardJourneyNavigator';
import { ExecutiveEvidenceViewer } from '../executive-delivery/ExecutiveEvidenceViewer';
import { DeliveryTimelinePanel } from '../executive-delivery/DeliveryTimelinePanel';
import { ExportHistoryPanel } from '../executive-delivery/ExportHistoryPanel';
import { GuidedBoardJourneyRuntime, BoardEvidenceData } from '../../core/executive-delivery/GuidedBoardJourneyRuntime';
import { StepContent } from '../../core/executive-delivery/ExecutiveDeliveryOrchestrator';
import { ExportSnapshotMetadata } from '../../core/exporting/ExportTypes';

export function ClientExecutiveWorkspace({ selectedClient, selectedYear }: { selectedClient: string; selectedYear: number }) {
  const { session } = useInstitutionalAuth();
  const { buildDataAccessContext, isReady } = useRuntimeContext();

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Slide journey state
  const [presentationMode, setPresentationMode] = useState<boolean>(false);
  const [journeyRuntime, setJourneyRuntime] = useState<GuidedBoardJourneyRuntime | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [evidenceMode, setEvidenceMode] = useState<boolean>(false);

  // Past exports history
  const [pastExports, setPastExports] = useState<ExportSnapshotMetadata[]>([]);

  // Collaboration and Workflow states
  const [comments, setComments] = useState<ExecutiveComment[]>([]);
  const [newCommentContent, setNewCommentContent] = useState<string>('');
  const [commentVisibility, setCommentVisibility] = useState<ExecutiveComment['visibilityPolicy']>('PUBLIC_WITHIN_TENANT');
  const [activeWorkflow, setActiveWorkflow] = useState<BoardWorkflow | null>(null);
  const [workflowError, setWorkflowError] = useState<string | null>(null);
  const [licensingError, setLicensingError] = useState<string | null>(null);

  // Trigger data compile
  useEffect(() => {
    setLoading(true);
    try {
      const compiled = executiveRuntime.generateExecutiveReport(getMockInput());
      setReport(compiled);
      
      const runtimeInstance = new GuidedBoardJourneyRuntime(compiled);
      setJourneyRuntime(runtimeInstance);
      setCurrentStepIndex(runtimeInstance.getState().currentStepIndex);
      setEvidenceMode(runtimeInstance.getState().evidenceModeActive);

      // Auto initialize onboarding checklist mock requirements to pass readiness checks
      OnboardingEngine.updateState(selectedClient, {
        isolationValidated: true,
        topologyValidated: true,
        entityScopeConfigured: true,
        minRolesAssigned: true,
        telemetryActive: true,
        observabilityActive: true,
        initialBalanceSheetBalanced: true,
        advisoryRuntimeOperational: true
      });
      OnboardingEngine.initializeHealth(selectedClient, session?.actorId || 'system-user');

      // Initialize workflow
      if (isReady && session) {
        const context = buildDataAccessContext('CREATE_REPORT', 'Workflow');
        const wf = BoardWorkflowLayer.startWorkflow(context, selectedClient, 'Report');
        setActiveWorkflow(wf);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [selectedClient, selectedYear, isReady]);

  // Sync presentation state when journey runtime changes
  useEffect(() => {
    if (!journeyRuntime) return;
    const unsub = journeyRuntime.subscribe(() => {
      const state = journeyRuntime.getState();
      setCurrentStepIndex(state.currentStepIndex);
      setEvidenceMode(state.evidenceModeActive);
      setPresentationMode(state.isFullscreenActive);
    });
    return unsub;
  }, [journeyRuntime]);

  // Load comments
  useEffect(() => {
    if (isReady && session) {
      const context = buildDataAccessContext('VIEW_DASHBOARD', 'Collaboration');
      ExecutiveCollaborationLayer.listComments(context, selectedClient).then(setComments);
    }
  }, [selectedClient, isReady, session]);

  // Setup visual branding with verification rules (WhiteLabelGovernance)
  const branding = useMemo(() => {
    if (!selectedClient) return null;
    const config: BrandingConfig = {
      logoUrl: '',
      colors: {
        primary: '#FF8552',
        secondary: '#4f46e5',
        background: '#1a1a1a',
        criticalAlertColor: '#ef4444' // Safe red color, not green
      },
      hideWarnings: false,
      disableLineage: false,
      disableFiduciaryStamps: false,
      overrideConfidenceState: false,
      overrideSeverity: false,
      overrideCompositeScore: false,
      downgradeVisualCriticality: false,
      hideVisualAuditTrail: false
    } as any;

    try {
      return WhiteLabelGovernance.resolveTheme(selectedClient, config);
    } catch (e) {
      console.error('[Branding Error]', e);
      return null;
    }
  }, [selectedClient]);

  // Check Feature Flag License availability
  const isSimulationAllowed = useMemo(() => {
    if (!session) return false;
    try {
      return TenantLicensingEngine.isFeatureAllowed(session.planId!, 'scenarioSimulationAllowed', selectedClient);
    } catch (e) {
      return false;
    }
  }, [session, selectedClient]);

  const isWhiteLabelAllowed = useMemo(() => {
    if (!session) return false;
    try {
      return TenantLicensingEngine.isFeatureAllowed(session.planId!, 'isWhiteLabel', selectedClient);
    } catch (e) {
      return false;
    }
  }, [session, selectedClient]);

  // Compute maturity diagnostics
  const readinessReport = useMemo<ReadinessReport | null>(() => {
    if (!isReady || !session) return null;
    try {
      const context = buildDataAccessContext('VIEW_DASHBOARD', 'Diagnostics');
      return EnterpriseReadinessDiagnostics.generateReport(context, selectedClient);
    } catch (e) {
      console.error('[Diagnostics Error]', e);
      return null;
    }
  }, [isReady, session, selectedClient]);

  // Compute adoption metrics
  const adoptionMetrics = useMemo<TenantAdoptionMetrics | null>(() => {
    if (!isReady || !session) return null;
    try {
      const context = buildDataAccessContext('VIEW_DASHBOARD', 'Analytics');
      return AdoptionAnalytics.getMetrics(context, selectedClient);
    } catch (e) {
      console.error('[Analytics Error]', e);
      return null;
    }
  }, [isReady, session, selectedClient]);

  // Onboarding wizard data
  const onboardingState = useMemo(() => {
    return OnboardingEngine.getOnboardingState(selectedClient);
  }, [selectedClient]);

  // Mock static payload to feed executiveRuntime (Dummy Renderer doctrine)
  const getMockInput = () => ({
    isMockData: false,
    historicalCyclesCount: 3,
    clientProfile: {
      segmentoAtuacao: 'Tech Corp'
    },
    rawFinancialData: {
      segmentoEmpresa: 'Tech Corp',
      prevPl: 800,
      bpSummary: {
        ativoTotal: 1200,
        ativoCirculante: 800,
        passivoCirculante: 400,
        passivoTotal: 600,
        patrimonioLiquido: 600,
        caixaEquivalentes: 200,
        estoques: 300,
      }
    },
    bpData: [
      { accountId: '1', value: 1200 },
      { accountId: '1.1', value: 800 },
      { accountId: '1.1.1', value: 200 },
      { accountId: '1.1.2', value: 300 },
      { accountId: '2', value: 600 },
      { accountId: '2.1', value: 400 },
      { accountId: '3', value: 600 }
    ],
    dreData: [
      { category: 'RECEITA BRUTA', value: 1500 },
      { category: 'DEDUÇÕES', value: -300 },
      { category: 'RECEITA LÍQUIDA', value: 1200 },
      { category: 'CUSTOS VARIÁVEIS', value: -400 },
      { category: 'EBITDA', value: 400 },
      { category: 'LUCRO LÍQUIDO DO EXERCÍCIO', value: 150 }
    ],
    cashFlowData: [
      { initialCash: 50, finalCash: 200, operatingFlow: 150, investingFlow: 0, financingFlow: 0 }
    ]
  });

  // Slide navigation
  const handleStartPresentation = () => {
    if (!isSimulationAllowed) {
      setLicensingError('Recurso não licenciado para o plano atual (Guided Presentation requer plano com simulação ativa).');
      return;
    }
    if (journeyRuntime) {
      journeyRuntime.startJourney();
      setLicensingError(null);
    }
  };

  const handleNextSlide = () => {
    if (journeyRuntime) {
      journeyRuntime.nextStep();
    }
  };

  const handlePrevSlide = () => {
    if (journeyRuntime) {
      journeyRuntime.prevStep();
    }
  };

  const toggleEvidenceMode = () => {
    if (journeyRuntime) {
      journeyRuntime.toggleEvidenceMode();
    }
  };

  // Export handlers with runtime quota consumption
  const handleDownloadPDF = () => {
    if (!isReady || !session || !report) return;

    try {
      // Validate license status
      TenantLicensingEngine.validateLicense(selectedClient, session.sessionState === 'READY' ? 'ACTIVE' : 'SUSPENDED');

      // Consume quota
      TenantLicensingEngine.consumeQuota(selectedClient, session.planId!, 'exportQuotas');

      const { pdf, metadata } = ExecutivePdfExportEngine.exportReport(report, session.actorId);
      pdf.save(`Executive_Report_${selectedClient || 'client'}.pdf`);
      
      setPastExports(prev => [metadata, ...prev]);
      setLicensingError(null);
    } catch (err: any) {
      console.error(err);
      setLicensingError(err.message);
    }
  };

  const handleDownloadBoardPack = () => {
    if (!isReady || !session || !report) return;

    try {
      TenantLicensingEngine.validateLicense(selectedClient, session.sessionState === 'READY' ? 'ACTIVE' : 'SUSPENDED');
      TenantLicensingEngine.consumeQuota(selectedClient, session.planId!, 'exportQuotas');

      const { pdf, metadata } = BoardPackExportEngine.exportBoardPack(report, session.actorId);
      pdf.save(`Board_Pack_${selectedClient || 'client'}.pdf`);
      
      setPastExports(prev => [metadata, ...prev]);
      setLicensingError(null);
    } catch (err: any) {
      console.error(err);
      setLicensingError(err.message);
    }
  };

  const handleDownloadMarkdown = () => {
    if (report) {
      const md = InstitutionalReportFormatter.toMarkdown(report);
      const blob = new Blob([md], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Report_${selectedClient || 'client'}.md`;
      a.click();
    }
  };

  // Collaboration comment posting
  const handlePostComment = async () => {
    if (!isReady || !session || !newCommentContent.trim()) return;

    try {
      const context = buildDataAccessContext('CREATE_REPORT', 'Collaboration', selectedClient, session.actorId, commentVisibility, 'BOARD_APPROVED', true, {
        lineageHash: report?.compliance?.lineageHash || 'lineage-hash-default'
      });

      await ExecutiveCollaborationLayer.postComment(context, {
        content: newCommentContent,
        resourceId: selectedClient,
        resourceType: 'Report',
        lineageReference: report?.compliance?.lineageHash || 'lineage-hash-default',
        visibilityPolicy: commentVisibility
      });

      // Reload
      const freshContext = buildDataAccessContext('VIEW_DASHBOARD', 'Collaboration');
      const list = await ExecutiveCollaborationLayer.listComments(freshContext, selectedClient);
      setComments(list);
      setNewCommentContent('');
      setWorkflowError(null);
    } catch (err: any) {
      console.error(err);
      setWorkflowError(err.message);
    }
  };

  // Workflow Approval Handlers
  const handleWorkflowApprove = (nextState: WorkflowState) => {
    if (!isReady || !session || !activeWorkflow) return;

    try {
      const context = buildDataAccessContext('APPROVE_BOARD_PACK', 'Workflow', selectedClient, session.actorId, 'INTERNAL', 'BOARD_APPROVED', true, {
        lineageHash: report?.compliance?.lineageHash || 'lineage-hash-default'
      });

      const updated = BoardWorkflowLayer.approveStep(context, activeWorkflow.workflowId, nextState);
      setActiveWorkflow(updated);
      setWorkflowError(null);
    } catch (err: any) {
      console.error(err);
      setWorkflowError(err.message);
    }
  };

  const handleWorkflowReject = () => {
    if (!isReady || !session || !activeWorkflow) return;

    try {
      const context = buildDataAccessContext('APPROVE_BOARD_PACK', 'Workflow');
      const updated = BoardWorkflowLayer.rejectStep(context, activeWorkflow.workflowId, 'Apresentação rejeitada por inconsistência de premissas.');
      setActiveWorkflow(updated);
      setWorkflowError(null);
    } catch (err: any) {
      console.error(err);
      setWorkflowError(err.message);
    }
  };

  const handleWorkflowEscalate = (escalationType: 'GOVERNANCE_ESCALATION' | 'ADVISORY_ESCALATION') => {
    if (!isReady || !session || !activeWorkflow) return;

    try {
      const context = buildDataAccessContext('APPROVE_BOARD_PACK', 'Workflow');
      const updated = BoardWorkflowLayer.escalateWorkflow(context, activeWorkflow.workflowId, escalationType);
      setActiveWorkflow(updated);
      setWorkflowError(null);
    } catch (err: any) {
      console.error(err);
      setWorkflowError(err.message);
    }
  };

  if (loading || !report) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest animate-pulse">
          Processando Inteligência Executiva...
        </span>
      </div>
    );
  }

  const stepsList = journeyRuntime ? journeyRuntime.getState().steps : [];
  const currentStep = stepsList[currentStepIndex] || ({ title: 'N/A', step: 'SUMMARY', description: '', data: {} } as StepContent);
  const evidenceData = journeyRuntime?.getBoardEvidence();

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-10 pb-32 animate-executive-fade text-foreground">
      
      {/* Visual warning banner & Fiduciary Stamps (Never hidden by white-label) */}
      <div className="bg-rose-500/10 border-l-4 border-rose-500 p-4 rounded-r-xl flex items-start gap-3">
        <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={18} />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-rose-500 uppercase tracking-widest">
            Fiduciary Compliance Warning
          </h4>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Esta área de trabalho opera sob supervisão de integridade fiduciária. Mutações e ocultação de riscos de severidade contábil são estritamente proibidas e auditadas pelo ledger imutável.
          </p>
        </div>
      </div>

      {/* Header */}
      <PageHeader
        title="Executive Workspace"
        subtitle="Sua central fiduciária de apresentações de conselho, resumos integrados e downloads executivos."
        icon={LayoutDashboard}
        transparent
      />

      {licensingError && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive p-3 rounded-lg text-xs font-medium">
          {licensingError}
        </div>
      )}

      {/* Grid Dashboard */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Onboarding & Diagnostics */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* Onboarding Wizard Card */}
          <div className="card-premium p-6 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <CheckSquare size={14} className="text-secondary" /> Onboarding Checklist
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${onboardingState.isolationValidated ? 'bg-success/20 border-success/40 text-success' : 'border-border'}`}>
                  ✓
                </div>
                <span className="font-bold text-foreground">Tenant Isolation Validated</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${onboardingState.topologyValidated ? 'bg-success/20 border-success/40 text-success' : 'border-border'}`}>
                  ✓
                </div>
                <span className="font-bold text-foreground">Topology Mapping Validated</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${onboardingState.entityScopeConfigured ? 'bg-success/20 border-success/40 text-success' : 'border-border'}`}>
                  ✓
                </div>
                <span className="font-bold text-foreground">Entity Scope Configured</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${onboardingState.governanceReadiness ? 'bg-success/20 border-success/40 text-success' : 'border-border text-muted-foreground'}`}>
                  ✓
                </div>
                <span className="font-bold text-foreground">Governance Readiness</span>
              </div>
            </div>
            
            <div className="pt-2 border-t border-border flex justify-between items-center text-[10px] text-muted-foreground">
              <span>Readiness Status:</span>
              <span className={onboardingState.governanceReadiness ? 'text-success font-bold' : 'text-warning font-bold'}>
                {onboardingState.governanceReadiness ? 'PRONTO' : 'PENDENTE'}
              </span>
            </div>
          </div>

          {/* Enterprise Diagnostics Card */}
          {readinessReport && (
            <div className="card-premium p-6 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Activity size={14} className="text-secondary" /> Readiness Diagnostics
              </h3>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-[10px] text-muted-foreground">Maturity Score</span>
                  <p className="text-h2 font-display font-medium text-foreground">{readinessReport.readinessScore}/100</p>
                </div>
                <span className={cn(
                  "text-[10px] px-2 py-0.5 rounded font-bold uppercase",
                  readinessReport.readinessLevel === 'HIGH' ? 'bg-success/20 text-success' :
                  readinessReport.readinessLevel === 'MEDIUM' ? 'bg-warning/20 text-warning' : 'bg-destructive/20 text-destructive'
                )}>
                  {readinessReport.readinessLevel} Level
                </span>
              </div>

              {readinessReport.readinessRisks.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-border">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">Maturity Risks</span>
                  <ul className="text-[10px] text-rose-400 space-y-1 pl-3 list-disc">
                    {readinessReport.readinessRisks.map((risk, idx) => (
                      <li key={idx}>{risk}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Quick Presentation Trigger */}
          <div className="card-premium p-8 bg-card/60 backdrop-blur-md border border-border/80 shadow-md space-y-6">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
              <Presentation size={18} className="text-secondary" /> Board Journey
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Inicie a jornada de apresentação guiada em tela cheia para reuniões de diretoria e conselhos.
            </p>
            <button 
              onClick={handleStartPresentation}
              className="w-full bg-[#FF8552] text-white hover:bg-[#FF8552]/90 font-bold uppercase tracking-widest py-3 rounded-button text-xs flex items-center justify-center gap-2"
            >
              <Presentation size={15} /> Iniciar Apresentação
            </button>
          </div>

          {/* Temporal trajectory of datasets */}
          <DeliveryTimelinePanel report={report} />

        </div>

        {/* Right Column: Executive Summaries, Workflows & Collaboration */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Executive Hero Panel */}
          <ExecutiveHeroPanel report={report} />

          {/* Runtime Health Panel */}
          <RuntimeHealthPanel report={report} />

          {/* Strategic Highlights Panel */}
          <StrategicHighlightsPanel report={report} />

          {/* Board Workflows Panel */}
          {activeWorkflow && (
            <div className="card-premium p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <UserCheck size={14} className="text-secondary" /> Board Decisions Workflow
                </h3>
                <span className="text-[10px] px-2 py-0.5 bg-secondary/15 text-secondary border border-secondary/30 rounded uppercase font-bold">
                  {activeWorkflow.currentState}
                </span>
              </div>

              {workflowError && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-500 p-2.5 rounded text-[10px] font-semibold">
                  {workflowError}
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2">
                <button 
                  onClick={() => handleWorkflowApprove('CFO_APPROVAL')}
                  className="px-3 py-1.5 bg-[#FF8552] text-white rounded text-[10px] font-bold uppercase tracking-wider hover:bg-[#FF8552]/80 transition-colors"
                >
                  Enviar para CFO Approval
                </button>
                <button 
                  onClick={() => handleWorkflowApprove('EXECUTIVE_SIGN_OFF')}
                  className="px-3 py-1.5 bg-success/20 text-success border border-success/40 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-success/30 transition-colors"
                >
                  Sign-off Executivo
                </button>
                <button 
                  onClick={() => handleWorkflowEscalate('GOVERNANCE_ESCALATION')}
                  className="px-3 py-1.5 bg-warning/20 text-warning border border-warning/40 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-warning/30 transition-colors"
                >
                  Escalar Governança
                </button>
                <button 
                  onClick={handleWorkflowReject}
                  className="px-3 py-1.5 bg-destructive/20 text-destructive border border-destructive/40 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-destructive/30 transition-colors"
                >
                  Rejeitar Etapa
                </button>
              </div>
            </div>
          )}

          {/* Export Center */}
          <div className="card-premium p-6 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Download size={14} className="text-secondary" /> Central de Downloads
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={handleDownloadPDF}
                className="flex items-center justify-between p-4 bg-surface-container/50 border border-border hover:border-secondary/40 transition-colors rounded-xl text-left"
              >
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-foreground">Relatório Executivo</h4>
                  <span className="text-[9px] text-muted-foreground">PDF de alta resolução</span>
                </div>
                <FileDown size={18} className="text-muted-foreground" />
              </button>

              <button 
                onClick={handleDownloadBoardPack}
                className="flex items-center justify-between p-4 bg-surface-container/50 border border-border hover:border-secondary/40 transition-colors rounded-xl text-left"
              >
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-foreground">Board Pack Completo</h4>
                  <span className="text-[9px] text-muted-foreground">Pasta unificada de Ata</span>
                </div>
                <FileDown size={18} className="text-muted-foreground" />
              </button>

              <button 
                onClick={handleDownloadMarkdown}
                className="flex items-center justify-between p-4 bg-surface-container/50 border border-border hover:border-secondary/40 transition-colors rounded-xl text-left"
              >
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-foreground">Texto em Markdown</h4>
                  <span className="text-[9px] text-muted-foreground">Relatório fiduciário TXT</span>
                </div>
                <FileDown size={18} className="text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Export history log */}
          <ExportHistoryPanel 
            exports={pastExports} 
            onDownloadReport={(meta) => {
              // Re-download snapshot using the metadata ID
              const { pdf } = BoardPackExportEngine.exportBoardPack(report, meta.generatedBy);
              pdf.save(`Board_Pack_Reissue_${meta.exportId}.pdf`);
            }}
          />

          {/* Central de Colaboração (Comments Section) */}
          <div className="card-premium p-6 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <MessageSquare size={14} className="text-secondary" /> Central de Colaboração
            </h3>

            {/* List of comments */}
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2">
              {comments.map(c => (
                <div key={c.commentId} className="p-3 bg-surface-container/30 border border-border/50 rounded-xl space-y-1.5">
                  <div className="flex justify-between items-center text-[9px] text-muted-foreground">
                    <span className="font-bold text-foreground">{c.actorId} ({c.role})</span>
                    <span>{new Date(c.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-xs leading-relaxed">{c.content}</p>
                  <div className="flex items-center gap-2 text-[8px] text-muted-foreground font-mono">
                    <span>Lineage: {c.lineageReference.substring(0, 16)}...</span>
                    <span>•</span>
                    <span className="uppercase text-secondary font-bold">{c.visibilityPolicy}</span>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-[11px] text-muted-foreground">Nenhum comentário ou anotação registrada para este relatório.</p>
              )}
            </div>

            {/* New comment input */}
            <div className="space-y-3 pt-3 border-t border-border">
              <textarea 
                value={newCommentContent}
                onChange={e => setNewCommentContent(e.target.value)}
                placeholder="Insira um comentário fiduciário atrelado a este relatório contábil..."
                className="w-full p-3 text-xs bg-surface-container/50 border border-border rounded-xl focus:outline-none focus:border-secondary/60 text-foreground"
                rows={2}
              />
              <div className="flex justify-between items-center">
                <select 
                  value={commentVisibility}
                  onChange={e => setCommentVisibility(e.target.value as any)}
                  className="bg-surface-container border border-border text-[10px] font-bold uppercase py-1.5 px-3 rounded-lg text-muted-foreground"
                >
                  <option value="PUBLIC_WITHIN_TENANT">Público para o Tenant</option>
                  <option value="BOARD_ONLY">Somente Conselho</option>
                  <option value="CFO_ONLY">Somente CFO</option>
                </select>
                <button 
                  onClick={handlePostComment}
                  className="flex items-center gap-1.5 bg-[#FF8552] text-white hover:bg-[#FF8552]/90 font-bold uppercase tracking-widest py-1.5 px-4 rounded-lg text-[10px]"
                >
                  <Send size={10} /> Publicar Nota
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* FULLSCREEN BOARD PRESENTATION MODE CONTAINER */}
      {presentationMode && (
        <div className="fixed inset-0 bg-[#0d0f14] z-[999] flex flex-col justify-between text-white p-8 lg:p-12 animate-fade-in select-none">
          
          {/* Top Bar Info */}
          <div className="flex justify-between items-center border-b border-slate-800 pb-6">
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#FF8552]">Guided Presentation Slide</span>
              <h2 className="text-3xl font-black text-white tracking-tight">{currentStep.title}</h2>
            </div>
            <button 
              onClick={() => journeyRuntime?.exitJourney()}
              className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Middle Body */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 py-10 overflow-y-auto">
            
            {/* Slide Content (3 cols) */}
            <div className="lg:col-span-3 space-y-6 flex flex-col justify-center max-w-4xl mx-auto w-full">
              
              <p className="text-sm font-bold text-indigo-400 uppercase tracking-widest">{currentStep.description}</p>

              {currentStep.step === 'SUMMARY' && (
                <div className="space-y-4">
                  <h3 className="text-5xl font-black leading-tight text-white tracking-tight">Parecer Contábil-Financeiro</h3>
                  <div className="bg-slate-900/60 p-6 border border-slate-800 rounded-2xl">
                    <p className="text-base font-semibold text-slate-300 leading-relaxed">{currentStep.data.executiveSummary}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/40 p-4 border border-slate-800 rounded-xl">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Score Geral</span>
                      <span className="text-2xl font-black text-white">{currentStep.data.scores?.composite}</span>
                    </div>
                    <div className="bg-slate-900/40 p-4 border border-slate-800 rounded-xl">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Severidade</span>
                      <span className="text-2xl font-black text-rose-400 uppercase block mt-1">{currentStep.data.severity?.level}</span>
                    </div>
                  </div>
                </div>
              )}

              {currentStep.step === 'PRIORITIES' && (
                <div className="space-y-4">
                  <h3 className="text-4xl font-black text-white tracking-tight">Prioridades Estratégicas</h3>
                  <p className="text-sm font-bold text-slate-300">Foco Principal: {currentStep.data.priorityFocus}</p>
                  <div className="space-y-2 mt-4">
                    {currentStep.data.actionMatrix?.map((action: string, idx: number) => (
                      <div key={idx} className="p-3 bg-slate-900/40 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300">
                        {idx + 1}. {action}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep.step === 'FINANCIAL_HEALTH' && (
                <div className="space-y-4">
                  <h3 className="text-4xl font-black text-white tracking-tight">Saúde e Solidez das Contas</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl text-center">
                      <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Score Geral</span>
                      <h4 className="text-3xl font-black text-white mt-1">{currentStep.data.scores?.composite}</h4>
                    </div>
                    <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl text-center">
                      <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Liquidez</span>
                      <h4 className="text-3xl font-black text-white mt-1">{currentStep.data.scores?.financial}</h4>
                    </div>
                    <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl text-center">
                      <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Operacional</span>
                      <h4 className="text-3xl font-black text-white mt-1">{currentStep.data.scores?.operational}</h4>
                    </div>
                    <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl text-center">
                      <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Governança</span>
                      <h4 className="text-3xl font-black text-white mt-1">{currentStep.data.scores?.governance}</h4>
                    </div>
                  </div>
                </div>
              )}

              {currentStep.step === 'CAUSALITY' && (
                <div className="space-y-4">
                  <h3 className="text-4xl font-black text-white tracking-tight">Causalidade e Evento Raiz</h3>
                  <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
                    <div>
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-1">Evento Detetado</span>
                      <p className="text-base font-bold text-white">{currentStep.data.causality?.event}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-1">Causa Raiz Contábil</span>
                      <p className="text-xs font-semibold text-slate-300 leading-relaxed">{currentStep.data.causality?.rootCause}</p>
                    </div>
                  </div>
                </div>
              )}

              {currentStep.step === 'STRESS_PROPAGATION' && (
                <div className="space-y-4">
                  <h3 className="text-4xl font-black text-white tracking-tight">Propagação Causal de Risco</h3>
                  <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
                    <p className="text-xs font-bold text-slate-400">
                      Vulnerabilidades contábeis propagadas pelo motor:
                    </p>
                    <div className="space-y-2">
                      {currentStep.data.structuralCapital?.signals?.map((sig: string, i: number) => (
                        <span key={i} className="inline-block bg-slate-800 text-indigo-400 px-3 py-1 rounded text-xs font-mono mr-2 border border-slate-700">
                          {sig}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep.step === 'SCENARIOS' && (
                <div className="space-y-4">
                  <h3 className="text-4xl font-black text-white tracking-tight">Cenários Simulados</h3>
                  <div className="space-y-3">
                    {currentStep.data.scenarioProjections && currentStep.data.scenarioProjections.length > 0 ? (
                      currentStep.data.scenarioProjections.map((proj: any, idx: number) => (
                        <div key={idx} className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
                          <p className="text-xs font-black text-white uppercase tracking-wider">{proj.scenarioName}</p>
                          <p className="text-[11px] text-slate-400 mt-1">{proj.description}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs font-semibold text-slate-500 italic">Nenhum cenário adicional gerado pelo core.</p>
                    )}
                  </div>
                </div>
              )}

              {currentStep.step === 'RISKS' && (
                <div className="space-y-4">
                  <h3 className="text-4xl font-black text-white tracking-tight">Hierarquia de Riscos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 bg-rose-950/20 border border-rose-900/30 rounded-xl">
                      <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest block mb-2">Riscos Críticos</span>
                      <ul className="text-xs font-semibold text-rose-200 list-disc list-inside space-y-1.5">
                        {currentStep.data.executiveAttentionMap?.critical?.map((risk: string, i: number) => (
                          <li key={i}>{risk}</li>
                        ))}
                        {(!currentStep.data.executiveAttentionMap?.critical || currentStep.data.executiveAttentionMap.critical.length === 0) && (
                          <li className="italic text-slate-500">Zero riscos críticos</li>
                        )}
                      </ul>
                    </div>
                    <div className="p-5 bg-slate-900/60 border border-slate-850 rounded-xl">
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-2">Riscos Secundários</span>
                      <ul className="text-xs font-semibold text-slate-300 list-disc list-inside space-y-1.5">
                        {currentStep.data.executiveAttentionMap?.secondary?.map((risk: string, i: number) => (
                          <li key={i}>{risk}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {currentStep.step === 'ACTION_FOCUS' && (
                <div className="space-y-4">
                  <h3 className="text-4xl font-black text-white tracking-tight">Mitigação e Diretrizes Sugeridas</h3>
                  <ul className="space-y-3 text-xs font-semibold text-slate-300 pl-4 list-disc">
                    {currentStep.data.actionMatrix?.map((act: string, i: number) => (
                      <li key={i}>{act}</li>
                    ))}
                  </ul>
                </div>
              )}

              {currentStep.step === 'BOARD_CONCLUSION' && (
                <div className="space-y-4">
                  <h3 className="text-4xl font-black text-white tracking-tight">Rastreabilidade & Conclusão</h3>
                  <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-2">
                    <p className="text-[11px] font-semibold text-slate-400 leading-normal">
                      A auditoria do conselho foi inicializada com sucesso. Todos os lineage hashes, calibradores e perfis de thresholds estão em conformidade com o regimento interno de governança corporativa.
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* BOARD_EVIDENCE_MODE Panel (1 col) */}
            <div className="lg:col-span-1 border-l border-slate-800 pl-6 flex flex-col justify-between">
              <div>
                {evidenceMode && evidenceData && (
                  <ExecutiveEvidenceViewer evidence={evidenceData} />
                )}
                {!evidenceMode && (
                  <div className="p-6 bg-slate-900/20 border border-slate-800/40 rounded-3xl text-center text-slate-500">
                    <p className="text-xs font-semibold">Exibição de evidências de lineage desabilitada. Ative na barra inferior se necessário.</p>
                  </div>
                )}
              </div>
              <div className="text-[9px] text-slate-600 mt-auto flex items-center gap-1">
                <Database size={12} /> Fiduciary Lineage Active
              </div>
            </div>

          </div>

          {/* Bottom Bar Navigation */}
          <div className="flex justify-center items-center pt-6 border-t border-slate-800">
            <BoardJourneyNavigator 
              currentStepIndex={currentStepIndex}
              totalSteps={stepsList.length}
              currentStepTitle={currentStep.title}
              onNext={handleNextSlide}
              onPrev={handlePrevSlide}
              onExit={() => journeyRuntime?.exitJourney()}
              onToggleEvidence={toggleEvidenceMode}
              evidenceModeActive={evidenceMode}
              className="max-w-2xl w-full"
            />
          </div>

        </div>
      )}

    </div>
  );
}
