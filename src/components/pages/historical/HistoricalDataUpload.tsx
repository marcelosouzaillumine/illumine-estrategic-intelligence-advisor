import React from 'react';
import { Upload, History } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveHeading } from '../../ui/executive-heading';
import { Button } from '../../ui/button';

interface HistoricalDataUploadProps {
  importedRecordsCount: number;
  lastImportDate: string;
}

export const HistoricalDataUpload: React.FC<HistoricalDataUploadProps> = ({
  importedRecordsCount,
  lastImportDate
}) => {
  return (
    <ExecutiveSurface className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <ExecutiveHeading as="h2" className="text-h2">
            Importação & Mapeamento de Balancetes Históricos
          </ExecutiveHeading>
          <p className="text-sm text-executive-secondary mt-1">
            Mapeamento automatizado de de-para para planos de contas contábeis
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Upload size={16} /> Importar Balancete
        </Button>
      </div>

      <div className="p-4 bg-surface-container/40 rounded-md border border-border flex items-center justify-between text-sm">
        <div className="flex items-center gap-3">
          <History className="text-primary" size={20} />
          <div>
            <div className="font-semibold text-foreground">Última Importação Realizada</div>
            <div className="text-xs text-executive-secondary">Data: {lastImportDate} | Registros Importados: {importedRecordsCount}</div>
          </div>
        </div>
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-500">
          Validação Concluída
        </span>
      </div>
    </ExecutiveSurface>
  );
};
