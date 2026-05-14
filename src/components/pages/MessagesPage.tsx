import React, { useState } from 'react';
import { PageHeader } from '../Common';
import { 
  Rocket, 
  Settings, 
  Bug, 
  Zap, 
  Calendar,
  CheckCircle2,
  Bell,
  MessageSquare,
  Info,
  ShieldCheck,
  Megaphone,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface Message {
  id: string;
  date: string;
  type: 'announcement' | 'alert' | 'update';
  title: string;
  content: string;
  read: boolean;
}

interface ChangelogEntry {
  id: string;
  version: string;
  date: string;
  type: 'feature' | 'improvement' | 'fix';
  title: string;
  description: string;
  items: string[];
}

const MESSAGES_DATA: Message[] = [
  {
    id: 'm1',
    date: '13 de Maio, 2026',
    type: 'announcement',
    title: 'Suporte a Tema Escuro Implementado',
    content: 'Agora você pode alternar entre os temas Claro e Escuro nas preferências do sistema. O tema Escuro foi otimizado para proporcionar uma experiência visual premium em ambientes de baixa luminosidade.',
    read: false
  },
  {
    id: 'm2',
    date: '12 de Maio, 2026',
    type: 'alert',
    title: 'Manutenção Programada',
    content: 'Realizaremos uma manutenção preventiva no banco de dados no próximo domingo às 02:00 AM. O sistema poderá ficar indisponível por aproximadamente 15 minutos.',
    read: true
  }
];

const CHANGELOG_DATA: ChangelogEntry[] = [
  {
    id: 'c1',
    version: 'v2.4.0',
    date: '12 de Maio, 2026',
    type: 'feature',
    title: 'Nova Área de Mensagens e Perfil',
    description: 'Implementamos a central de notificações e a estruturação das páginas de perfil e preferências.',
    items: [
      'Criação da página de Mensagens para acompanhamento de comunicados',
      'Estruturação da página de Perfil do Usuário',
      'Implementação da área de Preferências do Sistema',
      'Melhorias na navegação lateral para acesso rápido às configurações'
    ]
  },
  {
    id: 'c2',
    version: 'v2.3.5',
    date: '10 de Maio, 2026',
    type: 'improvement',
    title: 'Padronização de Termos e Eixos',
    description: 'Refinamos a nomenclatura dos eixos estratégicos para maior consistência em toda a plataforma.',
    items: [
      'Renomeação do eixo "Operacional" para "Operação"',
      'Ajuste na ordem de exibição dos eixos no Dashboard',
      'Melhoria na legibilidade dos cards de indicadores'
    ]
  }
];

export function MessagesPage() {
  const [activeTab, setActiveTab] = useState<'messages' | 'changelog'>('messages');

  return (
    <div className="space-y-8 pb-20">
        <PageHeader 
          title="Monitoramento Estratégico: Mensagens e Comunicados" 
          subtitle="Gestão centralizada de comunicações institucionais, avisos aos usuários e registros de atualizações do ecossistema Illumine." 
          icon={Bell}
          actions={
            <div className="flex bg-white/5 backdrop-blur-md p-1 rounded-2xl border border-white/10 shadow-inner">
              <button 
                onClick={() => setActiveTab('messages')}
                className={cn(
                  "px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest",
                  activeTab === 'messages' 
                    ? "bg-secondary text-primary shadow-lg" 
                    : "text-slate-400 hover:text-white"
                )}
              >
                <Bell size={14} strokeWidth={2.5} /> Mensagens
              </button>
              <button 
                onClick={() => setActiveTab('changelog')}
                className={cn(
                  "px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest",
                  activeTab === 'changelog' 
                    ? "bg-secondary text-primary shadow-lg" 
                    : "text-slate-400 hover:text-white"
                )}
              >
                <Zap size={14} strokeWidth={2.5} /> Comunicados de Atualização
              </button>
            </div>
          }
        />

      <AnimatePresence mode="wait">
        {activeTab === 'messages' ? (
          <motion.div 
            key="messages"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4 max-w-4xl"
          >
            {MESSAGES_DATA.map((msg) => (
              <div key={msg.id} className="bg-white p-10 flex flex-col md:flex-row gap-10 items-start border border-border-main rounded-executive shadow-premium hover:shadow-floating transition-all duration-700 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-bg-surface/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className={cn(
                  "w-16 h-16 flex items-center justify-center shrink-0 border border-border-main bg-white transition-all duration-500 group-hover:border-accent group-hover:scale-110 shadow-sm relative z-10",
                  msg.type === 'announcement' ? "text-primary" : 
                  msg.type === 'alert' ? "text-amber-600" : 
                  "text-emerald-600"
                )}>
                  {msg.type === 'announcement' ? <Bell size={24} strokeWidth={1} /> : 
                   msg.type === 'alert' ? <Info size={24} strokeWidth={1} /> : 
                   <Settings size={24} strokeWidth={1} />}
                </div>
                
                <div className="flex-1 min-w-0 relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <h3 className="text-2xl font-display text-text-main leading-none italic">{msg.title}</h3>
                      {!msg.read && (
                        <span className="w-2 h-2 rounded-full bg-accent shadow-glow animate-pulse" />
                      )}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-dim">{msg.date}</span>
                  </div>
                  <p className="text-text-muted text-lg leading-relaxed mb-8 font-light max-w-3xl">
                    {msg.content}
                  </p>
                  <button className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] text-accent group/btn hover:text-primary transition-colors">
                    Detalhes do Comunicado <ArrowRight size={14} className="group-hover/btn:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="changelog"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-4xl space-y-12 relative before:absolute before:left-[17px] before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800"
          >
            {CHANGELOG_DATA.map((entry, index) => (
              <div key={entry.id} className="relative pl-12 group">
                <div className={cn(
                  "absolute left-0 top-1.5 w-9 h-9 rounded-xl flex items-center justify-center border-4 border-white dark:border-slate-950 shadow-sm z-10 transition-transform group-hover:scale-110",
                  entry.type === 'feature' ? "bg-secondary text-white" : 
                  entry.type === 'improvement' ? "bg-emerald-500 text-white" : 
                  "bg-rose-500 text-white"
                )}>
                  {entry.type === 'feature' ? <Rocket size={16} /> : 
                   entry.type === 'improvement' ? <Zap size={16} /> : 
                   <Bug size={16} />}
                </div>

                <div className="card-glass p-8 card-interactive">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                        entry.type === 'feature' ? "bg-secondary/10 text-secondary" : 
                        entry.type === 'improvement' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : 
                        "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      )}>
                        {entry.type === 'feature' ? 'Nova Implementação' : 
                         entry.type === 'improvement' ? 'Ajuste' : 
                         'Correção'}
                      </span>
                      <span className="text-sm font-bold text-text-main font-display">{entry.version}</span>
                    </div>
                    <div className="flex items-center gap-2 text-text-dim">
                      <Calendar size={14} />
                      <span className="text-xs font-bold">{entry.date}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-text-main font-display mb-3">{entry.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed mb-6 font-medium">
                    {entry.description}
                  </p>

                  <div className="space-y-3">
                    {entry.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm text-text-muted font-medium">
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
