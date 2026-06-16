import fs from 'fs';
import path from 'path';

// Parse arguments
const args = process.argv.slice(2);
let mode = 'report'; // Default to report to avoid breaking builds unexpectedly
const modeArg = args.find(arg => arg.startsWith('--mode='));
if (modeArg) {
  mode = modeArg.split('=')[1];
}

console.log(`--- Inspecionando Tipografia Executiva (Illumine Governance) - Modo: ${mode} ---`);

const PAGES_DIR = path.resolve(process.cwd(), 'src/components/pages');
const UI_DIR = path.resolve(process.cwd(), 'src/components/ui');

function walkDir(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walkDir(filePath, fileList);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

let files = walkDir(PAGES_DIR);

if (mode === 'bp') {
  // Filtra apenas para a página raiz de BP e sua pasta
  files = files.filter(file => 
    file.endsWith('BalanceSheetPage.tsx') || 
    file.includes('/balance-sheet/')
  );
  
  // Inclui os componentes UI diretamente usados pela página /bp
  const uiFiles = walkDir(UI_DIR).filter(file => 
    file.endsWith('executive-typography.tsx') ||
    file.endsWith('executive-distribution-card.tsx') ||
    file.endsWith('executive-exposure-card.tsx') ||
    file.endsWith('executive-empty-state.tsx') ||
    file.endsWith('executive-badge.tsx') ||
    file.endsWith('executive-heading.tsx') ||
    file.endsWith('executive-accordion.tsx') ||
    file.endsWith('executive-metric-card.tsx') ||
    file.endsWith('executive-technical-metric-card.tsx') ||
    file.endsWith('executive-risk-card.tsx') ||
    file.endsWith('executive-classification-flow.tsx') ||
    file.endsWith('executive-summary-card.tsx')
  );
  files = [...files, ...uiFiles];
}

  const FORBIDDEN_TEXT_SIZES = [
    'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl',
    'font-thin', 'font-extralight', 'font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold', 'font-extrabold', 'font-black'
  ];

  const FORBIDDEN_STRINGS = [
    'NaN', 'N/A', 'undefined', 'null', 'INSUFFICIENT_DATA',
    'Debt-to-Equity', 'Asset Concentration Risk', 'Capital Erosion Velocity'
  ];

// Expressão regular para capturar violações da Constituição Visual (Tamanho, Peso, Altura de Linha, Espaçamento, Transformação)
const forbiddenRegex = /\b(text-(xs|sm|base|lg|xl|[2-9]xl|\[.*?\])|font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black|\[.*?\])|leading-[a-zA-Z0-9\[\]\-\.]+|tracking-[a-zA-Z0-9\[\]\-\.]+|uppercase|lowercase|capitalize|normal-case)\b/g;

