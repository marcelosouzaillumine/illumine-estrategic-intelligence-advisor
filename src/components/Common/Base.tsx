import React from 'react';
import { LayoutGrid, Calendar, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { FULL_MONTH_LABELS } from '../../constants';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useLanguage } from '../../contexts/LanguageContext';

export function PageHeader({ 
  title, 
  subtitle, 
  icon: Icon, 
  actions,
  badge,
  color,
  transparent,
  className
}: { 
  title: string; 
  subtitle?: string; 
  icon?: any; 
  actions?: React.ReactNode;
  badge?: string;
  color?: string;
  transparent?: boolean;
  className?: string;
}) {
  const { translateLabel } = useLanguage();
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
    <div className={cn("mb-12", className)}>
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 xl:gap-8">
        <div className="space-y-2 flex-1 min-w-0 w-full">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-button bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0 shadow-sm">
              {renderIcon(22, "text-primary")}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 min-w-0">
              <h1 className="text-4xl md:text-[44px] font-semibold tracking-tight text-foreground leading-tight truncate">
                {translateLabel(title)}
              </h1>
              {badge && (
                <span className="inline-flex w-fit px-3 py-1 bg-surface-container border border-border rounded-full text-[10px] font-medium uppercase tracking-widest text-secondary shrink-0">
                  {translateLabel(badge)}
                </span>
              )}
            </div>
          </div>
          {subtitle && (
            <p className="text-[15px] font-normal text-foreground/72 ml-0 xl:ml-16 leading-relaxed max-w-3xl break-words">
              {translateLabel(subtitle)}
            </p>
          )}
        </div>
        
        {actions && (
          <div className="flex flex-wrap items-center gap-3 shrink-0 w-full xl:w-auto mt-4 xl:mt-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

export function Semaphore({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Verde: 'bg-success',
    Amarelo: 'bg-warning',
    Vermelho: 'bg-destructive',
    'Stable': 'bg-primary/50',
    'Bullish': 'bg-success',
    'Bearish': 'bg-destructive',
    'Correction': 'bg-warning'
  };
  
  return <div className={cn("w-2 h-2 rounded-full shadow-sm", colors[status] || 'bg-muted')} />;
}

export function StatusBadge({ status, label, className }: { status: string; label?: string; className?: string }) {
  const { t, translateLabel } = useLanguage();

  const classMap: Record<string, string> = {
    'Verde': 'text-success border-success/20 bg-success-soft font-semibold',
    'Amarelo': 'text-warning border-warning/20 bg-warning-soft font-semibold',
    'Vermelho': 'text-critical border-critical/20 bg-critical-soft font-semibold',
    'Azul': 'text-primary border-primary/40 bg-primary/15',
    'Pendente': 'text-warning border-warning/20 bg-warning-soft shadow-sm font-semibold',
    'Ativo': 'text-success border-success/20 bg-success-soft font-semibold',
    'Inativo': 'text-critical border-critical/20 bg-critical-soft font-semibold',
    'Em Implantação': 'text-warning border-warning/20 bg-warning-soft font-semibold',
    'UNAVAILABLE': 'text-foreground/60 border-border bg-surface-container font-semibold',
    'SANDBOX': 'text-blue-500 border-blue-500/20 bg-blue-50 font-semibold',
    'HEALTHY': 'text-success border-success/20 bg-success-soft font-semibold',
    'WARNING': 'text-warning border-warning/20 bg-warning-soft font-semibold',
    'CRITICAL': 'text-critical border-critical/20 bg-critical-soft font-semibold',
  };

  const getDisplayLabel = () => {
    if (label) return label;
    if (status === 'UNAVAILABLE') return t('common.unavailable', 'Indisponível');
    if (status === 'SANDBOX') return 'SANDBOX';
    if (status === 'HEALTHY') return translateLabel ? translateLabel('Saudável') : 'SAUDÁVEL';
    if (status === 'WARNING') return translateLabel ? translateLabel('Atenção') : 'ATENÇÃO';
    if (status === 'CRITICAL') return translateLabel ? translateLabel('Crítico') : 'CRÍTICO';
    return status;
  };
  
  return (
    <span className={cn(
      "px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest border transition-all whitespace-normal break-words text-balance text-center inline-block shadow-sm",
      classMap[status] || 'text-secondary border-border bg-surface-container',
      className
    )}>
      {getDisplayLabel()}
    </span>
  );
}

export function SectionHeader({ title, subtitle, icon: Icon, tone = 'blue' }: any) {
    const { translateLabel } = useLanguage();
    const tones: Record<string, string> = {
        blue: 'text-primary border-primary',
        slate: 'text-text-main border-text-main',
        amber: 'text-amber-600 border-amber-600',
        emerald: 'text-emerald-600 border-emerald-600',
    };

    return (
        <div className="flex flex-col gap-8 mb-20">
            <div className="flex items-center gap-6">
              <div className={cn("w-16 h-16 flex items-center justify-center border group transition-all rounded-button", tones[tone] || tones.blue)}>
                  <Icon size={24} strokeWidth={1} className="transition-colors" />
              </div>
              <div className={cn("h-[1px] flex-1 opacity-20", tone === 'slate' ? 'bg-foreground' : 'bg-primary')} />
            </div>
            <div>
                <p className="text-body-sm font-medium text-accent uppercase tracking-widest mb-4">{translateLabel(subtitle)}</p>
                <h3 className="text-h3 font-display text-foreground leading-tight">{translateLabel(title)}</h3>
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
            <strong key={index} className="font-semibold text-secondary">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}

export interface ControlBarProps {
  // Calendar selectors
  selectedYear?: number;
  setSelectedYear?: (year: number) => void;
  selectedMonth?: number;
  setSelectedMonth?: (month: number) => void;
  years?: number[];

  // Period mode (Mensal / Anual) — optional controlled mode
  periodMode?: 'mensal' | 'anual';
  setPeriodMode?: (mode: 'mensal' | 'anual') => void;

  // Custom Tabs (like in LoansPage)
  tabs?: { id: string; label: string }[];
  activeTab?: string;
  setActiveTab?: (tabId: any) => void;
  
  // Status Badge / Side element
  showStatusBadge?: boolean;
  statusBadgeLabel?: string;
  statusBadgeIcon?: any; // defaults to ShieldCheck
  statusBadgeColor?: 'success' | 'warning' | 'destructive' | 'info' | 'primary';
  
  // Custom Actions / Children
  actions?: React.ReactNode;
  children?: React.ReactNode;
  /** @deprecated Use periodMode/setPeriodMode instead. Kept for compatibility. */
  periodToggle?: React.ReactNode;
  hideMonth?: boolean;
  
  className?: string;
}

const DEFAULT_YEARS = (() => {
  const cur = new Date().getFullYear();
  return Array.from({ length: 11 }, (_, i) => cur - 5 + i);
})();

export function ControlBar({
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  years = DEFAULT_YEARS,
  periodMode: periodModeProp,
  setPeriodMode: setPeriodModeProp,
  tabs,
  activeTab,
  setActiveTab,
  showStatusBadge = false,
  statusBadgeLabel = 'Monitoramento Ativo',
  statusBadgeIcon: StatusIcon = ShieldCheck,
  statusBadgeColor = 'success',
  actions,
  children,
  className,
  periodToggle,
  hideMonth = false
}: ControlBarProps) {
  const { translateLabel } = useLanguage();
  const [internalPeriodMode, setInternalPeriodMode] = React.useState<'mensal' | 'anual'>('mensal');
  const isControlled = periodModeProp !== undefined && setPeriodModeProp !== undefined;
  const periodMode = isControlled ? periodModeProp : internalPeriodMode;
  const setPeriodMode = isControlled ? setPeriodModeProp : setInternalPeriodMode;

  // When period mode is anual, month is hidden
  const effectiveHideMonth = hideMonth || periodMode === 'anual';

  const showSelectors = selectedYear !== undefined && setSelectedYear !== undefined && selectedMonth !== undefined && setSelectedMonth !== undefined;
  
  const badgeColors = {
    success: 'bg-success-soft text-success border-success/20',
    warning: 'bg-warning-soft text-warning border-warning/20',
    destructive: 'bg-critical-soft text-destructive border-destructive/20',
    info: 'bg-info/10 text-info border-info/20',
    primary: 'bg-primary/10 text-primary border-primary/20',
  };

  return (
    <div className={cn(
      "flex items-center justify-between gap-4 flex-wrap bg-surface-container/60 p-4 rounded-md border border-border/60 backdrop-blur-sm shadow-sm -mt-6 mb-10",
      className
    )}>
      <div className="flex items-center gap-3">
        {/* Legacy periodToggle slot — rendered only if no built-in selectors */}
        {periodToggle && !showSelectors && periodToggle}

        {/* Date Selectors */}
        {showSelectors && (
          <div className="flex items-center bg-background border border-border rounded-button p-1 shadow-sm">
            {/* Mensal / Anual Toggle */}
            <div className="flex items-center border-r border-border pr-1 mr-1">
              <button
                onClick={() => setPeriodMode('mensal')}
                className={cn(
                  "px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
                  periodMode === 'mensal'
                    ? "bg-surface-container text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-secondary"
                )}
              >
                {translateLabel('Mensal')}
              </button>
              <button
                onClick={() => setPeriodMode('anual')}
                className={cn(
                  "px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
                  periodMode === 'anual'
                    ? "bg-surface-container text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-secondary"
                )}
              >
                {translateLabel('Anual')}
              </button>
            </div>

            {/* Year Selector */}
            <div className={cn("flex items-center px-4 py-2", !effectiveHideMonth && "border-r border-border")}>
              <Calendar size={14} className="text-secondary mr-2.5" />
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear!(Number(e.target.value))}
                className="text-body-sm font-medium uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
              >
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Month Selector — hidden in Anual mode */}
            {!effectiveHideMonth && (
              <div className="flex items-center px-4 py-2">
                <select 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth!(Number(e.target.value))}
                  className="text-body-sm font-medium uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
                >
                  {Object.entries(FULL_MONTH_LABELS).map(([m, label]) => (
                    <option key={m} value={Number(m)}>{label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Legacy periodToggle when selectors are present */}
        {periodToggle && showSelectors && periodToggle}

        {/* Navigation Tabs */}
        {tabs && activeTab && setActiveTab && (
          <div className="bg-background p-1 rounded-button flex gap-1 border border-border overflow-x-auto max-w-md shadow-sm">
            {tabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-2 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest whitespace-nowrap cursor-pointer",
                  activeTab === tab.id 
                    ? "bg-surface-container text-foreground shadow-sm font-bold border border-border/40" 
                    : "text-muted-foreground hover:text-secondary"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
        
        {children}
      </div>

      <div className="flex items-center gap-4">
        {actions && (
          <div className="flex items-center gap-3 animate-fade-in">
            {actions}
          </div>
        )}
        
        {showStatusBadge && (
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full border shadow-xs transition-all duration-300",
            badgeColors[statusBadgeColor]
          )}>
            <StatusIcon size={14} className="animate-pulse" />
            <span className="text-body-sm font-medium uppercase tracking-widest">{translateLabel(statusBadgeLabel)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Polyfills for legacy cards to fix typecheck
export function KpiCard({ 
  title, 
  label,
  value, 
  suffix, 
  icon: Icon, 
  status, 
  trend, 
  tone = 'default',
  helper,
  description,
  className,
  ...props 
}: any) {
  const { translateLabel } = useLanguage();
  const displayTitle = title || label;
  const displayDescription = helper || description;

  const toneClasses: Record<string, string> = {
    default: 'border-border bg-card text-foreground',
    success: 'border-emerald-200/80 bg-emerald-500/5 text-emerald-950 dark:text-emerald-100',
    danger: 'border-rose-200/80 bg-rose-500/5 text-rose-950 dark:text-rose-100',
    warning: 'border-amber-200/80 bg-amber-500/5 text-amber-950 dark:text-amber-100',
    info: 'border-blue-200/80 bg-blue-500/5 text-blue-950 dark:text-blue-100',
  };

  return (
    <div className={cn(
      "p-6 rounded-[24px] border shadow-sm flex flex-col justify-between transition-all hover:shadow-md bg-card",
      toneClasses[tone] || toneClasses.default,
      className
    )} {...props}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {Icon && (
            <div className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center border border-border shrink-0">
              {React.isValidElement(Icon) ? Icon : <Icon size={16} className="text-secondary" />}
            </div>
          )}
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
            {typeof displayTitle === 'string' ? translateLabel(displayTitle) : displayTitle}
          </span>
        </div>
        {status && <StatusBadge status={status} />}
      </div>

      <div className="flex items-baseline justify-between gap-2 mt-1">
        <div className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-display">
          {value}{suffix && <span className="text-sm font-normal text-muted-foreground ml-1">{suffix}</span>}
        </div>
        {trend && (
          <span className={cn(
            "inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border shrink-0",
            trend === 'up' || (typeof trend === 'object' && trend.direction === 'up') ? "text-emerald-600 bg-emerald-500/10 border-emerald-200/50" :
            trend === 'down' || (typeof trend === 'object' && trend.direction === 'down') ? "text-rose-600 bg-rose-500/10 border-rose-200/50" :
            "text-slate-600 bg-slate-500/10 border-slate-200/50"
          )}>
            {typeof trend === 'string' ? trend : trend.value || trend.direction}
          </span>
        )}
      </div>

      {displayDescription && (
        <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border/50 line-clamp-2">
          {typeof displayDescription === 'string' ? translateLabel(displayDescription) : displayDescription}
        </p>
      )}
    </div>
  );
}

export function KpiValue({ value, suffix, ...props }: any) {
  return <div className="text-2xl font-bold font-display" {...props}>{value}{suffix && <span className="text-sm font-normal text-muted-foreground ml-1">{suffix}</span>}</div>;
}
