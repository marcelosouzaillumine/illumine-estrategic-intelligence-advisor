import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Search, Activity, RefreshCw, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PageHeader, StatusBadge } from '../Common';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveAccordion } from '../ui/executive-accordion';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';
import { ExecutiveMetricCard } from '../ui/executive-metric-card';
import { ExecutiveBadge } from '../ui/executive-badge';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { ExecutiveTechnicalLayer } from '../ui/executive-technical-layer';
import { cn } from '../../lib/utils';
import { DATA } from '../../data';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../ui/executive-decision-trace';
import { usePremissasEconomicasPageViewModel } from '../../viewmodels/usePremissasEconomicasPageViewModel';
import { usePremissasEconomicasAdapter } from '../../adapters/ui/usePremissasEconomicasAdapter';

export function PremissasEconomicasPage() {
  const { state: vmState, computed: vmComputed, actions: vmActions } = usePremissasEconomicasPageViewModel({ clientId: '' });
  const [activeHistory, setActiveHistory] = useState<string | null>(null);
  const { econData, isSyncing, lastSync, lastSyncFull, handleSync } = usePremissasEconomicasAdapter();

  const lastSyncDisplay = lastSyncFull || "Aguardando sincronização...";

  return (
    <ExecutivePageTemplate header={{
      title: "Premissas do Sistema",
      description: "Configurações globais e indicadores de mercado atualizados para suporte estratégico.",
    }}>
      <div className="max-w-[1440px] mx-auto space-y-8 pb-24 animate-executive-fade">

        {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE PREMISSAS MACROECONÔMICAS) --- */}
        <ExecutiveSummarySection 
          className="mb-8"
          status={{ label: 'Premissas Atualizadas', variant: 'success' }}
          question="Como sincronizar os indicadores macroeconômicos e validar premissas de suporte?"
          opinion="O comitê fiduciário homologa os índices Selic, IPCA, câmbio e inflação de suporte às simulações e projeções do sistema."
          driver="Taxa Selic, IPCA, câmbio USD/BRL e indexadores oficiais do Banco Central."
          implication="Garantia de consistência, realismo econômico e rastreabilidade nas projeções financeiras."
          executiveQuestion="Executar a sincronização mensal das taxas de mercado com a API do Banco Central."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>

        {/* --- CAMADA 2: DIRETORIA & INDICADORES ECONÔMICOS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {econData.map((secao: any, idx: number) => {
            const isHistoryOpen = activeHistory === secao.categoria;
            
            return (
              <ExecutiveSurface key={idx} padding="xl" radius="xl" className="bg-card border border-border shadow-sm flex flex-col">
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-border mb-6">
                  <div>
                    <ExecutiveHeading as="h3" className="text-foreground">{secao.categoria}</ExecutiveHeading>
                    <div className="flex items-center gap-2 mt-1">
                      <ExecutiveBadge variant="neutral">{secao.fonte}</ExecutiveBadge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {secao.historico && (
                      <button 
                        onClick={() => setActiveHistory(isHistoryOpen ? null : secao.categoria)}
                        className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl border border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-2"
                      >
                        {isHistoryOpen ? "Atuais" : "Histórico"}
                        <TrendingUp size={12} className={isHistoryOpen ? "animate-pulse" : ""} />
                      </button>
                    )}
                    <a 
                      href={secao.url} 
                      target="_blank" 
                      rel="no-referrer"
                      className="text-[10px] font-bold text-muted-foreground hover:text-primary uppercase tracking-widest transition-colors flex items-center gap-1 bg-surface-container px-3 py-1.5 rounded-xl border border-border"
                    >
                      Fonte
                      <Search size={10} />
                    </a>
                  </div>
                </div>

                <div className="relative min-h-[260px] flex-1">
                  <AnimatePresence mode="wait">
                    {isHistoryOpen && secao.historico ? (
                      <motion.div 
                        key="history"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <div className="h-48 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={secao.historico}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                              <XAxis dataKey="data" fontSize={9} tickLine={false} axisLine={false} stroke="var(--color-muted-foreground)" />
                              <YAxis fontSize={9} tickLine={false} axisLine={false} domain={['auto', 'auto']} stroke="var(--color-muted-foreground)" />
                              <Tooltip 
                                contentStyle={{ backgroundColor: 'var(--color-card)', borderRadius: '8px', border: '1px solid var(--color-border)', color: 'var(--color-foreground)', fontSize: '11px' }}
                                formatter={(v: number) => [
                                  secao.categoria.includes('Câmbio') ? `R$ ${v.toFixed(2)}` : `${v.toFixed(2)}%`, 
                                  secao.categoria.includes('Câmbio') ? 'USD' : 'Selic'
                                ]}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="valor" 
                                stroke="var(--color-primary)" 
                                strokeWidth={2} 
                                dot={{ r: 3 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="indicators"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-4 divide-y divide-border"
                      >
                        {secao.indicadores.map((ind: any, i: number) => (
                          <div key={i} className="pt-3 first:pt-0 flex items-center justify-between">
                            <div>
                              <ExecutiveText as="div" variant="bodyStandard" className="text-foreground font-bold">{ind.nome}</ExecutiveText>
                              <ExecutiveText as="div" variant="caption" className="text-muted-foreground mt-0.5">{ind.obs}</ExecutiveText>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-black font-mono text-foreground block">{ind.valor}</span>
                              <ExecutiveBadge variant="neutral" className="mt-1">
                                {ind.status}
                              </ExecutiveBadge>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ExecutiveSurface>
            );
          })}
        </div>

        {/* --- CAMADA 3: CAMADA TÉCNICA & CONECTIVIDADE BACEN --- */}
        <ExecutiveTechnicalLayer
          title="Camada Técnica de Conectividade"
          subtitle="Sincronização com o Banco Central e Mercado Financeiro"
          description="Integração de dados monetários para atualização contínua do simulador fiduciário."
          className="mb-8"
        >
          <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
              <div className="flex-1">
                <ExecutiveHeading as="h3" className="text-foreground mb-2">Conectividade com o Mercado</ExecutiveHeading>
                <ExecutiveText variant="bodyStandard" className="text-muted-foreground">
                  Nossas premissas são fundamentadas nos relatórios mais recentes do mercado financeiro brasileiro (BCB), garantindo que suas simulações de viabilidade e fluxo de caixa reflitam a realidade monetária e fiscal.
                </ExecutiveText>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="p-4 bg-surface-container/30 border border-border rounded-xl">
                  <ExecutiveText variant="caption" className="text-muted-foreground uppercase font-bold">Última Atualização</ExecutiveText>
                  <ExecutiveText variant="bodyStandard" className="text-foreground font-bold mt-1">{lastSyncDisplay}</ExecutiveText>
                </div>

                <button 
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="px-6 py-4 bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-widest shadow-md hover:scale-105 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <RefreshCw className={cn("w-4 h-4", isSyncing && "animate-spin")} />
                  {isSyncing ? "Sincronizando..." : "Sincronizar BCB"}
                </button>
              </div>
            </div>
          </ExecutiveSurface>
        </ExecutiveTechnicalLayer>

      </div>
    </ExecutivePageTemplate>
  );
}
