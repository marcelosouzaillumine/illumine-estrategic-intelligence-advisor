import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Search, Filter, Clock, AlertCircle, 
  Loader2, MessageSquare, ArrowRight, CheckCircle2
} from 'lucide-react';
import { supportService } from '../../../services/supportService';
import { SupportTicket, TicketType, TicketStatus } from '../../../types/support';
import { PageHeader } from '../../Common';
import { TicketChat } from './TicketChat';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../../../lib/utils';

export const AdminSupportPanel: React.FC<{ headerAddon?: React.ReactNode }> = ({ headerAddon }) => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<TicketType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<TicketStatus | 'all'>('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await supportService.getAllTickets();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching admin tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleTicketClick = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.protocolo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-10 pb-20 animate-executive-fade">
      <PageHeader 
        title="Painel Master de Suporte"
        subtitle="Acompanhamento global de chamados, controle de SLA e suporte técnico avançado."
        icon={ShieldAlert}
        color="executive"
      />
      {headerAddon}

      <div className="card-premium p-6">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
           <div className="relative flex-1">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
             <input 
               type="text" 
               placeholder="Buscar por protocolo, usuário ou assunto..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-sm text-[11px] font-medium uppercase tracking-widest outline-none focus:border-secondary transition-all"
             />
           </div>
           
           <div className="flex items-center gap-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="pl-4 pr-10 py-3 bg-background border border-border rounded-sm text-[10px] font-medium uppercase tracking-widest outline-none focus:border-secondary transition-all min-w-[150px]"
              >
                <option value="all">Tipos (Todos)</option>
                <option value="error">Erros</option>
                <option value="inconsistency">Inconsistências</option>
                <option value="suggestion">Sugestões</option>
                <option value="other">Outros</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="pl-4 pr-10 py-3 bg-background border border-border rounded-sm text-[10px] font-medium uppercase tracking-widest outline-none focus:border-secondary transition-all min-w-[150px]"
              >
                <option value="all">Status (Todos)</option>
                <option value="pending">Pendentes</option>
                <option value="in_progress">Em Análise</option>
                <option value="resolved">Resolvidos</option>
                <option value="closed">Fechados</option>
              </select>
           </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
             <Loader2 className="w-8 h-8 text-secondary animate-spin" />
             <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Carregando chamados...</span>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
             <CheckCircle2 className="w-12 h-12 text-success/50" />
             <h3 className="text-[14px] uppercase tracking-widest">Nenhum chamado encontrado</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredTickets.map(ticket => {
              const timeOpen = formatDistanceToNow(new Date(ticket.createdAt?.toDate?.() || ticket.createdAt), { locale: ptBR });
              const isOver24h = new Date().getTime() - new Date(ticket.createdAt?.toDate?.() || ticket.createdAt).getTime() > 24 * 60 * 60 * 1000;
              const isClosed = ticket.status === 'resolved' || ticket.status === 'closed';

              return (
                <div 
                  key={ticket.id} 
                  onClick={() => handleTicketClick(ticket)}
                  className="p-5 border border-border bg-background rounded-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:border-secondary cursor-pointer transition-all group"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "px-3 py-1 rounded-sm text-[8px] font-medium uppercase tracking-widest border",
                        ticket.status === 'pending' ? "bg-warning/10 text-warning border-warning/20" :
                        ticket.status === 'in_progress' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                        ticket.status === 'resolved' ? "bg-success/10 text-success border-success/20" :
                        "bg-slate-500/10 text-slate-500 border-slate-500/20"
                      )}>
                        {ticket.status === 'pending' ? 'Pendente' : 
                         ticket.status === 'in_progress' ? 'Análise' : 
                         ticket.status === 'resolved' ? 'Resolvido' : 'Fechado'}
                      </span>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">{ticket.protocolo}</span>
                      
                      {(!isClosed && isOver24h) && (
                         <span className="px-2 py-1 bg-destructive text-white text-[8px] uppercase tracking-widest rounded-sm flex items-center gap-1 animate-pulse">
                            <AlertCircle size={10} /> SLA Excedido (24h)
                         </span>
                      )}
                    </div>
                    
                    <h4 className="text-[12px] font-medium uppercase tracking-widest line-clamp-1 group-hover:text-secondary transition-colors">{ticket.subject}</h4>
                    
                    <div className="flex items-center gap-4 text-[9px] uppercase tracking-widest text-muted-foreground italic">
                      <span>{ticket.userName}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                         <Clock size={10} /> Aberto há {timeOpen}
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-10 h-10 rounded-sm bg-surface-container border border-border flex items-center justify-center text-muted-foreground group-hover:bg-secondary group-hover:text-white transition-all">
                     <ArrowRight size={16} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedTicket && (
        <TicketChat 
          ticket={selectedTicket} 
          isMaster={true} 
          onClose={() => {
            setSelectedTicket(null);
            fetchTickets(); // Refresh list to get new statuses
          }} 
        />
      )}
    </div>
  );
};
