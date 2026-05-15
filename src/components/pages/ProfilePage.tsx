import React, { useState, useEffect } from 'react';
import { PageHeader } from '../Common';
import { 
  User, 
  Mail, 
  Shield, 
  Key, 
  Bell, 
  Camera,
  MapPin,
  Building,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  LogOut,
  Activity,
  Save,
  X,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import type { User as FirebaseUser } from 'firebase/auth';
import { updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { logout, MASTER_ADMINS, auth } from '../../lib/firebase';

interface ProfilePageProps {
  user: FirebaseUser | null;
}

export function ProfilePage({ user }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'sessions'>('info');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Form States
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [resetEmail, setResetEmail] = useState('');

  const isMaster = user?.email && MASTER_ADMINS.includes(user.email);

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
        // Auto save if not in full edit mode? 
        // Better to just enter edit mode or ask to save.
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
    <div className="space-y-8 pb-20">
      <PageHeader 
        title="Meu Perfil" 
        subtitle="Gerencie suas informações pessoais, configurações de segurança e preferências de acesso à plataforma." 
        icon={User}
      />

      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-4 rounded-2xl flex items-center gap-3 font-bold text-sm",
            message.type === 'success' ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
          )}
        >
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {message.text}
          <button onClick={() => setMessage(null)} className="ml-auto hover:opacity-70">
            <X size={16} />
          </button>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-[320px_1fr] gap-8">
        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-[32px] text-center relative overflow-hidden shadow-2xl">
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
                  <div className="w-28 h-28 rounded-[40px] bg-white/5 border-4 border-white/10 shadow-2xl mx-auto flex items-center justify-center text-secondary text-4xl font-black relative z-10 group-hover:scale-105 transition-transform">
                    {displayName?.split(' ').map(n => n[0]).join('') || 'U'}
                  </div>
                )}
                <button 
                  onClick={handlePhotoClick}
                  className="absolute -bottom-2 -right-2 p-3 bg-secondary text-white rounded-2xl shadow-xl hover:bg-secondary/90 transition-all active:scale-90 z-20"
                >
                  <Camera size={16} />
                </button>
              </div>
              <h3 className="mt-6 text-2xl font-black text-white font-display tracking-tight">
                {displayName || 'Usuário Illumine'}
              </h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">
                {isMaster ? 'Master Admin' : 'Consultor Estratégico'}
              </p>
            </div>

            <div className="mt-10 pt-10 border-t border-white/10 flex flex-col gap-2 relative z-10">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-4 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                    activeTab === tab.id 
                      ? "bg-secondary text-white shadow-xl shadow-secondary/20" 
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </div>

            <button 
              onClick={logout}
              className="mt-8 w-full flex items-center justify-center gap-2 px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 border border-white/5 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all relative z-10"
            >
              <LogOut size={16} />
              Encerrar Sessão
            </button>
          </div>

          <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-[32px] p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform text-emerald-500">
              <Shield size={64} />
            </div>
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Shield size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70">Status da Conta</p>
                <p className="text-base font-black text-slate-900">Verificada</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium relative z-10">
              Sua conta possui autenticação via Google habilitada e está em conformidade com as políticas de segurança.
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <main>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm"
          >
            {activeTab === 'info' && (
              <div className="space-y-10">
                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 font-display tracking-tight">Dados Cadastrais</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Informações de Identidade</p>
                  </div>
                  <div className="flex gap-3">
                    {isEditing ? (
                      <>
                        <button 
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-200 transition-all"
                        >
                          Cancelar
                        </button>
                        <button 
                          onClick={handleUpdateProfile}
                          disabled={isLoading}
                          className="px-6 py-3 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 flex items-center gap-2"
                        >
                          {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                          Salvar Alterações
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-secondary transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2"
                      >
                        Editar Dados
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nome Completo</label>
                    {isEditing ? (
                      <input 
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full flex items-center gap-4 px-5 py-4 bg-white border border-slate-200 rounded-[20px] text-sm font-bold text-slate-900 outline-none focus:border-secondary transition-all"
                      />
                    ) : (
                      <div className="flex items-center gap-4 px-5 py-4 bg-slate-50 border border-slate-100 rounded-[20px] text-sm font-bold text-slate-900">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 shadow-sm">
                          <User size={14} />
                        </div>
                        {displayName}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">E-mail Principal</label>
                    <div className={cn(
                      "flex items-center gap-4 px-5 py-4 border rounded-[20px] text-sm font-bold transition-all",
                      isMaster && isEditing 
                        ? "bg-white border-slate-200 text-slate-900 focus-within:border-secondary" 
                        : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                    )}>
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-300 shadow-sm">
                        <Mail size={14} />
                      </div>
                      {user?.email}
                      {!isMaster && (
                        <span title="Somente Master Admin pode alterar" className="ml-auto opacity-50">
                          <Shield size={12} />
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Empresa / Unidade</label>
                    {isEditing && isMaster ? (
                      <input 
                        type="text"
                        defaultValue="Illumine Strategic Advisory"
                        className="w-full flex items-center gap-4 px-5 py-4 bg-white border border-slate-200 rounded-[20px] text-sm font-bold text-slate-900 outline-none focus:border-secondary transition-all"
                      />
                    ) : (
                      <div className="flex items-center gap-4 px-5 py-4 bg-slate-100 border border-slate-200 rounded-[20px] text-sm font-bold text-slate-400 cursor-not-allowed">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-300 shadow-sm">
                          <Building size={14} />
                        </div>
                        Illumine Strategic Advisory
                        {!isMaster && (
                          <span title="Somente Master Admin pode alterar" className="ml-auto opacity-50">
                            <Shield size={12} />
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Cargo / Função</label>
                    {isEditing && isMaster ? (
                      <input 
                        type="text"
                        defaultValue={isMaster ? 'Master Admin' : 'Consultor Estratégico'}
                        className="w-full flex items-center gap-4 px-5 py-4 bg-white border border-slate-200 rounded-[20px] text-sm font-bold text-slate-900 outline-none focus:border-secondary transition-all"
                      />
                    ) : (
                      <div className="flex items-center gap-4 px-5 py-4 bg-slate-100 border border-slate-200 rounded-[20px] text-sm font-bold text-slate-400 cursor-not-allowed">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-300 shadow-sm">
                          <Shield size={14} />
                        </div>
                        {isMaster ? 'Master Admin' : 'Consultor Estratégico'}
                        {!isMaster && (
                          <span title="Somente Master Admin pode alterar" className="ml-auto opacity-50">
                            <Shield size={12} />
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-10 border-t border-slate-100">
                  <h4 className="text-lg font-black text-slate-900 mb-6 font-display">Contas Conectadas</h4>
                  <div className="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-[32px] group hover:border-secondary/20 transition-all">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-base font-black text-slate-900">Google Account</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronização Ativa</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                      <CheckCircle2 size={14} /> Conectado
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-10">
                <div className="pb-6 border-b border-slate-100">
                  <h3 className="text-2xl font-black text-slate-900 font-display tracking-tight">Segurança & Acesso</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Proteção de Dados e Autenticação</p>
                </div>
                
                <div className="grid gap-6">
                  {/* Master Admin Section: Password Reset for Others */}
                  {isMaster && (
                    <div className="p-8 border-2 border-primary/10 bg-primary/5 rounded-[32px] relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                        <RefreshCw size={64} className="text-primary" />
                      </div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-5 mb-6">
                          <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                            <Key size={28} />
                          </div>
                          <div>
                            <h4 className="text-lg font-black text-slate-900">Resetar Senha de Usuário</h4>
                            <p className="text-sm font-medium text-slate-500 mt-1">O usuário receberá um e-mail para definir uma nova senha</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <input 
                            type="email"
                            placeholder="E-mail do usuário para reset..."
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            className="flex-1 px-5 py-4 bg-white border border-slate-200 rounded-[20px] text-sm font-bold text-slate-900 outline-none focus:border-primary transition-all"
                          />
                          <button 
                            onClick={() => handleResetPassword(resetEmail)}
                            disabled={isLoading || !resetEmail}
                            className="px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
                          >
                            {isLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                            Enviar Reset
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-8 border border-slate-100 rounded-[32px] hover:border-secondary/20 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                      <Shield size={64} className="text-secondary" />
                    </div>
                    <div className="flex items-center justify-between mb-2 relative z-10">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all duration-500">
                          <Shield size={28} />
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-slate-900">Autenticação de Dois Fatores</h4>
                          <p className="text-sm font-medium text-slate-500 mt-1">Camada extra de proteção via app ou SMS</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setMessage({ type: 'error', text: 'Funcionalidade em desenvolvimento.' })}
                        className="px-6 py-3 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                      >
                        Configurar
                      </button>
                    </div>
                  </div>

                  <div className="p-8 border border-slate-100 rounded-[32px] hover:border-blue-500/20 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                      <Key size={64} className="text-blue-500" />
                    </div>
                    <div className="flex items-center justify-between mb-2 relative z-10">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                          <Key size={28} />
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-slate-900">Alterar Minha Senha</h4>
                          <p className="text-sm font-medium text-slate-500 mt-1">Troque sua senha periodicamente</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleResetPassword(user?.email || '')}
                        disabled={isLoading}
                        className="px-6 py-3 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                      >
                        Solicitar Reset
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-rose-50 border border-rose-100 rounded-[32px] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform text-rose-500">
                    <AlertCircle size={64} />
                  </div>
                  <div className="flex items-start gap-6 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                      <AlertCircle size={28} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-rose-900">Zona de Perigo</h4>
                      <p className="text-sm font-medium text-rose-700/80 mt-2 mb-6 leading-relaxed">
                        Ao excluir sua conta, todos os seus dados pessoais e preferências serão removidos permanentemente de nossos sistemas. Esta ação é irreversível.
                      </p>
                      <button className="px-6 py-3 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-rose-700 transition-all shadow-xl shadow-rose-600/20">
                        Solicitar Exclusão
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sessions' && (
              <div className="space-y-10">
                <div className="pb-6 border-b border-slate-100">
                  <h3 className="text-2xl font-black text-slate-900 font-display tracking-tight">Sessões Ativas</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Controle de Acessos em Tempo Real</p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-8 border-2 border-secondary/20 bg-secondary/5 rounded-[32px] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform text-secondary">
                      <Activity size={64} />
                    </div>
                    <div className="flex items-center gap-5 relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-white border border-secondary/20 flex items-center justify-center text-secondary shadow-sm">
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                          <Shield size={28} />
                        </motion.div>
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="text-lg font-black text-slate-900">MacBook Pro - Chrome</h4>
                          <span className="px-3 py-1 bg-secondary text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-secondary/20">Sessão Atual</span>
                        </div>
                        <p className="text-sm font-medium text-slate-500 mt-1">São Paulo, Brasil • IP: 189.122.XX.XX</p>
                      </div>
                    </div>
                    <button className="p-3 text-slate-300 cursor-not-allowed">
                      <ChevronRight size={24} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-8 border border-slate-100 rounded-[32px] group hover:border-slate-200 transition-all">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors duration-500">
                        <Shield size={28} />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-900">iPhone 15 - App</h4>
                        <p className="text-sm font-medium text-slate-500 mt-1">Curitiba, Brasil • Há 2 horas</p>
                      </div>
                    </div>
                    <button className="px-6 py-3 text-rose-500 hover:bg-rose-50 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-transparent hover:border-rose-100">
                      Encerrar
                    </button>
                  </div>
                </div>

                <div className="flex justify-center pt-6">
                  <button className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-rose-500 transition-colors">
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
