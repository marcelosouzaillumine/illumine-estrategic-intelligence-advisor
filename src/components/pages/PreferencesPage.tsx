import React, { useState } from 'react';
import { PageHeader } from '../Common';
import { 
  Settings2, 
  Moon, 
  Sun, 
  Monitor, 
  Languages, 
  Bell, 
  Eye, 
  Palette,
  Layout,
  Clock,
  CheckCircle2,
  Globe,
  Database,
  Lock
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

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
    <div className="space-y-16 pb-32">
      <PageHeader 
        title="Preferences" 
        subtitle="Personalize your platform experience, adjust interface settings, language, and strategic notification protocols." 
      />

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Appearance Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 flex items-center justify-center border border-border-main bg-white shadow-sm">
              <Palette size={20} strokeWidth={1} className="text-accent" />
            </div>
            <h3 className="text-3xl font-display text-text-main">Interface & Theme</h3>
          </div>

          <div className="bg-white p-10 space-y-12 border border-border-main rounded-executive shadow-premium relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-bg-surface/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="space-y-6 relative z-10">
              <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-text-dim">Visual Protocol</label>
              <div className="grid grid-cols-1 gap-6">
                {[
                  { id: 'light', label: 'Light (Active)', icon: Sun },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTheme(item.id as any)}
                    className={cn(
                      "flex items-center gap-6 p-6 transition-all border group/btn relative overflow-hidden",
                      theme === item.id 
                        ? "border-accent bg-bg-surface/50 text-text-main shadow-sm" 
                        : "border-border-soft bg-transparent text-text-dim hover:border-border-main"
                    )}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-transparent to-accent/5" />
                    {(() => {
                      const Icon = item.icon;
                      return <Icon size={20} strokeWidth={1} className="text-accent" />;
                    })()}
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{item.label}</span>
                  </button>
                ))}
                <p className="text-[9px] font-medium text-text-dim uppercase tracking-widest mt-2">Dark Mode is temporarily disabled for aesthetic refinement.</p>
              </div>
            </div>

            <div className="space-y-6 relative z-10">
              <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-text-dim">Language Localization</label>
              <div className="flex items-center gap-6 p-6 bg-bg-surface/30 border border-border-main transition-all group-hover:bg-bg-card">
                <Globe size={18} strokeWidth={1} className="text-text-dim" />
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="flex-1 bg-transparent border-none text-sm font-medium text-text-main outline-none focus:ring-0 cursor-pointer"
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Español</option>
                </select>
              </div>
            </div>

            <div className="space-y-6 pt-10 border-t border-border-soft relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-text-main">Executive Compact Mode</h4>
                  <p className="text-[10px] font-medium text-text-dim uppercase tracking-wider mt-1">Maximize data density for deep analysis</p>
                </div>
                <button className="w-12 h-6 bg-border-main relative transition-all group/toggle overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent translate-x-[-100%] group-hover/toggle:translate-x-0 transition-transform" />
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white shadow-sm transition-all" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-text-main">Fluid Animations</h4>
                  <p className="text-[10px] font-medium text-text-dim uppercase tracking-wider mt-1">Enable cinematic interface transitions</p>
                </div>
                <button className="w-12 h-6 bg-primary relative transition-all">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white shadow-sm transition-all" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 flex items-center justify-center border border-border-main bg-white shadow-sm">
              <Bell size={20} strokeWidth={1} className="text-accent" />
            </div>
            <h3 className="text-3xl font-display text-text-main italic">Communication</h3>
          </div>

          <div className="bg-white p-10 space-y-10 border border-border-main rounded-executive shadow-premium relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-bg-surface/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="space-y-6 relative z-10">
              <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-text-dim">Notification Protocols</label>
              <div className="space-y-4">
                {[
                  { id: 'email', label: 'Strategic Reports', desc: 'Receive weekly executive summaries via encrypted email' },
                  { id: 'push', label: 'Real-time Alerts', desc: 'Immediate notification of management axis violations' },
                  { id: 'updates', label: 'Platform Evolution', desc: 'Early access notices for new modules and features' },
                  { id: 'marketing', label: 'Executive Insights', desc: 'Exclusive webinars and strategic management content' },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-6 p-6 hover:bg-bg-surface/50 transition-all border border-transparent hover:border-border-main">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-text-main">{item.label}</h4>
                      <p className="text-[10px] font-medium text-text-dim uppercase tracking-wide">{item.desc}</p>
                    </div>
                    <button 
                      onClick={() => setNotifications(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof notifications] }))}
                      className={cn(
                        "w-12 h-6 relative transition-all shrink-0",
                        notifications[item.id as keyof typeof notifications] ? "bg-accent" : "bg-border-main"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-4 h-4 bg-white transition-all",
                        notifications[item.id as keyof typeof notifications] ? "right-1" : "left-1"
                      )} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 p-8 bg-primary text-white border border-border-main relative overflow-hidden group/box">
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 via-transparent to-transparent opacity-50" />
              <div className="flex items-start gap-6 relative z-10">
                <div className="w-12 h-12 flex items-center justify-center border border-white/20 bg-white/5 shrink-0">
                  <Clock size={20} strokeWidth={1} className="text-accent" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Focus Mode Agendas</h4>
                  <p className="text-[11px] font-light text-white/70 mt-2 mb-6 leading-relaxed">
                    Silence all automated strategic triggers during non-operational periods to maintain work-life balance.
                  </p>
                  <button className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent hover:text-white transition-colors">
                    Configure Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* System Summary */}
        <section className="lg:col-span-2 grid sm:grid-cols-3 gap-8 pt-12">
          {[
            { label: 'Cloud Storage', val: '1.2 GB / 5 GB', icon: Database, accent: 'border-primary' },
            { label: 'Strategic Encryption', val: 'AES-256 Active', icon: Lock, accent: 'border-accent' },
            { label: 'Platform Engine', val: 'v2.5.0 Signature', icon: CheckCircle2, accent: 'border-secondary' },
          ].map((item, idx) => (
            <div key={idx} className={cn("bg-white p-8 border border-border-main shadow-premium flex items-center gap-6 relative overflow-hidden group", item.accent)}>
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-current opacity-20" />
              <div className="w-14 h-14 flex items-center justify-center border border-border-main bg-bg-surface/30 group-hover:border-accent transition-colors">
                {(() => {
                  const Icon = item.icon;
                  return <Icon size={24} strokeWidth={1} className="text-text-dim group-hover:text-accent transition-colors" />;
                })()}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-text-dim">{item.label}</p>
                <p className="text-sm font-bold text-text-main mt-1">{item.val}</p>
              </div>
            </div>
          ))}
        </section>
      </div>

      <div className="flex justify-end pt-12">
        <button className="px-16 py-5 bg-primary text-white text-[11px] font-bold uppercase tracking-[0.4em] shadow-floating hover:-translate-y-1 active:scale-95 transition-all group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-transparent to-accent/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <span className="relative z-10">Commit Preferences</span>
        </button>
      </div>
    </div>
  );
}
