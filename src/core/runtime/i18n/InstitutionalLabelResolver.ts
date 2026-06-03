import { InstitutionalTerminologyRegistry } from './InstitutionalTerminologyRegistry';

export function humanizeInstitutionalKey(key: string): string | null {
  const cleaned = key
    .replace(/^.*\./, "") // remove prefix like "financial." se houver
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1") // Add space before capital letters (e.g. netEquity -> net Equity)
    .trim();
    
  if (cleaned.length === 0) return null;

  return cleaned
    .split(" ")
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function resolveInstitutionalLabel(
  key: string | null | undefined, 
  translator: (k: string) => string
): string | null {
  if (!key) return null;

  let cleanKey = key.trim();
  if (cleanKey.startsWith('[[') && cleanKey.endsWith(']]')) {
    cleanKey = cleanKey.slice(2, -2).trim();
  }

  // 1. Registro Institucional Curado
  const registered = InstitutionalTerminologyRegistry[cleanKey];
  if (registered) {
    return registered;
  }

  // 2. Tradução via i18n
  const translated = translator(cleanKey);
  
  // Se a tradução for válida, diferente da key, e não for um fallback i18n com colchetes, usamos ela
  if (translated && translated !== cleanKey && !(translated.startsWith('[[') && translated.endsWith(']]'))) {
    return translated;
  }

  // Se a chave não tem cara de chave técnica (sem ponto e sem underscore),
  // assumimos que é uma string natural (ex: "Ativo Total" vindo do banco de dados)
  if (!key.includes(".") && !key.includes("_")) {
    return key;
  }

  // Fallback 1: Humanização automática
  const humanized = humanizeInstitutionalKey(key);
  if (humanized) {
    return humanized;
  }

  // Fallback 2: Silencioso (evita poluição na UI executiva)
  return null;
}
