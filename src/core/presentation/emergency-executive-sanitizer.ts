import { resolveExecutiveLabel, looksLikeTechnicalCode } from "./safe-executive-label-resolver";
import { DictionaryContext } from "./executive-presentation-dictionary";

export function sanitizeExecutivePayload<T>(payload: T): T {
  if (Array.isArray(payload)) {
    return payload.map(sanitizeExecutivePayload) as unknown as T;
  }
  
  if (payload !== null && typeof payload === "object") {
    // If it has 'visible', we only sanitize 'visible' and leave 'internal' untouched
    if ('visible' in payload) {
      const p = payload as any;
      return {
        ...p,
        visible: sanitizeExecutivePayload(p.visible)
      } as unknown as T;
    }

    return Object.fromEntries(
      Object.entries(payload).map(([key, value]) => {
        if (typeof value === "string" && looksLikeTechnicalCode(value)) {
          // Attempt to infer context based on the key name
          let context: DictionaryContext | "generic" = "generic";
          if (key.toLowerCase().includes("severity")) context = "severities";
          else if (key.toLowerCase().includes("section")) context = "sections";
          else if (key.toLowerCase().includes("status")) context = "status";
          else if (key.toLowerCase().includes("mode")) context = "modes";
          
          return [key, resolveExecutiveLabel(value, context)];
        }
        if (value !== null && typeof value === "object") {
          return [key, sanitizeExecutivePayload(value)];
        }
        return [key, value];
      })
    ) as unknown as T;
  }
  if (typeof payload === "string" && looksLikeTechnicalCode(payload)) {
    return resolveExecutiveLabel(payload, "generic") as unknown as T;
  }
  
  return payload;
}
