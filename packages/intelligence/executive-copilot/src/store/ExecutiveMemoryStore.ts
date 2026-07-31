import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from './idbStorage';

export interface MemoryFact {
  id: string;
  topic: string;
  content: string;
  confidence: number;
  lastUpdated: string;
}

export interface MemoryState {
  facts: MemoryFact[];
  recentDashboards: string[];
  addFact: (fact: Omit<MemoryFact, 'id' | 'lastUpdated'>) => void;
  recordDashboardVisit: (dashboardId: string) => void;
}

export const useExecutiveMemoryStore = create<MemoryState>()(
  persist(
    (set) => ({
      facts: [],
      recentDashboards: [],
      addFact: (fact) => set((state) => ({
        facts: [
          ...state.facts.filter(f => f.topic !== fact.topic),
          {
            ...fact,
            id: crypto.randomUUID(),
            lastUpdated: new Date().toISOString()
          }
        ]
      })),
      recordDashboardVisit: (dashboardId) => set((state) => {
        const updated = [dashboardId, ...state.recentDashboards.filter(id => id !== dashboardId)].slice(0, 10);
        return { recentDashboards: updated };
      }),
    }),
    {
      name: 'executive-memory-storage',
      storage: createJSONStorage(() => idbStorage),
    }
  )
);
