import React from 'react';
import { EnrichedArtifact } from '../../read-model/ArchitectureExplorerModel';

interface Props {
  artifacts: EnrichedArtifact[];
  onSelectArtifact: (id: string) => void;
}

export const ArchitectureGraphViewer: React.FC<Props> = ({ artifacts, onSelectArtifact }) => {
  // G2.0.5: Progressive Exploration - Cluster first
  const capabilities = artifacts.filter(a => a.type === 'CAPABILITY' || a.type === 'PACKAGE');

  return (
    <div className="bg-[#121214] border border-[#2a2a2f] rounded-lg p-6 min-h-[400px] flex flex-col relative">
      <h3 className="text-white/80 font-medium mb-4">Topology Visualization (Cluster Level 1)</h3>
      <div className="flex-1 grid grid-cols-3 gap-4">
        {capabilities.map(cap => (
          <div 
            key={cap.id} 
            className="border border-[#333338] bg-[#1a1a1f] p-4 rounded hover:border-[#44444a] cursor-pointer transition-colors"
            onClick={() => onSelectArtifact(cap.id)}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">{cap.name}</span>
              <span className="text-xs text-[#808085] bg-[#2a2a2f] px-2 py-0.5 rounded">{cap.type}</span>
            </div>
            <div className="text-xs text-white/50">
              {cap.outboundRelationships.length} out / {cap.inboundRelationships.length} in
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 right-4 text-xs text-white/30">
        Graph Engine: Observation Mode Active
      </div>
    </div>
  );
};
