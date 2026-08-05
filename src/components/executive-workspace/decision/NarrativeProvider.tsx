import React, { createContext, useContext, ReactNode } from 'react';

// For this MVP, we provide static narrative blocks.
// In the future this context could be fed by AI or rules engines.

interface NarrativeBlock {
  type: 'paragraph' | 'bullet' | 'highlight' | 'warning';
  content: string;
}

interface NarrativeContextValue {
  blocks: NarrativeBlock[];
}

const NarrativeContext = createContext<NarrativeContextValue | undefined>(undefined);

export function useNarrative() {
  const context = useContext(NarrativeContext);
  if (!context) {
    throw new Error('useNarrative must be used within a NarrativeProvider');
  }
  return context;
}

export function NarrativeProvider({ children, blocks }: { children: ReactNode; blocks: NarrativeBlock[] }) {
  return (
    <NarrativeContext.Provider value={{ blocks }}>
      {children}
    </NarrativeContext.Provider>
  );
}
