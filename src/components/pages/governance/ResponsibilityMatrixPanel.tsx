import React from 'react';
import { ExecutiveTable, ExecutiveTableHeader, ExecutiveTableBody, ExecutiveTableRow, ExecutiveTableHead, ExecutiveTableCell } from '../../ui/executive-table';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveHeading } from '../../ui/executive-heading';

export const ResponsibilityMatrixPanel: React.FC = () => {
  const matrix = [
    { area: 'Aprovação de Orçamento Anual', board: 'Aprova', ceo: 'Propõe', cfo: 'Valida' },
    { area: 'Operações de Mútuo Intercompany', board: 'Aprova', ceo: 'Executa', cfo: 'Audita' },
    { area: 'Contratação de Auditoria Externa', board: 'Delibera', ceo: 'Acompanha', cfo: 'Coordena' }
  ];

  return (
    <ExecutiveSurface className="p-6 space-y-4">
      <ExecutiveHeading as="h3" className="text-h3">
        Matriz RACI de Responsabilidades do Conselho & Diretoria
      </ExecutiveHeading>

      <ExecutiveTable>
        <ExecutiveTableHeader>
          <ExecutiveTableRow>
            <ExecutiveTableHead>Alçada / Decisão Estratégica</ExecutiveTableHead>

            <ExecutiveTableHead>Conselho de Administração</ExecutiveTableHead>

            <ExecutiveTableHead>CEO</ExecutiveTableHead>

            <ExecutiveTableHead>CFO</ExecutiveTableHead>

          </ExecutiveTableRow>
        </ExecutiveTableHeader>
        <ExecutiveTableBody>
          {matrix.map((row) => (
            <ExecutiveTableRow key={row.area}>
              <ExecutiveTableCell className="font-medium">{row.area}</ExecutiveTableCell>
              <ExecutiveTableCell className="font-semibold text-primary">{row.board}</ExecutiveTableCell>
              <ExecutiveTableCell>{row.ceo}</ExecutiveTableCell>
              <ExecutiveTableCell>{row.cfo}</ExecutiveTableCell>
            </ExecutiveTableRow>
          ))}
        </ExecutiveTableBody>
      </ExecutiveTable>
    </ExecutiveSurface>
  );
};
