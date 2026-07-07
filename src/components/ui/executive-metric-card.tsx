import React from 'react';
import { cn } from '@/lib/utils';
import { ExecutiveSurface } from './executive-surface';
import { ExecutiveMetric, ExecutiveText, ExecutiveSpacingRegistry } from './executive-typography';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { ExecutiveLocalizationRegistry } from '@/core/i18n/executive-localization-registry';
import { ExecutiveStatusBadge } from './executive-status-badge';
import type { ExecutiveStatus } from './executive-status-badge';

export interface ExecutiveMetricCardProps {
  /** @deprecated Use title instead to avoid ambiguity */
  label?: string;
  title?: React.ReactNode | string;
  value: React.ReactNode;
  description?: React.ReactNode;
  statusBadge?: React.ReactNode;
  /** @deprecated Use statusBadge instead */
  status?: string | 'positive' | 'negative' | 'neutral' | any;
  tone?: 'neutral' | 'success' | 'warning' | 'critical' | 'info';
  variant?: 'default' | 'transparent' | 'highlight' | 'technical';
  density?: 'compact' | 'standard' | 'analytical' | 'comfortable';
  layout?: 'standard' | 'hero' | 'summary';
  surface?: 'default' | 'transparent' | 'subtle';
  
  /** Raw numeric confidence score (0-100). The card will automatically localize it via Registry. */
  confidenceValue?: number;
  /** Explicit pre-formatted confidence label. Supersedes confidenceValue if provided. */
  confidenceLabel?: React.ReactNode;
  /** @deprecated Pass confidenceValue or confidenceLabel to ensure i18n. */
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
  className
}: ExecutiveMetricCardProps) {
  const effectiveTitle = title || label;
  const effectiveBadge = statusBadge || status;
  const toneClasses = {
    neutral: '',
    success: '',
    warning: '',
    critical: '',
    info: '',
  }[tone];

  const badgeRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && badgeRef.current) {
      const text = badgeRef.current.textContent?.toUpperCase() || '';
      if ((text.includes('CRÍTICO') || text.includes('CRÍTICA') || text.includes('CRITICO') || text.includes('CRITICAL')) && tone !== 'critical') {
        console.warn(`[ExecutiveMetricCard] Semantic mismatch detected: Badge text implies critical severity ("${text}") but tone is "${tone}". Title: ${effectiveTitle}`);
      }
    }
  }, [tone, effectiveTitle, effectiveBadge]);

  // Se a badge for string, envolvemos no ExecutiveBadge usando o tone atual
  // Se for um Node React (ex: <ExecutiveStatusBadge>), renderizamos como está.
  const badgeVariant = variant === 'technical' ? 'technical' : 'metric';
  const resolvedStatus = tone === 'success' ? 'EXCELLENT' : tone === 'warning' ? 'WARNING' : tone === 'critical' ? 'CRITICAL' : 'NEUTRAL';
  const renderedBadge = typeof effectiveBadge === 'string'
    ? <ExecutiveStatusBadge variant={badgeVariant} status={resolvedStatus} label={effectiveBadge} />
    : effectiveBadge;

  const isCompact = density === 'compact';
  const isAnalytical = density === 'analytical';
  const showDescription = isAnalytical && description;
  const showConfidence = (layout === 'hero' || !isCompact) && (confidenceLabel !== undefined || confidenceValue !== undefined || confidence !== undefined);

  let finalConfidenceLabel = confidenceLabel;
  if (!finalConfidenceLabel) {
    if (confidenceValue !== undefined) {
      finalConfidenceLabel = ExecutiveLocalizationRegistry.formatConfidence(confidenceValue, 'pt-BR'); // Default language can be overridden by a context if provided
    } else if (confidence !== undefined) {
      finalConfidenceLabel = typeof confidence === 'string' && /^\d+(?:\.\d+)?%$/.test(confidence.trim()) 
        ? `${confidence.trim()} de confiança` // Legacy fallback
        : confidence;
    }
  }

  const surfaceVariants: Record<string, string> = {
    default: variant === 'highlight' ? "bg-executive text-executive-foreground shadow-xl" : "bg-card text-card-foreground shadow-sm border border-border",
    transparent: "bg-transparent shadow-none border-none",
    subtle: "bg-white shadow-none border-none",
  };

  const heroTokens: Record<string, string> = {
    comfortable: "p-8 gap-6",
    compact: "p-4 gap-2",
    analytical: "p-2 gap-1",
    standard: "p-6 gap-4"
  };

  const content = (
    <ExecutiveSurface 
      padding="none" 
      variant={variant === 'highlight' ? 'default' : (variant === 'technical' ? 'default' : variant)}
      className={cn(
        "flex flex-col items-stretch justify-start w-full transition-all h-full overflow-hidden",
        layout !== 'hero' && "rounded-[24px]",
        layout === 'hero' ? heroTokens[density] : (isAnalytical ? ExecutiveSpacingRegistry.cardPadding : ExecutiveSpacingRegistry.cardPaddingCompact),
        surfaceVariants[surface],
        toneClasses,
        onClick && "cursor-pointer hover:scale-[1.01] hover:shadow-md active:scale-[0.99]",
        className
      )}
      onClick={onClick}
    >
      {/* <Header> Fixed minimum height guarantees value baseline alignment */}
      <div className={cn("w-full flex items-start justify-between", layout === 'summary' ? "h-[48px] mb-2 gap-2" : (layout === 'hero' ? ExecutiveSpacingRegistry.microGap : "min-h-[40px] mb-2 gap-2"))} // @allow-margin
      >
        <div className="flex items-start gap-1.5 min-w-0 flex-1">
          {Icon && <Icon size={14} className={cn("shrink-0 mt-0.5", variant === 'highlight' ? "text-executive-inverse-secondary" : "text-executive-muted")} // @allow-margin
          />}
          <ExecutiveText variant={variant === 'highlight' ? "metricLabelInverse" : (layout === 'hero' ? "label" : "metricLabel")} as="div" className="line-clamp-2 break-words text-left">
            {effectiveTitle}
          </ExecutiveText>
        </div>
        {renderedBadge && (
          <div ref={badgeRef} className="shrink-0 flex items-start justify-end max-w-[140px]">
            {renderedBadge}
          </div>
        )}
      </div>

      {/* <Value Area> Fixed minimum height to accommodate secondary values without breaking divider baseline */}
      <div className={cn("w-full flex items-end justify-between min-h-[44px]", layout === 'hero' ? "" : "mb-2")} // @allow-margin
      >
        <ExecutiveMetric variant={layout === 'hero' ? "heroMetric" : "metricCompact"} as="div" className={cn("text-left shrink-0 truncate", layout === 'hero' ? "max-w-[100%]" : "max-w-[65%]")}>
          {value}
        </ExecutiveMetric>
        
        {showConfidence && layout !== 'hero' && (
          <div className="shrink-0 flex items-center justify-end pl-2 pb-1" // @allow-margin
          >
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

      {/* <Divider> & <Description> Zone */}
      {showDescription && (
        <div className="w-full flex flex-col flex-1 justify-start mt-1" // @allow-margin
        >
          <div className={cn("w-full h-px mb-3 shrink-0", variant === 'highlight' ? "bg-executive-foreground/10" : "bg-border")} // @allow-margin
          />
          <div className="w-full flex-1 flex flex-col items-start justify-start">
            <ExecutiveText variant={variant === 'highlight' ? "metricDescriptionInverse" : "metricDescription"} as="div" className="line-clamp-2 text-left">
              {description}
            </ExecutiveText>
          </div>
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
          <TooltipContent className="bg-executive text-executive-foreground px-4 py-2.5 border-executive-foreground/10 shadow-xl block w-[280px] max-w-[280px] whitespace-normal break-words z-50" // @allow-margin
          >
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
