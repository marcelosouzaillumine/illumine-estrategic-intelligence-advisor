const fs = require('fs');
const path = require('path');

const targetFiles = [
  'src/components/pages/DFCPage.tsx',
  'src/components/pages/BalanceSheetPage.tsx',
  'src/components/pages/DREPage.tsx',
  'src/components/pages/DLPAPage.tsx',
  'src/components/pages/ReceivablesPage.tsx',
  'src/components/pages/LoanInvestmentSimPage.tsx',
  'src/components/pages/governance/ESGIMAssessmentPage.tsx',
  'src/components/pages/governance/SovereignBoardPackPage.tsx',
  'src/components/pages/governance/SovereignDecisionCenter.tsx',
  'src/components/pages/governance/ObservabilityConsolePage.tsx',
  'src/components/pages/governance/GovernanceExecutionPanel.tsx',
  'src/components/pages/governance/BoardMeetingMode.tsx',
  'src/components/pages/DashboardPage.tsx',
  'src/components/pages/FinancialAdminDashboard.tsx',
  'src/components/pages/AxisDashboardPage.tsx',
  'src/components/pages/AdvisoryInsightsPage.tsx'
];

let previousHistory = {};
try {
  if (fs.existsSync('.aiox/reports/ees-history.json')) {
    previousHistory = JSON.parse(fs.readFileSync('.aiox/reports/ees-history.json', 'utf8'));
  }
} catch(e) {}

const results = [];

