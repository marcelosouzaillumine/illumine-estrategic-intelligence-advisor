# AGFP-0021 — Executive UI Compiler (EUC)

**RFC: Compilador Declarativo de Manifestos para Árvores React Canônicas (v15.0)**

---

## 1. Contexto & Objetivo
O **Executive UI Compiler (EUC)** compila manifestos PMS (`.page.manifest.yml`) em árvores de componentes React 100% canônicas e otimizadas em tempo de build, garantindo renderização ultra-rápida (Initial Render $\le 16\text{ms}$).

---

## 2. Pipeline de Compilação do EUC

```text
  [YAML Manifest] ➔ [EUC Lexer & AST Parser] ➔ [AGF Compliance Validator (AST)]
                                                     │
  [Optimized React AST Tree] ◄── [Canonical Primitive Linker (EAA/EFA)]
```

---

## 3. Garantias do Compilador EUC
- **Nenhum `bg-white` ou CSS hardcoded**: O compilador emite apenas tokens canônicos.
- **Auto-inclusão de `ExecutivePageTemplate`**: Adiciona automaticamente o wrapper de 1440px em páginas EAA.
- **Auto-inclusão de `PageHeader`**: Constrói o cabeçalho canônico com breadcrumbs, ícones `lucide-react` e actions sem duplicação.
