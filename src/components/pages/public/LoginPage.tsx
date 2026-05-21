import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { login, loginWithEmail, sendPasswordResetEmail } from '../../../lib/firebase';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';

function IllumineMark({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <line x1="30" y1="30" x2="22" y2="22" stroke="#ff8552" strokeWidth="6" strokeLinecap="round" />
      <line x1="18" y1="50" x2="8" y2="50" stroke="#ff8552" strokeWidth="6" strokeLinecap="round" />
      <line x1="30" y1="70" x2="22" y2="78" stroke="#ff8552" strokeWidth="6" strokeLinecap="round" />
      <line x1="50" y1="82" x2="50" y2="92" stroke="#ff8552" strokeWidth="6" strokeLinecap="round" />
      <line x1="70" y1="70" x2="78" y2="78" stroke="#ff8552" strokeWidth="6" strokeLinecap="round" />
      <path
        d="M50 22 C 34.5 22, 22 34.5, 22 50 C 22 65.5, 34.5 78, 50 78 C 65.5 78, 78 65.5, 78 50 M50 50 L75 25 M75 25 L65 25 M75 25 L75 35"
        stroke="#ff8552"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LoginPage() {
  useDocumentTitle('Illumine | Acesso ao Painel');
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');

  // Escutar erro global disparado pelo App (ex: usuário não autorizado)
  useEffect(() => {
    const handleGlobalError = (e: any) => {
      setLoginError(e.detail);
      setIsSigningIn(false);
      setIsSubmitting(false);
    };
    window.addEventListener('login-error', handleGlobalError);
    return () => window.removeEventListener('login-error', handleGlobalError);
  }, []);

  const handleGoogleLogin = async () => {
    setIsSigningIn(true);
    setLoginError('');
    try {
      await login();
      // O App.tsx detectará o auth state change e atualizará o usuário
    } catch (error: any) {
      console.error('Google sign-in failed:', error);
      setLoginError(
        error?.code === 'auth/popup-closed-by-user'
          ? 'Login cancelado antes da confirmação.'
          : 'Não foi possível entrar com Google. Verifique se este domínio está autorizado para acesso.'
      );
      setIsSigningIn(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isSigningIn) return;
    setLoginError('');
    if (!email || !password) {
      setLoginError('Por favor, preencha todos os campos.');
      return;
    }
    setIsSubmitting(true);
    try {
      await loginWithEmail(email.trim(), password);
      // App.tsx handle
    } catch (error: any) {
      console.error('Email authentication error:', error);
      let errorMsg = 'Ocorreu um erro ao autenticar. Verifique seus dados.';
      switch (error?.code) {
        case 'auth/invalid-email':        errorMsg = 'Endereço de e-mail inválido.'; break;
        case 'auth/user-disabled':        errorMsg = 'Este usuário foi desabilitado.'; break;
        case 'auth/user-not-found':       errorMsg = 'E-mail não cadastrado. Verifique se digitou corretamente ou utilize o login com Google.'; break;
        case 'auth/wrong-password':       errorMsg = 'Senha incorreta.'; break;
        case 'auth/invalid-credential':   errorMsg = 'Credenciais inválidas. Verifique seu e-mail e senha.'; break;
      }
      setLoginError(errorMsg);
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setResetError('Digite seu e-mail acima para recuperar a senha.');
      setResetMessage('');
      return;
    }
    setIsResetting(true);
    setResetError('');
    setResetMessage('');
    try {
      await sendPasswordResetEmail(email.trim());
      setResetMessage('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
    } catch (error: any) {
      console.error('Password reset error:', error);
      if (error?.code === 'auth/user-not-found') {
        setResetError('E-mail não cadastrado.');
      } else if (error?.code === 'auth/invalid-email') {
        setResetError('E-mail inválido.');
      } else {
        setResetError('Erro ao enviar e-mail de recuperação.');
      }
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-primary/20 selection:text-primary">
      {/* Background Effects */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />
      <div className="fixed inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

      {/* Return Home Button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 text-sm font-bold text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors z-50"
      >
        <span className="text-xl">&larr;</span> Voltar
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[460px] max-h-full rounded-card bg-card/95 backdrop-blur-2xl border border-border/60 shadow-2xl flex flex-col z-10 overflow-hidden"
        style={{
          boxShadow: '0 32px 80px rgba(14,28,44,0.22), 0 0 0 1px rgba(255,133,82,0.08)'
        }}
      >
        {/* Top accent */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent" />

        {/* Header */}
        <div className="relative bg-gradient-to-b from-primary/8 to-transparent p-[clamp(1rem,4vh,2rem)] pb-[clamp(0.75rem,2vh,1rem)] border-b border-border/40 shrink-0">
          <div className="flex items-center gap-[clamp(0.5rem,2vh,0.75rem)] mb-[clamp(0.5rem,2vh,1rem)]">
            <div className="w-[clamp(2rem,6vh,2.5rem)] h-[clamp(2rem,6vh,2.5rem)] rounded-button bg-primary border border-primary/20 flex items-center justify-center">
              <IllumineMark className="w-[clamp(1.25rem,4vh,1.5rem)] h-[clamp(1.25rem,4vh,1.5rem)]" />
            </div>
            <div className="flex items-center gap-[clamp(0.25rem,1vh,0.5rem)] rounded-full bg-success/10 border border-success/20 px-[clamp(0.5rem,1.5vh,0.75rem)] py-[clamp(0.25rem,1vh,0.375rem)] text-[clamp(0.5rem,1.5vh,0.5625rem)] font-bold uppercase tracking-widest text-success">
              <CheckCircle2 size={10} className="animate-pulse" />
              Acesso protegido
            </div>
          </div>

          <h2 className="text-[clamp(1.25rem,4vh,1.5rem)] font-medium tracking-tight text-foreground leading-tight">
            Entrar no painel
          </h2>
          <p className="mt-[clamp(0.25rem,1vh,0.375rem)] text-[clamp(0.75rem,2vh,0.875rem)] leading-snug text-muted-foreground font-medium font-sans">
            Continue com seu e-mail e senha ou conta Google para acessar seu ambiente Illumine.
          </p>
        </div>

        {/* Body */}
        <div className="p-[clamp(1rem,4vh,2rem)] space-y-[clamp(0.5rem,2.5vh,1rem)] overflow-y-auto overscroll-contain flex-1">
          <form onSubmit={handleEmailLogin} className="space-y-[clamp(0.5rem,2.5vh,1rem)]">
            {/* Email */}
            <div className="space-y-[clamp(0.25rem,1vh,0.5rem)]">
              <Label className="text-[clamp(0.5rem,1.5vh,0.625rem)] font-bold uppercase tracking-widest text-muted-foreground block px-1">
                E-mail
              </Label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Mail className="w-[clamp(0.875rem,2.5vh,0.9375rem)] h-[clamp(0.875rem,2.5vh,0.9375rem)]" strokeWidth={1.5} />
                </span>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.nome@empresa.com.br"
                  className="pl-10 h-[clamp(2.25rem,7vh,3rem)] text-[clamp(0.75rem,2vh,0.875rem)] bg-surface-container/40"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-[clamp(0.25rem,1vh,0.5rem)]">
              <div className="flex justify-between items-center px-1">
                <Label className="text-[clamp(0.5rem,1.5vh,0.625rem)] font-bold uppercase tracking-widest text-muted-foreground block">
                  Senha
                </Label>
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  disabled={isResetting}
                  className="text-[clamp(0.5rem,1.5vh,0.625rem)] font-bold uppercase tracking-widest text-primary hover:text-primary/80 disabled:opacity-70 transition-colors cursor-pointer"
                >
                  {isResetting ? 'Enviando...' : 'Esqueceu a senha?'}
                </button>
              </div>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Lock className="w-[clamp(0.875rem,2.5vh,0.9375rem)] h-[clamp(0.875rem,2.5vh,0.9375rem)]" strokeWidth={1.5} />
                </span>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  className="pl-10 pr-10 h-[clamp(2.25rem,7vh,3rem)] text-[clamp(0.75rem,2vh,0.875rem)] bg-surface-container/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-[clamp(0.875rem,2.5vh,0.9375rem)] h-[clamp(0.875rem,2.5vh,0.9375rem)]" strokeWidth={1.5} /> : <Eye className="w-[clamp(0.875rem,2.5vh,0.9375rem)] h-[clamp(0.875rem,2.5vh,0.9375rem)]" strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting || isSigningIn}
              className="w-full h-[clamp(2.25rem,7vh,3rem)] font-bold text-[clamp(0.75rem,2vh,0.875rem)] text-primary-foreground uppercase tracking-widest flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-[clamp(0.875rem,2.5vh,1rem)] h-[clamp(0.875rem,2.5vh,1rem)] animate-spin" /> : <LogIn className="w-[clamp(0.875rem,2.5vh,1rem)] h-[clamp(0.875rem,2.5vh,1rem)]" />}
              Entrar
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center pt-[clamp(0.25rem,1vh,0.5rem)] pb-[clamp(0.25rem,1vh,0.5rem)]">
            <div className="absolute inset-x-0 h-px bg-border" />
            <span className="relative px-3 bg-card text-[clamp(0.5rem,1.5vh,0.625rem)] font-semibold uppercase tracking-widest text-muted-foreground">
              ou continue com
            </span>
          </div>

          {/* Google */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={isSigningIn || isSubmitting}
            className="w-full h-[clamp(2.25rem,7vh,3rem)] flex items-center justify-center gap-3 text-[clamp(0.75rem,2vh,0.875rem)] font-medium"
          >
            {isSigningIn ? (
              <Loader2 className="w-[clamp(1rem,3vh,1.125rem)] h-[clamp(1rem,3vh,1.125rem)] animate-spin text-secondary" />
            ) : (
              <svg className="w-[clamp(0.875rem,2.5vh,1rem)] h-[clamp(0.875rem,2.5vh,1rem)]" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
            )}
            {isSigningIn ? 'Conectando...' : 'Entrar com Google'}
          </Button>

          {/* Errors/Messages */}
          <AnimatePresence>
            {loginError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-button bg-destructive/10 border border-destructive/20 px-[clamp(0.75rem,2.5vh,1rem)] py-[clamp(0.5rem,1.5vh,0.75rem)] text-[clamp(0.75rem,2vh,0.875rem)] font-medium text-destructive leading-5"
              >
                {loginError}
              </motion.div>
            )}
            {resetError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-button bg-destructive/10 border border-destructive/20 px-[clamp(0.75rem,2.5vh,1rem)] py-[clamp(0.5rem,1.5vh,0.75rem)] text-[clamp(0.75rem,2vh,0.875rem)] font-medium text-destructive leading-5"
              >
                {resetError}
              </motion.div>
            )}
            {resetMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-button bg-success/10 border border-success/20 px-[clamp(0.75rem,2.5vh,1rem)] py-[clamp(0.5rem,1.5vh,0.75rem)] text-[clamp(0.75rem,2vh,0.875rem)] font-medium text-success leading-5"
              >
                {resetMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Security note */}
          <div className="hidden sm:block rounded-button bg-surface-container/40 border border-border/60 p-[clamp(0.5rem,2vh,0.75rem)] mt-[clamp(0.5rem,2vh,1rem)]">
            <p className="text-[clamp(0.5rem,1.5vh,0.625rem)] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="w-[clamp(0.625rem,2vh,0.6875rem)] h-[clamp(0.625rem,2vh,0.6875rem)] text-secondary shrink-0" />
              Ambiente privado e seguro
            </p>
            <p className="mt-[clamp(0.25rem,1vh,0.375rem)] text-[clamp(0.625rem,1.8vh,0.6875rem)] leading-snug text-muted-foreground/75 font-medium font-sans">
              Suas informações ficam associadas à sua conta corporativa e são acessíveis somente mediante autenticação autorizada.
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
