import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  FileText, 
  Leaf, 
  Scale, 
  Lock, 
  AlertOctagon, 
  TrendingDown, 
  TrendingUp, 
  Minus,
  CheckCircle2
} from 'lucide-react';

export function ComplianceIntegrityCenter() {
  const [activeTab, setActiveTab] = useState<'integridade' | 'denuncias' | 'politicas' | 'esg'>('integridade');

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex justify-between items-end border-b border-slate-800 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-light text-slate-100 tracking-tight flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-indigo-500" />
            Integridade & Compliance
          </h1>
          <p className="text-slate-400 mt-2">
            Governança ética, monitoramento de conduta, canal de relatos e indicadores ESG.
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Score de Integridade</div>
          <div className="text-4xl font-light text-indigo-400 flex items-center justify-end gap-2">
            85<span className="text-xl text-slate-600">/100</span>
          </div>
        </div>
      </div>

      {/* Cards Executivos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatusCard 
          title="Denúncias Abertas" 
          value="2" 
          icon={<AlertOctagon className="w-5 h-5 text-amber-500" />} 
          trend="1 Crítica, 1 Moderada"
        />
        <StatusCard 
          title="Gaps de Compliance" 
          value="14" 
          icon={<FileText className="w-5 h-5 text-red-400" />} 
          trend="Colaboradores pendentes"
        />
        <StatusCard 
          title="Sanções Ativas" 
          value="0" 
          icon={<Scale className="w-5 h-5 text-slate-400" />} 
          trend="Últimos 12 meses"
        />
        <StatusCard 
          title="Alinhamento ESG" 
          value="92%" 
          icon={<Leaf className="w-5 h-5 text-emerald-500" />} 
          trend="Crescimento de 5%"
        />
      </div>

      {/* Abas */}
      <div className="flex gap-4 border-b border-slate-800 pb-px mt-8">
        <TabButton active={activeTab === 'integridade'} onClick={() => setActiveTab('integridade')} icon={<Activity className="w-4 h-4"/>} label="Visão Geral" />
        <TabButton active={activeTab === 'denuncias'} onClick={() => setActiveTab('denuncias')} icon={<Lock className="w-4 h-4"/>} label="Canal de Relatos" />
        <TabButton active={activeTab === 'politicas'} onClick={() => setActiveTab('politicas')} icon={<FileText className="w-4 h-4"/>} label="Políticas & Conduta" />
        <TabButton active={activeTab === 'esg'} onClick={() => setActiveTab('esg')} icon={<Leaf className="w-4 h-4"/>} label="Governança ESG" />
      </div>

      {/* Conteúdo das Abas */}
      
      {activeTab === 'integridade' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-medium text-slate-200 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-slate-400" />
              Tendências Institucionais
            </h2>
            <div className="space-y-4">
              <TrendItem label="Aderência ao Código de Conduta" value="Deteriorando" type="negative" />
              <TrendItem label="Resolução de Conflitos Éticos" value="Estável" type="neutral" />
              <TrendItem label="Métricas de Diversidade (ESG)" value="Melhorando" type="positive" />
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-medium text-slate-200 mb-6 flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-slate-400" />
              Riscos Éticos Iminentes
            </h2>
            <div className="space-y-4">
              <RiskItem title="Atraso na renovação da Política Anticorrupção" severity="Alta" />
              <RiskItem title="Aumento de denúncias de assédio no setor logístico" severity="Crítica" />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'denuncias' && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-slate-200 flex items-center gap-2">
              <Lock className="w-5 h-5 text-slate-400" />
              Protocolos de Investigação
            </h2>
            <span className="text-xs text-indigo-400 flex items-center gap-1 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">
              <Lock className="w-3 h-3" /> Identidade Blindada
            </span>
          </div>
          <div className="space-y-4">
            <ReportItem 
              protocol="WB-202309-001" 
              category="Fraude Financeira" 
              severity="Crítica" 
              status="Investigação Ativa"
              date="Há 5 dias"
            />
            <ReportItem 
              protocol="WB-202309-002" 
              category="Conflito Ético" 
              severity="Média" 
              status="Em Triagem"
              date="Há 12 dias"
            />
          </div>
        </div>
      )}

      {activeTab === 'politicas' && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-medium text-slate-200 mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-400" />
            Controle de Aceite Digital
          </h2>
          <div className="space-y-4">
            <PolicyItem title="Código de Ética e Conduta" compliance="95%" status="Vigente" />
            <PolicyItem title="Política Anticorrupção" compliance="78%" status="Atenção" />
            <PolicyItem title="Política de Segurança da Informação" compliance="99%" status="Vigente" />
          </div>
        </div>
      )}

      {activeTab === 'esg' && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-medium text-slate-200 mb-6 flex items-center gap-2">
            <Leaf className="w-5 h-5 text-slate-400" />
            Score ESG Desdobrado
          </h2>
          <div className="grid grid-cols-3 gap-6">
            <ESGPillarCard title="Ambiental (E)" score={88} />
            <ESGPillarCard title="Social (S)" score={94} />
            <ESGPillarCard title="Governança (G)" score={95} />
          </div>
        </div>
      )}

    </div>
  );
}

function StatusCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: string }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:bg-slate-800/50 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-slate-400">{title}</h3>
        <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-3xl font-light text-slate-100">{value}</div>
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

function TrendItem({ label, value, type }: { label: string, value: string, type: 'positive' | 'negative' | 'neutral' }) {
  const Icon = type === 'positive' ? TrendingUp : type === 'negative' ? TrendingDown : Minus;
  const color = type === 'positive' ? 'text-emerald-400' : type === 'negative' ? 'text-red-400' : 'text-slate-400';
  
  return (
    <div className="flex justify-between items-center p-3 border-b border-slate-800/50 last:border-0">
      <span className="text-sm text-slate-300">{label}</span>
      <span className={`text-sm flex items-center gap-1 ${color}`}>
        {value} <Icon className="w-4 h-4" />
      </span>
    </div>
  );
}

function RiskItem({ title, severity }: { title: string, severity: string }) {
  const isCritical = severity === 'Crítica';
  return (
    <div className={`p-4 rounded-lg border ${isCritical ? 'bg-red-500/5 border-red-500/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
      <div className="flex justify-between items-center">
        <span className={`text-sm font-medium ${isCritical ? 'text-red-300' : 'text-amber-300'}`}>{title}</span>
        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${isCritical ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
          {severity}
        </span>
      </div>
    </div>
  );
}

function ReportItem({ protocol, category, severity, status, date }: any) {
  const isCritical = severity === 'Crítica';
  return (
    <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg flex justify-between items-center hover:border-slate-700 transition-colors">
      <div>
        <div className="flex items-center gap-3">
          <h3 className="text-slate-200 font-mono text-sm">{protocol}</h3>
          <span className="text-xs text-slate-500 px-2 py-0.5 bg-slate-800 rounded">{date}</span>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <p className="text-xs text-slate-400">{category}</p>
          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${isCritical ? 'text-red-400 bg-red-500/10 border border-red-500/20' : 'text-amber-400 bg-amber-500/10 border border-amber-500/20'}`}>
            Severidade {severity}
          </span>
        </div>
      </div>
      <div className="text-right">
        <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">{status}</span>
      </div>
    </div>
  );
}

function PolicyItem({ title, compliance, status }: { title: string, compliance: string, status: string }) {
  const isAttention = status === 'Atenção';
  return (
    <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg flex justify-between items-center">
      <div className="flex items-center gap-3">
        {isAttention ? <AlertOctagon className="w-5 h-5 text-amber-500" /> : <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
        <span className="text-slate-200 text-sm font-medium">{title}</span>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Aderência</div>
          <div className={`text-sm font-medium ${isAttention ? 'text-amber-400' : 'text-emerald-400'}`}>{compliance}</div>
        </div>
      </div>
    </div>
  );
}

function ESGPillarCard({ title, score }: { title: string, score: number }) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 text-center">
      <h3 className="text-sm font-medium text-slate-400 mb-4">{title}</h3>
      <div className="text-4xl font-light text-emerald-400">{score}</div>
      <div className="text-xs text-slate-500 mt-2">Score de 0 a 100</div>
    </div>
  );
}
