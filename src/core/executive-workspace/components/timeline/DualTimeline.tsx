import React, { useState } from 'react';
import { ExecutiveText } from '@/components/ui/executive-typography';
import { cn } from '@/lib/utils';
import { Clock, Code, Briefcase } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface TimelineEvent {
  id: string;
  type: 'BUSINESS' | 'TECHNICAL';
  titleKey: string;
  timestamp: string;
  descriptionKey?: string;
  metadata?: any;
}

export interface DualTimelineProps {
  events: TimelineEvent[];
}

export function DualTimeline({ events }: DualTimelineProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'BUSINESS' | 'TECHNICAL'>('BUSINESS');

  const filteredEvents = events.filter(e => e.type === activeTab);

  return (
    <div className="flex flex-col h-full bg-card rounded-2xl border border-border overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-border shrink-0">
        <button 
          onClick={() => setActiveTab('BUSINESS')}
          className={cn(
            "flex-1 py-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors",
            activeTab === 'BUSINESS' ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:bg-muted/50"
          )}
        >
          <Briefcase size={14} />
          {t('common.business', 'Business')}
        </button>
        <button 
          onClick={() => setActiveTab('TECHNICAL')}
          className={cn(
            "flex-1 py-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors",
            activeTab === 'TECHNICAL' ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:bg-muted/50"
          )}
        >
          <Code size={14} />
          {t('common.technical', 'Technical')}
        </button>
      </div>

      {/* Feed */}
      <div className="flex-1 p-4 overflow-y-auto">
        {filteredEvents.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <ExecutiveText variant="caption">{t('common.noEvents', 'No events recorded')}</ExecutiveText>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredEvents.map(event => (
              <div key={event.id} className="relative pl-6">
                <div className="absolute left-1.5 top-1.5 w-2 h-2 rounded-full bg-primary ring-4 ring-background" />
                <div className="absolute left-2 top-3 bottom-[-24px] w-0.5 bg-border last:hidden" />
                
                <div className="flex flex-col">
                  <ExecutiveText variant="label" className="text-sm font-semibold">{t(event.titleKey)}</ExecutiveText>
                  <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                    <Clock size={12} />
                    <ExecutiveText variant="caption" className="text-[10px] uppercase">
                      {new Date(event.timestamp).toLocaleString()}
                    </ExecutiveText>
                  </div>
                  {event.descriptionKey && (
                    <ExecutiveText variant="bodyStandard" className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      {t(event.descriptionKey)}
                    </ExecutiveText>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
