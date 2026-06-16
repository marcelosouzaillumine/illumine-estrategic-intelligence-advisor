// src/components/panels/causal-intelligence/SurvivabilityDependencyGraphPanel.tsx

import React, { useMemo } from 'react';
import { CausalGraph, CausalNode, CausalSeverity } from '../../../services/FiduciaryRuntimeAdapter';
import { Layers, ArrowRight } from 'lucide-react';

interface DependencyGraphPanelProps {
  graph?: CausalGraph;
}

export const SurvivabilityDependencyGraphPanel: React.FC<DependencyGraphPanelProps> = ({ graph = { nodes: [], edges: [] } }) => {
  const { nodes = [], edges = [] } = graph;

  // Calculate layer positions for deterministic, premium SVG layout
  const layoutNodes = useMemo(() => {
    const rootCauses = nodes.filter(n => n.type === 'ROOT_CAUSE');
    const intermediaries = nodes.filter(n => n.type === 'INTERMEDIARY_PRESSURE');
    const symptoms = nodes.filter(n => n.type === 'SYMPTOM');

    const result: Array<CausalNode & { x: number; y: number }> = [];

    // Columns: Root Causes (X = 60), Intermediaries (X = 260), Symptoms (X = 460)
    const height = 300;
    
    rootCauses.forEach((node, i) => {
      const spacing = height / (rootCauses.length + 1);
      result.push({ ...node, x: 70, y: spacing * (i + 1) });
    });

    intermediaries.forEach((node, i) => {
      const spacing = height / (intermediaries.length + 1);
      result.push({ ...node, x: 270, y: spacing * (i + 1) });
    });

    symptoms.forEach((node, i) => {
      const spacing = height / (symptoms.length + 1);
      result.push({ ...node, x: 470, y: spacing * (i + 1) });
    });

    return result;
  }, [nodes]);

  const getNodeColor = (severity: CausalSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'var(--color-state-critical)';
      case 'HIGH':
        return 'var(--color-state-warning)';
      case 'MODERATE':
        return 'var(--color-state-warning)';
      default:
        return 'var(--color-primary)';
    }
  };

  const getEdgePoints = (sourceId: string, targetId: string) => {
    const src = layoutNodes.find(n => n.id === sourceId);
    const tgt = layoutNodes.find(n => n.id === targetId);
    if (!src || !tgt) return null;
    return { x1: src.x, y1: src.y, x2: tgt.x, y2: tgt.y };
  };

  return (
    <div className="p-6 rounded-3xl border border-border bg-white shadow-sm flex flex-col gap-4 col-span-1 md:col-span-2">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5">
          <Layers size={14} className="text-primary" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Grafo de Dependência de Sobrevivência
          </h4>
        </div>
        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full border bg-primary text-primary border-primary">
          fiduciário
        </span>
      </div>

      {nodes.length === 0 ? (
        <div className="text-center py-12 text-xs text-muted-foreground italic">
          Histórico ou reconciliação insuficiente para compilar o grafo causal.
        </div>
      ) : (
        <>
          {/* SVG Graph View */}
          <div className="border border-border rounded-2xl bg-slate-50/50 p-4 flex justify-center items-center overflow-x-auto">
            <svg width="540" height="300" className="max-w-full">
              <defs>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-border)" />
                </marker>
              </defs>

              {/* Render edges */}
              {edges.map((edge, i) => {
                const pts = getEdgePoints(edge.source, edge.target);
                if (!pts) return null;
                return (
                  <g key={i}>
                    <line
                      x1={pts.x1}
                      y1={pts.y1}
                      x2={pts.x2}
                      y2={pts.y2}
                      stroke="var(--color-border)"
                      strokeWidth="1.5"
                      markerEnd="url(#arrow)"
                      strokeDasharray="4 2"
                    />
                  </g>
                );
              })}

              {/* Render nodes */}
              {layoutNodes.map((node, i) => {
                const color = getNodeColor(node.severity);
                return (
                  <g key={i} transform={`translate(${node.x}, ${node.y})`}>
                    <circle r="7" fill={color} stroke="var(--color-card)" strokeWidth="2" className="drop-shadow-sm" />
                    {/* Background rectangle for premium legibility */}
                    <rect
                      x="-65"
                      y="12"
                      width="130"
                      height="22"
                      rx="4"
                      fill="var(--color-card)"
                      stroke="var(--color-surface)"
                      strokeWidth="1"
                    />
                    <text
                      y="24"
                      textAnchor="middle"
                      fontSize="8"
                      fontWeight="bold"
                      fill="var(--color-state-neutral)"
                    >
                      {node.label.length > 22 ? `${node.label.substring(0, 20)}...` : node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Accessible Fallback Cascade List */}
          <div className="space-y-2 mt-2">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Cadeia de Relações Causa-Efeito
            </h5>
            <div className="space-y-1.5">
              {edges.map((edge, i) => {
                const srcNode = nodes.find(n => n.id === edge.source);
                const tgtNode = nodes.find(n => n.id === edge.target);
                if (!srcNode || !tgtNode) return null;
                return (
                  <div key={i} className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-slate-50/50 p-2 rounded-xl border border-border">
                    <span className="text-[9px] font-bold text-muted-foreground bg-slate-200/50 px-1.5 py-0.5 rounded">
                      {srcNode.label}
                    </span>
                    <ArrowRight size={10} className="text-muted-foreground shrink-0" />
                    <span className="text-[9px] font-bold text-muted-foreground bg-slate-200/50 px-1.5 py-0.5 rounded">
                      {tgtNode.label}
                    </span>
                    <span className="text-[9px] text-muted-foreground italic font-medium ml-auto">
                      ({edge.description})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
