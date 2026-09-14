import React from 'react';
import { useLanguage } from '../../../../contexts/LanguageContext';

interface LocalizedEnumProps extends React.HTMLAttributes<HTMLSpanElement> {
  value?: string | null;
  fallback?: string;
}

export const LocalizedEnum: React.FC<LocalizedEnumProps> = ({ value, fallback = '', className, ...props }) => {
  const { safeT } = useLanguage();
  
  if (!value) return <span className={className} {...props}>{fallback}</span>;
  
  // O safeT automaticamente vai capturar enums pelo InstitutionalLabelResolver
  return <span className={className} {...props}>{safeT(value, fallback || value.replace(/_/g, ' '))}</span>;
};
