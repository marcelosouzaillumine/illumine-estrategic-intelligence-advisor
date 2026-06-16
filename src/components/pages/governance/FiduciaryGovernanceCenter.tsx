import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserX, Network, FileWarning, AlertTriangle, Scale, BookOpen, Clock } from 'lucide-react';
import { PageHeader } from '../../Common';
import { useExecutiveCognitive } from '../../../context/executive-cognitive/ExecutiveCognitiveProvider';
import { InstitutionalPrioritySurface, CriticalDecisionSurface, ExecutivePriorityStack } from '../../executive-cognitive';
import { useInstitutionalMemory } from '../../../context/institutional-memory/InstitutionalMemoryProvider';
import { GovernanceHistoryExplorer, GovernanceRecurrencePanel, AdvisoryContinuitySurface, MemoryIntegrityBadge } from '../../institutional-memory';

export function FiduciaryGovernanceCenter() {
  const [activeTab, setActiveTab] = useState<'conflitos' | 'relacionadas' | 'decisoes' | 'memoria'>('conflitos');
  const { setSignals } = useExecutiveCognitive();

  useEffect(() => {
    // Populate active cognitive context for the page fiduciarily
    setSignals([
      {
        id: 'fid-1',
        sourceModule: 'Fiduciary',
        title: 'Declaração de Conflito Pendente',
        description: 'João Silva (CFO) possui impedimento societário registrado sob a pauta atual.',
        timestamp: new Date().toISOString(),
        rawSeverity: 'WARNING',
        fiduciaryEscalation: true
      },
      {
        id: 'fid-2',
        sourceModule: 'Fiduciary',
        title: 'Impedimento Estatutário de Fornecedor',
        description: 'Contratação de consultoria externa TechCorp bloqueada devido ao conflito de interesses com o aprovisionador.',
        timestamp: new Date().toISOString(),
        rawSeverity: 'CRITICAL',
        fiduciaryEscalation: true,
        lineageHash: 'LIN-100234-Y'
      }
    ]);
    return () => {
      setSignals([]);
    };
  }, [setSignals]);

  return (
    <InstitutionalPrioritySurface 
      title="Governança Fiduciária"
      subtitle="Gestão de conflitos de interesse, partes relacionadas e integridade de aprovações."
    >
      {/* Critical Decision Focus and Attention Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CriticalDecisionSurface />
        </div>
        <div className="lg:col-span-1">
          <ExecutivePriorityStack />
        </div>
      </div>

      {/* Cards Executivos (KRI Summary) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatusCard 
          title="Conflitos Declarados" 
          value="3" 
          icon={<FileWarning className="w-5 h-5 text-amber-500" />} 
          trend="Período Vigente"
        />
        <StatusCard 
          title="Partes Relacionadas" 
          value="12" 
          icon={<Network className="w-5 h-5 text-primary" />} 
          trend="Monitoradas"
        />
        <StatusCard 
          title="Decisões Bloqueadas" 
          value="1" 
          icon={<UserX className="w-5 h-5 text-red-500" />} 
          trend="Nos últimos 30 dias"
        />
        <StatusCard 
          title="Pendências de Disclosure" 
          value="2" 
          icon={<Clock className="w-5 h-5 text-muted-foreground" />} 
          trend="Diretores com atraso"
        />
      </div>

      {/* Abas */}
      <div className="flex gap-4 border-b border-border/10 pb-px overflow-x-auto no-scrollbar">
        <TabButton active={activeTab === 'conflitos'} onClick={() => setActiveTab('conflitos')} icon={<FileWarning className="w-4 h-4"/>} label="Conflitos de Interesse" />
        <TabButton active={activeTab === 'relacionadas'} onClick={() => setActiveTab('relacionadas')} icon={<Network className="w-4 h-4"/>} label="Partes Relacionadas" />
        <TabButton active={activeTab === 'decisoes'} onClick={() => setActiveTab('decisoes')} icon={<ShieldCheck className="w-4 h-4"/>} label="Gateway de Decisões" />
        <TabButton active={activeTab === 'memoria'} onClick={() => setActiveTab('memoria')} icon={<Clock className="w-4 h-4"/>} label="Memória Fiduciária" />
      </div>

      {/* Conteúdo das Abas (Mock UI integrado com conceitos fiduciários) */}
      
      {activeTab === 'conflitos' && (
        <div className="card-premium p-8 animate-in fade-in duration-300">
          <h2 className="text-lg font-medium text-muted-foreground mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-muted-foreground" />
            Declarações e Impedimentos
          </h2>
          <div className="space-y-4">
            <ConflictItem 
              director="João Silva" 
              role="CFO" 
              type="Atuação em Concorrente" 
              severity="Alta" 
              status="Conflito Declarado"
            />
            <ConflictItem 
              director="Maria Costa" 
              role="Conselheira Independente" 
              type="Vínculo Familiar" 
              severity="Média" 
              status="Declarado sem Conflito"
            />
          </div>
        </div>
      )}

      {activeTab === 'relacionadas' && (
        <div className="card-premium p-8 animate-in fade-in duration-300">
          <h2 className="text-lg font-medium text-muted-foreground mb-6 flex items-center gap-2">
            <Network className="w-5 h-5 text-muted-foreground" />
            Transações Sensíveis e Vínculos
          </h2>
          <div className="text-center py-12 text-muted-foreground">
            <Network className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-xs font-bold uppercase tracking-wider">Monitoramento ativo. Nenhuma transação material detectada com partes relacionadas nos últimos 30 dias.</p>
          </div>
        </div>
      )}

      {activeTab === 'decisoes' && (
        <div className="card-premium p-8 animate-in fade-in duration-300">
          <h2 className="text-lg font-medium text-muted-foreground mb-6 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-muted-foreground" />
            Validação Fiduciária de Pautas
          </h2>
          <div className="space-y-4">
            <DecisionItem 
              title="Aprovação de Orçamento Anual de Marketing" 
              status="Liberada com Ressalva" 
              reason="Aviso: Recomendada abstenção voluntária devido a vínculo societário menor."
              hash="LIN-902342-X"
            />
            <DecisionItem 
              title="Contratação de Consultoria Externa (TechCorp)" 
              status="Bloqueada" 
              reason="Impedimento Estatutário: Aprovador é acionista majoritário da fornecedora."
              hash="LIN-100234-Y"
            />
          </div>
        </div>
      )}

      {activeTab === 'memoria' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="flex justify-between items-center bg-slate-950/20 p-4 rounded-xl border border-border/10">
            <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold flex items-center gap-2">
              Status da Linhagem Histórica:
              <MemoryIntegrityBadge />
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <GovernanceRecurrencePanel />
            <AdvisoryContinuitySurface />
          </div>
          <GovernanceHistoryExplorer />
        </div>
      )}

    </InstitutionalPrioritySurface>
  );
}

function StatusCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: string }) {
  return (
    <div className="card-premium p-6 flex flex-col justify-between hover:border-border transition-all">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</h3>
        <div className="p-2 bg-slate-950/40 rounded-xl border border-border/10">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-2xl font-light text-muted-foreground">{value}</div>
        <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-bold">{trend}</div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
        active 
          ? 'text-primary border-primary bg-primary' 
          : 'text-muted-foreground border-transparent hover:text-muted-foreground hover:bg-slate-900/40'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function ConflictItem({ director, role, type, severity, status }: any) {
  return (
    <div className="p-4 bg-slate-950/40 border border-border/10 rounded-xl flex justify-between items-center">
      <div>
        <div className="flex items-center gap-3">
          <h3 className="text-muted-foreground font-medium text-sm">{director}</h3>
          <span className="text-xs text-muted-foreground px-2.5 py-1 bg-slate-900 border border-border/5 rounded-xl font-medium">{role}</span>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <p className="text-xs text-muted-foreground">{type}</p>
          <span className={`text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-xl ${severity === 'Alta' ? 'text-amber-400 bg-warning-soft0/10 border border-amber-500/20' : 'text-muted-foreground bg-slate-800 border border-border'}`}>
            Severidade {severity}
          </span>
        </div>
      </div>
      <div className="text-right">
        <span className="text-xs font-semibold text-muted-foreground">{status}</span>
      </div>
    </div>
  );
}

function DecisionItem({ title, status, reason, hash }: any) {
  const isBlocked = status === 'Bloqueada';
  return (
    <div className={`p-5 bg-slate-950/40 border rounded-xl ${isBlocked ? 'border-red-500/20' : 'border-border/10'}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-muted-foreground font-medium text-sm md:text-base">{title}</h3>
        <span className={`px-3 py-1 text-[10px] uppercase font-black tracking-widest rounded-xl border ${isBlocked ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-warning-soft0/10 text-amber-400 border-amber-500/20'}`}>
          {status}
        </span>
      </div>
      <p className={`text-xs mt-3 flex items-center gap-1.5 ${isBlocked ? 'text-red-455' : 'text-amber-450'}`}>
        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
        {reason}
      </p>
      <div className="mt-4 pt-4 border-t border-border/10 flex justify-end">
        <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          Audit Hash: {hash}
        </span>
      </div>
    </div>
  );
}
