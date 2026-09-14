
import { FirestoreNotificationAdapter } from '../../adapters/persistence/FirestoreNotificationAdapter';

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
      await FirestoreNotificationAdapter.createNotification(notification);
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  },

  async markAsRead(notificationId: string) {
    try {
      await FirestoreNotificationAdapter.markAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  },

  listenNotifications(userId: string, callback: (notifications: AppNotification[]) => void) {
    return FirestoreNotificationAdapter.listenNotifications(userId, callback);
  },

  listenAdminNotifications(callback: (notifications: AppNotification[]) => void) {
    return FirestoreNotificationAdapter.listenAdminNotifications(callback);
  }
};
