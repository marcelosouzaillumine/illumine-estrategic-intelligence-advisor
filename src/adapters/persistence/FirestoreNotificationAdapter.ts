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
import { db } from '../../lib/firebase';
import { AppNotification } from '../../services/platform/notificationService';

export class FirestoreNotificationAdapter {
  static async createNotification(notification: Omit<AppNotification, 'createdAt' | 'read'>): Promise<void> {
    await addDoc(collection(db, 'notifications'), {
      ...notification,
      read: false,
      createdAt: serverTimestamp()
    });
  }

  static async markAsRead(notificationId: string): Promise<void> {
    const docRef = doc(db, 'notifications', notificationId);
    await updateDoc(docRef, { read: true });
  }

  static listenNotifications(userId: string, onUpdate: (notifications: AppNotification[]) => void, onError?: (err: any) => void): () => void {
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
      onUpdate(notifications);
    }, onError);
  }

  static listenAdminNotifications(onUpdate: (notifications: AppNotification[]) => void, onError?: (err: any) => void): () => void {
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
      onUpdate(notifications);
    }, onError);
  }
}
