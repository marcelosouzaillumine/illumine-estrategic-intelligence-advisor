import React from 'react';

export const NarrativeList: React.FC<{ items: string[] }> = ({ items }) => {
  return (
    <ul className="list-none space-y-1 my-2">
      {items.map((item, idx) => (
        <li key={idx} className="text-sm flex items-start text-muted-foreground">
          <span className="mr-2 text-primary">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
};
