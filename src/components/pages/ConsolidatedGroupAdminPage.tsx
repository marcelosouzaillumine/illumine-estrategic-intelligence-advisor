import React, { useState, useEffect } from 'react';
import { GroupOnboardingRepository, EconomicGroupModel } from '../../services/FiduciaryRuntimeAdapter';
import { GroupEntityMappingRepository, EconomicGroupEntityModel } from '../../services/FiduciaryRuntimeAdapter';
import { IntercompanyRelationRepository, IntercompanyRelationModel } from '../../services/FiduciaryRuntimeAdapter';
import { ConsolidatedDataModelValidator } from '../../services/FiduciaryRuntimeAdapter';
import { Building2, Plus, AlertTriangle, Play, Users } from 'lucide-react';
import { PageHeader, StatusBadge } from '../Common';
import { cn } from '../../lib/utils';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveBadge } from '../ui/executive-badge';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { ExecutiveSummarySection } from '../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../ui/executive-decision-trace';
import { ExecutiveTechnicalLayer } from '../ui/executive-technical-layer';
import { useConsolidatedGroupAdminViewModel } from '../../viewmodels/useConsolidatedGroupAdminViewModel';

export function ConsolidatedGroupAdminPage() {
  const { state: vmState, computed: vmComputed, actions: vmActions } = useConsolidatedGroupAdminViewModel();
  const { t } = useLanguage();
  const [groups, setGroups] = useState<EconomicGroupModel[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<EconomicGroupModel | null>(null);
  const [entities, setEntities] = useState<EconomicGroupEntityModel[]>([]);
  const [relations, setRelations] = useState<IntercompanyRelationModel[]>([]);
  const [availableClients, setAvailableClients] = useState<any[]>([]);
  const navigate = useNavigate();

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);

  useEffect(() => {
    loadGroups();
    loadAvailableClients();
  }, []);

  const loadAvailableClients = async () => {
    const snap = await getDocs(collection(db, 'clients'));
    setAvailableClients(snap.docs.map(d => ({ ...d.data(), id: d.id })));
  };

  const loadGroups = async () => {
    const data = await GroupOnboardingRepository.listGroups();
    setGroups(data);
  };

  const loadGroupDetails = async (group: EconomicGroupModel) => {
    setSelectedGroup(group);
    const ents = await GroupEntityMappingRepository.listEntitiesByGroup(group.id);
    const rels = await IntercompanyRelationRepository.listRelationsByGroup(group.id);
    setEntities(ents);
    setRelations(rels);
    
    const validation = ConsolidatedDataModelValidator.validate(group, ents, rels);
    setValidationErrors(validation.errors);
    setValidationWarnings(validation.warnings);
  };

  const handleCreateGroup = async () => {
    const name = prompt('Nome da Holding ou Grupo:');
    if (!name) return;
    const year = prompt('Ano Fiscal Padrão (ex: 2026):') || new Date().getFullYear().toString();
    
    await GroupOnboardingRepository.createGroup({
      groupName: name,
      fiscalYear: year
    });
    
    loadGroups();
  };

  return (
    <ExecutivePageTemplate header={{
      title: "Gestão de Grupos Econômicos",
      description: "Modelagem de topologia de consolidação, holdings e mapeamento de relações intercompany.",
    }}>
      <div className="space-y-8 pb-24 animate-executive-fade max-w-[1440px] mx-auto">

        {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE GRUPOS ECONÔMICOS) --- */}
        <ExecutiveSummarySection 
          className="mb-8"
          status={{ label: 'Topologia Homologada', variant: 'success' }}
          question="Como está estruturada a topologia societária, consolidação fiduciária e eliminações intercompany?"
          opinion="O comitê fiduciário homologa a estrutura de consolidação do grupo econômico, assegurando a correta eliminação de saldos e transações cruzadas."
          driver="Holdings controladoras, subsidiárias coligadas, percentual de participação e eliminações."
          implication="Demonstrações financeiras consolidadas fiéis à realidade fiduciária do grupo econômico."
          executiveQuestion="Validar periodicamente o mapeamento de entidades coligadas e regras de consolidação integral."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>

        {/* --- CAMADA 2: DIRETORIA & MAPEAMENTO DE GRUPOS --- */}
        <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm mb-8 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <ExecutiveHeading as="h3" className="text-foreground">Grupos Econômicos Mapeados</ExecutiveHeading>
              <ExecutiveText variant="caption" className="text-muted-foreground">Topologia e estrutura de participações societárias.</ExecutiveText>
            </div>
            <button 
              onClick={handleCreateGroup}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-widest shadow-md hover:scale-105 transition-all flex items-center gap-2"
            >
              <Plus size={16} /> NOVO GRUPO
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {groups.length === 0 ? (
              <div className="col-span-3 text-center py-12 border border-dashed border-border rounded-xl">
                <Building2 size={40} className="mx-auto mb-3 text-primary/40" />
                <ExecutiveHeading as="h4" className="text-foreground mb-1">Nenhum Grupo Econômico Cadastrado</ExecutiveHeading>
                <ExecutiveText variant="caption" className="text-muted-foreground">Clique em "Novo Grupo" para criar a estrutura da holding.</ExecutiveText>
              </div>
            ) : (
              groups.map((g) => (
                <div 
                  key={g.id} 
                  onClick={() => loadGroupDetails(g)}
                  className={cn(
                    "p-5 border rounded-2xl cursor-pointer transition-all space-y-3",
                    selectedGroup?.id === g.id ? "bg-surface-container border-primary shadow-sm" : "bg-surface-container/20 border-border hover:border-primary/40"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <ExecutiveHeading as="h4" className="text-foreground font-bold">{g.groupName}</ExecutiveHeading>
                    <ExecutiveBadge variant="info">Ano Fiscal: {g.fiscalYear}</ExecutiveBadge>
                  </div>
                  <ExecutiveText variant="caption" className="text-muted-foreground font-mono">ID: {g.id}</ExecutiveText>
                </div>
              ))
            )}
          </div>
        </ExecutiveSurface>

        {/* --- CAMADA 3: CAMADA TÉCNICA E VALIDAÇÃO ESTRUTURAL --- */}
        {selectedGroup && (
          <ExecutiveTechnicalLayer
            title={`Camada Técnica — Detalhamento de ${selectedGroup.groupName}`}
            subtitle="Validação de Entidades e Eliminações Intercompany"
            description="Checagem automatizada de regras fiduciárias de consolidação."
            className="mb-8"
          >
            <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <ExecutiveHeading as="h4" className="text-foreground">Entidades Integrantes</ExecutiveHeading>
                <ExecutiveBadge variant={validationErrors.length > 0 ? "critical" : "success"}>
                  {validationErrors.length > 0 ? `${validationErrors.length} Erros` : "Consolidação Válida"}
                </ExecutiveBadge>
              </div>

              <div className="overflow-x-auto border border-border rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-surface-container/30 border-b border-border text-muted-foreground font-bold uppercase tracking-wider">
                      <th className="p-4">Entidade</th>
                      <th className="p-4">CNPJ</th>
                      <th className="p-4">Papel Institucional</th>
                      <th className="p-4 text-right">Participação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {entities.map((e) => (
                      <tr key={e.id} className="hover:bg-surface-container/30 transition-colors">
                        <td className="p-4 font-bold text-foreground">{e.entityName}</td>
                        <td className="p-4 font-mono text-muted-foreground">{e.cnpj || '---'}</td>
                        <td className="p-4">
                          <ExecutiveBadge variant="neutral">{e.institutionalRole}</ExecutiveBadge>
                        </td>
                        <td className="p-4 text-right font-mono font-bold text-foreground">{e.ownershipPercentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ExecutiveSurface>
          </ExecutiveTechnicalLayer>
        )}

      </div>
    </ExecutivePageTemplate>
  );
}
