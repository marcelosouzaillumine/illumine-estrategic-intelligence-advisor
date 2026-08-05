import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

export type DataProviderMode = 'mock' | 'demo' | 'live';

interface DataAdapter {
  fetchData: (sourceId: string, params?: any) => Promise<any>;
}

interface ExecutiveDataProviderContextValue {
  mode: DataProviderMode;
  adapter: DataAdapter | null;
  loading: boolean;
}

const ExecutiveDataProviderContext = createContext<ExecutiveDataProviderContextValue | undefined>(undefined);

export function useExecutiveData() {
  const context = useContext(ExecutiveDataProviderContext);
  if (!context) {
    throw new Error('useExecutiveData must be used within an ExecutiveDataProvider');
  }
  return context;
}

interface ExecutiveDataProviderProps {
  children: ReactNode;
  mode: DataProviderMode;
}

// Dummy Mock Adapter for Wave 17A
class MockDataAdapter implements DataAdapter {
  async fetchData(sourceId: string, params?: any) {
    // In a real scenario, this would load from a local JSON or mock registry
    return { data: `Mock data for ${sourceId}`, timestamp: new Date().toISOString() };
  }
}

// Dummy Demo Adapter (Simulation)
class DemoDataAdapter implements DataAdapter {
  async fetchData(sourceId: string, params?: any) {
    return { data: `Simulated Demo data for ${sourceId}`, trend: 'up' };
  }
}

// Dummy Live Adapter (Connected to Engines)
class LiveDataAdapter implements DataAdapter {
  async fetchData(sourceId: string, params?: any) {
    // throw new Error("Live data not implemented yet");
    return { data: `Live data for ${sourceId}` };
  }
}

export const ExecutiveDataProvider: React.FC<ExecutiveDataProviderProps> = ({ children, mode }) => {
  const [adapter, setAdapter] = useState<DataAdapter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Initialize the correct adapter based on the mode
    setTimeout(() => {
      if (mode === 'mock') {
        setAdapter(new MockDataAdapter());
      } else if (mode === 'demo') {
        setAdapter(new DemoDataAdapter());
      } else {
        setAdapter(new LiveDataAdapter());
      }
      setLoading(false);
    }, 500); // Simulate network/initialization delay
  }, [mode]);

  return (
    <ExecutiveDataProviderContext.Provider value={{ mode, adapter, loading }}>
      {children}
    </ExecutiveDataProviderContext.Provider>
  );
};
