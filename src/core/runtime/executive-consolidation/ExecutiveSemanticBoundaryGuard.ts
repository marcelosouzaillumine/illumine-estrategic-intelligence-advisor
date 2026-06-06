// src/core/runtime/executive-consolidation/ExecutiveSemanticBoundaryGuard.ts

import { ExecutiveSemanticRegistry } from '../presentation-governance/ExecutiveSemanticRegistry';

/**
 * Guard that sanitizes, translates and validates payloads for EFOS.
 * It operates on generic objects; strings are recursively inspected.
 */
export function sanitize(payload: any, profile?: string): any {
  if (payload == null) return payload;
  if (typeof payload === 'string') {
    // Replace any prohibited token with [REDACTED]
    let result = payload;
    ExecutiveSemanticRegistry.PROHIBITED.forEach((term) => {
      const regex = new RegExp(term, 'gi');
      result = result.replace(regex, '[REDACTED]');
    });
    return result;
  }
  if (Array.isArray(payload)) {
    return payload.map((item) => sanitize(item, profile));
  }
  // object
  const sanitized: any = {};
  for (const key in payload) {
    if (Object.prototype.hasOwnProperty.call(payload, key)) {
      const value = payload[key];
      // Keys themselves can be prohibited
      const sanitizedKey = ExecutiveSemanticRegistry.PROHIBITED.has(key)
        ? '[REDACTED]'
        : key;
      sanitized[sanitizedKey] = sanitize(value, profile);
    }
  }
  return sanitized;
}

export function translate(payload: any, profile?: string): any {
  if (payload == null) return payload;
  if (typeof payload === 'string') {
    const translation = ExecutiveSemanticRegistry.TRANSLATIONS[payload];
    return translation ?? payload;
  }
  if (Array.isArray(payload)) {
    return payload.map((item) => translate(item, profile));
  }
  const translated: any = {};
  for (const key in payload) {
    if (Object.prototype.hasOwnProperty.call(payload, key)) {
      const value = payload[key];
      const translatedKey = ExecutiveSemanticRegistry.TRANSLATIONS[key] ?? key;
      translated[translatedKey] = translate(value, profile);
    }
  }
  return translated;
}

export function validate(payload: any, profile?: string): void {
  // Determine environment
  const env = process.env.NODE_ENV ?? 'development';
  // In production, do not throw – just allow fallback handling elsewhere.
  if (env === 'production') {
    // No action – validation will be enforced by audit fallback.
    return;
  }
  // In test/ci, throw on any prohibited term remaining after sanitize/translate.
  if (env === 'test' || env === 'ci') {
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
        if (Object.prototype.hasOwnProperty.call(obj, k)) {
          if (ExecutiveSemanticRegistry.PROHIBITED.has(k)) violations.push(k);
          check(obj[k]);
        }
      }
    };
    check(payload);
    if (violations.length) {
      throw new Error('Semantic validation failed: ' + violations.join(', '));
    }
  }
  // In development, log warnings.
  if (env === 'development') {
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
        if (Object.prototype.hasOwnProperty.call(obj, k)) {
          if (ExecutiveSemanticRegistry.PROHIBITED.has(k)) violations.push(k);
          check(obj[k]);
        }
      }
    };
    check(payload);
    if (violations.length) {
      console.warn('Semantic validation warnings (dev):', violations);
    }
  }
}
