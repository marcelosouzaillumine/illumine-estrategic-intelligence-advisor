import React, { useState, useEffect } from 'react';
import { GroupOnboardingRepository, EconomicGroupModel } from '../../core/runtime/consolidated/data/GroupOnboardingRepository';
import { GroupEntityMappingRepository, EconomicGroupEntityModel } from '../../core/runtime/consolidated/data/GroupEntityMappingRepository';
import { IntercompanyRelationRepository, IntercompanyRelationModel } from '../../core/runtime/consolidated/data/IntercompanyRelationRepository';
import { ConsolidatedDataModelValidator } from '../../core/runtime/consolidated/data/ConsolidatedDataModelValidator';
import { Building2, Save, Plus, AlertTriangle, Play, Users, Link as LinkIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';

export function ConsolidatedGroupAdminPage() {
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
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Building2 className="text-primary" />
            Gestão de Grupos Econômicos (Onboarding)
          </h1>
          <p className="text-muted-foreground mt-1">
            Ferramenta administrativa restrita. Modelagem institucional topológica. Nenhuma inferência financeira executada localmente.
          </p>
        </div>
        <button onClick={handleCreateGroup} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-button font-medium text-sm">
          <Plus size={16} />
          Novo Grupo
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Col: Groups */}
        <div className="col-span-4 space-y-4">
          <h2 className="font-medium text-foreground uppercase tracking-widest text-xs">Grupos Cadastrados</h2>
          {groups.map(g => (
            <div 
              key={g.id} 
              onClick={() => loadGroupDetails(g)}
              className={cn(
                "p-4 rounded-xl border cursor-pointer transition-all",
                selectedGroup?.id === g.id ? "bg-surface-container/50 border-primary shadow-sm" : "border-border hover:border-neutral/30"
              )}
            >
              <h3 className="font-medium text-sm text-foreground">{g.groupName}</h3>
              <p className="text-xs text-muted-foreground">Ano Fiscal: {g.fiscalYear}</p>
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
                  {validationErrors.map((e, i) => (
                    <p key={i} className="text-xs text-rose-500 mt-1">• [ERROR] {e}</p>
                  ))}
                  {validationWarnings.map((w, i) => (
                    <p key={i} className="text-xs text-amber-500 mt-1">• [WARN] {w}</p>
                  ))}
                </div>
              )}

              {/* Entities */}
              <div className="p-6 rounded-2xl border border-border bg-background shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-foreground flex items-center gap-2">
                    <Users size={16} className="text-secondary" />
                    Entidades Vinculadas
                  </h3>
                  <div className="flex items-center gap-2">
                    <select 
                      className="bg-surface-container text-xs border border-border rounded px-2 py-1 outline-none text-foreground"
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

                <div className="space-y-2">
                  {entities.map(ent => (
                    <div key={ent.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-container/30 border border-border">
                      <div>
                        <p className="text-sm font-medium text-foreground">{ent.entityName}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">ID: {ent.id} | Bridge: {ent.legacyClientId}</p>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-neutral">{ent.institutionalRole}</span>
                        <span className="text-secondary font-mono">{ent.ownershipPercentage}%</span>
                      </div>
                    </div>
                  ))}
                  {entities.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">Nenhuma entidade vinculada.</p>
                  )}
                </div>
              </div>

              {/* Execute Button */}
              <div className="flex justify-end">
                <button 
                  onClick={handleExecuteConsolidated}
                  disabled={validationErrors.length > 0}
                  className="flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-button font-medium shadow-md hover:bg-secondary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play size={16} />
                  Executar Motor Consolidado
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Building2 size={48} className="opacity-20 mb-4" />
              <p>Selecione um grupo ao lado ou crie um novo.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
