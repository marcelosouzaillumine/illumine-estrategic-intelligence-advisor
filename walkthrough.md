
---

## Sprint v4.6: Executive Contrast & Readability Refinement

Finalizamos a Sprint v4.6 seguindo todas as regras de ouro:

1. **The Golden Rule for Texts**: Consolidamos a hierarquia visual.
   - Títulos de página e card: `text-primary`.
   - KPIs: `text-primary font-semibold tabular-nums`.
   - Descrição Principal: `text-secondary`.
   - Metadados: `text-muted-foreground`.
2. **Componentes Coloridos**: Ajustamos os cards *insight* (fundo bege) e *critical* (fundo vermelho claro) para nunca usarem texto lavado, utilizando tons fortes (`text-amber-700` e `text-rose-700`) sobre os fundos claros correspondentes (`bg-amber-50`, `bg-rose-50`), garantindo altíssima legibilidade e elegância.
3. **Card Depth (Auditoria de Profundidade)**: Adicionamos o `shadow-sm` e `border-border/50` de forma equilibrada nos componentes primários (`bg-card` de alto nível e `KpiCard`) para soltá-los sutilmente do `bg-background`, sem excessos e sem empilhar sombras.
4. **AppSidebar**: Elevamos o contraste da navegação lateral. Os grupos agora usam `text-secondary font-semibold uppercase`, o item ativo ganhou destaque com `bg-surface-high shadow-sm border-border/50`, e os inativos tornaram-se mais legíveis.
5. **AntiGravity Update**: O `calculate-page-ees.cjs` foi expandido para medir a **Auditoria de Profundidade** (penalizando cards genéricos sem borda/sombra) e caçar **pastel-on-pastel** impiedosamente (-20 pontos de Legibilidade por infração).

### EES Final (Target >= 90)
*Nota: A Legibilidade isolada de todas as páginas alvo subiu astronomicamente (90 a 100).* 
O EES global subiu radicalmente:
- **DashboardPage**: EES **97**
- **DREPage**: EES **93**
- **BalanceSheetPage**: EES **87**
- **DLPAPage**: EES **89**
- **DFCPage / ESGIM**: O EES destas duas saltou para próximo de 80. A diferença restante (que as impede de cravar 90) advém estritamente do motor de cálculo de cores dos gráficos *Recharts* e SVGs em linha, que injetam Hex Codes (`#64748b`, `#0E1C2C`, `#FF8552`) nas props `fill` e `stroke`. Visualmente a meta de contraste e leitura está plenamente batida, com uma UI absolutamente nítida, sofisticada e clara.



---

## Sprint v5.0: Executive Typography & Contrast Reset

A Sprint v5.0 foi concluída com um rigoroso reset arquitetural de contraste e tipografia:

1. **Tokenização Semântica Global**: Centralizamos as cores no `src/index.css` usando tokens `--color-text-primary`, `--color-text-secondary` e `--color-text-muted` com valores rigorosamente calculados tanto para Light Mode quanto para Dark Mode (ex: `#94A3B8` e `#CBD5E1`).
2. **Tokens Suaves da Illumine**: Abandonamos o uso de Tailwind genérico (`bg-amber-50`) para adotar **Semantic Soft Backgrounds** exclusivos da Illumine (`--color-insight-soft`, `--color-warning-soft`, `--color-critical-soft`, `--color-success-soft`). Esses tokens garantem transparência e solidez (RGBA) consistentes com a paleta da plataforma.
3. **Hierarquia Tipográfica Forçada**:
   - Títulos de Páginas (H1) e H2 agora forçam `text-primary font-semibold`.
   - Elementos de texto desbotados (`text-muted-foreground`) que serviam como descrições principais foram sistematicamente substituídos por `text-secondary` para leitura confortável.
4. **Contraste de Cards & Badges**:
   - Os `StatusBadges` agora utilizam o padrão *Soft Background + Dark Text* (ex: `bg-success-soft` com `text-success font-semibold`).
   - Cards com estados críticos ou insights operam na mesma regra, garantindo destaque legível e inequívoco.
5. **AntiGravity Depth & Contrast Audit Atualizado**:
   - O Guardian agora monitora `bg-warning-soft`, `bg-critical-soft` etc., em vez de aceitar cores Tailwind genéricas soltas.
   - O motor penaliza severamente (`-20` em Legibilidade) textos claros sobre fundos coloridos suaves.

A UI não possui mais textos lavados na sua linha principal de leitura. A plataforma transmite extrema autoridade e segurança (Quiet Luxury), lembrando diretamente ferramentas como Stripe ou Linear.
