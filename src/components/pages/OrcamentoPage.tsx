import React, { useState } from 'react';
import { Plus, Search, Filter, Save, UploadCloud, ChevronRight, Calculator, Trash2, Edit2, X, FileSpreadsheet, CheckCircle2, Loader2, Building2, Landmark, LayoutGrid, AlertCircle, TrendingUp, FileText, Calendar } from 'lucide-react';
import { cn, formatCurrency } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { PageHeader, StatusBadge } from '../Common';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveAccordion } from '../ui/executive-accordion';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { ExecutiveMetricCard } from '../ui/executive-metric-card';
import { ExecutiveTechnicalMetricCard } from '../ui/executive-technical-metric-card';
import { ExecutiveBadge } from '../ui/executive-badge';
import { ExecutiveTechnicalLayer } from '../ui/executive-technical-layer';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../ui/executive-decision-trace';
import { useOrcamentoPageViewModel } from '../../viewmodels/useOrcamentoPageViewModel';
import { useOrcamento } from '../../adapters/ui/OrcamentoAdapter';
import { BudgetEntry } from '../../viewmodels/OrcamentoViewModel';

export function OrcamentoPage({ 
  selectedClient, 
  selectedYear, 
  selectedMonth 
}: { 
  selectedClient: string;
  selectedYear: number;
  selectedMonth: number;
}) {
  const { state: vmState, computed: vmComputed, actions: vmActions } = useOrcamentoPageViewModel({ clientId: selectedClient });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetEntry | null>(null);

  const {
    budgets,
    filteredBudgets,
    budgetsByCC,
    totalBudget,
    loading,
    accountPlans,
    clientDetails,
    searchTerm,
    setSearchTerm,
    isSaving,
    isImporting,
    viewType,
    setViewType,
    localYear,
    setLocalYear,
    localMonth,
    setLocalMonth,
    formData,
    setFormData,
    years,
    months,
    handleSave: adapterSave,
    handleDelete,
    handleDuplicate,
    handleImport
  } = useOrcamento({ selectedClient, selectedYear, selectedMonth });

  const handleSave = async () => {
    const success = await adapterSave(editingBudget);
    if (success) {
      setIsModalOpen(false);
      setEditingBudget(null);
    }
  };

  return (
    <ExecutivePageTemplate header={{
      title: "Orçamento & Budget",
      description: "Planejamento financeiro gerencial vinculado a unidades, filiais e centros de custo.",
    }}>

      {/* Control Bar & Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3">
          <StatusBadge status="Verde" label="Budget Conectado" />
        </div>
      </div>

      {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE GOVERNANÇA ORÇAMENTÁRIA) --- */}
      <ExecutiveSummarySection 
        className="mb-8"
        status={{ label: 'Orçamento Planejado', variant: 'success' }}
        question="Como está o controle de planejamento vs realizado e desvios por centro de custo?"
        opinion="O comitê fiduciário homologa que as variações e desvios orçamentários estão sob controle nas unidades de negócio e centros de custo."
        driver="Budget anual, desvios orçamentários por centro de custo e alocação estratégica."
        implication="Previsibilidade financeira robusta e controle rígido das despesas operacionais."
        executiveQuestion="Acompanhar desvios mensais e efetuar as revisões trimestrais planejadas de budget."
      >
        <ExecutiveStrategicTensions tensions={[]} />
        <ExecutiveDecisionTrace trace={[]} />
      </ExecutiveSummarySection>

      {/* --- CAMADA 2: DIRETORIA & PAINEL DE CONSOLIDAÇÃO ORÇAMENTÁRIA --- */}
      <ExecutiveSurface padding="xl" radius="xl" className="border-border bg-card shadow-sm mb-10">
        <div className="flex items-center justify-between gap-4 flex-wrap bg-surface-container/30 p-4 rounded-2xl border border-border mb-8">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex bg-card p-1 rounded-xl border border-border">
              <button 
                onClick={() => setViewType('mensal')}
                className={cn(
                  "px-4 md:px-6 py-1.5 md:py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  viewType === 'mensal' ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Mensal
              </button>
              <button 
                onClick={() => setViewType('anual')}
                className={cn(
                  "px-4 md:px-6 py-1.5 md:py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  viewType === 'anual' ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Anual
              </button>
            </div>

            <div className="flex items-center bg-card p-1 rounded-xl border border-border shadow-sm h-[40px]">
              <div className={cn("flex items-center px-4 py-2", viewType === 'mensal' && "border-r border-border")}>
                <Calendar size={14} className="text-primary mr-2" />
                <select 
                  value={localYear} 
                  onChange={(e) => setLocalYear(parseInt(e.target.value))}
                  className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-primary transition-colors text-foreground"
                >
                  {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              {viewType === 'mensal' && (
                <div className="flex items-center px-4 py-2 animate-in fade-in zoom-in duration-300">
                  <select 
                    value={localMonth} 
                    onChange={(e) => setLocalMonth(parseInt(e.target.value))}
                    className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-primary transition-colors text-foreground"
                  >
                    {months.map(m => (
                      <option key={m.v} value={m.v}>{m.l}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <button 
              onClick={handleDuplicate}
              disabled={isSaving || budgets.filter(b => b.month === localMonth).length === 0}
              className="px-4 md:px-6 py-2 md:py-2.5 bg-card border border-border text-success rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-success-soft transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 h-[40px]"
            >
              <LayoutGrid size={14} /> DUPLICAR MÊS
            </button>

            <label className="cursor-pointer px-4 md:px-6 py-2 md:py-2.5 bg-card border border-border text-muted-foreground rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-surface-container transition-all flex items-center gap-2 shadow-sm h-[40px]">
              {isImporting ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
              {isImporting ? 'IMPORTANDO...' : 'IMPORTAR CSV'}
              <input type="file" accept=".csv" className="hidden" onChange={handleImport} disabled={isImporting} />
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => { 
                setEditingBudget(null); 
                setFormData({
                  valor: 0,
                  unidade: '',
                  filial: '',
                  centroCusto: '',
                  accountId: '',
                  month: localMonth,
                  year: localYear
                });
                setIsModalOpen(true); 
              }}
              className="px-5 md:px-8 py-2.5 md:py-3.5 bg-primary text-primary-foreground rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-md flex items-center gap-2"
            >
              <Plus size={16} /> NOVO LANÇAMENTO
            </button>
          </div>
        </div>

        {/* Summary Cards (Refatorados para ExecutiveMetricCard) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <ExecutiveMetricCard
            label={`Total Orçado (${viewType === 'mensal' ? 'Mês' : 'Ano'})`}
            value={formatCurrency(totalBudget)}
            statusBadge={<ExecutiveBadge variant="neutral">Planejado</ExecutiveBadge>}
            tone="neutral"
            description={<span className="text-xs text-muted-foreground font-medium">Limite Orçamentário</span>}
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="Itens Planejados"
            value={String(filteredBudgets.length)}
            statusBadge={<ExecutiveBadge variant="info">Lançamentos</ExecutiveBadge>}
            tone="neutral"
            description={<span className="text-xs text-muted-foreground font-medium">Contas Mapeadas</span>}
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="Exercício de Referência"
            value={viewType === 'mensal' ? `${months.find(m => m.v === localMonth)?.l} ${localYear}` : String(localYear)}
            statusBadge={<ExecutiveBadge variant="neutral">Vigência</ExecutiveBadge>}
            tone="neutral"
            description={<span className="text-xs text-muted-foreground font-medium">Competência</span>}
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="Centros de Custo Prioritários"
            value={budgetsByCC.length > 0 ? budgetsByCC[0][0] : 'N/A'}
            statusBadge={<ExecutiveBadge variant="success">Ativos</ExecutiveBadge>}
            tone="neutral"
            description={<span className="text-xs text-muted-foreground font-medium">{budgetsByCC.length} CCs com Alocação</span>}
            className="bg-card border border-border shadow-sm h-full"
          />
        </div>

        {/* Matriz por Centro de Custo */}
        <div className="p-6 bg-surface-container/30 border border-border rounded-2xl mb-8">
          <ExecutiveHeading as="h4" className="text-foreground mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-primary" /> Distribuição de Recursos por Centro de Custo
          </ExecutiveHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgetsByCC.map(([cc, value]) => (
              <div key={cc} className="p-4 bg-card border border-border rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-foreground">{cc}</span>
                  <span className="text-primary font-mono">{formatCurrency(value)}</span>
                </div>
                <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${totalBudget > 0 ? (value / totalBudget) * 100 : 0}%` }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </ExecutiveSurface>

      {/* --- CAMADA 3: CAMADA TÉCNICA E DETALHAMENTO CONTÁBIL --- */}
      <ExecutiveTechnicalLayer
        title="Camada Técnica Orçamentária"
        subtitle="Tabela de Lançamentos e Rastreabilidade Contábil"
        description="Detalhamento analítico por conta contábil, unidade de negócio, filial e centro de custo."
        className="mb-8"
      >
        <ExecutiveSurface padding="none" radius="xl" className="overflow-hidden border-border bg-card shadow-sm">
          <div className="p-4 border-b border-border bg-surface-container/30 flex items-center gap-4">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-3 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Pesquisar por conta, unidade ou CC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container/20 border-b border-border">
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Conta Contábil</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Unidade / Filial</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Centro de Custo</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-right">Valor Orçado</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-16 text-center">
                      <Loader2 size={32} className="animate-spin text-primary mx-auto mb-4" />
                      <ExecutiveText as="div" variant="bodyStandard" className="text-muted-foreground">Carregando orçamento...</ExecutiveText>
                    </td>
                  </tr>
                ) : filteredBudgets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-16 text-center">
                      <FileSpreadsheet size={48} className="text-muted-foreground mx-auto mb-4" />
                      <ExecutiveHeading as="h4" className="text-foreground">Nenhum lançamento encontrado</ExecutiveHeading>
                      <ExecutiveText as="div" variant="bodyStandard" className="text-muted-foreground max-w-2xl mx-auto mt-2">Clique em "Novo Lançamento" ou importe um arquivo CSV para começar.</ExecutiveText>
                    </td>
                  </tr>
                ) : (
                  filteredBudgets.map((b) => (
                    <tr key={b.id} className="hover:bg-surface-container/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div>
                          <ExecutiveText as="div" variant="bodyStandard" className="text-foreground font-bold">{b.accountName}</ExecutiveText>
                          <ExecutiveText as="div" variant="caption" className="font-mono text-muted-foreground">{b.accountCode}</ExecutiveText>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter px-2 py-0.5 bg-surface-container rounded-md w-fit">{b.unidade || 'Sem Unidade'}</span>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">{b.filial || 'Sem Filial'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-muted-foreground">{b.centroCusto || 'Geral'}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-mono font-bold text-foreground">{formatCurrency(b.valor)}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className={cn(
                          "flex items-center justify-end gap-2 transition-opacity",
                          viewType === 'anual' ? "opacity-20 cursor-not-allowed" : "opacity-0 group-hover:opacity-100"
                        )}>
                          <button 
                            onClick={() => { if(viewType === 'mensal') { setEditingBudget(b); setFormData(b); setIsModalOpen(true); } }}
                            disabled={viewType === 'anual'}
                            className="p-2 text-muted-foreground hover:text-primary hover:bg-surface-container rounded-lg transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => b.id && viewType === 'mensal' && handleDelete(b.id)}
                            disabled={viewType === 'anual'}
                            className="p-2 text-muted-foreground hover:text-critical hover:bg-critical-soft rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </ExecutiveSurface>
      </ExecutiveTechnicalLayer>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden border border-border"
            >
              <div className="p-6 bg-surface-container border-b border-border relative overflow-hidden">
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center">
                      <Calculator size={24} className="text-primary" />
                    </div>
                    <div>
                      <ExecutiveHeading as="h3" className="text-foreground">
                        {editingBudget ? 'Editar Orçamento' : 'Novo Planejamento'}
                      </ExecutiveHeading>
                      <ExecutiveText as="div" variant="caption" className="text-muted-foreground">Preencha os campos abaixo para definir o budget</ExecutiveText>
                    </div>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-card rounded-full transition-colors text-muted-foreground">
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block px-1">Conta Contábil</label>
                    <select 
                      value={formData.accountId}
                      onChange={(e) => setFormData({...formData, accountId: e.target.value})}
                      className="w-full px-4 py-3 bg-surface-container border border-border rounded-xl text-sm font-bold outline-none text-foreground"
                    >
                      <option value="">Selecione uma conta...</option>
                      {accountPlans.map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.code} - {acc.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block px-1">Valor Orçado (R$)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-xs">R$</span>
                      <input 
                        type="number"
                        value={formData.valor}
                        onChange={(e) => setFormData({...formData, valor: parseFloat(e.target.value) || 0})}
                        className="w-full pl-10 pr-4 py-3 bg-surface-container border border-border rounded-xl text-lg font-mono font-bold text-foreground outline-none"
                        placeholder="0,00"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block px-1">Unidade de Negócio</label>
                    <select 
                      value={formData.unidade}
                      onChange={(e) => setFormData({...formData, unidade: e.target.value})}
                      className="w-full px-4 py-2.5 bg-surface-container border border-border rounded-xl text-sm font-bold outline-none text-foreground"
                    >
                      <option value="">Selecione...</option>
                      {clientDetails?.unidadesNegocio?.map((u: string) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block px-1">Filial</label>
                    <select 
                      value={formData.filial}
                      onChange={(e) => setFormData({...formData, filial: e.target.value})}
                      className="w-full px-4 py-2.5 bg-surface-container border border-border rounded-xl text-sm font-bold outline-none text-foreground"
                    >
                      <option value="">Selecione...</option>
                      {clientDetails?.filiais?.map((f: any) => (
                        <option key={f.nome} value={f.nome}>{f.nome}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block px-1">Centro de Custo</label>
                    <input 
                      type="text"
                      value={formData.centroCusto}
                      onChange={(e) => setFormData({...formData, centroCusto: e.target.value})}
                      placeholder="Ex: Marketing"
                      className="w-full px-4 py-2.5 bg-surface-container border border-border rounded-xl text-sm font-bold outline-none text-foreground"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-border flex gap-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 text-muted-foreground font-bold text-xs uppercase tracking-widest hover:bg-surface-container rounded-xl transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving || !formData.accountId}
                    className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-widest shadow-md hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {editingBudget ? 'Atualizar Budget' : 'Salvar Planejamento'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ExecutivePageTemplate>
  );
}
