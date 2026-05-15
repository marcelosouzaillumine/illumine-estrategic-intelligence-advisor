import React from 'react';
import { LayoutGrid } from 'lucide-react';
import { cn } from '../lib/utils';

export function PageHeader({ 
  title, 
  subtitle, 
  icon: Icon, 
  color = 'bg-slate-900',
  actions
}: { 
  title: string; 
  subtitle: string; 
  icon?: any; 
  color?: string;
  actions?: React.ReactNode;
}) {
  const renderIcon = (size: number, className?: string) => {
    if (!Icon) return <LayoutGrid size={size} className={className} />;
    if (React.isValidElement(Icon)) {
      return React.cloneElement(Icon as React.ReactElement<any>, { 
        size, 
        className: cn(className, (Icon.props as any).className) 
      });
    }
    const IconComponent = Icon;
    return <IconComponent size={size} className={className} />;
  };

  return (
    <div className={cn("relative overflow-hidden p-8 rounded-[32px] text-white shadow-2xl mb-12", color)}>
      {/* Background Glow Effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center backdrop-blur-md border border-white/10 shrink-0">
              {renderIcon(20, "text-secondary")}
            </div>
            <h1 className="text-3xl font-display font-black tracking-tight leading-none whitespace-nowrap">{title}</h1>
          </div>
          {subtitle && (
            <p className="text-slate-400 text-sm font-medium ml-[52px] whitespace-nowrap truncate">
              {subtitle}
            </p>
          )}
        </div>
        
        {actions && (
          <div className="flex items-center gap-3 relative z-10 whitespace-nowrap shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

export function Semaphore({ status }: { status: 'Verde' | 'Amarelo' | 'Vermelho' }) {
  const colors = {
    Verde: 'bg-emerald-500',
    Amarelo: 'bg-amber-500',
    Vermelho: 'bg-rose-500'
  };
  
  return <div className={cn("w-2 h-2 rounded-full", colors[status])} />;
}

export function StatusBadge({ status, label }: { status: string; label?: string }) {
  const classMap: Record<string, string> = {
    'Verde': 'text-emerald-600 border-emerald-200 bg-emerald-50/30',
    'Amarelo': 'text-amber-600 border-amber-200 bg-amber-50/30',
    'Vermelho': 'text-rose-600 border-rose-200 bg-rose-50/30',
    'Azul': 'text-indigo-600 border-indigo-200 bg-indigo-50/30',
  };
  
  return (
    <span className={cn(
      "px-5 py-1.5 rounded-none text-[10px] font-medium uppercase tracking-[0.3em] border transition-all italic",
      classMap[status] || 'text-text-dim border-border-main bg-bg-surface/30'
    )}>
      {label || status}
    </span>
  );
}

export function SectionHeader({ title, subtitle, icon: Icon, tone = 'blue' }: any) {
    const tones: Record<string, string> = {
        blue: 'text-primary border-primary',
        slate: 'text-text-main border-text-main',
        amber: 'text-amber-600 border-amber-600',
        emerald: 'text-emerald-600 border-emerald-600',
    };

    return (
        <div className="flex flex-col gap-8 mb-20">
            <div className="flex items-center gap-6">
              <div className={cn("w-16 h-16 flex items-center justify-center border group transition-all", tones[tone] || tones.blue)}>
                  <Icon size={24} strokeWidth={1} className="transition-colors" />
              </div>
              <div className={cn("h-[1px] flex-1 opacity-20", tone === 'slate' ? 'bg-text-main' : 'bg-primary')} />
            </div>
            <div>
                <p className="text-[11px] font-medium text-accent uppercase tracking-[0.5em] mb-4">{subtitle}</p>
                <h3 className="text-4xl md:text-5xl font-display text-text-main leading-tight">{title}</h3>
            </div>
        </div>
    );
}

export function MarkdownText({ text, className }: { text?: string; className?: string }) {
  if (!text) return null;
  
  // Split by bold pattern **text**
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={index} className="font-black text-secondary">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}
