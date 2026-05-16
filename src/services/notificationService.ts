
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  updateDoc,
  doc
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface AppNotification {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'approval_request';
  read: boolean;
  link?: string;
  metadata?: any;
  createdAt: any;
}

export const notificationService = {
  async createNotification(notification: Omit<AppNotification, 'createdAt' | 'read'>) {
    try {
      await addDoc(collection(db, 'notifications'), {
        ...notification,
        read: false,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  },

  async markAsRead(notificationId: string) {
    try {
      const docRef = doc(db, 'notifications', notificationId);
      await updateDoc(docRef, { read: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  },

  listenNotifications(userId: string, callback: (notifications: AppNotification[]) => void) {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    return onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as AppNotification));
      callback(notifications);
    });
  },

  listenAdminNotifications(callback: (notifications: AppNotification[]) => void) {
    // Notifications for all admins (userId could be 'admin' or we can check role later)
    // For simplicity, we'll use a type 'approval_request' that admins should see
    const q = query(
      collection(db, 'notifications'),
      where('type', '==', 'approval_request'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    return onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as AppNotification));
      callback(notifications);
    });
  }
};
