import React from 'react';
import { IntelligenceLineage } from '@/core/intelligence/lineage/IntelligenceLineage';

export function IntelligenceTraceViewer({ lineage }: { lineage: IntelligenceLineage }) {
  // Renders a visual DAG (Directed Acyclic Graph) of the intelligence lineage.
  // This proves causality (Conversation -> Signal -> Insight -> Decision -> Outcome).

  return (
    <div className="p-6 bg-white border rounded shadow-sm">
      <h3 className="text-lg font-bold border-b pb-2 mb-4">Intelligence Lineage Explorer™</h3>
      
      <div className="flex flex-col space-y-4">
        {lineage.nodes.map(node => (
          <div key={node.id} className="flex items-center">
            <div className="w-32 text-right pr-4 font-semibold text-gray-600 capitalize">
              {node.type}
            </div>
            <div className="w-4 h-4 rounded-full bg-blue-500 relative z-10 shadow-md"></div>
            <div className="pl-4 border-l-2 border-gray-200 -ml-[9px] min-h-[40px] flex items-center w-full">
              <div className="ml-4 bg-gray-50 p-2 rounded w-full border text-sm">
                ID: {node.referenceId}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t text-xs text-gray-400">
        Trace ID: {lineage.lineageId}
      </div>
    </div>
  );
}
