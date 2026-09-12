// src/core/runtime/executive-consolidation/ExecutiveSemanticAudit.ts

import { ExecutiveSemanticRegistry } from '../presentation-governance/ExecutiveSemanticRegistry';

/**
 * Audits a payload for prohibited terms after sanitization/translation.
 * Returns an object indicating whether the payload passes and any violations found.
 */
export function audit(payload: any, profile?: string): { pass: boolean; violations: string[] } {
  const env = process.env.NODE_ENV ?? 'development';

  const violations: string[] = [];
  const check = (obj: any) => {
    if (obj == null) return;
    if (typeof obj === 'string') {
      if (ExecutiveSemanticRegistry.PROHIBITED.has(obj)) violations.push(obj);
      return;
    }
    if (Array.isArray(obj)) {
      obj.forEach(check);
      return;
    }
    for (const k in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, k)) continue;
      if (ExecutiveSemanticRegistry.PROHIBITED.has(k)) violations.push(k);
      check(obj[k]);
    }
  };

  check(payload);

  const pass = violations.length === 0;

  // In production, never report pass if there are violations; fallback will be used elsewhere.
  if (env === 'production') {
    // Log internally for audit purposes
    if (!pass) {
      console.error('ExecutiveSemanticAudit violations (prod):', violations);
    }
    return { pass: false, violations };
  }

  // In other envs, keep pass status.
  return { pass, violations };
}
