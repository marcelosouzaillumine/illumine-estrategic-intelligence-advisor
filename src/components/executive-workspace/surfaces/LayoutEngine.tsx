import React from 'react';
import { WorkspaceLayoutDefinition, LayoutSlot } from '../../../workspace/types';
import { WidgetRenderer } from '../widgets/WidgetRenderer';
import { AlertCircle } from 'lucide-react';

interface LayoutEngineProps {
  layout: WorkspaceLayoutDefinition;
}

export function LayoutEngine({ layout }: LayoutEngineProps) {
  
  if (!layout || !layout.slots) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-destructive border border-destructive/20 rounded-xl bg-destructive/10">
        <AlertCircle className="w-8 h-8 mb-4" />
        <h2>Invalid Layout Definition</h2>
        <p className="text-sm opacity-80">The provided layout configuration is missing or malformed.</p>
      </div>
    );
  }

  const renderSlot = (slot: LayoutSlot) => {
    return (
      <div 
        key={slot.id} 
        style={{ gridArea: slot.area }} 
        className="flex flex-col gap-4 min-h-[200px]"
      >
        {slot.widgets.length === 0 ? (
          <div className="flex-1 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-white/20 text-xs">
            Empty Slot ({slot.id})
          </div>
        ) : (
          slot.widgets.map((widgetInstance) => (
            <div key={widgetInstance.id} className="flex-1 bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-lg">
              <WidgetRenderer instance={widgetInstance} />
            </div>
          ))
        )}
      </div>
    );
  };

  // Build grid template areas string from unique areas
  const areas = layout.slots.map(s => s.area);
  const uniqueAreas = Array.from(new Set(areas));
  
  // For a simple generic approach, if it's "grid" we just let CSS Grid handle it based on a predefined standard layout
  // In a full implementation, you'd parse a grid-template-areas from the definition
  // We will assume a simple standard layout for now or let the consumer provide class names.
  
  return (
    <div className={`w-full h-full p-6 ${layout.type === 'grid' ? 'grid gap-6' : 'flex flex-col gap-6'}`}
         style={layout.type === 'grid' ? {
           gridTemplateColumns: 'repeat(12, 1fr)',
           gridAutoRows: 'minmax(200px, auto)',
           // A hardcoded mapping for demo purposes. In production this would be derived from the LayoutDefinition
           gridTemplateAreas: `
             "top top top top top top top top top top top top"
             "left left left center center center center center center right right right"
             "bottom bottom bottom bottom bottom bottom bottom bottom bottom bottom bottom bottom"
           `
         } : undefined}>
      {layout.slots.sort((a, b) => a.order - b.order).map(renderSlot)}
    </div>
  );
}
