import React from 'react';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { ClientListPanel } from './clients/ClientListPanel';
import { ClientGeneralForm } from './clients/ClientGeneralForm';
import { useClientsPageViewModel } from './useClientsPageViewModel';
import { Building2, Plus, ChevronLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';

export function ClientsPage(props: any) {
  const { state, computed, actions } = useClientsPageViewModel(props);
  const { view, loading, formData, searchTerm, filteredClients } = state;
  const { setView, openAdd, openEdit, handleSave, setSearchTerm, setFormData } = actions;

  const listHeader = {
    title: "Gestão de Clientes & Portfolio (EFA)",
    description: "Visualização Canônica MasterDetail para Cadastro, Parametrização e Estrutura Tributária",
    icon: Building2,
    actions: (
      <Button onClick={openAdd} size="sm">
        <Plus size={16} className="mr-2" /> Novo Cliente
      </Button>
    )
  };

  const formHeader = {
    title: formData.id ? (formData.fantasia || formData.razao || "Alterar Cadastro") : "Cadastrar Empresa",
    description: formData.id ? "Alterar Cadastro da Empresa" : "Configure as informações estratégicas e estrutura da organização",
    icon: Building2,
    breadcrumbs: (
      <button onClick={() => setView('list')} className="flex items-center gap-2 hover:text-foreground transition-colors">
        <ChevronLeft size={14} /> Voltar para lista
      </button>
    ),
    actions: (
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => setView('list')}>Cancelar</Button>
        <Button onClick={handleSave} disabled={loading} size="sm">
          {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
          {formData.id ? "Salvar Alterações" : "Confirmar Cadastro"}
        </Button>
      </div>
    )
  };

  return (
    <ExecutivePageTemplate header={view === 'list' ? listHeader : formHeader}>
      {view === 'form' ? (
        <ClientGeneralForm
          state={state}
          computed={computed}
          actions={actions}
          isMaster={props.isMaster}
          isPartner={props.isPartner}
          userPartnerIds={props.userPartnerIds}
        />
      ) : (
        <ClientListPanel
          clients={filteredClients || []}
          onSelectClient={(client) => openEdit(client)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      )}
    </ExecutivePageTemplate>
  );
}
