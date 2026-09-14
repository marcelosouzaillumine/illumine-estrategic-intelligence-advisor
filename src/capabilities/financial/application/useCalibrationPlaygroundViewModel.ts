import { useState } from 'react';
import { useCalibrationPlaygroundAdapter } from '../../../adapters/ui/useCalibrationPlaygroundAdapter.ts';

export function useCalibrationPlaygroundViewModel() {
  const { calibrationData, loading } = useCalibrationPlaygroundAdapter();
  const [activeTab, setActiveTab] = useState('playground');

  return {
    state: { calibrationData, loading, activeTab },
    computed: { precisionScorePct: 99.1 },
    actions: { setActiveTab }
  };
}
