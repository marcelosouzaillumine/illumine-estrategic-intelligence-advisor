version: "2.2"
name: "Illumine Consultoria | Gestão, Propósito e Alta Performance"
description: "Sistema visual para interfaces da Illumine Consultoria, com foco em governança, mentoria empresarial, análise integrada, propósito e alta performance."
defaultMode: "light"
supportsDark: true
archetype: "shadcn-neutral"

chips:
  - "Primary CTA #0E1C2C"
  - "Accent #FF8552"
  - "Support #BAB86C"
  - "Radius 24px"
  - "Professional and purposeful voice"

consumer_contract:
  standalone: true
  goal: "Generate Illumine-style interfaces from this file alone."
  priority_order:
    - "Use semantic tokens first: colors, dark, typography, spacing, rounded, shadows, motion."
    - "Apply component recipes exactly before inventing variants."
    - "Use prose sections for judgment when a token is ambiguous."
    - "Respect Do's and Don'ts over generic framework defaults."
  mode_rule: "Light mode is the default surface; dark mode is opt-in via .dark or [data-theme=dark]. Primary CTAs (#0E1C2C) hold across modes unless dark slot overrides them."
  font_rule: "Use graphikMedium / graphikRegular when available; otherwise apply the declared CSS fallbacks without blocking implementation."
  asset_rule: "Do not require logos, photography, or proprietary assets. Use typography, color, spacing, and component behavior to express the system."
  accessibility_rule: "Ship WCAG AA contrast, visible focus rings, keyboard-operable controls, and no body text below 16px."

colors:
  primary: "#0E1C2C"
  primary-foreground: "#FFFFFF"

  secondary: "#FF8552"
  secondary-foreground: "#0E1C2C"

  accent: "#FF8552"
  accent-foreground: "#0E1C2C"

  insight: "#BAB86C"
  insight-foreground: "#0E1C2C"

  tertiary: "#BAB86C"
  tertiary-foreground: "#0E1C2C"

  neutral: "#6B7280"

  background: "#FFFFFF"
  foreground: "#0E1C2C"

  surface: "#FFFFFF"
  surface-foreground: "#0E1C2C"

  card: "#FFFFFF"
  card-foreground: "#0E1C2C"

  popover: "#FFFFFF"
  popover-foreground: "#0E1C2C"

  muted: "#E5E5E5"
  muted-foreground: "#6B7280"

  accent: "#FF8552"
  accent-foreground: "#0E1C2C"

  destructive: "#D01D1C"
  destructive-foreground: "#FFFFFF"

  border: "#E5E5E5"
  input: "#FFFFFF"
  ring: "#FF8552"

  success: "#0C7A3A"
  warning: "#C8A94A"
  critical: "#D01D1C"
  info: "#0E1C2C"

  chart-1: "#0E1C2C"
  chart-2: "#FF8552"
  chart-3: "#BAB86C"
  chart-4: "#E5E5E5"
  chart-5: "#6B7280"

  surface-low: "#FFFFFF"
  surface-high: "#F7F7F5"
  surface-highest: "#F2F2EF"
  surface-container-low: "#FFFFFF"
  surface-container: "#FCFCFB"
  surface-container-high: "#F7F7F5"
  surface-container-highest: "#F2F2EF"
  surface-bright: "#FFFFFF"
  surface-dim: "#F2F2EF"
  surface-inverse: "#0E1C2C"
  surface-inverse-foreground: "#FFFFFF"

  primary-deep: "#07111C"
  primary-soft: "#1B3148"
  paper: "#FFFFFF"
  paper-deep: "#E5E5E5"
  ink: "#0E1C2C"
  ink-soft: "#1B3148"
  ink-muted: "#6B7280"

  illumine-blue: "#0E1C2C"
  illumine-orange: "#FF8552"
  illumine-olive: "#BAB86C"
  illumine-gray: "#E5E5E5"
  illumine-white: "#FFFFFF"

dark:
  background: "#0E1C2C"
  foreground: "#FFFFFF"
  primary: "#FF8552"
  primary-foreground: "#0E1C2C"
  secondary: "#BAB86C"
  secondary-foreground: "#0E1C2C"
  card: "#111F30"
  card-foreground: "#FFFFFF"
  muted: "#1B3148"
  muted-foreground: "#E5E5E5"
  border: "#ffffff1a"
  ring: "#FF8552"

fonts:
  display: "'graphikMedium', Arial, sans-serif"
  body: "'graphikRegular', Arial, sans-serif"
  eyebrow: "'graphikMedium', Arial, sans-serif"
  mono: "'graphikRegular', Arial, Helvetica, sans-serif"
  sans: "'graphikRegular', Arial, sans-serif"
  serif: null

