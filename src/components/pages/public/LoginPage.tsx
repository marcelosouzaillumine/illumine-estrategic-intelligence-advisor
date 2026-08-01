import { logger } from '../../../services/logging/InstitutionalLogger';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2, CheckCircle2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useAuthAdapter } from '../../../adapters/ui/useAuthAdapter';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { useLanguage } from '../../../contexts/LanguageContext';

export function LoginPage() {
  const { t } = useLanguage();
  useDocumentTitle('Illumine | ' + t('auth.badge.protected_access'));
  const navigate = useNavigate();
  const { login, loginWithEmail, sendPasswordResetEmail } = useAuthAdapter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');

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
    } catch (error: any) {
      logger.error('Google sign-in failed', error);
      setLoginError(
        error?.code === 'auth/popup-closed-by-user'
          ? t('auth.error.login_cancelled')
          : t('auth.error.login_failed_google')
      );
      setIsSigningIn(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isSigningIn) return;
    setLoginError('');
    if (!email || !password) {
      setLoginError(t('auth.error.missing_fields'));
      return;
    }
    setIsSubmitting(true);
    try {
      await loginWithEmail(email.trim(), password);
    } catch (error: any) {
      logger.error('Email authentication error', error);
      let errorMsg = t('auth.error.invalid_credentials');
      switch (error?.code) {
        case 'auth/invalid-email':        errorMsg = t('auth.error.invalid_email'); break;
        case 'auth/user-disabled':        errorMsg = t('auth.error.user_disabled'); break;
        case 'auth/user-not-found':       errorMsg = t('auth.error.user_not_found'); break;
        case 'auth/wrong-password':       errorMsg = t('auth.error.wrong_password'); break;
        case 'auth/invalid-credential':   errorMsg = t('auth.error.invalid_credentials'); break;
      }
      setLoginError(errorMsg);
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setResetError(t('auth.error.enter_email_recovery'));
      setResetMessage('');
      return;
    }
    setIsResetting(true);
    setResetError('');
    setResetMessage('');
    try {
      await sendPasswordResetEmail(email.trim());
      setResetMessage(t('auth.success.recovery_email_sent'));
    } catch (error: any) {
      logger.error('Password reset error', error);
      if (error?.code === 'auth/user-not-found') {
        setResetError(t('auth.error.user_not_found_short'));
      } else if (error?.code === 'auth/invalid-email') {
        setResetError(t('auth.error.invalid_email_short'));
      } else {
        setResetError(t('auth.error.recovery_failed'));
      }
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050506] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans selection:bg-amber-500/30 selection:text-white">
      {/* Background Effects (Dark Institutional Style) */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      {/* Return Home Button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 text-sm font-medium text-slate-400 hover:text-white flex items-center gap-2 transition-colors z-50 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {t('auth.button.back')}
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-[420px] rounded-3xl bg-[#0A0A0B] border border-white/10 shadow-2xl flex flex-col z-10 overflow-hidden"
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />

        {/* Header */}
        <div className="p-8 pb-6 border-b border-white/5 text-center">
          <div className="flex flex-col items-center justify-center gap-4 mb-2">
            <div className="flex items-center gap-1.5">
              <img src="/logo.png" alt="Illumine" className="w-8 h-8 object-contain" />
              <span className="text-3xl tracking-[-0.04em] text-white leading-none" style={{ fontFamily: '"Tilt Warp", sans-serif' }}>
                illumine
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-500">
              <Lock size={12} />
              {t('auth.badge.protected_access')}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          <form onSubmit={handleEmailLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block px-1">
                {t('auth.label.email')}
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-amber-500 transition-colors">
                  <Mail className="w-4 h-4" strokeWidth={2} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.placeholder.email')}
                  className="w-full pl-10 h-12 text-sm bg-white/5 border border-white/10 text-white placeholder-slate-600 rounded-xl focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block">
                  {t('auth.label.password')}
                </label>
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  disabled={isResetting}
                  className="text-[10px] font-bold uppercase tracking-widest text-amber-500 hover:text-amber-400 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {isResetting ? t('auth.button.sending') : t('auth.button.forgot_password')}
                </button>
              </div>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-amber-500 transition-colors">
                  <Lock className="w-4 h-4" strokeWidth={2} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.placeholder.password')}
                  className="w-full pl-10 pr-10 h-12 text-sm bg-white/5 border border-white/10 text-white placeholder-slate-600 rounded-xl focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" strokeWidth={2} /> : <Eye className="w-4 h-4" strokeWidth={2} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || isSigningIn}
              className="w-full h-12 font-bold text-sm bg-white text-black uppercase tracking-widest flex items-center justify-center gap-2 rounded-full hover:bg-slate-200 disabled:opacity-70 transition-all"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
              {t('auth.button.login')}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-x-0 h-px bg-white/10" />
            <span className="relative px-3 bg-[#0A0A0B] text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {t('auth.divider.or_continue_with')}
            </span>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isSigningIn || isSubmitting}
            className="w-full h-12 flex items-center justify-center gap-3 text-sm font-medium bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 disabled:opacity-70 transition-all"
          >
            {isSigningIn ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="currentColor" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="currentColor" />
              </svg>
            )}
            {isSigningIn ? t('auth.button.connecting') : t('auth.button.login_google')}
          </button>

          {/* Errors/Messages */}
          <AnimatePresence>
            {loginError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm font-medium text-red-400"
              >
                {loginError}
              </motion.div>
            )}
            {resetError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm font-medium text-red-400"
              >
                {resetError}
              </motion.div>
            )}
            {resetMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm font-medium text-green-400"
              >
                {resetMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Security note */}
          <div className="hidden sm:flex flex-col gap-1 rounded-xl bg-white/5 border border-white/5 p-4 mt-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              {t('auth.warning.secure_environment')}
            </p>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              {t('auth.note.secure_environment')}
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
