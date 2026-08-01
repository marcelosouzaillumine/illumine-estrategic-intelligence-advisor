import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../config/i18n.config';
import { UserLocalePreference, DEFAULT_LOCALE_PREFERENCE, SupportedLanguage } from '../config/locale.types';
import { LocaleResolutionService } from '../services/LocaleResolution.service';

interface LocaleContextType {
  preference: UserLocalePreference;
  setPreference: (pref: Partial<UserLocalePreference>) => void;
  formatCurrency: (value: number) => string;
  formatDate: (date: Date | string | number) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};

interface LocaleProviderProps {
  children: ReactNode;
  initialPreference?: Partial<UserLocalePreference>;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({ children, initialPreference }) => {
  const [preference, setPreferenceState] = useState<UserLocalePreference>({
    ...DEFAULT_LOCALE_PREFERENCE,
    ...initialPreference
  });

  useEffect(() => {
    // Resolve active language based on priority
    const resolvedLanguage = LocaleResolutionService.resolveLanguage(preference.language);
    
    if (resolvedLanguage !== preference.language) {
      setPreferenceState(prev => ({ ...prev, language: resolvedLanguage }));
    }

    if (i18n.language !== resolvedLanguage) {
      i18n.changeLanguage(resolvedLanguage);
    }
  }, [preference.language]);

  const setPreference = (newPref: Partial<UserLocalePreference>) => {
    setPreferenceState(prev => ({ ...prev, ...newPref }));
  };

  const formatCurrency = (value: number): string => {
    try {
      return new Intl.NumberFormat(preference.numberFormat, {
        style: 'currency',
        currency: preference.currency,
      }).format(value);
    } catch (e) {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }
  };

  const formatDate = (date: Date | string | number): string => {
    try {
      const d = new Date(date);
      return new Intl.DateTimeFormat(preference.language, {
        timeZone: preference.timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(d);
    } catch (e) {
      return new Date(date).toLocaleDateString();
    }
  };

  return (
    <I18nextProvider i18n={i18n}>
      <LocaleContext.Provider value={{ preference, setPreference, formatCurrency, formatDate }}>
        {children}
      </LocaleContext.Provider>
    </I18nextProvider>
  );
};
