
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
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Suporte</h1>
          <p className="text-slate-500 mt-1">Canal direto para reporte de erros, dúvidas técnicas e inconsistências de dados.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-95"
        >
          {showForm ? 'Fechar Formulário' : (
            <>
              <Plus className="w-5 h-5" />
              Abrir Novo Chamado
            </>
          )}
        </button>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-start gap-4 animate-in slide-in-from-top-4 duration-300">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-emerald-900">Chamado aberto com sucesso!</h3>
            <p className="text-emerald-700 text-sm">
              Seu protocolo principal é <span className="font-mono font-bold">{successMessage.protocol}</span>.
            </p>
            {successMessage.followUp && (
              <div className="mt-2 p-3 bg-white/50 border border-emerald-100 rounded-xl">
                <p className="text-emerald-800 text-sm font-medium flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-emerald-600" />
                  Protocolo de Acompanhamento Master Gerado: <span className="font-mono font-bold">{successMessage.followUp}</span>
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  Este chamado atingiu nossa marca de controle e será acompanhado prioritariamente pela diretoria master.
                </p>
              </div>
            )}
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-400 hover:text-emerald-600">
            <Clock className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Form Section */}
      {showForm && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-800">Novo Reporte</h2>
            <p className="text-sm text-slate-500">Forneça detalhes precisos para agilizar a resolução.</p>
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Tipo de Ocorrência</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as TicketType })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  required
                >
                  <option value="error">Erro de Sistema / Bug</option>
                  <option value="inconsistency">Inconsistência de Dados</option>
                  <option value="suggestion">Sugestão de Melhoria</option>
                  <option value="other">Outros Assuntos</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Prioridade</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as TicketPriority })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  required
                >
                  <option value="low">Baixa - Pequenos ajustes</option>
                  <option value="medium">Média - Funcionamento parcial</option>
                  <option value="high">Alta - Impede produtividade</option>
                  <option value="critical">Crítica - Parada total / Erro grave</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Assunto</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Ex: Divergência no DRE de Março/2024"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Descrição Detalhada</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder="Descreva o que aconteceu, passos para reproduzir o erro ou os dados que estão incorretos..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-800">Seus Chamados e Reportes</h2>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por protocolo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="pl-10 pr-8 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 appearance-none transition-all"
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
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <p className="text-slate-500 font-medium">Carregando seus chamados...</p>
          </div>
        ) : filteredTickets.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredTickets.map((ticket) => (
              <div 
                key={ticket.id}
                className="group bg-white rounded-2xl border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-md transition-all cursor-default"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(ticket.status)}`}>
                        {ticket.status === 'pending' ? 'Pendente' : 
                         ticket.status === 'in_progress' ? 'Em Análise' : 
                         ticket.status === 'resolved' ? 'Resolvido' : 'Fechado'}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-400">{ticket.protocolo}</span>
                      {ticket.hasFollowUpProtocol && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                          <ShieldAlert className="w-3 h-3" />
                          <span className="text-[10px] font-bold uppercase">Acompanhamento Master</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{ticket.subject}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <AlertCircle className={`w-4 h-4 ${getPriorityColor(ticket.priority)}`} />
                        <span className="capitalize">{ticket.priority}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(ticket.createdAt?.toDate?.() || ticket.createdAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden md:block text-right">
                      <p className="text-xs text-slate-400 font-medium">Última Atualização</p>
                      <p className="text-sm text-slate-600 font-semibold">Há 2 horas</p>
                    </div>
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 group-hover:text-indigo-600 transition-all">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 p-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
              <MessageSquare className="w-10 h-10 text-slate-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Nenhum chamado encontrado</h3>
              <p className="text-slate-500 max-w-sm mx-auto">Você ainda não abriu nenhum chamado de suporte ou reporte de inconsistência.</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-all"
            >
              Criar meu primeiro chamado
            </button>
          </div>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 space-y-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-indigo-600" />
          </div>
          <h4 className="font-bold text-indigo-900">SLA de Atendimento</h4>
          <p className="text-sm text-indigo-700/80">Nosso time técnico analisa todos os reportes em até 24 horas úteis para garantir a fluidez da sua operação.</p>
        </div>
        <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 space-y-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-emerald-600" />
          </div>
          <h4 className="font-bold text-emerald-900">Segurança de Dados</h4>
          <p className="text-sm text-emerald-700/80">Toda inconsistência reportada é tratada sob protocolos rígidos de sigilo e auditoria por nossos curadores.</p>
        </div>
        <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 space-y-3">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
          <h4 className="font-bold text-amber-900">Casos Críticos</h4>
          <p className="text-sm text-amber-700/80">Em situações de indisponibilidade total, o sistema aciona automaticamente a célula de contingência master.</p>
        </div>
      </div>
    </div>
  );
};
