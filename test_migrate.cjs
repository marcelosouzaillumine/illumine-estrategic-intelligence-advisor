const fs = require('fs');

const file = 'src/components/executive/ExecutiveDiagnosisCard.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replacement for R$ {value.toLocaleString('pt-BR')}
// In JSX: R$ {value.toLocaleString('pt-BR')} -> {formatter.currency(value)}
// Wait, if it has "R$ ", we can just replace "R$ {" with "{" and use formatter.currency.
content = content.replace(/R\$\s*\{([^}]+)\.toLocaleString\([^)]*\)\}/g, '{formatter.currency($1)}');
content = content.replace(/\{([^}]+)\.toLocaleString\([^)]*\)\}/g, '{formatter.number($1)}');
content = content.replace(/new Intl\.DateTimeFormat\([^)]+\)\.format\(([^)]+)\)/g, 'formatter.date($1)');
content = content.replace(/new Date\(([^)]+)\)\.toLocaleString\([^)]*\)/g, 'formatter.date($1)');
content = content.replace(/new Intl\.NumberFormat\([^)]+\)\.format\(([^)]+)\)/g, 'formatter.currency($1)');

fs.writeFileSync(file, content, 'utf8');
