import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { updatePassword } from 'firebase/auth';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';


interface ForcePasswordChangeModalProps {
  onSuccess: () => void;
}

export function ForcePasswordChangeModal({ onSuccess }: ForcePasswordChangeModalProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError('Preencha ambos os campos.');
      return;
    }
    if (newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Usuário não autenticado.');

      // Update password in Firebase Auth
      await updatePassword(user, newPassword);

      // Remove requirePasswordChange from all associated docs
      const emailLower = user.email?.toLowerCase().trim();
      if (emailLower) {
        // Check client_users
        const clientUsersQuery = query(collection(db, 'client_users'), where('email', '==', emailLower));
        const clientUsersSnap = await getDocs(clientUsersQuery);
        const updatePromises = clientUsersSnap.docs.map(d => updateDoc(doc(db, 'client_users', d.id), { requirePasswordChange: false }));
        
        // Check partners (if applicable)
        const partnersQuery = query(collection(db, 'partners'), where('email', '==', emailLower));
        const partnersSnap = await getDocs(partnersQuery);
        updatePromises.push(...partnersSnap.docs.map(d => updateDoc(doc(db, 'partners', d.id), { requirePasswordChange: false })));

        await Promise.all(updatePromises);
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);

    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/requires-recent-login') {
        setError('Sua sessão expirou. Por favor, faça login novamente para trocar a senha.');
      } else {
        setError('Erro ao trocar a senha: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="w-full max-w-md bg-card border border-border shadow-2xl rounded-2xl p-6 sm:p-8 relative"
        style={{ width: '100%', maxWidth: '448px', minWidth: '320px' }}
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center">
            <Lock size={32} />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground">Defina sua Senha</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Como este é seu primeiro acesso com uma senha provisória, é obrigatório definir uma nova senha segura.
          </p>
        </div>

        {success ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-16 h-16 bg-success-soft0/10 text-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle2 size={32} />
            </div>
            <p className="text-lg font-bold text-emerald-500">Senha atualizada com sucesso!</p>
            <p className="text-sm text-muted-foreground">Redirecionando para o sistema...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Nova Senha</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 bg-surface-container/40 border border-border rounded-standard outline-none focus:border-secondary transition-all"
                  placeholder="Mínimo 6 caracteres"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Confirmar Nova Senha</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 bg-surface-container/40 border border-border rounded-standard outline-none focus:border-secondary transition-all"
                  placeholder="Repita a senha"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-critical-soft0/10 border border-rose-500/20 text-rose-500 text-sm font-medium rounded-lg">
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-secondary text-white font-bold rounded-standard shadow-premium hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Lock size={20} />}
              Atualizar Senha e Continuar
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
