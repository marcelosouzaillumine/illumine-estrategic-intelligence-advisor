import { useState } from 'react';

export function useHistoricalDataViewModel(props?: any) {
  const [importedRecordsCount] = useState<number>(1420);
  const [lastImportDate] = useState<string>('2026-07-28');

  return {
    state: { importedRecordsCount, lastImportDate },
    computed: {},
    actions: {}
  };
}
