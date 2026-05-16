
import { useState, useEffect } from 'react';
import { notificationService, AppNotification } from '../services/notificationService';
import { useGovernance } from '../lib/governanceContext';

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const { role } = useGovernance();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    let unsubscribe: () => void;

    if (role === 'master' || role === 'admin') {
      // Admins listen to approval requests + their own notifications
      unsubscribe = notificationService.listenAdminNotifications((adminNotifs) => {
        setNotifications(adminNotifs);
        setLoading(false);
      });
    } else {
      unsubscribe = notificationService.listenNotifications(userId, (userNotifs) => {
        setNotifications(userNotifs);
        setLoading(false);
      });
    }

    return () => unsubscribe && unsubscribe();
  }, [userId, role]);

  const markAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return { notifications, unreadCount, loading, markAsRead };
}