typography:
  h1:
    fontFamily: "'graphikMedium', Arial, Helvetica, sans-serif"
    fontSize: 56px
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  h2:
    fontFamily: "'graphikMedium', Arial, Helvetica, sans-serif"
    fontSize: 40px
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  h3:
    fontFamily: "'graphikMedium', Arial, Helvetica, sans-serif"
    fontSize: 32px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  h4:
    fontFamily: "'graphikMedium', Arial, Helvetica, sans-serif"
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "0em"
  body-lg:
    fontFamily: "'graphikRegular', Arial, Helvetica, sans-serif"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
  body-md:
    fontFamily: "'graphikRegular', Arial, Helvetica, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
  body-sm:
    fontFamily: "'graphikRegular', Arial, Helvetica, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "0em"
  label:
    fontFamily: "'graphikMedium', Arial, Helvetica, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0em"

icons:
  mapping:
    icon-primary: "#0E1C2C"
    icon-secondary: "#6B7280"
    icon-action: "#FF8552"
    icon-insight: "#BAB86C"
    icon-warning: "#C8A94A"
    icon-success: "#0C7A3A"
    icon-critical: "#D01D1C"
  rules:
    - "All icons must use semantic tokens."
    - "No multicolor icons or gradients."

spacing:
  "2": "0.5rem"
  "3": "0.75em"
  "4": "1em"
  xs: "0.35em"
  sm: "0.5rem"
  md: "0.625em"
  lg: "0.75em"
  xl: "1em"
  "2.5": "0.625em"

rounded:
  none: "0px"
  sm: "12px"
  md: "24px"
  lg: "32px"
  xl: "48px"
  full: "9999px"
  button: "12px"
  card: "32px"
  input: "24px"

shadows:
  xs: "0 1px 2px rgba(14, 28, 44, 0.04)"
  sm: "0 2px 8px rgba(14, 28, 44, 0.06)"
  md: "0 8px 16px rgba(14, 28, 44, 0.08)"
  lg: "0 12px 32px rgba(14, 28, 44, 0.10)"
  rules:
    - "Quiet Luxury aesthetic: Shadows must be soft, low opacity, maximum 3 elevation levels, and no dramatic blur."

borders:
  rules:
    - "Preferred: 1px solid semantic-border."
    - "Avoid: 2px+ borders unless semantically justified."

motion:
  duration-faster: "150ms"
  duration-gentle: "350ms"
  duration-slow: "650ms"
  ease-out: "cubic-bezier(0, 0, 0.2, 1)"
  ease-decelerate-mid: "cubic-bezier(0.21,0,0.25,0.99)"

elevation:
  flat: "none"
  raised: "0 4px 12px rgba(14, 28, 44, 0.08)"
  floating: "0 8px 24px rgba(14, 28, 44, 0.12)"
  overlay: "0 16px 40px rgba(14, 28, 44, 0.16)"
  modal: "0 24px 64px rgba(14, 28, 44, 0.24)"

components:
  button-primary:
    backgroundColor: "#0E1C2C"
    textColor: "#FFFFFF"
    borderColor: "#0E1C2C"
    typography: "graphikMedium 14px/1.4 500"
    rounded: "12px"
    padding: "0.5rem 1em"
    shadow: "0 4px 12px rgba(14, 28, 44, 0.08)"

  button-primary-hover:
    backgroundColor: "#07111C"
    textColor: "#FFFFFF"
    borderColor: "#07111C"
    shadow: "0 8px 24px rgba(14, 28, 44, 0.12)"

  button-secondary:
    backgroundColor: "#FF8552"
    textColor: "#0E1C2C"
    borderColor: "#FF8552"
    typography: "graphikMedium 14px/1.4 500"
    rounded: "24px"
    padding: "0.5rem 1em"

  button-secondary-hover:
    backgroundColor: "#E96F3D"
    textColor: "#0E1C2C"
    borderColor: "#E96F3D"

  button-tertiary:
    backgroundColor: "#BAB86C"
    textColor: "#0E1C2C"
    borderColor: "#BAB86C"
    typography: "graphikMedium 14px/1.4 500"
    rounded: "24px"
    padding: "0.5rem 1em"

  button-ghost:
    backgroundColor: "transparent"
    textColor: "#0E1C2C"
    borderColor: "transparent"
    typography: "graphikMedium 14px/1.4 500"
    rounded: "24px"
    padding: "0"

  card:
    backgroundColor: "#FFFFFF"
    textColor: "#0E1C2C"
    borderColor: "#E5E5E5"
    rounded: "32px"
    padding: "0.75em"
    shadow: "0 4px 12px rgba(14, 28, 44, 0.08)"

  card-hover:
    backgroundColor: "#FFFFFF"
    textColor: "#0E1C2C"
    rounded: "32px"
    shadow: "0 8px 24px rgba(14, 28, 44, 0.12)"

  input-text:
    backgroundColor: "#FFFFFF"
    textColor: "#0E1C2C"
    borderColor: "#E5E5E5"
    typography: "graphikRegular 16px/1.5 400"
    rounded: "24px"
    padding: "0.5rem 1em"
    focusBorderColor: "#FF8552"
    focusRing: "#FF8552"

  badge-default:
    backgroundColor: "#BAB86C"
    textColor: "#0E1C2C"
    borderColor: "#BAB86C"
    typography: "graphikMedium 14px/1.4 500"
    rounded: "9999px"
    padding: "0.5rem"

  nav-header:
    backgroundColor: "#FFFFFF"
    textColor: "#0E1C2C"
    borderColor: "#E5E5E5"
    typography: "graphikMedium 14px/1.4 500"

  inverse-section:
    backgroundColor: "#0E1C2C"
    textColor: "#FFFFFF"
    rounded: "0px"
    padding: "1em"

  editorial-hero:
    backgroundColor: "#FFFFFF"
    textColor: "#0E1C2C"
    typography: "graphikMedium 56px/1.1 500"
    rounded: "0px"
    padding: "1em"

