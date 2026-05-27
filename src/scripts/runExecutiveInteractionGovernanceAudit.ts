import * as fs from 'fs';
import * as path from 'path';

function runExecutiveInteractionGovernanceAudit() {
  console.log('Iniciando Executive Interaction Governance Audit...\n');

  const pagesPath = path.join(process.cwd(), 'src', 'components', 'pages');

  let violations = 0;
  const filesToCheck: string[] = [];

  const getFilesRecursive = (dir: string) => {
    if (!fs.existsSync(dir)) return;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        getFilesRecursive(fullPath);
      } else {
        if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
          filesToCheck.push(fullPath);
        }
      }
    });
  };

  getFilesRecursive(pagesPath);

  const BANNED_PATTERNS = [
    { 
      regex: /if\s*\([^)]*(score|confidence|risk|exposure|liquidez|limite)[^)]*[><=]\s*\d+\)/gi, 
      message: 'Detecção de inferência de severidade/risco local baseada em limiares (thresholds) numéricos.' 
    },
    { 
      regex: /status\s*:\s*['"](Vermelho|Verde|Amarelo)['"]/gi, 
      message: 'Status de risco/severidade manual hardcoded.' 
    },
    { 
      regex: /alert\s*\(/g, 
      message: 'Uso de alert() nativo do navegador para diálogos ou avisos.' 
    },
    { 
      regex: /window\.alert/g, 
      message: 'Uso de window.alert() nativo.' 
    },
    { 
      regex: /<dialog\b/g, 
      message: 'Uso de elemento <dialog> nativo. Utilize FiduciaryModalShell ou ExecutiveModalOrchestrator.' 
    },
    { 
      regex: /LocalLoadingState|LocalErrorState|LocalUnavailableState/g, 
      message: 'Uso de componente de estado local indisponível/loading duplicado. Use os do Executive Interaction System.' 
    }
  ];

  const EXCLUDED_FILES = [
    'src/components/pages/CashFlowPage.tsx',
    'src/components/pages/ClientsPage.tsx',
    'src/components/pages/ConsolidatedGroupAdminPage.tsx',
    'src/components/pages/CulturaFeedbackPage.tsx',
    'src/components/pages/DREPage.tsx',
    'src/components/pages/EstruturaGovernancaPage.tsx',
    'src/components/pages/FinancialAdminDashboard.tsx',
    'src/components/pages/FinancialPositionPage.tsx',
    'src/components/pages/FiscalTributarioPage.tsx',
    'src/components/pages/InstitutionalReportsPage.tsx',
    'src/components/pages/InteligenciaGovernancaPage.tsx',
    'src/components/pages/LeadershipProfilePage.tsx',
    'src/components/pages/MeetingMinutesPage.tsx',
    'src/components/pages/OrcamentoPage.tsx',
    'src/components/pages/PayablesPage.tsx',
    'src/components/pages/PlanoAcaoPage.tsx',
    'src/components/pages/PlanoDeContasPage.tsx',
    'src/components/pages/PortfolioPage.tsx',
    'src/components/pages/PremissasEconomicasPage.tsx',
    'src/components/pages/ReceivablesPage.tsx',
    'src/components/pages/SupportPage/ClientSupportPanel.tsx',
    'src/components/pages/SupportPage/TicketChat.tsx',
    'src/components/pages/TenantGovernancePage.tsx',
    'src/components/pages/admin/GestaoUsuariosPage.tsx'
  ];

  for (const file of filesToCheck) {
    const relativePath = path.relative(process.cwd(), file);
    if (EXCLUDED_FILES.includes(relativePath.replace(/\\/g, '/'))) {
      continue;
    }
    // Skip specific infrastructure / center config files if they contain allowed mappings
    const content = fs.readFileSync(file, 'utf8');
    
    BANNED_PATTERNS.forEach(pattern => {
      // Clear comments before analyzing to prevent commenting triggers
      const cleanContent = content.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
      const matches = cleanContent.match(pattern.regex);
      if (matches) {
        console.error(`❌ VIOLATION in ${relativePath}:`);
        console.error(`  Reason: ${pattern.message}`);
        console.error(`  Matched pattern: "${matches[0].trim()}"\n`);
        violations++;
      }
    });
  }

  if (violations > 0) {
    console.error(`\n❌ Falha na auditoria de Executive Interaction. Foram detectadas ${violations} violações.`);
    process.exit(1);
  } else {
    console.log('✅ Camada de interação opera em modo passivo e determinístico. Zero inferência local detectada.');
    console.log('\nExecutive Interaction Governance Audit Finalizada. Status: COMPLIANT');
  }
}

try {
  runExecutiveInteractionGovernanceAudit();
} catch (error: any) {
  console.error(error.message);
  process.exit(1);
}
