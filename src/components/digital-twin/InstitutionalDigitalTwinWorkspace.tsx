import React, { useEffect, useState } from 'react';
import { Layers, Search, History, Shield, Network, Database } from 'lucide-react';
import { InstitutionalDigitalTwinRuntime } from '../../core/digital-twin/InstitutionalDigitalTwinRuntime';
import { TwinAssemblyEngine } from '../../core/digital-twin/TwinAssemblyEngine';
import { 
  InstitutionalDigitalTwinViewModel, 
  UIDigitalTwin, 
  UITwinDomain, 
  UITwinRelationship,
  UIMapNode
} from '../../viewmodels/digital-twin/InstitutionalDigitalTwinViewModel';
import { PageHeader } from '../Common';
import { InstitutionalMapViewer } from './InstitutionalMapViewer';
import { DomainHealthExplorer } from './DomainHealthExplorer';
import { ExecutiveDigitalTwinDashboard } from './ExecutiveDigitalTwinDashboard';
import { Link, useNavigate } from 'react-router-dom';

interface InstitutionalDigitalTwinWorkspaceProps {
  runtime: InstitutionalDigitalTwinRuntime;
  assemblyEngine: TwinAssemblyEngine;
  tenantId: string;
}

export const InstitutionalDigitalTwinWorkspace: React.FC<InstitutionalDigitalTwinWorkspaceProps> = ({
  runtime,
  assemblyEngine,
  tenantId
}) => {
  const navigate = useNavigate();

  const handleCrossNavigation = (targetWorkspace: string, path: string) => {
    const navRef = {
      tenantId,
      sourceWorkspace: 'DIGITAL_TWIN',
      targetWorkspace,
      correlationId: `nav-${Date.now()}`
    };
    navigate(path, { state: { navRef } });
  };

  const [twin, setTwin] = useState<UIDigitalTwin | null>(null);
  const [domains, setDomains] = useState<UITwinDomain[]>([]);
  const [relationships, setRelationships] = useState<UITwinRelationship[]>([]);
  const [mapData, setMapData] = useState<UIMapNode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const { twin: rawTwin, relationships: rawRels } = await runtime.loadInstitutionalTwin(tenantId);
        if (!active) return;

        if (!rawTwin) {
          setLoading(false);
          return;
        }

        const { domains: assembledDomains } = await assemblyEngine.assembleTwinOverview(tenantId);
        if (!active) return;

        setTwin(InstitutionalDigitalTwinViewModel.adaptTwin(rawTwin));
        setDomains(InstitutionalDigitalTwinViewModel.adaptDomains(assembledDomains));
        setRelationships(InstitutionalDigitalTwinViewModel.adaptRelationships(rawRels, assembledDomains));
        setMapData(InstitutionalDigitalTwinViewModel.adaptToMap(rawTwin.title, assembledDomains));

      } catch (err) {
        console.error("Digital Twin load failed:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [runtime, assemblyEngine, tenantId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Layers className="animate-pulse text-indigo-500 mb-4" size={32} />
        <p className="text-eyebrow text-muted-foreground">Sincronizando Digital Twin...</p>
      </div>
    );
  }

  if (!twin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
        <Shield size={48} className="mb-4 text-muted-foreground/60" />
        <p>Gêmeo Digital Institucional não disponível para este ambiente.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-6 lg:px-10 space-y-8 pb-32 animate-executive-fade">
      <div className="flex justify-between items-start mb-4">
        <PageHeader
          title="Institutional Digital Twin"
          subtitle={`${twin.name} • Atualizado em ${twin.updatedAt}`}
          icon={Layers}
          transparent
        />
        <div className="flex gap-2">
          <button
            onClick={() => handleCrossNavigation('INTELLIGENCE_FABRIC', `/intelligence/root`)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-sm font-display font-medium rounded-[12px] transition-colors border border-indigo-500/30 shadow-sm"
          >
            <Network size={16} />
            <span>Intelligence Fabric</span>
          </button>
          <button
            onClick={() => handleCrossNavigation('ADVISOR', `/advisor`)}
            className="btn-secondary"
          >
            <Layers size={16} className="text-indigo-400" />
            <span>Voltar ao Advisor Workspace</span>
          </button>
          <button
            onClick={() => handleCrossNavigation('WAR_ROOM', `/war-room`)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-sm font-display font-medium rounded-[12px] transition-colors border border-amber-500/30 shadow-sm"
          >
            <span>Ver Cenários Relacionados</span>
          </button>
        </div>
      </div>

      <ExecutiveDigitalTwinDashboard domains={domains} relationships={relationships} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Coluna 1: Domínios (Map Viewer) */}
        <div className="xl:col-span-3 space-y-6">
          <div className="card-premium p-5 h-full">
            <h3 className="text-eyebrow text-foreground mb-4 flex items-center gap-2">
              <Network size={14} /> Topologia
            </h3>
            {mapData ? (
              <InstitutionalMapViewer mapData={mapData} />
            ) : (
              <p className="text-xs text-muted-foreground">Domínios não encontrados.</p>
            )}
          </div>
        </div>

        {/* Coluna 2: Estado Atual (Domain Health Explorer) */}
        <div className="xl:col-span-4 space-y-6">
          <DomainHealthExplorer domains={domains} />
        </div>

        {/* Coluna 3: Relacionamentos */}
        <div className="xl:col-span-3 space-y-6">
          <div className="card-premium p-5 h-full">
            <h3 className="text-eyebrow text-foreground mb-4 flex items-center gap-2">
              <Layers size={14} /> Relacionamentos Estruturais
            </h3>
            {relationships.length === 0 ? (
              <p className="text-[10px] text-muted-foreground italic p-4 bg-surface-container rounded-lg">Sem relações institucionais registradas.</p>
            ) : (
              <div className="space-y-3">
                {relationships.map(rel => (
                  <div key={rel.id} className="p-3 bg-surface-container border border-border rounded-lg">
                    <p className="text-[10px] font-bold text-foreground">{rel.sourceName}</p>
                    <div className="flex items-center gap-2 my-1">
                      <div className="h-px bg-border flex-1" />
                      <span className="text-[9px] uppercase font-mono text-indigo-400">{rel.type}</span>
                      <div className="h-px bg-border flex-1" />
                    </div>
                    <p className="text-[10px] font-bold text-foreground text-right">{rel.targetName}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Coluna 4: Evidências, Explicabilidade e Integrações */}
        <div className="xl:col-span-2 space-y-6">
          <div className="card-premium p-5 space-y-6">
            <div>
              <h3 className="text-eyebrow text-foreground mb-3 flex items-center gap-2">
                <Search size={14} /> Investigação
              </h3>
              <p className="text-[10px] text-muted-foreground mb-3">Navegue pelas anomalias persistidas no Knowledge Graph.</p>
              <Link 
                to="/investigation/root"
                className="flex items-center justify-center gap-2 w-full py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 text-xs font-bold uppercase rounded-lg transition-colors border border-indigo-500/20"
              >
                Board Workspace
              </Link>
            </div>

            <div className="w-full h-px bg-border" />

            <div>
              <h3 className="text-eyebrow text-foreground mb-3 flex items-center gap-2">
                <History size={14} /> Evolução
              </h3>
              <p className="text-[10px] text-muted-foreground mb-3">Reconstrua a trajetória institucional temporal.</p>
              <Link 
                to="/governance-time-machine"
                className="flex items-center justify-center gap-2 w-full py-2 bg-sky-600/10 hover:bg-sky-600/20 text-sky-400 text-xs font-bold uppercase rounded-lg transition-colors border border-sky-500/20"
              >
                Time Machine
              </Link>
            </div>

            <div className="w-full h-px bg-border" />

            <div>
              <h3 className="text-eyebrow text-foreground mb-3 flex items-center gap-2">
                <Database size={14} /> Memória
              </h3>
              <p className="text-[10px] text-muted-foreground mb-3">Explore a recorrência de fatos e linhagem de aprendizado.</p>
              <Link 
                to="/memory"
                className="flex items-center justify-center gap-2 w-full py-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 text-xs font-bold uppercase rounded-lg transition-colors border border-emerald-500/20"
              >
                Memory Workspace
              </Link>
            </div>
            
            <div className="w-full h-px bg-border" />
            
            <div>
              <p className="text-[10px] text-muted-foreground italic">Evidências e Cadeias de Explicabilidade são carregadas sob demanda nas rotas de investigação para garantir integridade fiduciária.</p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};
