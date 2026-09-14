import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../../../../i18n/languageMetadata';
import { Locale } from '../../../../i18n';
import { ChevronDown, Globe, Check } from 'lucide-react';
import { cn } from '../../../../lib/utils';

export function LanguageSelector({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

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
    
    const path = location.pathname;
    const prefix = locale.split('-')[0];
    
    const match = path.match(/^\/(pt|en|es)(\/|$)/);
    if (match) {
      const newPath = path.replace(/^\/(pt|en|es)(\/|$)/, `/${prefix}$2`);
      if (newPath === path) {
        window.location.reload();
        return;
      }
      window.location.href = newPath + location.search + location.hash;
    }
  };

  return (
    <div ref={containerRef} className={cn("relative shrink-0 select-none z-50", className)}>
      {/* Selector Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors py-2 px-3 rounded-md hover:bg-black/5 dark:hover:bg-white/5 outline-none"
      >
        <Globe className="w-4 h-4" />
        <span className="text-[12px] font-semibold uppercase">
          {activeLang.locale.split('-')[0]}
        </span>
        <ChevronDown size={12} className={cn("transition-transform duration-300", isOpen && "rotate-180")} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-40 bg-[#0A0A0B]/95 border border-white/5 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col p-1">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.locale}
              onClick={() => handleSelect(lang.locale as Locale)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all duration-200 group cursor-pointer text-[13px]",
                language === lang.locale ? "bg-black/5 dark:bg-white/10 text-foreground font-medium" : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5" />
                <span>{lang.label}</span>
              </div>
              {language === lang.locale && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
          </div>
        </div>
      )}
    </div>
  );
}
export default LanguageSelector;
