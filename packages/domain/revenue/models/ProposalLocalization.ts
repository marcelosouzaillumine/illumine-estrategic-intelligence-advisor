export type SupportedLocale = 'pt-BR' | 'en-US' | 'es-ES';

export interface ProposalLocalization {
  locale: SupportedLocale;
  title: string;
  description?: string;
}
