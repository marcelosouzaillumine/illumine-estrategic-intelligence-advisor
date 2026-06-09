import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CognitiveNavigationState {
  isDrawerOpen: boolean;
  targetNodeId: string | null;
  history: string[];
}

export interface CognitiveNavigationContextType {
  state: CognitiveNavigationState;
  openDrawer: (nodeId: string) => void;
  closeDrawer: () => void;
  navigateNode: (nodeId: string) => void;
  goBack: () => void;
}

const CognitiveNavigationContext = createContext<CognitiveNavigationContextType | undefined>(undefined);

export const CognitiveNavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CognitiveNavigationState>({
    isDrawerOpen: false,
    targetNodeId: null,
    history: []
  });

  const openDrawer = (nodeId: string) => {
    setState({
      isDrawerOpen: true,
      targetNodeId: nodeId,
      history: [nodeId]
    });
  };

  const closeDrawer = () => {
    setState({
      isDrawerOpen: false,
      targetNodeId: null,
      history: []
    });
  };

  const navigateNode = (nodeId: string) => {
    setState(prev => ({
      ...prev,
      targetNodeId: nodeId,
      history: [...prev.history, nodeId]
    }));
  };

  const goBack = () => {
    setState(prev => {
      if (prev.history.length <= 1) {
        return prev; // cannot go back further
      }
      const newHistory = prev.history.slice(0, -1);
      return {
        ...prev,
        targetNodeId: newHistory[newHistory.length - 1],
        history: newHistory
      };
    });
  };

  return (
    <CognitiveNavigationContext.Provider value={{ state, openDrawer, closeDrawer, navigateNode, goBack }}>
      {children}
    </CognitiveNavigationContext.Provider>
  );
};

export const useCognitiveNavigation = () => {
  const context = useContext(CognitiveNavigationContext);
  if (context === undefined) {
    throw new Error('useCognitiveNavigation must be used within a CognitiveNavigationProvider');
  }
  return context;
};
