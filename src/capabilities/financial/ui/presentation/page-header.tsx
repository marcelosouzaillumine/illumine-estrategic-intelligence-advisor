import React from 'react';
import { cn } from '../../../../lib/utils';
import { LayoutGrid } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';

export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: React.ReactNode;
  icon?: any;
  badge?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  actions?: React.ReactNode;
  color?: string;
  transparent?: boolean;
}

export function PageHeader({ 
  title, 
  subtitle,
  description, 
  icon: Icon,
  badge,
  breadcrumbs, 
  actions, 
  className,
  ...props 
}: PageHeaderProps) {
  const { translateLabel } = useLanguage();
  const displayDescription = description || subtitle;

  const renderIcon = (size: number, iconClassName?: string) => {
    if (!Icon) return <LayoutGrid size={size} className={iconClassName} />;
    if (React.isValidElement(Icon)) {
      return React.cloneElement(Icon as React.ReactElement<any>, { 
        size, 
        className: cn(iconClassName, (Icon.props as any).className) 
      });
    }
    if (typeof Icon === 'function' || (typeof Icon === 'object' && Icon !== null)) {
      return React.createElement(Icon as any, { size, className: iconClassName });
    }
    return <LayoutGrid size={size} className={iconClassName} />;
  };

  return (
    <div className={cn("mb-10", className)} {...props}>
      {breadcrumbs && <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3">{breadcrumbs}</div>}
      
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 xl:gap-8">
        <div className="space-y-2 flex-1 min-w-0 w-full">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0 shadow-sm">
              {renderIcon(22, "text-primary")}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 min-w-0">
              <h1 className="text-3xl md:text-4xl lg:text-[42px] font-semibold tracking-tight text-foreground leading-tight truncate">
                {typeof title === 'string' ? translateLabel(title) : title}
              </h1>
              {badge && (
                <span className="inline-flex w-fit px-3 py-1 bg-surface-container border border-border rounded-full text-[10px] font-medium uppercase tracking-widest text-secondary shrink-0">
                  {typeof badge === 'string' ? translateLabel(badge) : badge}
                </span>
              )}
            </div>
          </div>
          {displayDescription && (
            <p className="text-[15px] font-normal text-foreground/72 ml-0 sm:ml-16 leading-relaxed max-w-3xl break-words">
              {typeof displayDescription === 'string' ? translateLabel(displayDescription) : displayDescription}
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
