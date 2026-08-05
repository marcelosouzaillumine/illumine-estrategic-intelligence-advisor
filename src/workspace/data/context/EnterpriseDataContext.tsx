import React, { createContext, useContext, ReactNode, useState } from 'react';

export interface EnterpriseDataContextState {
  tenant: string;
  organization: string;
  businessUnit?: string;
  locale: string;
  currency: string;
  timezone: string;
  
  // Phase 1 Backward Compatibility
  selectedMonth?: string;
  selectedYear?: string;
  
  // New Expanded Context
  fiscalCalendar: string;
  reportingCurrency: string;
  consolidationScope: string;
  scenario: 'Actual' | 'Budget' | 'Forecast' | 'Simulation';
  permissions: string[];
  
  // Environment Details
  environment: string;
  activeOffice: string;
}

const defaultState: EnterpriseDataContextState = {
  tenant: 'default-tenant',
  organization: 'default-org',
  locale: 'en-US',
  currency: 'USD',
  timezone: 'UTC',
  fiscalCalendar: 'Jan-Dec',
  reportingCurrency: 'USD',
  consolidationScope: 'Global',
  scenario: 'Actual',
  permissions: [],
  environment: 'production',
  activeOffice: 'cfo',
};

const EnterpriseDataContext = createContext<{
  state: EnterpriseDataContextState;
  updateState: (newState: Partial<EnterpriseDataContextState>) => void;
}>({
  state: defaultState,
  updateState: () => {},
});

export const EnterpriseDataProvider: React.FC<{ children: ReactNode; initialState?: Partial<EnterpriseDataContextState> }> = ({ children, initialState }) => {
  const [state, setState] = useState<EnterpriseDataContextState>({ ...defaultState, ...initialState });

  const updateState = (newState: Partial<EnterpriseDataContextState>) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  return (
    <EnterpriseDataContext.Provider value={{ state, updateState }}>
      {children}
    </EnterpriseDataContext.Provider>
  );
};

export { EnterpriseDataContext };
