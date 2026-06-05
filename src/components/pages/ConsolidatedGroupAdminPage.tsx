import React, { useState, useEffect } from 'react';
import { GroupOnboardingRepository, EconomicGroupModel } from '../../services/FiduciaryRuntimeAdapter';
import { GroupEntityMappingRepository, EconomicGroupEntityModel } from '../../services/FiduciaryRuntimeAdapter';
import { IntercompanyRelationRepository, IntercompanyRelationModel } from '../../services/FiduciaryRuntimeAdapter';
import { ConsolidatedDataModelValidator } from '../../services/FiduciaryRuntimeAdapter';
import { Building2, Plus, AlertTriangle, Play, Users } from 'lucide-react';
import { PageHeader } from '../Common';
import { cn } from '../../lib/utils';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

export function ConsolidatedGroupAdminPage() {
  const { t } = useLanguage();
  const [groups, setGroups] = useState<EconomicGroupModel[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<EconomicGroupModel | null>(null);
  const [entities, setEntities] = useState<EconomicGroupEntityModel[]>([]);
  const [relations, setRelations] = useState<IntercompanyRelationModel[]>([]);
  const [availableClients, setAvailableClients] = useState<any[]>([]); // DTOs brutos de clients legados
  const navigate = useNavigate();

  // Estados de erro
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
    
    // Auto-validate ao carregar
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

  const handleLinkEntity = async (legacyClientId: string) => {
    if (!selectedGroup) return;
    const client = availableClients.find(c => c.id === legacyClientId);
    if (!client) return;

    await GroupEntityMappingRepository.linkEntity({
      groupId: selectedGroup.id,
      legacyClientId: legacyClientId,
      entityName: client.nome || client.razaoSocial || 'Unnamed Client',
      cnpj: client.cnpj,
      institutionalRole: 'SUBSIDIARY',
      ownershipPercentage: 100,
      consolidationMethod: 'FULL',
      isControllingEntity: false,
      includeInConsolidation: true
    });

    loadGroupDetails(selectedGroup);
  };

  const handleExecuteConsolidated = () => {
    if (validationErrors.length > 0) {
      alert('Não é possível iniciar motor com falhas estruturais.');
      return;
    }
    // Roteamento puro, não injeta dados. A tela /consolidated-executive buscará os dados.
    // Nota: Como não estamos conectando o DB ao Contexto hoje, apenas preparamos a rota.
    // No futuro, passaremos ?groupId=XYZ
    navigate('/consolidated-executive');
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12 pb-32 animate-executive-fade">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <PageHeader
          title="Gestão de Grupos Econômicos"
          subtitle="Ferramenta administrativa restrita. Modelagem institucional topológica. Nenhuma inferência financeira executada localmente."
          icon={Building2}
          transparent
        />
        <button onClick={handleCreateGroup} className="btn-executive flex items-center gap-2 shrink-0">
          <Plus size={15} />
          Novo Grupo
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Col: Groups */}
        <div className="col-span-4 space-y-4">
          <h3 className="text-h3 font-medium text-foreground tracking-tight">Grupos Cadastrados</h3>
          {groups.map(g => (
            <div 
              key={g.id} 
              onClick={() => loadGroupDetails(g)}
              className={cn(
                "p-5 rounded-md border cursor-pointer transition-all",
                selectedGroup?.id === g.id ? "bg-surface-container shadow-sm border-secondary" : "border-border hover:border-secondary/30"
              )}
            >
              <h4 className="text-body-sm font-medium text-foreground">{g.groupName}</h4>
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mt-1">Ano Fiscal: {g.fiscalYear}</p>
            </div>
          ))}
        </div>

        {/* Right Col: Details */}
        <div className="col-span-8 space-y-6">
          {selectedGroup ? (
            <>
              {/* Validation Panel */}
              {(validationErrors.length > 0 || validationWarnings.length > 0) && (
                <div className="p-4 rounded-xl bg-surface-container border border-border">
                  <h3 className="text-sm font-medium text-foreground flex items-center gap-2 mb-3">
                    <AlertTriangle size={16} className={validationErrors.length > 0 ? "text-rose-500" : "text-amber-500"} />
                    Pre-Flight Structural Check
                  </h3>
                  {validationErrors.map((e: any, i) => (
                    <p key={i} className="text-xs text-rose-500 mt-1">• [ERROR] {typeof e === 'string' ? e : t(e.labelKey, e.args)}</p>
                  ))}
                  {validationWarnings.map((w: any, i) => (
                    <p key={i} className="text-xs text-amber-500 mt-1">• [WARN] {typeof w === 'string' ? w : t(w.labelKey, w.args)}</p>
                  ))}
                </div>
              )}

              {/* Entities */}
              <div className="card-premium p-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h3 className="text-h3 font-medium text-foreground tracking-tight flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-secondary/10 flex items-center justify-center text-secondary">
                      <Users size={16} />
                    </div>
                    Entidades Vinculadas
                  </h3>
                  <div className="flex items-center gap-2">
                    <select 
                      className="bg-surface-container text-body-sm font-medium border border-border rounded-md px-3 py-2 outline-none text-foreground focus:border-secondary transition-all"
                      onChange={(e) => {
                        if(e.target.value) {
                          handleLinkEntity(e.target.value);
                          e.target.value = '';
                        }
                      }}
                    >
                      <option value="">+ Vincular Legado...</option>
                      {availableClients.filter(c => !entities.some(e => e.legacyClientId === c.id)).map(c => (
                        <option key={c.id} value={c.id}>{c.nome || c.razaoSocial}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  {entities.map(ent => (
                    <div key={ent.id} className="flex items-center justify-between p-4 rounded-md bg-surface-container border border-border">
                      <div>
                        <p className="text-body-sm font-medium text-foreground">{ent.entityName}</p>
                        <p className="text-[10px] text-muted-foreground font-mono mt-1">ID: {ent.id} | Bridge: {ent.legacyClientId}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{ent.institutionalRole}</span>
                        <span className="text-body-sm font-medium text-secondary">{ent.ownershipPercentage}%</span>
                      </div>
                    </div>
                  ))}
                  {entities.length === 0 && (
                    <p className="text-body-sm text-muted-foreground italic text-center py-6">Nenhuma entidade vinculada.</p>
                  )}
                </div>
              </div>

              {/* Execute Button */}
              <div className="flex justify-end">
                <button 
                  onClick={handleExecuteConsolidated}
                  disabled={validationErrors.length > 0}
                  className="btn-executive flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play size={15} />
                  Executar Motor Consolidado
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground border-2 border-dashed border-border rounded-md py-20 gap-4">
              <div className="w-16 h-16 rounded-xl bg-surface-container flex items-center justify-center">
                <Building2 size={32} className="opacity-30" />
              </div>
              <p className="text-body-sm font-medium text-muted-foreground/60 uppercase tracking-widest">Selecione um grupo ao lado ou crie um novo.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
