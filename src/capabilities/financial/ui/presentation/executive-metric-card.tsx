import React from 'react';
import { cn } from '../../../../lib/utils';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveMetric, ExecutiveText, ExecutiveSpacingRegistry } from '../../../../components/ui/executive-typography';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../../components/ui/tooltip';
import { ExecutiveLocalizationRegistry } from '../../../../core/presentation/executive-localization-registry';
import { ExecutiveStatusBadge } from '../../../../components/ui/executive-status-badge';

export interface ExecutiveMetricCardProps {
  label?: string;
  title?: React.ReactNode | string;
  value: React.ReactNode;
  description?: React.ReactNode;
  helper?: React.ReactNode;
  statusBadge?: React.ReactNode;
  status?: string | 'positive' | 'negative' | 'neutral' | any;
  tone?: 'neutral' | 'success' | 'warning' | 'critical' | 'info';
  variant?: 'default' | 'transparent' | 'highlight' | 'technical';
  density?: 'compact' | 'standard' | 'analytical' | 'comfortable';
  layout?: 'standard' | 'hero' | 'summary';
  surface?: 'default' | 'transparent' | 'subtle';
  
  confidenceValue?: number;
  confidenceLabel?: React.ReactNode;
  confidence?: string | React.ReactNode;
  
  tooltip?: React.ReactNode;
  onClick?: () => void;
  icon?: React.ElementType;
  className?: string;
  suffix?: string;
  noScroll?: boolean;
  trend?: string | any;
}

