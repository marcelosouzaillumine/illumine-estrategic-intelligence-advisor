import { useContext } from 'react';
import { EnterpriseDataContext } from './EnterpriseDataContext';

export const useEnterpriseData = () => {
  const context = useContext(EnterpriseDataContext);
  if (!context) {
    throw new Error('useEnterpriseData must be used within an EnterpriseDataProvider');
  }
  return context;
};
