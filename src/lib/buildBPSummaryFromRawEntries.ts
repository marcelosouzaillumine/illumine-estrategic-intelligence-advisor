import { buildBPHierarchy, BPSummary } from './bpEngine';

// Same aggregate-by-account-then-hierarchy step used inline in
// useBalanceSheetPageViewModel.ts and useDREPageViewModel.ts — extracted here
// so useDFCPageViewModel.ts (indirect method needs two periods of BP data)
// doesn't duplicate it a third time. The other two call sites still have
// their own inline copies; consolidating those is tracked separately.
export function buildBPSummaryFromRawEntries(rows: any[]): BPSummary | null {
  if (!rows || rows.length === 0) return null;
  const aggregated: Record<string, any> = {};
  rows.forEach((d: any) => {
    const type = (d.tipo || d.type || '').trim().toLowerCase();
    const category = (d.conta || d.category || '').trim();
    const key = `${type}_${category.toLowerCase()}`;
    if (!aggregated[key]) {
      aggregated[key] = { ...d, val: (d.val ?? d.valor ?? d.value ?? 0), conta: category, level: d.level ?? 1 };
    } else if (aggregated[key].val === 0 && (d.val ?? d.valor ?? d.value ?? 0) !== 0) {
      aggregated[key].val = (d.val ?? d.valor ?? d.value ?? 0);
    }
  });
  const arr = Object.values(aggregated).sort((a: any, b: any) => (a.ordem || 0) - (b.ordem || 0));
  return buildBPHierarchy(arr).summary;
}
