import React from 'react';
import { Building2, Search } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { StatusBadge } from '../../Common';
import { cn } from '../../../lib/utils';

function ClientListItemImage({ src, alt, fallback }: { src: string; alt: string; fallback: React.ReactNode }) {
  const [error, setError] = React.useState(false);

  if (!src || error) {
    return <>{fallback}</>;
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className="w-full h-full object-contain p-1"
      onError={() => setError(true)}
    />
  );
}

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
  searchTerm,
  setSearchTerm
}) => {
  const getClientInitials = (client: any): string => {
    const name = client.fantasia || client.name || client.razao || "";
    return name.split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase() || "?";
  };

  const avatarColors = [
    { bg: "bg-secondary/15", text: "text-secondary", border: "border-secondary/20" },
    { bg: "bg-success/15", text: "text-success", border: "border-success/20" },
    { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20" },
    { bg: "bg-warning/15", text: "text-warning", border: "border-warning/20" },
    { bg: "bg-info/10", text: "text-info", border: "border-info/20" },
  ];

  return (
    <ExecutiveSurface className="p-6 space-y-6">
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
          {clients.map((client, index) => {
            const initials = getClientInitials(client);
            const color = avatarColors[index % avatarColors.length];
            return (
              <TableRow key={client.id || client.cnpj} className="cursor-pointer hover:bg-surface-container/60 group" onClick={() => onSelectClient(client)}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm shrink-0 overflow-hidden",
                      (!client.icon && !client.logo) ? `${color.bg} ${color.border}` : "bg-white border-border"
                    )}>
                      <ClientListItemImage
                        src={client.icon || client.logo || ''}
                        alt={client.fantasia || client.razao || ''}
                        fallback={<span className={cn("text-xs font-black", color.text)}>{initials}</span>}
                      />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-base font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">{client.fantasia || client.razao}</span>
                      {client.fantasia && client.razao && client.fantasia !== client.razao && (
                        <span className="text-xs text-muted-foreground font-medium">{client.razao}</span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground tracking-widest">{client.cnpj}</TableCell>
                <TableCell>{client.segmento || client.segmentoAtuacao || 'Serviços'}</TableCell>
                <TableCell>
                  <StatusBadge 
                    status={client.status === 'Ativo' ? 'Ativo' : 'Em Análise'}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onSelectClient(client); }}>
                    Editar / Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </ExecutiveSurface>
  );
};
