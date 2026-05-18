import React from 'react';
import { LayoutGrid, Calendar, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { FULL_MONTH_LABELS } from '../../constants';

export function PageHeader({ 
  title, 
  subtitle, 
  icon: Icon, 
  actions,
  badge,
  color,
  transparent
}: { 
  title: string; 
  subtitle?: string; 
  icon?: any; 
  actions?: React.ReactNode;
  badge?: string;
  color?: string;
  transparent?: boolean;
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
    <div className="mb-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-button bg-surface-container flex items-center justify-center border border-border shrink-0 shadow-sm">
              {renderIcon(22, "text-secondary")}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h1 className="text-h2 font-display font-medium tracking-tight text-foreground leading-tight">
                {title}
              </h1>
              {badge && (
                <span className="inline-flex w-fit px-3 py-1 bg-surface-container border border-border rounded-full text-[10px] font-medium uppercase tracking-widest text-secondary">
                  {badge}
                </span>
              )}
            </div>
          </div>
          {subtitle && (
            <p className="text-muted-foreground text-body-md font-medium ml-0 lg:ml-16 leading-relaxed max-w-3xl">
              {subtitle}
            </p>
          )}
        </div>
        
        {actions && (
          <div className="flex items-center gap-3 shrink-0">
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

export function StatusBadge({ status, label }: { status: string; label?: string }) {
  const classMap: Record<string, string> = {
    'Verde': 'text-success border-success/30 bg-success/10',
    'Amarelo': 'text-warning border-warning/30 bg-warning/10',
    'Vermelho': 'text-destructive border-destructive/30 bg-destructive/10',
    'Azul': 'text-primary border-primary/30 bg-primary/10',
    'Pendente': 'text-warning border-warning bg-warning/5 shadow-sm',
    'Ativo': 'text-success border-success bg-success/5',
    'Inativo': 'text-destructive border-destructive bg-destructive/5',
    'Em Implantação': 'text-warning border-warning bg-warning/5',
  };
  
  return (
    <span className={cn(
      "px-5 py-1.5 rounded-full text-body-sm font-medium uppercase tracking-widest border transition-all",
      classMap[status] || 'text-muted-foreground border-border bg-surface-container'
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
              <div className={cn("w-16 h-16 flex items-center justify-center border group transition-all rounded-button", tones[tone] || tones.blue)}>
                  <Icon size={24} strokeWidth={1} className="transition-colors" />
              </div>
              <div className={cn("h-[1px] flex-1 opacity-20", tone === 'slate' ? 'bg-foreground' : 'bg-primary')} />
            </div>
            <div>
                <p className="text-body-sm font-medium text-accent uppercase tracking-widest mb-4">{subtitle}</p>
                <h3 className="text-h3 font-display text-foreground leading-tight">{title}</h3>
            </div>
        </div>
    );
}

export function KpiValue({ 
  value, 
  suffix = '', 
  className 
}: { 
  value: string | number; 
  suffix?: string;
  className?: string;
}) {
  const cleanSuffix = suffix.replace(/\s+/g, '\u00A0');
  const isCurrency = ['R$', 'BRL', 'USD', 'EUR', 'GBP', '$'].includes(cleanSuffix.trim());
  return (
    <div className="w-full [container-type:inline-size] overflow-x-auto scrollbar-hide">
      <div className={cn(
        "whitespace-nowrap tabular-nums text-right font-display leading-none min-w-0 max-w-full text-[clamp(0.8rem,10cqw,2.5rem)]",
        className
      )}>
        {isCurrency ? `${cleanSuffix.trim()}\u00A0${value}` : `${value}${cleanSuffix}`}
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
  onClick
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

  const cfg = statusConfig[status] || statusConfig['Verde'];

  return (
    <motion.div 
      whileHover={{ y: -6, scale: 1.015, boxShadow: '0 20px 25px -5px rgba(14, 28, 44, 0.06), 0 10px 10px -5px rgba(14, 28, 44, 0.02)' }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={cn(
        "rounded-2xl border shadow-xs p-8 min-w-0 h-full overflow-hidden flex flex-col justify-between transition-all duration-300 relative group",
        highlight 
          ? "bg-primary text-primary-foreground border-transparent" 
          : "bg-card text-card-foreground border-border hover:border-secondary/40",
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
        
        {/* Advanced Glowing Status Badge */}
        <div className={cn(
          "px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border flex items-center gap-1.5 shrink-0 transition-all duration-300",
          highlight 
            ? "bg-white/10 text-white border-white/20" 
            : `${cfg.bg} ${cfg.text} ${cfg.border} ${cfg.glow} group-hover:scale-105`
        )}>
          <span className={cn(
            "w-1.5 h-1.5 rounded-full animate-pulse",
            highlight 
              ? "bg-white" 
              : status === 'Vermelho' || status === 'Bearish' || status === 'Em Queda'
                ? 'bg-destructive' 
                : status === 'Amarelo' || status === 'Correction' || status === 'Atenção'
                  ? 'bg-warning' 
                  : status === 'Pendente' || status === 'N/A'
                    ? 'bg-muted-foreground'
                    : 'bg-success'
          )} />
          <span>{trend || cfg.label}</span>
        </div>
      </div>

      <div className="space-y-4 min-w-0 overflow-hidden flex-1 flex flex-col justify-center">
        {/* Dynamic Responsive Clamp Title */}
        <div className="w-full overflow-x-auto scrollbar-hide">
          <p className={cn(
            "text-[clamp(8.5px,0.75vw,10.5px)] font-black uppercase tracking-[0.2em] leading-normal transition-colors duration-300 whitespace-nowrap",
            highlight ? "text-secondary/90" : "text-muted-foreground group-hover:text-secondary"
          )}>
            {title}
          </p>
        </div>
        <KpiValue 
          value={value} 
          suffix={suffix} 
          className={cn(
            "font-semibold tracking-tighter text-[clamp(1.5rem,1.8vw,2rem)] font-display transition-transform duration-300 group-hover:scale-[1.01] origin-left",
            highlight ? "text-white" : "text-foreground"
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
          Consolidado
        </span>
        <div className="flex items-center gap-1.5">
          <div className={cn("w-1 h-1 rounded-full", highlight ? "bg-secondary" : "bg-success")} />
          <span className={cn(
            "text-[9px] font-bold uppercase tracking-widest opacity-80",
            highlight ? "text-white/60" : "text-muted-foreground"
          )}>
            Conforme
          </span>
        </div>
      </div>
    </motion.div>
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
  
  className?: string;
}

export function ControlBar({
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  years = [2024, 2025, 2026],
  tabs,
  activeTab,
  setActiveTab,
  showStatusBadge = false,
  statusBadgeLabel = 'Monitoramento Ativo',
  statusBadgeIcon: StatusIcon = ShieldCheck,
  statusBadgeColor = 'success',
  actions,
  children,
  className
}: ControlBarProps) {
  const showSelectors = selectedYear !== undefined && setSelectedYear !== undefined && selectedMonth !== undefined && setSelectedMonth !== undefined;
  
  const badgeColors = {
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    destructive: 'bg-destructive/10 text-destructive border-destructive/20',
    info: 'bg-info/10 text-info border-info/20',
    primary: 'bg-primary/10 text-primary border-primary/20',
  };

  return (
    <div className={cn(
      "flex items-center justify-between gap-4 flex-wrap bg-surface-container/60 p-4 rounded-md border border-border/60 backdrop-blur-sm shadow-sm -mt-6 mb-10",
      className
    )}>
      <div className="flex items-center gap-3">
        {/* Date Selectors */}
        {showSelectors && (
          <div className="flex items-center bg-background border border-border rounded-button p-1 shadow-sm">
            <div className="flex items-center px-4 py-2 border-r border-border">
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
          </div>
        )}

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
            <span className="text-body-sm font-medium uppercase tracking-widest">{statusBadgeLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
