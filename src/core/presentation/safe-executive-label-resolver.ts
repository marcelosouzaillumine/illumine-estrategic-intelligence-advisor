import { ExecutivePresentationDictionary, DictionaryContext } from "./executive-presentation-dictionary";

export function looksLikeTechnicalCode(value: string): boolean {
  if (typeof value !== "string") return false;
  
  // Empty strings are not technical codes
  if (!value.trim()) return false;

  // UUID or standard ID pattern
  if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value)) {
    return true;
  }

  return (
    /^[A-Z0-9_]{3,}$/.test(value) || // UPPER_SNAKE_CASE (e.g., DFC_CAUSAL, CRITICAL)
    /^[a-z]+[A-Z][a-zA-Z0-9]*$/.test(value) || // camelCase (e.g., sectionId, sourceModule)
    value.includes("Module") ||
    value.includes("Code") ||
    value.includes("Id") ||
    value.includes("ID") ||
    value.includes("Runtime") ||
    value.includes("Engine") ||
    value.includes("Adapter") ||
    value.includes("Registry") ||
    value.includes("Boundary") ||
    value.includes("Severity") ||
    value.includes("Classification") ||
    value.includes("Dimension") ||
    value.includes("Diagnostic") ||
    value.includes("ScoreType") ||
    value.includes("Source") ||
    value.includes("Origin")
  );
}

export function resolveExecutiveLabel(
  value: unknown,
  context: DictionaryContext | "generic"
): string {
  if (typeof value !== "string") return "Informação não classificada";
  
  if (context !== "generic") {
    const dictionary = ExecutivePresentationDictionary[context];
    if (dictionary && value in dictionary) {
      return dictionary[value as keyof typeof dictionary];
    }
  }

  // Se não encontrou no dicionário, ou é generic, tenta aplicar fallback seguro
  // se o conteúdo parecer um código técnico vazado
  if (looksLikeTechnicalCode(value)) {
    return "Informação institucional";
  }

  return value;
}
