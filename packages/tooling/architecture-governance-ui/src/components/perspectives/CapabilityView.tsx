import React from 'react';
import { EnrichedArtifact } from '../../read-model/ArchitectureExplorerModel';

interface Props {
  artifact: EnrichedArtifact;
}

export const CapabilityView: React.FC<Props> = ({ artifact }) => {
  return (
    <div className="bg-[#121214] border border-[#2a2a2f] rounded-lg p-6 text-white h-full flex flex-col">
      <h3 className="text-xl font-semibold mb-1">{artifact.name}</h3>
      <p className="text-sm text-white/50 mb-6">Type: {artifact.type} | Conf: {artifact.confidence}</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#1a1a1f] p-4 rounded border border-[#2a2a2f]">
          <h4 className="text-xs text-white/40 uppercase tracking-wide mb-2">Internal Facts</h4>
          {artifact.observations.filter(o => o.category === 'BOUNDARY').map(obs => (
            <div key={obs.id} className="flex justify-between items-center mb-1">
              <span className="text-sm text-white/70">{obs.metric}</span>
              <span className="text-sm font-medium">{obs.value}</span>
            </div>
          ))}
        </div>
        
        <div className="bg-[#1a1a1f] p-4 rounded border border-[#2a2a2f]">
          <h4 className="text-xs text-white/40 uppercase tracking-wide mb-2">Topology Facts</h4>
          {artifact.observations.filter(o => o.category === 'DEPENDENCY').map(obs => (
            <div key={obs.id} className="flex justify-between items-center mb-1">
              <span className="text-sm text-white/70">{obs.metric}</span>
              <span className="text-sm font-medium">{obs.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1">
        <h4 className="text-xs text-white/40 uppercase tracking-wide mb-2">Structural Findings</h4>
        {artifact.findings.length === 0 ? (
          <div className="text-sm text-white/30 italic">No structural findings recorded.</div>
        ) : (
          <div className="space-y-2">
            {artifact.findings.map(f => (
              <div key={f.id} className="bg-[#212126] border border-[#333338] px-3 py-2 rounded flex justify-between items-center">
                <span className="text-sm text-white/80">{f.type}</span>
                <span className="text-xs text-white/50">Val: {f.actualValue}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-[#2a2a2f] text-xs text-white/30">
        Discovered At: {artifact.discoveredAt} <br/>
        Observability Engine v1.0
      </div>
    </div>
  );
};
