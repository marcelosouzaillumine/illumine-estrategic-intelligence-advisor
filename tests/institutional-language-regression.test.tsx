import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Setup Mock Browser Globals for Node.js compatibility BEFORE importing DFCPage
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
const { DFCPage } = await import('../src/components/pages/DFCPage');
const { FiduciaryRuntimeAdapter } = await import('../src/services/FiduciaryRuntimeAdapter');

// Setup Mock Environment
process.env.NODE_ENV = 'test'; // Ensure test environment throws ExecutiveLanguageViolationError

describe('Institutional Language Regression Tests (ELSF v1.0 Refinement)', () => {
  const mockClients = [{ id: 'C1', name: 'Cliente Teste' }];

  const mockRuntimeOutput = {
    tenantId: 'T1',
    entityScope: ['E1'],
    lineageHash: 'lineage123',
    correlationId: 'corr123',
    inferences: {
      dfc: {
        domain: 'Inteligência de Caixa (DFC)',
        metrics: {
          tableRows: [
            { conta: 'Recebimentos de Clientes', valor: 150000, val: 150000 },
            { conta: 'Pagamento de Fornecedores', valor: -80000, val: -80000 },
            { conta: 'Aporte de Capital', valor: 20000, val: 20000 }
          ],
          chartData: [],
          fco: 70000,
          fci: -10000,
          fcf: -30000,
          variacaoCaixa: 30000,
          reinvestmentCapacity: 50000,
          isGenerated: true,
          fiduciary: {
            runway: 12.5,
            tableRows: [
              { conta: 'Geração Operacional Real', valor: 70000, val: 70000 }
            ],
            cashBoardDecisionFramework: {
              isOperationSelfSustaining: 'A operação demonstra sustentabilidade financeira e independe de aportes externos para manutenção de suas atividades correntes.',
              cashGenerationAssessment: 'Geração operacional líquida positiva, refletindo conversão saudável de resultado econômico em liquidez.',
              primaryConstraint: 'Nenhum limitador crítico identificado no período sob análise.',
              runwayAssessment: 'Horizonte de sustentação financeira de longo prazo, superior aos patamares mínimos prudenciais.',
              shareholderDependency: 'Operação plenamente auto-sustentada, com dependência nula de capital de sócios.',
              boardOutlook: 'Expectativa de manutenção de liquidez e fortalecimento do capital de giro.',
              immediateAction: 'Seguir o plano estratégico e otimizar a estrutura de capital.'
            },
            earlyWarning: {
              alerts: [
                { metric: 'Horizonte de Caixa', status: 'NORMAL', value: 12.5, message: 'Horizonte saudável de caixa.' }
              ]
            },
            compressedAdvisory: {
              situacaoAtual: 'Geração de caixa saudável e horizonte confortável.',
              restricaoPrincipal: 'Nenhuma restrição de curto prazo identificada.',
              prioridadeEstrategica: 'Otimização das margens operacionais.',
              outlook: 'Expectativa favorável de geração econômica.'
            }
          },
          priorities: [
            { sourceModule: 'DFC', severity: 'NORMAL', rationale: 'Geração operacional saudável' }
          ],
          earlyWarnings: [
            { metric: 'Runway', status: 'NORMAL', message: 'Horizonte de caixa estável.' }
          ],
          eqeExplicability: {
            netIncome: 60000,
            adjustments: [],
            reconciledIncome: 60000
          },
          semanticDisplays: {
            executiveDisplay: {
              confidenceStatus: 'Confiança Elevada',
              cashStatus: 'Geração Saudável de Caixa'
            }
          }
        },
        semanticAudit: {
          canonicalRoot: 'ELSA',
          lifecycleStage: 'ESTABLISHED_ANALYSIS',
          lifecycleLabel: 'Análise Estabelecida'
        },
        semanticSource: 'ELSA'
      }
    }
  };

  test('1. Under BOARD profile, no raw technical leaks exist in the rendered output', () => {
    // Set up global mocks for DFCPage
    (globalThis as any).__mockUseLanguage = () => ({
      language: 'pt-BR',
      setLanguage: () => {},
      t: (key: string) => key,
      safeT: (key: string, fallback?: string) => fallback || key,
      translateLabel: (label: string) => label,
    });

    (globalThis as any).__mockUseInstitutionalAuth = () => ({
      session: {
        role: 'BOARD_MEMBER',
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

    (globalThis as any).__mockUseInstitutionalRuntime = () => ({
      runtimeOutput: mockRuntimeOutput,
      loading: false
    });

    // Render DFCPage under BOARD profile
    const html = renderToStaticMarkup(
      <DFCPage 
        clients={mockClients} 
        selectedClient="C1" 
        selectedYear={2026} 
      />
    );

    // Extract clean text
    const cleanText = html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ');

    // Forbidden tokens for visual regression (BOARD & EXECUTIVE)
    const forbidden = [
      'BOARD',
      'EXECUTIVE',
      'TECHNICAL',
      'EQE',
      'CDIL',
      'EFSI',
      'EFOS',
      'ENGINE',
      'RUNTIME',
      'MODULE'
    ];

    for (const token of forbidden) {
      const regex = new RegExp(`\\b${token}\\b`, 'i');
      const hasToken = regex.test(cleanText);
      if (hasToken) {
        throw new Error(`EXECUTIVE_LANGUAGE_LEAK: Technical token "${token}" leaked in BOARD rendering: "${cleanText}"`);
      }
    }

    // Assert that we successfully verified the cleanText does not contain any leak
    assert.ok(true, 'No technical leaks in BOARD profile rendering');
  });

  test('2. Under EXECUTIVE profile, no raw technical leaks exist in the rendered output', () => {
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

    // Render DFCPage under EXECUTIVE profile
    const html = renderToStaticMarkup(
      <DFCPage 
        clients={mockClients} 
        selectedClient="C1" 
        selectedYear={2026} 
      />
    );

    const cleanText = html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ');

    const forbidden = [
      'BOARD',
      'EXECUTIVE',
      'TECHNICAL',
      'EQE',
      'CDIL',
      'EFSI',
      'EFOS',
      'ENGINE',
      'RUNTIME',
      'MODULE'
    ];

    for (const token of forbidden) {
      const regex = new RegExp(`\\b${token}\\b`, 'i');
      const hasToken = regex.test(cleanText);
      if (hasToken) {
        throw new Error(`EXECUTIVE_LANGUAGE_LEAK: Technical token "${token}" leaked in EXECUTIVE rendering: "${cleanText}"`);
      }
    }

    assert.ok(true, 'No technical leaks in EXECUTIVE profile rendering');
  });

  test('3. Under TECHNICAL profile, technical terms are allowed in the rendered output', () => {
    (globalThis as any).__mockUseInstitutionalAuth = () => ({
      session: {
        role: 'CFO', // CFO defaults to EXECUTIVE but allowed to override/access TECHNICAL
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

    // We can directly verify the BoundaryGuard behavior on raw technical text under TECHNICAL profile
    const guard = FiduciaryRuntimeAdapter.ExecutiveLanguageBoundaryGuard;
    const result = guard.translate('Análise do motor EQE e CDIL para DFC', 'TECHNICAL');
    
    // In TECHNICAL profile, these should not throw and should output as-is or mapped
    assert.ok(result.includes('EQE') || result.includes('Avaliação de Sustentabilidade dos Resultados'));
    assert.ok(result.includes('CDIL') || result.includes('Inteligência Causal de Caixa'));
  });

  // Cleanup mocks
  test('Cleanup hooks', () => {
    delete (globalThis as any).__mockUseLanguage;
    delete (globalThis as any).__mockUseInstitutionalAuth;
    delete (globalThis as any).__mockUseAnnualFinancialData;
    delete (globalThis as any).__mockUseAllFinancialData;
    delete (globalThis as any).__mockUseInstitutionalRuntime;
  });
});
