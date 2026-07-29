import React from 'react';
import { MasterDetailLayout } from '../ui/master-detail-layout';
import { HistoricalDataUpload } from './historical/HistoricalDataUpload';
import { useHistoricalDataViewModel } from '../../viewmodels/useHistoricalDataViewModel';

export function DadosHistoricosPage(props?: any) {
  const { state } = useHistoricalDataViewModel(props);

  return (
    <MasterDetailLayout
      title="Dados Históricos & Importação (EFA)"
      subtitle="Mapeamento de Balancetes, Cargas do ERP e Validação da Linhagem Contábil"
    >
      <HistoricalDataUpload
        importedRecordsCount={state.importedRecordsCount}
        lastImportDate={state.lastImportDate}
      />
    </MasterDetailLayout>
  );
}
