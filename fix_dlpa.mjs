import fs from 'fs';

const p = 'src/components/pages/DLPAPage.tsx';
let content = fs.readFileSync(p, 'utf8');

// Replace getRetentionLabel
content = content.replace(/function getRetentionLabel[\s\S]*?return map\[status\] \|\| map\['NÃO_APLICÁVEL'\];\n}/, 
`function getRetentionLabel(status: string) {
  const map: Record<string, { label: string; tone: 'success' | 'warning' | 'critical' | 'info' | 'neutral' }> = {
    'ALTA_RETENÇÃO':              { label: 'Alta Retenção',             tone: 'success' },
    'RETENÇÃO_MODERADA':          { label: 'Retenção Moderada',         tone: 'info' },
    'DISTRIBUIÇÃO_EXCESSIVA':     { label: 'Distribuição Excessiva',    tone: 'warning' },
    'DESCAPITALIZAÇÃO_DELIBERADA':{ label: 'Descapitalização Deliberada', tone: 'critical' },
    'NÃO_APLICÁVEL_SEM_LUCRO':   { label: 'N/A — Sem Lucro',           tone: 'neutral' },
    'NÃO_APLICÁVEL':              { label: 'N/A',                       tone: 'neutral' },
    'AUSÊNCIA_DE_CAPACIDADE_DISTRIBUTIVA': { label: 'Sem Capacidade Distributiva', tone: 'neutral' },
    'RETENÇÃO_COMPULSÓRIA_POR_PREJUÍZO':   { label: 'Retenção por Prejuízo', tone: 'critical' },
    
    // New fiduciaries
    'STRATEGIC_RETENTION':        { label: 'Retenção Estratégica',      tone: 'success' },
    'FORCED_RETENTION':           { label: 'Retenção Compulsória',      tone: 'neutral' },
    'EMERGENCY_CAPITAL_PRESERVATION': { label: 'Preservação Emergencial', tone: 'warning' },
    'SURVIVAL_STAGE_CAPITAL_STRUCTURE': { label: 'Estrutura de Sobrevivência', tone: 'critical' },
    'UNSUSTAINABLE_PRESERVATION': { label: 'Preservação Insustentável', tone: 'warning' },
    'GOVERNANCE_RETENTION':       { label: 'Retenção de Governança',    tone: 'info' },
    'RETENTION_NOT_ELIGIBLE':     { label: 'Inelegível para Retenção',  tone: 'neutral' },
  };
  return map[status] || map['NÃO_APLICÁVEL'];
}`);

// Replace getDistributionLabel
content = content.replace(/function getDistributionLabel[\s\S]*?return map\[pressure\] \|\| map\['NÃO_APLICÁVEL'\];\n}/,
`function getDistributionLabel(pressure: string) {
  const map: Record<string, { label: string; tone: 'success' | 'warning' | 'critical' | 'info' | 'neutral' }> = {
    'BAIXA':                   { label: 'Conservadora',              tone: 'success' },
    'MODERADA':                { label: 'Equilibrada',               tone: 'info' },
    'ALTA':                    { label: 'Agressiva',                  tone: 'warning' },
    'CRÍTICA':                 { label: 'Predatória',                 tone: 'critical' },
    'NÃO_APLICÁVEL_SEM_LUCRO': { label: 'Sem distribuição no período', tone: 'neutral' },
    'NÃO_APLICÁVEL':           { label: 'N/A',                        tone: 'neutral' },
  };
  return map[pressure] || map['NÃO_APLICÁVEL'];
}`);

