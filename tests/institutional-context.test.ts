import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { InstitutionalContextEngine } from '../src/core/runtime/institutional-context/InstitutionalContextEngine';
import { executiveRuntime } from '../src/core/runtime/executive-intelligence-runtime';
import { CalibrationEngine } from '../src/core/runtime/calibration/CalibrationEngine';

describe('Institutional Context Governance Layer', () => {
  beforeEach(() => {
    CalibrationEngine.resetToDefault();
  });

  it('1. Archetype: Startup (Early Stage / SaaS / Asset Light / Low Density)', () => {
    const rawData = {
      historicalCyclesCount: 2,
      rawFinancialData: {
        segmentoEmpresa: 'SaaS e Software de Gestão',
        bpSummary: {
          ativoTotal: 100000,
          ativoCirculante: 95000,
          ativoNaoCirculante: 5000,
          passivoTotal: 20000,
          passivoCirculante: 15000,
          passivoNaoCirculante: 5000,
          patrimonioLiquido: 80000,
          caixaEquivalentes: 85000,
          estoques: 0,
          clientes: 10000,
          fornecedores: 5000,
          passivosFinanceiros: 5000,
          capitalSocial: 120000,
          lucrosPrejuizos: -40000,
          isBalanced: true,
          divergence: 0
        },
        ebitda: -20000,
        lucroLiquido: -25000,
        prevPl: 50000,
        previousEbitda: -10000,
        previousCash: 30000
      },
      dreData: [
        { id: 'EBITDA', category: 'EBITDA', value: -20000 },
        { id: 'LUCRO_LÍQUIDO_DO_EXERCÍCIO', category: 'LUCRO LÍQUIDO DO EXERCÍCIO', value: -25000 }
      ]
    };

    const ctx = InstitutionalContextEngine.resolve(rawData);
    assert.equal(ctx.legacy?.businessStage, 'STRUCTURING_OPERATION');
    assert.equal(ctx.legacy?.economicModel, 'SAAS');
    assert.equal(ctx.legacy?.historicalDensity, 'LOW_HISTORICAL_DENSITY');
    assert.ok(ctx.legacy?.liabilityProfile.includes('FINANCIAL_DEBT'));
    assert.ok(ctx.legacy?.liabilityProfile.includes('OPERATIONAL_SUPPLIER_FINANCING'));
    assert.ok(ctx.legacy?.liabilityProfile.includes('OPERATIONAL_SUPPLIER_FINANCING'));
    assert.equal(ctx.confidence.strategicConfidence, 'LIMITED_CONTEXT');

    // Integridade do report
    const report = executiveRuntime.generateExecutiveReport(rawData);
    assert.strictEqual(report.context.stage, 'Operação em estruturação');
    assert.equal(report.context.businessModel, 'SaaS');
    assert.equal(report.institutionalContext.confidence.strategicConfidence, 'LIMITED_CONTEXT');
    assert.ok(report.compliance.narrativeRestrictions.some(r => r.includes('limitadas') || r.includes('reivindicar') || r.includes('condicional')));
  });

  it('2. Archetype: Indústria Pesada (Asset Heavy / Mature / Strong History)', () => {
    const rawData = {
      historicalCyclesCount: 5,
      rawFinancialData: {
        segmentoEmpresa: 'Indústria Metalúrgica de Grande Porte',
        bpSummary: {
          ativoTotal: 5000000,
          ativoCirculante: 2000000,
          ativoNaoCirculante: 3000000,
          passivoTotal: 1500000,
          passivoCirculante: 800000,
          passivoNaoCirculante: 700000,
          patrimonioLiquido: 3500000,
          caixaEquivalentes: 200000,
          estoques: 1200000,
          clientes: 600000,
          fornecedores: 400000,
          passivosFinanceiros: 500000,
          capitalSocial: 2000000,
          lucrosPrejuizos: 1500000,
          isBalanced: true,
          divergence: 0
        },
        ebitda: 800000,
        lucroLiquido: 500000,
        prevPl: 3200000,
        previousEbitda: 750000,
        previousCash: 150000
      },
      dreData: [
        { id: 'EBITDA', category: 'EBITDA', value: 800000 },
        { id: 'LUCRO_LÍQUIDO_DO_EXERCÍCIO', category: 'LUCRO LÍQUIDO DO EXERCÍCIO', value: 500000 }
      ]
    };

    const ctx = InstitutionalContextEngine.resolve(rawData);
    assert.equal(ctx.legacy?.businessStage, 'MATURE_OPERATION');
    assert.equal(ctx.legacy?.economicModel, 'INDUSTRIAL');
    assert.equal(ctx.legacy?.historicalDensity, 'STRONG_HISTORICAL_BASE');
    assert.ok(ctx.legacy?.liabilityProfile.includes('SHAREHOLDER_FUNDING'));
    assert.ok(ctx.legacy?.liabilityProfile.includes('SHAREHOLDER_FUNDING'));
    assert.equal(ctx.confidence.strategicConfidence, 'HIGH');

    const report = executiveRuntime.generateExecutiveReport(rawData);
    assert.equal(report.context.stage, 'Operação madura');
    assert.equal(report.context.businessModel, 'Industrial');
  });

  it('3. Archetype: Hospital (Healthcare / Scale / Asset Heavy / Low Inventory)', () => {
    const rawData = {
      historicalCyclesCount: 4,
      rawFinancialData: {
        segmentoEmpresa: 'Hospital e Maternidade das Américas',
        bpSummary: {
          ativoTotal: 3000000,
          ativoCirculante: 800000,
          ativoNaoCirculante: 2200000,
          passivoTotal: 1200000,
          passivoCirculante: 600000,
          passivoNaoCirculante: 600000,
          patrimonioLiquido: 1800000,
          caixaEquivalentes: 300000,
          estoques: 100000,
          clientes: 400000,
          fornecedores: 150000,
          passivosFinanceiros: 400000,
          capitalSocial: 1000000,
          lucrosPrejuizos: 800000,
          isBalanced: true,
          divergence: 0
        },
        ebitda: 450000,
        lucroLiquido: 300000,
        prevPl: 1500000,
        previousEbitda: 400000,
        previousCash: 250000
      },
      dreData: [
        { id: 'EBITDA', category: 'EBITDA', value: 450000 },
        { id: 'LUCRO_LÍQUIDO_DO_EXERCÍCIO', category: 'LUCRO LÍQUIDO DO EXERCÍCIO', value: 300000 }
      ]
    };

    const ctx = InstitutionalContextEngine.resolve(rawData);
    assert.equal(ctx.legacy?.businessStage, 'MATURE_OPERATION');
    assert.equal(ctx.legacy?.economicModel, 'HEALTHCARE');
  });

  it('4. Archetype: Holding Structure', () => {
    const rawData = {
      historicalCyclesCount: 5,
      rawFinancialData: {
        segmentoEmpresa: 'Holding e Participações Societárias',
        bpSummary: {
          ativoTotal: 10000000,
          ativoCirculante: 1000000,
          ativoNaoCirculante: 9000000,
          passivoTotal: 1000000,
          passivoCirculante: 200000,
          passivoNaoCirculante: 800000,
          patrimonioLiquido: 9000000,
          caixaEquivalentes: 800000,
          estoques: 0,
          clientes: 200000,
          fornecedores: 0,
          passivosFinanceiros: 500000,
          capitalSocial: 8000000,
          lucrosPrejuizos: 1000000,
          isBalanced: true,
          divergence: 0
        }
      }
    };

    const ctx = InstitutionalContextEngine.resolve(rawData);
    assert.equal(ctx.legacy?.economicModel, 'HOLDING_STRUCTURE');
  });

  it('5. Archetype: Turnaround / Distress (Insolvent / Heavy Debt)', () => {
    const rawData = {
      historicalCyclesCount: 3,
      rawFinancialData: {
        segmentoEmpresa: 'Comércio Varejista S.A.',
        bpSummary: {
          ativoTotal: 1000000,
          ativoCirculante: 400000,
          ativoNaoCirculante: 600000,
          passivoTotal: 1500000,
          passivoCirculante: 1100000,
          passivoNaoCirculante: 400000,
          patrimonioLiquido: -500000,
          caixaEquivalentes: 10000,
          estoques: 250000,
          clientes: 140000,
          fornecedores: 350000,
          passivosFinanceiros: 600000,
          capitalSocial: 500000,
          lucrosPrejuizos: -1000000,
          isBalanced: true,
          divergence: 0
        },
        ebitda: -150000,
        lucroLiquido: -300000,
        prevPl: -200000,
        previousEbitda: -80000,
        previousCash: 50000
      },
      dreData: [
        { id: 'EBITDA', category: 'EBITDA', value: -150000 },
        { id: 'LUCRO_LÍQUIDO_DO_EXERCÍCIO', category: 'LUCRO LÍQUIDO DO EXERCÍCIO', value: -300000 }
      ]
    };

    const ctx = InstitutionalContextEngine.resolve(rawData);
    assert.equal(ctx.legacy?.businessStage, 'RESTRUCTURING_OPERATION');
    assert.ok(ctx.legacy?.liabilityProfile.includes('FINANCIAL_DEBT'));
    assert.ok(ctx.recommendationBoundaries.blockedRecommendations.includes('Expansão física ou Capex imobiliário'));
  });

  it('6. Archetype: First Operational Year (Single Year Only)', () => {
    const rawData = {
      historicalCyclesCount: 1,
      rawFinancialData: {
        segmentoEmpresa: 'Serviços de Tecnologia',
        bpSummary: {
          ativoTotal: 100000,
          ativoCirculante: 90000,
          ativoNaoCirculante: 10000,
          passivoTotal: 30000,
          passivoCirculante: 25000,
          passivoNaoCirculante: 5000,
          patrimonioLiquido: 70000,
          caixaEquivalentes: 60000,
          estoques: 0,
          clientes: 30000,
          fornecedores: 10000,
          passivosFinanceiros: 10000,
          capitalSocial: 70000,
          lucrosPrejuizos: 0,
          isBalanced: true,
          divergence: 0
        }
      },
      dreData: [
        { id: 'EBITDA', category: 'EBITDA', value: 10000 }
      ]
    };

    const ctx = InstitutionalContextEngine.resolve(rawData);
    assert.equal(ctx.legacy?.businessStage, 'INITIAL_OPERATION');
    assert.equal(ctx.legacy?.historicalDensity, 'SINGLE_YEAR_ONLY');
    assert.equal(ctx.confidence.strategicConfidence, 'LIMITED_CONTEXT');
    assert.ok(ctx.recommendationBoundaries.blockedRecommendations.includes('Distribuição de lucros ou dividendos'));
  });

  it('7. Archetype: Asset Light (Service-Based)', () => {
    const rawData = {
      historicalCyclesCount: 4,
      rawFinancialData: {
        segmentoEmpresa: 'Consultoria Financeira Integrada',
        bpSummary: {
          ativoTotal: 200000,
          ativoCirculante: 190000,
          ativoNaoCirculante: 10000,
          passivoTotal: 50000,
          passivoCirculante: 40000,
          passivoNaoCirculante: 10000,
          patrimonioLiquido: 150000,
          caixaEquivalentes: 120000,
          estoques: 0,
          clientes: 70000,
          fornecedores: 15000,
          passivosFinanceiros: 10000,
          capitalSocial: 100000,
          lucrosPrejuizos: 50000,
          isBalanced: true,
          divergence: 0
        }
      }
    };

    const ctx = InstitutionalContextEngine.resolve(rawData);
    assert.equal(ctx.legacy?.economicModel, 'ASSET_LIGHT');
  });

  it('8. Archetype: Debt-Financed Growth', () => {
    const rawData = {
      historicalCyclesCount: 3,
      rawFinancialData: {
        segmentoEmpresa: 'Comércio de Alimentos',
        bpSummary: {
          ativoTotal: 2000000,
          ativoCirculante: 1500000,
          ativoNaoCirculante: 500000,
          passivoTotal: 1200000,
          passivoCirculante: 800000,
          passivoNaoCirculante: 400000,
          patrimonioLiquido: 800000,
          caixaEquivalentes: 200000,
          estoques: 800000,
          clientes: 500000,
          fornecedores: 300000,
          passivosFinanceiros: 700000,
          capitalSocial: 300000,
          lucrosPrejuizos: 500000,
          isBalanced: true,
          divergence: 0
        },
        ebitda: 100000,
        lucroLiquido: 50000,
        prevPl: 400000,
        previousEbitda: 90000,
        previousCash: 180000,
        previousDebt: 200000
      },
      dreData: [
        { id: 'EBITDA', category: 'EBITDA', value: 100000 },
        { id: 'LUCRO_LÍQUIDO_DO_EXERCÍCIO', category: 'LUCRO LÍQUIDO DO EXERCÍCIO', value: 50000 }
      ]
    };

    const ctx = InstitutionalContextEngine.resolve(rawData);
    assert.equal(ctx.growthPattern, 'DEBT_FINANCED_GROWTH');
  });

  it('9. Archetype: Shareholder-Financed Growth', () => {
    const rawData = {
      historicalCyclesCount: 3,
      rawFinancialData: {
        segmentoEmpresa: 'Pesquisa e Desenvolvimento Científico',
        bpSummary: {
          ativoTotal: 2000000,
          ativoCirculante: 1800000,
          ativoNaoCirculante: 200000,
          passivoTotal: 300000,
          passivoCirculante: 200000,
          passivoNaoCirculante: 100000,
          patrimonioLiquido: 1700000,
          caixaEquivalentes: 1400000,
          estoques: 0,
          clientes: 400000,
          fornecedores: 50000,
          passivosFinanceiros: 50000,
          capitalSocial: 2500000,
          lucrosPrejuizos: -800000,
          isBalanced: true,
          divergence: 0
        },
        ebitda: -100000,
        lucroLiquido: -120000,
        prevPl: 1000000,
        previousEbitda: -90000,
        previousCash: 800000,
        previousCapitalSocial: 1500000
      },
      dreData: [
        { id: 'EBITDA', category: 'EBITDA', value: -100000 },
        { id: 'LUCRO_LÍQUIDO_DO_EXERCÍCIO', category: 'LUCRO LÍQUIDO DO EXERCÍCIO', value: -120000 }
      ]
    };

    const ctx = InstitutionalContextEngine.resolve(rawData);
    assert.equal(ctx.growthPattern, 'SHAREHOLDER_FINANCED_GROWTH');
  });

  it('10. Archetype: Cashless Growth (Receivables/Inventory growth, cash reduction)', () => {
    const rawData = {
      historicalCyclesCount: 3,
      rawFinancialData: {
        segmentoEmpresa: 'Indústria Têxtil',
        bpSummary: {
          ativoTotal: 1500000,
          ativoCirculante: 1100000,
          ativoNaoCirculante: 400000,
          passivoTotal: 500000,
          passivoCirculante: 300000,
          passivoNaoCirculante: 200000,
          patrimonioLiquido: 1000000,
          caixaEquivalentes: 50000,
          estoques: 600000,
          clientes: 450000,
          fornecedores: 150000,
          passivosFinanceiros: 150000,
          capitalSocial: 600000,
          lucrosPrejuizos: 400000,
          isBalanced: true,
          divergence: 0
        },
        ebitda: 200000,
        lucroLiquido: 150000,
        prevPl: 800000,
        previousEbitda: 180000,
        previousCash: 200000
      },
      dreData: [
        { id: 'EBITDA', category: 'EBITDA', value: 200000 },
        { id: 'LUCRO_LÍQUIDO_DO_EXERCÍCIO', category: 'LUCRO LÍQUIDO DO EXERCÍCIO', value: 150000 }
      ]
    };

    const ctx = InstitutionalContextEngine.resolve(rawData);
    assert.equal(ctx.growthPattern, 'CASHLESS_GROWTH');
  });

  it('11. Archetype: Healthy Growth (Ebitda growth + cash growth)', () => {
    const rawData = {
      historicalCyclesCount: 4,
      rawFinancialData: {
        segmentoEmpresa: 'SaaS de Marketing B2B',
        bpSummary: {
          ativoTotal: 1000000,
          ativoCirculante: 900000,
          ativoNaoCirculante: 100000,
          passivoTotal: 200000,
          passivoCirculante: 150000,
          passivoNaoCirculante: 50000,
          patrimonioLiquido: 800000,
          caixaEquivalentes: 750000,
          estoques: 0,
          clientes: 150000,
          fornecedores: 30000,
          passivosFinanceiros: 50000,
          capitalSocial: 400000,
          lucrosPrejuizos: 400000,
          isBalanced: true,
          divergence: 0
        },
        ebitda: 350000,
        lucroLiquido: 280000,
        prevPl: 600000,
        previousEbitda: 250000,
        previousCash: 500000
      },
      dreData: [
        { id: 'EBITDA', category: 'EBITDA', value: 350000 },
        { id: 'LUCRO_LÍQUIDO_DO_EXERCÍCIO', category: 'LUCRO LÍQUIDO DO EXERCÍCIO', value: 280000 }
      ]
    };

    const ctx = InstitutionalContextEngine.resolve(rawData);
    assert.equal(ctx.growthPattern, 'HEALTHY_GROWTH');
  });

  it('12. Archetype: Data Integrity Fault (Low Data Confidence)', () => {
    const rawData = {
      historicalCyclesCount: 3,
      rawFinancialData: {
        segmentoEmpresa: 'Varejo de Vestuário',
        bpSummary: {
          ativoTotal: 1000000,
          ativoCirculante: 800000,
          ativoNaoCirculante: 200000,
          passivoTotal: 600000,
          passivoCirculante: 400000,
          passivoNaoCirculante: 200000,
          patrimonioLiquido: 350000, // 800k + 200k = 1M Ativo | 400k + 200k + 350k = 950k Passivo+PL
          caixaEquivalentes: 200000,
          estoques: 400000,
          clientes: 200000,
          fornecedores: 150000,
          passivosFinanceiros: 100000,
          isBalanced: false, // BP Desbalanceado
          divergence: 50000
        }
      }
    };

    const ctx = InstitutionalContextEngine.resolve(rawData);
    assert.equal(ctx.confidence.dataConfidence, 'LOW');
    assert.equal(ctx.confidence.strategicConfidence, 'UNVERIFIABLE');
    assert.ok(ctx.confidence.reasons.some(r => r.includes('desbalanceado')));
  });

  it('13. Teste de Não-Bypass: Deve abortar a execução se o perfil institucional for inválido ou ausente', () => {
    assert.throws(() => {
      executiveRuntime.generateExecutiveReport(null as any);
    }, (err: any) => {
      return err instanceof Error && err.message.includes('VIOLAÇÃO DE GOVERNAÇA NÚCLEO');
    });

    assert.throws(() => {
      executiveRuntime.generateExecutiveReport({} as any);
    }, (err: any) => {
      return err instanceof Error && err.message.includes('VIOLAÇÃO DE GOVERNAÇA NÚCLEO');
    });
  });

});
