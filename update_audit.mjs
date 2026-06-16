import fs from 'fs';

const path = 'src/scripts/runDesignTypographyAudit.ts';
let content = fs.readFileSync(path, 'utf-8');

content = content.replace(
  /(\s+if \(mode === 'bp' && line\.includes\('<details'\) && !file\.includes\('executive-accordion\.tsx'\)\) \{[\s\S]*?hasErrors = true;\n\s+errorCount\+\+;\n\s+\})/,
  `$1

    // Block "Score Executivo" in titles
    if (line.match(/<ExecutiveHeading.*?>.*?Score Executivo.*?<\\/ExecutiveHeading>/i) || line.match(/title=\\{?['"]Score Executivo['"]\\}?/i)) {
      console.error(\`❌ Violação em \${file.replace(process.cwd(), '')}:\${index + 1}\`);
      console.error(\`   Uso de "Score Executivo" como protagonista proibido pela arquitetura v2.0.\`);
      hasErrors = true;
      errorCount++;
    }

    // Block hardcoded i18n leaks
    const hardcodedLeaks = line.match(/(?<!\\/\\/.*)(\\[\\[.*?\\]\\]|\\bN\\/A\\b|\\bScore\\b|\\bDriver\\b|\\bConfidence\\b|\\bWorking Capital\\b|\\bDebt-to-Equity\\b|\\bCurrent Ratio\\b|\\bQuick Ratio\\b|\\bCash Ratio\\b)/g);
    if (hardcodedLeaks && file.includes('/components/') && !line.includes('eslint-disable') && !line.includes('className') && !line.includes('variant=')) {
      console.error(\`❌ Violação em \${file.replace(process.cwd(), '')}:\${index + 1}\`);
      console.error(\`   Vazamento de idioma ou termo não traduzido (i18n): \${hardcodedLeaks.join(', ')}\`);
      hasErrors = true;
      errorCount++;
    }`
);

fs.writeFileSync(path, content);
