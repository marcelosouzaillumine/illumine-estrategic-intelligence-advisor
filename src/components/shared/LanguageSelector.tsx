import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../../i18n/languageMetadata';
import { Locale } from '../../i18n';
import { ChevronDown, Globe } from 'lucide-react';
import { cn } from '../../lib/utils';

export function LanguageSelector({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeLang = SUPPORTED_LANGUAGES.find(lang => lang.locale === language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (locale: Locale) => {
    setLanguage(locale);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("relative shrink-0 select-none z-50", className)}>
      {/* Selector Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container/60 hover:bg-surface-container border border-border/80 hover:border-secondary/40 text-foreground transition-all duration-300 shadow-sm cursor-pointer outline-none"
      >
        <span className="text-xs leading-none" role="img" aria-label={activeLang.label}>
          {activeLang.flag}
        </span>
        <span className="text-[10px] font-black uppercase tracking-widest leading-none">
          {activeLang.locale.split('-')[0]}
        </span>
        <ChevronDown size={10} className={cn("text-muted-foreground transition-transform duration-300", isOpen && "rotate-180")} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-40 rounded-2xl bg-card/95 backdrop-blur-2xl border border-border shadow-2xl p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200"
          style={{
            boxShadow: '0 10px 25px -5px rgba(14, 28, 44, 0.15), 0 8px 10px -6px rgba(14, 28, 44, 0.15)'
          }}
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.locale}
              onClick={() => handleSelect(lang.locale as Locale)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all duration-200 hover:bg-surface-container group cursor-pointer",
                language === lang.locale ? "bg-secondary/10 text-secondary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="text-sm leading-none" role="img" aria-label={lang.label}>
                {lang.flag}
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider leading-none">
                {lang.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
export default LanguageSelector;
