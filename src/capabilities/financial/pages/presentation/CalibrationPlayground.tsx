
// Isolated mock dataset for sandbox simulations

import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, RotateCcw, History, Sliders, Activity, FileText, CheckCircle2, AlertTriangle, User, Layers, HelpCircle, Eye, Settings, ChevronRight } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../../../components/Common';
import { CalibrationEngine } from '../../../../services/FiduciaryRuntimeAdapter';
import { CALIBRATION_PROFILES, BALANCED_PROFILE } from '../../../../services/FiduciaryRuntimeAdapter';
import { CalibrationParameters, CalibrationProfileVersion } from '../../../../services/FiduciaryRuntimeAdapter';
import { executiveRuntime } from '../../../../services/FiduciaryRuntimeAdapter';
import { StagingValidationEngine } from '../../../../services/FiduciaryRuntimeAdapter';
import { IngestionLineageReference, ImportedDataset } from '../../../../services/FiduciaryRuntimeAdapter';
import { auth } from '../../../../lib/firebase';
import { cn } from '../../../../lib/utils';
import { ExecutivePageTemplate } from '../../../../components/ui/executive-page-template';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveAccordion } from '../../../../components/ui/executive-accordion';
import { ExecutiveEmptyState } from '../../../../components/ui/executive-empty-state';
import { ExecutiveHeading } from '../../../../components/ui/executive-heading';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../../../../components/ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../../../../components/ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../../../../components/ui/executive-decision-trace';
import { useCalibrationPlaygroundViewModel } from '../../../../viewmodels/useCalibrationPlaygroundViewModel';
import { useExecutiveFormatter } from '../../../../core/localization';

const MOCK_SANDBOX_DATA = {
  isMockData: false,
  historicalCyclesCount: 3,
  clientProfile: {
    segmentoAtuacao: 'Default'
  },
  rawFinancialData: {
    segmentoEmpresa: 'Default',
    prevPl: 800,
    bpSummary: {
      ativoTotal: 1000,
      ativoCirculante: 600,
      passivoCirculante: 600,
      passivoTotal: 600,
      patrimonioLiquido: 400,
      caixaEquivalentes: 20,
      estoques: 300,
    }
  },
  bpData: [
    { accountId: '1', value: 1000 },
    { accountId: '1.1', value: 600 },
    { accountId: '1.1.1', value: 20 },
    { accountId: '1.1.2', value: 300 },
    { accountId: '2', value: 600 },
    { accountId: '2.1', value: 600 },
    { accountId: '3', value: 400 }
  ],
  dreData: [
    { category: 'RECEITA BRUTA', value: 1200 },
    { category: 'DEDUÇÕES', value: -200 },
    { category: 'RECEITA LÍQUIDA', value: 1000 },
    { category: 'CUSTOS VARIÁVEIS', value: -500 },
    { category: 'EBITDA', value: 300 },
    { category: 'LUCRO LÍQUIDO DO EXERCÍCIO', value: -100 } // Net Loss
  ],
  cashFlowData: [
    { initialCash: 120, finalCash: 20, operatingFlow: -100, investingFlow: 0, financingFlow: 0 }
  ]
};


