export function formatEntityName(entityId: string): string {
  if (!entityId) return '';
  const clean = entityId.trim();
  const map: Record<string, string> = {
    'holding-1': 'Holding Patrimonial (Matriz)',
    'sub-op-1': 'Subsidiária Operacional 1',
    'sub-op-2': 'Subsidiária Operacional 2',
    'holding-2': 'Holding 2',
    'spe-1': 'SPE 1',
  };
  if (map[clean]) return map[clean];
  
  return clean
    .replace(/^holding-/i, 'Holding ')
    .replace(/^sub-op-/i, 'Subsidiária Operacional ')
    .replace(/^spe-/i, 'SPE ')
    .replace(/-/g, ' ');
}
