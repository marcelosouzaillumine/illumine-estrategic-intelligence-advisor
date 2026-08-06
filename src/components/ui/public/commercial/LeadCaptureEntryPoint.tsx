import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLocalizedRoute, SupportedLocale } from '../../../../core/routing/internationalRoutes';

interface LeadCaptureEntryPointProps {
  label?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export function LeadCaptureEntryPoint({ 
  label = 'Agendar uma Executive Demo', 
  className = '', 
  variant = 'primary' 
}: LeadCaptureEntryPointProps) {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  
  const currentLocale = (i18n.language === 'en-US' ? 'en-US' : i18n.language === 'es-ES' ? 'es-ES' : 'pt-BR') as SupportedLocale;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // In the future, this can open a Deal Room™, Executive Concierge™, etc.
    // Today, it routes to Assessment/Contact
    const targetRoute = getLocalizedRoute('DIAGNOSTIC', currentLocale);
    navigate(targetRoute);
  };

  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-full whitespace-nowrap";
  
  const variants = {
    primary: "bg-amber-500 text-black hover:bg-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:-translate-y-0.5",
    secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/10",
    outline: "border border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
  };

  return (
    <button 
      onClick={handleClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {label}
    </button>
  );
}
