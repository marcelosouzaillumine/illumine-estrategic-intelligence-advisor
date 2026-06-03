import fs from 'fs';
import path from 'path';

export function scanForLegacyFormulas(): boolean {
  try {
    const filesToScan = [
      path.resolve(process.cwd(), 'src/components/pages/governance/CapitalGovernanceCenter.tsx'),
      path.resolve(process.cwd(), 'src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts')
    ];

    const forbidden = [
      'saldoInicialLucros',
      'lucrosAcumulados',
      'lucrosRetidos',
      'saldoInicialDLPA'
    ];

    for (const file of filesToScan) {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        for (const word of forbidden) {
          if (content.includes(word)) {
            return true;
          }
        }
      }
    }
  } catch (e) {
    // Silently ignore filesystem access issues in production/browser environments
  }
  return false;
}
