import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Send, Paperclip, Loader2, Download, CheckCircle2, User, 
  ShieldAlert, Clock, Info, Check, Image as ImageIcon
} from 'lucide-react';
import { SupportTicket, SupportMessage, TicketStatus } from '../../../types/support';
import { supportService } from '../../../services/supportService';
import { auth } from '../../../lib/firebase';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../../../lib/utils';

interface TicketChatProps {
  ticket: SupportTicket;
  isMaster?: boolean;
  onClose: () => void;
}

export const TicketChat: React.FC<TicketChatProps> = ({ ticket, isMaster, onClose }) => {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const unsubscribe = supportService.subscribeToTicketMessages(ticket.id!, (data) => {
      setMessages(data);
      setLoading(false);
      setTimeout(() => scrollToBottom(), 100);
    });

    return () => unsubscribe();
  }, [ticket.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || (!newMessage.trim() && !attachment) || submitting) return;
    
    setSubmitting(true);
    try {
      let attachmentUrl = undefined;
      
      if (attachment) {
        attachmentUrl = await supportService.uploadTicketAttachment(ticket.id!, attachment);
      }

      await supportService.addTicketMessage(ticket.id!, {
        ticketId: ticket.id!,
        senderId: auth.currentUser.uid,
        senderName: auth.currentUser.displayName || 'Usuário',
        senderRole: isMaster ? 'master' : 'client',
        content: newMessage.trim(),
        attachmentUrls: attachmentUrl ? [attachmentUrl] : undefined,
      });

      setNewMessage('');
      setAttachment(null);
      
      if (ticket.status === 'resolved' || ticket.status === 'closed') {
         await supportService.updateTicketStatus(ticket.id!, 'in_progress');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Erro ao enviar mensagem.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (status: TicketStatus) => {
    setIsUpdatingStatus(true);
    try {
      await supportService.updateTicketStatus(ticket.id!, status);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Only accept PDF and images
    if (!file.type.includes('pdf') && !file.type.includes('image')) {
      alert('Apenas PDFs e imagens são permitidos.');
      return;
    }
    
    // Max size 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('O arquivo deve ter no máximo 5MB.');
      return;
    }
    
    setAttachment(file);
  };

  const timeOpen = formatDistanceToNow(new Date(ticket.createdAt?.toDate?.() || ticket.createdAt), { locale: ptBR });
  const isOver24h = new Date().getTime() - new Date(ticket.createdAt?.toDate?.() || ticket.createdAt).getTime() > 24 * 60 * 60 * 1000;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-background/80 backdrop-blur-sm transition-all animate-executive-fade">
      <div className="w-full max-w-2xl bg-surface-container border-l border-border h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-border bg-card flex flex-col gap-4 relative shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-secondary/10 hover:text-secondary text-muted-foreground transition-all"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-3 pr-10">
            <h2 className="text-[14px] font-medium text-foreground uppercase tracking-widest line-clamp-1">{ticket.subject}</h2>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-[10px] font-medium uppercase tracking-widest italic text-muted-foreground">
            <span className="px-3 py-1 bg-surface-container rounded-sm border border-border">Protocolo: {ticket.protocolo}</span>
            
            <div className={cn("flex items-center gap-2 px-3 py-1 rounded-sm border", isOver24h && ticket.status !== 'resolved' && ticket.status !== 'closed' ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-surface-container border-border")}>
              <Clock size={12} />
              <span>Aberto há {timeOpen}</span>
            </div>
            
            <div className="px-3 py-1 rounded-sm border border-border flex items-center gap-2 bg-surface-container">
              <span className="w-2 h-2 rounded-full" style={{
                 backgroundColor: ticket.status === 'resolved' ? '#10b981' :
                                  ticket.status === 'pending' ? '#f59e0b' :
                                  ticket.status === 'in_progress' ? '#3b82f6' : '#64748b'
              }} />
              {ticket.status === 'pending' ? 'Pendente' : 
               ticket.status === 'in_progress' ? 'Em Análise' : 
               ticket.status === 'resolved' ? 'Resolvido' : 'Fechado'}
            </div>
          </div>
          
          {isMaster && (
            <div className="flex items-center gap-2 mt-2">
               <span className="text-[9px] uppercase tracking-widest text-muted-foreground mr-2">Alterar Status:</span>
               {(['pending', 'in_progress', 'resolved', 'closed'] as TicketStatus[]).map(s => (
                  <button
                    key={s}
                    disabled={isUpdatingStatus}
                    onClick={() => handleUpdateStatus(s)}
                    className={cn(
                      "px-3 py-1 text-[9px] font-medium uppercase tracking-widest rounded-sm border transition-all disabled:opacity-50",
                      ticket.status === s ? "bg-secondary text-white border-secondary" : "bg-background border-border hover:border-secondary/50 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {s === 'pending' ? 'Pendente' : s === 'in_progress' ? 'Em Análise' : s === 'resolved' ? 'Resolvido' : 'Fechar'}
                  </button>
               ))}
            </div>
          )}
        </div>
        
        {/* Ticket Description */}
        <div className="p-6 bg-background border-b border-border shrink-0">
          <div className="flex items-start gap-4">
             <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                <User size={14} className="text-secondary" />
             </div>
             <div className="space-y-1">
                <div className="flex items-center gap-2">
                   <span className="text-[11px] font-medium text-foreground">{ticket.userName}</span>
                   <span className="text-[9px] text-muted-foreground uppercase tracking-widest italic">{new Date(ticket.createdAt?.toDate?.() || ticket.createdAt).toLocaleString('pt-BR')}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-muted-foreground/90 whitespace-pre-wrap">{ticket.description}</p>
             </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-secondary" />
              <span className="text-[10px] uppercase tracking-widest">Carregando mensagens...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground opacity-50">
               <Info className="w-8 h-8" />
               <span className="text-[10px] uppercase tracking-widest italic">Nenhuma mensagem neste chamado</span>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === auth.currentUser?.uid;
              const isAdmin = msg.senderRole === 'master';
              
              return (
                <div key={msg.id} className={cn("flex flex-col gap-1 w-full", isMe ? "items-end" : "items-start")}>
                  <div className="flex items-center gap-2 px-1">
                     <span className="text-[10px] font-medium text-foreground">{isMe ? 'Você' : isAdmin ? 'Suporte Master' : msg.senderName}</span>
                     {isAdmin && !isMe && (
                        <span className="px-1.5 py-0.5 bg-secondary/10 text-secondary text-[8px] uppercase tracking-widest rounded-sm border border-secondary/20">Staff</span>
                     )}
                     <span className="text-[8px] text-muted-foreground uppercase tracking-widest italic">
                        {msg.createdAt ? new Date(msg.createdAt?.toDate?.() || msg.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''}
                     </span>
                  </div>
                  
                  <div className={cn(
                    "max-w-[85%] p-4 rounded-md shadow-sm text-[11px] leading-relaxed",
                    isMe 
                      ? "bg-secondary text-white rounded-tr-none" 
                      : isAdmin 
                        ? "bg-card border border-secondary/20 rounded-tl-none" 
                        : "bg-surface-container border border-border rounded-tl-none"
                  )}>
                    {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}
                    
                    {msg.attachmentUrls && msg.attachmentUrls.length > 0 && (
                      <div className="mt-3 flex flex-col gap-2">
                        {msg.attachmentUrls.map((url, i) => {
                          const isImage = url.includes('image') || url.match(/\.(jpeg|jpg|gif|png)(\?.*)?$/i);
                          return (
                            <a 
                              key={i} 
                              href={url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={cn(
                                "flex items-center gap-2 p-2 rounded-sm border transition-all hover:opacity-80",
                                isMe ? "bg-white/10 border-white/20" : "bg-background border-border"
                              )}
                            >
                              {isImage ? <ImageIcon size={14} /> : <Download size={14} />}
                              <span className="text-[10px] font-medium truncate uppercase tracking-widest">Anexo {i+1}</span>
                            </a>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-background border-t border-border shrink-0">
           {attachment && (
              <div className="mb-3 flex items-center gap-3 p-2 bg-surface-container border border-border rounded-sm">
                 <div className="w-8 h-8 rounded-sm bg-secondary/10 flex items-center justify-center">
                    {attachment.type.includes('image') ? <ImageIcon size={14} className="text-secondary" /> : <Paperclip size={14} className="text-secondary" />}
                 </div>
                 <div className="flex-1 flex flex-col">
                    <span className="text-[10px] font-medium text-foreground uppercase tracking-widest truncate">{attachment.name}</span>
                    <span className="text-[9px] text-muted-foreground uppercase tracking-widest italic">{(attachment.size / 1024).toFixed(0)} KB</span>
                 </div>
                 <button onClick={() => setAttachment(null)} className="p-2 text-muted-foreground hover:text-destructive transition-all">
                    <X size={14} />
                 </button>
              </div>
           )}
           <form onSubmit={handleSendMessage} className="flex items-end gap-3">
              <label className="p-3 bg-surface-container border border-border rounded-sm text-muted-foreground hover:text-secondary hover:border-secondary transition-all cursor-pointer">
                 <input 
                   type="file" 
                   accept="image/*,.pdf" 
                   className="hidden" 
                   onChange={handleFileChange}
                 />
                 <Paperclip size={18} />
              </label>
              
              <textarea 
                 value={newMessage}
                 onChange={e => setNewMessage(e.target.value)}
                 onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                       e.preventDefault();
                       handleSendMessage(e);
                    }
                 }}
                 placeholder="Digite sua mensagem..."
                 className="flex-1 bg-surface-container border border-border rounded-sm p-3 text-[11px] outline-none focus:border-secondary transition-all min-h-[48px] max-h-[120px] resize-y"
                 rows={1}
              />
              
              <button 
                 type="submit" 
                 disabled={submitting || (!newMessage.trim() && !attachment)}
                 className="p-3 bg-secondary text-white rounded-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary/90 transition-all"
              >
                 {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
           </form>
        </div>
      </div>
    </div>
  );
};