function analyzeFile(filePath) {
  const absolutePath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(absolutePath)) {
    return;
  }

  const content = fs.readFileSync(absolutePath, 'utf8');

  let colors = 100;
  let typography = 100;
  let surfaces = 100;
  let icons = 100;
  let density = 100;
  let accessibility = 100;
  let legibility = 100;
  let depth = 100;

  // Colors: penalize legacy colors
  const legacyColors = (content.match(/\b(?:bg|text|border)-(?:slate|gray|purple|violet|fuchsia|indigo)-\d+(?:\/\d+)?\b/g) || []).length;
  const hexColors = (content.match(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/g) || []).length;
  colors -= (legacyColors * 2) + (hexColors * 3);

  // Typography
  const hasTables = content.includes('<table') || content.includes('<tr');
  const hasTabular = content.includes('tabular-nums');
  if (hasTables && !hasTabular) typography -= 20;
  
  // Surfaces
  const bgWhite = (content.match(/\bbg-white\b/g) || []).length;
  const semanticSurfaces = (content.match(/\bbg-(?:background|surface|surface-high|card)\b/g) || []).length;
  if (semanticSurfaces === 0) surfaces -= 30;
  surfaces -= (bgWhite * 2);

  // Icons
  const lucideIcons = (content.match(/<[A-Z][a-zA-Z]+ size=/g) || []).length;
  if (lucideIcons > 0 && !content.includes('text-muted-foreground') && !content.includes('text-primary')) {
    icons -= 15;
  }

  // Density
  const excessivePadding = (content.match(/\bpx-[6-9]\b|\bpy-[4-9]\b/g) || []).length;
  if (hasTables && excessivePadding > 5) density -= 15;

  // Legibility Contextual Audit
  // 1. Penalize text-muted-foreground with large text classes (KPIs, Titles)
  const mutedLargeTextRegex = /className=["'][^"']*\btext-muted-foreground\b[^"']*\btext-(lg|xl|2xl|3xl|4xl|5xl)\b[^"']*["']/g;
  const mutedLargeTextMatches = (content.match(mutedLargeTextRegex) || []).length;
  legibility -= (mutedLargeTextMatches * 15); // Severe penalty

  // 2. Penalize text-muted-foreground on headings
  const mutedHeadingRegex = /<h[1-6][^>]*\btext-muted-foreground\b[^>]*>/g;
  const mutedHeadingMatches = (content.match(mutedHeadingRegex) || []).length;
  legibility -= (mutedHeadingMatches * 15); // Severe penalty

  // 3. Penalize text-muted-foreground in regular narrative text (text-base or no size but long content)
  // We approximate this by looking for text-muted-foreground paired with text-base or leading-relaxed
  const mutedNarrativeRegex = /className=["'][^"']*\btext-muted-foreground\b[^"']*\b(text-base|leading-relaxed)\b[^"']*["']/g;
  const mutedNarrativeMatches = (content.match(mutedNarrativeRegex) || []).length;
  legibility -= (mutedNarrativeMatches * 5); // Warning penalty

  
  // Depth Audit
  const genericCards = (content.match(/\bbg-card\b/g) || []).length;
  const shadowedCards = (content.match(/\bshadow-(sm|md|lg|xl|2xl)\b/g) || []).length;
  const borderedCards = (content.match(/\bborder-border\/?\d*\b/g) || []).length;
  
  if (genericCards > 0) {
    if (shadowedCards < genericCards / 2) depth -= 15;
    if (borderedCards < genericCards / 2) depth -= 15;
  }
  
  // 4. Muted text inside colored surfaces
  const coloredSurfaceWithMutedText = /className=["'][^"']*\bbg-(amber|rose|destructive|warning|emerald|success)[^"']*\btext-muted-foreground\b[^"']*["']/g;
  legibility -= ((content.match(coloredSurfaceWithMutedText) || []).length * 20);

  // 5. Light text on light backgrounds (pastel on pastel)
  const pastelOnPastel = /className=["'][^"']*\bbg-(amber|rose|destructive|warning|emerald|success)-(50|100|200|300|500\/10|500\/20)[^"']*\btext-(amber|rose|destructive|warning|emerald|success)-(300|400|500)\b[^"']*["']/g;
  legibility -= ((content.match(pastelOnPastel) || []).length * 20);

  
  // Penalize missing semantic backgrounds
  const amberSoft = (content.match(/\bbg-warning-soft\b/g) || []).length;
  const criticalSoft = (content.match(/\bbg-critical-soft\b/g) || []).length;
  const successSoft = (content.match(/\bbg-success-soft\b/g) || []).length;
  const insightSoft = (content.match(/\bbg-insight-soft\b/g) || []).length;
  const genericAmber = (content.match(/\bbg-amber-[1-9]00\/?\d*\b/g) || []).length;
  const genericRose = (content.match(/\bbg-rose-[1-9]00\/?\d*\b/g) || []).length;
  
  if (genericAmber > 0) surfaces -= (genericAmber * 10);
  if (genericRose > 0) surfaces -= (genericRose * 10);

  // Accessibility
  accessibility = Math.round((colors + surfaces + legibility) / 3);

  const clamp = (val) => Math.max(0, Math.min(100, val));
  colors = clamp(colors);
  typography = clamp(typography);
  surfaces = clamp(surfaces);
  icons = clamp(icons);
  density = clamp(density);
  accessibility = clamp(accessibility);
  legibility = clamp(legibility);
  depth = clamp(depth);

  // Weights: Legibility is 15%. Rest is distributed among the other 6 metrics.
  // Colors (17%), Typography (17%), Surfaces (17%), Icons (10%), Density (12%), Accessibility (12%), Legibility (15%)
  
  const ees = Math.round(
    (colors * 0.15) + 
    (typography * 0.15) + 
    (surfaces * 0.15) + 
    (icons * 0.10) + 
    (density * 0.10) + 
    (accessibility * 0.10) + 
    (legibility * 0.15) +
    (depth * 0.10)
  );


  const prev = previousHistory[filePath] || { ees };
  const variation = ees - prev.ees;

  results.push({
    page: path.basename(filePath, '.tsx'),
    filePath,
    ees,
    previousEes: prev.ees,
    variation,
    subscores: {
      colors,
      typography,
      surfaces,
      icons,
      density,
      accessibility,
      legibility,
      depth
    }
  });
}

targetFiles.forEach(analyzeFile);
results.sort((a, b) => a.ees - b.ees);

fs.mkdirSync(path.join(process.cwd(), '.aiox/reports'), { recursive: true });
fs.writeFileSync(path.join(process.cwd(), '.aiox/reports/ees-history.json'), JSON.stringify(
  results.reduce((acc, curr) => {
    acc[curr.filePath] = { ees: curr.ees, subscores: curr.subscores };
    return acc;
  }, {}), null, 2
));

fs.writeFileSync(path.join(process.cwd(), '.aiox/reports/executive-visual-debt.json'), JSON.stringify(results, null, 2));

console.log('Executive Experience Score (EES) generated successfully.');
console.log(`Top 10 Critical Pages by EES (with new Legibility rules):\n`);
results.slice(0, 10).forEach((r, i) => {
  console.log(`${i+1}. ${r.page} (EES: ${r.ees} | Legibility: ${r.subscores.legibility})`);
});
