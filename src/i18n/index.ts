import ptBR from './pt-BR';
import enUS from './en-US';
import esES from './es-ES';

export const dictionaries = {
  'pt-BR': ptBR,
  'en-US': enUS,
  'es-ES': esES
} as const;

export type Locale = keyof typeof dictionaries;
