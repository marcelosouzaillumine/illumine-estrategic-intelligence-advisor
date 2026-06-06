// src/components/pages/governance/BoardMeetingMode.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Play, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  ShieldCheck, 
  HelpCircle,
  FileCheck,
  UserCheck,
  ArrowRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FiduciaryRuntimeAdapter } from '../../../services/FiduciaryRuntimeAdapter';
import { BoardMeeting, MeetingBoardResolution, MeetingMinutes, ESGIMScenario } from '../../../services/FiduciaryRuntimeAdapter';
import { FiduciaryModalShell } from '../../executive-interaction/FiduciaryModalShell';

interface BoardMeetingModeProps {
  clientId: string;
  scenario: ESGIMScenario;
  companyName?: string;
}

export function BoardMeetingMode({ clientId, scenario, companyName = 'Holding Illumine S/A' }: BoardMeetingModeProps) {
  const [activeMeeting, setActiveMeeting] = useState<BoardMeeting | null>(null);
  const [currentAgendaIndex, setCurrentAgendaIndex] = useState(0);
  const [participantsInput, setParticipantsInput] = useState('');
  
  // Resolution inputs state
  const [voterNames, setVoterNames] = useState<Record<string, string>>({});
  const [decisionReasons, setDecisionReasons] = useState<Record<string, string>>({});
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  
  // Tracking confirmation dialog states
  const [confirmingResolution, setConfirmingResolution] = useState<{
    id: string;
    decision: 'APPROVED' | 'REJECTED' | 'POSTPONED';
  } | null>(null);

  const [confirmingComplete, setConfirmingComplete] = useState(false);
  const [completedMinutes, setCompletedMinutes] = useState<MeetingMinutes | null>(null);
  const [showTraceability, setShowTraceability] = useState(false);

  // Load active meeting or minutes on mount or scenario change
  useEffect(() => {
    const meeting = FiduciaryRuntimeAdapter.boardMeetingEngine.getActiveMeeting(clientId, scenario);
    setActiveMeeting(meeting);
    setCompletedMinutes(null);
    setCurrentAgendaIndex(0);
    setConfirmingResolution(null);
    setConfirmingComplete(false);
  }, [clientId, scenario]);

  // Calculate readiness score dynamically for display in portal
  const boardPack = useMemo(() => {
    return FiduciaryRuntimeAdapter.boardPackGeneratorEngine.generateBoardPack(clientId, 'DEMO_SCENARIO', scenario, companyName);
  }, [clientId, scenario, companyName]);

  const journey = useMemo(() => {
    return FiduciaryRuntimeAdapter.governanceJourneyEngine.generateJourney(clientId, 'DEMO_SCENARIO', scenario);
  }, [clientId, scenario]);

  const sortedSteps = useMemo(() => {
    return [...journey.steps].sort((a, b) => b.executiveAttentionScore - a.executiveAttentionScore);
  }, [journey.steps]);

  const handleStartMeeting = () => {
    if (!participantsInput.trim()) {
      setWarningMessage('Por favor, informe os participantes da reunião.');
      return;
    }
    const meeting = FiduciaryRuntimeAdapter.boardMeetingEngine.startMeeting(clientId, scenario, companyName);
    setActiveMeeting(meeting);
    setCurrentAgendaIndex(0);
  };

  const handleOpenConfirmation = (resolutionId: string, decision: 'APPROVED' | 'REJECTED' | 'POSTPONED') => {
    if (decision === 'APPROVED') {
      const voter = voterNames[resolutionId]?.trim();
      const reason = decisionReasons[resolutionId]?.trim();
      if (!voter || !reason) {
        setWarningMessage('Por favor, preencha o campo "Decidido por" e a "Justificativa da Decisão" antes de aprovar.');
        return;
      }
    }
    setConfirmingResolution({ id: resolutionId, decision });
  };

  const handleConfirmResolution = () => {
    if (!confirmingResolution || !activeMeeting) return;
    
    const { id, decision } = confirmingResolution;
    const voter = voterNames[id] || 'Conselho Extraordinário';
    const reason = decisionReasons[id] || 'Homologação de diretriz estratégica';

    const updated = FiduciaryRuntimeAdapter.boardMeetingEngine.updateResolution(
      clientId,
      scenario,
      id,
      decision,
      voter,
      reason
    );

    setActiveMeeting(updated);
    setConfirmingResolution(null);
  };

  const handleCompleteMeeting = () => {
    if (!activeMeeting) return;
    
    const participants = participantsInput
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const { meeting, minutes } = FiduciaryRuntimeAdapter.boardMeetingEngine.completeMeeting(
      clientId,
      scenario,
      participants
    );

    setActiveMeeting(null);
    setCompletedMinutes(minutes);
    setConfirmingComplete(false);
  };

  const handleReset = () => {
    setCompletedMinutes(null);
    setActiveMeeting(null);
    setParticipantsInput('');
    setVoterNames({});
    setDecisionReasons({});
  };

  // 1. Portal view: Not in meeting
  if (!activeMeeting && !completedMinutes) {
    return (
      <div className="space-y-8">
        <div className="card-premium p-8 border border-white/5 bg-[#060D17] rounded-3xl relative overflow-hidden">
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF8552]/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/25 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Users size={12} />
              Boardroom Environment
            </div>
            
            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
              Board Meeting Mode (BMM™) <span className="text-xs font-mono text-slate-500">v1.0</span>
            </h2>
            
            <p className="text-slate-400 text-sm leading-relaxed">
              O BMM™ é a primeira sala de deliberação governada do Illumine Governance™. 
              Esta camada permite que recomendações estruturadas se tornem decisões formais, 
              registrando responsabilidades e prazos de forma humana no Governance Decision Tracking Layer (GDTL™).
            </p>

            {/* Governance Journey Snapshot */}
            <div className="space-y-4 border-t border-white/5 pt-6 mt-6 animate-fadeIn">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#FF8552] flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Snapshot da Jornada de Governança™ (GJL™)
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* GJI & Stage */}
                <div className="lg:col-span-5 bg-slate-950/40 border border-white/5 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">GJI Score</span>
                    <span className="text-2xl font-extrabold text-white font-mono">{journey.gjiScore}<span className="text-xs text-slate-500 font-normal">/100</span></span>
                  </div>
                  <div className="text-[10px] text-slate-400 italic font-medium leading-relaxed">
                    “Governance Journey Index — índice consolidado de navegação executiva”
                  </div>
                  <div className="text-xs font-black uppercase text-indigo-400 tracking-wider">
                    {journey.gjiStage}
                  </div>
                  <div className="text-[11px] text-slate-400 bg-slate-900/50 p-3 rounded-lg border border-white/5 font-light leading-relaxed">
                    “{journey.boardNarrative}”
                  </div>
                </div>

                {/* Steps order by EAI */}
                <div className="lg:col-span-7 bg-slate-950/40 border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-3 block">
                    Passos Priorizados por Atenção (EAI™)
                  </span>
                  
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                    {sortedSteps.map((step, index) => {
                      const isLocked = FiduciaryRuntimeAdapter.benchmarkReadinessEngine.evaluateReadiness(clientId, scenario).certificationStatus === 'NOT_CERTIFIED' && (step.id === 'step-07' || step.id === 'step-08');
                      return (
                        <div key={step.id} className="flex justify-between items-center bg-slate-900/30 p-2 rounded border border-white/5 hover:border-white/10 transition-colors">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black text-slate-600 font-mono">#{index + 1}</span>
                            <span className="text-xs font-bold text-slate-300">{step.title}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] font-mono text-slate-500 font-bold">EAI: {step.executiveAttentionScore}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black border uppercase ${
                              isLocked 
                                ? 'bg-rose-500/10 border-rose-500/25 text-rose-400' 
                                : step.status === 'CRITICAL'
                                ? 'bg-rose-500/10 border-rose-500/25 text-rose-400'
                                : step.status === 'ATTENTION'
                                ? 'bg-amber-500/10 border-amber-500/25 text-amber-400'
                                : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                            }`}>
                              {isLocked ? 'BLOQUEADO' : step.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Pre-meeting summary */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-slate-950/50 p-6 rounded-2xl border border-white/5">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Decision Readiness Score</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-extrabold text-white">{boardPack.decisionReadinessScore}</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF8552]">
                    {boardPack.decisionReadinessScore >= 75 ? 'Alta Confiança' : boardPack.decisionReadinessScore >= 50 ? 'Confiança Moderada' : 'Baixa Confiança'}
                  </span>
                </div>
              </div>
              
              <div className="w-full md:w-auto space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 block">Participantes da Sessão (Separados por vírgula)</label>
                  <input
                    type="text"
                    value={participantsInput}
                    onChange={(e) => setParticipantsInput(e.target.value)}
                    placeholder="ex. Helena Ramos, Carlos Santos, Marcelo Souza"
                    className="w-full md:w-80 px-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#FF8552]/40 transition-colors"
                  />
                </div>
                
                <button
                  onClick={handleStartMeeting}
                  className="w-full bg-[#FF8552] hover:bg-[#FF8552]/90 text-white font-bold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#FF8552]/10 transition-colors"
                >
                  <Play size={12} fill="currentColor" />
                  Instaurar Reunião Extraordinária
                </button>
              </div>
            </div>
          </div>
        </div>
        {warningMessage && (
          <FiduciaryModalShell
            isOpen={!!warningMessage}
            title="Aviso de Validação"
            priority="HIGH"
            onClose={() => setWarningMessage(null)}
            onConfirm={() => setWarningMessage(null)}
          >
            <div className="space-y-3 py-2">
              <p className="text-sm text-slate-350">{warningMessage}</p>
            </div>
          </FiduciaryModalShell>
        )}
      </div>
    );
  }

  // 2. Active Meeting View
  if (activeMeeting) {
    const activeItem = activeMeeting.agendaItems[currentAgendaIndex];
    
    return (
      <div className="space-y-6">
        {/* Cockpit Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#060D17] border border-white/5 p-6 rounded-2xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF8552] animate-pulse" />
              <span className="text-xs font-bold text-[#FF8552] uppercase tracking-widest">Sessão Plenária Ativa</span>
            </div>
            <h3 className="text-lg font-bold text-white leading-tight">{activeMeeting.title}</h3>
            <span className="text-[10px] font-mono text-slate-500 uppercase">Meeting ID: {activeMeeting.meetingId}</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Decision Readiness</span>
              <span className="text-xl font-extrabold text-white">{activeMeeting.readinessScore}</span>
            </div>
            
            <button
              onClick={() => setConfirmingComplete(true)}
              className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold py-2 px-4 rounded-xl text-xs uppercase tracking-wider transition-colors"
            >
              Concluir e Compilar Ata
            </button>
          </div>
        </div>

        {/* Boardroom Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Agenda items list */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 block">Ordem do Dia (Pauta)</span>
            <div className="space-y-2">
              {activeMeeting.agendaItems.map((item, idx) => {
                const isActive = idx === currentAgendaIndex;
                const isPast = idx < currentAgendaIndex;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentAgendaIndex(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${
                      isActive 
                        ? 'bg-[#FF8552]/5 border-[#FF8552]/30 text-white shadow-md' 
                        : isPast
                        ? 'bg-slate-950/20 border-white/5 text-slate-400 hover:text-slate-300'
                        : 'bg-[#060D17] border-white/5 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isActive 
                        ? 'bg-[#FF8552] text-white' 
                        : isPast
                        ? 'bg-slate-800 text-slate-400'
                        : 'bg-slate-900 border border-white/10 text-slate-500'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 space-y-1">
                      <span className="text-xs font-bold block">{item.title}</span>
                      <div className="flex gap-2">
                        <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          item.criticality === 'CRITICAL' 
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/25'
                            : item.criticality === 'HIGH'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                            : 'bg-slate-800 text-slate-400 border border-white/5'
                        }`}>
                          {item.criticality}
                        </span>
                        <span className="text-[8px] font-medium text-slate-500 uppercase tracking-widest">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Active Agenda Details Panel */}
          <div className="lg:col-span-8 card-premium p-6 border border-white/5 bg-[#060D17] rounded-2xl min-h-[450px] flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Tópico em Discussão</span>
                  <h4 className="text-md font-bold text-white">{activeItem.title}</h4>
                </div>
                
                <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                  activeItem.criticality === 'CRITICAL' 
                    ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                    : activeItem.criticality === 'HIGH'
                    ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                    : 'bg-slate-900 text-slate-400 border border-white/5'
                }`}>
                  Criticidade: {activeItem.criticality}
                </span>
              </div>

              {/* Agenda Content */}
              <div className="space-y-4">
                <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl space-y-2">
                  <span className="text-[9px] font-bold text-[#FF8552] uppercase tracking-wider block">Contexto de Deliberação</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{activeItem.recommendedDiscussion}</p>
                </div>

                {/* Specific widgets for resolutions on Topic 6 */}
                {activeItem.id === 'AGENDA-RESOLUTIONS' && (
                  <div className="space-y-6 pt-4 border-t border-white/5">
                    <span className="text-xs font-bold text-slate-200 block uppercase tracking-wide">Deliberações recomendadas</span>
                    
                    <div className="space-y-4">
                      {activeMeeting.resolutions.map((res) => {
                        const currentVoter = voterNames[res.id] || '';
                        const currentReason = decisionReasons[res.id] || '';
                        
                        return (
                          <div key={res.id} className="p-4 bg-slate-950/60 border border-white/5 rounded-xl space-y-4">
                            <div className="flex justify-between items-start gap-4">
                              <div className="space-y-1">
                                <span className="text-xs font-bold text-white block">{res.title}</span>
                                <p className="text-[11px] text-slate-400">{res.description}</p>
                              </div>
                              
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                                res.decision === 'APPROVED'
                                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                  : res.decision === 'REJECTED'
                                  ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                                  : 'bg-slate-900 border-white/10 text-slate-500'
                              }`}>
                                {res.decision === 'APPROVED' ? 'Aprovada' : res.decision === 'REJECTED' ? 'Rejeitada' : 'Adiada'}
                              </span>
                            </div>

                            {/* Deliberation Inputs */}
                            {res.decision !== 'APPROVED' && res.decision !== 'REJECTED' && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-3 mt-2">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 block">Decidido por (Conselheiro / Comitê)</label>
                                  <input
                                    type="text"
                                    value={currentVoter}
                                    onChange={(e) => setVoterNames(prev => ({ ...prev, [res.id]: e.target.value }))}
                                    placeholder="ex. Helena Ramos"
                                    className="w-full px-3 py-1.5 bg-slate-900 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#FF8552]/40"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 block">Justificativa da Decisão</label>
                                  <input
                                    type="text"
                                    value={currentReason}
                                    onChange={(e) => setDecisionReasons(prev => ({ ...prev, [res.id]: e.target.value }))}
                                    placeholder="ex. Em linha com as diretrizes de compliance"
                                    className="w-full px-3 py-1.5 bg-slate-900 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#FF8552]/40"
                                  />
                                </div>
                              </div>
                            )}

                            {res.decision === 'APPROVED' && (
                              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3 text-[11px] text-emerald-400/90 space-y-1">
                                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[9px]">
                                  <ShieldCheck size={12} />
                                  Conectado ao GDTL™
                                </div>
                                <div>Aprovado por: <span className="font-semibold text-white">{res.decidedBy}</span></div>
                                <div>Justificativa: <span className="italic text-slate-300">"{res.decisionReason}"</span></div>
                                <div className="text-[10px] text-slate-500 mt-1">Ação aberta em GDTL (Responsável: UNASSIGNED | Risco: ALTO)</div>
                              </div>
                            )}

                            {res.decision === 'REJECTED' && (
                              <div className="bg-rose-500/5 border border-rose-500/10 rounded-lg p-3 text-[11px] text-rose-400/90">
                                <div>Rejeitado por: <span className="font-semibold text-white">{res.decidedBy}</span></div>
                                <div>Motivo: <span className="italic text-slate-300">"{res.decisionReason}"</span></div>
                              </div>
                            )}

                            {/* Decision Buttons */}
                            {res.decision === 'POSTPONED' && (
                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={() => handleOpenConfirmation(res.id, 'APPROVED')}
                                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-1 px-3 rounded-lg text-[10px] uppercase tracking-wider transition-colors"
                                >
                                  Aprovar
                                </button>
                                <button
                                  onClick={() => handleOpenConfirmation(res.id, 'REJECTED')}
                                  className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-1 px-3 rounded-lg text-[10px] uppercase tracking-wider transition-colors"
                                >
                                  Rejeitar
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-6">
              <button
                disabled={currentAgendaIndex === 0}
                onClick={() => setCurrentAgendaIndex(prev => prev - 1)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
              >
                <ChevronLeft size={16} />
                Tópico Anterior
              </button>
              
              <span className="text-[10px] font-mono text-slate-500">
                Pauta {currentAgendaIndex + 1} de {activeMeeting.agendaItems.length}
              </span>

              {currentAgendaIndex < activeMeeting.agendaItems.length - 1 ? (
                <button
                  onClick={() => setCurrentAgendaIndex(prev => prev + 1)}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Próximo Tópico
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={() => setConfirmingComplete(true)}
                  className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
                >
                  Encerrar Reunião
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Confirmation Modal for resolutions */}
        {confirmingResolution && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#060D17] border border-white/10 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
              <h5 className="text-md font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="text-[#FF8552] w-5 h-5" />
                Confirmar Deliberação
              </h5>
              
              <p className="text-xs text-slate-400 leading-relaxed">
                Você tem certeza que deseja homologar esta resolução como <strong className="text-white">
                  {confirmingResolution.decision === 'APPROVED' ? 'APROVADA' : 'REJEITADA'}
                </strong>? 
                Esta ação é definitiva e integrará decisões rastreáveis no painel fiduciário.
              </p>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => setConfirmingResolution(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white bg-slate-900 border border-white/5 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmResolution}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#FF8552] hover:bg-[#FF8552]/90 transition-colors"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal for complete meeting */}
        {confirmingComplete && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#060D17] border border-white/10 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
              <h5 className="text-md font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="text-emerald-400 w-5 h-5" />
                Encerrar Reunião?
              </h5>
              
              <p className="text-xs text-slate-400 leading-relaxed">
                Deseja compilar a Ata e registrar as deliberações em definitivo?
                As resoluções aprovadas serão formalizadas na trilha fiduciária da holding.
              </p>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => setConfirmingComplete(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white bg-slate-900 border border-white/5 transition-colors"
                >
                  Retornar
                </button>
                <button
                  onClick={handleCompleteMeeting}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors"
                >
                  Compilar e Encerrar
                </button>
              </div>
            </div>
          </div>
        )}
        {warningMessage && (
          <FiduciaryModalShell
            isOpen={!!warningMessage}
            title="Aviso de Validação"
            priority="HIGH"
            onClose={() => setWarningMessage(null)}
            onConfirm={() => setWarningMessage(null)}
          >
            <div className="space-y-3 py-2">
              <p className="text-sm text-slate-350">{warningMessage}</p>
            </div>
          </FiduciaryModalShell>
        )}
      </div>
    );
  }

  // 3. Completed Minutes View
  if (completedMinutes) {
    return (
      <div className="space-y-6">
        <div className="card-premium p-8 border border-white/5 bg-[#060D17] rounded-3xl relative overflow-hidden">
          {/* Cover/Seal */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="flex justify-between items-center border-b border-white/5 pb-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded-full text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <FileText size={12} />
                Ata de Reunião Concluída
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight leading-tight pt-2">
                Ata de Reunião Extraordinária do Conselho
              </h2>
              <span className="text-[10px] font-mono text-slate-500 uppercase">
                Código de Autenticação: MEET-{scenario}-COMPLETED
              </span>
            </div>

            <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-widest">
              {completedMinutes.status}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
            {/* Metadata & Participants */}
            <div className="space-y-6 lg:col-span-1 border-r border-white/5 pr-4">
              <div className="space-y-2">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Participantes</span>
                <div className="flex flex-wrap gap-2">
                  {completedMinutes.participants.map((p, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 border border-white/5 rounded-lg text-xs text-slate-300 font-medium">
                      <UserCheck size={10} className="text-[#FF8552]" />
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Tópicos Debatidos</span>
                <ul className="space-y-1">
                  {completedMinutes.discussedTopics.map((topic, i) => (
                    <li key={i} className="text-xs text-slate-400 list-disc list-inside">
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setShowTraceability(!showTraceability)}
                className="text-xs text-slate-500 hover:text-slate-300 underline underline-offset-4 block pt-4"
              >
                {showTraceability ? 'Ocultar rastreabilidade técnica' : 'Exibir assinaturas e rastreabilidade fiduciária'}
              </button>
              
              {showTraceability && (
                <div className="p-3 bg-slate-950 border border-white/5 rounded-xl space-y-2 text-[10px] font-mono text-slate-400 break-all select-all animate-fadeIn">
                  <div>Timestamp de Emissão: {completedMinutes.generatedAt}</div>
                  <div>ID da Sessão: {completedMinutes.meetingId}</div>
                  <div>Cenário Assinatura: {scenario}</div>
                </div>
              )}
            </div>

            {/* Deliberations & Execution Summary */}
            <div className="lg:col-span-2 space-y-6">
              {/* Executive narrative */}
              <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl space-y-1.5">
                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider block">Parecer Final da Reunião</span>
                <p className="text-xs text-slate-300 leading-relaxed italic">"{completedMinutes.executiveSummary}"</p>
              </div>

              {/* Resolutions Details */}
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Resoluções Deliberadas</span>
                
                {completedMinutes.approvedResolutions.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider block">Aprovadas</span>
                    {completedMinutes.approvedResolutions.map((res, i) => (
                      <div key={i} className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-xs text-emerald-300">
                        {res}
                      </div>
                    ))}
                  </div>
                )}

                {completedMinutes.rejectedResolutions.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-rose-400 uppercase tracking-wider block">Rejeitadas</span>
                    {completedMinutes.rejectedResolutions.map((res, i) => (
                      <div key={i} className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl text-xs text-rose-300">
                        {res}
                      </div>
                    ))}
                  </div>
                )}

                {completedMinutes.postponedResolutions.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Postergadas / Sem Deliberação</span>
                    {completedMinutes.postponedResolutions.map((res, i) => (
                      <div key={i} className="p-3 bg-slate-950 border border-white/5 rounded-xl text-xs text-slate-400">
                        {res}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* GDTL integration check */}
              {completedMinutes.approvedResolutions.length > 0 && (
                <div className="space-y-2 border-t border-white/5 pt-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Ações Criadas no GDTL™</span>
                  <div className="space-y-2">
                    {completedMinutes.actionItems.map((item, i) => (
                      <div key={i} className="p-3 bg-slate-900 border border-white/5 rounded-xl text-xs text-slate-300 flex items-center gap-2">
                        <Activity size={12} className="text-amber-500" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 mt-8 flex justify-end">
            <button
              onClick={handleReset}
              className="bg-[#FF8552] hover:bg-[#FF8552]/90 text-white font-bold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-colors"
            >
              Iniciar Nova Sessão Plenária
            </button>
          </div>
        </div>
        {warningMessage && (
          <FiduciaryModalShell
            isOpen={!!warningMessage}
            title="Aviso de Validação"
            priority="HIGH"
            onClose={() => setWarningMessage(null)}
            onConfirm={() => setWarningMessage(null)}
          >
            <div className="space-y-3 py-2">
              <p className="text-sm text-slate-350">{warningMessage}</p>
            </div>
          </FiduciaryModalShell>
        )}
      </div>
    );
  }

  return null;
}
