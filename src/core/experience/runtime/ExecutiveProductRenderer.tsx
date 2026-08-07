import React, { useMemo } from 'react';
import { ExecutiveProductDefinition } from '../constitution/ExecutiveProductDefinition';
import { ExecutiveExperienceContext } from './ExecutiveExperienceContext';
import { ExecutiveRuntimeGuards } from '../constitution/ExecutiveRuntimeGuards';
import { ExperienceComponentRegistry } from '../registry/ExperienceComponentRegistry';

export interface ExecutiveProductRendererProps {
  product: ExecutiveProductDefinition;
  context: ExecutiveExperienceContext;
}

export const ExecutiveProductRenderer: React.FC<ExecutiveProductRendererProps> = ({ product, context }) => {
  // Phase 1: Compile Manifest & Run Guards
  const manifestResult = useMemo(() => {
    try {
      const manifest = ExecutiveRuntimeGuards.compileAndGuard(product);
      return { success: true, manifest, error: null };
    } catch (e: any) {
      return { success: false, manifest: null, error: e.message };
    }
  }, [product]);

  if (!manifestResult.success) {
    return (
      <div className="p-8 border-2 border-critical bg-critical/5 text-critical rounded-xl">
        <h2 className="text-xl font-bold mb-2">Executive Experience Violation</h2>
        <p>{manifestResult.error}</p>
      </div>
    );
  }

  // Phase 2: Render Manifest via Registry Factories
  const manifest = manifestResult.manifest!;

  return (
    <div className="executive-product-runtime" data-product-id={manifest.productId}>
      {manifest.layers.map((layer) => {
        try {
          const metadata = ExperienceComponentRegistry.getComponentMetadata(layer.rootComponentId);
          return (
             <div key={layer.layerId} className="executive-layer" data-layer-id={layer.layerId}>
                {metadata.factory({ context })}
             </div>
          );
        } catch (e: any) {
          return (
            <div key={layer.layerId} className="p-4 border border-critical bg-critical/10 text-critical rounded-lg my-4">
              <strong>Component Violation:</strong> Layer "{layer.layerId}" failed to resolve root "{layer.rootComponentId}".
            </div>
          );
        }
      })}
    </div>
  );
};

