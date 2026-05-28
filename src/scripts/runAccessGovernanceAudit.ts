import fs from 'fs';
import path from 'path';

function checkRoutingBypasses() {
  console.log('Iniciando Access Governance Audit (Routing Security)...');
  
  const routesPath = path.resolve(process.cwd(), 'src/app/routes.tsx');
  
  if (!fs.existsSync(routesPath)) {
    console.warn(`Arquivo de rotas não encontrado em: ${routesPath}. Pulando verificação.`);
    return;
  }
  
  const content = fs.readFileSync(routesPath, 'utf8');
  const lines = content.split('\n');
  
  // Patterns for insecure bypasses
  // || true, || true), ||true, && true, isAdmin || true
  const bypassRegex = /(\|\|\s*true|&&\s*true)/i;
  
  let hasViolation = false;
  
  lines.forEach((line, index) => {
    // Apenas verifica as linhas de condicional de rota
    if (line.includes('if (currentPage ===') && bypassRegex.test(line)) {
      console.error(`[CRITICAL] Falha de Governança de Acesso: Bypass detectado em routes.tsx linha ${index + 1}:`);
      console.error(`  > ${line.trim()}`);
      hasViolation = true;
    }
  });

  if (hasViolation) {
    console.error('\n[FATAL] O build foi bloqueado pela Master Governance Engine.');
    console.error('Motivo: Foram detectados overrides de segurança no roteamento (ex: isMaster || true).');
    console.error('Correção: Remova o bypass para garantir a integridade fiduciária e dualidade de acesso.');
    process.exit(1);
  }
  
  console.log('SUCCESS: Nenhuma violação de acesso (bypasses) detectada no roteamento.');
}

checkRoutingBypasses();
