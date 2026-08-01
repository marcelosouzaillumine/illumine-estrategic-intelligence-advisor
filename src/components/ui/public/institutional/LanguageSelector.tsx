import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { Locale } from '../../../../i18n';

const LANGUAGES: { code: Locale; label: string; short: string }[] = [
  { code: 'pt-BR', label: 'Português (BR)', short: 'PT' },
  { code: 'en-US', label: 'English (US)', short: 'EN' },
  { code: 'es-ES', label: 'Español', short: 'ES' },
];

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (code: Locale) => {
    setLanguage(code);
    setIsOpen(false);
  };

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors py-2 px-3 rounded-md hover:bg-white/5"
      >
        <Globe className="w-4 h-4" />
        <span className="text-[12px] font-semibold uppercase">{currentLang.short}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-40 bg-[#121214] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col p-1">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`flex items-center justify-between w-full text-left px-3 py-2 text-[13px] rounded-lg transition-colors
                  ${language === lang.code 
                    ? 'bg-amber-500/10 text-amber-500 font-medium' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
              >
                <span>{lang.label}</span>
                {language === lang.code && <Check className="w-3 h-3" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
