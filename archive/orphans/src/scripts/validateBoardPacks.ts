import fs from 'fs';
import path from 'path';
import { ExecutiveIntelligenceRuntime } from '../core/runtime/executive-intelligence-runtime';
import { InstitutionalBoardPackRuntime } from '../core/runtime/institutional-reporting/InstitutionalBoardPackRuntime';

// Scenarios
const scenarios = [
  { id: 'HEALTHY', name: 'Empresa Saudável', mock: { recLiquida: 1000000, ebitda: 250000, caixa: 500000, divida: 100000 } },
  { id: 'DISTRESS', name: 'Empresa em Distress', mock: { recLiquida: 500000, ebitda: -50000, caixa: 10000, divida: 800000 } },
  { id: 'TURNAROUND_ARTIFICIAL', name: 'Turnaround Artificial', mock: { recLiquida: 600000, ebitda: 50000, caixa: 20000, divida: 900000, capitalInjection: true } },
  { id: 'SUSTAINABLE_GROWTH', name: 'Crescimento Sustentável', mock: { recLiquida: 1500000, ebitda: 400000, caixa: 800000, divida: 50000 } },
  { id: 'QUARANTINE', name: 'Quarentena Contábil', mock: { recLiquida: 1000000, ebitda: 200000, caixa: 300000, divida: 200000, contabilidadeInconsistente: true } },
  { id: 'NO_HISTORY', name: 'Histórico Insuficiente', mock: { recLiquida: 1000000, ebitda: 250000, caixa: 500000, divida: 100000, semHistorico: true } }
];

async function run() {
  console.log('RC-1.13C: Starting Board Pack Scenario Validation...');
  const outDir = path.join(process.cwd(), 'board-pack-exports');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const scenario of scenarios) {
    console.log(`\nEvaluating Scenario: ${scenario.name} (${scenario.id})`);
    
    try {
      // Mock Context
      const ctx: any = {
        tenantId: `tenant-${scenario.id}`,
        operationalSegment: { code: 'TECH' },
        currentCycle: '2026-Q2',
        environment: 'PRODUCTION'
      };

      const rawData: any = {
        rawFinancialData: {
          recLiquida: scenario.mock.recLiquida,
          ebitda: scenario.mock.ebitda,
          caixa: scenario.mock.caixa,
          divida: scenario.mock.divida
        },
        bpData: [{ AtivoTotal: scenario.mock.caixa * 2, PassivoTotal: scenario.mock.divida }],
        dreData: [{ ReceitaLiquida: scenario.mock.recLiquida }],
        anosHistorico: scenario.mock.semHistorico ? 0 : 3
      };

      if (scenario.mock.contabilidadeInconsistente) {
        rawData.bpData[0].PassivoTotal = 0; // Trigger incoherence
      }

      // Execute Runtime
      const runtime = new ExecutiveIntelligenceRuntime();
      const executiveReport = await runtime.generateExecutiveReport(rawData);
      const boardPack = InstitutionalBoardPackRuntime.generate(executiveReport);

      const exportPath = path.join(outDir, `BoardPack_${scenario.id}.json`);
      fs.writeFileSync(exportPath, JSON.stringify(boardPack, null, 2));

      console.log(`✅ ${scenario.id}: Exported successfully to ${exportPath}`);
      console.log(`   - Status: ${boardPack.status}`);
      console.log(`   - Lineage Hash: ${boardPack.metadata.boardPackLineageHash}`);
      console.log(`   - Restrictions: ${boardPack.fiduciaryRestrictions.length}`);
      
      if (scenario.id === 'DISTRESS' && boardPack.executiveSnapshot.executiveSummary.includes('crescimento sustentável')) {
        console.error(`❌ Fiduciary Breach! Optimistic narrative found in DISTRESS.`);
      }

    } catch (e: any) {
      console.error(`❌ Failed scenario ${scenario.id}: ${e.message}`);
    }
  }

  console.log('\nValidation Complete.');
}

run();
