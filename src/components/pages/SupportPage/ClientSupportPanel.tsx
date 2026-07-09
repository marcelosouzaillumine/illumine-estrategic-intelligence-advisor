import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, CheckCircle2, ShieldAlert, Clock, Search, Filter, Loader2, ArrowRight, AlertCircle, Send } from 'lucide-react';
import { useSupportAdapter } from '../../../adapters/ui/useSupportAdapter';
import { SupportTicket, TicketType, TicketPriority } from '../../../types/support';
import { PageHeader } from '../../Common';
import { TicketChat } from './TicketChat';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../../../lib/utils';
import { useGovernance } from '../../../lib/governanceContext';

export const ClientSupportPanel: React.FC<{ selectedClient?: string, headerAddon?: React.ReactNode }> = ({ selectedClient, headerAddon }) => {
  const { role } = useGovernance();
  const { tickets, loading, fetchTickets, submitTicket } = useSupportAdapter();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<TicketType | 'all'>('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    type: 'error' as TicketType,
    priority: 'medium' as TicketPriority
  });

  const [successMessage, setSuccessMessage] = useState<{ protocol: string; followUp?: string } | null>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const result = await submitTicket({
        ...formData,
        clienteId: selectedClient
      });
      
      if (!result) throw new Error('Falha ao criar ticket');
      
      setSuccessMessage({ protocol: result.protocolo, followUp: result.followUpProtocolNumber });
      setFormData({ subject: '', description: '', type: 'error', priority: 'medium' });
      setShowForm(false);
      fetchTickets();
      setTimeout(() => setSuccessMessage(null), 10000);
    } catch (error) {
      console.error('Error submitting ticket:', error);
      alert('Erro ao enviar chamado. Tente novamente.');
    } finally {
      setSubmitting(false);
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
      <PageHeader 
        title="Suporte & Inconsistências"
        subtitle="Canal direto para reporte de erros, dúvidas técnicas e inconsistências de dados."
        icon={MessageSquare}
        color="executive"
      />
      {headerAddon}

      {successMessage && (
        <div className="bg-success/5 border border-success/10 p-6 rounded-md flex items-start gap-5 animate-executive-fade shadow-premium">
          <div className="p-3 bg-success-soft rounded-sm border border-success/20 shadow-inner">
            <CheckCircle2 className="w-6 h-6 text-success" />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="text-[10px] font-medium text-success uppercase tracking-[0.2em]">Chamado aberto com sucesso!</h3>
            <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-widest italic">
              Seu protocolo principal é <span className="font-mono text-foreground font-medium">{successMessage.protocol}</span>.
            </p>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-muted-foreground/30 hover:text-success transition-colors">
            <Clock className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="space-y-8">
        <div className="flex flex-col xl:flex-row items-center justify-between gap-4 md:gap-6 bg-surface-container/30 p-4 md:p-6 rounded-md border border-border shadow-sm">
          <h2 className="text-[10px] lg:text-[11px] font-medium text-foreground uppercase tracking-[0.2em] whitespace-nowrap text-center xl:text-left">
            Seus Chamados e Reportes
          </h2>
          
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-executive bg-primary shadow-xl shadow-primary/20 cursor-pointer w-full sm:w-auto flex items-center justify-center gap-2 whitespace-nowrap flex-shrink-0 px-6"
          >
            {showForm ? (
              <span className="whitespace-nowrap">Fechar Formulário</span>
            ) : (
              <>
                <Plus className="w-4 h-4 flex-shrink-0" />
                <span className="whitespace-nowrap">Abrir Novo Chamado</span>
              </>
            )}
          </button>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto justify-end">
            <div className="relative flex-1 w-full sm:w-64 xl:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
              <input
                type="text"
                placeholder="Buscar por protocolo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-2.5 bg-background border border-border rounded-sm text-[11px] font-medium uppercase tracking-widest outline-none focus:ring-1 focus:ring-secondary/20 transition-all shadow-inner italic"
              />
            </div>
            <div className="relative w-full sm:w-auto">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full pl-12 pr-10 py-2.5 bg-background border border-border rounded-sm text-[10px] font-medium uppercase tracking-widest outline-none focus:ring-1 focus:ring-secondary/20 appearance-none transition-all shadow-inner"
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

        {showForm && (
          <div className="card-premium overflow-hidden animate-executive-fade mt-6">
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
                  className="px-5 md:px-8 py-2 md:py-3 text-[10px] font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-executive flex items-center gap-3 bg-primary shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  Enviar Reporte
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-5 bg-card/50 rounded-md border border-border shadow-inner">
            <Loader2 className="w-10 h-10 text-secondary animate-spin" />
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Carregando seus chamados...</p>
          </div>
        ) : filteredTickets.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredTickets.map((ticket) => {
               const timeOpen = formatDistanceToNow(new Date(ticket.createdAt?.toDate?.() || ticket.createdAt), { locale: ptBR });
               const isOver24h = new Date().getTime() - new Date(ticket.createdAt?.toDate?.() || ticket.createdAt).getTime() > 24 * 60 * 60 * 1000;
               const isClosed = ticket.status === 'resolved' || ticket.status === 'closed';

               return (
                <div 
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className="card-premium p-6 group relative overflow-hidden transition-all cursor-pointer hover:border-secondary"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className={cn(
                           "px-4 py-1.5 rounded-sm text-[9px] font-medium uppercase tracking-[0.2em] shadow-premium border",
                           ticket.status === 'resolved' ? 'bg-success text-white border-white/10' :
                           ticket.status === 'pending' ? 'bg-warning text-white border-white/10' :
                           ticket.status === 'in_progress' ? 'bg-blue-500 text-white border-white/10' :
                           'bg-muted-foreground text-white border-white/10'
                        )}>
                          {ticket.status === 'pending' ? 'Pendente' : 
                           ticket.status === 'in_progress' ? 'Em Análise' : 
                           ticket.status === 'resolved' ? 'Resolvido' : 'Fechado'}
                        </span>
                        <span className="text-[10px] font-medium text-muted-foreground/40 font-mono tracking-widest italic">{ticket.protocolo}</span>
                        {(!isClosed && isOver24h) && (
                           <span className="px-2 py-1.5 bg-critical-soft border border-destructive/20 text-destructive text-[9px] uppercase tracking-widest rounded-sm flex items-center gap-1 animate-pulse">
                              <AlertCircle size={10} /> SLA Excedido (24h)
                           </span>
                        )}
                      </div>
                      <h3 className="text-[14px] font-medium text-foreground uppercase tracking-widest group-hover:text-secondary transition-colors line-clamp-1">{ticket.subject}</h3>
                      <div className="flex items-center gap-6 text-[10px] font-medium text-muted-foreground/60 uppercase tracking-widest italic">
                        <div className="flex items-center gap-2">
                          <AlertCircle className={cn("w-4 h-4", 
                            ticket.priority === 'critical' ? 'text-destructive' :
                            ticket.priority === 'high' ? 'text-warning' :
                            ticket.priority === 'medium' ? 'text-blue-500' :
                            'text-success'
                          )} />
                          <span>{ticket.priority}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>Aberto há {timeOpen}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <button className="w-12 h-12 rounded-sm bg-surface-container border border-border flex items-center justify-center text-muted-foreground/30 group-hover:bg-secondary group-hover:text-white transition-all shadow-inner">
                        <MessageSquare className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card-premium p-8 space-y-4 relative overflow-hidden bg-secondary/5 border-secondary/10 group hover:bg-secondary/10 transition-all">
          <div className="w-12 h-12 bg-secondary/20 rounded-sm flex items-center justify-center shadow-inner group-hover:bg-secondary group-hover:text-white transition-all">
            <Clock className="w-6 h-6 text-secondary" />
          </div>
          <h4 className="text-[11px] font-medium text-secondary uppercase tracking-[0.2em]">SLA de Atendimento</h4>
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-widest leading-relaxed italic opacity-80">Nosso time técnico analisa todos os reportes em até 24 horas úteis para garantir a fluidez da sua operação.</p>
        </div>
        <div className="card-premium p-8 space-y-4 relative overflow-hidden bg-success/5 border-success/10 group hover:bg-success-soft transition-all">
          <div className="w-12 h-12 bg-success/20 rounded-sm flex items-center justify-center shadow-inner group-hover:bg-success group-hover:text-white transition-all">
            <ShieldAlert className="w-6 h-6 text-success" />
          </div>
          <h4 className="text-[11px] font-medium text-success uppercase tracking-[0.2em]">Segurança de Dados</h4>
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-widest leading-relaxed italic opacity-80">Toda inconsistência reportada é tratada sob protocolos rígidos de sigilo e auditoria por nossos curadores.</p>
        </div>
        <div className="card-premium p-8 space-y-4 relative overflow-hidden bg-warning/5 border-warning/10 group hover:bg-warning-soft transition-all">
          <div className="w-12 h-12 bg-warning/20 rounded-sm flex items-center justify-center shadow-inner group-hover:bg-warning group-hover:text-white transition-all">
            <AlertCircle className="w-6 h-6 text-warning" />
          </div>
          <h4 className="text-[11px] font-medium text-warning uppercase tracking-[0.2em]">Casos Críticos</h4>
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-widest leading-relaxed italic opacity-80">Em situações de indisponibilidade total, o sistema aciona automaticamente a célula de contingência master.</p>
        </div>
      </div>

      {selectedTicket && (
        <TicketChat 
          ticket={selectedTicket} 
          isMaster={false} 
          onClose={() => {
            setSelectedTicket(null);
            fetchTickets();
          }} 
        />
      )}
    </div>
  );
};
