import { useState } from 'react';

export function useCalibrationPlaygroundAdapter() {
  const [loading, setLoading] = useState(false);
  const [calibrationData, setCalibrationData] = useState<any>({});

  return { calibrationData, loading };
}
