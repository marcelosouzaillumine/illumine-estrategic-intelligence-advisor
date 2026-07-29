import React from 'react';
import { ExecutiveTable, ExecutiveTableHeader, ExecutiveTableBody, ExecutiveTableRow, ExecutiveTableHead, ExecutiveTableCell } from '../../ui/executive-table';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveHeading } from '../../ui/executive-heading';

export interface DFCDetailRow {
  id?: string;
  code?: string;
  line: string;
  type: string;
  value: number;
}

interface DFCDetailTableProps {
  rows?: DFCDetailRow[];
  formatCurrency: (val: number) => string;
}

export const DFCDetailTable: React.FC<DFCDetailTableProps> = ({ rows, formatCurrency }) => {
  const displayRows = rows && rows.length > 0 ? rows : [
    { code: '1.01', line: 'Receita Operacional Bruta de Vendas', value: 12500000, type: 'Operacional' },
    { code: '1.02', line: 'Deduções da Receita e Impostos Incidentes', value: -2100000, type: 'Operacional' },
    { code: '1.03', line: 'Pagamento a Fornecedores e Custos de Produção', value: -4800000, type: 'Operacional' },
    { code: '1.04', line: 'Despesas com Pessoal e Encargos Sociais', value: -1100000, type: 'Operacional' },
    { code: '2.01', line: 'Aquisição de Imobilizado / Ativos (CAPEX)', value: -1200000, type: 'Investimento' },
    { code: '3.01', line: 'Amortização de Empréstimos e Financiamentos', value: -800000, type: 'Financiamento' }
  ];

  const mapGroupType = (rawType: string) => {
    const upper = String(rawType).toUpperCase();
    if (upper === 'OPERATIONAL' || upper === 'OPERACIONAL') return 'Operacional';
    if (upper === 'INVESTMENT' || upper === 'INVESTIMENTO') return 'Investimento';
    if (upper === 'FINANCING' || upper === 'FINANCIAMENTO') return 'Financiamento';
    return rawType;
  };

  return (
    <ExecutiveSurface className="p-6">
      <ExecutiveHeading as="h3" className="text-h3 mb-4">
        Detalhamento das Linhas Contábeis DFC
      </ExecutiveHeading>
      <ExecutiveTable>
        <ExecutiveTableHeader>
          <ExecutiveTableRow>
            <ExecutiveTableHead>Código</ExecutiveTableHead>
            <ExecutiveTableHead>Linha do Demonstrativo (DFC)</ExecutiveTableHead>
            <ExecutiveTableHead>Grupo de Fluxo</ExecutiveTableHead>
            <ExecutiveTableHead className="text-right">Valor Consolidado (R$)</ExecutiveTableHead>
          </ExecutiveTableRow>
        </ExecutiveTableHeader>
        <ExecutiveTableBody>
          {displayRows.map((row, idx) => (
            <ExecutiveTableRow key={row.id || row.code || idx}>
              <ExecutiveTableCell className="font-mono text-xs">{row.code || `${idx + 1}.01`}</ExecutiveTableCell>
              <ExecutiveTableCell className="font-medium">{row.line}</ExecutiveTableCell>
              <ExecutiveTableCell>{mapGroupType(row.type)}</ExecutiveTableCell>
              <ExecutiveTableCell className={`text-right font-mono ${row.value < 0 ? 'text-critical' : 'text-success'}`}>
                {formatCurrency(row.value)}
              </ExecutiveTableCell>
            </ExecutiveTableRow>
          ))}
        </ExecutiveTableBody>
      </ExecutiveTable>
    </ExecutiveSurface>
  );
};
