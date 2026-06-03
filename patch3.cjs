const fs = require('fs');
let content = fs.readFileSync('src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts', 'utf8');
content = content.replace(
  /private static createFailedReport[\s\S]*?private static generateHash/g,
  "private static createFailedReport(reason: string): InstitutionalBoardPackOutput {\n    return {\n      status: 'FAILED',\n      metadata: {\n        boardPackLineageHash: 'FAILED',\n        reportGenerationTimestamp: new Date().toISOString(),\n        generatedAt: new Date().toISOString(),\n        runtimeVersion: '1.0.0',\n        contractVersion: '1.0',\n        tenantId: 'N/A',\n        cycleReference: 'N/A',\n        snapshotIntegrityStatus: 'COMPROMISED',\n        immutabilityStatus: 'MUTABLE',\n        runtimeSources: []\n      }\n    } as any;\n  }\n\n  private static generateHash"
);
fs.writeFileSync('src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts', content);
