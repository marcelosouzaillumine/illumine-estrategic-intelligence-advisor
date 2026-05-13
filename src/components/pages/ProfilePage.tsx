import React, { useState } from 'react';
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
  LogOut
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import type { User as FirebaseUser } from 'firebase/auth';
import { logout } from '../../lib/firebase';

interface ProfilePageProps {
  user: FirebaseUser | null;
}

export function ProfilePage({ user }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'sessions'>('info');

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
      />

      <div className="grid lg:grid-cols-[320px_1fr] gap-8">
        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="glass-card p-8 text-center relative overflow-hidden dark:bg-slate-900/50 dark:border-slate-800">
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-br from-primary to-slate-800" />
            <div className="relative mt-8">
              <div className="relative inline-block">
                {user?.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || ''} 
                    className="w-24 h-24 rounded-[32px] border-4 border-white dark:border-slate-900 shadow-xl mx-auto object-cover" 
                  />
                ) : (
                  <div className="w-24 h-24 rounded-[32px] bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-xl mx-auto flex items-center justify-center text-primary dark:text-slate-100 text-3xl font-black">
                    {user?.displayName?.split(' ').map(n => n[0]).join('') || 'U'}
                  </div>
                )}
                <button className="absolute bottom-0 right-0 p-2 bg-secondary text-white rounded-xl shadow-lg hover:bg-secondary/90 transition-all active:scale-90">
                  <Camera size={14} />
                </button>
              </div>
              <h3 className="mt-4 text-xl font-black text-slate-900 font-display">
                {user?.displayName || 'Usuário Illumine'}
              </h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                Consultor Estratégico
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all",
                    activeTab === tab.id 
                      ? "bg-primary text-white shadow-xl shadow-primary/20" 
                      : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100"
                  )}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>

            <button 
              onClick={logout}
              className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-rose-500 border border-rose-100 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
            >
              <LogOut size={16} />
              Encerrar Sessão
            </button>
          </div>

          <div className="glass-card p-6 bg-emerald-50/50 border-emerald-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Status da Conta</p>
                <p className="text-sm font-black text-slate-900">Verificada</p>
              </div>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
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
            className="glass-card p-10 dark:bg-slate-900/50 dark:border-slate-800"
          >
            {activeTab === 'info' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 font-display">Dados Cadastrais</h3>
                  <button className="px-5 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-white transition-all">
                    Editar Dados
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nome Completo</label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-slate-100">
                      <User size={16} className="text-slate-400" />
                      {user?.displayName}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">E-mail Principal</label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-slate-100">
                      <Mail size={16} className="text-slate-400" />
                      {user?.email}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Empresa / Unidade</label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-slate-100">
                      <Building size={16} className="text-slate-400" />
                      Illumine Strategic Advisory
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Cargo / Função</label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-slate-100">
                      <Shield size={16} className="text-slate-400" />
                      Master Admin
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-lg font-black text-slate-900 dark:text-slate-100 mb-6">Contas Conectadas</h4>
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-slate-100">Google Account</p>
                        <p className="text-xs font-medium text-slate-400">Vinculado para login e sincronização</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-500 tracking-widest">
                      <CheckCircle2 size={14} /> Conectado
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 font-display">Segurança & Acesso</h3>
                
                <div className="grid gap-4">
                  <div className="p-6 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-secondary/20 transition-all group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all">
                          <Shield size={24} />
                        </div>
                        <div>
                          <h4 className="text-base font-black text-slate-900 dark:text-slate-100">Autenticação de Dois Fatores</h4>
                          <p className="text-xs font-medium text-slate-400">Adicione uma camada extra de proteção</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                        Configurar
                      </button>
                    </div>
                  </div>

                  <div className="p-6 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-secondary/20 transition-all group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <Key size={24} />
                        </div>
                        <div>
                          <h4 className="text-base font-black text-slate-900 dark:text-slate-100">Alterar Senha</h4>
                          <p className="text-xs font-medium text-slate-400">Recomendado trocar a cada 90 dias</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                        Alterar
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-2xl">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                      <AlertCircle size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-rose-900 dark:text-rose-100">Zona de Perigo</h4>
                      <p className="text-xs font-medium text-rose-700 dark:text-rose-300 mt-1 mb-4">
                        Ao excluir sua conta, todos os seus dados pessoais e preferências serão removidos permanentemente. Esta ação não pode ser desfeita.
                      </p>
                      <button className="text-[10px] font-black uppercase tracking-widest text-rose-600 dark:text-rose-400 hover:underline">
                        Solicitar Exclusão de Conta
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sessions' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 font-display">Sessões Ativas</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-6 border-2 border-secondary/20 bg-secondary/5 dark:bg-secondary/10 rounded-3xl relative overflow-hidden">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-secondary/20 flex items-center justify-center text-secondary">
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                          <Shield size={24} />
                        </motion.div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-black text-slate-900 dark:text-slate-100">MacBook Pro - Chrome</h4>
                          <span className="px-2 py-0.5 bg-secondary text-white text-[8px] font-black uppercase tracking-widest rounded-full">Sessão Atual</span>
                        </div>
                        <p className="text-xs font-medium text-slate-500">São Paulo, Brasil • IP: 189.122.XX.XX</p>
                      </div>
                    </div>
                    <button className="p-2 text-slate-300 cursor-not-allowed">
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-6 border border-slate-100 dark:border-slate-800 rounded-3xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400">
                        <Shield size={24} />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-slate-900 dark:text-slate-100">iPhone 15 - App</h4>
                        <p className="text-xs font-medium text-slate-500">Curitiba, Brasil • Há 2 horas</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                      Encerrar
                    </button>
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <button className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors">
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
