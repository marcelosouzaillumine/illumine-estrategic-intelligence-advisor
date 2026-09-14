import { BalanceSheetIntelligenceUseCase } from './src/capabilities/financial/application/usecases/BalanceSheetIntelligenceUseCase';
import { GranatumDataset } from './src/capabilities/financial/domain/datasets/GranatumDataset';
import { FinancialPositionPureViewModelBuilder } from './src/core/experience/presentation/viewmodels/FinancialPositionPureViewModelBuilder';
import { PureViewModelTranslator } from './src/core/experience/presentation/viewmodels/PureViewModelTranslator';
import * as fs from 'fs';

async function runTrace() {
    const rawData = GranatumDataset.history; // This usually has 2021-2025
    
    const results: any = {};

    for (const yearData of rawData) {
        const year = yearData.ano;
        console.log(`\n--- TRACING YEAR ${year} ---`);
        const useCase = new BalanceSheetIntelligenceUseCase();
        const contract = useCase.analyzeBalanceSheet({
            current: yearData,
            history: rawData,
            analysisPeriod: year
        });

        const viewModel = PureViewModelTranslator.toFinancialPositionViewModel(contract);

        results[year] = {
            contract,
            viewModel
        };
    }
    
    fs.writeFileSync('trace_output.json', JSON.stringify(results, null, 2));
    console.log('\nFull trace written to trace_output.json');
}

runTrace().catch(console.error);
