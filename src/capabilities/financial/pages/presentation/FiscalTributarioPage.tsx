

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Landmark, TrendingUp, Activity, History, FileText, DollarSign, Users, Plus, X, Save, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useFiscalAdapter } from '../../../../adapters/ui/useFiscalAdapter';
import { PageHeader, StatusBadge } from '../../../../components/Common';
import { ExecutivePageTemplate } from '../../../../components/ui/executive-page-template';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveAccordion } from '../../../../components/ui/executive-accordion';
import { ExecutiveEmptyState } from '../../../../components/ui/executive-empty-state';
import { ExecutiveMetricCard } from '../../../../components/ui/executive-metric-card';
import { ExecutiveHeading } from '../../../../components/ui/executive-heading';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../../../../components/ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../../../../components/ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../../../../components/ui/executive-decision-trace';
import { useFiscalTributarioPageViewModel } from '../../../../viewmodels/useFiscalTributarioPageViewModel';
import { cn, formatCurrency } from '../../../../lib/utils';
import { DashboardSkeleton } from '../../../../components/ui/skeletons';

interface FiscalTributarioPageProps {
  clientId: string;
}

export function FiscalTributarioPage({ clientId }: FiscalTributarioPageProps) {
  // Adapter: useFiscalTributarioPageAdapter
  // ViewModel: useFiscalTributarioPageViewModel
  const { state: vmState, computed: vmComputed, actions: vmActions } = useFiscalTributarioPageViewModel({ clientId });
  // Adapter: useFiscalAdapter encapsulates Firestore fiscal configuration data access
  // ViewModel: clientData mapped to regime, aliquotas and encargos display model
  const { clientData, setClientData, loading, saving, saveFiscalData } = useFiscalAdapter(clientId);

  const handleSave = async () => {
    try {
      await saveFiscalData(clientData);
      alert('Configurações fiscais salvas com sucesso!');
    } catch (error) {
      alert('Erro ao salvar configurações fiscais.');
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!clientId) {
    return (
      <div className="bg-slate-50 border border-border p-12 rounded-[32px] text-center space-y-4">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-muted-foreground mx-auto shadow-sm">
          <AlertCircle size={32} />
        </div>
    <ExecutiveHeading as="h4" className="text-executive-secondary">Nenhuma Empresa Selecionada</ExecutiveHeading>
        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest max-w-[250px] mx-auto">
          Selecione uma empresa no topo da página para gerenciar as configurações fiscais.
        </p>
      </div>
    );
  }

  return (
    <ExecutivePageTemplate header={{
      title: "Fiscal & Tributário",
      description: `Configurações de enquadramento, alíquotas e encargos de folha para ${clientData?.fantasia || 'a empresa'}.`,
    }}>

      {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE FISCAL & TRIBUTÁRIA) --- */}
      <ExecutiveSummarySection 
        className="mb-8"
        status={{ label: clientData?.regime ? `Regime: ${clientData.regime}` : 'Pendente de Regime', variant: 'success' }}
        question="Qual o enquadramento tributário vigente, alíquota efetiva apurada e incentivos fiscais aplicáveis?"
        opinion="O comitê fiduciário homologa as premissas tributárias, atestando a conformidade dos encargos de folha e dos impostos federais/estaduais."
        driver="Regime tributário (Simples, Lucro Presumido, Lucro Real), alíquotas efetivas e encargos sociais."
        implication="Preservação da margem operacional e mitigação de contingências fiscais ou autuações."
        executiveQuestion="Realizar estudo de planejamento tributário anual para avaliar opção de migração de regime."
      >
        <ExecutiveStrategicTensions tensions={[]} />
        <ExecutiveDecisionTrace trace={[]} />
      </ExecutiveSummarySection>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">

        <div className="flex items-center gap-3">
          <div className="px-4 md:px-6 py-2 md:py-3 bg-card border border-border rounded-md shadow-sm flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-secondary" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Conformidade Tributária Ativa</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className={cn(
              "btn-executive",
              saving 
                ? "bg-surface-container text-muted-foreground cursor-not-allowed border border-border" 
                : "bg-primary text-white shadow-xl shadow-primary/20"
            )}
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> SALVAR CONFIGURAÇÕES</>}
          </button>
          <StatusBadge status="Ativo" label={clientData?.regimeTributario || 'Regime'} />
        </div>
      
      </div>

      <div className="mt-12 mb-8 border-t border-border pt-8" />
      <ExecutiveAccordion
        title="Configurações Fiscais e Tributárias"
        subtitle="Regime, alíquotas, encargos de folha e histórico de conformidade."
        variant="analytics"
        defaultExpanded
      >


      <div className="space-y-10">
        {/* 1. Regime Selector Card */}
        <div className="card-premium p-8 space-y-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-1">
              <ExecutiveHeading as="h4" className="text-foreground flex items-center gap-2">
                <Landmark size={20} className="text-secondary" /> Enquadramento Tributário
              </ExecutiveHeading>
              <ExecutiveText as="div" variant="caption" className="text-muted-foreground italic">Defina o regime federal principal para o cálculo automático de impostos.</ExecutiveText>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {['Simples Nacional', 'Lucro Presumido', 'Lucro Real'].map(regime => (
                <button
                  key={regime}
                  onClick={() => setClientData({...clientData, regime})}
                  className={cn(
                    "px-4 md:px-6 py-2 md:py-2.5 rounded-sm text-[10px] font-medium uppercase tracking-widest transition-all shadow-sm",
                    clientData.regime === regime 
                      ? "bg-executive text-white border border-white/5" 
                      : "bg-surface-container text-muted-foreground border border-border hover:bg-card"
                  )}
                >
                  {regime}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8 border-t border-border relative z-10 mb-8">
            {clientData.regime === 'Lucro Real' && (
              <div className="space-y-2">
                <label className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest block px-1">Método de Apuração (LR)</label>
                <select 
                  value={clientData.regimeReal}
                  onChange={(e) => setClientData({...clientData, regimeReal: e.target.value})}
                  className="w-full px-4 py-3 bg-surface-container border border-border rounded-sm text-[11px] font-medium uppercase tracking-widest outline-none focus:ring-1 focus:ring-secondary/20 transition-all shadow-inner"
                >
                  <option value="Cumulativo">Cumulativo (654/98)</option>
                  <option value="Não Cumulativo">Não Cumulativo (10.637/10.833)</option>
                  <option value="Híbrido">Híbrido (Misto)</option>
                </select>
              </div>
            )}

            {clientData.regime === 'Lucro Presumido' && (
              <div className="space-y-2">
                <label className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest block px-1">Cálculo Padrão IRPJ/CSLL</label>
                <select 
                  value={clientData.cnaePresuncao}
                  onChange={(e) => setClientData({...clientData, cnaePresuncao: e.target.value})}
                  className="w-full px-4 py-3 bg-surface-container border border-border rounded-sm text-[11px] font-medium uppercase tracking-widest outline-none focus:ring-1 focus:ring-secondary/20 transition-all shadow-inner"
                >
                  <option value="Venda de produtos / Mercadorias">Comércio (8% / 12%)</option>
                  <option value="Prestação de Serviços Genéricos">Serviços (32%)</option>
                  <option value="Serviços de Saúde">Saúde (8% / 12%)</option>
                  <option value="Serviços de Transporte">Transporte (16% / 32%)</option>
                </select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest block px-1">Porte Declarado (Faturamento)</label>
              <input 
                type="text" 
                value={clientData.porte}
                readOnly
                className="w-full px-4 py-3 bg-surface-container/50 border border-border rounded-sm text-[11px] font-medium uppercase tracking-widest text-muted-foreground outline-none shadow-inner cursor-not-allowed italic"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-10">
            {clientData.regime === 'Simples Nacional' ? (
              <div className="card-premium p-8 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-secondary shadow-sm"></div>
                <div className="flex items-center justify-between relative z-10">
                  <h5 className="text-[10px] font-medium text-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                    <History size={16} className="text-secondary" /> Histórico RBT12
                  </h5>
                </div>
                <div className="bg-surface-container rounded-sm border border-border overflow-hidden relative z-10 shadow-inner">
                  <div className="max-h-[460px] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-card/90 backdrop-blur-sm z-10 shadow-sm border-b border-border">
                        <tr>
                          <th className="px-4 md:px-6 py-2 md:py-3 text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em]">Referência</th>
                          <th className="px-4 md:px-6 py-2 md:py-3 text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] text-right">Valor Bruto</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {(clientData.historicoFaturamento || []).map((item: any, idx: number) => (
                          <tr key={idx} className="hover:bg-card transition-colors group">
                            <td className="px-4 md:px-6 py-2.5 md:py-4">
                              <div className="text-[10px] font-medium text-foreground uppercase tracking-widest italic">{item.mes}/{item.ano}</div>
                            </td>
                            <td className="px-4 md:px-6 py-2.5 md:py-4 text-right">
                              <input 
                                type="number"
                                value={item.valor}
                                onChange={(e) => {
                                  const newHist = [...clientData.historicoFaturamento];
                                  newHist[idx] = { ...newHist[idx], valor: parseFloat(e.target.value) || 0 };
                                  const newRbt12 = newHist.reduce((acc, curr) => acc + (curr.valor || 0), 0);
                                  setClientData({ ...clientData, historicoFaturamento: newHist, rbt12: newRbt12 });
                                }}
                                className="w-32 bg-transparent text-[11px] font-medium text-foreground text-right outline-none border-b border-transparent focus:border-secondary transition-all py-1 tabular-nums tracking-tighter"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="bg-executive p-6 rounded-sm flex items-center justify-between border border-white/5 shadow-premium">
                  <label className="text-[9px] font-medium text-white/40 uppercase tracking-widest block italic">Total RBT12 (Acumulado)</label>
                  <div className="text-2xl font-medium text-success tracking-tighter tabular-nums shadow-sm">
                    {formatCurrency(clientData.rbt12 || 0)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="card-premium p-8 space-y-6 relative overflow-hidden">
                <h5 className="text-[10px] font-medium text-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                  <TrendingUp size={16} className="text-secondary" /> Faturamento Base
                </h5>
                <div className="bg-surface-container p-6 rounded-sm border border-border space-y-3 shadow-inner">
                  <label className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest block italic">Receita Mensal de Referência</label>
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-3 text-muted-foreground/30 pr-4">
                      <DollarSign size={20} />
                      <span className="text-[10px] font-medium uppercase tracking-widest italic">BRL</span>
                    </div>
                    <input 
                      type="number"
                      value={clientData.faturamentoMensal}
                      onChange={(e) => setClientData({...clientData, faturamentoMensal: parseFloat(e.target.value) || 0})}
                      className="w-full pl-24 pr-8 py-5 bg-card border border-border rounded-sm text-2xl font-medium text-foreground outline-none focus:ring-1 focus:ring-secondary/20 transition-all shadow-premium tabular-nums tracking-tighter"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-10">
            <div className="card-premium p-8 space-y-8 relative overflow-hidden">
              <h5 className="text-[10px] font-medium text-foreground uppercase tracking-[0.2em] flex items-center gap-2 relative z-10">
                <Activity size={16} className="text-secondary" /> Segregação de Atividade
              </h5>
              <div className="bg-surface-container/50 p-6 rounded-sm border border-border space-y-6 relative z-10 shadow-inner">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-card rounded-sm border border-border flex items-center justify-center text-secondary shrink-0 shadow-sm">
                    <ShieldCheck size={24} />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <label className="text-[9px] font-medium text-secondary uppercase tracking-[0.2em] block italic">Atividade Principal</label>
                    <ExecutiveText as="div" variant="caption" className="text-foreground">{clientData.cnae}</ExecutiveText>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {clientData.regime === 'Simples Nacional' ? (
                    <select 
                      value={clientData.cnaeAnexo}
                      onChange={(e) => setClientData({...clientData, cnaeAnexo: e.target.value})}
                      className="w-full px-4 py-3 bg-card border border-border rounded-sm text-[10px] font-medium uppercase tracking-[0.2em] outline-none focus:ring-1 focus:ring-secondary/20 transition-all shadow-sm"
                    >
                      {['Anexo I - Comércio', 'Anexo II - Indústria', 'Anexo III - Serviços', 'Anexo IV - Serviços Esp.', 'Anexo V - Serviços F.R'].map((anexo, i) => (
                        <option key={i} value={`Anexo ${['I','II','III','IV','V'][i]}`}>{anexo}</option>
                      ))}
                    </select>
                  ) : clientData.regime === 'Lucro Presumido' ? (
                    <input 
                      type="text"
                      readOnly
                      value={clientData.cnaePresuncao}
                      className="w-full px-4 py-3 bg-surface-container/50 border border-border rounded-sm text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/40 outline-none italic"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-surface-container/50 rounded-sm text-[10px] font-medium text-muted-foreground/40 uppercase tracking-[0.2em] italic border border-border">
                      Aplicado regime geral: {clientData.regimeReal}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Payroll Taxes Section */}
        <div className="card-premium p-8 space-y-8 relative overflow-hidden">
          <div className="space-y-1 relative z-10">
            <h5 className="text-[10px] font-medium text-foreground uppercase tracking-[0.2em] flex items-center gap-2">
              <Users size={20} className="text-secondary" /> Encargos de Folha de Pagamento
            </h5>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {[
              { label: 'FGTS (%)', key: 'folhaFgts' },
              { label: 'INSS Patronal (%)', key: 'folhaInssPatronal' },
              { label: 'INSS Func. (%)', key: 'folhaInssFuncionario' },
              { label: 'Multa FGTS (%)', key: 'folhaMultaFgts' }
            ].map(item => (
              <div key={item.key} className="space-y-2">
                <label className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest block px-1 italic">{item.label}</label>
                <input 
                  type="number"
                  value={clientData[item.key]}
                  onChange={(e) => setClientData({...clientData, [item.key]: parseFloat(e.target.value) || 0})}
                  className="w-full px-4 py-3 bg-surface-container border border-border rounded-sm text-[11px] font-medium uppercase tracking-widest outline-none focus:ring-1 focus:ring-secondary/20 transition-all shadow-inner tabular-nums tracking-tighter"
                />
              </div>
            ))}
          </div>
        </div>
        </div>
        <ExecutiveSummarySection 
          status={{ label: 'Regime Mapeado', variant: 'success' }}
          question="Qual o impacto do enquadramento tributário na margem líquida?"
          opinion="O conselho fiduciário homologa as alíquotas vigentes e o planejamento tributário aplicado à operação."
          driver="Regime tributário, alíquotas efetivas de impostos e encargos sobre folha de pagamento."
          implication="Mitigação de passivos fiscais e otimização da carga tributária global."
          executiveQuestion="Auditar anualmente o enquadramento fiscal e explorar teses de recuperação de créditos."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>
      </ExecutiveAccordion>
    </ExecutivePageTemplate>
  );
}
