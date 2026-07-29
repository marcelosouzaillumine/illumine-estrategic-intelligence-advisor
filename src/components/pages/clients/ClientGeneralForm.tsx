import React from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveHeading } from '../../ui/executive-heading';

interface ClientGeneralFormProps {
  formData: any;
  setFormData: (data: any) => void;
  onSave: () => void;
  onCancel: () => void;
  loading: boolean;
}

export const ClientGeneralForm: React.FC<ClientGeneralFormProps> = ({
  formData,
  setFormData,
  onSave,
  onCancel,
  loading
}) => {
  return (
    <ExecutiveSurface className="p-6 space-y-6 max-w-4xl mx-auto">
      <ExecutiveHeading as="h2" className="text-h2">
        {formData.id ? 'Alterar Cadastro de Cliente' : 'Novo Cadastro de Cliente Corporativo'}
      </ExecutiveHeading>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Razão Social</Label>

          <Input
            value={formData.razao || ''}
            onChange={(e) => setFormData({ ...formData, razao: e.target.value })}
            placeholder="Razão Social completa..."
          />
        </div>
        <div>
          <Label>Nome Fantasia</Label>

          <Input
            value={formData.fantasia || ''}
            onChange={(e) => setFormData({ ...formData, fantasia: e.target.value })}
            placeholder="Nome Fantasia..."
          />
        </div>
        <div>
          <Label>CNPJ / ID Fiscal</Label>

          <Input
            value={formData.cnpj || ''}
            onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
            placeholder="00.000.000/0000-00"
          />
        </div>
        <div>
          <Label>Segmento de Atuação</Label>

          <Input
            value={formData.segmento || ''}
            onChange={(e) => setFormData({ ...formData, segmento: e.target.value })}
            placeholder="Ex: Tecnologia, Finanças, Indústria"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={onSave} disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </ExecutiveSurface>
  );
};