preview_tokens:
  button_primary_bg: "#0E1C2C"
  button_primary_text: "#FFFFFF"
  button_primary_border: "#0E1C2C"

  button_secondary_bg: "#FF8552"
  button_secondary_text: "#0E1C2C"
  button_secondary_border: "#FF8552"

  button_tertiary_bg: "#BAB86C"
  button_tertiary_text: "#0E1C2C"
  button_tertiary_border: "#BAB86C"

  surface_bg: "#FFFFFF"
  card_bg: "#FFFFFF"
  text: "#0E1C2C"
  text_muted: "#6B7280"
  border: "#E5E5E5"
  accent: "#FF8552"

  button_radius: "12px"
  card_radius: "24px"
  input_radius: "24px"

brand_primitives:
  case-eyebrow: "none"
  case-btn: "none"
  case-marquee: "none"
  case-nav-brand: "none"
  case-section-heading: "none"

  motion-press: "scale(0.98)"
  motion-hover-opacity: "0.92"

  btn-padx: "1em"
  btn-pady: "0.5rem"
  btn-shadow: "0 4px 12px rgba(14, 28, 44, 0.08)"
  btn-shadow-hover: "0 8px 24px rgba(14, 28, 44, 0.12)"
  btn-active-bg: "#07111C"
  btn-border-width: "1px"
  btn-secondary-border-width: "1px"

  nav-cta-padx: "1em"

  card-pad: "0.75em"
  card-pad-sm: "0.75em"
  card-shadow: "0 4px 12px rgba(14, 28, 44, 0.08)"
  card-shadow-hover: "0 8px 24px rgba(14, 28, 44, 0.12)"

  hairline-width: "1px"
  hairline-style: "solid"
  hairline-color: "#E5E5E5"
  hairline-card: "#E5E5E5"
  hairline-input: "#E5E5E5"
  hairline-table: "#E5E5E5"

  nav-padx: "0.75em"
  section-padx: "0.75em"
  section-pady: "1em"
  surface-pad: "0.75em"
  container-max: "1076px"
  spacing: "0.35em"

aliases:
  "--block-1": "--surface-bright"
  "--block-2": "--surface-container-low"
  "--block-3": "--surface-container"
  "--block-4": "--surface-container-high"
  "--block-5": "--surface-container-highest"
  "--block-6": "--surface-dim"
  "--block-7": "--surface-inverse"
  "--block-7-foreground": "--surface-inverse-foreground"

  "--text-h1": "--text-heading"
  "--text-h2": "--text-title"
  "--text-h3": "--text-subtitle"
  "--text-card-title": "--text-title"
  "--text-lead": "--text-body"
  "--text-nav": "--text-label"
  "--text-btn": "--text-label"
  "--text-btn-sm": "--text-caption"
  "--text-eyebrow": "--text-caption"
  "--text-meta": "--text-caption"

  "--shadow-1": "--elevation-flat"
  "--shadow-2": "--elevation-raised"
  "--shadow-3": "--elevation-floating"
  "--shadow-4": "--elevation-overlay"

  "--duration-base": "--duration-gentle"
  "--radius-pill": "--radius-full"

  "--font-weight-display": "500"
  "--font-weight-heading": "500"
  "--font-weight-body": "400"
  "--font-weight-lead": "400"
  "--font-weight-nav": "500"
  "--font-weight-brand": "500"
  "--font-weight-btn": "500"
  "--font-weight-emphasis": "500"
  "--font-weight-eyebrow": "500"

  "--tracking-display": "-0.02em"
  "--tracking-h1": "-0.02em"
  "--tracking-h2": "-0.01em"
  "--tracking-h3": "-0.01em"
  "--tracking-lead": "0em"
  "--tracking-body": "0em"
  "--tracking-btn": "0em"
  "--tracking-eyebrow": "0em"
  "--tracking-marquee": "0em"

  "--leading-display": "1.1"
  "--leading-heading": "1.1"
  "--leading-body": "1.5"
  "--leading-lead": "1.5"
  "--leading-tight": "1.15"

