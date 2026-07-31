import { create } from 'zustand';

export interface UIState {
  isOpen: boolean;
  activeTab: 'briefing' | 'conversation' | 'insights' | 'actions';
  isMinimized: boolean;
  toggleOpen: () => void;
  setOpen: (isOpen: boolean) => void;
  setActiveTab: (tab: 'briefing' | 'conversation' | 'insights' | 'actions') => void;
  setMinimized: (isMinimized: boolean) => void;
}

export const useExecutiveUIStore = create<UIState>((set) => ({
  isOpen: false,
  activeTab: 'conversation',
  isMinimized: false,
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: (isOpen) => set({ isOpen }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setMinimized: (isMinimized) => set({ isMinimized }),
}));
