import { InstitutionalTerminologyRegistry } from './InstitutionalTerminologyRegistry';

export function humanizeInstitutionalKey(key: string): string | null {
  const cleaned = key
    .replace(/^.*\./, "") // remove prefix like "financial." se houver
    .replace(/_/g, " ")
    // Only add space before capital letters if the previous character is lowercase
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();
    
  if (cleaned.length === 0) return null;

  return cleaned
    .split(/\s+/)
    .filter(word => word.length > 0)
    .map(word => {
      // Keep all-uppercase words (like CFO) intact
      if (word === word.toUpperCase() && word.length > 1) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
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

  // 2. Interceptação de Enums Técnicos (NOVO)
  if (/^[A-Z0-9_]{3,}$/.test(cleanKey)) {
    // Tenta primeiro em enums.KEY
    const enumTranslation = translator(`enums.${cleanKey}`);
    if (enumTranslation && enumTranslation !== `enums.${cleanKey}` && !enumTranslation.startsWith('[[')) {
      return enumTranslation;
    }
    // Fallback depreciado (scenario.enum.KEY)
    const deprecatedTranslation = translator(`scenario.enum.${cleanKey}`);
    if (deprecatedTranslation && deprecatedTranslation !== `scenario.enum.${cleanKey}` && !deprecatedTranslation.startsWith('[[')) {
      if (process.env.NODE_ENV === 'development') {
         console.warn(`[i18n] Deprecated fallback used for enum: ${cleanKey}. Please migrate to enums.${cleanKey}.`);
      }
      return deprecatedTranslation;
    }
  }

  // 3. Tradução via i18n
  const translated = translator(cleanKey);
  
  // Se a tradução for válida, diferente da key, e não for um fallback i18n com colchetes, usamos ela
  if (translated && translated !== cleanKey && !(translated.startsWith('[[') && translated.endsWith(']]'))) {
    return translated;
  }

  // Se a chave não tem cara de chave técnica (sem ponto e sem underscore e possui espaços),
  // assumimos que é uma string natural (ex: "Ativo Total" vindo do banco de dados)
  if (!key.includes(".") && !key.includes("_") && key.includes(" ")) {
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
