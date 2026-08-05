

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Target, Printer, CheckCircle2, ClipboardCheck, Clock, AlertCircle, Users, Calendar, ChevronRight, MoreHorizontal, Trash2, Edit3, Filter, CheckCircle, X, Save, Flag, LayoutGrid, List, MessageSquare, BarChart2, Zap, Bell, AlertTriangle, ArrowRight, TrendingUp, Activity, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Pie, Cell, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { collection, query, where, getDocs, addDoc, serverTimestamp, updateDoc, doc, deleteDoc, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../../lib/firebase';
import { PageHeader, StatusBadge } from '../../Common';
import { ExecutivePageTemplate } from '../../ui/executive-page-template';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveAccordion } from '../../ui/executive-accordion';
import { ExecutiveEmptyState } from '../../ui/executive-empty-state';
import { ExecutiveMetricCard } from '../../ui/executive-metric-card';
import { ExecutiveHeading } from '../../ui/executive-heading';
import { ExecutiveText } from '../../ui/executive-typography';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../../ui/executive-decision-trace';
import { usePlanoAcaoPageViewModel } from '../../../viewmodels/usePlanoAcaoPageViewModel';
import { cn } from '../../../lib/utils';
import { useDataTable } from '../../../hooks/useDataTable';
import { usePlanoAcaoViewModel } from '../../../viewmodels/usePlanoAcaoViewModel';
import { useExecutiveFormatter } from "../../../core/localization";

interface ActionItem {
  id?: string;
  clientId: string;
  minuteId?: string;
  title: string;
  desc: string;
  responsible: string;
  deadline: string;
  priority: 'Alta' | 'Média' | 'Baixa' | 'Crítica';
  status: 'Pendente' | 'Em curso' | 'Concluído' | 'Impedido';
  phase: 'Estabilização' | 'Otimização' | 'Expansão';
  progress: number;
  effort?: number; // in hours
  tags?: string[];
  origin?: string;
  originTitle?: string;
  createdAt?: any;
  updatedAt?: any;
}


