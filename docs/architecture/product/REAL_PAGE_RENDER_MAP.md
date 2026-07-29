# REAL_PAGE_RENDER_MAP.md — Mapeamento de Renderização Real de Páginas (DOM Visual)

> **Mapeamento de Inserção Direta dos Componentes de Inteligência nas Páginas Reais da Aplicação (Wave 17.10.2 Fase 2)**

---

## 1. Mapeamento de Componentes Raiz por Rota Real

| Rota Executiva | Arquivo Real | Componente Raiz | Intelligence Mounted | DOM Debug Badge |
| :--- | :--- | :--- | :---: | :---: |
| **Dashboard Executivo** | [`src/components/pages/DashboardPage.tsx`](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/components/pages/DashboardPage.tsx) | `DashboardPage` | ✅ **MOUNTED REAL** | ✅ **VISIBLE** |
| **DRE Contábil** | [`src/components/pages/DREPage.tsx`](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/components/pages/DREPage.tsx) | `DREPage` | ✅ **MOUNTED REAL** | ✅ **VISIBLE** |
| **Balanço Patrimonial** | [`src/components/pages/BalanceSheetPage.tsx`](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/components/pages/BalanceSheetPage.tsx) | `BalanceSheetPage` | ✅ **MOUNTED REAL** | ✅ **VISIBLE** |
| **DFC (Fluxo de Caixa)** | [`src/components/pages/DFCPage.tsx`](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/components/pages/DFCPage.tsx) | `DFCPage` | ✅ **MOUNTED REAL** | ✅ **VISIBLE** |
| **DLPA Contábil** | [`src/components/pages/DLPAPage.tsx`](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/components/pages/DLPAPage.tsx) | `DLPAPage` | ✅ **MOUNTED REAL** | ✅ **VISIBLE** |
| **EFOS / Visão Executiva** | [`src/components/pages/EFOSPage.tsx`](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/components/pages/EFOSPage.tsx) | `EFOSPage` | ✅ **MOUNTED REAL** | ✅ **VISIBLE** |
| **Score Patrimonial** | [`src/components/pages/DiagnosticoPage.tsx`](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/components/pages/DiagnosticoPage.tsx) | `DiagnosticoPage` | ✅ **MOUNTED REAL** | ✅ **VISIBLE** |
| **Indicadores Estratégicos** | [`src/components/pages/IndicatorsPage.tsx`](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/components/pages/IndicatorsPage.tsx) | `IndicatorsPage` | ✅ **MOUNTED REAL** | ✅ **VISIBLE** |

---

## 2. Invariante de Inserção Direta no JSX

Toda página renderiza diretamente a estrutura de inteligência na árvore React:
```tsx
<ExecutiveIntelligenceShell pageTitle={pageName} pageContext={pageContext}>
  <ExecutiveIntelligenceDebugBadge pageName={pageName} />
  <ExecutiveDecisionSurface pageTitle={pageName} />
  <ExecutiveInsightsPanel pageTitle={pageName} />
  <ExecutiveAgentActionSurface />
  {pageContent}
</ExecutiveIntelligenceShell>
```
