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
            <div className="w-12 h-12 rounded-button bg-surface-container flex items-center justify-center border border-border shrink-0 shadow-sm">
              {renderIcon(22, "text-secondary")}
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
  const classMap: Record<string, string> = {
    'Verde': 'text-success border-success/20 bg-success-soft font-semibold',
    'Amarelo': 'text-warning border-warning/20 bg-warning-soft font-semibold',
    'Vermelho': 'text-critical border-critical/20 bg-critical-soft font-semibold',
    'Azul': 'text-primary border-primary/40 bg-primary/15',
    'Pendente': 'text-warning border-warning/20 bg-warning-soft shadow-sm font-semibold',
    'Ativo': 'text-success border-success/20 bg-success-soft font-semibold',
    'Inativo': 'text-critical border-critical/20 bg-critical-soft font-semibold',
    'Em Implantação': 'text-warning border-warning/20 bg-warning-soft font-semibold',
  };
  
  return (
    <span className={cn(
      "px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest border transition-all whitespace-normal break-words text-balance text-center inline-block shadow-sm",
      classMap[status] || 'text-secondary border-border bg-surface-container',
      className
    )}>
      {label || status}
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

export function KpiValue({ 
  value, 
  suffix = '', 
  className,
  noScroll = false
}: { 
  value: string | number; 
  suffix?: string; 
  className?: string;
  noScroll?: boolean;
}) {
  const cleanSuffix = suffix.replace(/\s+/g, '\u00A0');
  const isCurrency = ['R$', 'BRL', 'USD', 'EUR', 'GBP', '$'].includes(cleanSuffix.trim());
  const valStr = isCurrency ? `${cleanSuffix.trim()}\u00A0${value}` : `${value}${cleanSuffix}`;
  
  // Differentiate between number-like text and long descriptive/narrative texts
  const isNumberLike = typeof value === 'number' || (typeof value === 'string' && /\d/.test(value));
  const isLongText = !isNumberLike && typeof value === 'string' && value.length > 15;

  // For numbers or standard labels, we compute a dynamic clamp based on character length 
  // so the text scales down fluidly relative to container width (using cqw) and never overflows/wraps.
  const charCount = Math.max(valStr.length, 5);
  const dynamicCqw = Math.min(10, 140 / charCount);
  const minRem = Math.max(0.6, Math.min(0.9, 10 / charCount));
  const maxRem = Math.max(1.2, Math.min(2.5, 25 / charCount));
  const dynamicFontSize = `clamp(${minRem}rem, ${dynamicCqw}cqw, ${maxRem}rem)`;

  return (
    <div className="w-full [container-type:inline-size] py-1 overflow-hidden">
      <div 
        className={cn(
          "font-display max-w-full overflow-hidden text-ellipsis",
          isLongText 
            ? "whitespace-normal break-words text-balance leading-tight text-[clamp(0.75rem,5cqw,1.25rem)]" 
            : "whitespace-nowrap tabular-nums leading-[1.15] min-w-0",
          className
        )}
        style={!isLongText ? { fontSize: dynamicFontSize } : undefined}
      >
        {valStr}
      </div>
    </div>
  );
}

export function KpiCard({ 
  title, 
  value, 
  suffix, 
  icon: Icon, 
  status = 'Verde', 
  trend,
  className,
  highlight = false,
  onClick,
  noScroll = false,
  tooltip
}: {
  title: string;
  value: string | number;
  suffix?: string;
  icon?: any;
  status?: string;
  trend?: string;
  className?: string;
  highlight?: boolean;
  onClick?: () => void;
  noScroll?: boolean;
  tooltip?: string;
}) {
  const statusConfig: Record<string, { bg: string; text: string; border: string; glow: string; label: string }> = {
    'Verde': { bg: 'bg-success/5', text: 'text-success', border: 'border-success/20', glow: 'shadow-[0_0_12px_rgba(16,185,129,0.08)]', label: 'Saudável' },
    'Stable': { bg: 'bg-success/5', text: 'text-success', border: 'border-success/20', glow: 'shadow-[0_0_12px_rgba(16,185,129,0.08)]', label: 'Saudável' },
    'Estável': { bg: 'bg-success/5', text: 'text-success', border: 'border-success/20', glow: 'shadow-[0_0_12px_rgba(16,185,129,0.08)]', label: 'Saudável' },
    'Em Alta': { bg: 'bg-success/5', text: 'text-success', border: 'border-success/20', glow: 'shadow-[0_0_12px_rgba(16,185,129,0.08)]', label: 'Em Alta' },
    'Amarelo': { bg: 'bg-warning/5', text: 'text-warning', border: 'border-warning/20', glow: 'shadow-[0_0_12px_rgba(245,158,11,0.08)]', label: 'Atenção' },
    'Correction': { bg: 'bg-warning/5', text: 'text-warning', border: 'border-warning/20', glow: 'shadow-[0_0_12px_rgba(245,158,11,0.08)]', label: 'Atenção' },
    'Atenção': { bg: 'bg-warning/5', text: 'text-warning', border: 'border-warning/20', glow: 'shadow-[0_0_12px_rgba(245,158,11,0.08)]', label: 'Atenção' },
    'Vermelho': { bg: 'bg-destructive/5', text: 'text-destructive', border: 'border-destructive/20', glow: 'shadow-[0_0_12px_rgba(239,68,68,0.08)]', label: 'Crítico' },
    'Bearish': { bg: 'bg-destructive/5', text: 'text-destructive', border: 'border-destructive/20', glow: 'shadow-[0_0_12px_rgba(239,68,68,0.08)]', label: 'Crítico' },
    'Em Queda': { bg: 'bg-destructive/5', text: 'text-destructive', border: 'border-destructive/20', glow: 'shadow-[0_0_12px_rgba(239,68,68,0.08)]', label: 'Em Queda' },
    'Pendente': { bg: 'bg-surface-container', text: 'text-muted-foreground', border: 'border-border', glow: '', label: 'Pendente' },
    'N/A': { bg: 'bg-surface-container', text: 'text-muted-foreground', border: 'border-border', glow: '', label: 'N/A' },
  };

  const { translateLabel } = useLanguage();

  // Trend-specific color config — each evolution state has its own highlight color
  const trendConfig: Record<string, { bg: string; text: string; border: string; glow: string; dot: string }> = {
    // 🟢 Positive / Growth
    'Em Alta':    { bg: 'bg-success-soft0/10', text: 'text-emerald-500', border: 'border-emerald-500/25', glow: 'shadow-[0_0_14px_rgba(16,185,129,0.12)]', dot: 'bg-success-soft0' },
    'Bullish':    { bg: 'bg-success-soft0/10', text: 'text-emerald-500', border: 'border-emerald-500/25', glow: 'shadow-[0_0_14px_rgba(16,185,129,0.12)]', dot: 'bg-success-soft0' },
    'Saudável':   { bg: 'bg-success-soft0/10', text: 'text-emerald-500', border: 'border-emerald-500/25', glow: 'shadow-[0_0_14px_rgba(16,185,129,0.12)]', dot: 'bg-success-soft0' },
    'Verde':      { bg: 'bg-success-soft0/10', text: 'text-emerald-500', border: 'border-emerald-500/25', glow: 'shadow-[0_0_14px_rgba(16,185,129,0.12)]', dot: 'bg-success-soft0' },
    'Stable':     { bg: 'bg-success-soft0/10', text: 'text-emerald-500', border: 'border-emerald-500/25', glow: 'shadow-[0_0_14px_rgba(16,185,129,0.12)]', dot: 'bg-success-soft0' },
    // 🔴 Negative / Decline
    'Em Queda':   { bg: 'bg-critical-soft0/10', text: 'text-rose-500', border: 'border-rose-500/25', glow: 'shadow-[0_0_14px_rgba(239,68,68,0.12)]', dot: 'bg-critical-soft0' },
    'Bearish':    { bg: 'bg-critical-soft0/10', text: 'text-rose-500', border: 'border-rose-500/25', glow: 'shadow-[0_0_14px_rgba(239,68,68,0.12)]', dot: 'bg-critical-soft0' },
    'Crítico':    { bg: 'bg-critical-soft0/10', text: 'text-rose-500', border: 'border-rose-500/25', glow: 'shadow-[0_0_14px_rgba(239,68,68,0.12)]', dot: 'bg-critical-soft0' },
    'Vermelho':   { bg: 'bg-critical-soft0/10', text: 'text-rose-500', border: 'border-rose-500/25', glow: 'shadow-[0_0_14px_rgba(239,68,68,0.12)]', dot: 'bg-critical-soft0' },
    // 🟡 Neutral / Caution
    'Estável':    { bg: 'bg-warning-soft0/10', text: 'text-amber-500', border: 'border-amber-500/25', glow: 'shadow-[0_0_14px_rgba(245,158,11,0.10)]', dot: 'bg-warning-soft0' },
    'Correction': { bg: 'bg-warning-soft0/10', text: 'text-amber-500', border: 'border-amber-500/25', glow: 'shadow-[0_0_14px_rgba(245,158,11,0.10)]', dot: 'bg-warning-soft0' },
    'Atenção':    { bg: 'bg-warning-soft0/10', text: 'text-amber-500', border: 'border-amber-500/25', glow: 'shadow-[0_0_14px_rgba(245,158,11,0.10)]', dot: 'bg-warning-soft0' },
    'Amarelo':    { bg: 'bg-warning-soft0/10', text: 'text-amber-500', border: 'border-amber-500/25', glow: 'shadow-[0_0_14px_rgba(245,158,11,0.10)]', dot: 'bg-warning-soft0' },
    // 🔵 Informational
    'Real':       { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/25', glow: 'shadow-[0_0_14px_rgba(59,130,246,0.10)]', dot: 'bg-blue-500' },
    'Calculado':  { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/25', glow: 'shadow-[0_0_14px_rgba(59,130,246,0.10)]', dot: 'bg-blue-500' },
    'Mensal':     { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/25', glow: 'shadow-[0_0_14px_rgba(59,130,246,0.10)]', dot: 'bg-blue-500' },
    'Consolidado':{ bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/25', glow: 'shadow-[0_0_14px_rgba(59,130,246,0.10)]', dot: 'bg-blue-500' },
    // ⚪ Neutral / Unknown
    'Pendente':   { bg: 'bg-surface-container', text: 'text-muted-foreground', border: 'border-border', glow: '', dot: 'bg-muted-foreground' },
    'N/A':        { bg: 'bg-surface-container', text: 'text-muted-foreground', border: 'border-border', glow: '', dot: 'bg-muted-foreground' },
  };

  let finalStatus = status;
  let finalTrend = trend;

  const isNoData = value === undefined || value === null || value === '' || value === '---' || value === '--' || value === 0 || value === '0' || value === '0,00' || value === '0.00' || value === 'R$ 0,00' || value === 'R$ 0' || value === '0%';

  if (isNoData) {
    const targetWords = ['Saudável', 'Crítico', 'Em Queda', 'Em Alta', 'Stable', 'Bearish', 'Estável', 'Verde', 'Vermelho', 'Bullish', 'Amarelo', 'Atenção', 'Correction'];
    if (finalTrend && targetWords.includes(finalTrend)) {
      finalTrend = 'Pendente';
    }
    const currentLabel = statusConfig[status]?.label;
    if (currentLabel && targetWords.includes(currentLabel)) {
      finalStatus = 'Pendente';
    }
    if (targetWords.includes(status)) {
      finalStatus = 'Pendente';
    }
  }

  const cfg = statusConfig[finalStatus] || statusConfig['Verde'];

  const getStatusDotClass = (status: string) => {
    if (status === 'Vermelho' || status === 'Bearish' || status === 'Em Queda') return 'bg-critical-soft0';
    if (status === 'Amarelo' || status === 'Correction' || status === 'Atenção') return 'bg-warning-soft0';
    if (status === 'Pendente' || status === 'N/A') return 'bg-muted-foreground';
    return 'bg-success-soft0';
  };

  // When a trend is provided, use its specific color; otherwise fall back to status color
  const badgeCfg = finalTrend && trendConfig[finalTrend]
    ? trendConfig[finalTrend]
    : { bg: cfg.bg, text: cfg.text, border: cfg.border, glow: cfg.glow, dot: getStatusDotClass(finalStatus) };

  const content = (
    <motion.div 
      whileHover={{ y: -6, scale: 1.015, boxShadow: '0 20px 25px -5px rgba(14, 28, 44, 0.06), 0 10px 10px -5px rgba(14, 28, 44, 0.02)' }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={cn(
        /* overflow-clip instead of overflow-hidden: clips visually without affecting layout/scrollbars,
           preventing digit descenders (6, 3, 9, etc.) from being cut by the border radius */
        "rounded-2xl shadow-sm p-8 min-w-0 h-full flex flex-col justify-between transition-all duration-300 relative group",
        highlight 
          ? "bg-primary text-primary-foreground border-transparent" 
          : "bg-card text-card-foreground border border-border/50 hover:border-secondary/40",
        onClick && "cursor-pointer",
        className
      )}
    >
      <div className="flex items-center justify-between mb-8 gap-4">
        {Icon && (
          <div className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs transition-colors duration-300",
            highlight 
              ? "bg-white/10 text-secondary" 
              : "bg-surface-container text-secondary group-hover:bg-secondary/10 group-hover:text-secondary"
          )}>
            <Icon size={20} strokeWidth={1.5} />
          </div>
        )}
        
        {/* Status/Trend Badge — color is driven by the trend value when provided */}
        <div className={cn(
          "px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border flex items-center gap-1.5 shrink-0 transition-all duration-300",
          highlight 
            ? "bg-white/10 text-white border-white/20" 
            : `${badgeCfg.bg} ${badgeCfg.text} ${badgeCfg.border} ${badgeCfg.glow} group-hover:scale-105`
        )}>
          <span className={cn(
            "w-1.5 h-1.5 rounded-full animate-pulse",
            highlight ? "bg-white" : badgeCfg.dot
          )} />
          <span>{translateLabel(cfg.label)}</span>
        </div>
      </div>

      {/* Value area: no overflow-hidden so digits are never clipped; flex-1 fills remaining height */}
      <div className="space-y-3 min-w-0 flex-1 flex flex-col justify-center">
        {/* Title — single line, truncate gracefully if too long */}
        <p className={cn(
          "text-[clamp(8.5px,0.75vw,10.5px)] font-black uppercase tracking-[0.2em] leading-relaxed transition-colors duration-300 line-clamp-2",
          highlight ? "text-secondary/90" : "text-primary group-hover:text-secondary"
        )}>
          {translateLabel(title)}
        </p>
        {/* Number value — container-query font scaling, no overflow-hidden, py-1 gives vertical breathing room */}
        <KpiValue 
          value={value} 
          suffix={suffix} 
          noScroll={true}
          className={cn(
            "font-semibold tracking-tight font-display tabular-nums transition-transform duration-300 group-hover:scale-[1.01] origin-left",
            highlight ? "text-white" : "text-primary"
          )} 
        />
      </div>

      <div className={cn(
        "mt-8 pt-6 border-t flex items-center justify-between gap-4 transition-colors duration-300",
        highlight ? "border-white/10" : "border-border/40 group-hover:border-secondary/20"
      )}>
        <span className={cn(
          "text-[9px] font-bold uppercase tracking-widest opacity-80",
          highlight ? "text-white/60" : "text-muted-foreground"
        )}>
          {translateLabel('Consolidado')}
        </span>
        <div className="flex items-center gap-1.5">
          <div className={cn("w-1 h-1 rounded-full", highlight ? "bg-secondary" : "bg-success")} />
          <span className={cn(
            "text-[9px] font-bold uppercase tracking-widest opacity-80",
            highlight ? "text-white/60" : "text-muted-foreground"
          )}>
            {translateLabel('Conforme')}
          </span>
        </div>
      </div>
    </motion.div>
  );

  if (tooltip) {
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent className="bg-slate-900 text-white font-medium text-xs px-4 py-2.5 border-white/10 shadow-xl block w-[280px] max-w-[280px] whitespace-normal break-words">
            <div className="w-[248px] min-w-[248px] max-w-[248px] whitespace-normal break-words leading-relaxed text-left">
              {tooltip}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
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
