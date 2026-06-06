import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Setup Mock Browser Globals for Node.js compatibility BEFORE importing components
class DummyDOMMatrix {
  a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
}
(globalThis as any).DOMMatrix = DummyDOMMatrix;
if (typeof window === 'undefined') {
  (globalThis as any).window = globalThis;
}
if (!(globalThis as any).addEventListener) {
  (globalThis as any).addEventListener = () => {};
  (globalThis as any).removeEventListener = () => {};
}
if (typeof document === 'undefined') {
  (globalThis as any).document = {
    createElement: () => ({
      getContext: () => ({})
    }),
    body: {
      appendChild: () => {},
      removeChild: () => {}
    },
    addEventListener: () => {},
    removeEventListener: () => {}
  };
}

// Dynamically import modules to ensure globals are set first!
const React = await import('react');
const { renderToStaticMarkup } = await import('react-dom/server');
const { EFOSPage } = await import('../src/components/pages/EFOSPage');
const { isProduction } = await import('../src/core/runtime/executive-consolidation/ProductionVisibilityPolicy');

// Forbidden tokens list for BOARD and EXECUTIVE contexts
const FORBIDDEN_TOKENS = [
  '[[runtime.',
  'FULL_FINANCIAL_VIEW',
  'HIGH_CONFIDENCE',
  'DRE_DFC_DLPA',
  'DFC_CONTINUITY_PRESSURE',
  'CAPITAL_DESTRUCTION',
  'Debug Mode',
  '0.20805817244989006',
];

describe('EFOS Sovereignty and Visibility Tests', () => {
  
  test('EFOSPage BOARD/EXECUTIVE does not contain forbidden tokens', () => {
    (globalThis as any).__mockUseLanguage = () => ({
      language: 'pt-BR',
      setLanguage: () => {},
      t: (key: string) => key,
      safeT: (key: string, fallback?: string) => fallback || key,
      translateLabel: (label: string) => label,
    });

    (globalThis as any).__mockUseInstitutionalAuth = () => ({
      session: {
        role: 'EXECUTIVE_OFFICER',
        tenantId: 'T1',
        actorId: 'A1',
        sessionState: 'READY',
        availableTenants: []
      },
      loading: false,
      activateTenant: () => {},
      logout: async () => {},
      user: null
    });

    (globalThis as any).__mockUseAnnualFinancialData = () => ({
      dbData: [],
      docIds: [],
      loading: false,
      error: null,
      refetch: () => {}
    });

    (globalThis as any).__mockUseAllFinancialData = () => ({
      dbData: [],
      loading: false,
      error: null,
      refetch: () => {}
    });

    const html = renderToStaticMarkup(
      <EFOSPage 
        selectedClient="test-client" 
        selectedYear={2026} 
        profile="EXECUTIVE"
        showDebugTools={false}
      />
    );

    const cleanText = html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ');

    FORBIDDEN_TOKENS.forEach(token => {
      assert.ok(!cleanText.includes(token), `Page content should not contain forbidden token: ${token}`);
    });
  });

  test('Debug visibility respects ProductionVisibilityPolicy', () => {
    (globalThis as any).__mockUseInstitutionalAuth = () => ({
      session: {
        role: 'CFO',
        tenantId: 'T1',
        actorId: 'A1',
        sessionState: 'READY',
        availableTenants: []
      },
      loading: false,
      activateTenant: () => {},
      logout: async () => {},
      user: null
    });

    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    try {
      const html = renderToStaticMarkup(
        <EFOSPage 
          selectedClient="test-client" 
          selectedYear={2026} 
          profile="TECHNICAL"
          showDebugTools={true}
        />
      );
      
      const cleanText = html
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ');

      assert.ok(!cleanText.includes('Debug Mode'), 'Technical debug should be hidden in production even if flag is true');
    } finally {
      process.env.NODE_ENV = originalEnv;
    }
  });

  // Cleanup mocks
  test('Cleanup hooks', () => {
    delete (globalThis as any).__mockUseLanguage;
    delete (globalThis as any).__mockUseInstitutionalAuth;
    delete (globalThis as any).__mockUseAnnualFinancialData;
    delete (globalThis as any).__mockUseAllFinancialData;
  });
});
