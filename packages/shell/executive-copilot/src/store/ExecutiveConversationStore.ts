import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from './idbStorage';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ConversationState {
  messages: Message[];
  isTyping: boolean;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setTyping: (isTyping: boolean) => void;
  clearConversation: () => void;
}

export const useExecutiveConversationStore = create<ConversationState>()(
  persist(
    (set) => ({
      messages: [],
      isTyping: false,
      addMessage: (message) => set((state) => ({
        messages: [
          ...state.messages,
          {
            ...message,
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
          }
        ]
      })),
      setTyping: (isTyping) => set({ isTyping }),
      clearConversation: () => set({ messages: [] }),
    }),
    {
      name: 'executive-conversation-storage',
      storage: createJSONStorage(() => idbStorage),
    }
  )
);
