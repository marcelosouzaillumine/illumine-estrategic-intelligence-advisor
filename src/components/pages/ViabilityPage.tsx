import React, { useState, useEffect } from 'react';
import { Plus, X, Activity, ShieldCheck, TrendingUp, TrendingDown, Settings2, Rocket } from 'lucide-react';
import { motion } from 'motion/react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import { ExecutivePageTemplate } from '@/components/ui/executive-page-template';
import { ExecutiveSurface } from '@/components/ui/executive-surface';
import { ExecutiveAccordion } from '@/components/ui/executive-accordion';
import { ExecutiveHeading } from '@/components/ui/executive-heading';
import { ExecutiveText } from '@/components/ui/executive-typography';
import { ExecutiveMetricCard } from '@/components/ui/executive-metric-card';
import { ExecutiveBadge } from '@/components/ui/executive-badge';
import { ExecutiveTechnicalLayer } from '@/components/ui/executive-technical-layer';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '@/components/ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '@/components/ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '@/components/ui/executive-decision-trace';
import { useViabilityPageViewModel } from '@/viewmodels/useViabilityPageViewModel';
import { formatCurrency, calculateVPL, calculateTIR, calculatePayback, cn } from '@/lib/utils';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function ViabilityScenario({ project }: { project: any }) {
  const [discountRate, setDiscountRate] = useState(2.0);
  const [cfMultiplier, setCfMultiplier] = useState(100);
  const [capexAdjustment, setCapexAdjustment] = useState(100);
  
  const originalFlows = project.fluxo.map((f: any) => f.valor);
  const simulatedFlows = originalFlows.map((v: number, i: number) => {
    if (i === 0) return v * (capexAdjustment / 100); 
    return v * (cfMultiplier / 100);
  });
  
  const simulatedVPL = calculateVPL(simulatedFlows, discountRate / 100);
  const simulatedTIR = calculateTIR(simulatedFlows);
  const simulatedPayback = calculatePayback(simulatedFlows);
  const investment = Math.abs(simulatedFlows[0]);
  const simulatedIL = investment !== 0 ? (simulatedVPL + investment) / investment : 0;

  const chartData = simulatedFlows.map((v: number, i: number) => ({
    name: i === 0 ? 'Inv.' : `M${i}`,
    valor: v,
  }));

  const paybackIndex = simulatedPayback ? Math.floor(simulatedPayback) : null;
  const paybackLabel = paybackIndex !== null ? (paybackIndex === 0 ? 'Inv.' : `M${paybackIndex}`) : null;

  return (
    <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm mt-6">
      <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
        <Settings2 size={20} className="text-primary" />
        <div>
          <ExecutiveHeading as="h3" className="text-foreground">Análise de Cenários e Sensibilidade</ExecutiveHeading>
          <ExecutiveText variant="caption" className="text-muted-foreground">Simulação Dinâmica de Viabilidade Fiduciária</ExecutiveText>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-muted-foreground">
              <span>Taxa de Desconto (TMA) - Mensal</span>
              <span className="text-primary font-mono">{discountRate}%</span>
            </div>
            <input 
              type="range" min="0" max="15" step="0.1" value={discountRate} 
              onChange={(e) => setDiscountRate(Number(e.target.value))}
              className="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-muted-foreground">
              <span>Ajuste de Investimento (CAPEX)</span>
              <span className="text-critical font-mono">{capexAdjustment}%</span>
            </div>
            <input 
              type="range" min="50" max="200" step="5" value={capexAdjustment} 
              onChange={(e) => setCapexAdjustment(Number(e.target.value))}
              className="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-muted-foreground">
              <span>Ajuste de Fluxo de Caixa (Receitas)</span>
              <span className="text-success font-mono">{cfMultiplier}%</span>
            </div>
            <input 
              type="range" min="50" max="200" step="5" value={cfMultiplier} 
              onChange={(e) => setCfMultiplier(Number(e.target.value))}
              className="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-surface-container/30 border border-border rounded-xl">
            <ExecutiveText variant="caption" className="text-muted-foreground uppercase font-bold">VPL Simulado</ExecutiveText>
            <ExecutiveText variant="bodyStandard" className="text-foreground font-black font-mono mt-1">{formatCurrency(simulatedVPL)}</ExecutiveText>
          </div>

          <div className="p-4 bg-surface-container/30 border border-border rounded-xl">
            <ExecutiveText variant="caption" className="text-muted-foreground uppercase font-bold">TIR Simulada</ExecutiveText>
            <ExecutiveText variant="bodyStandard" className="text-foreground font-black font-mono mt-1">{(simulatedTIR * 100).toFixed(2)}%</ExecutiveText>
          </div>

          <div className="p-4 bg-surface-container/30 border border-border rounded-xl">
            <ExecutiveText variant="caption" className="text-muted-foreground uppercase font-bold">Payback Sim.</ExecutiveText>
            <ExecutiveText variant="bodyStandard" className="text-foreground font-black font-mono mt-1">{simulatedPayback ? `${simulatedPayback.toFixed(1)} m` : 'N/A'}</ExecutiveText>
          </div>

          <div className="p-4 bg-surface-container/30 border border-border rounded-xl">
            <ExecutiveText variant="caption" className="text-muted-foreground uppercase font-bold">Índ. Lucratividade</ExecutiveText>
            <ExecutiveText variant="bodyStandard" className="text-foreground font-black font-mono mt-1">{simulatedIL.toFixed(2)}x</ExecutiveText>
          </div>
        </div>
      </div>

      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
            <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
            <Tooltip contentStyle={{ backgroundColor: 'var(--color-card)', borderRadius: '8px', border: '1px solid var(--color-border)', color: 'var(--color-foreground)' }} />
            <Bar dataKey="valor" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ExecutiveSurface>
  );
}

