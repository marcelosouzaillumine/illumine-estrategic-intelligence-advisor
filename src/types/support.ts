
import { UserRole } from './governance';

export type TicketStatus = 'pending' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketType = 'error' | 'inconsistency' | 'suggestion' | 'other';

export interface SupportMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  attachmentUrls?: string[];
  createdAt: any;
}

export interface SupportTicket {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  clienteId?: string;
  type: TicketType;
  priority: TicketPriority;
  subject: string;
  description: string;
  status: TicketStatus;
  protocolo: string;
  hasFollowUpProtocol: boolean;
  followUpProtocolNumber?: string;
  createdAt: any;
  updatedAt?: any;
  adminNotes?: string;
}
