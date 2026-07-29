const { Project } = require('ts-morph');
const { analyzePage } = require('./src/scripts/executiveArchitectureScannerV2.cjs');
const project = new Project({ skipAddingFilesFromTsConfig: true });
project.addSourceFileAtPath('./src/components/pages/__tests__/eac-scanner-fixtures/analytical-perfect.tsx');
const res = analyzePage(project, './src/components/pages/__tests__/eac-scanner-fixtures/analytical-perfect.tsx', 'Executive Analytical Page');
console.log(JSON.stringify(res, null, 2));