export function ViabilityPage({ selectedClient, clients }: { selectedClient: string, clients: any[] }) {
  const { state: vmState, computed: vmComputed, actions: vmActions } = useViabilityPageViewModel({ clientId: selectedClient });
  const [projects, setProjects] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!selectedClient) {
      setProjects([]);
      return;
    }
    const q = query(collection(db, 'viability_projects'), where('cl', '==', selectedClient));
    getDocs(q).then(snap => {
      if (!snap.empty) {
        setProjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } else {
        setProjects([]);
      }
    });
  }, [selectedClient]);

  return (
    <ExecutivePageTemplate header={{
      title: "Estudo de Viabilidade de Investimentos",
      description: "Análise de projetos de CAPEX, M&A, retorno de capital e simulações de VPL/TIR.",
    }}>
      <div className="space-y-8 pb-24 animate-executive-fade max-w-[1440px] mx-auto">

        {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE VIABILIDADE DE INVESTIMENTOS) --- */}
        <ExecutiveSummarySection 
          className="mb-8"
          status={{ label: 'Modelagem Homologada', variant: 'success' }}
          question="Qual a viabilidade econômica, VPL, TIR e horizonte de payback dos novos investimentos?"
          opinion="O comitê fiduciário homologa a análise de viabilidade dos projetos de investimento, atestando a atratividade do retorno em relação à TMA do grupo."
          driver="VPL projetado, Taxa Interna de Retorno (TIR), Payback descontado e Índice de Lucratividade."
          implication="Alocação eficiente do capital de acionistas em iniciativas geradoras de valor econômico adicionado."
          action="Aprovar a execução condicionada ao cumprimento das premissas de CAPEX e ramp-up de receita."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>

        {/* --- CAMADA 2: DIRETORIA & PROJETOS E SIMULADOR DE CENÁRIOS --- */}
        <div className="space-y-6 mb-8">
          <div className="flex justify-between items-center">
            <ExecutiveHeading as="h3" className="text-foreground">Projetos de Investimento Registrados</ExecutiveHeading>
            <button 
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-widest shadow-md hover:scale-105 transition-all flex items-center gap-2"
            >
              <Plus size={16} /> ADICIONAR PROJETO
            </button>
          </div>

          {projects.length === 0 ? (
            <ExecutiveSurface padding="xl" radius="xl" className="text-center py-16 bg-card border border-border">
              <Rocket size={48} className="mx-auto mb-4 text-primary/40" />
              <ExecutiveHeading as="h4" className="text-foreground mb-2">Nenhum Projeto de Viabilidade Cadastrado</ExecutiveHeading>
              <ExecutiveText variant="bodyStandard" className="text-muted-foreground max-w-md mx-auto">
                Cadastre o primeiro projeto de CAPEX ou M&A para simular VPL, TIR e payback sob diferentes cenários de desconto.
              </ExecutiveText>
            </ExecutiveSurface>
          ) : (
            projects.map((p, idx) => (
              <ExecutiveSurface key={idx} padding="xl" radius="xl" className="bg-card border border-border shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <ExecutiveHeading as="h3" className="text-foreground">{p.nome || p.proj}</ExecutiveHeading>
                    <ExecutiveText variant="caption" className="text-muted-foreground">{p.unidadeNegocio} · {p.filial}</ExecutiveText>
                  </div>
                  <ExecutiveBadge variant={p.conclusao === 'Aprovado' ? 'success' : 'warning'}>
                    {p.conclusao || 'Em Análise'}
                  </ExecutiveBadge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <ExecutiveMetricCard
                    label="VPL Original"
                    value={p.vpl || 'R$ 0,00'}
                    statusBadge={<ExecutiveBadge variant="info">Base</ExecutiveBadge>}
                    tone="neutral"
                    className="bg-card border border-border"
                  />
                  <ExecutiveMetricCard
                    label="TIR Mensal"
                    value={p.tir || '0.00%'}
                    statusBadge={<ExecutiveBadge variant="success">Retorno</ExecutiveBadge>}
                    tone="neutral"
                    className="bg-card border border-border"
                  />
                  <ExecutiveMetricCard
                    label="Payback"
                    value={p.payback || '0 meses'}
                    statusBadge={<ExecutiveBadge variant="neutral">Horizonte</ExecutiveBadge>}
                    tone="neutral"
                    className="bg-card border border-border"
                  />
                  <ExecutiveMetricCard
                    label="Índ. Lucratividade"
                    value={`${p.il || '0.00'}x`}
                    statusBadge={<ExecutiveBadge variant="success">Multiplicador</ExecutiveBadge>}
                    tone="neutral"
                    className="bg-card border border-border"
                  />
                </div>

                <ViabilityScenario project={p} />
              </ExecutiveSurface>
            ))
          )}
        </div>

      </div>
    </ExecutivePageTemplate>
  );
}
