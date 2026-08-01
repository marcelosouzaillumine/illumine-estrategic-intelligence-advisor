export type SupportedLanguage = "pt-BR" | "en-US" | "es-ES";
export type SupportedCurrency = "BRL" | "USD" | "EUR";

export interface UserLocalePreference {
  language: SupportedLanguage;
  timezone: string;
  currency: SupportedCurrency;
  dateFormat: string;
  numberFormat: string;
}

export const DEFAULT_LOCALE_PREFERENCE: UserLocalePreference = {
  language: "pt-BR",
  timezone: "America/Sao_Paulo",
  currency: "BRL",
  dateFormat: "DD/MM/YYYY",
  numberFormat: "pt-BR",
};
