import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from './idbStorage';

export interface RuntimeContext {
  activeCompanyId: string | null;
  activePeriod: string | null;
  activeLanguage: string;
  activeFilters: Record<string, any>;
  currentUserRole: string | null;
  currentUserId: string | null;
  selectedObjects: string[];
  lastClickedElement: Record<string, any> | null;
}

export interface ContextState {
  runtimeContext: RuntimeContext;
  updateRuntimeContext: (context: Partial<RuntimeContext>) => void;
  clearRuntimeContext: () => void;
}

const defaultRuntimeContext: RuntimeContext = {
  activeCompanyId: null,
  activePeriod: null,
  activeLanguage: 'pt-BR',
  activeFilters: {},
  currentUserRole: null,
  currentUserId: null,
  selectedObjects: [],
  lastClickedElement: null,
};

export const useExecutiveContextStore = create<ContextState>()(
  persist(
    (set) => ({
      runtimeContext: { ...defaultRuntimeContext },
      updateRuntimeContext: (context) => set((state) => ({
        runtimeContext: { ...state.runtimeContext, ...context }
      })),
      clearRuntimeContext: () => set({ runtimeContext: { ...defaultRuntimeContext } }),
    }),
    {
      name: 'executive-runtime-context-storage',
      storage: createJSONStorage(() => idbStorage),
    }
  )
);
