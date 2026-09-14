import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * Revenue Office Layout
 * Provê a navegação lateral e a superfície central para as páginas do Revenue Office.
 */
export const RevenueOfficeLayout: React.FC = () => {

  return (
    <div className="flex h-full w-full">
      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden bg-background">
        <div className="flex-1 overflow-y-auto relative z-0 focus:outline-none p-4 sm:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
