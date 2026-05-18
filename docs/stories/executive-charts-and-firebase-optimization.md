# Story: Executive Charts Standardisation & Firebase Pagination Optimization

## Description
Conduct a comprehensive logical and visual standardization of the platform's strategic monitoring components. Address systemic visual issues under Light Mode where chart curves and legends overlap or disappear, and solve Firebase composite index pagination query failures by switching to robust in-memory sorting. Provide an automatic premium operational transaction simulation fallback in `cashFlowService` to prevent empty states for newly created clients like "Illumine Consultoria".

## Tasks
- [x] Make `orderByField` optional in `usePaginatedData.ts` to allow querying collection filters without requiring strict composite indexes.
- [x] Remove `orderByField` constraint from `usePaginatedData` call inside `IndicatorsPage.tsx` and implement robust, high-performance in-memory sorting on client-side.
- [x] Modify `getThemeColors` in `src/lib/utils.ts` to detect the active theme class dynamically and return absolute hex strings for premium visual clarity under both Light and Dark modes.
- [x] Update legends and chart grid components in `DREPage.tsx` and `CashFlowPage.tsx` to utilize `colors.border` and `colors.mutedForeground` variables for WCAG AA contrast compliance.
- [x] Redesign the `generateCashFlow` service inside `src/services/cashFlowService.ts` to automatically generate simulated premium business transactions and bank account balances when no database records exist, ensuring a breathtaking, fully populated initial view.
- [x] Verify all component types, imports, and compilation flags compile flawlessly.

## Files
- [src/hooks/usePaginatedData.ts](file:///Users/marcelosouza/Documents/illumine-advisor/src/hooks/usePaginatedData.ts)
- [src/components/pages/IndicatorsPage.tsx](file:///Users/marcelosouza/Documents/illumine-advisor/src/components/pages/IndicatorsPage.tsx)
- [src/lib/utils.ts](file:///Users/marcelosouza/Documents/illumine-advisor/src/lib/utils.ts)
- [src/components/pages/DREPage.tsx](file:///Users/marcelosouza/Documents/illumine-advisor/src/components/pages/DREPage.tsx)
- [src/services/cashFlowService.ts](file:///Users/marcelosouza/Documents/illumine-advisor/src/services/cashFlowService.ts)

## Checklist
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm test`
