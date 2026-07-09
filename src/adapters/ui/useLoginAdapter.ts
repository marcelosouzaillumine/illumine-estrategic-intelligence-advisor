import { useState } from 'react';
import { login, loginWithEmail, sendPasswordResetEmail } from '../../lib/firebase';

export function useLoginAdapter(onLoginSuccess: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRecover, setShowRecover] = useState(false);
  const [recoverEmail, setRecoverEmail] = useState('');
  const [recoverSuccess, setRecoverSuccess] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await login();
      onLoginSuccess();
    } catch (err: any) {
      console.error(err);
      setError('Erro ao fazer login com Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    setError('');
    try {
      await loginWithEmail(email, password);
      onLoginSuccess();
    } catch (err: any) {
      console.error(err);
      setError('Credenciais inválidas ou erro no login.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoverEmail) return;
    
    setLoading(true);
    setError('');
    try {
      await sendPasswordResetEmail(recoverEmail);
      setRecoverSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError('Erro ao enviar e-mail de recuperação.');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    showRecover,
    setShowRecover,
    recoverEmail,
    setRecoverEmail,
    recoverSuccess,
    email,
    setEmail,
    password,
    setPassword,
    handleGoogleLogin,
    handleEmailLogin,
    handleRecover
  };
}
