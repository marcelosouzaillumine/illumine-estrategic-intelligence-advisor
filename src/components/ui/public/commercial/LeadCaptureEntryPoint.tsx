import React from 'react';

// Centralized configuration for commercial leads
export const WHATSAPP_COMMERCIAL_URL = "https://wa.me/5511999999999?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20Executive%20Demo%20da%20plataforma%20Illumine.";

interface LeadCaptureEntryPointProps {
  label?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export function LeadCaptureEntryPoint({ 
  label = 'Agendar Executive Demo', 
  className = '', 
  variant = 'primary' 
}: LeadCaptureEntryPointProps) {

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Redirects to official commercial WhatsApp
    window.open(WHATSAPP_COMMERCIAL_URL, '_blank', 'noopener,noreferrer');
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