export function PlanoAcaoPage({ clientId }: { clientId: string }) {
    const formatter = useExecutiveFormatter();
  // Adapter: usePlanoAcaoPageAdapter
  // ViewModel: usePlanoAcaoPageViewModel
  const { state: vmState, computed: vmComputed, actions: vmActions } = usePlanoAcaoPageViewModel({ clientId });
  const portal = createPortal;
  const [items, setItems] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showAutomations, setShowAutomations] = useState(false);
  const [view, setView] = useState<'list' | 'board' | 'dashboard'>('list');
  
  const [formData, setFormData] = useState<ActionItem>({
    clientId,
    title: '',
    desc: '',
    responsible: '',
    deadline: '',
    priority: 'Média',
    status: 'Pendente',
    phase: 'Estabilização',
    progress: 0,
    effort: 2,
    origin: 'Direto'
  });

  useEffect(() => {
      const formatter = useExecutiveFormatter();
    if (!clientId) return;

    setLoading(true);
    const q = query(
      collection(db, 'action_items'),
      where('clientId', '==', clientId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const formatter = useExecutiveFormatter();
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActionItem));
      // Sort in-memory to avoid composite index requirement
      data.sort((a, b) => a.deadline.localeCompare(b.deadline));
      setActions(data);
      setLoading(false);
    }, (error) => {
        const formatter = useExecutiveFormatter();
      console.error("Error fetching actions:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [clientId]);

  // Integration: Handle pending action from Indicators
  useEffect(() => {
      const formatter = useExecutiveFormatter();
    const pendingAction = sessionStorage.getItem('pending_action');
    if (pendingAction) {
      try {
        const data = JSON.parse(pendingAction);
        setFormData(prev => ({
          ...prev,
          title: data.title || '',
          desc: data.description || '',
          origin: data.origin || 'Indicadores'
        }));
        setIsFormOpen(true);
        sessionStorage.removeItem('pending_action');
      } catch (err) {
        console.error("Error parsing pending action:", err);
        sessionStorage.removeItem('pending_action');
      }
    }
  }, []);

  const handleSave = async () => {
      const formatter = useExecutiveFormatter();
    if (!auth.currentUser) return;

    try {
      const data = {
        ...formData,
        updatedAt: serverTimestamp()
      };

      if (editingId) {
        await updateDoc(doc(db, 'action_items', editingId), data);
      } else {
        await addDoc(collection(db, 'action_items'), {
          ...data,
          createdAt: serverTimestamp()
        });
      }

      setIsFormOpen(false);
      setEditingId(null);
      resetForm();
    } catch (error) {
      console.error("Error saving action item:", error);
      alert("Erro ao salvar item do plano de ação.");
    }
  };

  const handleDelete = async (id: string) => {
      const formatter = useExecutiveFormatter();
    if (!window.confirm('Excluir esta tarefa permanentemente?')) return;
    try {
      await deleteDoc(doc(db, 'action_items', id));
    } catch (error) {
      console.error("Error deleting action item:", error);
    }
  };

  const updateStatus = async (id: string, newStatus: ActionItem['status']) => {
      const formatter = useExecutiveFormatter();
    try {
      await updateDoc(doc(db, 'action_items', id), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const resetForm = () => {
      const formatter = useExecutiveFormatter();
    setFormData({
      clientId,
      title: '',
      desc: '',
      responsible: '',
      deadline: '',
      priority: 'Média',
      status: 'Pendente',
      phase: 'Estabilização',
      progress: 0,
      effort: 2,
      origin: 'Direto'
    });
  };

  const openAdd = () => {
      const formatter = useExecutiveFormatter();
    resetForm();
    setEditingId(null);
    setIsFormOpen(true);
  };

  const openEdit = (action: ActionItem) => {
      const formatter = useExecutiveFormatter();
    setFormData(action);
    setEditingId(action.id || null);
    setIsFormOpen(true);
  };

  const {
    searchTerm,
    setSearchTerm,
    filteredData: filteredActions,
  } = useDataTable(actions, {
    searchFields: ['title', 'desc', 'responsible', 'originTitle'],
    initialSort: { key: 'deadline', direction: 'asc' }
  });

  const stats = useMemo(() => {
      const formatter = useExecutiveFormatter();
    const now = new Date();
    const overdue = actions.filter(a => a.status !== 'Concluído' && new Date(a.deadline) < now).length;
    const critical = actions.filter(a => a.priority === 'Crítica').length;

    return {
      total: actions.length,
      concluidos: actions.filter(a => a.status === 'Concluído').length,
      pendentes: actions.filter(a => a.status === 'Pendente').length,
      emCurso: actions.filter(a => a.status === 'Em curso').length,
      overdue,
      critical,
      totalEffort: actions.reduce((acc, a) => acc + (a.effort || 0), 0),
      progresso: actions.length > 0 ? (actions.filter(a => a.status === 'Concluído').length / actions.length) * 100 : 0
    };
  }, [actions]);

  const groupedActions = useMemo(() => {
      const formatter = useExecutiveFormatter();
    const groups = {
      'Estabilização': filteredActions.filter(a => a.phase === 'Estabilização'),
      'Otimização': filteredActions.filter(a => a.phase === 'Otimização'),
      'Expansão': filteredActions.filter(a => a.phase === 'Expansão')
    };
    return groups;
  }, [filteredActions]);

  const chartData = useMemo(() => {
      const formatter = useExecutiveFormatter();
    const statusData = [
      { name: 'Pendente', value: actions.filter(a => a.status === 'Pendente').length, color: 'var(--color-executive-primary)' },
      { name: 'Em curso', value: actions.filter(a => a.status === 'Em curso').length, color: 'var(--color-executive-primary)' },
      { name: 'Concluído', value: actions.filter(a => a.status === 'Concluído').length, color: 'var(--color-executive-primary)' },
      { name: 'Impedido', value: actions.filter(a => a.status === 'Impedido').length, color: 'var(--color-executive-primary)' },
    ];

    const priorityData = [
      { name: 'Crítica', value: actions.filter(a => a.priority === 'Crítica').length, color: 'var(--color-executive-primary)' },
      { name: 'Alta', value: actions.filter(a => a.priority === 'Alta').length, color: 'var(--color-executive-primary)' },
      { name: 'Média', value: actions.filter(a => a.priority === 'Média').length, color: 'var(--color-executive-primary)' },
      { name: 'Baixa', value: actions.filter(a => a.priority === 'Baixa').length, color: 'var(--color-executive-primary)' },
    ];

    return { statusData, priorityData };
  }, [actions]);

  return (
    <ExecutivePageTemplate header={{
      title: "Roadmap de Execução",
      description: "Acompanhamento tático de metas e soluções consultivas.",
    }}>
      <div className="space-y-10 pb-20">
        {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE PLANOS DE AÇÃO 5W2H) --- */}
        <ExecutiveSummarySection 
          className="mb-8"
          status={{ label: actions.length > 0 ? `${stats.concluidos}/${stats.total} Concluídos` : 'Sem Planos Cadastrados', variant: stats.overdue === 0 ? 'success' : 'critical' }}
          question="Qual a taxa de execução dos planos de ação 5W2H e os prazos em risco de atraso?"
          opinion="O comitê fiduciário homologa a esteira de execução dos planos de ação, acompanhando a evolução dos gargalos operacionais."
          driver="Status das tarefas, responsáveis, prazos limite, esforço em horas e prioridades."
          implication="Garantia de que os apontamentos de auditoria e comitês sejam convertidos em entregas concretas."
          executiveQuestion="Cobrar os responsáveis pelas tarefas em atraso e ajustar os prazos dos itens críticos."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>

       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">

         <div className="flex items-center gap-3">
          <div className="bg-surface-container p-1 rounded-sm flex gap-1 border border-border">
            <button 
              onClick={() => setView('list')}
              title="Lista"
              className={cn("p-2 rounded-sm transition-all", view === 'list' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
            >
              <List size={18} />
            </button>
            <button 
              onClick={() => setView('board')}
              title="Quadro Kanban"
              className={cn("p-2 rounded-sm transition-all", view === 'board' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setView('dashboard')}
              title="Gráficos & Insights"
              className={cn("p-2 rounded-sm transition-all", view === 'dashboard' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
            >
              <BarChart2 size={18} />
            </button>
          </div>
          
          <button 
            onClick={() => setShowAutomations(!showAutomations)}
            className={cn(
              "px-4 py-2 rounded-sm text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2 border shadow-sm",
              showAutomations 
                ? "bg-secondary/10 text-secondary border-secondary/20" 
                : "bg-card text-muted-foreground border-border hover:text-foreground"
            )}
          >
            <Zap size={14} className={showAutomations ? "fill-current" : ""} />
            <span className="hidden sm:inline">Automações</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={openAdd}
            className="btn-executive bg-primary shadow-xl shadow-primary/20"
          >
            <Plus size={16} /> NOVA TAREFA
           </button>
         </div>
       
      </div>

       <div className="mt-12 mb-8 border-t border-border pt-8" />
       <ExecutiveAccordion
         title="Roadmap de Execução"
         subtitle="Acompanhamento tático de metas e soluções consultivas."
         variant="analytics"
         defaultExpanded
       >

      {/* Monday-style Alerts & Automations Bar */}
      <AnimatePresence>
        {showAutomations && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="card-premium p-8 mb-10 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 bg-secondary h-full" />
              <div className="flex-1 space-y-4 relative z-10">
                <div className="flex items-center gap-3 text-secondary">
                  <Zap size={20} className="fill-current" />
                  <ExecutiveHeading as="h3">Automações Sugeridas</ExecutiveHeading>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Quando o status mudar para Concluído, arquivar após 7 dias.",
                    "Se a prioridade for Crítica, notificar o Advisor via e-mail.",
                    "Se o prazo estiver a 24h do vencimento, destacar card em vermelho.",
                    "Ao criar tarefa via Ata de Reunião, atribuir automaticamente ao consultor."
                  ].map((auto, idx) => (
                    <div key={idx} className="bg-card p-4 rounded-sm border border-border flex items-center justify-between group hover:border-secondary/30 transition-all cursor-pointer shadow-sm">
                      <ExecutiveText as="div" variant="bodyStandard" className="text-muted-foreground italic">{auto}</ExecutiveText>
                      <div className="w-8 h-4 bg-surface-container rounded-full relative transition-all group-hover:bg-secondary/20">
                        <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-card rounded-full shadow-sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full md:w-80 space-y-4 relative z-10">
                <div className="flex items-center gap-3 text-destructive">
                  <Bell size={20} />
                  <ExecutiveHeading as="h3">Alertas do Sistema</ExecutiveHeading>
                </div>
                <div className="space-y-3">
                  {stats.overdue > 0 && (
                    <div className="bg-destructive/5 border border-destructive/10 p-4 rounded-sm flex items-center gap-4 shadow-sm">
                      <AlertTriangle size={18} className="text-destructive" />
                      <div>
                        <ExecutiveText as="div" variant="bodyStandard" className="text-destructive">{stats.overdue} Tarefas Atrasadas</ExecutiveText>
                        <ExecutiveText as="div" variant="bodyStandard" className="text-destructive/60 italic">Revisar prazos imediatamente.</ExecutiveText>
                      </div>
                    </div>
                  )}
                  {stats.critical > 0 && (
                    <div className="bg-warning/5 border border-warning/10 p-4 rounded-sm flex items-center gap-4 shadow-sm">
                      <Activity size={18} className="text-warning" />
                      <div>
                        <ExecutiveText as="div" variant="bodyStandard" className="text-warning">{stats.critical} Ações Críticas</ExecutiveText>
                        <ExecutiveText as="div" variant="bodyStandard" className="text-warning/60 italic">Foco prioritário nesta semana.</ExecutiveText>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total de Ações', value: stats.total, icon: ClipboardCheck, color: 'text-foreground', bg: 'bg-surface-container' },
          { label: 'Em Execução', value: stats.emCurso, icon: Clock, color: 'text-secondary', bg: 'bg-secondary/5' },
          { label: 'Atrasadas', value: stats.overdue, icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/5' },
          { label: 'Progresso Geral', value: `${Math.round(stats.progresso)}%`, icon: TrendingUp, color: 'text-success', bg: 'bg-success/5' },
        ].map((stat, i) => (
          <div key={i} className="card-premium p-6 flex items-center gap-5 group relative overflow-hidden">
            <div className={cn("w-12 h-12 rounded-md flex items-center justify-center border border-border shadow-inner transition-transform group-hover:scale-110", stat.bg)}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <div className="relative z-10">
       <ExecutiveText as="div" variant="bodyStandard" className="text-executive-secondary">{stat.label}</ExecutiveText>
              <p className={cn("text-2xl font-medium tracking-tighter tabular-nums", stat.color)}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative flex-1 max-w-md">
          <input 
            type="text" 
            placeholder="Pesquisar tarefas, responsáveis ou origens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-surface-container border border-border rounded-sm text-[11px] font-medium uppercase tracking-widest outline-none focus:ring-1 focus:ring-secondary/20 transition-all shadow-inner italic"
          />
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
        </div>
      </div>

      {loading ? (
        <div className="py-32 flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
          <ExecutiveText as="div" variant="bodyStandard" className="text-text-dim">Carregando Roadmap...</ExecutiveText>
        </div>
      ) : actions.length === 0 ? (
        <div className="card-premium py-24 text-center space-y-6">
          <div className="w-20 h-20 bg-surface-container border border-border rounded-md flex items-center justify-center mx-auto text-muted-foreground/30 shadow-inner">
            <Target size={32} strokeWidth={1} />
          </div>
          <div className="space-y-2">
            <ExecutiveHeading as="h3" className="text-foreground">Plano de Voo Vazio</ExecutiveHeading>
            <ExecutiveText as="div" variant="bodyStandard" className="text-muted-foreground max-w-2xl mx-auto italic">Nenhuma ação estratégica definida. Crie tarefas ou registre uma ata de reunião para iniciar.</ExecutiveText>
          </div>
          <button onClick={openAdd} className="btn-executive mx-auto mt-4 shadow-sm">
            <Plus size={16} />
            Definir Prioridade
          </button>
        </div>
      ) : view === 'list' ? (
        <div className="space-y-12">
          {(Object.entries(groupedActions) as [ActionItem['phase'], ActionItem[]][]).map(([phase, items]) => {
              const formatter = useExecutiveFormatter();
            if (items.length === 0 && searchTerm) return null;
            
            const groupProgress = items.length > 0 
              ? (items.filter(a => a.status === 'Concluído').length / items.length) * 100 
              : 0;

            return (
              <div key={phase} className="space-y-4">
                <div className="flex items-center justify-between px-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-1 h-8 rounded-sm shadow-sm",
                      phase === 'Estabilização' ? "bg-blue-500" :
                      phase === 'Otimização' ? "bg-warning" : "bg-success"
                    )} />
                    <div>
                      <ExecutiveHeading as="h3" className="text-foreground flex items-center gap-3">
                        {phase}
                        <span className="text-[9px] text-muted-foreground font-medium bg-surface-container px-2 py-0.5 rounded-sm border border-border shadow-inner">
                          {items.length}
                        </span>
                      </ExecutiveHeading>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="w-32 h-1.5 bg-surface-container rounded-sm overflow-hidden border border-border shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${groupProgress}%` }}
                            className={cn(
                              "h-full transition-all shadow-premium",
                              phase === 'Estabilização' ? "bg-blue-500" :
                              phase === 'Otimização' ? "bg-warning" : "bg-success"
                            )}
                          />
                        </div>
                        <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest italic">{Math.round(groupProgress)}% Concluído</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="text-right">
            <ExecutiveText as="div" variant="bodyStandard" className="text-executive-secondary italic">Esforço Total</ExecutiveText>
                        <ExecutiveText as="div" variant="caption" className="text-foreground tabular-nums">{items.reduce((acc, i) => acc + (i.effort || 0), 0)}h</ExecutiveText>
                     </div>
                  </div>
                </div>

                <div className="card-premium p-0 overflow-hidden relative shadow-premium bg-card/50 backdrop-blur-md">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container/50 border-b border-border">
                        <th className="px-5 md:px-8 py-2.5 md:py-4 text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] w-1/3">Tarefa</th>
                        <th className="px-4 md:px-6 py-2.5 md:py-4 text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] text-center">Responsável</th>
                        <th className="px-4 md:px-6 py-2.5 md:py-4 text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] text-center">Prioridade</th>
                        <th className="px-4 md:px-6 py-2.5 md:py-4 text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] text-center">Prazo</th>
                        <th className="px-4 md:px-6 py-2.5 md:py-4 text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] text-center">Progresso</th>
                        <th className="px-5 md:px-8 py-2.5 md:py-4 text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] text-right">Status</th>
                        <th className="px-4 py-4 w-12"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {items.map((action) => {
                          const formatter = useExecutiveFormatter();
                        const isOverdue = action.status !== 'Concluído' && new Date(action.deadline) < new Date();
                        const isCritical = action.priority === 'Crítica';
                        
                        return (
                          <tr key={action.id} className={cn(
                            "hover:bg-surface-container/50 transition-colors group relative",
                            isOverdue && "bg-destructive/5"
                          )}>
                            <td className="px-5 md:px-8 py-3 md:py-5">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-3">
                                  <p className={cn(
                                    "text-[11px] font-medium text-foreground uppercase tracking-widest group-hover:text-secondary transition-colors",
                                    isCritical && "flex items-center gap-2"
                                  )}>
                                    {isCritical && <div className="w-1.5 h-1.5 bg-destructive rounded-sm animate-ping" />}
                                    {action.title}
                                  </p>
                                  {isOverdue && (
                                    <span className="px-2 py-0.5 bg-destructive text-white text-[7px] font-medium rounded-sm uppercase tracking-widest shadow-sm">Atrasado</span>
                                  )}
                                </div>
                                {action.originTitle && (
                 <span className="text-[9px] font-medium text-secondary flex items-center gap-1.5 italic uppercase tracking-widest">
                                    <MessageSquare size={10} /> {action.originTitle}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex flex-col items-center gap-1">
                                <div className="w-7 h-7 rounded-sm bg-surface-container border border-border flex items-center justify-center text-[9px] font-medium text-muted-foreground uppercase shadow-inner">
                                  {action.responsible[0]}
                                </div>
                                <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest italic">{action.responsible}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-center">
                              <div className="flex justify-center">
                                <span className={cn(
                                  "px-3 py-1 rounded-sm text-[8px] font-medium uppercase tracking-widest shadow-sm",
                                  action.priority === 'Crítica' ? "bg-destructive text-white" :
                                  action.priority === 'Alta' ? "bg-warning text-white" :
                                  action.priority === 'Média' ? "bg-blue-500 text-white" :
                                  "bg-muted-foreground/40 text-white"
                                )}>
                                  {action.priority}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-center">
                              <div className="flex flex-col items-center">
                                 <p className={cn("text-[10px] font-medium uppercase tracking-widest tabular-nums", isOverdue ? "text-destructive" : "text-foreground")}>
                                   {formatter.date(action.deadline, { day: '2-digit', month: 'short' })}
                                 </p>
                 <ExecutiveText as="div" variant="bodyStandard" className="text-executive-secondary italic tabular-nums">{action.effort || 0}h esforço</ExecutiveText>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-center">
                               <div className="flex flex-col items-center gap-2">
                                  <div className="w-20 h-1.5 bg-surface-container rounded-sm overflow-hidden border border-border shadow-inner">
                                    <div 
                                      className="h-full bg-secondary transition-all shadow-premium" 
                                      style={{ width: `${action.status === 'Concluído' ? 100 : (action.progress || 0)}%` }}
                                    />
                                  </div>
                                  <span className="text-[9px] font-medium text-muted-foreground tabular-nums italic">{action.status === 'Concluído' ? '100' : (action.progress || 0)}%</span>
                               </div>
                            </td>
                            <td className="px-5 md:px-8 py-3 md:py-5 text-right">
                              <div className="flex justify-end">
                                <span className={cn(
                                  "px-4 py-2 rounded-sm text-[9px] font-medium uppercase tracking-widest text-white min-w-[110px] text-center shadow-premium",
                                  action.status === 'Concluído' ? "bg-success" :
                                  action.status === 'Em curso' ? "bg-secondary" :
                                  action.status === 'Impedido' ? "bg-destructive" :
                                  "bg-muted-foreground/40"
                                )}>
                                  {action.status}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-5">
                              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEdit(action)} className="p-1.5 text-muted-foreground/60 hover:text-secondary rounded-sm transition-all"><Edit3 size={14} /></button>
                                <button onClick={() => action.id && handleDelete(action.id)} className="p-1.5 text-muted-foreground/60 hover:text-destructive rounded-sm transition-all"><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      ) : view === 'board' ? (
        /* Board View */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 h-full min-h-[600px]">
          {['Pendente', 'Em curso', 'Impedido', 'Concluído'].map((status) => (
            <div key={status} className="flex flex-col gap-6">
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-2 h-2 rounded-sm shadow-sm",
                    status === 'Concluído' ? "bg-success" :
                    status === 'Em curso' ? "bg-secondary" :
                    status === 'Impedido' ? "bg-destructive" : "bg-muted-foreground/40"
                  )} />
                  <ExecutiveHeading as="h4" className="text-foreground">{status}</ExecutiveHeading>
                </div>
                <span className="text-[9px] font-medium text-muted-foreground bg-surface-container px-2 py-0.5 rounded-sm border border-border shadow-inner">
                  {actions.filter(a => a.status === status).length}
                </span>
              </div>
              
              <div className="flex-1 space-y-4 p-4 bg-surface-container/30 rounded-md border border-dashed border-border overflow-y-auto custom-scrollbar">
                {actions.filter(a => a.status === status).map((action) => {
                    const formatter = useExecutiveFormatter();
                  const isOverdue = action.status !== 'Concluído' && new Date(action.deadline) < new Date();
                  return (
                    <motion.div 
                      key={action.id}
                      layoutId={action.id}
                      className={cn(
                        "card-premium p-5 space-y-4 group relative cursor-pointer",
                        isOverdue && "border-destructive/20 bg-destructive/5"
                      )}
                      onClick={() => openEdit(action)}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex flex-col gap-1">
                          <span className={cn(
                            "px-2 py-0.5 rounded-sm text-[7px] font-medium uppercase tracking-widest w-fit shadow-sm",
                            action.priority === 'Crítica' ? "bg-destructive text-white" :
                            action.priority === 'Alta' ? "bg-warning text-white" :
                            "bg-blue-500 text-white"
                          )}>
                            {action.priority}
                          </span>
                          {isOverdue && (
                            <span className="text-[7px] font-medium text-destructive uppercase tracking-widest italic">Atrasado</span>
                          )}
                        </div>
      <p className="text-[8px] font-medium text-executive-secondary uppercase tracking-widest italic ">
                          {action.phase}
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <h5 className="text-[11px] font-medium text-foreground uppercase tracking-widest leading-tight group-hover:text-secondary transition-colors">{action.title}</h5>
                        <ExecutiveText as="div" variant="bodyStandard" className="text-muted-foreground line-clamp-2 italic">{action.desc}</ExecutiveText>
                      </div>

                      <div className="mt-12 pt-4 border-t border-border/50 flex items-center justify-between pt-8 mb-8">
                         <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-sm bg-surface-container border border-border flex items-center justify-center text-[8px] font-medium text-muted-foreground uppercase shadow-inner">
                              {action.responsible[0]}
                            </div>
                            <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest italic">{action.responsible}</span>
                         </div>
                         <div className={cn("flex items-center gap-1.5", isOverdue ? "text-destructive" : "text-muted-foreground/60")}>
                            <Calendar size={10} />
                            <span className="text-[9px] font-medium uppercase tracking-widest tabular-nums">{formatter.date(action.deadline, { day: '2-digit', month: 'short' })}</span>
                         </div>
                      </div>
                    </motion.div>
                  );
                })}
                {actions.filter(a => a.status === status).length === 0 && (
                  <div className="py-10 text-center">
          <ExecutiveText as="div" variant="bodyStandard" className="text-executive-secondary/40 italic">Nenhuma tarefa</ExecutiveText>
                  </div>
                )}
                <button 
                  onClick={() => {
                              const formatter = useExecutiveFormatter(); resetForm(); setFormData(prev => ({...prev, status: status as any})); setIsFormOpen(true); }}
                  className="w-full py-4 rounded-sm border border-dashed border-border text-muted-foreground/40 hover:text-secondary hover:border-secondary hover:bg-surface-container transition-all text-[9px] font-medium uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm"
                >
                  <Plus size={14} /> Adicionar Item
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Dashboard / Analytics View */
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-premium p-8 space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <ExecutiveHeading as="h3" className="text-foreground">Distribuição por Status</ExecutiveHeading>
         <ExecutiveText as="div" variant="bodyStandard" className="text-executive-secondary mt-1 italic">Visão geral do progresso operacional</ExecutiveText>
                </div>
                <Activity size={20} className="text-secondary" />
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'var(--color-surface-container)', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card-premium p-8 space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <ExecutiveHeading as="h3" className="text-foreground">Prioridades Estratégicas</ExecutiveHeading>
         <ExecutiveText as="div" variant="bodyStandard" className="text-executive-secondary mt-1 italic">Concentração de urgência e impacto</ExecutiveText>
                </div>
                <Flag size={20} className="text-destructive" />
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.priorityData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                    <RechartsTooltip 
                      cursor={{ fill: 'var(--color-executive-primary)' }}
                      contentStyle={{ backgroundColor: 'var(--color-surface-container)', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {chartData.priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="card-premium p-8 space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between relative z-10">
              <div>
                <ExecutiveHeading as="h3" className="text-foreground">Linha do Tempo de Produtividade</ExecutiveHeading>
        <ExecutiveText as="div" variant="bodyStandard" className="text-executive-secondary mt-1 italic">Acompanhamento de entregas nos últimos meses</ExecutiveText>
              </div>
              <TrendingUp size={20} className="text-success" />
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { month: 'Jan', done: 4, pending: 8 },
                  { month: 'Fev', done: 7, pending: 6 },
                  { month: 'Mar', done: 12, pending: 4 },
                  { month: 'Abr', done: 9, pending: 10 },
                  { month: 'Mai', done: 15, pending: 3 },
                ]}>
                  <defs>
                    <linearGradient id="colorDone" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-executive-primary)" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="var(--color-executive-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--color-surface-container)', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="done" stroke="currentColor" fillOpacity={1} fill="url(#colorDone)" strokeWidth={3} />
                  <Area type="monotone" dataKey="pending" stroke="currentColor" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Task Modal (Form) */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-card rounded-md shadow-premium overflow-hidden border border-border max-h-[90vh] flex flex-col"
            >
              <div className="px-10 py-8 bg-surface-container border-b border-border flex items-center justify-between shrink-0">
                <div>
                  <ExecutiveHeading as="h3" className="text-foreground">
                    {editingId ? 'Editar Prioridade' : 'Nova Ação Tática'}
                  </ExecutiveHeading>
                  <ExecutiveText as="div" variant="bodyStandard" className="text-muted-foreground mt-1 italic">Definição de objetivos e responsáveis</ExecutiveText>
                </div>
                <button onClick={() => setIsFormOpen(false)} className="p-2 text-muted-foreground/60 hover:text-destructive rounded-sm transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="p-10 space-y-8 overflow-y-auto custom-scrollbar">
                <div className="space-y-3">
                  <label className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest block px-1 italic">Título da Tarefa</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="O que precisa ser feito?"
                    className="w-full px-5 py-3 bg-surface-container border border-border rounded-sm text-[11px] font-medium uppercase tracking-widest outline-none focus:ring-1 focus:ring-secondary/20 transition-all shadow-inner italic"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest block px-1 italic">Responsável</label>
                    <input 
                      type="text" 
                      value={formData.responsible}
                      onChange={(e) => setFormData({...formData, responsible: e.target.value})}
                      placeholder="Nome do dono"
                      className="w-full px-5 py-3 bg-surface-container border border-border rounded-sm text-[11px] font-medium uppercase tracking-widest outline-none focus:ring-1 focus:ring-secondary/20 transition-all shadow-inner italic"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest block px-1 italic">Prazo Final</label>
                    <input 
                      type="date" 
                      value={formData.deadline}
                      onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                      className="w-full px-5 py-3 bg-surface-container border border-border rounded-sm text-[11px] font-medium uppercase tracking-widest outline-none focus:ring-1 focus:ring-secondary/20 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest block px-1 italic">Fase do Roadmap</label>
                    <select 
                      value={formData.phase}
                      onChange={(e) => setFormData({...formData, phase: e.target.value as any})}
                      className="w-full px-5 py-3 bg-surface-container border border-border rounded-sm text-[10px] font-medium uppercase tracking-[0.2em] outline-none focus:ring-1 focus:ring-secondary/20 transition-all shadow-inner"
                    >
                      <option value="Estabilização">Fase 1: Estabilização</option>
                      <option value="Otimização">Fase 2: Otimização</option>
                      <option value="Expansão">Fase 3: Expansão</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest block px-1 italic">Prioridade Estratégica</label>
                    <select 
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                      className="w-full px-5 py-3 bg-surface-container border border-border rounded-sm text-[10px] font-medium uppercase tracking-[0.2em] outline-none focus:ring-1 focus:ring-secondary/20 transition-all shadow-inner"
                    >
                      <option value="Baixa">Baixa</option>
                      <option value="Média">Média</option>
                      <option value="Alta">Alta</option>
                      <option value="Crítica">Crítica</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest block px-1 italic">Descrição / Contexto (Opcional)</label>
                  <textarea 
                    rows={3}
                    value={formData.desc}
                    onChange={(e) => setFormData({...formData, desc: e.target.value})}
                    placeholder="Detalhes adicionais sobre a execução..."
                    className="w-full px-5 py-3 bg-surface-container border border-border rounded-sm text-[11px] font-medium outline-none focus:ring-1 focus:ring-secondary/20 transition-all leading-relaxed shadow-inner italic"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest block px-1 italic">Esforço Estimado (Horas)</label>
                    <input 
                      type="number" 
                      value={formData.effort}
                      onChange={(e) => setFormData({...formData, effort: Number(e.target.value)})}
                      className="w-full px-5 py-3 bg-surface-container border border-border rounded-sm text-[11px] font-medium uppercase tracking-widest outline-none focus:ring-1 focus:ring-secondary/20 transition-all shadow-inner tabular-nums tracking-tighter"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest block px-1 italic">Progresso Atual (%)</label>
                    <input 
                      type="range" 
                      min="0" max="100" step="5"
                      value={formData.progress}
                      onChange={(e) => setFormData({...formData, progress: Number(e.target.value)})}
                      className="w-full h-10 accent-secondary cursor-pointer"
                    />
                    <div className="text-right text-[10px] font-medium text-secondary uppercase tracking-widest tabular-nums italic">{formData.progress}%</div>
                  </div>
                </div>

                <div className="mt-12 pt-6 border-t border-border/50 flex justify-end gap-4 shrink-0 pt-8 mb-8">
                   <button onClick={() => setIsFormOpen(false)} className="px-5 md:px-8 py-2 md:py-3 text-[10px] font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">Cancelar</button>
                   <button onClick={handleSave} className="btn-executive bg-executive shadow-premium">
                     <Save size={18} />
                     Salvar Ação
                   </button>
                </div>
               </div>
             </motion.div>
           </div>
         )}
       </AnimatePresence>
        <ExecutiveSummarySection 
          status={{ label: 'Plano em Execução', variant: 'success' }}
          question="Qual o andamento e a eficácia da execução das ações estratégicas?"
          opinion="O comitê fiduciário valida a evolução das tarefas táticas e o nível de engajamento dos responsáveis."
          driver="Status das ações, prazos de entrega, esforço e responsáveis."
          implication="Garantia do cumprimento do planejamento estratégico dentro do cronograma."
          executiveQuestion="Realizar reuniões semanais de acompanhamento dos planos atrasados ou críticos."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>
       </ExecutiveAccordion>
     </div>
    </ExecutivePageTemplate>
   );
 }
