import { buildBPHierarchy } from '../../lib/bpEngine';
import { calculateDreCascade } from '../../lib/dreCascade';

export function getComputedBPSummary(dbBp: any[]) {
  if (!dbBp || dbBp.length === 0) return null;
  return buildBPHierarchy(dbBp).summary;
}

export function getComputedDreMetrics(dbDre: any[]) {
  if (!dbDre || dbDre.length === 0) return { ebitda: 0, lucroLiquido: 0 };
  const cascadeResult = calculateDreCascade(dbDre);
  const directEbitda = cascadeResult.find((r: any) => r.id === 'EBITDA')?.computedValue || 0;
  const directLucro = cascadeResult.find((r: any) => r.id === 'LUCRO_LIQ')?.computedValue || 0;
  return { ebitda: directEbitda, lucroLiquido: directLucro };
}
