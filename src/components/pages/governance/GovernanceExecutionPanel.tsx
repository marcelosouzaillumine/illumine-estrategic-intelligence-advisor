// src/components/pages/governance/GovernanceExecutionPanel.tsx

import React, { useState, useEffect } from 'react';
import { Activity, User, Calendar, AlertTriangle, CheckCircle2, Clock, ShieldAlert, Plus, ArrowRight, Bookmark, ExternalLink, ChevronDown, UserCheck } from 'lucide-react';
import { FiduciaryRuntimeAdapter, GovernanceDecision, GovernanceDecisionType, CognitiveOriginEngine, DecisionExecutionRisk, ESGIMScenario } from '../../../services/FiduciaryRuntimeAdapter';

interface GovernanceExecutionPanelProps {
  clientId: string;
  scenario: ESGIMScenario;
  mode: string;
}

export function GovernanceExecutionPanel({ clientId, scenario, mode }: GovernanceExecutionPanelProps) {
  const [decisions, setDecisions] = useState<GovernanceDecision[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // New Decision Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDecisionType, setNewDecisionType] = useState<GovernanceDecisionType>('MANAGEMENT_ACTION');
  const [newOrigin, setNewOrigin] = useState<CognitiveOriginEngine>('BOARD');
  const [newRisk, setNewRisk] = useState<DecisionExecutionRisk>('LOW');
  const [newCategory, setNewCategory] = useState<'FIDUCIARY' | 'GOVERNANCE' | 'MISSION' | 'INSTITUTIONAL' | 'STRATEGIC'>('GOVERNANCE');
  const [newAssignedTo, setNewAssignedTo] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newBenefit, setNewBenefit] = useState('');

  // Fetch decisions and calculate metrics
  useEffect(() => {
    const registry = FiduciaryRuntimeAdapter.decisionRegistryEngine;
    const list = registry.getDecisions(clientId, scenario);
    // Force array copy to trigger re-renders
    setDecisions([...list]);
  }, [clientId, scenario, refreshTrigger]);

  const handleStatusChange = (id: string, status: any) => {
    FiduciaryRuntimeAdapter.decisionRegistryEngine.updateDecisionStatus(id, status);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleApproveBoard = (id: string) => {
    const registry = FiduciaryRuntimeAdapter.decisionRegistryEngine;
    const dec = registry.getDecisions(clientId, scenario).find(d => d.id === id);
    if (dec) {
      dec.approvedByBoard = true;
      dec.approvedAt = new Date().toISOString();
      // If currently OPEN or IN_PROGRESS, keep status, but if we want to change or sync:
      if (dec.status === 'OPEN') {
        dec.status = 'IN_PROGRESS';
      }
      // Save changes back
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('gdtl_decisions', JSON.stringify(registry.getDecisions(clientId, scenario)));
      }
      setRefreshTrigger(prev => prev + 1);
    }
  };

  const handleCreateDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const baseTime = Date.now();
    const newDec: GovernanceDecision = {
      id: `DEC-USER-${baseTime}`,
      title: newTitle,
      description: newDescription,
      source: 'BOARD',
      category: newCategory,
      decisionType: newDecisionType,
      originEngine: newOrigin,
      executionRisk: newRisk,
      assignedTo: newAssignedTo || undefined,
      createdAt: new Date().toISOString(),
      dueDate: newDueDate || undefined,
      status: 'OPEN',
      expectedBenefit: newBenefit,
      evidence: ['Inserção manual pelo usuário'],
      lineageHash: `LIN-GDTL-USR-${baseTime}`,
      approvedByBoard: false
    };

    FiduciaryRuntimeAdapter.decisionRegistryEngine.addDecision(newDec);
    setRefreshTrigger(prev => prev + 1);

    // Reset Form
    setNewTitle('');
    setNewDescription('');
    setNewAssignedTo('');
    setNewDueDate('');
    setNewBenefit('');
    setIsFormOpen(false);
  };

  const registry = FiduciaryRuntimeAdapter.decisionRegistryEngine;
  const geiSimple = registry.calculateGeiSimpleScore(scenario);
  const geiWeighted = registry.calculateGeiWeightedScore(scenario);
  const gai = registry.calculateGaiScore(scenario);
  const overdueRate = registry.calculateOverdueRate(scenario);
  const aging = registry.calculateAgingBuckets(scenario);

  // Status visual mapping
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-success-soft0/10 border-emerald-500/30 text-emerald-400';
      case 'IN_PROGRESS':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      case 'OVERDUE':
        return 'bg-critical-soft0/10 border-rose-500/30 text-rose-400';
      case 'CANCELLED':
        return 'bg-slate-500/10 border-white/10 text-muted-foreground';
      case 'OPEN':
      default:
        return 'bg-warning-soft0/10 border-amber-500/30 text-amber-400';
    }
  };

  const getRiskBadge = (risk: DecisionExecutionRisk) => {
    switch (risk) {
      case 'CRITICAL':
        return 'bg-critical-soft0/20 text-rose-400 border border-rose-500/40 font-black';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold';
      case 'MODERATE':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/20';
      case 'LOW':
      default:
        return 'bg-slate-500/20 text-muted-foreground border border-white/5';
    }
  };

  const getTypeLabel = (type: GovernanceDecisionType) => {
    switch (type) {
      case 'BOARD_RESOLUTION': return 'Resolução do Conselho';
      case 'MANAGEMENT_ACTION': return 'Ação de Gestão';
      case 'CORRECTIVE_ACTION': return 'Ação Corretiva';
      case 'STRATEGIC_INITIATIVE': return 'Iniciativa Estratégica';
      default: return type;
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Dials and Core Indicators Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* GEI Weighted Dial Card */}
        <div className="card-premium p-6 border border-white/5 bg-[#060D17] rounded-2xl flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black block mb-1">GEI™ Weighted Score</span>
              <h4 className="text-xs font-bold text-primary">Ponderado por Risco/Prazo</h4>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-[#FF8552]/20 flex items-center justify-center font-bold text-xs text-[#FF8552] bg-[#FF8552]/5">
              40%
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-white tracking-tight">{geiWeighted}</span>
            <span className="text-muted-foreground text-sm">/100</span>
          </div>
          <div className="w-full bg-slate-950/60 rounded-full h-1.5 overflow-hidden border border-white/5">
            <div className="bg-[#FF8552] h-full rounded-full" style={{ width: `${geiWeighted}%` }} />
          </div>
        </div>

        {/* GEI Simple Score Card */}
        <div className="card-premium p-6 border border-white/5 bg-[#060D17] rounded-2xl flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black block mb-1">GEI™ Simple Score</span>
              <h4 className="text-xs font-bold text-primary">Concluídas / Total</h4>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-[#BAB86C]/20 flex items-center justify-center font-bold text-xs text-[#BAB86C] bg-[#BAB86C]/5">
              GEI
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-white tracking-tight">{geiSimple}</span>
            <span className="text-muted-foreground text-sm">/100</span>
          </div>
          <div className="w-full bg-slate-950/60 rounded-full h-1.5 overflow-hidden border border-white/5">
            <div className="bg-[#BAB86C] h-full rounded-full" style={{ width: `${geiSimple}%` }} />
          </div>
        </div>

        {/* GAI Accountability Card */}
        <div className="card-premium p-6 border border-white/5 bg-[#060D17] rounded-2xl flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black block mb-1">GAI™ Accountability</span>
              <h4 className="text-xs font-bold text-primary">Decisões com Responsável</h4>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center font-bold text-xs text-primary bg-primary">
              GAI
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-white tracking-tight">{gai}</span>
            <span className="text-muted-foreground text-sm">/100</span>
          </div>
          <div className="w-full bg-slate-950/60 rounded-full h-1.5 overflow-hidden border border-white/5">
            <div className="bg-insight h-full rounded-full" style={{ width: `${gai}%` }} />
          </div>
        </div>

        {/* Overdue Rate / Aging Card */}
        <div className="card-premium p-6 border border-white/5 bg-[#060D17] rounded-2xl flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black block mb-1">Atrasos & Pendências</span>
              <h4 className="text-xs font-bold text-primary">Taxa de Atraso e Aging</h4>
            </div>
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-xs bg-critical-soft0/5 ${overdueRate > 0 ? 'border-rose-500/30 text-rose-400 animate-pulse' : 'border-border text-muted-foreground'}`}>
              ⚠️
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-white tracking-tight">{overdueRate}%</span>
            <span className="text-muted-foreground text-xs uppercase font-bold">Overdue Rate</span>
          </div>
          <div className="text-[10px] text-muted-foreground flex justify-between gap-1 pt-1 border-t border-white/5">
            <span>0-30d: <strong>{aging.bucket30}</strong></span>
            <span>31-90d: <strong>{aging.bucket90}</strong></span>
            <span>91-180d: <strong>{aging.bucket180}</strong></span>
            <span>180d+: <strong>{aging.bucket180Plus}</strong></span>
          </div>
        </div>

      </div>

      {/* 2. Actions & Register List Header */}
      <div className="flex justify-between items-center bg-slate-950/20 p-4 border border-white/5 rounded-2xl">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary">Decisões e Planos de Ação Governados</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Cada registro vincula resoluções do conselho a origens cognitivas e pesos de risco específicos.
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-[#FF8552] hover:bg-[#FF8552]/90 rounded-xl text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-all"
        >
          <Plus size={14} />
          Nova Decisão
        </button>
      </div>

      {/* 3. New Decision Form Inline Card */}
      {isFormOpen && (
        <form onSubmit={handleCreateDecision} className="card-premium p-6 border border-[#FF8552]/20 bg-[#060D17] rounded-2xl space-y-6 animate-fadeIn">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF8552] flex items-center gap-2">
            <Bookmark size={14} />
            Cadastrar Nova Decisão Executiva (GDTL™)
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Título da Decisão *</label>
              <input 
                type="text" 
                required
                value={newTitle} 
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ex: Atualizar Regimento Interno de Alçadas"
                className="w-full bg-slate-950/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-muted-foreground outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Responsável (Owner)</label>
              <input 
                type="text" 
                value={newAssignedTo} 
                onChange={(e) => setNewAssignedTo(e.target.value)}
                placeholder="Ex: Carlos Santos (CFO)"
                className="w-full bg-slate-950/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-muted-foreground outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Descrição Detalhada</label>
              <textarea 
                value={newDescription} 
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Explicitar o objeto da resolução e diretrizes de execução..."
                rows={2}
                className="w-full bg-slate-950/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-muted-foreground outline-none focus:border-primary resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Tipo de Decisão</label>
              <select
                value={newDecisionType}
                onChange={(e: any) => setNewDecisionType(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-muted-foreground outline-none"
              >
                <option value="BOARD_RESOLUTION">BOARD_RESOLUTION (Resolução)</option>
                <option value="MANAGEMENT_ACTION">MANAGEMENT_ACTION (Gestão)</option>
                <option value="CORRECTIVE_ACTION">CORRECTIVE_ACTION (Corretiva)</option>
                <option value="STRATEGIC_INITIATIVE">STRATEGIC_INITIATIVE (Estratégica)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Origem Cognitiva</label>
              <select
                value={newOrigin}
                onChange={(e: any) => setNewOrigin(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-muted-foreground outline-none"
              >
                <option value="BOARD">BOARD (Conselho)</option>
                <option value="ESGIM">ESGIM (Maturidade)</option>
                <option value="IRI">IRI (Resiliência)</option>
                <option value="BPE">BPE (Priorização)</option>
                <option value="GRE">GRE (Roadmap)</option>
                <option value="GML">GML (Monitoramento)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Risco de Execução (Peso)</label>
              <select
                value={newRisk}
                onChange={(e: any) => setNewRisk(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-muted-foreground outline-none"
              >
                <option value="LOW">LOW (Baixo)</option>
                <option value="MODERATE">MODERATE (Médio)</option>
                <option value="HIGH">HIGH (Alto)</option>
                <option value="CRITICAL">CRITICAL (Crítico)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Categoria da Decisão</label>
              <select
                value={newCategory}
                onChange={(e: any) => setNewCategory(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-muted-foreground outline-none"
              >
                <option value="GOVERNANCE">GOVERNANCE</option>
                <option value="FIDUCIARY">FIDUCIARY</option>
                <option value="MISSION">MISSION</option>
                <option value="INSTITUTIONAL">INSTITUTIONAL</option>
                <option value="STRATEGIC">STRATEGIC</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Prazo de Conclusão</label>
              <input 
                type="date" 
                value={newDueDate} 
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-muted-foreground outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Benefício Esperado</label>
              <input 
                type="text" 
                value={newBenefit} 
                onChange={(e) => setNewBenefit(e.target.value)}
                placeholder="Ex: Reduzir exposição a fraudes fiduciárias"
                className="w-full bg-slate-950/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-muted-foreground outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-muted-foreground hover:text-muted-foreground rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-accent hover:bg-accent text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
            >
              Salvar Resolução
            </button>
          </div>
        </form>
      )}

      {/* 4. Decisions Registry Grid / List Cards */}
      <div className="space-y-4">
        {decisions.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground bg-slate-950/10 border border-white/5 rounded-2xl">
            Nenhuma decisão governada registrada neste cenário.
          </div>
        ) : (
          decisions.map((dec) => (
            <div 
              key={dec.id} 
              className={`p-6 border rounded-2xl bg-[#060D17] hover:bg-slate-950/30 transition-all space-y-4 ${
                dec.status === 'COMPLETED' ? 'border-emerald-500/10' : 
                dec.status === 'OVERDUE' ? 'border-rose-500/20 bg-rose-950/5' : 
                'border-white/5'
              }`}
            >
              {/* Decision Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] font-mono text-muted-foreground">{dec.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${getStatusBadge(dec.status)}`}>
                      {dec.status}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${getRiskBadge(dec.executionRisk)}`}>
                      Risco: {dec.executionRisk}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-[#BAB86C]/10 border border-[#BAB86C]/20 text-[#BAB86C]">
                      {dec.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-primary">{dec.title}</h4>
                </div>

                {/* Status Switcher & Board Approval Actions */}
                <div className="flex items-center gap-3">
                  {/* Board Approval Badge or Button */}
                  {dec.approvedByBoard ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-success-soft0/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-[9px] font-black uppercase tracking-widest">
                      <CheckCircle2 size={10} />
                      Ata Board: OK
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApproveBoard(dec.id)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-[#BAB86C]/10 hover:bg-[#BAB86C]/20 border border-[#BAB86C]/30 text-[#BAB86C] rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                    >
                      <UserCheck size={10} />
                      Aprovar Board
                    </button>
                  )}

                  {/* Status Dropdown */}
                  <div className="relative">
                    <select
                      value={dec.status}
                      onChange={(e) => handleStatusChange(dec.id, e.target.value)}
                      className="bg-slate-950 border border-white/10 text-muted-foreground rounded-lg px-2.5 py-1 text-[10px] font-bold outline-none cursor-pointer hover:border-white/20"
                    >
                      <option value="OPEN">OPEN (Aberto)</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="OVERDUE">OVERDUE (Atrasado)</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Decision Description and Meta Info */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs text-muted-foreground leading-relaxed">
                <div className="lg:col-span-8 space-y-3">
                  <p>{dec.description}</p>
                  
                  {/* Expected Benefit */}
                  <div className="p-3 bg-slate-950/40 border border-white/5 rounded-xl text-[11px]">
                    <strong className="text-muted-foreground block mb-0.5">Benefício Institucional Esperado:</strong>
                    {dec.expectedBenefit}
                  </div>

                  {/* Evidence Trails */}
                  {dec.evidence && dec.evidence.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block">Linhas de Evidência Auditáveis</span>
                      <ul className="list-disc pl-4 text-[10px] text-muted-foreground space-y-0.5">
                        {dec.evidence.map((ev, idx) => (
                          <li key={idx}>{ev}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Metadata Sidebar details */}
                <div className="lg:col-span-4 p-4 bg-slate-950/60 rounded-xl space-y-2.5 border border-white/5 text-[10px]">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-muted-foreground">Tipo de Decisão:</span>
                    <span className="font-bold text-muted-foreground">{getTypeLabel(dec.decisionType)}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-muted-foreground">Origem Cognitiva:</span>
                    <span className="font-bold text-[#BAB86C]">{dec.originEngine} Engine</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-muted-foreground">Responsável:</span>
                    <span className="font-bold text-muted-foreground flex items-center gap-1">
                      <User size={10} />
                      {dec.assignedTo || 'Não atribuído'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-muted-foreground">Prazo Acordado:</span>
                    <span className={`font-bold flex items-center gap-1 ${dec.status === 'OVERDUE' ? 'text-rose-400' : 'text-muted-foreground'}`}>
                      <Calendar size={10} />
                      {dec.dueDate ? new Date(dec.dueDate).toLocaleDateString('pt-BR') : 'Sem prazo'}
                    </span>
                  </div>
                  {dec.approvedAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Aprovado At:</span>
                      <span className="text-muted-foreground font-mono">{new Date(dec.approvedAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  )}
                  {dec.relatedDecisionIds && dec.relatedDecisionIds.length > 0 && (
                    <div className="border-t border-white/5 pt-2 mt-1">
                      <span className="text-muted-foreground block mb-1">Dependências Associadas:</span>
                      <div className="flex flex-wrap gap-1">
                        {dec.relatedDecisionIds.map(depId => (
                          <span key={depId} className="px-1.5 py-0.5 bg-slate-900 border border-white/5 text-[8px] font-mono text-muted-foreground rounded">
                            {depId}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Hash and fiduciarity footprint */}
              <div className="flex justify-between items-center text-[8px] font-mono text-muted-foreground border-t border-white/5 pt-2.5">
                <span>Lineage Hash: {dec.lineageHash}</span>
                <span>Fiduciary Certified Log</span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
