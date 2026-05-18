
import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Send, 
  Plus, 
  ShieldAlert,
  Search,
  Filter,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useGovernance } from '../../lib/governanceContext';
import { auth } from '../../lib/firebase';
import { supportService } from '../../services/supportService';
import { SupportTicket, TicketType, TicketPriority } from '../../types/support';
import { PageHeader } from '../Common';

interface SupportPageProps {
  selectedClient?: string;
}

export const SupportPage: React.FC<SupportPageProps> = ({ selectedClient }) => {
  const { role } = useGovernance();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<TicketType | 'all'>('all');

  // Form State
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    type: 'error' as TicketType,
    priority: 'medium' as TicketPriority
  });

  const [successMessage, setSuccessMessage] = useState<{
    protocol: string;
    followUp?: string;
  } | null>(null);

  useEffect(() => {
    fetchTickets();
  }, [auth.currentUser]);

  const fetchTickets = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      const data = await supportService.getUserTickets(auth.currentUser.uid);
      setTickets(data);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setSubmitting(true);
    try {
      const result = await supportService.createTicket({
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Usuário',
        userEmail: auth.currentUser.email || '',
        userRole: role || 'cliente',
        clienteId: selectedClient,
        subject: formData.subject,
        description: formData.description,
        type: formData.type,
        priority: formData.priority,
        status: 'pending'
      });

      setSuccessMessage({
        protocol: result.protocolo,
        followUp: result.followUpProtocolNumber
      });
      
      setFormData({
        subject: '',
        description: '',
        type: 'error',
        priority: 'medium'
      });
      setShowForm(false);
      fetchTickets();

      // Clear success message after 10 seconds
      setTimeout(() => setSuccessMessage(null), 10000);
    } catch (error) {
      console.error('Error submitting ticket:', error);
      alert('Erro ao enviar chamado. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'resolved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'closed': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-rose-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-amber-600';
      case 'low': return 'text-emerald-600';
      default: return 'text-slate-600';
    }
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.protocolo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-10 pb-20 animate-executive-fade">
      {/* Header */}
      <PageHeader 
        title="Suporte & Inconsistências"
        subtitle="Canal direto para reporte de erros, dúvidas técnicas e inconsistências de dados."
        icon={MessageSquare}
        color="executive"
        actions={
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-executive bg-primary shadow-xl shadow-primary/20 cursor-pointer"
          >
            {showForm ? 'Fechar Formulário' : (
              <>
                <Plus className="w-5 h-5" />
                Abrir Novo Chamado
              </>
            )}
          </button>
        }
      />

      {/* Success Notification */}
      {successMessage && (
        <div className="bg-success/5 border border-success/10 p-6 rounded-md flex items-start gap-5 animate-executive-fade shadow-premium">
          <div className="p-3 bg-success/10 rounded-sm border border-success/20 shadow-inner">
            <CheckCircle2 className="w-6 h-6 text-success" />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="text-[10px] font-medium text-success uppercase tracking-[0.2em]">Chamado aberto com sucesso!</h3>
            <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-widest italic">
              Seu protocolo principal é <span className="font-mono text-foreground font-medium">{successMessage.protocol}</span>.
            </p>
            {successMessage.followUp && (
              <div className="mt-4 p-4 bg-card/50 border border-success/10 rounded-sm shadow-inner">
                <p className="text-[10px] text-success font-medium flex items-center gap-2 uppercase tracking-widest">
                  <ShieldAlert className="w-4 h-4" />
                  Protocolo Master: <span className="font-mono font-medium">{successMessage.followUp}</span>
                </p>
                <p className="text-[9px] text-muted-foreground/60 mt-1 uppercase tracking-widest italic">
                  Este chamado atingiu nossa marca de controle e será acompanhado prioritariamente pela diretoria master.
                </p>
              </div>
            )}
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-muted-foreground/30 hover:text-success transition-colors">
            <Clock className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Form Section */}
      {showForm && (
        <div className="card-premium overflow-hidden animate-executive-fade">
          <div className="p-8 border-b border-border bg-surface-container/50">
            <h2 className="text-[10px] font-medium text-foreground uppercase tracking-[0.2em]">Novo Reporte</h2>
            <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest mt-1 italic">Forneça detalhes precisos para agilizar a resolução.</p>
          </div>
          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest block px-1 italic">Tipo de Ocorrência</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as TicketType })}
                  className="w-full px-5 py-3.5 bg-surface-container border border-border rounded-sm text-[11px] font-medium uppercase tracking-widest outline-none focus:ring-1 focus:ring-secondary/20 transition-all shadow-inner"
                  required
                >
                  <option value="error">Erro de Sistema / Bug</option>
                  <option value="inconsistency">Inconsistência de Dados</option>
                  <option value="suggestion">Sugestão de Melhoria</option>
                  <option value="other">Outros Assuntos</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest block px-1 italic">Prioridade</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as TicketPriority })}
                  className="w-full px-5 py-3.5 bg-surface-container border border-border rounded-sm text-[11px] font-medium uppercase tracking-widest outline-none focus:ring-1 focus:ring-secondary/20 transition-all shadow-inner"
                  required
                >
                  <option value="low">Baixa - Pequenos ajustes</option>
                  <option value="medium">Média - Funcionamento parcial</option>
                  <option value="high">Alta - Impede produtividade</option>
                  <option value="critical">Crítica - Parada total / Erro grave</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest block px-1 italic">Assunto</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Ex: Divergência no DRE de Março/2024"
                className="w-full px-5 py-3.5 bg-surface-container border border-border rounded-sm text-[11px] font-medium uppercase tracking-widest outline-none focus:ring-1 focus:ring-secondary/20 transition-all shadow-inner italic"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest block px-1 italic">Descrição Detalhada</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder="Descreva o que aconteceu, passos para reproduzir o erro ou os dados que estão incorretos..."
                className="w-full px-5 py-3.5 bg-surface-container border border-border rounded-sm text-[11px] font-medium outline-none focus:ring-1 focus:ring-secondary/20 transition-all shadow-inner resize-none italic leading-relaxed"
                required
              />
            </div>

            <div className="flex justify-end gap-6 pt-4 border-t border-border/50">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-8 py-3 text-[10px] font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-executive flex items-center gap-3 bg-primary shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                Enviar Reporte
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tickets List Section */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <h2 className="text-[10px] font-medium text-foreground uppercase tracking-[0.2em]">Seus Chamados e Reportes</h2>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
              <input
                type="text"
                placeholder="Buscar por protocolo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-2.5 bg-surface-container border border-border rounded-sm text-[11px] font-medium uppercase tracking-widest outline-none focus:ring-1 focus:ring-secondary/20 transition-all shadow-inner italic"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="pl-12 pr-10 py-2.5 bg-surface-container border border-border rounded-sm text-[10px] font-medium uppercase tracking-widest outline-none focus:ring-1 focus:ring-secondary/20 appearance-none transition-all shadow-inner"
              >
                <option value="all">Todos</option>
                <option value="error">Erros</option>
                <option value="inconsistency">Inconsistências</option>
                <option value="suggestion">Sugestões</option>
                <option value="other">Outros</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-5 bg-card/50 rounded-md border border-border shadow-inner">
            <Loader2 className="w-10 h-10 text-secondary animate-spin" />
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Carregando seus chamados...</p>
          </div>
        ) : filteredTickets.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredTickets.map((ticket) => (
              <div 
                key={ticket.id}
                className="card-premium p-6 group relative overflow-hidden transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className={`px-4 py-1.5 rounded-sm text-[9px] font-medium uppercase tracking-[0.2em] shadow-premium border ${
                        ticket.status === 'resolved' ? 'bg-success text-white border-white/10' :
                        ticket.status === 'pending' ? 'bg-warning text-white border-white/10' :
                        ticket.status === 'in_progress' ? 'bg-blue-500 text-white border-white/10' :
                        'bg-muted-foreground text-white border-white/10'
                      }`}>
                        {ticket.status === 'pending' ? 'Pendente' : 
                         ticket.status === 'in_progress' ? 'Em Análise' : 
                         ticket.status === 'resolved' ? 'Resolvido' : 'Fechado'}
                      </span>
                      <span className="text-[10px] font-medium text-muted-foreground/40 font-mono tracking-widest italic">{ticket.protocolo}</span>
                      {ticket.hasFollowUpProtocol && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-executive text-secondary rounded-sm border border-white/5 shadow-premium">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span className="text-[9px] font-medium uppercase tracking-widest">Acompanhamento Master</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-[14px] font-medium text-foreground uppercase tracking-widest group-hover:text-secondary transition-colors line-clamp-1">{ticket.subject}</h3>
                    <div className="flex items-center gap-6 text-[10px] font-medium text-muted-foreground/60 uppercase tracking-widest italic">
                      <div className="flex items-center gap-2">
                        <AlertCircle className={`w-4 h-4 ${
                          ticket.priority === 'critical' ? 'text-destructive' :
                          ticket.priority === 'high' ? 'text-warning' :
                          ticket.priority === 'medium' ? 'text-blue-500' :
                          'text-success'
                        }`} />
                        <span>{ticket.priority}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(ticket.createdAt?.toDate?.() || ticket.createdAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="hidden lg:block text-right">
                      <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest italic opacity-40">Status Recente</p>
                      <p className="text-[11px] font-medium text-foreground uppercase tracking-tighter">Análise em curso</p>
                    </div>
                    <button className="w-12 h-12 rounded-sm bg-surface-container border border-border flex items-center justify-center text-muted-foreground/30 group-hover:bg-secondary group-hover:text-white transition-all shadow-inner">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-premium py-32 flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-surface-container/20 shadow-inner" />
            <div className="p-8 bg-card rounded-md shadow-premium border border-border relative z-10">
              <MessageSquare className="w-12 h-12 text-muted-foreground/20" />
            </div>
            <div className="relative z-10 space-y-2">
              <h3 className="text-xl font-medium text-foreground uppercase tracking-widest">Nenhum chamado encontrado</h3>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em] max-w-2xl mx-auto leading-relaxed italic">Você ainda não abriu nenhum chamado de suporte ou reporte de inconsistência.</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="btn-executive bg-primary shadow-xl shadow-primary/20 relative z-10"
            >
              Criar meu primeiro chamado
            </button>
          </div>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card-premium p-8 space-y-4 relative overflow-hidden bg-secondary/5 border-secondary/10 group hover:bg-secondary/10 transition-all">
          <div className="w-12 h-12 bg-secondary/20 rounded-sm flex items-center justify-center shadow-inner group-hover:bg-secondary group-hover:text-white transition-all">
            <Clock className="w-6 h-6 text-secondary" />
          </div>
          <h4 className="text-[11px] font-medium text-secondary uppercase tracking-[0.2em]">SLA de Atendimento</h4>
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-widest leading-relaxed italic opacity-80">Nosso time técnico analisa todos os reportes em até 24 horas úteis para garantir a fluidez da sua operação.</p>
        </div>
        <div className="card-premium p-8 space-y-4 relative overflow-hidden bg-success/5 border-success/10 group hover:bg-success/10 transition-all">
          <div className="w-12 h-12 bg-success/20 rounded-sm flex items-center justify-center shadow-inner group-hover:bg-success group-hover:text-white transition-all">
            <ShieldAlert className="w-6 h-6 text-success" />
          </div>
          <h4 className="text-[11px] font-medium text-success uppercase tracking-[0.2em]">Segurança de Dados</h4>
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-widest leading-relaxed italic opacity-80">Toda inconsistência reportada é tratada sob protocolos rígidos de sigilo e auditoria por nossos curadores.</p>
        </div>
        <div className="card-premium p-8 space-y-4 relative overflow-hidden bg-warning/5 border-warning/10 group hover:bg-warning/10 transition-all">
          <div className="w-12 h-12 bg-warning/20 rounded-sm flex items-center justify-center shadow-inner group-hover:bg-warning group-hover:text-white transition-all">
            <AlertCircle className="w-6 h-6 text-warning" />
          </div>
          <h4 className="text-[11px] font-medium text-warning uppercase tracking-[0.2em]">Casos Críticos</h4>
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-widest leading-relaxed italic opacity-80">Em situações de indisponibilidade total, o sistema aciona automaticamente a célula de contingência master.</p>
        </div>
      </div>
    </div>
  );
};
