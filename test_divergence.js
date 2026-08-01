"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DreIntelligenceValidator_ts_1 = require("./packages/intelligence/executive-intelligence-layer/src/integrity/rules/DreIntelligenceValidator.ts");
var CashIntelligenceValidator_ts_1 = require("./packages/intelligence/executive-intelligence-layer/src/integrity/rules/CashIntelligenceValidator.ts");
var BalanceSheetValidator_ts_1 = require("./packages/intelligence/executive-intelligence-layer/src/integrity/rules/BalanceSheetValidator.ts");
var ExecutiveNarrativeGate_ts_1 = require("./packages/intelligence/executive-intelligence-layer/src/narrative/ExecutiveNarrativeGate.ts");
function runTest(company, financialData, pastData) {
    console.log("\n=============================================");
    console.log("TESTING: ".concat(company));
    console.log("=============================================");
    var bs = BalanceSheetValidator_ts_1.BalanceSheetValidator.validate(financialData);
    var dre = DreIntelligenceValidator_ts_1.DreIntelligenceValidator.validate(financialData, pastData ? [pastData] : undefined);
    var cash = CashIntelligenceValidator_ts_1.CashIntelligenceValidator.validate(financialData);
    var assessment = {
        integrityStatus: bs.blockers.length > 0 ? 'WARNING' : 'PASSED',
        earningsQuality: dre.earningsQuality,
        cashConversion: cash,
        solvency: bs.solvency,
        executiveRiskLevel: 'MEDIUM'
    };
    var permission = ExecutiveNarrativeGate_ts_1.ExecutiveNarrativeGate.evaluatePermission(assessment);
    var narrative = ExecutiveNarrativeGate_ts_1.ExecutiveNarrativeGate.interceptNarrative("A empresa apresenta excelentes oportunidades de expansão operacional.", permission, assessment);
    console.log("Cash Conversion Status: ".concat(cash.status, " (Rate: ").concat((cash.conversionRate * 100).toFixed(1), "%)"));
    if (cash.alert)
        console.log(" - Cash Alert: ".concat(cash.alert));
    console.log("Earnings Quality Score: ".concat(dre.earningsQuality.score, " (").concat(dre.earningsQuality.classification, ")"));
    console.log(" - Drivers: ".concat(dre.earningsQuality.drivers.join(' | ')));
    console.log("Solvency Status: ".concat(bs.solvency.status));
    if (bs.solvency.alerts.length > 0)
        console.log(" - Solvency Alerts: ".concat(bs.solvency.alerts.join(' | ')));
    console.log("\nNARRATIVE PERMISSION: ".concat(permission));
    console.log("FINAL NARRATIVE: ".concat(narrative));
}
// Empório: EBITDA cresce, mas Caixa cai (Crescimento com retenção no capital de giro)
var emporioPast = { revenue: 10000000, ebitda: 1000000, operatingCashFlow: 800000, equity: 2000000 };
var emporio2025 = {
    assets: 5000000, liabilities: 2800000, equity: 2200000, // Balance
    currentAssets: 1500000, currentLiabilities: 1200000, // Working Capital = 300k
    revenue: 13000000, ebitda: 4200000, operatingCashFlow: 800000 // Conversion = ~19%
};
// Granatum: EBITDA cresce e Caixa acompanha perfeitamente (Expansão Sustentável)
var granatumPast = { revenue: 10000000, ebitda: 1000000, operatingCashFlow: 800000, equity: 2000000 };
var granatum2025 = {
    assets: 5000000, liabilities: 2000000, equity: 3000000, // Balance
    currentAssets: 2000000, currentLiabilities: 800000, // Working Capital = 1.2M
    revenue: 13000000, ebitda: 4200000, operatingCashFlow: 3500000 // Conversion = ~83%
};
runTest("EMPÓRIO DO MÁRMORE (2025)", emporio2025, emporioPast);
runTest("GRANATUM (2025)", granatum2025, granatumPast);
