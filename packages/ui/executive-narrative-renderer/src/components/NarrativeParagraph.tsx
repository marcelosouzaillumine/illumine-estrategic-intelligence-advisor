import React from 'react';

export const NarrativeParagraph: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <p className="text-sm leading-relaxed text-muted-foreground my-1">{children}</p>;
};
