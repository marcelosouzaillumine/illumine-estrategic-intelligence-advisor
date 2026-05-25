import React, { useState } from 'react';
import { ShieldCheck, UserX, Network, FileWarning, AlertTriangle, Scale, BookOpen, Clock } from 'lucide-react';

export function FiduciaryGovernanceCenter() {
  const [activeTab, setActiveTab] = useState<'conflitos' | 'relacionadas' | 'decisoes'>('conflitos');

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex justify-between items-end border-b border-slate-800 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-light text-slate-100 tracking-tight flex items-center gap-3">
            <Scale className="w-8 h-8 text-indigo-500" />
            Governança Fiduciária
          </h1>
          <p className="text-slate-400 mt-2">
            Gestão de conflitos de interesse, partes relacionadas e integridade de aprovações.
          </p>
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
          icon={<Network className="w-5 h-5 text-indigo-500" />} 
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
          icon={<Clock className="w-5 h-5 text-slate-400" />} 
          trend="Diretores com atraso"
        />
      </div>

      {/* Abas */}
      <div className="flex gap-4 border-b border-slate-800 pb-px">
        <TabButton active={activeTab === 'conflitos'} onClick={() => setActiveTab('conflitos')} icon={<FileWarning className="w-4 h-4"/>} label="Conflitos de Interesse" />
        <TabButton active={activeTab === 'relacionadas'} onClick={() => setActiveTab('relacionadas')} icon={<Network className="w-4 h-4"/>} label="Partes Relacionadas" />
        <TabButton active={activeTab === 'decisoes'} onClick={() => setActiveTab('decisoes')} icon={<ShieldCheck className="w-4 h-4"/>} label="Gateway de Decisões" />
      </div>

      {/* Conteúdo das Abas (Mock UI integrado com conceitos fiduciários) */}
      
      {activeTab === 'conflitos' && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-medium text-slate-200 mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-slate-400" />
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
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-medium text-slate-200 mb-6 flex items-center gap-2">
            <Network className="w-5 h-5 text-slate-400" />
            Transações Sensíveis e Vínculos
          </h2>
          <div className="text-center py-10 text-slate-500">
            <Network className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p>Monitoramento ativo. Nenhuma transação material detectada com partes relacionadas nos últimos 30 dias.</p>
          </div>
        </div>
      )}

      {activeTab === 'decisoes' && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-medium text-slate-200 mb-6 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-slate-400" />
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

    </div>
  );
}

function StatusCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: string }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-slate-400">{title}</h3>
        <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-2xl font-light text-slate-100">{value}</div>
        <div className="text-xs text-slate-500 mt-1 tracking-wider">{trend}</div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${active ? 'text-indigo-400 border-indigo-500 bg-slate-800/30' : 'text-slate-400 border-transparent hover:text-slate-300 hover:bg-slate-800/20'}`}
    >
      {icon}
      {label}
    </button>
  );
}

function ConflictItem({ director, role, type, severity, status }: any) {
  return (
    <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg flex justify-between items-center">
      <div>
        <div className="flex items-center gap-3">
          <h3 className="text-slate-200 font-medium text-sm">{director}</h3>
          <span className="text-xs text-slate-500 px-2 py-0.5 bg-slate-800 rounded">{role}</span>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <p className="text-xs text-slate-400">{type}</p>
          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${severity === 'Alta' ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20' : 'text-slate-400 bg-slate-800 border border-slate-700'}`}>
            Severidade {severity}
          </span>
        </div>
      </div>
      <div className="text-right">
        <span className="text-xs font-semibold text-slate-400">{status}</span>
      </div>
    </div>
  );
}

function DecisionItem({ title, status, reason, hash }: any) {
  const isBlocked = status === 'Bloqueada';
  return (
    <div className={`p-4 bg-slate-950 border rounded-lg ${isBlocked ? 'border-red-500/20' : 'border-slate-800'}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-slate-200 font-medium text-sm">{title}</h3>
        <span className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full border ${isBlocked ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
          {status}
        </span>
      </div>
      <p className={`text-xs mt-2 ${isBlocked ? 'text-red-400' : 'text-amber-400'}`}>
        <AlertTriangle className="w-3 h-3 inline mr-1 -mt-0.5" />
        {reason}
      </p>
      <div className="mt-3 pt-3 border-t border-slate-800/50 flex justify-end">
        <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          Audit Hash: {hash}
        </span>
      </div>
    </div>
  );
}
