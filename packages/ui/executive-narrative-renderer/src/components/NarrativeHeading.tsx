import React from 'react';

export const NarrativeHeading: React.FC<{ level?: number; children: React.ReactNode }> = ({ level = 1, children }) => {
  if (level === 1) return <h1 className="text-xl font-bold mt-4 mb-2 text-foreground">{children}</h1>;
  if (level === 2) return <h2 className="text-lg font-semibold mt-3 mb-2 text-foreground">{children}</h2>;
  return <h3 className="text-md font-medium mt-2 mb-1 text-foreground">{children}</h3>;
};
