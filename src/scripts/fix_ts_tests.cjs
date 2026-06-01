const fs = require('fs');
const path = require('path');

const mockBaseStr = `
  runtimeMetadata: { generatedAt: new Date().toISOString(), runtimeVersion: '1.0', contractVersion: 'RC_1_13A', tenantId: 'test', cycleReference: '2026' },
  lineage: { lineageHash: 'MOCK_HASH' as any, parentHashes: [] },
  disclosures: [],
  compliance: { integrityStatus: 'INTACT', complianceStatus: 'COMPLIANT', complianceBlockers: [] },
  explainability: { structuralDrivers: [], propagationChains: [], evidence: [], confidenceDecomposition: {}, lineageReferences: [], level: 'DETERMINISTIC' },
`;

// Very basic helper for cash-intelligence test
const cashIntellTestPath = path.join(__dirname, '../tests/cash-intelligence/fiduciary-cash-intelligence.test.ts');
if (fs.existsSync(cashIntellTestPath)) {
  let content = fs.readFileSync(cashIntellTestPath, 'utf8');
  // the mock objects are usually returned or defined inside tests
  content = content.replace(/fiduciaryDisclosures: \[\],/g, `fiduciaryDisclosures: [],\n${mockBaseStr}`);
  // Also remove 'operationalSustainability' error
  content = content.replace(/result\.operationalSustainability/g, "result.distributionSustainability");
  fs.writeFileSync(cashIntellTestPath, content, 'utf8');
  console.log("Updated cash-intelligence test");
}
