// src/demo-runtime/DemoScenarioProvider.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DemoMockFactory } from './DemoMockFactory';

interface DemoScenarioContextType {
  data: any;
  viewMode: 'healthy' | 'fragile' | 'fail-closed';
  setViewMode: (mode: 'healthy' | 'fragile' | 'fail-closed') => void;
  loading: boolean;
}

const DemoScenarioContext = createContext<DemoScenarioContextType>({
  data: null,
  viewMode: 'healthy',
  setViewMode: () => {},
  loading: false
});

export const useDemoScenario = () => useContext(DemoScenarioContext);

export const DemoScenarioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<'healthy' | 'fragile' | 'fail-closed'>('healthy');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      if (viewMode === 'healthy') {
        setData(DemoMockFactory.createHealthyBaseline());
      } else if (viewMode === 'fragile') {
        setData(DemoMockFactory.createFragileState());
      } else {
        setData(DemoMockFactory.createFailClosedState());
      }
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [viewMode]);

  return (
    <DemoScenarioContext.Provider value={{ data, viewMode, setViewMode, loading }}>
      {children}
    </DemoScenarioContext.Provider>
  );
};
