import React from 'react';
import { ShieldAlert, Activity, FileText, Leaf, Scale, Lock, AlertOctagon, TrendingDown, TrendingUp, Minus, CheckCircle2 } from 'lucide-react';
import { ExecutiveText } from '@/components/ui/executive-typography';
import { ExecutiveHeading } from '@/components/ui/executive-heading';
import { ExecutivePageTemplate } from '@/components/ui/executive-page-template';
import { ExecutiveSurface } from '@/components/ui/executive-surface';
import { ExecutiveMetricCard } from '@/components/ui/executive-metric-card';
import { ExecutiveBadge } from '@/components/ui/executive-badge';
import { useComplianceIntegrityViewModel } from '@/viewmodels/governance/useComplianceIntegrityViewModel';
import { ExecutiveSummarySection } from '@/components/ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '@/components/ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '@/components/ui/executive-decision-trace';

export function ComplianceIntegrityCenter() {
  const { state, actions } = useComplianceIntegrityViewModel();
  const { activeTab } = state;
  const { setActiveTab } = actions;

  return (
    <ExecutivePageTemplate header={{ title: "Governança Ética & Integridade Corporativa", description: "Monitoramento de conduta, canal de relatos fiduciários e indicadores ESG.", icon: ShieldAlert }}>

      {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE COMPLIANCE E INTEGRIDADE) --- */}
      <ExecutiveSummarySection 
        className="mb-8"
        status={{ label: 'Integridade Monitorada', variant: 'success' }}
        question="Qual a aderência ao Código de Conduta, canal de denúncias e métricas ESG?"
        opinion="O comitê fiduciário homologa a esteira de compliance e integridade corporativa."
        driver="Canal de relatos, código de conduta, políticas anticorrupção e indicadores ESG."
        implication="Preservação da reputação institucional e imunização contra riscos de conformidade."
        action="Tratar imediatamente as denúncias abertas e mitigar os gaps de compliance."
      >
        <ExecutiveStrategicTensions tensions={[]} />
        <ExecutiveDecisionTrace trace={[]} />
      </ExecutiveSummarySection>

      {/* Cards Executivos (KRI Summary Canônico EVC) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ExecutiveMetricCard 
          label="Denúncias Abertas" 
          value="2" 
          description="1 Crítica, 1 Moderada"
          icon={AlertOctagon}
          tone="warning"
        />
        <ExecutiveMetricCard 
          label="Gaps de Compliance" 
          value="14" 
          description="Colaboradores pendentes"
          icon={FileText}
          tone="critical"
        />
        <ExecutiveMetricCard 
          label="Sanções Ativas" 
          value="0" 
          description="Últimos 12 meses"
          icon={Scale}
          tone="neutral"
        />
        <ExecutiveMetricCard 
          label="Alinhamento ESG" 
          value="92%" 
          description="Crescimento de 5%"
          icon={Leaf}
          tone="success"
        />
      </div>

      {/* Abas */}
      <div className="flex gap-4 border-b border-border/40 pb-px mt-8 overflow-x-auto no-scrollbar">
        <TabButton active={activeTab === 'integridade'} onClick={() => setActiveTab('integridade')} icon={<Activity className="w-4 h-4"/>} label="Visão Geral" />
        <TabButton active={activeTab === 'denuncias'} onClick={() => setActiveTab('denuncias')} icon={<Lock className="w-4 h-4"/>} label="Canal de Relatos" />
        <TabButton active={activeTab === 'politicas'} onClick={() => setActiveTab('politicas')} icon={<FileText className="w-4 h-4"/>} label="Políticas & Conduta" />
        <TabButton active={activeTab === 'esg'} onClick={() => setActiveTab('esg')} icon={<Leaf className="w-4 h-4"/>} label="Governança ESG" />
      </div>

      {/* Conteúdo das Abas */}
      
      {activeTab === 'integridade' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300 mt-6">
          <ExecutiveSurface variant="default" padding="lg">
            <ExecutiveHeading as="h2" className="text-foreground mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Tendências Institucionais
            </ExecutiveHeading>
            <div className="space-y-4">
              <TrendItem label="Aderência ao Código de Conduta" value="Deteriorando" type="negative" />
              <TrendItem label="Resolução de Conflitos Éticos" value="Estável" type="neutral" />
              <TrendItem label="Métricas de Diversidade (ESG)" value="Melhorando" type="positive" />
            </div>
          </ExecutiveSurface>

          <ExecutiveSurface variant="default" padding="lg">
            <ExecutiveHeading as="h2" className="text-foreground mb-6 flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-amber-500" />
              Riscos Éticos Iminentes
            </ExecutiveHeading>
            <div className="space-y-4">
              <RiskItem title="Atraso na renovação da Política Anticorrupção" severity="Alta" />
              <RiskItem title="Aumento de denúncias de assédio no setor logístico" severity="Crítica" />
            </div>
          </ExecutiveSurface>
        </div>
      )}

      {activeTab === 'denuncias' && (
        <ExecutiveSurface variant="default" padding="lg" className="animate-in fade-in duration-300 mt-6 space-y-4">
          <ExecutiveHeading as="h2" className="text-foreground mb-4">Relatos Registrados (Canal Confidencial)</ExecutiveHeading>
          <ReportItem protocol="REL-2026-089" category="Fraude Financeira" severity="Crítica" status="Em Investigação" date="Há 2 dias" />
          <ReportItem protocol="REL-2026-074" category="Conflito de Interesses" severity="Moderada" status="Triagem" date="Há 5 dias" />
        </ExecutiveSurface>
      )}

      {activeTab === 'politicas' && (
        <ExecutiveSurface variant="default" padding="lg" className="animate-in fade-in duration-300 mt-6 space-y-4">
          <ExecutiveHeading as="h2" className="text-foreground mb-4">Aderência às Políticas Institucionais</ExecutiveHeading>
          <PolicyItem title="Código de Conduta Ética" compliance="94%" status="Ok" />
          <PolicyItem title="Política de Segurança da Informação" compliance="78%" status="Atenção" />
          <PolicyItem title="Diretriz Anticorrupção & Bribery" compliance="99%" status="Ok" />
        </ExecutiveSurface>
      )}

      {activeTab === 'esg' && (
        <ExecutiveSurface variant="default" padding="lg" className="animate-in fade-in duration-300 mt-6 space-y-6">
          <ExecutiveHeading as="h2" className="text-foreground">Métricas de Governança ESG</ExecutiveHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ESGPillarCard title="Environmental (Ambiental)" score={88} />
            <ESGPillarCard title="Social (Pessoas & Comunidade)" score={94} />
            <ESGPillarCard title="Governance (Governança)" score={95} />
          </div>
        </ExecutiveSurface>
      )}

    </ExecutivePageTemplate>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
        active 
          ? 'text-primary border-primary/30 bg-primary/10 shadow-sm' 
          : 'text-slate-700 dark:text-slate-300 border-transparent hover:text-foreground hover:bg-muted/10'
      }`}
    >
      {React.isValidElement(icon) ? icon : icon ? React.createElement(icon as any, { size: 18 }) : null}
      {label}
    </button>
  );
}

function TrendItem({ label, value, type }: { label: string, value: string, type: 'positive' | 'negative' | 'neutral' }) {
  const Icon = type === 'positive' ? TrendingUp : type === 'negative' ? TrendingDown : Minus;
  const color = type === 'positive' ? 'text-emerald-500' : type === 'negative' ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300';
  
  return (
    <div className="flex justify-between items-center p-3 border-b border-border/40 last:border-0">
      <ExecutiveText as="span" variant="bodyStandard" className="text-foreground font-medium">{label}</ExecutiveText>
      <span className={`text-sm font-bold flex items-center gap-1 ${color}`}>
        {value} <Icon className="w-4 h-4" />
      </span>
    </div>
  );
}

function RiskItem({ title, severity }: { title: string, severity: string }) {
  const isCritical = severity === 'Crítica';
  return (
    <div className={`p-4 rounded-xl border ${isCritical ? 'bg-critical/10 border-critical/30' : 'bg-warning/10 border-warning/30'}`}>
      <div className="flex justify-between items-center">
        <ExecutiveText as="span" variant="bodyStandard" className="text-foreground font-semibold">{title}</ExecutiveText>
        <ExecutiveBadge variant={isCritical ? 'critical' : 'warning'}>
          {severity}
        </ExecutiveBadge>
      </div>
    </div>
  );
}

function ReportItem({ protocol, category, severity, status, date }: any) {
  const isCritical = severity === 'Crítica';
  return (
    <div className="p-4 bg-muted/20 border border-border/40 rounded-xl flex justify-between items-center">
      <div>
        <div className="flex items-center gap-3">
          <ExecutiveHeading as="h3" className="text-foreground font-mono">{protocol}</ExecutiveHeading>
          <span className="text-xs text-slate-700 dark:text-slate-300 px-2 py-0.5 bg-card border border-border rounded-lg font-semibold">{date}</span>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <ExecutiveText as="div" variant="caption" className="text-slate-700 dark:text-slate-300 font-medium">{category}</ExecutiveText>
          <ExecutiveBadge variant={isCritical ? 'critical' : 'warning'}>
            Severidade {severity}
          </ExecutiveBadge>
        </div>
      </div>
      <div className="text-right">
        <ExecutiveBadge variant="info">{status}</ExecutiveBadge>
      </div>
    </div>
  );
}

function PolicyItem({ title, compliance, status }: { title: string, compliance: string, status: string }) {
  const isAttention = status === 'Atenção';
  return (
    <div className="p-4 bg-muted/20 border border-border/40 rounded-xl flex justify-between items-center">
      <div className="flex items-center gap-3">
        {isAttention ? <AlertOctagon className="w-5 h-5 text-amber-500" /> : <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
        <ExecutiveText as="span" variant="bodyStandard" className="text-foreground font-semibold">{title}</ExecutiveText>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <ExecutiveText as="div" variant="caption" className="text-slate-700 dark:text-slate-300 uppercase font-bold text-[10px]">Aderência</ExecutiveText>
          <div className={`text-sm font-bold ${isAttention ? 'text-amber-500' : 'text-emerald-500'}`}>{compliance}</div>
        </div>
      </div>
    </div>
  );
}

function ESGPillarCard({ title, score }: { title: string, score: number }) {
  return (
    <div className="bg-muted/20 border border-border/40 rounded-xl p-6 text-center">
      <ExecutiveHeading as="h3" className="text-foreground mb-4">{title}</ExecutiveHeading>
      <div className="text-4xl font-bold text-emerald-500">{score}</div>
      <ExecutiveText as="div" variant="caption" className="text-slate-700 dark:text-slate-300 mt-2 font-medium">Score de 0 a 100</ExecutiveText>
    </div>
  );
}
