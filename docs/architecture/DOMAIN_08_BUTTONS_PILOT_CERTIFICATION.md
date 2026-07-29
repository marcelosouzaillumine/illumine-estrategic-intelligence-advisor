# Domain 08: Buttons - Pilot Certification (GAP IDENTIFICADO)

**Programa:** Executive Constitution Engine
**Domínio Constitucional:** 08 (Buttons & Ações)
**Escopo Global:** Piloto (Interrompido)

## 1. Auditoria e Diagnóstico Inicial
Conforme análise mecânica (Scanner), o ecossistema apresenta apenas **22% de aderência** em botões. Mais de 70 instâncias manuais (`<button>`) foram encontradas em `src/components/executive` e diversas outras espalhadas pelas páginas.

## 2. A Lacuna Canônica Detectada
Foi realizada uma tentativa de pilotar a migração utilizando o componente canônico existente: `src/components/ui/button.tsx` (Componente `<Button>`).

**No entanto, a migração foi bloqueada (fail-safe acionado) pelos seguintes motivos estruturais:**

1. **Incompatibilidade Tipográfica (Domain 01 Break):** O componente `<Button>` atual é baseado puramente em utilitários utilitários manuais do Tailwind (`text-sm font-medium`), não utilizando o motor do `<ExecutiveText>`. Ao envelopar ações dentro desse botão, perderíamos a precisão tipográfica recém-adquirida no Domain 01.
2. **Deficiência de Semântica Visual:** Botões executivos, como vistos em `executive-empty-state.tsx` e `BoardCopilotPanel.tsx`, exigem assinaturas visuais premium (como `rounded-xl`, `bg-executive` e sombreamentos refinados de elevação). O `<Button>` atual suporta apenas variantes genéricas (`default`, `outline`, `secondary`, `ghost`, `destructive`).
3. **Rigidez de Padding e Geometria:** O `<Button>` atual impõe raios rígidos (`rounded-lg` via `cva`) incompatíveis com o layout flexível (que alterna entre `rounded-sm` para ícones de barra de ferramentas e `rounded-2xl` para CTAs corporativos).

## 3. Conformidade com as Regras de Engajamento
Segundo a diretriz: *"Se não houver componente canônico suficiente, registrar lacuna antes de criar"* e *"O piloto só será aprovado se preservar comportamento, props, eventos e aparência executiva"*, **a execução foi paralisada**.

Forçar a adoção do `<Button>` nativo resultaria em regressão visual executiva ou exigiria injeção excessiva de `className` (o que defeat o propósito do Executive Constitution Engine).

## 4. Plano de Ação Recomendado
Para solucionar a lacuna, recomendo a criação de um componente estritamente constitucional: **`<ExecutiveAction>`** ou **`<ExecutiveButton>`**, que deverá:
- Internamente invocar `<ExecutiveText>` (ou mapear perfeitamente ao *ExecutiveTypographyRegistry*).
- Aceitar as props semânticas do mundo executivo (ex: `variant="executive"`, `variant="subtle"`, `variant="critical"`).
- Alinhar com a curvatura (`radius`) e densidade visual das superfícies construídas no Domain 03.

---
**Status Global:** 🔴 BLOQUEADO POR LACUNA ARQUITETURAL
**Data:** Julho de 2026
**Autorização Solicitada:** Aprovação para o design e criação do `src/components/ui/executive-action.tsx` antes de prosseguir com o Piloto.
