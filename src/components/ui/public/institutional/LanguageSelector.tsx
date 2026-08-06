import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { Locale } from '../../../../i18n';
import { getRouteKeyFromPath, getLocalizedRoute, SupportedLocale } from '../../../../core/routing/internationalRoutes';

const LANGUAGES: { code: Locale; label: string; short: string }[] = [
  { code: 'pt-BR', label: 'Português (BR)', short: 'PT' },
  { code: 'en-US', label: 'English (US)', short: 'EN' },
  { code: 'es-ES', label: 'Español', short: 'ES' },
];

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleSelect = (code: Locale) => {
    setLanguage(code);
    setIsOpen(false);
    
    const path = location.pathname;
    const routeKey = getRouteKeyFromPath(path);
    
    if (routeKey) {
      const newPath = getLocalizedRoute(routeKey, code as SupportedLocale);
      if (newPath !== path) {
        navigate(newPath + location.search + location.hash);
      }
    } else {
      const prefix = code.split('-')[0];
      const match = path.match(/^\/(pt|en|es)(\/|$)/);
      if (match) {
        const newPath = path.replace(/^\/(pt|en|es)(\/|$)/, `/${prefix}$2`);
        if (newPath !== path) {
          navigate(newPath + location.search + location.hash);
        }
      }
    }
  };

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  return (
    <div className="relative group" ref={dropdownRef}>
      <button 
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors py-2 px-3 rounded-md hover:bg-white/5 cursor-pointer relative z-[70]"
        style={{ touchAction: 'manipulation' }}
      >
        <Globe className="w-4 h-4 pointer-events-none" />
        <span className="text-[12px] font-semibold uppercase pointer-events-none">{currentLang.short}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-300 pointer-events-none ${isOpen ? 'rotate-180' : 'group-hover:rotate-180'}`} />
      </button>

      <div className={`absolute top-full right-0 mt-2 w-40 bg-[#0A0A0B]/95 border border-white/5 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden z-[100] transition-all duration-200 origin-top-right ${isOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible lg:group-hover:scale-100 lg:group-hover:opacity-100 lg:group-hover:visible'}`}>
        <div className="flex flex-col p-1">
          {LANGUAGES.map((lang) => (
            <button
              type="button"
              key={lang.code}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSelect(lang.code);
              }}
              className={`flex items-center justify-between w-full text-left px-3 py-2.5 text-[13px] rounded-lg transition-all duration-300 cursor-pointer relative z-[110]
                ${language === lang.code 
                  ? 'bg-white/5 text-white font-medium' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              style={{ touchAction: 'manipulation' }}
            >
              <span className="pointer-events-none">{lang.label}</span>
              {language === lang.code && <Check className="w-3.5 h-3.5 text-white/70 pointer-events-none" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
