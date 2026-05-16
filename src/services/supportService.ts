
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  orderBy, 
  getDocs,
  limit,
  getCountFromServer
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SupportTicket } from '../types/support';
import { notificationService } from './notificationService';

const TICKETS_COLLECTION = 'support_tickets';

export const supportService = {
  async createTicket(ticket: Omit<SupportTicket, 'createdAt' | 'protocolo' | 'hasFollowUpProtocol'>) {
    try {
      // Generate protocol
      const protocol = `SUP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Get current count to check for the 9th ticket
      const coll = collection(db, TICKETS_COLLECTION);
      const snapshot = await getCountFromServer(coll);
      const currentCount = snapshot.data().count;
      
      const isNinth = (currentCount + 1) % 9 === 0;
      let followUpProtocolNumber = undefined;
      
      if (isNinth) {
        followUpProtocolNumber = `FWP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      }

      const newTicket: SupportTicket = {
        ...ticket,
        protocolo: protocol,
        hasFollowUpProtocol: isNinth,
        followUpProtocolNumber,
        createdAt: serverTimestamp(),
        status: 'pending'
      };

      const docRef = await addDoc(collection(db, TICKETS_COLLECTION), newTicket);

      // If it's the 9th ticket, notify Admin Master
      if (isNinth) {
        await notificationService.createNotification({
          userId: 'admin_group', // Or a specific master ID if available, but admin_group is used in the app
          title: 'Novo Protocolo de Acompanhamento',
          message: `O chamado ${protocol} atingiu a marca de controle (9º ticket). Um protocolo de acompanhamento (${followUpProtocolNumber}) foi aberto automaticamente.`,
          type: 'approval_request', // Using this type so it shows up in admin notifications
          metadata: {
            ticketId: docRef.id,
            protocolo: protocol,
            followUpProtocolNumber
          }
        });
      }

      return { id: docRef.id, protocolo: protocol, isNinth, followUpProtocolNumber };
    } catch (error) {
      console.error('Error creating support ticket:', error);
      throw error;
    }
  },

  async getUserTickets(userId: string) {
    try {
      const q = query(
        collection(db, TICKETS_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as SupportTicket));
    } catch (error) {
      console.error('Error fetching user tickets:', error);
      return [];
    }
  },

  async getAllTickets() {
    try {
      const q = query(
        collection(db, TICKETS_COLLECTION),
        orderBy('createdAt', 'desc'),
        limit(100)
      );
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as SupportTicket));
    } catch (error) {
      console.error('Error fetching all tickets:', error);
      return [];
    }
  }
};
