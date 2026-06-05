// src/core/runtime/executive-prioritization/FiduciaryPriorityEscalationEngine.ts

export type FiduciaryPriorityCategory =
  | 'Sobrevivência'
  | 'Liquidez'
  | 'Solvência'
  | 'Capital'
  | 'Rentabilidade'
  | 'Governança'
  | 'Crescimento'
  | 'Otimização';

export class FiduciaryPriorityEscalationEngine {
  private static readonly CATEGORY_HIERARCHY: Record<FiduciaryPriorityCategory, number> = {
    Sobrevivência: 1,
    Liquidez: 2,
    Solvência: 3,
    Capital: 4,
    Rentabilidade: 5,
    Governança: 6,
    Crescimento: 7,
    Otimização: 8,
  };

  public static getCategoryRank(category: FiduciaryPriorityCategory): number {
    return this.CATEGORY_HIERARCHY[category] || 9;
  }

  /**
   * Sorts recommendations first by fiduciary category priority (1 to 8),
   * and secondarily by EPS (Executive Priority Score) in descending order.
   */
  public static sort<T extends { category: FiduciaryPriorityCategory; eps: number }>(items: T[]): T[] {
    return [...items].sort((a, b) => {
      const rankA = this.getCategoryRank(a.category);
      const rankB = this.getCategoryRank(b.category);

      if (rankA !== rankB) {
        return rankA - rankB; // Lower rank number comes first (e.g. 1 is highest priority)
      }

      return b.eps - a.eps; // Descending EPS within same category
    });
  }
}
