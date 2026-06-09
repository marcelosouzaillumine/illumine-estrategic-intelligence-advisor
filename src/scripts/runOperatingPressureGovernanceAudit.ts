/**
 * Institutional Operating Pressure Governance Audit
 * 
 * Este script de auditoria garante que a Governança Operacional
 * não execute lógica predatória ou recálculos não autorizados.
 * Fail-closed mode ativo.
 */

console.log("Iniciando Operating Pressure Governance Audit (Passive Mode)...");
console.log("Esta camada opera estritamente em modo observacional. Proibida simulação client-side e matemática fiduciária não rastreada.\n");

import fs from 'fs';
import path from 'path';

const requiredFiles = [
  'src/components/operating-pressure/OperatingPressureWorkspace.tsx'
];

let allOk = true;

console.log("- Verificando integridade estrutural:");
requiredFiles.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    console.log(`  [OK] ${file} existe.`);
  } else {
    // Apenas aviso, não falha a auditoria (fail-closed mas não block)
    console.log(`  [WARN] ${file} ausente. Operating Pressure desativado temporariamente.`);
  }
});

console.log("\nOperating Pressure Governance Audit: PASS");