showcase:
  kicker: "Consultoria empresarial com propósito"
  headline: "Gestão integrada para empresas que desejam crescer com clareza, governança e valores."
  lead: "A Illumine combina estratégia, finanças, cultura organizacional e propósito para apoiar decisões empresariais mais conscientes e sustentáveis."
  primary_cta: "Iniciar diagnóstico"
  secondary_cta: "Conhecer a metodologia"
  tertiary_cta: "Ver soluções"

assets:
  logo:
    kind: "optional"
    mime: null
    size_bytes: null
  favicon:
    url: null
    mime: null
    size_bytes: null
  og_image: null
  twitter_image: null
  twitter_card: "summary_large_image"
  canonical_url: "https://www.illumineconsultoria.com.br/"

prose:
  visual_theme: >
    A identidade visual da Illumine deve comunicar sobriedade, confiança, inteligência estratégica,
    profundidade ética e clareza executiva. O azul escuro é a cor principal e representa governança,
    estabilidade, responsabilidade e visão de longo prazo. O laranja funciona como cor de ação,
    energia e movimento. O bege/oliva atua como cor institucional de apoio, trazendo equilíbrio,
    maturidade e conexão humana.

  color_rules: >
    Use #0E1C2C como cor dominante para CTAs principais, seções institucionais, cabeçalhos fortes
    e elementos de autoridade. Use #FF8552 para ações secundárias, destaques, links relevantes,
    estados de foco e elementos que exigem atenção. Use #BAB86C com moderação para badges,
    indicadores de apoio, selos, cards especiais e elementos de sofisticação institucional.

  typography_rules: >
    A tipografia deve transmitir clareza executiva. Títulos devem ser fortes, objetivos e com boa
    hierarquia visual. Textos corridos devem manter legibilidade, com corpo mínimo de 16px.
    Evite excesso de pesos tipográficos e preserve uma linguagem limpa, moderna e institucional.

  component_rules: >
    Botões principais devem usar azul escuro com texto branco. Botões secundários podem usar laranja
    com texto azul escuro. Cards devem ter fundo branco, bordas suaves, sombra discreta e cantos
    arredondados. Inputs devem priorizar clareza, com foco em laranja para reforçar a identidade.

  do_and_dont:
    do:
      - "Use o azul escuro como base de autoridade e confiança."
      - "Use o laranja para ação, movimento e destaque."
      - "Use espaços generosos e layouts limpos (Quiet Luxury)."
      - "Mantenha contraste adequado para leitura."
      - "Use cards para organizar diagnósticos, indicadores e recomendações."
      - "Utilize o token #D9D9D9 apenas em divisores, hairlines e elementos estruturais discretos."
      - "O corpo de texto principal e de leitura contínua deve ter no mínimo 16px. Labels, captions, badges e metadados podem usar 14px."
      - "Ícones devem ser monocromáticos utilizando tokens semânticos (icon-primary, icon-action, etc)."
      - "Use sombras suaves, de baixa opacidade e evite dramatic blurs."
      - "Bordas preferencialmente em 1px solid semantic-border."
    dont:
      - "Não usar roxo ou paletas semelhantes a concorrentes B2C (ex: Nubank)."
      - "Não usar laranja predominantemente em grandes áreas (containers, layouts, páginas ou painéis)."
      - "Não criar excesso de sombras (sem shadow-2xl desnecessárias) ou gradientes."
      - "Não reduzir corpo de texto principal abaixo de 16px."
      - "Não utilizar valores HEX hardcoded fora do registro oficial de design tokens."
      - "Não usar #D9D9D9 como fundo de Card, Panel, Modal, Dashboard, Widget ou Section."
      - "Não usar ícones multicoloridos."
      - "Não criar combinações de baixo contraste (ex: texto branco sobre laranja em componentes pequenos ou texto bege sobre branco)."

  implementation: >
    Stack sugerida: Next.js + Tailwind + shadcn/ui. Mapear os tokens de cores para variáveis CSS
    em :root e utilizar as classes semânticas da interface. Os tokens v4.0 devem refletir as 
    diretrizes executivas e o script de auditoria deve garantir a adesão automática às regras de cores, ícones, tamanhos de fonte, bordas e sombras.

  canonical_components:
    ExecutiveNarrative: >
      Objetivo: Padronizar toda comunicação analítica, executiva e institucional da plataforma, garantindo que pareceres, interpretações, recomendações e conclusões sigam uma identidade visual consistente, altamente legível e alinhada ao padrão premium da Illumine Governance™.
      Responsabilidades: O componente será a forma oficial de renderizar: pareceres executivos, análises financeiras, recomendações estratégicas, insights institucionais, narrativas produzidas pelos motores analíticos, explicações de indicadores, conclusões de simulações, comentários de governança, justificativas de alertas e riscos, textos gerados por IA.
      Estrutura visual:
      - Título: text-primary, font-semibold
      - Corpo principal: text-secondary, espaçamento confortável entre linhas, largura otimizada para leitura prolongada
      - Observações auxiliares: text-muted, uso restrito a notas de apoio, referências e informações secundárias
      - Listas: marcadores discretos, espaçamento consistente, alinhamento uniforme
      - Destaques: Utilizar elementos semânticos (StatusBadge, SemanticCard ou InfoBanner) em vez de aplicar cores diretamente no texto.

    SemanticCard: >
      Expandir as variantes para: default, info, insight, success, warning, critical.
      Cada variante deve controlar automaticamente: fundo, borda, tipografia, contraste, ícones, espaçamento.
      Nenhuma página poderá construir manualmente um card colorido utilizando apenas div + classes utilitárias.

    ExecutiveTable: >
      Padronizar: cabeçalhos com text-secondary, células numéricas com text-primary e tabular-nums, alinhamento consistente, densidade adequada para dados financeiros, bordas suaves, excelente legibilidade em grandes volumes de informação.

    ExecutiveStat_MetricInline: >
      Indicadores compactos exibidos em linhas, toolbars e tabelas. Muitas plataformas mantêm um excelente padrão visual justamente porque diferenciam KPIs em destaque (MetricTile) de métricas resumidas (ExecutiveStat), evitando que cada tela invente seu próprio estilo para pequenos indicadores. Isso reforçará ainda mais a consistência visual da Illumine Governance™ em toda a aplicação.

  antigravity_evolution:
    verificacoes_arquiteturais:
      - "textos analíticos que não utilizem ExecutiveNarrative"
      - "KPIs renderizados fora de MetricTile/KPICard"
      - "títulos renderizados fora de PageHeader ou SectionHeader"
      - "badges fora de StatusBadge"
      - "cards coloridos fora de SemanticCard"
      - "tabelas financeiras fora de ExecutiveTable"
      - "sobrescritas locais (className) que enfraqueçam contraste, tipografia ou hierarquia dos componentes canônicos."
      - "MetricTile recriado manualmente com div;"
      - "grids de KPIs fora de MetricGrid;"
      - "títulos de página fora de PageHeader;"
      - "cards coloridos fora de SemanticCard;"
      - "recomendações renderizadas sem ExecutiveNarrative ou ExecutiveCallout."
      - "sequências narrativas que não utilizem NarrativeStack."
      - "blocos textuais soltos (<p>, <span>) para relatórios longos passam a ser uma infração visual."

  architectural_principle: >
    Obrigatório: Toda narrativa analítica ou executiva deve utilizar ExecutiveNarrative. Sequências narrativas devem utilizar NarrativeStack. Construções manuais equivalentes com <div>, <p> ou <span> configuram infração ao padrão visual institucional.
    Obrigatório: A partir desta constituição visual, nenhuma página da Illumine Governance™ deve definir diretamente regras de tipografia, contraste, semântica de cores ou hierarquia visual. As páginas devem apenas compor componentes canônicos, que encapsulam essas decisões e garantem uma experiência consistente, sofisticada e de fácil manutenção em toda a plataforma.
    Regra de Ouro Visual: Nenhum desenvolvedor deve criar diretamente um layout executivo usando div + classes Tailwind quando existir um componente canônico equivalente. Toda nova funcionalidade deve ser construída por composição de componentes oficiais, preservando a consistência visual, a acessibilidade e a governança do Design System.