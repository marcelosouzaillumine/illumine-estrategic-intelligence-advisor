# Domain 08: Actions Contract - Architectural Audit (Revisão Corretiva)

**Programa:** Executive Constitution Engine
**Data da Auditoria:** Julho de 2026
**Responsável:** Aiox

## 1. Golden Reference Resolution: A Verdadeira BP Localizada
Após reavaliação da arquitetura, constatou-se que a página `SovereignBoardPackPage.tsx` atende apenas ao *Board Mode* (Conselho) e não reflete a fundação financeira da plataforma.

A **verdadeira BP (Balanço Patrimonial)** foi localizada em `src/components/pages/BalanceSheetPage.tsx`. Esta página é a origem oficial do padrão visual estendido posteriormente para **DRE**, **DFC** e **DLPA**.

### Padrão Canônico Encontrado na BP (BalanceSheetPage)
A auditoria revelou a seguinte composição hierárquica na BP:
1. **Header Central:** 
   - Utiliza `<PageHeader>` com propriedades `title`, `subtitle`, e `icon`.
2. **Context Badges e Indicadores de Status (Domain 04):**
   - Renderizados no componente `<BalanceSheetDataSourceStatus>` e `<StatusBadge>`, localizados à esquerda, *abaixo* do PageHeader principal.
3. **Filtros e Seletores:**
   - `<BalanceSheetYearFilter>`, localizado ao lado dos badges de status.
4. **Primary Actions (Domain 08):**
   - Agrupadas na extremidade direita via componente `<BalanceSheetActionToolbar>`.
   - **Estrutura interna das ações:** 
     O toolbar renderiza botões manuais (`<button>`) englobando texto com `<ExecutiveText as="span" variant="microLabel">`. 
     *Exemplo:* `bg-success-soft hover:bg-success text-success border-success/20 rounded-md h-8 px-3 py-1.5`.

**Conclusão Transversal (BP, DRE, DFC, DLPA):**
A separação conceitual já existe visualmente na BP: *Badges informativos* vivem à esquerda e *Botões de Ação* vivem à direita (ActionToolbar). No entanto, a implementação dos botões de ação nessas páginas ainda é crua e manual (uso direto de `<button className="...">`).

## 2. Inventário Mecânico Completo (Global Scan)
Uma varredura completa do repositório foi executada. O artefato resultante (`DOMAIN_08_ACTIONS_USAGE_INVENTORY.json`) contém todas as ocorrências de botões. 

**Totais Consolidados:**
- **`<Button>` (Canônico Existente - UI):** 20 usos.
- **`<button>` (Manual - Dívida Técnica):** 607 usos.
- **`role="button"` / links button-like:** ~0 (maioria migrada para botões reais ou não listada via tag base).
- **Total de Elementos Acionáveis Auditados:** 627 usos.

O volume assustador de `<button>` evidencia que o componente nativo `<Button>` da UI foi majoritariamente ignorado pelos desenvolvedores durante a construção de módulos como BP, DRE e Executive Hubs, dada sua rigidez geométrica e tipográfica.

## 3. Avaliação do Button Atual vs. Necessidade Constitucional
O componente atual (`src/components/ui/button.tsx`) depende fortemente de utilitários manuais tailwind. 
Ao analisar o Toolbar da BP verdadeira, percebe-se que as ações exigem tipografia executiva (`microLabel`), o que o `Button` nativo não provê automaticamente, resultando no *antipattern* observado:
```jsx
// Antipattern vigente na BP:
<button className="...">
  <ExecutiveText as="span" variant="microLabel">Exportar</ExecutiveText>
</button>
```

Se promovêssemos o `<Button>` nativo, teríamos que exigir que todo desenvolvedor fizesse manualmente o wrap do texto com `<ExecutiveText>`, ferindo o princípio de encapsulamento.