export function CalibrationPlayground() {
  const { state, computed, actions } = useCalibrationPlaygroundViewModel();
  const formatter = useExecutiveFormatter();
  const portal = createPortal;
  const [activeTab, setActiveTab] = useState<'profile' | 'manual'>('profile');
  const [actorId, setActorId] = useState<string>('');
  const [rationale, setRationale] = useState<string>('');
  
  // Custom slider state
  const [customParams, setCustomParams] = useState<CalibrationParameters>({ ...BALANCED_PROFILE });
  
  // Feedback alerts
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Sync logged in user actorId
  useEffect(() => {
    if (auth.currentUser) {
      setActorId(auth.currentUser.email || auth.currentUser.uid);
    } else {
      setActorId('AUDITOR-MOCK');
    }
  }, []);

  // Update slider states whenever active calibration parameters change
  useEffect(() => {
    setCustomParams({ ...CalibrationEngine.getCalibration() });
  }, [refreshTrigger]);

  const handleApplyProfile = (profileId: string) => {
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      const result = CalibrationEngine.applyProfile(profileId, actorId, rationale);
      setSuccessMessage(`Perfil "${profileId}" aplicado fiduciariamente! Versão: ${result.version}`);
      setRationale('');
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao aplicar o perfil.');
    }
  };

  const handleUpdateParameter = (param: keyof CalibrationParameters, value: any, paramName: string) => {
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      const result = CalibrationEngine.updateParameter(param, value, actorId, rationale);
      setSuccessMessage(`Parâmetro "${paramName}" ajustado fiduciariamente! Versão: ${result.version}`);
      setRationale('');
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao ajustar o parâmetro.');
    }
  };

  const handleReset = () => {
    CalibrationEngine.resetToDefault();
    setSuccessMessage('Parâmetros resetados para o baseline "balanced" v1.0.0.');
    setErrorMessage('');
    setRationale('');
    setRefreshTrigger(prev => prev + 1);
  };

  // Run isolated simulation on mock dataset fiduciarily
  // 1. Staging Warnings Simulation
  const simulateStagingWarnings = () => {
    const dataset: ImportedDataset = {
      blockingWarnings: [],
      importId: 'SIM-INGESTION-101',
      connectorId: 'SANDBOX',
      tenantId: 'SANDBOX-TENANT',
      workspaceId: 'WS-1',
      rawPayloadSize: 500,
      extractedRecords: 5,
      trustLevel: 'HIGH' as const,
      status: 'PENDING_REVIEW' as const,
      lineage: {} as IngestionLineageReference,
      violations: [],
      submittedBy: 'sandbox-auditor',
      submittedAt: new Date().toISOString(),
      parsedData: {
        bp: { ativo: 1000, passivo: 600, pl: 400 },
        dre: { grossRevenue: 1200, deductions: -200, netRevenue: 1000, costs: 50 }, // Sign Inversion
        dfc: { initialCash: 120, finalCash: 20, operatingFlow: -100 } // Cashflow Mismatch
      }
    };
    StagingValidationEngine.validateDataset(dataset);
    return dataset.blockingWarnings || [];
  };

  // 2. Executive Report Generation Simulation
  const simulationReport = executiveRuntime.generateExecutiveReport(MOCK_SANDBOX_DATA);
  const activeParams = CalibrationEngine.getCalibration();
  const activeProfileId = CalibrationEngine.getActiveProfileId();
  const activeVersion = CalibrationEngine.getVersion();
  const auditTrail = CalibrationEngine.getAuditTrail();
  const stagingWarnings = simulateStagingWarnings();

  return (
    <ExecutivePageTemplate header={{
      title: "Calibration Playground",
      description: "Ambiente de Simulação de Parâmetros Contábeis, Sensibilidades e Materialidade de Pareceres Executivos.",
    }}>

      {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE CALIBRAÇÃO DO MOTOR) --- */}
      <ExecutiveSummarySection 
        className="mb-8"
        status={{ label: `Perfil: ${activeProfileId} (v${activeVersion})`, variant: 'success' }}
        question="Quais as sensibilidades, limiares de tolerância e perfis de calibração ativos no motor fiduciário?"
        opinion="O comitê fiduciário valida as alterações nos limiares de sensibilidade contábil e calibração de riscos."
        driver="Perfis de calibração, limiares de tolerância, rastro de auditoria e staging warnings."
        implication="Ajuste fino da sensibilidade dos pareceres automáticos sem perda de integridade conceitual."
        executiveQuestion="Testar cenários de estresse antes de homologar novas versões de calibração para produção."
      >
        <ExecutiveStrategicTensions tensions={[]} />
        <ExecutiveDecisionTrace trace={[]} />
      </ExecutiveSummarySection>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">

        <div className="flex items-center gap-3">
          <StatusBadge status="Verde" label="Sandbox Conectada" />
        </div>
        <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 text-success px-4 py-2 rounded-xl">
          <ShieldCheck size={16} className="shrink-0 text-emerald-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white">Sandbox Mode Active</span>
        </div>
      
      </div>

      <div className="mt-12 mb-8 border-t border-border pt-8" />
      <ExecutiveAccordion
        title="Controles de Calibração Fiduciária"
        subtitle="Configure limites de materialidade e perfis de sensibilidade do motor executivo."
        variant="analytics"
        defaultExpanded
      >

      <div className="space-y-12">

      {/* Top Overview: Active Calibration State */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Version & Profile Card */}
        <div className="card-premium p-6 flex flex-col justify-between border-secondary/20 hover:border-secondary/40 transition-all md:col-span-1">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Calibração Ativa</span>
            <div className="p-2 bg-secondary/10 text-secondary rounded-lg"><Settings size={16} /></div>
          </div>
          <div>
            <h4 className="text-h3 font-display font-medium tracking-tight text-secondary capitalize">{activeProfileId}</h4>
            <p className="text-[9px] text-muted-foreground font-semibold mt-1">VERSÃO DO MOTOR: {activeVersion}</p>
          </div>
        </div>

        {/* Confidence Thresholds */}
        <div className="card-premium p-6 flex flex-col justify-between hover:border-secondary/20 transition-all md:col-span-1">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block mb-2">Thresholds de Confiança</span>
            <div className="space-y-1 mt-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Degradação:</span>
                <span className="font-bold text-foreground">{(activeParams.confidenceDegradedThreshold * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Colapso:</span>
                <span className="font-bold text-foreground">{(activeParams.confidenceCollapseThreshold * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sensitivities */}
        <div className="card-premium p-6 flex flex-col justify-between hover:border-secondary/20 transition-all md:col-span-1">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block mb-2">Sensibilidades Ativas</span>
            <div className="space-y-1 mt-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estresse:</span>
                <span className="font-bold text-foreground">{activeParams.stressPropagationSensitivity.toFixed(1)}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Causalidade:</span>
                <span className="font-bold text-foreground">{activeParams.temporalCausalitySensitivity.toFixed(1)}x</span>
              </div>
            </div>
          </div>
        </div>

        {/* Materiality & Verbosity */}
        <div className="card-premium p-6 flex flex-col justify-between hover:border-secondary/20 transition-all md:col-span-1">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block mb-2">Materialidade & Parecer</span>
            <div className="space-y-1 mt-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Margem de Tolerância:</span>
                <span className="font-bold text-foreground">{(activeParams.warningMaterialityThreshold * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Verbosidade:</span>
                <span className="font-bold text-foreground uppercase tracking-widest text-[9px]">{activeParams.advisoryVerbosity}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Main Panel: Interactive Controls vs Simulated Output */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Calibration Console (1 col span) */}
        <div className="xl:col-span-1 space-y-6">
          <div className="card-premium p-8 bg-card/60 backdrop-blur-md border border-border/80 shadow-md space-y-6">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-secondary/10 flex items-center justify-center text-secondary">
                  <Sliders size={16} />
                </div>
                <div>
                  <h3 className="text-h3 font-medium tracking-tight">Console de Calibração</h3>
                  <p className="text-body-sm text-muted-foreground mt-0.5">Versione ou ajuste parâmetros do runtime.</p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="p-2 hover:bg-surface-container rounded-full text-muted-foreground hover:text-secondary transition-colors"
                title="Resetar para Baseline balanced"
              >
                <RotateCcw size={16} />
              </button>
            </div>

            {/* Governance Alerts */}
            {successMessage && (
              <div className="p-4 bg-success-soft border border-success/20 rounded-xl text-success flex items-start gap-2.5">
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                <p className="text-xs font-semibold leading-normal">{successMessage}</p>
              </div>
            )}

            {errorMessage && (
              <div className="p-4 bg-critical-soft border border-destructive/20 rounded-xl text-destructive flex items-start gap-2.5">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <p className="text-xs font-semibold leading-normal">{errorMessage}</p>
              </div>
            )}

            {/* Operator and rationale form section */}
            <div className="space-y-4 text-xs font-medium text-muted-foreground">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest">Identificação do Operador</label>
                <div className="flex items-center bg-surface-container border border-border rounded-lg px-3 py-2">
                  <User size={14} className="text-muted-foreground/60 mr-2" />
                  <input
                    type="text"
                    value={actorId}
                    onChange={(e) => setActorId(e.target.value)}
                    required
                    placeholder="actorId do auditor fiduciário"
                    className="bg-transparent border-none p-0 outline-none text-foreground w-full focus:ring-0 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest">Justificativa Fiduciária da Mudança (Mín. 10 Chars)</label>
                <textarea
                  value={rationale}
                  onChange={(e) => setRationale(e.target.value)}
                  required
                  placeholder="Explique o motivo para calibrar os thresholds contábeis..."
                  rows={2}
                  className="w-full bg-background border border-border text-foreground rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-secondary/25"
                />
              </div>
            </div>

            {/* Tabs for Profile Switching vs Slider adjustments */}
            <div className="border-b border-border flex gap-4">
              <button
                onClick={() => setActiveTab('profile')}
                className={cn(
                  "pb-2 font-bold tracking-wider uppercase text-[10px] border-b-2 transition-all",
                  activeTab === 'profile' 
                    ? "border-secondary text-secondary" 
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                Selecionar Perfil
              </button>
              <button
                onClick={() => setActiveTab('manual')}
                className={cn(
                  "pb-2 font-bold tracking-wider uppercase text-[10px] border-b-2 transition-all",
                  activeTab === 'manual' 
                    ? "border-secondary text-secondary" 
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                Ajuste Fino
              </button>
            </div>

            {activeTab === 'profile' ? (
              <div className="space-y-3">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">Perfis de Calibração Cadastrados</p>
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { id: 'balanced', label: 'Balanced (RC-1 Baseline)', desc: 'Comportamento fiduciário homologado imutável.', style: 'hover:border-success/40' },
                    { id: 'conservative', label: 'Conservative', desc: 'Rigor máximo contábil, alta penalização de risco.', style: 'hover:border-rose-400/40' },
                    { id: 'aggressive', label: 'Aggressive', desc: 'Maior tolerância contábil, propõe alavancagem.', style: 'hover:border-amber-400/40' },
                    { id: 'board_mode', label: 'Board Mode', desc: 'Resumos curtos, suprime alertas irrelevantes.', style: 'hover:border-secondary/40' },
                    { id: 'advisor_mode', label: 'Advisor Mode', desc: 'Análise densa,playbooks e sensibilidades altas.', style: 'hover:border-secondary/40' }
                  ].map(prof => (
                    <button
                      key={prof.id}
                      type="button"
                      disabled={rationale.length < 10}
                      onClick={() => handleApplyProfile(prof.id)}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border transition-all flex flex-col justify-between group disabled:opacity-50 disabled:cursor-not-allowed",
                        activeProfileId === prof.id
                          ? "bg-secondary/5 border-secondary text-foreground"
                          : `bg-background border-border ${prof.style}`
                      )}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="font-bold text-xs text-foreground group-hover:text-secondary transition-colors">{prof.label}</span>
                        <ChevronRight size={12} className="text-muted-foreground group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-1">{prof.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-5 text-xs text-muted-foreground font-semibold">
                
                {/* Confidence Collapse Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span>Collapse Threshold</span>
                    <span className="font-mono text-foreground font-bold">{(customParams.confidenceCollapseThreshold * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.10"
                    max="0.80"
                    step="0.05"
                    value={customParams.confidenceCollapseThreshold}
                    onChange={(e) => setCustomParams({ ...customParams, confidenceCollapseThreshold: Number(e.target.value) })}
                    className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-secondary"
                  />
                  <button
                    disabled={rationale.length < 10}
                    onClick={() => handleUpdateParameter('confidenceCollapseThreshold', customParams.confidenceCollapseThreshold, 'Collapse Threshold')}
                    className="mt-1 text-[9px] font-bold text-secondary uppercase hover:underline disabled:opacity-50 block"
                  >
                    Confirmar Valor
                  </button>
                </div>

                {/* Stress Propagation Sensitivity */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span>Stress Propagation Sensitivity</span>
                    <span className="font-mono text-foreground font-bold">{customParams.stressPropagationSensitivity.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={customParams.stressPropagationSensitivity}
                    onChange={(e) => setCustomParams({ ...customParams, stressPropagationSensitivity: Number(e.target.value) })}
                    className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-secondary"
                  />
                  <button
                    disabled={rationale.length < 10}
                    onClick={() => handleUpdateParameter('stressPropagationSensitivity', customParams.stressPropagationSensitivity, 'Stress Sensitivity')}
                    className="mt-1 text-[9px] font-bold text-secondary uppercase hover:underline disabled:opacity-50 block"
                  >
                    Confirmar Valor
                  </button>
                </div>

                {/* Materiality Limit */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span>Materiality Margin (Tolerance)</span>
                    <span className="font-mono text-foreground font-bold">{(customParams.warningMaterialityThreshold * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="0.15"
                    step="0.01"
                    value={customParams.warningMaterialityThreshold}
                    onChange={(e) => setCustomParams({ ...customParams, warningMaterialityThreshold: Number(e.target.value) })}
                    className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-secondary"
                  />
                  <button
                    disabled={rationale.length < 10}
                    onClick={() => handleUpdateParameter('warningMaterialityThreshold', customParams.warningMaterialityThreshold, 'Materiality Margin')}
                    className="mt-1 text-[9px] font-bold text-secondary uppercase hover:underline disabled:opacity-50 block"
                  >
                    Confirmar Valor
                  </button>
                </div>

                {/* Advisory Verbosity Select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Verbosidade do Parecer</label>
                  <select
                    value={customParams.advisoryVerbosity}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setCustomParams({ ...customParams, advisoryVerbosity: val });
                    }}
                    className="w-full bg-background border border-border text-foreground rounded-lg px-3 py-2 text-xs outline-none"
                  >
                    <option value="low">Low (Crisp Board summaries)</option>
                    <option value="medium">Medium (Standard balanced summaries)</option>
                    <option value="high">High (Deep analytical playbooks)</option>
                  </select>
                  <button
                    disabled={rationale.length < 10}
                    onClick={() => handleUpdateParameter('advisoryVerbosity', customParams.advisoryVerbosity, 'Advisory Verbosity')}
                    className="mt-1 text-[9px] font-bold text-secondary uppercase hover:underline disabled:opacity-50 block"
                  >
                    Confirmar Valor
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>

        {/* Right Column: Sandboxed Simulated Output Comparison (2 cols span) */}
        <div className="xl:col-span-2 space-y-8">
          
          <div className="card-premium p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-secondary/10 flex items-center justify-center text-secondary">
                <Activity size={16} />
              </div>
              <div>
                <h3 className="text-h3 font-medium tracking-tight">Simulação de Relatório Executivo (Sandbox)</h3>
                <p className="text-body-sm text-muted-foreground mt-0.5">Resultado da orquestração dos dados de teste no runtime sob os parâmetros calibrados.</p>
              </div>
            </div>

            {/* Scores and Severity Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 bg-surface-container rounded-2xl border border-border">
              
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Score Composto Calibrado</span>
                <h4 className="text-h3 font-display font-medium text-foreground tracking-tight mt-1">{simulationReport.scores.composite}</h4>
                <p className="text-[9.5px] text-muted-foreground font-semibold mt-0.5">PESOS AJUSTADOS DE COMPOSIÇÃO</p>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Severidade Modulada</span>
                <div className="mt-1">
                  <StatusBadge 
                    status={
                      simulationReport.severity.level === 'SAUDÁVEL' ? 'Verde' :
                      simulationReport.severity.level === 'SENSÍVEL' || simulationReport.severity.level === 'PRESSIONADO' ? 'Amarelo' : 'Vermelho'
                    }
                    label={simulationReport.severity.level}
                  />
                </div>
                <p className="text-[9.5px] text-muted-foreground font-semibold mt-1">GRAU DE EXPOSIÇÃO GERAL</p>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Confiança Projetada</span>
                <span className={cn(
                  "inline-block mt-2 px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider",
                  simulationReport.compliance.confidenceLevel === 'HIGH_CONFIDENCE' ? "bg-emerald-100/50 text-emerald-800" :
                  simulationReport.compliance.confidenceLevel === 'MEDIUM_CONFIDENCE' ? "bg-amber-100/50 text-amber-800" : "bg-rose-100/50 text-rose-800"
                )}>
                  {simulationReport.compliance.confidenceLevel}
                </span>
                <p className="text-[9.5px] text-muted-foreground font-semibold mt-1">CONFIDENCE INTEGRITY STATUS</p>
              </div>

            </div>

            {/* Simulated Advisory Narrative */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <FileText size={11} /> Parecer Executivo Simulado
              </span>
              <div className="p-5 bg-card border border-border rounded-2xl">
                <p className="text-xs text-foreground font-medium leading-relaxed">{simulationReport.advisory.executiveSummary}</p>
                <div className="mt-4 pt-4 border-t border-border/60">
                  <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-2">Matriz de Mitigação</p>
                  <ul className="text-xs text-muted-foreground space-y-1.5 pl-4 list-disc">
                    {simulationReport.advisory.actionMatrix.map((act, i) => (
                      <li key={i} className="leading-relaxed">{act}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Simulated Staging Warnings */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <AlertTriangle size={11} /> Alertas de Validação de Staging Pós-Calibração
              </span>
              <div className="p-4 bg-surface-container/60 border border-border rounded-xl">
                {stagingWarnings.length === 0 ? (
                  <p className="text-xs text-success font-bold flex items-center gap-1.5">
                    <CheckCircle2 size={13} /> Nenhum warning disparado — todos foram suprimidos ou validados.
                  </p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[10px] text-muted-foreground">Warnings ativos (Warnings críticos fiduciários nunca são ocultados):</p>
                    <ul className="text-xs text-destructive pl-4 list-disc space-y-1 font-semibold">
                      {stagingWarnings.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Calibration Audit Trail Timeline */}
      <div className="card-premium p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-secondary/10 flex items-center justify-center text-secondary">
            <History size={16} />
          </div>
          <div>
            <h3 className="text-h3 font-medium tracking-tight">Timeline de Auditoria de Calibração</h3>
            <p className="text-body-sm text-muted-foreground mt-0.5">Logs permanentes e auditáveis de modificações de variáveis contábeis no Runtime.</p>
          </div>
        </div>

        {auditTrail.length === 0 ? (
          <div className="py-8 text-center bg-surface-container/30 border border-dashed border-border rounded-xl">
            <p className="text-body-sm font-bold text-muted-foreground italic">Nenhum evento de calibração registrado no sistema. Versão baseline v1.0.0 ativa.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {auditTrail.map((log) => (
              <div key={log.version} className="p-5 bg-surface-container/40 border border-border rounded-xl flex flex-col md:flex-row justify-between gap-6 hover:bg-surface-container/60 transition-colors">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-foreground bg-surface-container border border-border px-2 py-0.5 rounded">{log.version}</span>
                    <span className="px-2 py-0.5 bg-secondary/10 text-secondary border border-secondary/20 rounded text-[9px] font-black uppercase tracking-wider">PERFIL: {log.profileId}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{formatter.date(log.createdAt)}</span>
                  </div>
                  <p className="text-xs text-foreground font-medium"><strong className="text-muted-foreground">Justificativa:</strong> {log.rationale}</p>
                  
                  {log.diff && log.diff.length > 0 && (
                    <div className="mt-2 text-[10px] space-y-1">
                      <p className="font-bold uppercase tracking-wider text-muted-foreground text-[8.5px]">Parâmetros Alterados:</p>
                      <div className="flex flex-wrap gap-x-6 gap-y-1 text-muted-foreground">
                        {log.diff.map(d => (
                          <div key={d.parameter}>
                            <span className="font-mono font-bold text-foreground">{d.parameter}:</span> {JSON.stringify(d.before)} → <span className="font-bold text-secondary">{JSON.stringify(d.after)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-right shrink-0 flex flex-col justify-center text-xs">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Efetuado por</span>
                  <span className="font-mono text-foreground font-bold mt-0.5">{log.actorId}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
        <ExecutiveSummarySection 
          status={{ label: 'Motor Calibrado', variant: 'success' }}
          question="Como ajustar os limites de sensibilidade do motor fiduciário?"
          opinion="A calibração do comitê de auditoria reflete o apetite de risco da governança atual."
          driver="Materialidade de pareceres, margens de tolerância e perfis de inferência."
          implication="Maior assertividade na geração automatizada de relatórios executivos."
          executiveQuestion="Revisar parâmetros semestralmente conforme volatilidade do mercado."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>
      </div>
      </ExecutiveAccordion>
    </ExecutivePageTemplate>
  );
}
