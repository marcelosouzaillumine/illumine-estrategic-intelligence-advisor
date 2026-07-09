# HCA-005: BATCH 03 UI DISCOVERY

**Date**: 2026-07-08
**Status**: DISCOVERY COMPLETED
**Phase**: UI Presentation Canonicalization (SAFE Targets)
**Objective**: Identify the next 10-15 Visual UI files (`.tsx`) that bypass adapters/services and import `firebase/firestore` or `firebase/auth` directly, marking them as targets for refactoring.

---

## 1. Discovery Methodology

A dedicated script scanned `src/components/` and `src/pages/` while strictly ignoring:
- `src/adapters/`
- `src/runtime/`
- `src/core/`
- Files with `adapter`, `use`, or `ViewModel` in their name (to filter out already processed Application/Adapter layers).

**Results Summary**:
- **Total Files with Firebase**: 62
- **Visual UI Components with Firebase**: 53

---

## 2. Identified Targets (SAFE Selection)

To minimize risk and ensure steady progress, we selected 12 relatively isolated and smaller UI components as the first batch of SAFE targets. These will be cleaned of direct Firebase imports by either hooking them up to existing adapters or creating missing view models.

### Bloco 1 (Support & Admin)
1. `src/components/pages/SupportPage.tsx`
2. `src/components/pages/SupportPage/TicketChat.tsx`
3. `src/components/pages/SupportPage/ClientSupportPanel.tsx`
4. `src/components/pages/admin/GestaoUsuariosPage.tsx`

### Bloco 2 (Reports & Messaging)
5. `src/components/pages/MessagesPage.tsx`
6. `src/components/pages/InstitutionalReportsPage.tsx`
7. `src/components/pages/RelatorioDemonstracoes5Anos.tsx`
8. `src/components/pages/RelatorioExecutivoPage.tsx`

### Bloco 3 (Operational & Domain Modules)
9. `src/components/pages/OperacionalPage.tsx`
10. `src/components/pages/FiscalTributarioPage.tsx`
11. `src/components/pages/PurchasingPage.tsx`
12. `src/components/pages/MarketingComercialPage.tsx`

---

## 3. Refactoring Strategy

For each target above:
1. **Remove Direct Firebase**: Delete `firebase/firestore` and `firebase/auth` imports.
2. **Delegate to Adapters/Hooks**:
   - If a corresponding hook/adapter exists (e.g., `FirestoreAuthAdapter`, `FirestoreGenericCollectionAdapter`), use it.
   - If not, create a new specific hook (`use[Feature].ts`) to handle the UI-level subscription/data fetching.
3. **No UI Changes**: Preserve the visual DOM, styling, and React component props exactly as they are.
4. **Validation**: Execute `npm run typecheck` after each block to ensure no type regressions.

---

## 4. Next Steps

Awaiting authorization to begin execution of **Bloco 1** from the list above.
