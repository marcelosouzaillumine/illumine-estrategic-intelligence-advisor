import React from 'react';
import { useNarrative } from './NarrativeProvider';
import { AlertCircle, Zap } from 'lucide-react';

export function NarrativeRenderer() {
  const { blocks } = useNarrative();

  if (!blocks || blocks.length === 0) {
    return <div className="text-muted-foreground text-sm italic">Nenhuma narrativa disponível para o contexto.</div>;
  }

  return (
    <div className="flex flex-col gap-3 text-sm text-foreground leading-relaxed">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'highlight':
            return (
              <p key={idx} className="font-semibold text-primary flex items-start gap-2">
                <Zap className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{block.content}</span>
              </p>
            );
          case 'warning':
            return (
              <div key={idx} className="bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-md p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <p>{block.content}</p>
              </div>
            );
          case 'bullet':
            return (
              <ul key={idx} className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>{block.content}</li>
              </ul>
            );
          case 'paragraph':
          default:
            return <p key={idx} className="text-muted-foreground">{block.content}</p>;
        }
      })}
    </div>
  );
}
