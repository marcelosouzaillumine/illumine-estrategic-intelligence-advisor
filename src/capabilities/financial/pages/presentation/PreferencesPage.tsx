


import React, { useState } from 'react';
import { PageHeader, ControlBar, StatusBadge } from '../../../../components/Common';
import { Settings2, Sun, Moon, Languages, Bell, Eye, Palette, Layout, Clock, CheckCircle2, Globe, Database, Lock, Sparkles, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { cn, getThemeColors } from '../../../../lib/utils';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { ExecutivePageTemplate } from '../../../../components/ui/executive-page-template';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveAccordion } from '../../../../components/ui/executive-accordion';
import { ExecutiveEmptyState } from '../../../../components/ui/executive-empty-state';
import { ExecutiveHeading } from '../../../../components/ui/executive-heading';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../../../../components/ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../../../../components/ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../../../../components/ui/executive-decision-trace';
import { usePreferencesPageViewModel } from '../../../../viewmodels/usePreferencesPageViewModel';

export function PreferencesPage() {
  // Adapter: usePreferencesPageAdapter
  // ViewModel: usePreferencesPageViewModel
  const { state: vmState, computed: vmComputed, actions: vmActions } = usePreferencesPageViewModel({ clientId: '' });
  const portal = createPortal;
  const { language, setLanguage, translateLabel: trans } = useLanguage();
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    return (localStorage.getItem('app-theme') as 'light' | 'dark' | 'system') || 'light';
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    updates: true,
    marketing: false
  });

  const colors = getThemeColors();

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
    localStorage.setItem('app-theme', 'light');
  }, []);

  return (
    <ExecutivePageTemplate header={{
      title: trans('common.preferences_title'),
      description: trans('common.preferences_subtitle'),
    }}>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">

        <div className="flex items-center gap-3">
          <StatusBadge status="Verde" label="Configurações Locais Sincronizadas" />
        </div>
      
      </div>

      <div className="mt-12 mb-8 border-t border-border pt-8" />
      <ExecutiveAccordion
        title="Configurações do Sistema"
        subtitle="Configure idioma, tema de interface e regras de notificação."
        variant="analytics"
        defaultExpanded
      >

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Appearance Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 px-6">
            <div className="w-12 h-12 rounded-2xl bg-surface-container border border-border flex items-center justify-center text-secondary">
              <Palette size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-display font-medium text-foreground tracking-tight">{trans('common.appearance')}</h3>
              <p className="text-body-sm text-executive-secondary font-medium">{trans('common.appearance_sub')}</p>
            </div>
          </div>

          <div className="bg-card p-12 rounded-[48px] border border-border shadow-sm relative overflow-hidden group space-y-10 h-full flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-all duration-1000">
              <Sparkles size={140} className="text-secondary" />
            </div>
            
            <div className="space-y-8 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">{trans('common.protocol_visual')}</label>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between gap-6 p-6 border border-secondary bg-secondary/5 text-foreground rounded-2xl">
                    <div className="flex items-center gap-4">
                      <Sun size={20} className="text-secondary" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Tema Institucional Claro (Padrão Canônico EVC)</span>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-secondary/15 flex items-center justify-center text-secondary">
                      <CheckCircle2 size={14} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">{trans('common.lang_location')}</label>
                <div className="flex items-center gap-4 px-5 py-4 bg-surface-container border border-border rounded-[20px] transition-all focus-within:border-secondary">
                  <Globe size={18} className="text-muted-foreground" />
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as any)}
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
                  <h4 className="text-sm font-semibold text-foreground">{trans('common.compact_mode')}</h4>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-1">{trans('common.compact_mode_sub')}</p>
                </div>
                <button className="w-12 h-6 bg-border rounded-full relative transition-all group/toggle overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-transparent translate-x-[-100%] group-hover/toggle:translate-x-0 transition-transform" />
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{trans('common.transitions')}</h4>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-1">{trans('common.transitions_sub')}</p>
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
              <h3 className="text-2xl font-display font-medium text-foreground tracking-tight">{trans('common.communication')}</h3>
       <p className="text-body-sm text-executive-secondary font-medium">{trans('common.communication_sub')}</p>
            </div>
          </div>

          <div className="bg-card p-12 rounded-[48px] border border-border shadow-sm relative overflow-hidden group space-y-10 h-full flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-all duration-1000">
              <Zap size={140} className="text-secondary" />
            </div>
            
            <div className="space-y-6 relative z-10">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">{trans('common.channels')}</label>
              <div className="space-y-4">
                {[
                  { id: 'email', label: trans('preferences.notifications.email.label'), desc: trans('preferences.notifications.email.desc') },
                  { id: 'push', label: trans('preferences.notifications.push.label'), desc: trans('preferences.notifications.push.desc') },
                  { id: 'updates', label: trans('preferences.notifications.updates.label'), desc: trans('preferences.notifications.updates.desc') },
                  { id: 'marketing', label: trans('preferences.notifications.marketing.label'), desc: trans('preferences.notifications.marketing.desc') },
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
                  <h4 className="text-sm font-semibold">{trans('common.agenda_focus')}</h4>
                  <p className="text-[11px] font-light text-primary-foreground/75 mt-2 mb-4 leading-relaxed">
                    {trans('common.agenda_focus_sub')}
                  </p>
                  <button className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary hover:text-white transition-colors">
                    {trans('common.configure_schedule')}
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
          { label: trans('preferences.system.storage.label'), val: trans('preferences.system.storage.val'), icon: Database, color: 'text-primary' },
          { label: trans('preferences.system.crypto.label'), val: trans('preferences.system.crypto.val'), icon: Lock, color: 'text-secondary' },
          { label: trans('preferences.system.engine.label'), val: trans('preferences.system.engine.val'), icon: CheckCircle2, color: 'text-tertiary' },
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
        <button className="px-4 md:px-6 md:px-12 py-2 md:py-3.5 md:py-5 bg-secondary text-primary rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group shadow-xl shadow-secondary/10">
          {trans('buttons.saveSettings')} <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
       <ExecutiveSummarySection 
         status={{ label: 'Preferências Salvas', variant: 'success' }}
         question="Como gerenciar as preferências do sistema e acessibilidade?"
         opinion="O comitê fiduciário homologa a persistência local das configurações de idioma e tema."
         driver="Idioma do sistema, tema visual (dark/light) e notificações."
         implication="Melhoria na ergonomia de uso e aderência às preferências do usuário."
         executiveQuestion="Salvar alterações de preferências a cada mudança de contexto."
       >
         <ExecutiveStrategicTensions tensions={[]} />
         <ExecutiveDecisionTrace trace={[]} />
       </ExecutiveSummarySection>
      </ExecutiveAccordion>
    </ExecutivePageTemplate>
  );
}