// Replace getPreservationLabel
content = content.replace(/function getPreservationLabel[\s\S]*?return map\[status\] \|\| map\['NEUTRO'\];\n}/,
`function getPreservationLabel(status: string) {
  const map: Record<string, { label: string; tone: 'success' | 'warning' | 'critical' | 'info' | 'neutral' }> = {
    'PRESERVAÇÃO_SAUDÁVEL':   { label: 'Preservação Saudável',       tone: 'success' },
    'EROSÃO_MODERADA':        { label: 'Erosão Moderada',             tone: 'info' },
    'EROSÃO_RELEVANTE':       { label: 'Erosão Relevante',            tone: 'warning' },
    'FRAGILIDADE_PATRIMONIAL':{ label: 'Fragilidade Patrimonial',     tone: 'critical' },
    'NEUTRO':                 { label: 'Patrimônio Preservado',       tone: 'neutral' },
    'DEPENDÊNCIA_DE_CAPITALIZAÇÃO':{ label: 'Dependência de Capital', tone: 'critical' },
    'SUSTENTAÇÃO_PATRIMONIAL_EXTERNA':{ label: 'Sustentação Externa', tone: 'warning' },
    'EROSÃO_PATRIMONIAL_OPERACIONAL':{ label: 'Erosão Operacional', tone: 'critical' },
    // legado
    'PRESERVADO':             { label: 'Preservado',                  tone: 'success' },
    'DRENADO':                { label: 'Erosão Relevante',             tone: 'warning' },
    // fiduciários novos
    'PRESERVED':              { label: 'Preservado',                  tone: 'success' },
    'PRESSURED':              { label: 'Pressionado',                 tone: 'info' },
    'SEVERELY_ERODED':        { label: 'Erosão Severa',               tone: 'warning' },
    'CAPITAL_COLLAPSE_RISK':  { label: 'Risco de Colapso',            tone: 'critical' },
    // CPI classifications
    'CAPITAL_EXPANSION':      { label: 'Expansão de Capital',         tone: 'success' },
    'CAPITAL_PRESERVED':      { label: 'Capital Preservado',          tone: 'success' },
    'MODERATE_EROSION':       { label: 'Erosão Moderada',             tone: 'info' },
    'HIGH_EROSION':           { label: 'High Capital Erosion',        tone: 'warning' },
    'CRITICAL_EROSION':       { label: 'Erosão Crítica',              tone: 'critical' },
    'CAPITAL_COLLAPSE':       { label: 'Colapso de Capital',          tone: 'critical' },
    'Capitalização em Consolidação': { label: 'Capitalização em Consolidação', tone: 'info' },
    'Estrutura de Capital em Formação': { label: 'Estrutura de Capital em Formação', tone: 'neutral' },
    'Estrutura Patrimonial em Formação': { label: 'Estrutura Patrimonial em Formação', tone: 'neutral' }
  };
  return map[status] || map['NEUTRO'];
}`);

// Replace the mapping logic inside the main render array
// Old: 
// { label: 'Sustentabilidade Patrimonial', value: cpiStatus !== 'NEUTRO' ? cpiStatus : '—', badge: preservationStyle.label, badgeColor: preservationStyle.color },
// ...
// ].map(({ label, value, badge, badgeColor }) => {
//   const tone = badgeColor.includes('emerald') || badgeColor.includes('success') ? 'success' :
//                badgeColor.includes('amber') || badgeColor.includes('warning') ? 'warning' :
//                badgeColor.includes('rose') || badgeColor.includes('critical') ? 'critical' :
//                badgeColor.includes('blue') || badgeColor.includes('info') ? 'info' : 'neutral';
const oldMapBlock = `                    ].map(({ label, value, badge, badgeColor }) => {
                      const tone = badgeColor.includes('emerald') || badgeColor.includes('success') ? 'success' :
                                   badgeColor.includes('amber') || badgeColor.includes('warning') ? 'warning' :
                                   badgeColor.includes('rose') || badgeColor.includes('critical') ? 'critical' :
                                   badgeColor.includes('blue') || badgeColor.includes('info') ? 'info' : 'neutral';`;

const newMapBlock = `                    ].map(({ label, value, badge, tone }) => {`;

