import React, { useMemo } from 'react';
import { parseNarrative } from './parser/markdownParser';
import { NarrativeHeading } from './components/NarrativeHeading';
import { NarrativeParagraph } from './components/NarrativeParagraph';
import { NarrativeList } from './components/NarrativeList';
import { NarrativeEmphasis } from './components/NarrativeEmphasis';

export interface ExecutiveNarrativeRendererProps {
  content: string;
}

export const ExecutiveNarrativeRenderer: React.FC<ExecutiveNarrativeRendererProps> = ({ content }) => {
  const tokens = useMemo(() => parseNarrative(content), [content]);

  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];
  let elementKey = 0;

  const pushCurrentList = () => {
    if (currentList.length > 0) {
      elements.push(<NarrativeList key={`list-${elementKey++}`} items={currentList} />);
      currentList = [];
    }
  };

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type !== 'list_item') {
      pushCurrentList();
    }

    if (token.type === 'heading') {
      elements.push(
        <NarrativeHeading key={elementKey++} level={token.level}>
          {token.content}
        </NarrativeHeading>
      );
    } else if (token.type === 'list_item') {
      currentList.push(token.content);
    } else if (token.type === 'emphasis') {
      elements.push(<NarrativeEmphasis key={elementKey++}>{token.content}</NarrativeEmphasis>);
    } else if (token.type === 'text') {
      elements.push(<NarrativeParagraph key={elementKey++}>{token.content}</NarrativeParagraph>);
    } else if (token.type === 'newline') {
      elements.push(<div key={`nl-${elementKey++}`} className="h-2" />); // Spacer
    }
  }
  
  pushCurrentList(); // flush no final

  return <div className="executive-narrative-container">{elements}</div>;
};
