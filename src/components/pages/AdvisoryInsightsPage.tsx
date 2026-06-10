import React, { useState } from 'react';
import { 
  Activity, 
  Zap, 
  Target,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  Presentation,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageHeader } from '../Common';
import { cn } from '../../lib/utils';
import { useExecutiveAdvisory } from '../../hooks/useExecutiveAdvisory';
import { useLanguage } from '../../contexts/LanguageContext';

function SectionHeader({ icon: Icon, title, subtitle, tone }: any) {
  const tones: any = {
    emerald: "bg-success-soft text-emerald-600 border-emerald-100",
    rose: "bg-critical-soft text-rose-600 border-rose-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    slate: "bg-slate-50 text-muted-foreground border-border",
  };
  
  return (
    <div className="flex items-center gap-5">
      <div className={cn("p-4 rounded-md border", tones[tone])}>
        <Icon size={24} strokeWidth={2.5} />
      </div>
      <div>
        <h3 className="text-h3 font-medium text-foreground tracking-tight leading-none mb-1">{title}</h3>
        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{subtitle}</p>
      </div>
    </div>
  );
}

export function AdvisoryInsightsPage({ clients, selectedClient, selectedYear, selectedMonth }: any) {
  const month = selectedMonth || 3;
  const year = selectedYear || 2026;
  const client = clients.find((c: any) => c.id === selectedClient);

  const { advisoryReport, loading } = useExecutiveAdvisory(selectedClient, year, month, client);
  const { translateLabel: t } = useLanguage();

  return (
    <div className="space-y-12 pb-32 animate-executive-fade">
      <PageHeader 
        title={t("advisory.title")}
        subtitle={t("advisory.subtitle")}
        icon={Presentation}
        color="executive"
      />

      <div className="mb-10 -mt-6"></div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-full border-4 border-secondary/20 border-t-secondary animate-spin" />
          <p className="text-[10px] font-medium uppercase tracking-widest mt-6 text-muted-foreground animate-pulse">{t("advisory.loading_synthesis")}</p>
        </div>
      ) : advisoryReport ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-10">
            <div className="flex items-center justify-between">
              <SectionHeader 
                icon={Activity} 
                title={t("advisory.structural_diagnosis_title")} 
                subtitle={t("advisory.structural_diagnosis_subtitle")} 
                tone="blue"
              />
              <div className="flex bg-surface-container p-1 rounded-md border border-border">
                 <span className="px-4 py-1.5 text-[9px] font-medium text-muted-foreground uppercase tracking-widest">{t("advisory.real_time_audit")}</span>
              </div>
            </div>
            
            <div className="card-premium p-8 space-y-8">
              <div className="space-y-4">
                <h4 className="text-[10px] font-medium text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                  <BookOpen size={14} /> {t("advisory.executive_summary")}
                </h4>
                <p className="text-body-lg text-foreground font-medium italic">"{advisoryReport.executiveSummary}"</p>
              </div>

              <div className="space-y-4 border-t border-border pt-6">
                <h4 className="text-[10px] font-medium text-secondary uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Activity size={14} /> {t("advisory.institutional_diagnosis")}
                </h4>
                <p className="text-body text-muted-foreground leading-relaxed">{advisoryReport.institutionalDiagnosis}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-border pt-6">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-medium text-destructive uppercase tracking-widest flex items-center gap-2">
                    <AlertTriangle size={14} /> {t("advisory.dominant_risks")}
                  </h4>
                  <ul className="space-y-2">
                    {advisoryReport.dominantRisks.map((risk, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                        <span className="text-destructive mt-1">•</span> {risk}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-medium text-success uppercase tracking-widest flex items-center gap-2">
                    <Target size={14} /> {t("advisory.strategic_priorities")}
                  </h4>
                  <ul className="space-y-2">
                    {advisoryReport.strategicPriorities.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                        <span className="text-success mt-1">•</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <SectionHeader 
                icon={Zap} 
                title={t("advisory.action_matrix_title")} 
                subtitle={t("advisory.action_matrix_subtitle")} 
                tone="emerald"
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <AnimatePresence mode="popLayout">
                {advisoryReport.actionMatrix.map((action, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="card-premium p-6 border-l-4 border-l-secondary flex flex-col md:flex-row gap-6 items-center justify-between"
                  >
                    <div>
                      <h4 className="text-h5 font-medium text-foreground">{action.acao}</h4>
                      <div className="flex gap-4 mt-2">
                        <span className="text-[10px] font-medium uppercase text-muted-foreground tracking-widest">{t("advisory.impact")}: {action.impacto}</span>
                        <span className="text-[10px] font-medium uppercase text-muted-foreground tracking-widest">{t("advisory.time")}: {action.velocidade}</span>
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-secondary/10 text-secondary rounded-full text-xs font-medium uppercase tracking-widest text-center whitespace-nowrap">
                      {action.prioridade}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Intelligence Sidebar */}
          <div className="space-y-8">
            <div className="bg-executive p-8 rounded-md text-white shadow-premium flex flex-col gap-6 relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="flex items-center justify-between relative z-10">
                <span className="text-[10px] font-medium uppercase tracking-widest text-secondary">{t("advisory.confidence_level")}</span>
                <ShieldCheck size={18} className="text-secondary" />
              </div>

              <div className="flex items-end gap-3 relative z-10">
                <h2 className="text-5xl font-medium tracking-tighter leading-none">
                  {advisoryReport.confidenceLevel}
                </h2>
              </div>

              <div className="space-y-3 relative z-10">
                <p className="text-[10px] font-medium text-white/60 uppercase tracking-widest flex justify-between">
                  <span>{t("advisory.recommended_posture")}</span>
                </p>
                <div className="p-3 bg-white/10 rounded-md border border-white/20">
                  <p className="text-sm font-medium text-white">{advisoryReport.executivePosture}</p>
                </div>
              </div>
            </div>

            <div className="card-premium p-6 space-y-4">
              <h4 className="text-[10px] font-medium text-warning uppercase tracking-widest mb-2">
                 {t("advisory.board_decision")}
              </h4>
              <p className="text-body-sm text-foreground font-medium italic border-l-2 border-warning pl-3">{advisoryReport.recommendedBoardDecision}</p>
            </div>

            {advisoryReport.blockedFalsePositives.length > 0 && (
              <div className="bg-critical-soft border border-destructive/20 p-6 rounded-md space-y-4">
                <h4 className="text-[10px] font-medium text-destructive uppercase tracking-widest flex items-center gap-2">
                  <AlertTriangle size={14} /> {t("advisory.causal_moderation_title")}
                </h4>
                <ul className="space-y-2">
                  {advisoryReport.blockedFalsePositives.map((fp, i) => (
                    <li key={i} className="text-xs text-destructive font-medium leading-relaxed">• {fp}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {advisoryReport.narrativeModeration.length > 0 && (
              <div className="bg-primary/5 border border-primary/10 p-6 rounded-md space-y-4">
                <h4 className="text-[10px] font-medium text-primary uppercase tracking-widest">
                  {t("advisory.moderation_context_title")}
                </h4>
                <ul className="space-y-2">
                  {advisoryReport.narrativeModeration.map((nm, i) => (
                    <li key={i} className="text-xs text-muted-foreground font-medium leading-relaxed">• {nm}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="card-premium bg-surface-container p-20 text-center">
          <Sparkles size={64} className="mx-auto mb-6 text-muted-foreground/20" />
          <h4 className="text-h4 font-medium text-foreground mb-2 tracking-tight">{t("advisory.waiting_data_title")}</h4>
          <p className="text-muted-foreground font-medium">{t("advisory.waiting_data_subtitle")}</p>
        </div>
      )}
    </div>
  );
}
