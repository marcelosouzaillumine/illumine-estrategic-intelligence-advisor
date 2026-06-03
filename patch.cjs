const fs = require('fs');
let content = fs.readFileSync('src/core/runtime/executive-intelligence-runtime.ts', 'utf8');
content = content.replace(
  "    const totalDistributed = rawData.dlpaData ? rawData.dlpaData.reduce((acc: number, cur: any) => acc + (cur.distributedDividends || 0), 0) : 0;\n      modeloOperacional",
  "    const totalDistributed = rawData.dlpaData ? rawData.dlpaData.reduce((acc: number, cur: any) => acc + (cur.distributedDividends || 0), 0) : 0;\n    const contextAdapter = new (require('./shared/financial-runtime-context').FinancialRuntimeContextAdapter)();\n    const businessProfile: any = {\n      segmentoOperacional: rawData.rawFinancialData?.segmentoEmpresa || 'Default',\n      modeloOperacional"
);
fs.writeFileSync('src/core/runtime/executive-intelligence-runtime.ts', content);
