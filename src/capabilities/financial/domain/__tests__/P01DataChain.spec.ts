import { describe, it, expect } from 'vitest';
import { financialAnalysisService } from '../../application/usecases/BalanceSheetIntelligenceUseCase';
import { FinancialPositionPureViewModelBuilder } from '../../application/consolidation/FinancialPositionPureViewModelBuilder';
import { BalanceSheetAnalysisInput } from '../../domain/models/BalanceSheetAnalysisInput';

describe('P0.1 - Data Chain Reconstruction (Forensic Proof)', () => {
  it('should prove that Asset Quality and Fleuriet metrics travel from Engine to ViewModel without semantic loss', () => {
    // 1. Arrange - A synthetic Balance Sheet to trigger all calculations
    const input: BalanceSheetAnalysisInput = {
      analysisPeriod: 2024,
      current: {
        ano: 2024,
        caixaEquivalentes: 50,
        clientes: 150,
        estoques: 100,
        ativoCirculante: 300,
        imobilizado: 200,
        ativoNaoCirculante: 200,
        ativoTotal: 500,
        
        fornecedores: 50,
        obrigacoesTrabalhistas: 20,
        tributos: 30,
        passivosFinanceiros: 100,
        passivoCirculante: 200,
        passivosFinanceirosNaoCirculante: 50,
        passivoNaoCirculante: 50,
        passivoTotal: 250,

        capitalSocial: 200,
        lucrosAcumulados: 50,
        patrimonioLiquido: 250,
        
        receitaLiquida: 1000
      },
      history: []
    };

    // 2. Act (Domain & Contract Layer) - Run through Use Case
    const contract = financialAnalysisService.analyzeBalanceSheet(input);

    // Assert Domain -> Contract preservation
    const assetQuality = contract.pureViewModel.diagnosis.assetQuality;
    const workingCapital = contract.pureViewModel.diagnosis.workingCapital;

    // Check Asset Quality
    expect(assetQuality.find(i => (i as any).id === 'cash_concentration' || i.code === 'cash_concentration')).toBeDefined();
    expect(assetQuality.find(i => (i as any).id === 'client_concentration' || i.code === 'client_concentration')).toBeDefined();
    expect(assetQuality.find(i => (i as any).id === 'inventory_concentration' || i.code === 'inventory_concentration')).toBeDefined();

    // Check Working Capital (Fleuriet)
    expect(workingCapital.find(i => (i as any).id === 'ncg' || i.code === 'ncg' || (i as any).id === 'working_capital_need')).toBeDefined();
    expect(workingCapital.find(i => (i as any).id === 'cgl' || i.code === 'cgl' || i.code === 'ccl')).toBeDefined();
    expect(workingCapital.find(i => (i as any).id === 'treasury' || i.code === 'treasury')).toBeDefined();

    // 3. Act (ViewModel Layer)
    const viewModel = contract.pureViewModel;

    // 4. Assert ViewModel formatting & availability
    const vmAssetQuality = viewModel.diagnosis.assetQuality;
    const vmWorkingCapital = viewModel.diagnosis.workingCapital;

    // Asset Quality formatting
    console.log("vmAssetQuality item 0:", vmAssetQuality[0]);
    const cashConc = vmAssetQuality.find(i => i.code === 'cash_concentration' || (i as any).id === 'cash_concentration');
    expect(cashConc).toBeDefined();
    expect(cashConc?.availability).toBe('AVAILABLE');
    expect(cashConc?.formattedValue).toContain('%'); // Ensures '0.1' becomes '10%' or similar

    // Fleuriet formatting
    const ncg = vmWorkingCapital.find(i => i.code === 'ncg');
    expect(ncg).toBeDefined();
    expect(ncg?.availability).toBe('AVAILABLE');
    expect(ncg?.formattedValue).toContain('R$'); // Ensures currency formatting

    const treasury = vmWorkingCapital.find(i => i.code === 'treasury');
    expect(treasury).toBeDefined();
    expect(treasury?.formattedValue).toContain('R$');

    // Expected values based on input:
    // AC Operacional (Recebíveis + Estoque) = 150 + 100 = 250
    // PC Operacional (Fornecedores + Trabalhistas + Impostos) = 50 + 20 + 30 = 100
    // NCG = 250 - 100 = 150
    //
    // CCL = PL + PNC - ANC = 250 + 50 - 200 = 100
    // 
    // Tesouraria = CCL - NCG = 100 - 150 = -50
    expect(ncg?.value).toBe(150);
    expect(vmWorkingCapital.find(i => i.code === 'cgl' || i.code === 'ccl')?.value).toBe(100);
    expect(treasury?.value).toBe(-50);
  });
});
