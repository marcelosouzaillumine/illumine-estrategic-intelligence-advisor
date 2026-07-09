import { useState, useEffect } from 'react';
import { auth } from '../../lib/firebase';
import { supportService } from '../../services/supportService';
import { SupportTicket, TicketType, TicketPriority } from '../../types/support';

export function useSupportAdapter() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchTickets();
  }, []);

  const submitTicket = async (formData: { subject: string; description: string; type: TicketType; priority: TicketPriority; clienteId?: string; }) => {
    if (!auth.currentUser) return null;
    return await supportService.createTicket({
      clienteId: formData.clienteId,
      userId: auth.currentUser.uid,
      userName: auth.currentUser.displayName || 'Usuário',
      userEmail: auth.currentUser.email || '',
      userRole: 'cliente',
      subject: formData.subject,
      description: formData.description,
      type: formData.type,
      priority: formData.priority,
      status: 'pending',
      updatedAt: new Date() as any
    });
  };

  const getUid = () => {
    return auth.currentUser?.uid;
  };

  const subscribeToTicketMessages = (ticketId: string, onUpdate: (data: any[]) => void) => {
    return supportService.subscribeToTicketMessages(ticketId, onUpdate);
  };

  const uploadTicketAttachment = async (ticketId: string, attachment: File) => {
    return await supportService.uploadTicketAttachment(ticketId, attachment);
  };

  const addMessage = async (ticketId: string, message: string, attachmentUrl?: string) => {
    if (!auth.currentUser) return;
    return await supportService.addTicketMessage(ticketId, {
      ticketId,
      senderId: auth.currentUser.uid,
      senderName: auth.currentUser.displayName || 'Usuário',
      senderRole: 'cliente',
      content: message,
      attachmentUrls: attachmentUrl ? [attachmentUrl] : []
    });
  };

  const updateTicketStatus = async (ticketId: string, status: TicketType) => {
    return await supportService.updateTicketStatus(ticketId, status as any);
  };

  return {
    tickets,
    loading,
    fetchTickets,
    submitTicket,
    getUid,
    subscribeToTicketMessages,
    uploadTicketAttachment,
    addMessage,
    updateTicketStatus
  };
}
