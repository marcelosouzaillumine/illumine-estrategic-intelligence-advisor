import React, { useState } from 'react';
import { PageHeader, ControlBar } from '../Common';
import { 
  Settings2, 
  Sun, 
  Moon,
  Languages, 
  Bell, 
  Eye, 
  Palette,
  Layout,
  Clock,
  CheckCircle2,
  Globe,
  Database,
  Lock,
  Sparkles,
  Zap,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn, getThemeColors } from '../../lib/utils';

export function PreferencesPage() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    return (localStorage.getItem('app-theme') as 'light' | 'dark' | 'system') || 'light';
  });
  const [language, setLanguage] = useState('pt-BR');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    updates: true,
    marketing: false
  });

  const colors = getThemeColors();

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    localStorage.setItem('app-theme', theme);
    window.dispatchEvent(new Event('theme-changed'));
  }, [theme]);

  return (
    <div className="max-w-[1440px] mx-auto space-y-16 pb-32 animate-executive-fade">
      <PageHeader 
        title="Preferências do Sistema" 
        subtitle="Personalize sua experiência na plataforma, ajuste as preferências de interface, idioma e protocolos estratégicos de notificação." 
        icon={Settings2}
        color="executive"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Appearance Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 px-6">
            <div className="w-12 h-12 rounded-2xl bg-surface-container border border-border flex items-center justify-center text-secondary">
              <Palette size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-display font-medium text-foreground tracking-tight">Interface & Tema</h3>
              <p className="text-body-sm text-muted-foreground font-medium">Ajustes visuais e comportamento estético da plataforma.</p>
            </div>
          </div>

          <div className="bg-card p-12 rounded-[48px] border border-border shadow-sm relative overflow-hidden group space-y-10 h-full flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-all duration-1000">
              <Sparkles size={140} className="text-secondary" />
            </div>
            
            <div className="space-y-8 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Protocolo Visual</label>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: 'light', label: 'Modo Claro (Ativo)', icon: Sun },
                    { id: 'dark', label: 'Modo Escuro', icon: Moon },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setTheme(item.id as any)}
                      className={cn(
                        "flex items-center justify-between gap-6 p-6 transition-all border rounded-2xl relative overflow-hidden group/btn",
                        theme === item.id 
                          ? "border-secondary bg-secondary/5 text-foreground shadow-sm" 
                          : "border-border bg-surface-container/50 text-muted-foreground hover:border-border hover:bg-surface-container"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        {(() => {
                          const Icon = item.icon;
                          return <Icon size={20} className={theme === item.id ? "text-secondary animate-pulse" : "text-muted-foreground"} />;
                        })()}
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                      </div>
                      {theme === item.id && (
                        <div className="w-6 h-6 rounded-full bg-secondary/15 flex items-center justify-center text-secondary">
                          <CheckCircle2 size={14} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Localização & Idioma</label>
                <div className="flex items-center gap-4 px-5 py-4 bg-surface-container border border-border rounded-[20px] transition-all focus-within:border-secondary">
                  <Globe size={18} className="text-muted-foreground" />
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="flex-1 bg-transparent border-none text-[11px] font-black uppercase tracking-widest text-foreground outline-none focus:ring-0 cursor-pointer"
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">English (US)</option>
                    <option value="es-ES">Español</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-10 border-t border-border/40 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Modo Compacto Executivo</h4>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-1">Maximiza a densidade de dados para análises profundas</p>
                </div>
                <button className="w-12 h-6 bg-border rounded-full relative transition-all group/toggle overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-transparent translate-x-[-100%] group-hover/toggle:translate-x-0 transition-transform" />
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Transições Fluidas</h4>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-1">Habilita transições cinematográficas de interface</p>
                </div>
                <button className="w-12 h-6 bg-secondary rounded-full relative transition-all">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 px-6">
            <div className="w-12 h-12 rounded-2xl bg-surface-container border border-border flex items-center justify-center text-secondary">
              <Bell size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-display font-medium text-foreground tracking-tight">Comunicação</h3>
              <p className="text-body-sm text-muted-foreground font-medium">Protocolos de notificações estratégicas e relatórios.</p>
            </div>
          </div>

          <div className="bg-card p-12 rounded-[48px] border border-border shadow-sm relative overflow-hidden group space-y-10 h-full flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-all duration-1000">
              <Zap size={140} className="text-secondary" />
            </div>
            
            <div className="space-y-6 relative z-10">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Canais e Triggers</label>
              <div className="space-y-4">
                {[
                  { id: 'email', label: 'Relatórios Semanais', desc: 'Envio automático de pareceres consolidados em PDF' },
                  { id: 'push', label: 'Alertas de Desempenho', desc: 'Notificação imediata em caso de variações de KPIs críticos' },
                  { id: 'updates', label: 'Evolução da Plataforma', desc: 'Notícias sobre novas funcionalidades e ferramentas' },
                  { id: 'marketing', label: 'Insights da Illumine', desc: 'Informações sobre conselho consultivo e webinars de gestão' },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-6 p-6 rounded-2xl hover:bg-surface-container/30 transition-all border border-transparent hover:border-border">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-foreground">{item.label}</h4>
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide leading-relaxed">{item.desc}</p>
                    </div>
                    <button 
                      onClick={() => setNotifications(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof notifications] }))}
                      className={cn(
                        "w-12 h-6 rounded-full relative transition-all shrink-0",
                        notifications[item.id as keyof typeof notifications] ? "bg-secondary" : "bg-border"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                        notifications[item.id as keyof typeof notifications] ? "right-1" : "left-1"
                      )} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 p-8 bg-primary rounded-[32px] text-primary-foreground relative overflow-hidden group/box shadow-2xl shadow-primary/10">
              <div className="absolute inset-0 bg-gradient-to-tr from-secondary/20 via-transparent to-transparent opacity-50" />
              <div className="flex items-start gap-6 relative z-10">
                <div className="w-12 h-12 flex items-center justify-center border border-white/20 bg-white/5 rounded-2xl shrink-0">
                  <Clock size={20} className="text-secondary" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Agendas de Foco (Quiet Mode)</h4>
                  <p className="text-[11px] font-light text-primary-foreground/75 mt-2 mb-4 leading-relaxed">
                    Silencie todas as notificações fora do horário operacional para manter o equilíbrio estratégico.
                  </p>
                  <button className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary hover:text-white transition-colors">
                    Configurar Cronograma
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* System Summary */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
        {[
          { label: 'Armazenamento em Nuvem', val: '1.2 GB / 5 GB', icon: Database, color: 'text-primary' },
          { label: 'Criptografia Estratégica', val: 'AES-256 Ativa', icon: Lock, color: 'text-secondary' },
          { label: 'Motor do Sistema', val: 'v2.5.0 Signature', icon: CheckCircle2, color: 'text-tertiary' },
        ].map((item, idx) => (
          <div key={idx} className="bg-card p-8 border border-border shadow-xs flex items-center gap-6 relative overflow-hidden rounded-2xl group hover:border-secondary/20 transition-all">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 flex items-center justify-center border border-border bg-surface-container rounded-2xl group-hover:border-secondary transition-colors shrink-0">
              {(() => {
                const Icon = item.icon;
                return <Icon size={24} className={item.color} />;
              })()}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">{item.label}</p>
              <p className="text-sm font-semibold text-foreground mt-1">{item.val}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="flex justify-end pt-12">
        <button className="px-6 md:px-12 py-3.5 md:py-5 bg-secondary text-primary rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group shadow-xl shadow-secondary/10">
          Salvar Configurações <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    </div>
  );
}
