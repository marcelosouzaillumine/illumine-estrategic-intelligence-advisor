import React, { useState, useEffect } from 'react';
import { PageHeader } from '../Common';
import { User, Mail, Shield, Key, Camera, Building, CheckCircle2, AlertCircle, ChevronRight, LogOut, Activity, Save, X, Loader2, RefreshCw, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, getThemeColors } from '../../lib/utils';
import type { User as FirebaseUser } from 'firebase/auth';
import { updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { logout, MASTER_ADMINS, auth } from '../../lib/firebase';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface ProfilePageProps {
  user: FirebaseUser | null;
  clients?: any[];
  selectedClient?: string;
}

export function ProfilePage({ user, clients = [], selectedClient = '' }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'sessions'>('info');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Form States
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [resetEmail, setResetEmail] = useState('');

  const isMaster = user?.email && MASTER_ADMINS.includes(user.email);
  
  const currentClient = clients.find(c => c.id === selectedClient);
  const userRole = currentClient ? 'Usuário do Cliente' : 'Consultor Estratégico';
  const companyName = isMaster ? 'Illumine Governance' : (currentClient?.fantasia || currentClient?.razao || 'Empresa não vinculada');

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setIsLoading(true);
    setMessage(null);
    try {
      await updateProfile(user, {
        displayName: displayName,
        photoURL: photoURL
      });
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Erro ao atualizar perfil. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    if (!email) return;
    setIsLoading(true);
    setMessage(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage({ type: 'success', text: `E-mail de redefinição enviado para ${email}` });
      setResetEmail('');
    } catch (error: any) {
      console.error('Error sending reset email:', error);
      setMessage({ type: 'error', text: 'Erro ao enviar e-mail. Verifique o endereço informado.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoClick = () => {
    const url = prompt('Insira a URL da nova foto de perfil:', photoURL);
    if (url !== null) {
      setPhotoURL(url);
      if (!isEditing) {
        setIsEditing(true);
      }
    }
  };

  const tabs = [
    { id: 'info', label: 'Informações Pessoais', icon: User },
    { id: 'security', label: 'Segurança & Acesso', icon: Shield },
    { id: 'sessions', label: 'Sessões Ativas', icon: Key },
  ];

  return (
    <div className="max-w-[1440px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8 sm:space-y-12 pb-32 animate-executive-fade overflow-x-hidden">
      <PageHeader 
        title="Meu Perfil" 
        subtitle="Gerencie suas informações pessoais, configurações de segurança e preferências de acesso à plataforma." 
        icon={User}
        color="executive"
        className="px-2"
      />

      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "p-6 rounded-[24px] flex items-start gap-5 animate-executive-fade shadow-sm border",
              message.type === 'success' 
                ? "bg-success/5 border-success/10 text-success" 
                : "bg-destructive/5 border-destructive/10 text-destructive"
            )}
          >
            <div className={cn(
              "p-3 rounded-xl border shrink-0 shadow-inner",
              message.type === 'success' ? "bg-success-soft border-success/20" : "bg-critical-soft border-destructive/20"
            )}>
              {message.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
            </div>
            <div className="flex-1 space-y-1 pt-1.5">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">{message.type === 'success' ? 'Operação Concluída' : 'Erro na Operação'}</h4>
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-widest leading-relaxed">{message.text}</p>
            </div>
            <button onClick={() => setMessage(null)} className="text-muted-foreground/40 hover:text-foreground transition-colors pt-2">
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        {/* Sidebar */}
        <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
          <div className="bg-primary p-8 rounded-[48px] text-center relative overflow-hidden shadow-2xl shadow-primary/20 border border-white/5">
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-white/5 to-transparent" />
            <div className="relative z-10">
              <div className="relative inline-block group">
                <div className="absolute inset-0 bg-secondary/20 blur-2xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-500" />
                {photoURL ? (
                  <img 
                    src={photoURL} 
                    alt={user?.displayName || ''} 
                    className="w-28 h-28 rounded-[40px] border-4 border-white/10 shadow-2xl mx-auto object-cover relative z-10 group-hover:scale-105 transition-transform" 
                  />
                ) : (
                  <div className="w-28 h-28 rounded-[40px] bg-white/5 border-4 border-white/10 shadow-2xl mx-auto flex items-center justify-center text-secondary text-4xl font-black relative z-10 group-hover:scale-105 transition-transform font-display">
                    {displayName?.split(' ').map(n => n[0]).join('') || 'U'}
                  </div>
                )}
                <button 
                  onClick={handlePhotoClick}
                  className="absolute -bottom-2 -right-2 p-3 bg-secondary text-primary rounded-2xl shadow-xl hover:bg-white hover:scale-105 transition-all active:scale-90 z-20"
                >
                  <Camera size={16} strokeWidth={2.5} />
                </button>
              </div>
              <h3 className="mt-6 text-xl font-display font-medium text-white tracking-tight">
                {displayName || 'Usuário Illumine'}
              </h3>
              <p className="text-[10px] font-black text-white/55 uppercase tracking-[0.3em] mt-2">
                {isMaster ? 'Master Admin' : userRole}
              </p>
            </div>

            <div className="mt-8 md:mt-10 pt-8 md:pt-10 border-t border-white/10 flex flex-col gap-2 relative z-10">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-4 px-5 py-4 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all w-full text-left",
                    activeTab === tab.id 
                      ? "bg-secondary text-primary shadow-xl shadow-secondary/20 font-bold" 
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <tab.icon size={18} className="shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              ))}
            </div>

            <button 
              onClick={logout}
              className="mt-8 w-full flex items-center justify-center gap-2 px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 border border-white/5 hover:bg-critical-soft0/10 hover:border-rose-500/20 transition-all relative z-10"
            >
              <LogOut size={16} />
              Encerrar Sessão
            </button>
          </div>

          <div className="bg-success/5 border border-success/10 rounded-[32px] p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform text-success">
              <Shield size={64} />
            </div>
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-success-soft text-success flex items-center justify-center">
                <Shield size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-success/70">Status da Conta</p>
                <p className="text-base font-semibold text-foreground">Conta Ativa</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
              Sua conta possui autenticação via Google habilitada e está em total conformidade com as políticas de segurança.
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card p-6 md:p-8 lg:p-12 rounded-[32px] md:rounded-[48px] border border-border shadow-sm h-full"
          >
            {activeTab === 'info' && (
              <div className="space-y-8 md:space-y-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/40">
                  <div className="min-w-0">
                    <h3 className="text-xl sm:text-2xl font-display font-medium text-foreground tracking-tight">Dados Cadastrais</h3>
                    <p className="text-muted-foreground text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-1">Informações de Identidade</p>
                  </div>
                  <div className="flex gap-2 sm:gap-3 shrink-0">
                    {isEditing ? (
                      <>
                        <Button 
                          onClick={() => setIsEditing(false)}
                          variant="outline"
                          className="px-3 sm:px-5 py-2 sm:py-3 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap"
                        >
                          Cancelar
                        </Button>
                        <Button 
                          onClick={handleUpdateProfile}
                          disabled={isLoading}
                          className="px-3 sm:px-5 py-2 sm:py-3 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] shadow-xl flex items-center gap-2 whitespace-nowrap"
                        >
                          {isLoading ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                          Salvar
                        </Button>
                      </>
                    ) : (
                      <Button 
                        onClick={() => setIsEditing(true)}
                        className="px-3 sm:px-5 py-2 sm:py-3 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] shadow-xl flex items-center gap-2 whitespace-nowrap"
                      >
                        Editar Dados
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
                  {/* Nome Completo */}
                  <div className="space-y-2">
                    <Label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Nome Completo</Label>
                    {isEditing ? (
                      <Input 
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full h-12 bg-surface-container rounded-[20px] shadow-inner"
                      />
                    ) : (
                      <div className="flex items-center gap-3 px-4 py-3 bg-surface-container/50 border border-border rounded-[20px] min-w-0 overflow-hidden">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground shadow-sm shrink-0">
                          <User size={13} />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-foreground truncate min-w-0">{displayName}</span>
                      </div>
                    )}
                  </div>

                  {/* E-mail Principal */}
                  <div className="space-y-2">
                    <Label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-secondary ml-1">E-mail Principal</Label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-surface-container border border-border rounded-[20px] cursor-not-allowed min-w-0 overflow-hidden">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground shadow-sm shrink-0">
                        <Mail size={13} />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-muted-foreground truncate min-w-0 flex-1">{user?.email}</span>
                      {!isMaster && (
            <span title="Somente Master Admin pode alterar" className=" shrink-0">
                          <Shield size={12} />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Empresa / Unidade */}
                  <div className="space-y-2">
                    <Label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Empresa / Unidade</Label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-surface-container border border-border rounded-[20px] cursor-not-allowed min-w-0 overflow-hidden">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground shadow-sm shrink-0">
                        <Building size={13} />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-muted-foreground truncate min-w-0 flex-1">{companyName}</span>
                      {!isMaster && (
            <span title="Somente Master Admin pode alterar" className=" shrink-0">
                          <Shield size={12} />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Cargo / Função */}
                  <div className="space-y-2">
                    <Label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Cargo / Função</Label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-surface-container border border-border rounded-[20px] cursor-not-allowed min-w-0 overflow-hidden">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground shadow-sm shrink-0">
                        <Shield size={13} />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-muted-foreground truncate min-w-0 flex-1">{isMaster ? 'Master Admin' : userRole}</span>
                      {!isMaster && (
            <span title="Somente Master Admin pode alterar" className=" shrink-0">
                          <Shield size={12} />
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t border-border/40">
                  <h4 className="text-lg font-display font-medium text-foreground mb-6">Contas Conectadas</h4>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 md:p-6 bg-surface-container border border-border rounded-[24px] md:rounded-[32px] group hover:border-secondary/20 transition-all">
                    <div className="flex items-center gap-4 md:gap-5">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-card border border-border flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0">
                        <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm md:text-base font-semibold text-foreground">Conta Google</p>
                        <p className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest">Sincronização Ativa</p>
                      </div>
                    </div>
                    <span className="flex items-center justify-center gap-2 px-4 py-2 bg-success-soft text-success rounded-xl text-[10px] font-black uppercase tracking-widest border border-success/20 w-full sm:w-auto">
                      <CheckCircle2 size={14} /> Conectado
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8 md:space-y-10">
                <div className="pb-6 border-b border-border/40">
                  <h3 className="text-2xl font-display font-medium text-foreground tracking-tight">Segurança & Acesso</h3>
                  <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-1">Proteção de Dados e Autenticação</p>
                </div>
                
                <div className="grid gap-6">
                  {/* Master Admin Section: Password Reset for Others */}
                  {isMaster && (
                    <div className="p-8 border border-secondary/25 bg-secondary/5 rounded-[32px] relative overflow-hidden group shadow-xs">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                        <RefreshCw size={64} className="text-secondary" />
                      </div>
                      <div className="relative z-10 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-5">
                          <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-secondary text-primary flex items-center justify-center shadow-lg shadow-secondary/15 shrink-0">
                            <Key size={24} className="md:w-7 md:h-7" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-foreground">Resetar Senha de Usuário</h4>
              <p className="text-sm font-medium text-executive-secondary mt-1">O usuário receberá um e-mail com protocolo para definir uma nova credencial</p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <Input 
                            type="email"
                            placeholder="E-mail do usuário..."
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            className="flex-1 h-12 bg-surface-container rounded-[20px] shadow-inner"
                          />
                          <Button 
                            onClick={() => handleResetPassword(resetEmail)}
                            disabled={isLoading || !resetEmail}
                            className="px-5 md:px-8 py-2.5 md:py-3.5 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-2"
                          >
                            {isLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                            Enviar Reset
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-8 border border-border rounded-[32px] hover:border-secondary/20 transition-all group relative overflow-hidden bg-card">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                      <Shield size={64} className="text-secondary" />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-5">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-surface-container text-secondary flex items-center justify-center group-hover:bg-secondary/15 transition-all shrink-0 border border-border">
                          <Shield size={24} className="md:w-7 md:h-7" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-foreground">Autenticação de Dois Fatores</h4>
             <p className="text-sm font-medium text-executive-secondary mt-1">Camada extra de proteção via aplicativo de segurança</p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => setMessage({ type: 'error', text: 'Funcionalidade em desenvolvimento.' })}
                        variant="outline"
                        className="px-4 md:px-6 py-2 md:py-3 text-[10px] font-black uppercase tracking-[0.2em] shrink-0"
                      >
                        Configurar
                      </Button>
                    </div>
                  </div>

                  <div className="p-8 border border-border rounded-[32px] hover:border-secondary/20 transition-all group relative overflow-hidden bg-card">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                      <Key size={64} className="text-secondary" />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-5">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-surface-container text-secondary flex items-center justify-center group-hover:bg-secondary/15 transition-all shrink-0 border border-border">
                          <Key size={24} className="md:w-7 md:h-7" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-foreground">Alterar Minha Senha</h4>
             <p className="text-sm font-medium text-executive-secondary mt-1">Troque sua senha periodicamente para manter a segurança</p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleResetPassword(user?.email || '')}
                        disabled={isLoading}
                        variant="outline"
                        className="px-4 md:px-6 py-2 md:py-3 text-[10px] font-black uppercase tracking-[0.2em] shrink-0"
                      >
                        Solicitar Reset
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-critical-soft0/5 border border-rose-500/10 rounded-[32px] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform text-destructive">
                    <AlertCircle size={64} />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 md:gap-6 relative z-10">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-critical-soft0/10 text-destructive flex items-center justify-center shrink-0 border border-rose-500/10">
                      <AlertCircle size={24} className="md:w-7 md:h-7" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-destructive">Zona de Perigo</h4>
           <p className="text-sm font-medium text-executive-secondary mt-2 mb-6 leading-relaxed">
                        Ao excluir sua conta, todos os seus dados pessoais, relatórios e preferências salvos serão removidos permanentemente. Esta ação é irreversível.
                      </p>
                      <Button variant="destructive" className="px-4 md:px-6 py-2 md:py-3 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
                        Solicitar Exclusão
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sessions' && (
              <div className="space-y-8 md:space-y-10">
                <div className="pb-6 border-b border-border/40">
                  <h3 className="text-2xl font-display font-medium text-foreground tracking-tight">Sessões Ativas</h3>
                  <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-1">Controle de Acessos em Tempo Real</p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-8 border border-secondary/20 bg-secondary/5 rounded-[24px] md:rounded-[32px] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform text-secondary">
                      <Activity size={64} />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-5 relative z-10">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-card border border-secondary/20 flex items-center justify-center text-secondary shadow-sm shrink-0">
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                          <Shield size={24} className="md:w-7 md:h-7" />
                        </motion.div>
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="text-lg font-semibold text-foreground">Dispositivo Atual</h4>
                          <span className="px-3 py-1 bg-secondary text-primary text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-secondary/10">Ativo</span>
                        </div>
            <p className="text-sm font-medium text-executive-secondary mt-1">Chrome / MacBook Pro • IP: 189.122.XX.XX</p>
                      </div>
                    </div>
                    <button className="hidden md:block p-3 text-muted-foreground/30 cursor-not-allowed">
                      <ChevronRight size={24} />
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-8 border border-border rounded-[24px] md:rounded-[32px] group hover:border-secondary/20 transition-all bg-card">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-5">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-surface-container border border-border flex items-center justify-center text-muted-foreground group-hover:text-secondary group-hover:bg-secondary/15 transition-all shrink-0">
                        <Shield size={24} className="md:w-7 md:h-7" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-foreground font-display">Dispositivo Mobile</h4>
            <p className="text-sm font-medium text-executive-secondary mt-1">Aplicativo Illumine / iPhone 15 • Curitiba, Brasil • Há 2 horas</p>
                      </div>
                    </div>
                    <button className="px-4 md:px-6 py-2 md:py-3 text-destructive hover:bg-destructive/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-transparent hover:border-destructive/10 whitespace-nowrap shrink-0">
                      Encerrar
                    </button>
                  </div>
                </div>

                <div className="flex justify-center pt-6">
                  <button className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-destructive transition-colors">
                    Encerrar todas as outras sessões
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
