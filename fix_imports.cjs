const fs = require('fs');

const files = [
  '/Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/components/pages/InstitutionalFinancialOverviewPage.tsx',
  '/Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/components/pages/DREPage.tsx',
  '/Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/components/pages/BalanceSheetPage.tsx',
  '/Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/components/pages/PreferencesPage.tsx',
  '/Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/components/AppSidebar.tsx',
  '/Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/components/Common/Base.tsx'
];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const newContent = content.replace(/context\/LanguageContext/g, 'contexts/LanguageContext');
  fs.writeFileSync(file, newContent);
  console.log('Fixed', file);
});
