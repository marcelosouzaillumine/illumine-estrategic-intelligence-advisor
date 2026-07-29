import React from 'react';
import { ExecutiveTable, ExecutiveTableHeader, ExecutiveTableBody, ExecutiveTableRow, ExecutiveTableHead, ExecutiveTableCell } from '../../ui/executive-table';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveHeading } from '../../ui/executive-heading';

export const SimulationResultTable: React.FC = () => {
  const rows = [
    { period: 'Ano 1', amort: 'R$ 800.000', interest: 'R$ 600.000', balance: 'R$ 4.200.000' },
    { period: 'Ano 2', amort: 'R$ 900.000', interest: 'R$ 500.000', balance: 'R$ 3.300.000' },
    { period: 'Ano 3', amort: 'R$ 1.000.000', interest: 'R$ 400.000', balance: 'R$ 2.300.000' }
  ];

  return (
    <ExecutiveSurface className="p-6 space-y-4">
      <ExecutiveHeading as="h3" className="text-h3">
        Nível Técnico — Tabela de Amortização & Projeção Patrimonial
      </ExecutiveHeading>
      <ExecutiveTable>
        <ExecutiveTableHeader>
          <ExecutiveTableRow>
            <ExecutiveTableHead>Período</ExecutiveTableHead>

            <ExecutiveTableHead>Amortização de Principal</ExecutiveTableHead>

            <ExecutiveTableHead>Juros Provisionados</ExecutiveTableHead>

            <ExecutiveTableHead className="text-right">Saldo Devedor</ExecutiveTableHead>

          </ExecutiveTableRow>
        </ExecutiveTableHeader>
        <ExecutiveTableBody>
          {rows.map((r) => (
            <ExecutiveTableRow key={r.period}>
              <ExecutiveTableCell className="font-medium">{r.period}</ExecutiveTableCell>
              <ExecutiveTableCell>{r.amort}</ExecutiveTableCell>
              <ExecutiveTableCell>{r.interest}</ExecutiveTableCell>
              <ExecutiveTableCell className="text-right font-mono">{r.balance}</ExecutiveTableCell>
            </ExecutiveTableRow>
          ))}
        </ExecutiveTableBody>
      </ExecutiveTable>
    </ExecutiveSurface>
  );
};