content = content.replace(/badge: preservationStyle.label, badgeColor: preservationStyle.color/g, "badge: preservationStyle.label, tone: preservationStyle.tone");
content = content.replace(/badge: retentionStyle.label, badgeColor: retentionStyle.color/g, "badge: retentionStyle.label, tone: retentionStyle.tone");
content = content.replace(/badge: distributionStyle.label, badgeColor: distributionStyle.color/g, "badge: distributionStyle.label, tone: distributionStyle.tone");

content = content.replace(oldMapBlock, newMapBlock);

// Remove unused icon imports (ArrowUpRight, TrendingUp, TrendingDown, ShieldAlert, Minus) if they are now unused, but it's okay to leave them.

// Fix table rows
content = content.replace(/bg-red-500\/10 text-red-600 border-red-500\/20/g, "bg-critical-soft text-critical border-critical/20");
content = content.replace(/bg-emerald-500\/10 text-emerald-600 border-emerald-500\/20/g, "bg-success-soft text-success border-success/20");
content = content.replace(/text-rose-600/g, "text-critical");
content = content.replace(/text-emerald-500/g, "text-success");
content = content.replace(/text-rose-500/g, "text-critical");
content = content.replace(/bg-rose-100 text-rose-700/g, "bg-critical-soft text-critical");
content = content.replace(/bg-blue-500\/10 text-blue-600 border border-blue-500\/20/g, "bg-insight-soft text-insight border border-insight/20");

// The table tags are using standard span with rounded-full
// `<span className={cn('text-[10px] font-bold uppercase px-3 py-1 rounded-full border inline-block w-[72px] text-center',`
// It is acceptable as long as it uses semantic colors, which we just replaced!
// Wait, the user specifically said: "Tabelas também devem usar componentes canônicos: Toda marcação literal ... deve ser substituída por <ExecutiveBadge variant='...' />"
content = content.replace(
  /<span className=\{cn\('text-\[10px\] font-bold uppercase px-3 py-1 rounded-full border inline-block w-\[72px\] text-center',\s*row\.nature === 'negative' \? 'bg-critical-soft text-critical border-critical\/20' : \s*row\.nature === 'positive' \? 'bg-success-soft text-success border-success\/20' : \s*'bg-surface-container\/30 text-muted-foreground border-border'\s*\)\}>\s*\{row\.nature === 'negative' \? 'Redução' : row\.nature === 'positive' \? 'Adição' : 'Neutro'\}\s*<\/span>/m,
  `<ExecutiveBadge variant={row.nature === 'negative' ? 'critical' : row.nature === 'positive' ? 'success' : 'neutral'}>
    {row.nature === 'negative' ? 'Redução' : row.nature === 'positive' ? 'Adição' : 'Neutro'}
  </ExecutiveBadge>`
);

content = content.replace(
  /<span className="text-\[10px\] font-bold uppercase px-3 py-1\.5 rounded-full bg-surface-container text-muted-foreground border border-border">\s*Calculado\s*<\/span>/,
  `<ExecutiveBadge variant="neutral">Calculado</ExecutiveBadge>`
);

content = content.replace(
  /<span className="px-4 py-1\.5 rounded-full text-\[9px\] font-black uppercase tracking-widest bg-insight-soft text-insight border border-insight\/20 shadow-sm">\s*\{dlpaMetrics\?\.\['distribuicaoSustentavel'\] \? 'Sustentável' : 'Atenção'\}\s*<\/span>/,
  `<ExecutiveBadge variant={dlpaMetrics?.['distribuicaoSustentavel'] ? 'success' : 'warning'}>
    {dlpaMetrics?.['distribuicaoSustentavel'] ? 'Sustentável' : 'Atenção'}
  </ExecutiveBadge>`
);

content = content.replace(
  /<span className="text-\[10px\] font-bold uppercase px-3 py-1 rounded-full bg-surface-container text-foreground border border-border">\s*Tese Base\s*<\/span>/,
  `<ExecutiveBadge variant="neutral">Tese Base</ExecutiveBadge>`
);


fs.writeFileSync(p, content);
console.log("Done updating DLPAPage.tsx");

