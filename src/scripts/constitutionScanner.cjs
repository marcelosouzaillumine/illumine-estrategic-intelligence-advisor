const fs = require('fs');
const path = require('path');

function getFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      getFiles(path.join(dir, file), fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

const uiDir = path.join(__dirname, '../components/ui');
const execDir = path.join(__dirname, '../components/executive');

const allFiles = [...getFiles(uiDir), ...getFiles(execDir)];

let stats = {
  typography: { compliant: 0, total: 0 },
  metrics: { compliant: 0, total: 0 },
  surfaces: { compliant: 0, total: 0 },
  badges: { compliant: 0, total: 0 },
  accordions: { compliant: 0, total: 0 },
  charts: { compliant: 0, total: 0 },
  tables: { compliant: 0, total: 0 },
  buttons: { compliant: 0, total: 0 },
};

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');

  // DOMAIN 01: Typography
  const execHeading = (content.match(/<ExecutiveHeading/g) || []).length;
  const execText = (content.match(/<ExecutiveText/g) || []).length;
  const rawText = (content.match(/<(p|span|h[1-6])(?=\s|>)[^>]*className=["'][^"']*(text-(xs|sm|base|lg|xl|[2-9]xl|\[.*?\]))[^"']*["']/g) || []).length;
  stats.typography.compliant += (execHeading + execText);
  stats.typography.total += (execHeading + execText + rawText);

  // DOMAIN 02: Metrics
  const execMetric = (content.match(/<ExecutiveMetric/g) || []).length;
  const rawMetric = (content.match(/<(div|span|p)[^>]*className=["'][^"']*(tabular-nums|text-[23456]xl)[^"']*["']/g) || []).length;
  stats.metrics.compliant += execMetric;
  stats.metrics.total += (execMetric + rawMetric);

  // DOMAIN 03: Surfaces
  const execSurface = (content.match(/<ExecutiveSurface/g) || []).length;
  // A raw surface is typically a div with background, rounded borders, and padding
  const rawSurface = (content.match(/<div[^>]*className=["'][^"']*(bg-(slate|white|gray|zinc|neutral|surface|primary)[-\w]*\s+rounded-[a-z]+)[^"']*["']/g) || []).length;
  stats.surfaces.compliant += execSurface;
  stats.surfaces.total += (execSurface + rawSurface);

  // DOMAIN 04: Badges
  const execBadge = (content.match(/<(ExecutiveBadge|Badge)/g) || []).length;
  const rawBadge = (content.match(/<(div|span)[^>]*className=["'][^"']*(inline-flex\s+items-center\s+rounded-full|px-\d+\s+py-\d+\s+text-[a-z]+\s+rounded-full)[^"']*["']/g) || []).length;
  stats.badges.compliant += execBadge;
  stats.badges.total += (execBadge + rawBadge);

  // DOMAIN 05: Accordions
  const execAcc = (content.match(/<(ExecutiveAccordion|AccordionItem)/g) || []).length;
  const rawAcc = (content.match(/className=["'][^"']*(accordion|disclosure|collapsible)[^"']*["']/ig) || []).length;
  stats.accordions.compliant += execAcc;
  stats.accordions.total += (execAcc + rawAcc);

  // DOMAIN 06: Charts
  const execChart = (content.match(/<ExecutiveChart/g) || []).length;
  const rawChart = (content.match(/<(ResponsiveContainer|LineChart|BarChart|PieChart|AreaChart)/g) || []).length;
  stats.charts.compliant += execChart;
  stats.charts.total += (execChart + rawChart);

  // DOMAIN 07: Tables
  const execTable = (content.match(/<(ExecutiveTable|Table)/g) || []).length; // Table is from ui
  const rawTable = (content.match(/<table/g) || []).length;
  stats.tables.compliant += execTable;
  stats.tables.total += (execTable + rawTable);

  // DOMAIN 08: Actions (ExecutiveAction)
  const execAction = (content.match(/<ExecutiveAction/g) || []).length;
  const legacyButton = (content.match(/<Button/g) || []).length;
  const rawButton = (content.match(/<button/g) || []).length;
  const badgeAsAction = (content.match(/<ExecutiveBadge[^>]*onClick/g) || []).length;
  
  stats.buttons.compliant += execAction;
  // Total of actionable targets includes executive actions, legacy ui buttons, manual html buttons, and improper badges
  stats.buttons.total += (execAction + legacyButton + rawButton + badgeAsAction);
}

function calcComp(comp, tot) {
  if (tot === 0) return 100;
  return Math.round((comp / tot) * 100);
}

console.log("=== EXECUTIVE CONSTITUTION ENGINE SCANNER ===");
console.log(`Domain 01 Typography: ${calcComp(stats.typography.compliant, stats.typography.total)}% (${stats.typography.compliant}/${stats.typography.total})`);
console.log(`Domain 02 Metrics:    ${calcComp(stats.metrics.compliant, stats.metrics.total)}% (${stats.metrics.compliant}/${stats.metrics.total})`);
console.log(`Domain 03 Surfaces:   ${calcComp(stats.surfaces.compliant, stats.surfaces.total)}% (${stats.surfaces.compliant}/${stats.surfaces.total})`);
console.log(`Domain 04 Badges:     ${calcComp(stats.badges.compliant, stats.badges.total)}% (${stats.badges.compliant}/${stats.badges.total})`);
console.log(`Domain 05 Accordions: ${calcComp(stats.accordions.compliant, stats.accordions.total)}% (${stats.accordions.compliant}/${stats.accordions.total})`);
console.log(`Domain 06 Charts:     ${calcComp(stats.charts.compliant, stats.charts.total)}% (${stats.charts.compliant}/${stats.charts.total})`);
console.log(`Domain 07 Tables:     ${calcComp(stats.tables.compliant, stats.tables.total)}% (${stats.tables.compliant}/${stats.tables.total})`);
console.log(`Domain 08 Buttons:    ${calcComp(stats.buttons.compliant, stats.buttons.total)}% (${stats.buttons.compliant}/${stats.buttons.total})`);
console.log("=============================================");
