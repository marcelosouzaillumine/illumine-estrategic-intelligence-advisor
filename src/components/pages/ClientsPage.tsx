import React from 'react';
import { MasterDetailLayout } from '../ui/master-detail-layout';
import { ClientListPanel } from './clients/ClientListPanel';
import { ClientGeneralForm } from './clients/ClientGeneralForm';
import { useClientsPageViewModel } from './useClientsPageViewModel';

export function ClientsPage(props: any) {
  const { state, actions } = useClientsPageViewModel(props);
  const { view, loading, formData, searchTerm, filteredClients } = state;
  const { setView, openAdd, openEdit, handleSave, setSearchTerm, setFormData } = actions;

  if (view === 'form') {
    return (
      <ClientGeneralForm
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
        onCancel={() => setView('list')}
        loading={loading}
      />
    );
  }

  return (
    <MasterDetailLayout
      title="Gestão de Clientes & Portfolio (EFA)"
      subtitle="Visualização Canônica MasterDetail para Cadastro, Parametrização e Estrutura Tributária"
    >
      <ClientListPanel
        clients={filteredClients || []}
        onSelectClient={(client) => openEdit(client)}
        onOpenAdd={openAdd}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </MasterDetailLayout>
  );
}
