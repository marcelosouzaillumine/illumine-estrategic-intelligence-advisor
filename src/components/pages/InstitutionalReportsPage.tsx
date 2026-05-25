import React, { useState, useEffect } from 'react';
import { FileText, Printer, Download, ShieldCheck, Clock, Activity, Link as LinkIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { GroupOnboardingRepository, EconomicGroupModel } from '../../core/runtime/consolidated/data/GroupOnboardingRepository';
import { ExecutiveBoardPack } from '../../core/runtime/reporting/ReportingTypes';
import { GovernedRepositoryWrapper } from '../../core/security/governed-repository';
import { DataAccessContext } from '../../core/security/data-access-context';
import { auth } from '../../lib/firebase';

// Estilo auxiliar interno para lidar com CSS Print
const PrintStyles = () => (
  <style>{`
    @media print {
      body * {
        visibility: hidden;
      }
      #printable-board-pack, #printable-board-pack * {
        visibility: visible;
      }
      #printable-board-pack {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        margin: 0;
        padding: 2cm;
      }
      .no-print {
        display: none !important;
      }
      .page-break {
        page-break-before: always;
      }
    }
  `}</style>
);

// Removed mockBoardPack per Phase 5 directives

function LineageStamp({ lineage }: { lineage: any }) {
  return (
    <div className="bg-secondary/10 border border-secondary/30 p-3 rounded-lg text-[10px] font-mono text-secondary-foreground space-y-1 mt-6 no-print">
      <div className="flex items-center gap-2 font-bold mb-2 uppercase tracking-widest"><ShieldCheck size={14}/> Fiduciary Lineage Stamp</div>
      <div className="grid grid-cols-2 gap-2">
        <div><span className="opacity-50">Execution ID:</span> {lineage.executionId}</div>
        <div><span className="opacity-50">Report Ver:</span> v{lineage.reportVersion}</div>
        <div><span className="opacity-50">Input Hash:</span> {lineage.inputHash.slice(0, 16)}...</div>
        <div><span className="opacity-50">Lineage Hash:</span> {lineage.lineageHash.slice(0, 16)}...</div>
      </div>
    </div>
  );
}

export function InstitutionalReportsPage() {
  const [groups, setGroups] = useState<EconomicGroupModel[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [pack, setPack] = useState<ExecutiveBoardPack | null>(null);

  useEffect(() => {
    GroupOnboardingRepository.listGroups().then(setGroups);
  }, []);

  const handleLoadReport = () => {
    if (!selectedGroupId) return;
    // Onde ainda não houver runtime real, não renderizamos mock. O usuário será avisado na UI.
    alert("A geração do relatório institucional depende do Runtime real que será conectado na fase de integração. Mocks desativados (Release Protocol).");
    setPack(null);
  };

  const buildContext = (action: 'EXPORT_BOARD_PACK' | 'EXPORT_SNAPSHOT'): DataAccessContext => {
    const currentUserId = auth.currentUser?.uid || 'guest';
    const cleanId = pack?.groupId || selectedGroupId || 'guest';
    return {
      actorId: currentUserId,
      tenantId: cleanId, // legacyTenantId (dívida técnica transitória, deve usar TenantProvider)
      role: 'CFO',
      permissions: [action],
      entityScope: {
        tenantId: cleanId,
        requestedEntityScope: 'ENTITY',
        entityId: cleanId,
        allowedEntityIds: [cleanId],
        allowedGroupIds: [],
        consolidatedScope: false
      },
      requestedAction: action,
      resourceType: action === 'EXPORT_BOARD_PACK' ? 'BoardPack' : 'Snapshot',
      resourceTenantId: cleanId,
      visibilityPolicy: 'INTERNAL',
      auditRequirement: true
    };
  };

  const handlePrint = async () => {
    try {
      const context = buildContext('EXPORT_BOARD_PACK');
      await GovernedRepositoryWrapper.execute(context, async () => {
        window.print();
      });
    } catch (e: any) {
      alert(`Erro Fiduciário: ${e.message}`);
    }
  };

  const handleExportJSON = async () => {
    if (!pack) return;
    try {
      const context = buildContext('EXPORT_SNAPSHOT');
      await GovernedRepositoryWrapper.execute(context, async () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(pack, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", `BoardPack_${pack.groupId}_v${pack.version}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      });
    } catch (e: any) {
      alert(`Erro Fiduciário: ${e.message}`);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in bg-background min-h-screen">
      <PrintStyles />
      
      <div className="flex items-center justify-between no-print">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <FileText className="text-primary" />
            Relatórios Institucionais (Executive Board Pack)
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Formalização Fiduciária Imutável. Exportação Zero-Dependency para Conselhos e Auditores.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            className="w-64 bg-surface-container border border-border p-2 rounded-md outline-none text-sm text-foreground"
            value={selectedGroupId} 
            onChange={(e) => setSelectedGroupId(e.target.value)}
          >
            <option value="">Selecionar Grupo Alvo...</option>
            {groups.map(g => <option key={g.id} value={g.id}>{g.groupName}</option>)}
          </select>
          <button 
            onClick={handleLoadReport}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-button text-sm font-medium hover:bg-primary/90"
          >
            Load Latest
          </button>
        </div>
      </div>

      {!pack && (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground/50 border-2 border-dashed border-border rounded-2xl no-print">
          <FileText size={48} className="mb-4 opacity-50" />
          <p>Selecione um grupo para visualizar os pacotes executivos formalizados.</p>
        </div>
      )}

      {pack && (
        <div className="grid grid-cols-12 gap-8">
          {/* Controls Panel (No Print) */}
          <div className="col-span-3 space-y-4 no-print">
            <div className="p-4 bg-surface-container border border-border rounded-xl space-y-4">
              <h3 className="font-medium flex items-center gap-2 text-sm"><Clock size={16}/> Histórico de Versões</h3>
              <div className="p-2 bg-background border border-secondary rounded flex items-center justify-between text-xs font-medium text-secondary">
                <span>Versão Atual (v{pack.version})</span>
                <span>{new Date(pack.timestamp).toLocaleDateString()}</span>
              </div>
              <button className="w-full text-xs text-muted-foreground p-2 border border-border border-dashed rounded hover:bg-neutral/10">
                Ver Versões Anteriores...
              </button>
            </div>

            <div className="p-4 bg-surface-container border border-border rounded-xl space-y-4">
              <h3 className="font-medium flex items-center gap-2 text-sm"><Activity size={16}/> Exportação Formal</h3>
              <button onClick={handlePrint} className="w-full flex items-center justify-center gap-2 bg-background border border-border text-foreground p-2 rounded hover:border-secondary transition-colors text-sm">
                <Printer size={16}/> Gerar PDF (Imprimir)
              </button>
              <button onClick={handleExportJSON} className="w-full flex items-center justify-center gap-2 bg-background border border-border text-foreground p-2 rounded hover:border-secondary transition-colors text-sm">
                <Download size={16}/> Exportar Snapshot JSON
              </button>
            </div>
          </div>

          {/* Document Viewer (Printable) */}
          <div className="col-span-9">
            <div id="printable-board-pack" className="bg-white text-black p-10 rounded-xl shadow-sm border border-border min-h-[800px]">
              {/* Capa */}
              <div className="border-b-4 border-black pb-8 mb-8">
                <p className="text-sm font-bold tracking-widest text-gray-500 mb-2 uppercase">Executive Board Pack</p>
                <h1 className="text-4xl font-extrabold mb-4 text-black">Relatório Institucional de Governança e Performance</h1>
                <div className="flex justify-between text-sm text-gray-600 font-medium">
                  <span>Grupo Econômico: {pack.groupId}</span>
                  <span>Data Base: {new Date(pack.timestamp).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Seção 1: Executive Summary */}
              <div className="mb-12">
                <h2 className="text-xl font-bold border-b border-gray-300 pb-2 mb-4 text-black">1. Parecer Executivo (Advisory)</h2>
                <p className="text-sm leading-relaxed text-gray-800 text-justify">
                  {pack.executiveReport.executiveSummary}
                </p>
                <LineageStamp lineage={pack.executiveReport.lineage} />
              </div>

              {/* Seção 2: Governance Audit */}
              <div className="page-break">
                <h2 className="text-xl font-bold border-b border-gray-300 pb-2 mb-4 text-black">2. Auditoria de Governança</h2>
                
                {pack.governanceReport.warningViolations.length > 0 ? (
                  <div className="space-y-4">
                    {pack.governanceReport.warningViolations.map((v, i) => (
                      <div key={i} className="p-4 bg-gray-50 border-l-4 border-amber-500 rounded text-sm">
                        <p className="font-bold text-amber-700 mb-1">[{v.severity}] Alerta de Integridade</p>
                        <p className="text-gray-700">{v.message}</p>
                        <p className="text-xs text-gray-500 mt-2 font-mono">Entidades: {v.affectedEntities.join(', ')}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 italic">Nenhuma violação institucional detectada nesta emissão.</p>
                )}
                <LineageStamp lineage={pack.governanceReport.lineage} />
              </div>

              {/* Rodapé Fiduciário */}
              <div className="mt-24 pt-8 border-t border-gray-300 text-[10px] text-gray-500 text-center uppercase tracking-widest">
                <p>Illumine Strategic Intelligence Advisor</p>
                <p>Documento Gerado Eletronicamente. Fiduciary Snapshot Ref: {pack.fiduciarySnapshotRef}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
