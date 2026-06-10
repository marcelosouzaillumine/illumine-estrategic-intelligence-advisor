const fs = require('fs');
const path = require('path');

const files = [
  'src/components/pages/governance/ObservabilityConsolePage.tsx',
  'src/components/pages/governance/ESGIMAssessmentPage.tsx',
  'src/components/pages/governance/SovereignBoardPackPage.tsx',
  'src/components/pages/governance/GovernanceExecutionPanel.tsx',
  'src/components/pages/governance/SovereignDecisionCenter.tsx',
  'src/components/pages/BalanceSheetPage.tsx',
  'src/components/pages/DLPAPage.tsx',
  'src/components/pages/DFCPage.tsx',
  'src/components/pages/DREPage.tsx',
  'src/components/pages/governance/BoardMeetingMode.tsx',
  'src/components/pages/LoanInvestmentSimPage.tsx'
];

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if(!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 1. Headings
  content = content.replace(/<h([1-6])([^>]+)text-muted-foreground([^>]*)>/g, '<h$1$2text-primary$3>');
  
  // 2. Paragraphs with text-sm, text-base, text-md, text-lg
  content = content.replace(/<p([^>]+)text-(sm|base|md|lg)\s+text-muted-foreground([^>]*)>/g, '<p$1text-$2 text-secondary$3>');
  content = content.replace(/<p([^>]+)text-muted-foreground\s+text-(sm|base|md|lg)([^>]*)>/g, '<p$1text-secondary text-$2$3>');

  // 3. Other elements with large text classes
  content = content.replace(/(className=["'][^"']*?)\btext-muted-foreground\b([^"']*?\btext-(lg|xl|2xl|3xl|4xl|5xl)\b[^"']*?["'])/g, '$1text-primary$2');
  content = content.replace(/(className=["'][^"']*?\btext-(lg|xl|2xl|3xl|4xl|5xl)\b[^"']*?)\btext-muted-foreground\b([^"']*?["'])/g, '$1text-primary$3');
  
  fs.writeFileSync(filePath, content);
});

console.log('Targeted legibility fixes applied securely.');
