import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function
function replaceInFile(relativePath, replacements) {
  const filePath = path.join(__dirname, relativePath);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  for (const [target, replacement] of replacements) {
    if (content.includes(target)) {
      content = content.replace(target, replacement);
    } else {
      console.warn(`Target not found in ${relativePath}:\n${target}`);
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${relativePath}`);
  } else {
    console.log(`No changes made to ${relativePath}`);
  }
}

// 1. BalanceSheetPage.tsx
replaceInFile('src/components/pages/BalanceSheetPage.tsx', [
  [
    "import { ExecutiveSurface } from '../ui/executive-surface';",
    "import { ExecutiveSurface } from '../ui/executive-surface';\nimport { ExecutiveHeading } from '../ui/executive-heading';\nimport { ExecutiveText } from '../ui/executive-typography';"
  ],
  [
    '<h3 className="text-lg font-black text-primary mb-2">Processando Análise</h3>',
    '<ExecutiveHeading as="h3" variant="moduleTitle" className="mb-2 text-center">Processando Análise</ExecutiveHeading>'
  ],
  [
    '<p className="text-sm text-secondary text-center max-w-md">Gerando inteligência patrimonial e parecer estratégico fiduciário para o exercício de {filterYear}...</p>',
    '<ExecutiveText as="p" variant="bodyStandard" className="text-center max-w-md">Gerando inteligência patrimonial e parecer estratégico fiduciário para o exercício de {filterYear}...</ExecutiveText>'
  ],
  [
    `<h3 className="text-lg font-black text-primary group-open:text-primary">{ExecutiveLocaleEnforcer.normalize('Executive Financial Analytics')}</h3>`,
    `<ExecutiveHeading as="h3" variant="moduleTitle" className="group-open:text-primary">{ExecutiveLocaleEnforcer.normalize('Executive Financial Analytics')}</ExecutiveHeading>`
  ],
  [
    '<h4 className="text-sm font-black text-primary mb-2">Análise Estrutural Detalhada</h4>\n                  <p className="text-sm text-foreground/68 font-normal">\n                    Cálculos • Análise Horizontal e Vertical • Gráficos\n                  </p>',
    '<ExecutiveHeading as="h4" variant="submoduleTitle" className="mb-2">Análise Estrutural Detalhada</ExecutiveHeading>\n                  <ExecutiveText as="p" variant="bodyStandard">\n                    Cálculos • Análise Horizontal e Vertical • Gráficos\n                  </ExecutiveText>'
  ],
  [
    '<h3 className="text-xl font-black text-primary mb-2">Excluir Dados?</h3>\n            <p className="text-sm text-secondary mb-8 font-medium">\n              Esta ação removerá todos os registros do Balanço Patrimonial para o ano <strong>{filterYear}</strong> deste cliente. Esta ação não pode ser desfeita.\n            </p>',
    '<ExecutiveHeading as="h3" variant="moduleTitle" className="mb-2">Excluir Dados?</ExecutiveHeading>\n            <ExecutiveText as="p" variant="bodyStandard" className="mb-8">\n              Esta ação removerá todos os registros do Balanço Patrimonial para o ano <strong>{filterYear}</strong> deste cliente. Esta ação não pode ser desfeita.\n            </ExecutiveText>'
  ],
  [
    'className="flex-1 py-3 text-sm font-bold text-muted-foreground hover:bg-surface-container/30 rounded-2xl transition-all"\n              >\n                Cancelar\n              </button>',
    'className="flex-1 py-3 hover:bg-surface-container/30 rounded-2xl transition-all"\n              >\n                <ExecutiveText as="span" variant="label">Cancelar</ExecutiveText>\n              </button>'
  ],
  [
    'className="flex-1 py-3 bg-critical-soft0 text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-rose-500/20 hover:scale-105 transition-all"\n              >\n                {deleting ? \'Excluindo...\' : \'Sim, Excluir\'}\n              </button>',
    'className="flex-1 py-3 bg-critical-soft0 text-white rounded-2xl shadow-lg shadow-rose-500/20 hover:scale-105 transition-all"\n              >\n                <ExecutiveText as="span" variant="label" className="text-white">{deleting ? \'Excluindo...\' : \'Sim, Excluir\'}</ExecutiveText>\n              </button>'
  ],
  [
    '<p className="text-xs font-black uppercase tracking-widest">{toast.message}</p>',
    '<ExecutiveText as="p" variant="microLabel" className="text-white">{toast.message}</ExecutiveText>'
  ]
]);

// 2. BalanceSheetActionToolbar.tsx
replaceInFile('src/components/pages/balance-sheet/BalanceSheetActionToolbar.tsx', [
  [
    "import { ExecutiveSurface } from '../../ui/executive-surface';",
    "import { ExecutiveSurface } from '../../ui/executive-surface';\nimport { ExecutiveText } from '../../ui/executive-typography';"
  ],
  [
    'className="px-3 py-1.5 h-8 bg-success-soft hover:bg-success text-success hover:text-white border border-success/20 rounded-md text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"\n      >\n        <Plus size={14} /> Lançar Dados\n      </button>',
    'className="px-3 py-1.5 h-8 bg-success-soft hover:bg-success text-success hover:text-white border border-success/20 rounded-md transition-all flex items-center gap-2 shadow-sm"\n      >\n        <ExecutiveText as="span" variant="microLabel" className="text-inherit flex items-center gap-2"><Plus size={14} /> Lançar Dados</ExecutiveText>\n      </button>'
  ],
  [
    'className="px-3 py-1.5 h-8 bg-secondary/10 hover:bg-secondary text-secondary hover:text-white border border-secondary/20 rounded-md text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"\n      >\n        <Upload size={14} /> Importar\n      </button>',
    'className="px-3 py-1.5 h-8 bg-secondary/10 hover:bg-secondary text-secondary hover:text-white border border-secondary/20 rounded-md transition-all flex items-center gap-2 shadow-sm"\n      >\n        <ExecutiveText as="span" variant="microLabel" className="text-inherit flex items-center gap-2"><Upload size={14} /> Importar</ExecutiveText>\n      </button>'
  ],
  [
    'className="px-3 py-1.5 h-8 bg-critical-soft hover:bg-destructive text-destructive hover:text-white border border-destructive/20 rounded-md text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"\n      >\n        <Trash2 size={14} /> Excluir\n      </button>',
    'className="px-3 py-1.5 h-8 bg-critical-soft hover:bg-destructive text-destructive hover:text-white border border-destructive/20 rounded-md transition-all flex items-center gap-2 shadow-sm"\n      >\n        <ExecutiveText as="span" variant="microLabel" className="text-inherit flex items-center gap-2"><Trash2 size={14} /> Excluir</ExecutiveText>\n      </button>'
  ]
]);

// 3. BalanceSheetAssetQualitySection.tsx
replaceInFile('src/components/pages/balance-sheet/BalanceSheetAssetQualitySection.tsx', [
  [
    "import { ExecutiveMetricCard } from '../../ui/executive-metric-card';",
    "import { ExecutiveMetricCard } from '../../ui/executive-metric-card';\nimport { ExecutiveHeading } from '../../ui/executive-heading';"
  ],
  [
    '<h3 className="text-xl md:text-[22px] font-semibold text-foreground mb-6">Qualidade do Ativo</h3>',
    '<ExecutiveHeading as="h3" variant="moduleTitle" className="mb-6">Qualidade do Ativo</ExecutiveHeading>'
  ]
]);

// 4. BalanceSheetAuditLayerSection.tsx
replaceInFile('src/components/pages/balance-sheet/BalanceSheetAuditLayerSection.tsx', [
  [
    "import { ExecutiveRestrictionRow } from '../../ui/executive-restriction-row';",
    "import { ExecutiveRestrictionRow } from '../../ui/executive-restriction-row';\nimport { ExecutiveHeading } from '../../ui/executive-heading';\nimport { ExecutiveText } from '../../ui/executive-typography';"
  ],
  [
    '<h3 className="text-lg font-black text-primary group-open:text-primary">Restrições Fiduciárias Ativas</h3>',
    '<ExecutiveHeading as="h3" variant="moduleTitle" className="group-open:text-primary">Restrições Fiduciárias Ativas</ExecutiveHeading>'
  ],
  [
    '<h4 className="text-sm font-black text-primary mb-4 border-b border-border pb-2">Restrições Estruturais e Tetos de Classificação</h4>',
    '<ExecutiveHeading as="h4" variant="submoduleTitle" className="mb-4 border-b border-border pb-2">Restrições Estruturais e Tetos de Classificação</ExecutiveHeading>'
  ],
  [
    '<span className="text-[10px] font-medium text-foreground/50 mb-1">Score Original</span>\n                  <span className="text-[14px] font-semibold text-foreground/70">{viewModel.structuralRestrictions.originalClassificationLabel}</span>',
    '<ExecutiveText as="span" variant="caption" className="text-foreground/50 mb-1">Score Original</ExecutiveText>\n                  <ExecutiveText as="span" variant="bodyStandard" className="font-semibold text-foreground/70">{viewModel.structuralRestrictions.originalClassificationLabel}</ExecutiveText>'
  ],
  [
    '<span className="text-[9px] font-medium text-foreground/40 mb-1 uppercase tracking-widest">Teto Aplicado</span>\n                  <div className="w-full flex items-center">\n                    <div className="h-px bg-border/60 flex-1"></div>\n                    <div className="text-border/60 ml-1 text-[10px]">▶</div>\n                  </div>',
    '<ExecutiveText as="span" variant="microLabel" className="text-foreground/40 mb-1">Teto Aplicado</ExecutiveText>\n                  <div className="w-full flex items-center">\n                    <div className="h-px bg-border/60 flex-1"></div>\n                    <ExecutiveText as="div" variant="caption" className="text-border/60 ml-1">▶</ExecutiveText>\n                  </div>'
  ],
  [
    '<span className="text-[10px] font-medium text-foreground/50 mb-1">Resultado Final</span>\n                  <span className="text-[14px] font-bold text-foreground">{viewModel.structuralRestrictions.classificationCeilingLabel}</span>',
    '<ExecutiveText as="span" variant="caption" className="text-foreground/50 mb-1">Resultado Final</ExecutiveText>\n                  <ExecutiveText as="span" variant="bodyStandard" className="font-bold">{viewModel.structuralRestrictions.classificationCeilingLabel}</ExecutiveText>'
  ],
  [
    '<h4 className="text-sm font-black text-primary">Validação de Consistência Institucional</h4>',
    '<ExecutiveHeading as="h4" variant="submoduleTitle">Validação de Consistência Institucional</ExecutiveHeading>'
  ],
  [
    '<span className="text-[11px] font-medium text-foreground/65">Status</span>\n                <span className={cn(\n                  "px-2 py-0.5 rounded-sm border text-[11px] font-medium",',
    '<ExecutiveText as="span" variant="caption" className="text-foreground/65">Status</ExecutiveText>\n                <ExecutiveText as="span" variant="caption" className={cn(\n                  "px-2 py-0.5 rounded-sm border",'
  ],
  [
    '{viewModel.governanceConsistency.statusLabel}\n                </span>',
    '{viewModel.governanceConsistency.statusLabel}\n                </ExecutiveText>'
  ]
]);

// 5. BalanceSheetCapitalPreservationSection.tsx
replaceInFile('src/components/pages/balance-sheet/BalanceSheetCapitalPreservationSection.tsx', [
  [
    "import { ExecutiveLabelResolver } from '../../../services/FiduciaryRuntimeAdapter';",
    "import { ExecutiveLabelResolver } from '../../../services/FiduciaryRuntimeAdapter';\nimport { ExecutiveHeading } from '../../ui/executive-heading';\nimport { ExecutiveText } from '../../ui/executive-typography';"
  ],
  [
    '<h3 className="text-xl md:text-[22px] font-semibold text-foreground mb-6">Preservação de Capital</h3>',
    '<ExecutiveHeading as="h3" variant="moduleTitle" className="mb-6">Preservação de Capital</ExecutiveHeading>'
  ],
  [
    '<span className="text-[11px] font-semibold text-foreground/50 leading-none mt-1">\n                      {new Intl.NumberFormat(\'pt-BR\', { style: \'currency\', currency: \'BRL\' }).format(ind.evidence.capitalConsumedAmount)}\n                    </span>',
    '<ExecutiveText as="span" variant="caption" className="mt-1">\n                      {new Intl.NumberFormat(\'pt-BR\', { style: \'currency\', currency: \'BRL\' }).format(ind.evidence.capitalConsumedAmount)}\n                    </ExecutiveText>'
  ]
]);

// 6. BalanceSheetCapitalStructureSection.tsx
replaceInFile('src/components/pages/balance-sheet/BalanceSheetCapitalStructureSection.tsx', [
  [
    "import { ExecutiveMetricCard } from '../../ui/executive-metric-card';",
    "import { ExecutiveMetricCard } from '../../ui/executive-metric-card';\nimport { ExecutiveHeading } from '../../ui/executive-heading';"
  ],
  [
    '<h3 className="text-xl md:text-[22px] font-semibold text-foreground mb-6">Estrutura de Capital</h3>',
    '<ExecutiveHeading as="h3" variant="moduleTitle" className="mb-6">Estrutura de Capital</ExecutiveHeading>'
  ]
]);

// 7. BalanceSheetExecutivePlan.tsx
replaceInFile('src/components/pages/balance-sheet/BalanceSheetExecutivePlan.tsx', [
  [
    "import { ExecutiveActionGrid } from '../../ui/executive-action-grid';",
    "import { ExecutiveActionGrid } from '../../ui/executive-action-grid';\nimport { ExecutiveHeading } from '../../ui/executive-heading';\nimport { ExecutiveText } from '../../ui/executive-typography';"
  ],
  [
    '<h3 className="text-[28px] lg:text-[30px] font-semibold leading-[1.2] tracking-tight text-foreground mb-8">\n        Plano Executivo Consolidado\n      </h3>',
    '<ExecutiveHeading as="h3" variant="sectionTitle" className="mb-8">\n        Plano Executivo Consolidado\n      </ExecutiveHeading>'
  ],
  [
    '<p className="text-[16px] font-normal leading-[1.75] text-foreground/80 max-w-[78ch]">\n            {executivePlan}\n          </p>',
    '<ExecutiveText as="p" variant="bodyLarge" className="text-foreground/80 max-w-[78ch]">\n            {executivePlan}\n          </ExecutiveText>'
  ]
]);

// 8. BalanceSheetExecutiveSynthesisSection.tsx
replaceInFile('src/components/pages/balance-sheet/BalanceSheetExecutiveSynthesisSection.tsx', [
  [
    "import { ExecutiveAnalysisContext } from '../../../services/FiduciaryRuntimeAdapter';",
    "import { ExecutiveAnalysisContext } from '../../../services/FiduciaryRuntimeAdapter';\nimport { ExecutiveHeading } from '../../ui/executive-heading';\nimport { ExecutiveText } from '../../ui/executive-typography';"
  ],
  [
    '<h3 className="text-sm font-bold text-foreground mb-4">Síntese Executiva</h3>\n        <p className="text-sm text-muted-foreground">{executiveNarrative}</p>',
    '<ExecutiveHeading as="h3" variant="submoduleTitle" className="mb-4">Síntese Executiva</ExecutiveHeading>\n        <ExecutiveText as="p" variant="bodyStandard" className="text-muted-foreground">{executiveNarrative}</ExecutiveText>'
  ]
]);

// 9. BalanceSheetInstitutionalContextSection.tsx
replaceInFile('src/components/pages/balance-sheet/BalanceSheetInstitutionalContextSection.tsx', [
  [
    "import { ExecutiveInfoCard } from '../../ui/executive-info-card';",
    "import { ExecutiveInfoCard } from '../../ui/executive-info-card';\nimport { ExecutiveHeading } from '../../ui/executive-heading';"
  ],
  [
    '<h3 className="text-xl md:text-[22px] font-semibold text-foreground mb-6">Contexto Institucional da Operação</h3>',
    '<ExecutiveHeading as="h3" variant="moduleTitle" className="mb-6">Contexto Institucional da Operação</ExecutiveHeading>'
  ]
]);

// 10. BalanceSheetLiquiditySection.tsx
replaceInFile('src/components/pages/balance-sheet/BalanceSheetLiquiditySection.tsx', [
  [
    "import { ExecutiveMetricCard } from '../../ui/executive-metric-card';",
    "import { ExecutiveMetricCard } from '../../ui/executive-metric-card';\nimport { ExecutiveHeading } from '../../ui/executive-heading';"
  ],
  [
    '<h3 className="text-xl md:text-[22px] font-semibold text-foreground mb-6">Liquidez e Solvência</h3>',
    '<ExecutiveHeading as="h3" variant="moduleTitle" className="mb-6">Liquidez e Solvência</ExecutiveHeading>'
  ]
]);

// 11. BalanceSheetRiskDivergenceSection.tsx
replaceInFile('src/components/pages/balance-sheet/BalanceSheetRiskDivergenceSection.tsx', [
  [
    "import { ExecutiveRiskRow } from '../../ui/executive-risk-row';",
    "import { ExecutiveRiskRow } from '../../ui/executive-risk-row';\nimport { ExecutiveHeading } from '../../ui/executive-heading';\nimport { ExecutiveText } from '../../ui/executive-typography';"
  ],
  [
    '<h3 className="text-xl font-bold text-foreground mb-4">Análise de Divergência de Risco</h3>',
    '<ExecutiveHeading as="h3" variant="moduleTitle" className="mb-4">Análise de Divergência de Risco</ExecutiveHeading>'
  ],
  [
    '<span className="text-[10px] font-bold text-foreground/70 uppercase tracking-widest">pontos</span>',
    '<ExecutiveText as="span" variant="microLabel" className="text-foreground/70">pontos</ExecutiveText>'
  ],
  [
    '<h4 className="text-lg font-bold text-foreground tracking-tight">Ofensores Fiduciários Críticos</h4>\n                  <p className="text-[11px] font-bold text-rose-600/80 uppercase tracking-[0.2em] mt-1">Matriz de Impacto Estrutural</p>',
    '<ExecutiveHeading as="h4" variant="moduleTitle" className="tracking-tight">Ofensores Fiduciários Críticos</ExecutiveHeading>\n                  <ExecutiveText as="p" variant="microLabel" className="text-rose-600/80 mt-1">Matriz de Impacto Estrutural</ExecutiveText>'
  ]
]);

// 12. BalanceSheetStructuralTablesSection.tsx
replaceInFile('src/components/pages/balance-sheet/BalanceSheetStructuralTablesSection.tsx', [
  [
    "import { ExecutiveSurface } from '../../ui/executive-surface';",
    "import { ExecutiveSurface } from '../../ui/executive-surface';\nimport { ExecutiveHeading } from '../../ui/executive-heading';\nimport { ExecutiveText } from '../../ui/executive-typography';"
  ],
  [
    '<h3 className="text-lg font-semibold text-foreground">Análise Estrutural do Balanço</h3>',
    '<ExecutiveHeading as="h3" variant="moduleTitle">Análise Estrutural do Balanço</ExecutiveHeading>'
  ],
  [
    '<span className="w-1.5 h-1.5 rounded-full bg-primary" />\n             <span className="text-[10px] font-medium text-foreground/70 uppercase tracking-wider">AV: Análise Vertical</span>',
    '<span className="w-1.5 h-1.5 rounded-full bg-primary" />\n             <ExecutiveText as="span" variant="microLabel" className="text-foreground/70">AV: Análise Vertical</ExecutiveText>'
  ],
  [
    '<span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />\n             <span className="text-[10px] font-medium text-foreground/70 uppercase tracking-wider">AH: Análise Horizontal</span>',
    '<span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />\n             <ExecutiveText as="span" variant="microLabel" className="text-foreground/70">AH: Análise Horizontal</ExecutiveText>'
  ],
  [
    '<p className="text-foreground/70 font-semibold">Sem dados para análise</p>',
    '<ExecutiveText as="p" variant="bodyStandard" className="font-semibold text-foreground/70">Sem dados para análise</ExecutiveText>'
  ],
  [
    '<h4 className="text-base font-bold text-foreground tracking-tight">{section.titleLabel}</h4>',
    '<ExecutiveHeading as="h4" variant="submoduleTitle" className="tracking-tight">{section.titleLabel}</ExecutiveHeading>'
  ],
  [
    '<div className="flex items-center px-4 py-3 border-b border-border text-[9px] font-bold text-foreground/70 uppercase tracking-[0.2em]">\n                  <div className="flex-1">Conta Contábil</div>\n                  <div className="w-32 text-right">Saldo (R$)</div>\n                  <div className="w-24 text-right">AV (%)</div>\n                  <div className="w-28 text-right">AH (%)</div>\n                </div>',
    '<ExecutiveText as="div" variant="microLabel" className="flex items-center px-4 py-3 border-b border-border text-foreground/70">\n                  <div className="flex-1">Conta Contábil</div>\n                  <div className="w-32 text-right">Saldo (R$)</div>\n                  <div className="w-24 text-right">AV (%)</div>\n                  <div className="w-28 text-right">AH (%)</div>\n                </ExecutiveText>'
  ],
  [
    '<span className="text-[10px] font-bold text-foreground/70 tabular-nums uppercase tracking-widest">-</span>',
    '<ExecutiveText as="span" variant="microLabel" className="text-foreground/70 tabular-nums">-</ExecutiveText>'
  ],
  [
    '<span className="inline-flex items-center justify-center px-2 py-0.5 text-foreground/70 text-[10px] font-bold">\n                             —\n                           </span>',
    '<ExecutiveText as="span" variant="caption" className="inline-flex items-center justify-center px-2 py-0.5 text-foreground/70">\n                             —\n                           </ExecutiveText>'
  ]
]);

// 13. BalanceSheetTechnicalLayerSection.tsx
replaceInFile('src/components/pages/balance-sheet/BalanceSheetTechnicalLayerSection.tsx', [
  [
    "import { ExecutiveTechnicalLayer } from '../../ui/executive-technical-layer';",
    "import { ExecutiveTechnicalLayer } from '../../ui/executive-technical-layer';\nimport { ExecutiveText } from '../../ui/executive-typography';"
  ],
  [
    '<h4 className="text-[10px] font-black text-primary uppercase tracking-widest border-b border-border pb-2">{family.familyName}</h4>',
    '<ExecutiveText as="h4" variant="microLabel" className="font-black text-primary border-b border-border pb-2">{family.familyName}</ExecutiveText>'
  ]
]);

// 14. BalanceSheetWaterfallChartSection.tsx
replaceInFile('src/components/pages/balance-sheet/BalanceSheetWaterfallChartSection.tsx', [
  [
    "import { BalanceSheetWaterfallViewModel } from './view-models';",
    "import { BalanceSheetWaterfallViewModel } from './view-models';\nimport { ExecutiveHeading } from '../../ui/executive-heading';\nimport { ExecutiveText } from '../../ui/executive-typography';"
  ],
  [
    '<h3 className="font-semibold text-lg tracking-tight leading-none text-foreground">Capital de Giro</h3>\n        <p className="text-foreground/70 text-sm leading-snug">Estrutura de Liquidez e Capital de Giro</p>',
    '<ExecutiveHeading as="h3" variant="moduleTitle">Capital de Giro</ExecutiveHeading>\n        <ExecutiveText as="p" variant="bodyStandard" className="text-foreground/70">Estrutura de Liquidez e Capital de Giro</ExecutiveText>'
  ]
]);

// 15. BalanceSheetWorkingCapitalSection.tsx
replaceInFile('src/components/pages/balance-sheet/BalanceSheetWorkingCapitalSection.tsx', [
  [
    "import { ExecutiveMetricCard } from '../../ui/executive-metric-card';",
    "import { ExecutiveMetricCard } from '../../ui/executive-metric-card';\nimport { ExecutiveHeading } from '../../ui/executive-heading';"
  ],
  [
    '<h3 className="text-xl md:text-[22px] font-semibold text-foreground mb-6">Inteligência de Capital de Giro</h3>',
    '<ExecutiveHeading as="h3" variant="moduleTitle" className="mb-6">Inteligência de Capital de Giro</ExecutiveHeading>'
  ]
]);

// 16. BalanceSheetYearFilter.tsx
replaceInFile('src/components/pages/balance-sheet/BalanceSheetYearFilter.tsx', [
  [
    "import { ExecutiveSurface } from '../../ui/executive-surface';",
    "import { ExecutiveSurface } from '../../ui/executive-surface';\nimport { ExecutiveTypographyRegistry } from '../../ui/executive-typography';\nimport { cn } from '../../../lib/utils';"
  ],
  [
    'className="bg-transparent px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest outline-none cursor-pointer text-foreground appearance-none pr-1"',
    'className={cn("bg-transparent px-3 py-1.5 outline-none cursor-pointer text-foreground appearance-none pr-1", ExecutiveTypographyRegistry.microLabel)}'
  ]
]);

console.log('All files processed.');
