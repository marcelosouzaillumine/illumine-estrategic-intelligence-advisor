const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/components/pages/BalanceSheetPage.tsx');
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("import { ExecutiveHeading }")) {
  content = content.replace(
    "import { ExecutiveSurface } from '../ui/executive-surface';",
    "import { ExecutiveSurface } from '../ui/executive-surface';\nimport { ExecutiveHeading } from '../ui/executive-heading';\nimport { ExecutiveText } from '../ui/executive-typography';"
  );
}

content = content.replace(
  '<h3 className="text-lg font-black text-primary mb-2">Processando Análise</h3>',
  '<ExecutiveHeading as="h3" variant="moduleTitle" className="mb-2 text-center">Processando Análise</ExecutiveHeading>'
);

content = content.replace(
  '<p className="text-sm text-secondary text-center max-w-md">Gerando',
  '<ExecutiveText as="p" variant="bodyStandard" className="text-center max-w-md">Gerando'
);

content = content.replace(
  '</p>\n        </div>',
  '</ExecutiveText>\n        </div>'
);

content = content.replace(
  `<h3 className="text-lg font-black text-primary group-open:text-primary">{ExecutiveLocaleEnforcer.normalize('Executive Financial Analytics')}</h3>`,
  `<ExecutiveHeading as="h3" variant="moduleTitle" className="group-open:text-primary">{ExecutiveLocaleEnforcer.normalize('Executive Financial Analytics')}</ExecutiveHeading>`
);

content = content.replace(
  '<h4 className="text-sm font-black text-primary mb-2">Análise Estrutural Detalhada</h4>',
  '<ExecutiveHeading as="h4" variant="submoduleTitle" className="mb-2">Análise Estrutural Detalhada</ExecutiveHeading>'
);

content = content.replace(
  '<p className="text-sm text-foreground/68 font-normal">',
  '<ExecutiveText as="p" variant="bodyStandard">'
);

content = content.replace(
  'Cálculos • Análise Horizontal e Vertical • Gráficos\n                  </p>',
  'Cálculos • Análise Horizontal e Vertical • Gráficos\n                  </ExecutiveText>'
);

content = content.replace(
  '<h3 className="text-xl font-black text-primary mb-2">Excluir Dados?</h3>',
  '<ExecutiveHeading as="h3" variant="moduleTitle" className="mb-2">Excluir Dados?</ExecutiveHeading>'
);

content = content.replace(
  '<p className="text-sm text-secondary mb-8 font-medium">',
  '<ExecutiveText as="p" variant="bodyStandard" className="mb-8">'
);

content = content.replace(
  'Esta ação não pode ser desfeita.\n            </p>',
  'Esta ação não pode ser desfeita.\n            </ExecutiveText>'
);

content = content.replace(
  'className="flex-1 py-3 text-sm font-bold text-muted-foreground hover:bg-surface-container/30 rounded-2xl transition-all"',
  'className="flex-1 py-3 hover:bg-surface-container/30 rounded-2xl transition-all"'
);
content = content.replace(
  '>\n                Cancelar\n              </button>',
  '>\n                <ExecutiveText as="span" variant="label">Cancelar</ExecutiveText>\n              </button>'
);

content = content.replace(
  'className="flex-1 py-3 bg-critical-soft0 text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-rose-500/20 hover:scale-105 transition-all"',
  'className="flex-1 py-3 bg-critical-soft0 text-white rounded-2xl shadow-lg shadow-rose-500/20 hover:scale-105 transition-all"'
);
content = content.replace(
  '>\n                {deleting ? \'Excluindo...\' : \'Sim, Excluir\'}\n              </button>',
  '>\n                <ExecutiveText as="span" variant="label" className="text-white">{deleting ? \'Excluindo...\' : \'Sim, Excluir\'}</ExecutiveText>\n              </button>'
);

content = content.replace(
  '<p className="text-xs font-black uppercase tracking-widest">{toast.message}</p>',
  '<ExecutiveText as="p" variant="microLabel" className="text-white">{toast.message}</ExecutiveText>'
);

fs.writeFileSync(file, content);
console.log('BalanceSheetPage patched');
