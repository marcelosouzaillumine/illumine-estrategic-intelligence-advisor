import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function replaceInFile(relativePath, replacements) {
  const filePath = path.join(__dirname, relativePath);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  for (const [target, replacement] of replacements) {
    if (content.includes(target)) {
      content = content.replace(target, replacement);
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${relativePath}`);
  }
}

replaceInFile('src/components/pages/balance-sheet/BalanceSheetAuditLayerSection.tsx', [
  [
    '<ExecutiveText as="span" variant="bodyStandard" className="font-semibold text-foreground/70">{viewModel.structuralRestrictions.originalClassificationLabel}</ExecutiveText>',
    '<ExecutiveText as="span" variant="bodyStandard" className="text-foreground/70">{viewModel.structuralRestrictions.originalClassificationLabel}</ExecutiveText>'
  ],
  [
    '<ExecutiveText as="span" variant="bodyStandard" className="font-bold">{viewModel.structuralRestrictions.classificationCeilingLabel}</ExecutiveText>',
    '<ExecutiveText as="span" variant="bodyStandard">{viewModel.structuralRestrictions.classificationCeilingLabel}</ExecutiveText>'
  ]
]);

replaceInFile('src/components/pages/balance-sheet/BalanceSheetRiskDivergenceSection.tsx', [
  [
    '<ExecutiveHeading as="h4" variant="moduleTitle" className="tracking-tight">Ofensores Fiduciários Críticos</ExecutiveHeading>',
    '<ExecutiveHeading as="h4" variant="moduleTitle">Ofensores Fiduciários Críticos</ExecutiveHeading>'
  ]
]);

replaceInFile('src/components/pages/balance-sheet/BalanceSheetStructuralTablesSection.tsx', [
  [
    '<ExecutiveText as="p" variant="bodyStandard" className="font-semibold text-foreground/70">Sem dados para análise</ExecutiveText>',
    '<ExecutiveText as="p" variant="bodyStandard" className="text-foreground/70">Sem dados para análise</ExecutiveText>'
  ],
  [
    '<ExecutiveHeading as="h4" variant="submoduleTitle" className="tracking-tight">{section.titleLabel}</ExecutiveHeading>',
    '<ExecutiveHeading as="h4" variant="submoduleTitle">{section.titleLabel}</ExecutiveHeading>'
  ]
]);

replaceInFile('src/components/pages/balance-sheet/BalanceSheetTechnicalLayerSection.tsx', [
  [
    '<ExecutiveText as="h4" variant="microLabel" className="font-black text-primary border-b border-border pb-2">{family.familyName}</ExecutiveText>',
    '<ExecutiveText as="h4" variant="microLabel" className="text-primary border-b border-border pb-2">{family.familyName}</ExecutiveText>'
  ]
]);

console.log('Done 2');
