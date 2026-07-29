import React from 'react';
import { Plus, Search, Building2 } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveHeading } from '../../ui/executive-heading';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';

interface ClientListPanelProps {
  clients: any[];
  onSelectClient: (client: any) => void;
  onOpenAdd: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const ClientListPanel: React.FC<ClientListPanelProps> = ({
  clients,
  onSelectClient,
  onOpenAdd,
  searchTerm,
  setSearchTerm
}) => {
  return (
    <ExecutiveSurface className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <ExecutiveHeading as="h2" className="text-h2">
            Clientes Corporativos & Holdings
          </ExecutiveHeading>
          <p className="text-sm text-executive-secondary mt-1">
            Gestão 360º de carteira de clientes, estruturas tributárias e filiais
          </p>
        </div>
        <Button onClick={onOpenAdd} className="flex items-center gap-2">
          <Plus size={16} /> Novo Cliente
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-executive-secondary" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por razão social, nome fantasia ou CNPJ..."
            className="pl-9"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Razão Social / Fantasia</TableHead>

            <TableHead>CNPJ / ID Fiscal</TableHead>

            <TableHead>Segmento</TableHead>

            <TableHead>Status</TableHead>

            <TableHead className="text-right">Ações</TableHead>

          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id || client.cnpj} className="cursor-pointer hover:bg-surface-container/60" onClick={() => onSelectClient(client)}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Building2 size={16} className="text-primary" />
                  <div>
                    <div>{client.fantasia || client.razao}</div>
                    <div className="text-xs text-executive-secondary">{client.razao}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-mono text-xs">{client.cnpj}</TableCell>
              <TableCell>{client.segmento || client.segmentoAtuacao || 'Serviços'}</TableCell>
              <TableCell>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-500">
                  {client.status || 'Ativo'}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onSelectClient(client); }}>
                  Editar / Detalhes
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ExecutiveSurface>
  );
};
