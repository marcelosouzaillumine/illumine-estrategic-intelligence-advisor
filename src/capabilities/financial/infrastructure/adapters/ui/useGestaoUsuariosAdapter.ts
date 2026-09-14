import { useState, useEffect } from 'react';

import { FirestoreUsersAdapter } from '../../../../../adapters/persistence/FirestoreUsersAdapter';
import { AppUser } from '../../../../../adapters/persistence/FirestoreUsersAdapter';


export function useGestaoUsuariosAdapter() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [resettingUserId, setResettingUserId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await FirestoreUsersAdapter.fetchGlobalUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching global users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (email: string, userId: string) => {
    if (!email) return;
    setResettingUserId(userId);
    setSuccessMessage(null);
    try {
      await FirestoreUsersAdapter.sendResetEmail(email);
      setSuccessMessage(`E-mail de recuperação enviado para ${email}`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error("Error sending reset email:", error);
      alert("Erro ao enviar e-mail de redefinição.");
    } finally {
      setResettingUserId(null);
    }
  };

  return { users, loading, resettingUserId, successMessage, handleResetPassword };
}
