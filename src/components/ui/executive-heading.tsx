import React from 'react';
import { getExecutiveTypography, ExecutiveTypographyRole } from './executive-typography';
import { cn } from '@/lib/utils';

export interface ExecutiveHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  variant?: ExecutiveTypographyRole;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  level?: number | string;
}

/**
 * Componente canônico para todos os títulos executivos da Illumine Governance™.
 * Ele mapeia automaticamente a tag HTML (semântica) para a variante tipográfica (visual),
 * garantindo consistência com a Constituição Visual v6.0.
 */
export const ExecutiveHeading = React.forwardRef<HTMLHeadingElement, ExecutiveHeadingProps>(
  ({ variant, className, as: ComponentProp, level, children, ...props }, ref) => {
    const Component = ComponentProp || (level ? (`h${level}` as any) : 'h2');
    
    // Mapeamento padrão caso a variante não seja explicitamente informada
    const defaultVariantMap: Record<string, ExecutiveTypographyRole> = {
      h1: 'pageTitle',
      h2: 'sectionTitle',
      h3: 'moduleTitle',
      h4: 'submoduleTitle',
      h5: 'cardTitle', // legacy ou auxiliar
      h6: 'cardTitle'
    };

    const activeVariant = variant || defaultVariantMap[Component] || 'sectionTitle';

    return (
      <Component ref={ref as any} className={getExecutiveTypography(activeVariant, className)} {...props}>
        {children}
      </Component>
    );
  }
);

ExecutiveHeading.displayName = 'ExecutiveHeading';
