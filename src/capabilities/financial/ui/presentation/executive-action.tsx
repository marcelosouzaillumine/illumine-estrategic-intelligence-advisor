import React, { forwardRef } from 'react';
import { Button } from '../../../../components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { ExecutiveTypographyRegistry } from '../../../../components/ui/executive-typography';
import { sanitizeExecutiveClasses } from '../../../../components/ui/executive-class-sanitizer';

// Define the Executive Action geometry and intention variants 
export const executiveActionVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative",
  {
    variants: {
      variant: {
        primary: "bg-executive text-white hover:bg-executive/90 shadow-sm",
        success: "bg-success-soft hover:bg-success text-success hover:text-white border border-success/20 shadow-sm",
        secondary: "bg-surface border border-border text-secondary hover:bg-surface-container/30 shadow-sm",
        subtle: "bg-secondary/10 hover:bg-secondary text-secondary hover:text-white border border-secondary/20 shadow-sm",
        ghost: "hover:bg-slate-800 transition-colors bg-transparent border-transparent text-muted-foreground",
        destructive: "bg-critical-soft hover:bg-destructive text-destructive hover:text-white border border-destructive/20 shadow-sm",
        toolbar: "hover:bg-surface-high bg-transparent border-transparent",
      },
      size: {
        sm: "h-7 px-2.5 rounded-sm",
        md: "h-8 px-3 py-1.5 rounded-md",
        lg: "h-10 px-6 py-2.5 rounded-xl",
        icon: "h-8 w-8 rounded-md flex items-center justify-center",
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    }
  }
);

type BaseButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size' | 'variant'> & 
  VariantProps<typeof executiveActionVariants> & {
    asChild?: boolean;
    loading?: boolean;
    loadingLabel?: string;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
  };

export type ExecutiveActionProps = BaseButtonProps & (
  | { iconOnly: true; 'aria-label': string }
  | { iconOnly?: false; 'aria-label'?: string }
);

export const ExecutiveAction = forwardRef<HTMLButtonElement, ExecutiveActionProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      asChild = false,
      loading = false,
      loadingLabel,
      iconLeft,
      iconRight,
      iconOnly = false,
      disabled,
      children,
      'aria-label': ariaLabel,
      onClick,
      onKeyDown,
      onPointerDown,
      tabIndex,
      ...props
    },
    ref
  ) => {
    const isBlocked = disabled || loading;

    // Compose handlers to prevent actions when blocked
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isBlocked) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      onClick?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (isBlocked && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      onKeyDown?.(e);
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
      if (isBlocked) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      onPointerDown?.(e);
    };

    // Construct typography based on size. Using microLabel as the constitutional default for actions
    const typographyClass = ExecutiveTypographyRegistry['microLabel'];
    
    const sanitizedStructuralClasses = sanitizeExecutiveClasses(className);

    // Apply the executive geometry, text styles and sanitized structures
    // [&_[data-executive-action-icon]>svg]:size-4 ensures only our slots get resized
    const classes = cn(
      executiveActionVariants({ variant, size }),
      typographyClass,
      "[&_[data-executive-action-icon]>svg]:size-4",
      sanitizedStructuralClasses
    );

    // Render logic
    // If asChild is true, we delegate directly to the Shadcn Button with composed handlers.
    if (asChild) {
      return (
        <Button
          className={classes}
          ref={ref}
          asChild={true}
          disabled={isBlocked}
          aria-disabled={isBlocked ? true : undefined}
          aria-busy={loading ? "true" : undefined}
          aria-label={ariaLabel}
          tabIndex={isBlocked ? -1 : tabIndex}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          // Note: When using Button asChild, Button itself delegates to Slot.Root. 
          // If Button is not meant to receive variant/size props from our domain, we cast them as any or omit them,
          // but Shadcn's Button will ignore unknown variants if they don't match, or we can just omit them here.
          {...props as any}
        >
          {children}
        </Button>
      );
    }

    // Determine the inner content
    const renderIconLeft = iconLeft && !iconOnly && (
      <span data-executive-action-icon="left" aria-hidden="true" className="shrink-0 flex items-center justify-center mr-2">
        {iconLeft}
      </span>
    );
    
    const renderIconRight = iconRight && !iconOnly && (
      <span data-executive-action-icon="right" aria-hidden="true" className="shrink-0 flex items-center justify-center ml-2">
        {iconRight}
      </span>
    );

    const renderText = !iconOnly && (
      <span className="truncate">{children}</span>
    );

    // We preserve width during loading by keeping the content invisible but structurally present
    return (
      <Button
        className={classes}
        ref={ref}
        asChild={false}
        disabled={isBlocked}
        aria-disabled={isBlocked ? true : undefined}
        aria-busy={loading ? "true" : undefined}
        aria-label={ariaLabel}
        tabIndex={isBlocked ? -1 : tabIndex}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        // Force Shadcn Button variants to be ignored/overwritten by our classes string by passing empty strings or default,
        // but passing standard props is fine.
        {...props as any}
      >
        <span className={cn("flex items-center justify-center", loading ? 'invisible' : '')}>
          {iconOnly ? (
            <span data-executive-action-icon="only" aria-hidden="true" className="flex items-center justify-center">
              {children}
            </span>
          ) : (
            <>
              {renderIconLeft}
              {renderText}
              {renderIconRight}
            </>
          )}
        </span>
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
             <span data-executive-action-icon="spinner" aria-hidden="true" className="flex items-center justify-center">
                <Loader2 className="animate-spin" />
             </span>
             {loadingLabel && <span className="ml-2 truncate">{loadingLabel}</span>}
          </span>
        )}
      </Button>
    );
  }
);
ExecutiveAction.displayName = "ExecutiveAction";