export function ExecutiveMetricCard({
  label,
  title,
  value,
  description,
  helper,
  statusBadge,
  status,
  tone = 'neutral',
  variant = 'default',
  density = 'comfortable',
  layout = 'standard',
  surface = 'default',
  confidenceValue,
  confidenceLabel,
  confidence,
  tooltip,
  onClick,
  icon: Icon,
  trend,
  className
}: ExecutiveMetricCardProps) {
  const effectiveTitle = title || label;
  const effectiveDescription = description || helper;
  const effectiveBadge = statusBadge || status;
  
  const toneClasses = {
    neutral: 'border-border',
    success: 'border-success/30 bg-success-soft',
    warning: 'border-warning/30 bg-warning-soft',
    critical: 'border-critical/30 bg-critical-soft',
    info: 'border-primary/30 bg-surface-container',
  }[tone] || 'border-border';

  const badgeRef = React.useRef<HTMLDivElement>(null);

  const badgeVariant = variant === 'technical' ? 'technical' : 'metric';
  const resolvedStatus = tone === 'success' ? 'EXCELLENT' : tone === 'warning' ? 'WARNING' : tone === 'critical' ? 'CRITICAL' : 'NEUTRAL';
  const renderedBadge = typeof effectiveBadge === 'string'
    ? <ExecutiveStatusBadge variant={badgeVariant} status={resolvedStatus} label={effectiveBadge} />
    : effectiveBadge;

  let renderedTrend = null;
  if (trend) {
    if (typeof trend === 'string') {
      const isUp = trend === 'up' || trend.startsWith('+');
      const isDown = trend === 'down' || trend.startsWith('-');
      renderedTrend = (
        <span className={cn(
          "inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border shrink-0",
          isUp ? "text-success bg-success-soft border-success/20" :
          isDown ? "text-critical bg-critical-soft border-critical/20" :
          "text-executive-secondary bg-surface-container border-border"
        )}>
          {trend}
        </span>
      );
    } else if (typeof trend === 'object') {
      const isUp = trend.direction === 'up' || (trend.value && String(trend.value).startsWith('+'));
      const isDown = trend.direction === 'down' || (trend.value && String(trend.value).startsWith('-'));
      renderedTrend = (
        <span className={cn(
          "inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border shrink-0",
          isUp ? "text-success bg-success-soft border-success/20" :
          isDown ? "text-critical bg-critical-soft border-critical/20" :
          "text-executive-secondary bg-surface-container border-border"
        )}>
          {trend.value || trend.direction}
        </span>
      );
    }
  }

  const isCompact = density === 'compact';
  const showDescription = Boolean(effectiveDescription);
  const showConfidence = (layout === 'hero' || !isCompact) && (confidenceLabel !== undefined || confidenceValue !== undefined || confidence !== undefined);

  let finalConfidenceLabel = confidenceLabel;
  if (!finalConfidenceLabel) {
    if (confidenceValue !== undefined) {
      finalConfidenceLabel = ExecutiveLocalizationRegistry.formatConfidence(confidenceValue, 'pt-BR');
    } else if (confidence !== undefined) {
      finalConfidenceLabel = typeof confidence === 'string' && /^\d+(?:\.\d+)?%$/.test(confidence.trim()) 
        ? `${confidence.trim()} de confiança`
        : confidence;
    }
  }

  const surfaceVariants: Record<string, string> = {
    default: variant === 'highlight' ? "bg-executive text-executive-foreground shadow-xl" : "bg-card text-card-foreground shadow-sm border",
    transparent: "bg-transparent shadow-none border-none",
    subtle: "bg-card shadow-none border-none",
  };

  const heroTokens: Record<string, string> = {
    comfortable: "p-8 gap-6",
    compact: "p-4 gap-2",
    analytical: "p-4 gap-2",
    standard: "p-6 gap-4"
  };

  const content = (
    <ExecutiveSurface 
      padding="none" 
      variant={variant === 'highlight' ? 'default' : (variant === 'technical' ? 'default' : variant)}
      className={cn(
        "flex flex-col items-stretch justify-between w-full transition-all h-full overflow-hidden p-6 gap-3",
        layout !== 'hero' && "rounded-[24px]",
        layout === 'hero' ? heroTokens[density] : ExecutiveSpacingRegistry.cardPaddingCompact,
        surfaceVariants[surface],
        toneClasses,
        onClick && "cursor-pointer hover:scale-[1.01] hover:shadow-md active:scale-[0.99]",
        className
      )}
      onClick={onClick}
    >
      {/* Header */}
      <div className={cn("w-full flex items-start justify-between gap-2 min-h-[28px]")}>
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {Icon && (
            <div className="w-7 h-7 rounded-xl bg-surface-container flex items-center justify-center border border-border shrink-0">
              {React.isValidElement(Icon) ? Icon : (typeof Icon === 'function' || typeof Icon === 'object' ? React.createElement(Icon as any, { size: 14, className: cn(variant === 'highlight' ? "text-executive-inverse-secondary" : "text-primary") }) : null)}
            </div>
          )}
          <ExecutiveText variant={variant === 'highlight' ? "metricLabelInverse" : (layout === 'hero' ? "label" : "metricLabel")} as="div" className="line-clamp-2 break-words text-left font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {effectiveTitle}
          </ExecutiveText>
        </div>
        {(renderedBadge || renderedTrend) && (
          <div ref={badgeRef} className="shrink-0 flex items-center justify-end gap-1.5 max-w-[140px]">
            {renderedBadge}
            {renderedTrend}
          </div>
        )}
      </div>

      {/* Value Area */}
      <div className={cn("w-full flex items-baseline justify-between min-h-[36px] mt-1")}>
        <ExecutiveMetric variant={layout === 'hero' ? "heroMetric" : "metricCompact"} as="div" className={cn("text-left shrink-0 font-bold tracking-tight font-display text-2xl md:text-3xl text-foreground max-w-full flex-1 break-words")}>
          {value}
        </ExecutiveMetric>
        
        {showConfidence && layout !== 'hero' && (
          <div className="shrink-0 flex items-center justify-end pl-2 pb-1">
            <ExecutiveMetric variant={variant === 'highlight' ? "metricConfidenceInverse" : "metricConfidence"} as="span">
              {finalConfidenceLabel}
            </ExecutiveMetric>
          </div>
        )}
      </div>

      {showConfidence && layout === 'hero' && (
        <div className={cn("flex flex-col items-start", density === 'compact' ? "gap-0" : ExecutiveSpacingRegistry.microGap)}>
          <ExecutiveText variant="label">Confiança</ExecutiveText>
          <ExecutiveMetric variant="metricMetaValue" as="span">{finalConfidenceLabel}</ExecutiveMetric>
        </div>
      )}

      {/* Helper / Description Zone */}
      {showDescription && (
        <div className="w-full flex flex-col flex-1 justify-start pt-2 border-t border-border/50 mt-1">
          <ExecutiveText variant={variant === 'highlight' ? "metricDescriptionInverse" : "metricDescription"} as="div" className="line-clamp-2 text-left text-xs text-slate-700 dark:text-slate-300 font-medium">
            {effectiveDescription}
          </ExecutiveText>
        </div>
      )}
    </ExecutiveSurface>
  );

  if (tooltip) {
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent className="bg-executive text-executive-foreground px-4 py-2.5 border-executive-foreground/10 shadow-xl block w-[280px] max-w-[280px] whitespace-normal break-words z-50">
            <div className="w-[248px] min-w-[248px] max-w-[248px] whitespace-normal break-words text-left">
              <ExecutiveText variant="captionInverse" as="span" className="block text-executive-inverse-secondary">
                {tooltip}
              </ExecutiveText>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
}
