import React from 'react';
import { UIMapNode } from '../../viewmodels/digital-twin/InstitutionalDigitalTwinViewModel';
import { Network, Server } from 'lucide-react';

interface InstitutionalMapViewerProps {
  mapData: UIMapNode;
}

export const InstitutionalMapViewer: React.FC<InstitutionalMapViewerProps> = ({ mapData }) => {
  
  const renderNode = (node: UIMapNode, level: number = 0) => {
    return (
      <div key={node.id} className="relative">
        <div className={`flex items-center gap-3 py-2 ${level > 0 ? 'ml-6' : ''}`}>
          {level > 0 && (
            <div className="absolute left-[-16px] top-[18px] w-[12px] h-px bg-slate-700" />
          )}
          {level > 0 && (
            <div className="absolute left-[-16px] top-[-10px] w-px h-[28px] bg-slate-700" />
          )}
          
          <div className={`flex items-center justify-center rounded-lg p-2 ${level === 0 ? 'bg-indigo-500/20 text-indigo-400' : 'bg-surface-container text-foreground'}`}>
            {level === 0 ? <Server size={18} /> : <Network size={14} />}
          </div>
          
          <div>
            <p className="text-xs font-bold text-foreground">{node.name}</p>
            <p className="text-[9px] font-mono uppercase text-muted-foreground">{node.type}</p>
          </div>
        </div>
        
        {node.children && node.children.length > 0 && (
          <div className="relative">
            <div className="absolute left-3 top-0 w-px h-full bg-slate-800" />
            <div className="pl-3">
              {node.children.map(child => renderNode(child, level + 1))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 bg-surface-container rounded-xl border border-border overflow-x-auto">
      {renderNode(mapData)}
    </div>
  );
};
