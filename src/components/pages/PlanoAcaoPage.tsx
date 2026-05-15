import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Target, 
  Printer, 
  CheckCircle2, 
  ClipboardCheck, 
  Clock, 
  AlertCircle, 
  Users, 
  Calendar,
  ChevronRight,
  MoreHorizontal,
  Trash2,
  Edit3,
  Filter,
  CheckCircle,
  X,
  Save,
  Flag,
  LayoutGrid,
  List,
  MessageSquare,
  BarChart2,
  Zap,
  Bell,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Activity,
  Filter as FilterIcon,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PieChart, Pie, Cell, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { collection, query, where, getDocs, addDoc, serverTimestamp, updateDoc, doc, deleteDoc, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { PageHeader, StatusBadge } from '../Common';
import { cn } from '../../lib/utils';
import { useDataTable } from '../../hooks/useDataTable';

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
  const [view, setView] = useState<'list' | 'board' | 'dashboard' | 'form'>('list');
  const [loading, setLoading] = useState(true);
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showAutomations, setShowAutomations] = useState(false);
  
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
    if (!clientId) return;

    setLoading(true);
    const q = query(
      collection(db, 'action_items'),
      where('clientId', '==', clientId),
      orderBy('deadline', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActionItem));
      setActions(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching actions:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [clientId]);

  // Integration: Handle pending action from Indicators
  useEffect(() => {
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
    if (!window.confirm('Excluir esta tarefa permanentemente?')) return;
    try {
      await deleteDoc(doc(db, 'action_items', id));
    } catch (error) {
      console.error("Error deleting action item:", error);
    }
  };

  const updateStatus = async (id: string, newStatus: ActionItem['status']) => {
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
    resetForm();
    setEditingId(null);
    setIsFormOpen(true);
  };

  const openEdit = (action: ActionItem) => {
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
    const groups = {
      'Estabilização': filteredActions.filter(a => a.phase === 'Estabilização'),
      'Otimização': filteredActions.filter(a => a.phase === 'Otimização'),
      'Expansão': filteredActions.filter(a => a.phase === 'Expansão')
    };
    return groups;
  }, [filteredActions]);

  const chartData = useMemo(() => {
    const statusData = [
      { name: 'Pendente', value: actions.filter(a => a.status === 'Pendente').length, color: '#94a3b8' },
      { name: 'Em curso', value: actions.filter(a => a.status === 'Em curso').length, color: '#ff8552' },
      { name: 'Concluído', value: actions.filter(a => a.status === 'Concluído').length, color: '#10b981' },
      { name: 'Impedido', value: actions.filter(a => a.status === 'Impedido').length, color: '#ef4444' },
    ];

    const priorityData = [
      { name: 'Crítica', value: actions.filter(a => a.priority === 'Crítica').length, color: '#ef4444' },
      { name: 'Alta', value: actions.filter(a => a.priority === 'Alta').length, color: '#f59e0b' },
      { name: 'Média', value: actions.filter(a => a.priority === 'Média').length, color: '#3b82f6' },
      { name: 'Baixa', value: actions.filter(a => a.priority === 'Baixa').length, color: '#64748b' },
    ];

    return { statusData, priorityData };
  }, [actions]);

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <PageHeader 
          title="Roadmap de Execução" 
          subtitle="Acompanhamento tático de metas e soluções consultivas."
        />
        <div className="flex items-center gap-4">
           <div className="flex bg-bg-surface p-1 rounded-xl border border-border-main">
              <button 
                onClick={() => setView('list')}
                title="Lista"
                className={cn("p-2 rounded-lg transition-all", view === 'list' ? "bg-white text-secondary shadow-sm" : "text-text-dim hover:text-text-main")}
              >
                <List size={18} />
              </button>
              <button 
                onClick={() => setView('board')}
                title="Quadro Kanban"
                className={cn("p-2 rounded-lg transition-all", view === 'board' ? "bg-white text-secondary shadow-sm" : "text-text-dim hover:text-text-main")}
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setView('dashboard')}
                title="Gráficos & Insights"
                className={cn("p-2 rounded-lg transition-all", view === 'dashboard' ? "bg-white text-secondary shadow-sm" : "text-text-dim hover:text-text-main")}
              >
                <BarChart2 size={18} />
              </button>
           </div>
           
           <button 
             onClick={() => setShowAutomations(!showAutomations)}
             className={cn("btn-ghost px-4 gap-2", showAutomations && "bg-secondary/10 text-secondary border-secondary/20")}
           >
             <Zap size={18} className={showAutomations ? "fill-current" : ""} />
             <span className="hidden sm:inline">Automações</span>
           </button>

           <button onClick={openAdd} className="btn-accent px-8">
             <Plus size={18} />
             Nova Tarefa
           </button>
        </div>
      </div>

      {/* Monday-style Alerts & Automations Bar */}
      <AnimatePresence>
        {showAutomations && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-bg-surface border border-secondary/20 rounded-[2rem] p-8 mb-10 flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3 text-secondary">
                  <Zap size={20} className="fill-current" />
                  <h3 className="text-sm font-black uppercase tracking-widest">Automações Sugeridas</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Quando o status mudar para Concluído, arquivar após 7 dias.",
                    "Se a prioridade for Crítica, notificar o Advisor via e-mail.",
                    "Se o prazo estiver a 24h do vencimento, destacar card em vermelho.",
                    "Ao criar tarefa via Ata de Reunião, atribuir automaticamente ao consultor."
                  ].map((auto, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-border-soft flex items-center justify-between group hover:border-secondary/30 transition-all cursor-pointer">
                      <p className="text-[11px] font-medium text-text-muted">{auto}</p>
                      <div className="w-8 h-4 bg-slate-100 rounded-full relative transition-all group-hover:bg-secondary/20">
                        <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full md:w-80 space-y-4">
                <div className="flex items-center gap-3 text-rose-500">
                  <Bell size={20} />
                  <h3 className="text-sm font-black uppercase tracking-widest">Alertas do Sistema</h3>
                </div>
                <div className="space-y-3">
                  {stats.overdue > 0 && (
                    <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center gap-4">
                      <AlertTriangle size={18} className="text-rose-500" />
                      <div>
                        <p className="text-xs font-black text-rose-700">{stats.overdue} Tarefas Atrasadas</p>
                        <p className="text-[10px] text-rose-600 font-medium">Revisar prazos imediatamente.</p>
                      </div>
                    </div>
                  )}
                  {stats.critical > 0 && (
                    <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-center gap-4">
                      <Activity size={18} className="text-amber-500" />
                      <div>
                        <p className="text-xs font-black text-amber-700">{stats.critical} Ações Críticas</p>
                        <p className="text-[10px] text-amber-600 font-medium">Foco prioritário nesta semana.</p>
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
          { label: 'Total de Ações', value: stats.total, icon: ClipboardCheck, color: 'text-text-main', bg: 'bg-slate-50' },
          { label: 'Em Execução', value: stats.emCurso, icon: Clock, color: 'text-secondary', bg: 'bg-orange-50' },
          { label: 'Atrasadas', value: stats.overdue, icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50' },
          { label: 'Progresso Geral', value: `${Math.round(stats.progresso)}%`, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        ].map((stat, i) => (
          <div key={i} className="card-premium p-6 flex items-center gap-5 group hover:border-secondary/20 transition-all">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border border-border-soft shadow-sm transition-transform group-hover:scale-110", stat.bg)}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <div>
              <p className="text-[10px] font-black text-text-dim uppercase tracking-widest">{stat.label}</p>
              <p className={cn("text-2xl font-display font-black", stat.color)}>{stat.value}</p>
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
            className="w-full pl-12 pr-6 py-4 bg-bg-card border border-border-main rounded-2xl text-sm outline-none focus:border-secondary transition-all shadow-inner-soft"
          />
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" />
        </div>
      </div>

      {loading ? (
        <div className="py-32 flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-text-dim">Carregando Roadmap...</p>
        </div>
      ) : actions.length === 0 ? (
        <div className="card-premium py-24 text-center space-y-6">
          <div className="w-20 h-20 bg-bg-surface border border-border-main rounded-[2.5rem] flex items-center justify-center mx-auto text-text-dim/30 shadow-inner-soft">
            <Target size={32} strokeWidth={1} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-display font-black text-text-main uppercase tracking-widest">Plano de Voo Vazio</h3>
            <p className="text-xs text-text-muted font-medium uppercase tracking-[0.2em] max-w-xs mx-auto leading-relaxed">Nenhuma ação estratégica definida. Crie tarefas ou registre uma ata de reunião para iniciar.</p>
          </div>
          <button onClick={openAdd} className="btn-executive py-3 px-8 mx-auto mt-4">
            <Plus size={16} />
            Definir Prioridade
          </button>
        </div>
      ) : view === 'list' ? (
        <div className="space-y-12">
          {(Object.entries(groupedActions) as [ActionItem['phase'], ActionItem[]][]).map(([phase, items]) => {
            if (items.length === 0 && searchTerm) return null;
            
            const groupProgress = items.length > 0 
              ? (items.filter(a => a.status === 'Concluído').length / items.length) * 100 
              : 0;

            return (
              <div key={phase} className="space-y-4">
                <div className="flex items-center justify-between px-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-1 h-8 rounded-full",
                      phase === 'Estabilização' ? "bg-blue-500" :
                      phase === 'Otimização' ? "bg-amber-500" : "bg-emerald-500"
                    )} />
                    <div>
                      <h3 className="text-sm font-black text-text-main uppercase tracking-widest flex items-center gap-3">
                        {phase}
                        <span className="text-[10px] text-text-dim font-bold bg-bg-surface px-2 py-0.5 rounded-full border border-border-main">
                          {items.length}
                        </span>
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="w-32 h-1 bg-bg-surface rounded-full overflow-hidden border border-border-soft">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${groupProgress}%` }}
                            className={cn(
                              "h-full transition-all",
                              phase === 'Estabilização' ? "bg-blue-500" :
                              phase === 'Otimização' ? "bg-amber-500" : "bg-emerald-500"
                            )}
                          />
                        </div>
                        <span className="text-[9px] font-black text-text-dim uppercase">{Math.round(groupProgress)}% Concluído</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="text-right">
                        <p className="text-[10px] font-black text-text-dim uppercase tracking-widest">Esforço Total</p>
                        <p className="text-xs font-black text-text-main">{items.reduce((acc, i) => acc + (i.effort || 0), 0)}h</p>
                     </div>
                  </div>
                </div>

                <div className="card-premium p-0 overflow-hidden border-none shadow-floating bg-white/50 backdrop-blur-md">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-bg-surface/50 border-b border-border-main">
                        <th className="px-8 py-4 text-[9px] font-black text-text-dim uppercase tracking-widest w-1/3">Tarefa</th>
                        <th className="px-6 py-4 text-[9px] font-black text-text-dim uppercase tracking-widest text-center">Responsável</th>
                        <th className="px-6 py-4 text-[9px] font-black text-text-dim uppercase tracking-widest text-center">Prioridade</th>
                        <th className="px-6 py-4 text-[9px] font-black text-text-dim uppercase tracking-widest text-center">Prazo</th>
                        <th className="px-6 py-4 text-[9px] font-black text-text-dim uppercase tracking-widest text-center">Progresso</th>
                        <th className="px-8 py-4 text-[9px] font-black text-text-dim uppercase tracking-widest text-right">Status</th>
                        <th className="px-4 py-4 w-12"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-soft">
                      {items.map((action) => {
                        const isOverdue = action.status !== 'Concluído' && new Date(action.deadline) < new Date();
                        const isCritical = action.priority === 'Crítica';
                        
                        return (
                          <tr key={action.id} className={cn(
                            "hover:bg-bg-surface/80 transition-colors group relative",
                            isOverdue && "bg-rose-50/10"
                          )}>
                            <td className="px-8 py-5">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-3">
                                  <p className={cn(
                                    "text-sm font-bold text-text-main group-hover:text-secondary transition-colors",
                                    isCritical && "flex items-center gap-2"
                                  )}>
                                    {isCritical && <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />}
                                    {action.title}
                                  </p>
                                  {isOverdue && (
                                    <span className="px-2 py-0.5 bg-rose-500 text-white text-[8px] font-black rounded uppercase tracking-widest">Atrasado</span>
                                  )}
                                </div>
                                {action.originTitle && (
                                  <span className="text-[10px] font-bold text-primary flex items-center gap-1.5 italic opacity-70">
                                    <MessageSquare size={10} /> {action.originTitle}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex flex-col items-center gap-1">
                                <div className="w-7 h-7 rounded-full bg-slate-100 border border-border-main flex items-center justify-center text-[10px] font-black text-text-dim">
                                  {action.responsible[0]}
                                </div>
                                <span className="text-[10px] font-bold text-text-dim truncate max-w-[80px]">{action.responsible}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-center">
                              <div className="flex justify-center">
                                <span className={cn(
                                  "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                                  action.priority === 'Crítica' ? "bg-rose-500 text-white" :
                                  action.priority === 'Alta' ? "bg-orange-400 text-white" :
                                  action.priority === 'Média' ? "bg-blue-400 text-white" :
                                  "bg-slate-400 text-white"
                                )}>
                                  {action.priority}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-center">
                              <div className="flex flex-col items-center">
                                 <p className={cn("text-[11px] font-black", isOverdue ? "text-rose-500" : "text-text-main")}>
                                   {new Date(action.deadline).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                 </p>
                                 <p className="text-[9px] font-bold text-text-dim uppercase tracking-tighter">{action.effort || 0}h esforço</p>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-center">
                               <div className="flex flex-col items-center gap-2">
                                  <div className="w-20 h-1.5 bg-bg-surface rounded-full overflow-hidden border border-border-soft">
                                    <div 
                                      className="h-full bg-secondary transition-all" 
                                      style={{ width: `${action.status === 'Concluído' ? 100 : (action.progress || 0)}%` }}
                                    />
                                  </div>
                                  <span className="text-[9px] font-black text-text-dim">{action.status === 'Concluído' ? '100' : (action.progress || 0)}%</span>
                               </div>
                            </td>
                            <td className="px-8 py-5 text-right">
                              <div className="flex justify-end">
                                <span className={cn(
                                  "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white min-w-[110px] text-center shadow-sm",
                                  action.status === 'Concluído' ? "bg-emerald-500" :
                                  action.status === 'Em curso' ? "bg-secondary" :
                                  action.status === 'Impedido' ? "bg-rose-500" :
                                  "bg-slate-400"
                                )}>
                                  {action.status}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-5">
                              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEdit(action)} className="p-1.5 text-text-dim hover:text-secondary rounded-lg"><Edit3 size={14} /></button>
                                <button onClick={() => action.id && handleDelete(action.id)} className="p-1.5 text-text-dim hover:text-rose-500 rounded-lg"><Trash2 size={14} /></button>
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
                    "w-2 h-2 rounded-full",
                    status === 'Concluído' ? "bg-emerald-500" :
                    status === 'Em curso' ? "bg-secondary" :
                    status === 'Impedido' ? "bg-rose-500" : "bg-text-dim"
                  )} />
                  <h4 className="text-[11px] font-black text-text-main uppercase tracking-[0.2em]">{status}</h4>
                </div>
                <span className="text-[10px] font-black text-text-dim bg-bg-surface px-2 py-0.5 rounded-full border border-border-main">
                  {actions.filter(a => a.status === status).length}
                </span>
              </div>
              
              <div className="flex-1 space-y-4 p-2 bg-bg-surface/30 rounded-3xl border-2 border-dashed border-border-main/50 overflow-y-auto">
                {actions.filter(a => a.status === status).map((action) => {
                  const isOverdue = action.status !== 'Concluído' && new Date(action.deadline) < new Date();
                  return (
                    <motion.div 
                      key={action.id}
                      layoutId={action.id}
                      className={cn(
                        "card-premium p-5 space-y-4 hover:border-secondary/40 transition-all group relative cursor-pointer",
                        isOverdue && "border-rose-200 bg-rose-50/30"
                      )}
                      onClick={() => openEdit(action)}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex flex-col gap-1">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest w-fit",
                            action.priority === 'Crítica' ? "bg-rose-100 text-rose-600" :
                            action.priority === 'Alta' ? "bg-orange-100 text-orange-600" :
                            "bg-blue-100 text-blue-600"
                          )}>
                            {action.priority}
                          </span>
                          {isOverdue && (
                            <span className="text-[7px] font-black text-rose-600 uppercase tracking-widest">Atrasado</span>
                          )}
                        </div>
                        <p className="text-[9px] font-black text-text-dim uppercase tracking-tighter italic">
                          {action.phase}
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <h5 className="text-xs font-black text-text-main leading-tight group-hover:text-secondary transition-colors">{action.title}</h5>
                        <p className="text-[10px] text-text-muted font-medium line-clamp-2 leading-relaxed">{action.desc}</p>
                      </div>

                      <div className="pt-4 border-t border-border-soft flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[8px] font-black text-white uppercase">
                              {action.responsible[0]}
                            </div>
                            <span className="text-[10px] font-bold text-text-dim">{action.responsible}</span>
                         </div>
                         <div className={cn("flex items-center gap-1.5", isOverdue ? "text-rose-500" : "text-text-dim")}>
                            <Calendar size={10} />
                            <span className="text-[10px] font-bold">{new Date(action.deadline).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                         </div>
                      </div>
                    </motion.div>
                  );
                })}
                <button 
                  onClick={() => { resetForm(); setFormData(prev => ({...prev, status: status as any})); setIsFormOpen(true); }}
                  className="w-full py-4 rounded-2xl border border-dashed border-border-main text-text-dim hover:text-secondary hover:border-secondary hover:bg-bg-card transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
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
            <div className="card-premium p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-text-main">Distribuição por Status</h3>
                  <p className="text-[10px] text-text-dim font-bold uppercase tracking-widest mt-1">Visão geral do progresso operacional</p>
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
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card-premium p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-text-main">Prioridades Estratégicas</h3>
                  <p className="text-[10px] text-text-dim font-bold uppercase tracking-widest mt-1">Concentração de urgência e impacto</p>
                </div>
                <Flag size={20} className="text-rose-500" />
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.priorityData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                    <RechartsTooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
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

          <div className="card-premium p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-text-main">Linha do Tempo de Produtividade</h3>
                <p className="text-[10px] text-text-dim font-bold uppercase tracking-widest mt-1">Acompanhamento de entregas nos últimos meses</p>
              </div>
              <TrendingUp size={20} className="text-emerald-500" />
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
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="done" stroke="#10b981" fillOpacity={1} fill="url(#colorDone)" strokeWidth={3} />
                  <Area type="monotone" dataKey="pending" stroke="#94a3b8" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
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
              className="relative w-full max-w-2xl bg-bg-card rounded-[2.5rem] shadow-2xl overflow-hidden border border-border-main"
            >
              <div className="px-10 py-8 bg-bg-surface border-b border-border-main flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-display font-black text-text-main uppercase tracking-widest">
                    {editingId ? 'Editar Prioridade' : 'Nova Ação Tática'}
                  </h3>
                  <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em] mt-1">Definição de objetivos e responsáveis</p>
                </div>
                <button onClick={() => setIsFormOpen(false)} className="p-2 text-text-dim hover:text-rose-500 rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="p-10 space-y-8">
                <div className="space-y-4">
                  <label className="text-label">Título da Tarefa</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="O que precisa ser feito?"
                    className="w-full px-5 py-3 bg-bg-surface border border-border-main rounded-xl text-sm font-bold outline-none focus:border-secondary transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="text-label">Responsável</label>
                    <input 
                      type="text" 
                      value={formData.responsible}
                      onChange={(e) => setFormData({...formData, responsible: e.target.value})}
                      placeholder="Nome do dono"
                      className="w-full px-5 py-3 bg-bg-surface border border-border-main rounded-xl text-sm font-bold outline-none focus:border-secondary transition-all"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-label">Prazo Final</label>
                    <input 
                      type="date" 
                      value={formData.deadline}
                      onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                      className="w-full px-5 py-3 bg-bg-surface border border-border-main rounded-xl text-sm font-bold outline-none focus:border-secondary transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="text-label">Fase do Roadmap</label>
                    <select 
                      value={formData.phase}
                      onChange={(e) => setFormData({...formData, phase: e.target.value as any})}
                      className="w-full px-5 py-3 bg-bg-surface border border-border-main rounded-xl text-sm font-black uppercase tracking-widest outline-none focus:border-secondary transition-all"
                    >
                      <option value="Estabilização">Fase 1: Estabilização</option>
                      <option value="Otimização">Fase 2: Otimização</option>
                      <option value="Expansão">Fase 3: Expansão</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-label">Prioridade Estratégica</label>
                    <select 
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                      className="w-full px-5 py-3 bg-bg-surface border border-border-main rounded-xl text-sm font-black uppercase tracking-widest outline-none focus:border-secondary transition-all"
                    >
                      <option value="Baixa">Baixa</option>
                      <option value="Média">Média</option>
                      <option value="Alta">Alta</option>
                      <option value="Crítica">Crítica</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-label">Descrição / Contexto (Opcional)</label>
                  <textarea 
                    rows={3}
                    value={formData.desc}
                    onChange={(e) => setFormData({...formData, desc: e.target.value})}
                    placeholder="Detalhes adicionais sobre a execução..."
                    className="w-full px-5 py-3 bg-bg-surface border border-border-main rounded-xl text-sm outline-none focus:border-secondary transition-all leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="text-label">Esforço Estimado (Horas)</label>
                    <input 
                      type="number" 
                      value={formData.effort}
                      onChange={(e) => setFormData({...formData, effort: Number(e.target.value)})}
                      className="w-full px-5 py-3 bg-bg-surface border border-border-main rounded-xl text-sm font-bold outline-none focus:border-secondary transition-all"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-label">Progresso Atual (%)</label>
                    <input 
                      type="range" 
                      min="0" max="100" step="5"
                      value={formData.progress}
                      onChange={(e) => setFormData({...formData, progress: Number(e.target.value)})}
                      className="w-full h-10 accent-secondary"
                    />
                    <div className="text-right text-[10px] font-black text-secondary">{formData.progress}%</div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border-soft flex justify-end gap-4">
                   <button onClick={() => setIsFormOpen(false)} className="btn-ghost px-8">Cancelar</button>
                   <button onClick={handleSave} className="btn-accent px-12">
                     <Save size={18} />
                     Salvar Ação
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
