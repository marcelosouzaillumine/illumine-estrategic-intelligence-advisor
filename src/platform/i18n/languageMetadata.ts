export interface LanguageMetadata {
  locale: string;
  label: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageMetadata[] = [
  {
    locale: 'pt-BR',
    label: 'Português',
    flag: '🇧🇷'
  },
  {
    locale: 'en-US',
    label: 'English',
    flag: '🇺🇸'
  },
  {
    locale: 'es-ES',
    label: 'Español',
    flag: '🇪🇸'
  }
];