let hasErrors = false;
let errorCount = 0;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    // Foca apenas em linhas que definem classes para evitar falsos positivos em textos normais ou strings soltas
    if (line.includes('className') || line.includes('cn(')) {
      const matches = line.match(forbiddenRegex);
      if (matches) {
        // Exceções permitidas: comentários de disable ou justificativas arquiteturais explícitas
        if (!line.includes('eslint-disable-next-line') && !line.includes('// @allow-typography')) {
          console.error(`❌ Violação em ${file.replace(process.cwd(), '')}:${index + 1}`);
          console.error(`   Classes proibidas encontradas: ${matches.join(', ')}`);
          console.error(`   Contexto: ${line.trim()}\n`);
          hasErrors = true;
          errorCount++;
        }
      }
      
      const foundForbiddenStrings = FORBIDDEN_STRINGS.filter(f => line.includes(`>${f}<`) || line.includes(`"${f}"`) || line.includes(`'${f}'`));
      if (foundForbiddenStrings.length > 0 && !line.includes('eslint-disable') && !file.includes('ExecutiveBusinessTerminologyRegistry') && !file.includes('runDesignTypographyAudit') && !file.includes('BalanceSheetTechnicalIndicatorRegistry')) {
        console.error(`❌ Vazamento Técnico em ${file.replace(process.cwd(), '')}:${index + 1}`);
        console.error(`   Termos crus/inglês ou N/A encontrados: ${foundForbiddenStrings.join(', ')}`);
        console.error(`   Contexto: ${line.trim()}\n`);
        hasErrors = true;
        errorCount++;
      }
      
      const textOpacityMatches = line.match(/(text-[a-zA-Z-]+-[0-9]{3}\/[0-9]+|text-(white|black|foreground|muted-foreground|executive-[a-zA-Z-]+)\/[0-9]+|opacity-(10|20|25|30|40|50|60|70|75|80|85|90|95))/g);
      if (textOpacityMatches) {
        if (line.includes('eslint-disable-next-line') || line.includes('// @allow-opacity')) return;
        
        console.error(`❌ Violação em ${file.replace(process.cwd(), '')}:${index + 1}`);
        console.error(`   Tentativa de manipulação de contraste via opacidade: ${textOpacityMatches.join(', ')}`);
        console.error(`   UI primitives e páginas não podem usar opacidades arbitrárias para corrigir contraste. Use tokens semânticos e inverse (ex: text-executive-inverse-secondary).`);
        console.error(`   Contexto: ${line.trim()}\n`);
        hasErrors = true;
        errorCount++;
      }
    }

    if (mode === 'bp' && line.includes('<details') && !file.includes('executive-accordion.tsx')) {
      console.error(`❌ Violação em ${file.replace(process.cwd(), '')}:${index + 1}`);
      console.error(`   Uso de <details> bruto detectado. Use o componente canônico <ExecutiveAccordion>.`);
      console.error(`   Contexto: ${line.trim()}\n`);
      hasErrors = true;
      errorCount++;
    }

    // Block "Score Executivo" in titles
    if (line.match(/<ExecutiveHeading.*?>.*?Score Executivo.*?<\/ExecutiveHeading>/i) || line.match(/title=\{?['"]Score Executivo['"]\}?/i)) {
      console.error(`❌ Violação em ${file.replace(process.cwd(), '')}:${index + 1}`);
      console.error(`   Uso de "Score Executivo" como protagonista proibido pela arquitetura v2.0.`);
      hasErrors = true;
      errorCount++;
    }

    // Pilar 17 (Explainability by Construction) - Block "Fator Determinante"
    if (line.includes('Fator Determinante')) {
      console.error(`❌ Violação Pilar 17 em ${file.replace(process.cwd(), '')}:${index + 1}`);
      console.error(`   Redundância Narrativa detectada: O uso de "Fator Determinante" é obsoleto e foi substituído por "Principal Driver Institucional" na Arquitetura v3.1.`);
      hasErrors = true;
      errorCount++;
    }

    // Pilar 17 - Block ExecutiveOpinion wrapper
    if (line.includes('<ExecutiveOpinion') || line.includes('import { ExecutiveOpinion }')) {
      console.error(`❌ Violação Pilar 17 em ${file.replace(process.cwd(), '')}:${index + 1}`);
      console.error(`   Paralelismo Arquitetural detectado: <ExecutiveOpinion> foi descontinuado em favor do canônico <ExecutiveDecisionPanel>.`);
      hasErrors = true;
      errorCount++;
    }

    // Architecture v4.0 - Block ExecutiveSummaryCard
    if (line.includes('<ExecutiveSummaryCard') && !file.includes('executive-summary-card.tsx')) {
      console.error(`❌ Violação Arquitetural v4.0 em ${file.replace(process.cwd(), '')}:${index + 1}`);
      console.error(`   Componente Deprecado: <ExecutiveSummaryCard> foi descontinuado. Use a composição canônica <ExecutiveDecisionPanel> + <ExecutiveEvidenceGrid>.`);
      hasErrors = true;
      errorCount++;
    }

    // Architecture v4.0 - Block ExecutiveSummarySection
    if (line.includes('<ExecutiveSummarySection') && !file.includes('executive-summary-section.tsx') && !file.includes('executive-summary-card.tsx')) {
      console.error(`❌ Violação Arquitetural v4.0 em ${file.replace(process.cwd(), '')}:${index + 1}`);
      console.error(`   Componente Deprecado: <ExecutiveSummarySection> foi descontinuado. Use a composição canônica <ExecutiveDecisionPanel> + <ExecutiveEvidenceGrid>.`);
      hasErrors = true;
      errorCount++;
    }

    // Block hardcoded i18n leaks
    const hardcodedLeaks = line.match(/(?<!\/\/.*)(\[\[.*?\]\]|\bN\/A\b|\bScore\b|\bDriver\b|\bConfidence\b|\bWorking Capital\b|\bDebt-to-Equity\b|\bCurrent Ratio\b|\bQuick Ratio\b|\bCash Ratio\b)/g);
    if (hardcodedLeaks && file.includes('/components/') && !line.includes('eslint-disable') && !line.includes('className') && !line.includes('variant=')) {
      console.error(`❌ Violação em ${file.replace(process.cwd(), '')}:${index + 1}`);
      console.error(`   Vazamento de idioma ou termo não traduzido (i18n): ${hardcodedLeaks.join(', ')}`);
      hasErrors = true;
      errorCount++;
    }

    // Architecture v5.0 - Block Índice Patrimonial hero out of Audit
    if (line.match(/Índice Patrimonial/i) && file.includes('/components/pages/balance-sheet/') && !file.includes('BalanceSheetAuditLayerSection') && !file.includes('mappers.ts') && !line.includes('eslint-disable')) {
      console.error(`❌ Violação Arquitetural v5.0 em ${file.replace(process.cwd(), '')}:${index + 1}`);
      console.error(`   Índice Patrimonial duplicado: Este conceito pertence exclusivamente à Governança Metodológica (AuditLayer).`);
      hasErrors = true;
      errorCount++;
    }

    if (mode === 'bp' && (
      line.includes('bg-rose-50 ') || line.includes('bg-rose-100 ') || line.includes('bg-rose-50"') || line.includes('bg-rose-100"') ||
      line.includes('bg-amber-50 ') || line.includes('bg-amber-100 ') || line.includes('bg-amber-50"') || line.includes('bg-amber-100"') ||
      line.includes('bg-emerald-50 ') || line.includes('bg-emerald-100 ') || line.includes('bg-emerald-50"') || line.includes('bg-emerald-100"') ||
      line.includes('bg-blue-50 ') || line.includes('bg-blue-100 ') || line.includes('bg-blue-50"') || line.includes('bg-blue-100"') ||
      line.includes('bg-rose-') || line.includes('bg-amber-') || line.includes('bg-emerald-') || line.includes('bg-blue-') || line.includes('bg-red-') ||
      line.includes('text-rose-') || line.includes('text-amber-') || line.includes('text-emerald-') || line.includes('text-blue-') || line.includes('text-red-') ||
      line.includes('border-rose-') || line.includes('border-amber-') || line.includes('border-emerald-') || line.includes('border-blue-') || line.includes('border-red-') ||
      line.includes('badgeColor.includes') || line.includes('badgeClass') || line.includes('getBadgeColor') || line.includes('getBadgeLabel') || line.includes('statusBadge={<span')
    ) && !file.includes('executive-badge.tsx') && !file.includes('executive-risk-card.tsx')) {
      console.error(`❌ Violação em ${file.replace(process.cwd(), '')}:${index + 1}`);
      console.error(`   Uso de classes de severidade manuais ou arquitetura de badge concorrente detectadas. Use <ExecutiveBadge variant="...">.`);
      console.error(`   Contexto: ${line.trim()}\n`);
      hasErrors = true;
      errorCount++;
    }

    if (mode === 'bp' && (
      line.includes('badgeLabel="WARNING"') || line.includes('badgeLabel="ATTENTION"') || line.includes('badgeLabel="SUCCESS"') || 
      line.includes('badgeLabel="CRITICAL"') || line.includes('badgeLabel="NEUTRAL"') || line.includes('badgeLabel="INFO"') ||
      line.includes("badgeLabel='WARNING'") || line.includes("badgeLabel='ATTENTION'") || line.includes("badgeLabel='SUCCESS'") || 
      line.includes("badgeLabel='CRITICAL'") || line.includes("badgeLabel='NEUTRAL'") || line.includes("badgeLabel='INFO'") ||
      line.includes('>WARNING<') || line.includes('>ATTENTION<') || line.includes('>SUCCESS<') || 
      line.includes('>CRITICAL<') || line.includes('>NEUTRAL<') || line.includes('>INFO<')
    )) {
      console.error(`❌ Violação em ${file.replace(process.cwd(), '')}:${index + 1}`);
      console.error(`   Uso de texto em inglês proibido para badges. Use o idioma da interface (pt-BR).`);
      console.error(`   Contexto: ${line.trim()}\n`);
      hasErrors = true;
      errorCount++;
    }

    if (mode === 'bp' && (line.includes('>N/A<') || line.includes("'N/A'") || line.includes('"N/A"') || line.includes(' N/A ') || line.includes(' N/A<'))) {
      console.error(`❌ Violação em ${file.replace(process.cwd(), '')}:${index + 1}`);
      console.error(`   Uso hardcoded de "N/A" detectado. Use o texto localizado vindo da ViewModel/i18n.`);
      console.error(`   Contexto: ${line.trim()}\n`);
      hasErrors = true;
      errorCount++;
    }

    if (mode === 'bp' && line.includes('className') && line.includes('flex') && line.match(/\bp-[0-9]+\b/) && line.includes('rounded-') && line.includes('shadow-') && !file.includes('executive-summary-card.tsx') && !file.includes('executive-health-summary-card.tsx') && !file.includes('executive-metric-card.tsx') && !file.includes('Toolbar')) {
      console.error(`❌ Violação em ${file.replace(process.cwd(), '')}:${index + 1}`);
      console.error(`   Tentativa de montagem manual de Card (flex + p- + rounded- + shadow-). Use o componente canônico <ExecutiveSummaryCard> ou <ExecutiveMetricCard>.`);
      console.error(`   Contexto: ${line.trim()}\n`);
      hasErrors = true;
      errorCount++;
    }

    if (mode === 'bp' && (line.includes('<ExecutiveSummaryCard') || line.includes('<ExecutiveHeroMetricPanel')) && (line.includes('w-[') || line.includes('min-w-') || line.includes('max-w-') || line.includes('flex-row'))) {
      if (!file.includes('executive-summary-card.tsx')) {
        console.error(`❌ Violação em ${file.replace(process.cwd(), '')}:${index + 1}`);
        console.error(`   Injeção local de largura ou direção flex não permitida em componentes Hero. O dimensionamento deve ser governado internamente por tokens canônicos.`);
        console.error(`   Contexto: ${line.trim()}\n`);
        hasErrors = true;
        errorCount++;
      }
    }

    if (mode === 'bp' && line.match(/\[\[.*?\]\]/)) {
      console.error(`❌ Violação em ${file.replace(process.cwd(), '')}:${index + 1}`);
      console.error(`   Vazamento de chave de tradução (ex: [[STATUS.HEALTHY]]). Certifique-se de que a string ou fallback não falham e não injetam a chave crua na UI.`);
      console.error(`   Contexto: ${line.trim()}\n`);
      hasErrors = true;
      errorCount++;
    }

    if (mode === 'bp' && line.includes('ExecutiveText') && (line.includes('text-muted-foreground') || line.includes('opacity-') || line.includes('text-slate-200') || line.includes('text-executive-muted')) && (line.includes('variant="body"') || line.includes('as="p"'))) {
      if (!file.includes('executive-typography.tsx')) {
        console.error(`❌ Violação em ${file.replace(process.cwd(), '')}:${index + 1}`);
        console.error(`   Uso excessivo de opacidade/muting em subtítulos ou narrativas executivas. Use variant="moduleSubtitle" ou similar para melhor contraste e legibilidade.`);
        console.error(`   Contexto: ${line.trim()}\n`);
        hasErrors = true;
        errorCount++;
      }
    }

    if (mode === 'bp' && line.includes('<ExecutiveBadge') && line.includes('className=')) {
      if (
        line.includes('bg-') || line.includes('text-') || line.includes('border-') ||
        line.includes('rounded-') || line.includes('px-') || line.includes('py-') ||
        line.includes('h-') || line.includes('min-h-') || line.includes('font-') ||
        line.includes('leading-') || line.includes('tracking-')
      ) {
        console.error(`❌ Violação em ${file.replace(process.cwd(), '')}:${index + 1}`);
        console.error(`   Tentativa de sobrescrita de className proibida em <ExecutiveBadge>. Use apenas 'variant' e 'children'.`);
        console.error(`   Contexto: ${line.trim()}\n`);
        hasErrors = true;
        errorCount++;
      }
    }

    if (mode === 'bp' && (line.includes('<ExecutiveSummaryCard') || line.includes('<ExecutiveMetricCard')) && line.includes('className=')) {
      if (
        line.match(/\bw-[a-zA-Z0-9\[\]\-\.]+\b/) || 
        line.match(/\bbasis-[a-zA-Z0-9\[\]\-\.]+\b/) || 
        line.match(/\bmax-w-[a-zA-Z0-9\[\]\-\.]+\b/) || 
        line.match(/\bgap-[a-zA-Z0-9\[\]\-\.]+\b/) || 
        line.match(/\bspace-[xy]-[a-zA-Z0-9\[\]\-\.]+\b/) || 
        line.match(/\bp[xy]?-[a-zA-Z0-9\[\]\-\.]+\b/) || 
        (line.match(/\bm[xy]?-[a-zA-Z0-9\[\]\-\.]+\b/) && !line.match(/\bmb-[0-9]+\b/) && !line.match(/\bmt-[0-9]+\b/)) // allow mb- and mt- for external spacing but not internal
      ) {
        console.error(`❌ Violação em ${file.replace(process.cwd(), '')}:${index + 1}`);
        console.error(`   Tentativa de alterar a densidade/estrutura do Componente Canônico via className. Use a propriedade 'density' ou 'layout'.`);
        console.error(`   Contexto: ${line.trim()}\n`);
        hasErrors = true;
        errorCount++;
      }
    }

    if (mode === 'bp' && (line.includes('title=') || line.includes('label=')) && (line.includes('uppercase') || line.match(/\btracking-[a-zA-Z0-9\[\]\-\.]+\b/))) {
      console.error(`❌ Violação em ${file.replace(process.cwd(), '')}:${index + 1}`);
      console.error(`   Uso de uppercase ou tracking-* em títulos de cards (KPIs) detectado. A leitura executiva exige formatação padrão.`);
      console.error(`   Contexto: ${line.trim()}\n`);
      hasErrors = true;
      errorCount++;
    }

    if (mode === 'bp' && (line.includes('title=') || line.includes('label=')) && line.includes('variant="microLabel"')) {
      console.error(`❌ Violação em ${file.replace(process.cwd(), '')}:${index + 1}`);
      console.error(`   O uso de 'microLabel' para título principal de KPI é proibido. 'microLabel' deve ser usado apenas para metadados (ex: Confiança, Score).`);
      console.error(`   Contexto: ${line.trim()}\n`);
      hasErrors = true;
      errorCount++;
    }

    if (mode === 'bp' && !file.includes('executive-chart.tsx') && !file.includes('executive-distribution-card.tsx')) {
      if (line.match(/from\s+['"]recharts['"]/)) {
        console.error(`❌ Violação em ${file.replace(process.cwd(), '')}:${index + 1}`);
        console.error(`   Importação direta de 'recharts' proibida. Use <ExecutiveChart> do design system.`);
        console.error(`   Contexto: ${line.trim()}\n`);
        hasErrors = true;
        errorCount++;
      }
      if (line.match(/<(Area|Line|Bar|Pie|CartesianGrid|XAxis|YAxis|Tooltip|Legend|Cell|ResponsiveContainer)\b.*?(stroke=|fill=|fontSize=|fontWeight=|tick=|contentStyle=|wrapperStyle=|labelStyle=|legendType=|activeDot=|dot=|label=\{\{|content=\{<|linearGradient|defs)/)) {
        console.error(`❌ Violação em ${file.replace(process.cwd(), '')}:${index + 1}`);
        console.error(`   Propriedades de estilo local de gráficos (stroke, fill, fontSize, etc) e elementos customizados são proibidos. Use as variantes canônicas no <ExecutiveChart>.`);
        console.error(`   Contexto: ${line.trim()}\n`);
        hasErrors = true;
        errorCount++;
      }
      
      if (line.match(/(opacity-(10|20|30|40|50|60)|text-muted\/(20|30|40|50)|text-slate-(200|300|400)|text-gray-(200|300|400))/)) {
        console.error(`❌ Violação em ${file.replace(process.cwd(), '')}:${index + 1}`);
        console.error(`   Classes com aparência de desabilitado (opacity-20, text-muted/20, text-slate-200, etc) são proibidas para evitar subtítulos apagados. Use <ExecutiveText variant="moduleSubtitle">.`);
        console.error(`   Contexto: ${line.trim()}\n`);
        hasErrors = true;
        errorCount++;
      }
    }

    if (mode === 'bp' && (file.includes('card') || line.includes('description'))) {
      if (line.includes('variant="caption"') && (line.includes('description') || line.includes('rationale'))) {
        console.error(`❌ Violação em ${file.replace(process.cwd(), '')}:${index + 1}`);
        console.error(`   Uso da variante 'caption' para descrições longas proibido. Use 'metricDescription' ou 'bodyStandard'.`);
        console.error(`   Contexto: ${line.trim()}\n`);
        hasErrors = true;
        errorCount++;
      }
      
      if (line.includes('text-executive-muted') && (line.includes('description') || line.includes('rationale'))) {
        console.error(`❌ Violação em ${file.replace(process.cwd(), '')}:${index + 1}`);
        console.error(`   Uso de 'text-executive-muted' em descrições longas proibido para evitar falta de contraste. Use 'metricDescription'.`);
        console.error(`   Contexto: ${line.trim()}\n`);
        hasErrors = true;
        errorCount++;
      }

      if (line.match(/(mt-[0-9]+|mb-[0-9]+|my-[0-9]+|pt-[0-9]+|pb-[0-9]+|py-[0-9]+)\b/) && line.includes('className=')) {
        // Exceções permitidas se explicitamente justificadas
        if (!line.includes('// @allow-margin')) {
          console.error(`❌ Violação Anatômica em ${file.replace(process.cwd(), '')}:${index + 1}`);
          console.error(`   Injeção de margens locais para forçar alinhamentos nos cards é proibida. A anatomia do card deve usar flex/grid ou min-height fixos (Contrato Institucional).`);
          console.error(`   Contexto: ${line.trim()}\n`);
          hasErrors = true;
          errorCount++;
        }
      }
    }

    if (mode === 'bp') {
      const englishLeaks = line.match(/\b(CONF:|Conf:|Confidence:|CONF|Conf|Confidence|Debt-to-Equity|Working Capital|Current Ratio|Quick Ratio|Cash Ratio|Funding Capacity)\b/);
      if (englishLeaks && !line.includes('eslint-disable') && !file.includes('executive-localization-registry.ts')) {
        // Skip keys in objects like 'metricConfidence: ...'
        if (!line.match(/[a-zA-Z0-9]+(Confidence|Conf):/)) {
          console.error(`❌ Vazamento de Idioma em ${file.replace(process.cwd(), '')}:${index + 1}`);
          console.error(`   String literal de domínio ou idioma detectada (${englishLeaks[0]}). Use ExecutiveLocalizationRegistry ou abstração i18n para resolver a tradução.`);
          console.error(`   Contexto: ${line.trim()}\n`);
          hasErrors = true;
          errorCount++;
        }
      }
    }

    // Pilar 9 - Bloquear palavras informais (ruim, bom, ótimo, péssimo, vermelho, verde)
    const informalWords = line.match(/\b(ruim|bom|ótimo|péssimo|vermelho|verde)\b/i);
    if (informalWords && !line.includes('eslint-disable') && !file.includes('runDesignTypographyAudit')) {
      console.error(`❌ Violação Arquitetural v5.4 em ${file.replace(process.cwd(), '')}:${index + 1}`);
      console.error(`   Vocabulário proibido detectado: '${informalWords[0]}'. A linguagem executiva deve ser formal (ex: 'Alerta', 'Adequado', 'Saudável', 'Crítico').`);
      hasErrors = true;
      errorCount++;
    }

    // Pilar 9 - Evitar aninhamento de P explícito na mesma linha
    if (line.match(/<p[^>]*>.*?<p[^>]*>/) || line.match(/<ExecutiveText[^>]*as="p"[^>]*>.*?<p[^>]*>/) || line.match(/<ExecutiveText[^>]*as="p"[^>]*>.*?<ExecutiveText[^>]*as="p"/)) {
      console.error(`❌ Violação DOM v5.4 em ${file.replace(process.cwd(), '')}:${index + 1}`);
      console.error(`   Aninhamento proibido: Não é permitido aninhar elementos <p> (ou ExecutiveText as="p") dentro de outros <p>, pois causa erros de hidratação no React.`);
      hasErrors = true;
      errorCount++;
    }

    // Prioridade 10: Validações Constitucionais
    if (mode === 'bp') {
      // 1. Ocorrência de EXCELLENT em cenários de liquidez excedente operacional
      if (file.includes('CapitalEfficiencyRuleSet') && line.includes('EXCELLENT') && line.includes('liquidez excedente')) {
         console.error(`❌ Violação Constitucional em ${file.replace(process.cwd(), '')}:${index + 1}`);
         console.error(`   A classificação EXCELLENT não deve ser associada a cenários de liquidez excedente operacional.`);
         hasErrors = true;
         errorCount++;
      }

      // 2. Termos técnicos em inglês sem tradução (reforço)
      const unmappedTechTerms = line.match(/\b(Working Capital|Debt-to-Equity|Current Ratio|Quick Ratio|Cash Ratio|Loss Absorption Capacity|Capital Erosion Velocity|Equity Quality Index|Equity Buffer|Survival Index)\b/);
      if (unmappedTechTerms && !file.includes('Registry') && !file.includes('Engine') && !file.includes('Audit')) {
         console.error(`❌ Violação Constitucional em ${file.replace(process.cwd(), '')}:${index + 1}`);
         console.error(`   Termo técnico não traduzido encontrado: ${unmappedTechTerms[0]}. Use a camada de tradução.`);
         hasErrors = true;
         errorCount++;
      }

      // 3. Presença de NaN, N/A, null ou undefined renderizados
      if (line.match(/>(NaN|null|undefined)</) || line.match(/=\s*\{?(NaN|null|undefined)\}?>/)) {
         console.error(`❌ Violação Constitucional em ${file.replace(process.cwd(), '')}:${index + 1}`);
         console.error(`   Vazamento de valor técnico (NaN, null, undefined) na interface gráfica.`);
         hasErrors = true;
         errorCount++;
      }

      // 4. Mais de 4 KPIs por dimensão
      if (file.includes('evidence-grid') && line.includes('.map(') && !line.includes('slice(') && !line.includes('displayedMetrics')) {
         console.error(`❌ Violação Constitucional em ${file.replace(process.cwd(), '')}:${index + 1}`);
         console.error(`   O Executive Evidence Grid deve aplicar um limite máximo de 4 KPIs por dimensão (ex: .slice(0, 4)).`);
         hasErrors = true;
         errorCount++;
      }

      // 5. Contradições de diagnóstico
      if (file.includes('PatrimonialExecutiveInterpretationEngine') && line.includes('eficiência máxima') && !line.includes('excedente') && !line.includes('capital_allocation')) {
         if (line.includes('A estrutura patrimonial é forte e resiliente') && !line.includes('stage === \'capital_allocation\'')) {
           console.error(`❌ Violação Constitucional em ${file.replace(process.cwd(), '')}:${index + 1}`);
           console.error(`   A Tese Patrimonial não está protegendo contra afirmações de eficiência máxima em cenários de capital excedente.`);
           hasErrors = true;
           errorCount++;
         }
      }

      // 6. Contradição/Throw do React ViewModel
      if (file.includes('ExecutiveConsistencyEngine') && line.includes('throw new Error') && !line.includes('mode === \'strict\'')) {
         console.error(`❌ Violação Constitucional em ${file.replace(process.cwd(), '')}:${index + 1}`);
         console.error(`   Contradição não deve dar throw em produção. Use o fallback institucional.`);
         hasErrors = true;
         errorCount++;
      }
    }

  });
}

if (hasErrors) {
  console.error(`\n🚨 FALHA DE GOVERNANÇA: Encontradas ${errorCount} violações tipográficas (hardcodes) em páginas executivas.`);
  console.error(`   Substitua essas classes pelos componentes canônicos: <ExecutiveText>, <ExecutiveHeading>, <ExecutiveMetric> ou <ExecutiveBadge>.`);
  
  if (mode === 'report') {
    console.log('\n⚠️ Modo "report" ativo. As violações acima não vão quebrar a build (Exit code 0).');
    process.exit(0);
  } else {
    // Nos modos strict e bp, a auditoria falha a pipeline
    process.exit(1);
  }
} else {
  console.log('✅ SUCESSO: Nenhuma violação tipográfica encontrada nas páginas (A Constituição Visual está preservada).');
  process.exit(0);
}
