import React from 'react';
export interface NarrativeBlock {
  type: string;
  content: string;
  sourceDiagnosticId?: string;
}

export interface ExecutiveNarrative {
  title: string;
  blocks: NarrativeBlock[];
}

interface ExecutiveNarrativeRendererProps {
  narrative: ExecutiveNarrative;
  className?: string;
  presentationMode?: 'CARDS' | 'MARKDOWN' | 'LIST';
}

export const ExecutiveNarrativeRenderer: React.FC<ExecutiveNarrativeRendererProps> = ({ 
  narrative, 
  className = '',
  presentationMode = 'CARDS' 
}) => {
  if (!narrative || !narrative.blocks || narrative.blocks.length === 0) {
    return null;
  }

  const renderBlock = (block: NarrativeBlock, index: number) => {
    switch (presentationMode) {
      case 'MARKDOWN':
        return (
          <div key={index} className="mb-4 text-executive-text">
            {block.content}
          </div>
        );
      
      case 'LIST':
        return (
          <li key={index} className="mb-2 text-executive-text">
            <span className="font-semibold text-executive-primary mr-2">[{block.type}]</span>
            {block.content}
          </li>
        );

      case 'CARDS':
      default:
        let bgColor = 'bg-slate-50';
        let borderColor = 'border-slate-200';
        let iconColor = 'text-slate-500';

        if (block.type === 'WARNING' || block.type === 'CRITICAL' as any) {
          bgColor = 'bg-rose-50';
          borderColor = 'border-rose-200';
          iconColor = 'text-rose-500';
        } else if (block.type === 'RECOMMENDATION') {
          bgColor = 'bg-blue-50';
          borderColor = 'border-blue-200';
          iconColor = 'text-blue-500';
        }

        return (
          <div key={index} className={`p-4 rounded-lg border ${bgColor} ${borderColor} mb-4 flex items-start space-x-3`}>
            <div className={`mt-0.5 ${iconColor}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800 mb-1">{block.type}</p>
              <p className="text-sm text-slate-600 leading-relaxed">{block.content}</p>
              
              {/* Evidence Chain Tooltip or Modal Trigger could go here */}
              {block.sourceDiagnosticId && (
                <button className="text-xs text-executive-primary hover:underline mt-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" className="mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  Ver Evidência Certificada
                </button>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`executive-narrative-renderer ${className}`}>
      <h3 className="text-lg font-executive font-semibold text-executive-primary mb-4">
        {narrative.title}
      </h3>
      
      {presentationMode === 'LIST' ? (
        <ul className="list-disc pl-5">
          {narrative.blocks.map(renderBlock)}
        </ul>
      ) : (
        <div className="flex flex-col">
          {narrative.blocks.map(renderBlock)}
        </div>
      )}
    </div>
  );
};
