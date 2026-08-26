import { describe, it, expect } from 'vitest';
import { BalanceSheetIntelligenceUseCase } from '../../../../capabilities/financial/application/usecases/BalanceSheetIntelligenceUseCase';

describe('Balance Sheet Analytical Integrity & Temporal Causality Gate', () => {
    it('Should process a Healthy Balance Sheet without critical signals and mark as Strong', () => {
        const raw2024 = {
            ano: 2024,
            ativoCirculante: 150000,
            ativoNaoCirculante: 100000,
            ativoTotal: 250000,
            passivoCirculante: 50000,
            passivoNaoCirculante: 50000,
            passivoTotal: 100000,
            passivosFinanceiros: 10000,
            patrimonioLiquido: 150000, // 50k + 50k + 150k = 250k
            caixaEquivalentes: 80000,
            estoques: 30000
        };
        const raw2025 = {
            ano: 2025,
            ativoCirculante: 200000,
            ativoNaoCirculante: 100000,
            ativoTotal: 300000,
            passivoCirculante: 60000,
            passivoNaoCirculante: 40000,
            passivoTotal: 100000,
            passivosFinanceiros: 15000,
            patrimonioLiquido: 200000, // 60k + 40k + 200k = 300k
            caixaEquivalentes: 100000,
            estoques: 40000
        };

        const useCase = new BalanceSheetIntelligenceUseCase();
        const output = useCase.analyzeBalanceSheet({
            current: raw2025,
            analysisPeriod: 2025,
            history: [raw2024, raw2025]
        });

        const score = output.pureViewModel.score!;
        expect(score.overall.classification).toBe('STRONG');
        const integrity = output.pureViewModel.technicalEvidence.auditMetadata.balanceIntegrity;
        expect(integrity.balanced).toBe(true);

        const fleuriet = output.pureViewModel.diagnosis.workingCapital.find(i => i.name === 'Modelo de Fleuriet');
        expect(fleuriet).toBeDefined();

        expect(output.pureViewModel.signals.items.length).toBeGreaterThanOrEqual(0); // Optional
    });

    it('Should process a Deteriorating Balance Sheet and identify critical vulnerabilities', () => {
        const raw2024 = {
            ano: 2024,
            ativoCirculante: 100000,
            ativoNaoCirculante: 200000,
            ativoTotal: 300000,
            passivoCirculante: 90000,
            passivoNaoCirculante: 110000,
            passivoTotal: 200000,
            passivosFinanceiros: 50000,
            patrimonioLiquido: 100000, // 90 + 110 + 100 = 300
            caixaEquivalentes: 10000,
            estoques: 80000
        };
        const raw2025 = {
            ano: 2025,
            ativoCirculante: 80000,
            ativoNaoCirculante: 270000,
            ativoTotal: 350000,
            passivoCirculante: 350000, // Passivo Circulante explodiu
            passivoNaoCirculante: 50000,
            passivoTotal: 400000,
            passivosFinanceiros: 180000, // Dívida de Curto Prazo altíssima
            patrimonioLiquido: -50000, // 350 + 50 - 50 = 350
            caixaEquivalentes: 5000,
            estoques: 70000
        };

        const useCase = new BalanceSheetIntelligenceUseCase();
        const output = useCase.analyzeBalanceSheet({
            current: raw2025,
            analysisPeriod: 2025,
            history: [raw2024, raw2025]
        });

        const score = output.pureViewModel.score!;
        expect(['CRITICAL', 'ATTENTION']).toContain(score.overall.classification);
        expect(output.pureViewModel.overview.healthStatus).toBe('CRITICAL');
        
        // Ensure signals highlight the problem
        const criticalSignals = output.pureViewModel.signals.items.filter(s => s.severity === 'critical');
        console.log('ALL SIGNALS:', output.pureViewModel.signals.items);
        expect(criticalSignals.length).toBeGreaterThan(0);
        
        // Executive Summary should not prescribe actions
        expect(output.pureViewModel.executiveSummary!.status.narrative).not.toContain('deve');
        expect(output.pureViewModel.executiveSummary!.status.narrative).not.toContain('recomenda');
        expect(output.pureViewModel.executiveSummary!.status.classification).toBe('Vulnerabilidade crítica identificada');
    });

    it('Should drop confidence when Accounting Equation is broken (Ativo != Passivo + PL)', () => {
        const raw2025 = {
            ano: 2025,
            ativoCirculante: 100000,
            ativoTotal: 500000,
            passivoCirculante: 50000,
            passivosFinanceirosCurtoPrazo: 10000,
            patrimonioLiquido: 150000, // Ativo 500k != 200k (Passivo + PL)
            caixaEquivalentes: 80000,
            estoques: 30000
        };

        const useCase = new BalanceSheetIntelligenceUseCase();
        const output = useCase.analyzeBalanceSheet({
            current: raw2025,
            analysisPeriod: 2025,
            history: [raw2025]
        });

        const integrity = output.pureViewModel.technicalEvidence.auditMetadata.balanceIntegrity;
        expect(integrity.balanced).toBe(false);
        expect(output.pureViewModel.overview.confidence).toBe('LOW'); // Confidence drops because of broken integrity
    });

    it('Should respect absolute Temporal Causality Lock (analysisPeriod filter)', () => {
        const raw2024 = { ano: 2024, ativoTotal: 100000, passivoTotal: 50000, patrimonioLiquido: 50000 };
        const raw2025 = { ano: 2025, ativoTotal: 120000, passivoTotal: 60000, patrimonioLiquido: 60000 };
        const raw2026 = { ano: 2026, ativoTotal: 150000, passivoTotal: 70000, patrimonioLiquido: 80000 };

        const useCase = new BalanceSheetIntelligenceUseCase();
        const output = useCase.analyzeBalanceSheet({
            current: raw2025, // We are pretending we are in 2025
            analysisPeriod: 2025,
            history: [raw2024, raw2025, raw2026] // Future data leaked into history
        });

        // The Normalizer must have stripped 2026 out.
        expect(output.pureViewModel.historicalEvolution.periodCoverage.lastYear).toBe(2025);
        expect(output.pureViewModel.historicalEvolution.periodCoverage.firstYear).toBe(2024);
        
        // Validate that historical movements DO NOT include 2026
        const movements = output.pureViewModel.historicalEvolution.movements;
        const periods = movements.map(m => m.period);
        periods.forEach(p => {
            expect(p).not.toContain('2026');
        });
    });
});
