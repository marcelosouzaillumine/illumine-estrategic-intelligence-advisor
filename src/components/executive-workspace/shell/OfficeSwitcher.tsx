import React, { useState } from 'react';
import { ChevronDown, Building2, Briefcase, Landmark } from 'lucide-react';
import { resolveAvailableOffices } from '../../../core/navigation/navigation.resolver';

interface OfficeSwitcherProps {
  currentOfficeId: string;
  onChange: (officeId: string) => void;
  isCollapsed?: boolean;
}

const ICON_MAP: Record<string, any> = {
  'cfo-office': Landmark,
  'ceo-office': Building2,
  'board-office': Briefcase,
  'risk-office': Building2
};

export function OfficeSwitcher({ currentOfficeId, onChange, isCollapsed }: OfficeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Build available offices from resolver
  const availableOffices = resolveAvailableOffices().map(group => ({
    id: group.groupKey, // In new registry we use groupKey as the identifier, or map it back
    // However, the interface might be passing "cfo-office", so the change logic needs to handle passing the mapped groupKey or the original id.
    // We will use groupKey directly so the router/sidebar can handle it.
    label: group.group,
    icon: group.icon || Building2,
    availability: 'available' // Group schema doesn't have availability yet, default to available
  }));

  // Find current office either by exact match or by resolving the group key
  const currentOffice = availableOffices.find(o => 
    o.id === currentOfficeId || 
    // Fallback if currentOfficeId is 'cfo-office' and o.id is 'navigation.group.cfo_office'
    o.id.includes(currentOfficeId.replace('-', '_'))
  ) || availableOffices[0];
  
  const CurrentIcon = currentOffice?.icon || Building2;

  return (
    <div className="relative w-full">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center w-full transition-colors rounded-lg group
          ${isCollapsed ? 'justify-center p-2' : 'justify-between px-3 py-2.5'}
          ${isOpen ? 'bg-black/5 dark:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/5'}
        `}
      >
        <div className="flex items-center gap-3">
          <CurrentIcon className="w-5 h-5 text-primary" />
          {!isCollapsed && (
            <div className="flex flex-col items-start">
              <span className="text-[10px] text-muted-foreground/70 font-bold uppercase tracking-wider mb-0.5">Workspace</span>
              <span className="text-sm font-semibold truncate max-w-[140px] text-foreground">{currentOffice?.label}</span>
            </div>
          )}
        </div>
        {!isCollapsed && <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-card border border-border rounded-lg shadow-lg z-50 py-1">
            {availableOffices.map(office => {
              const Icon = office.icon;
              return (
                <button
                  key={office.id}
                  onClick={() => {
                    onChange(office.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between w-full px-3 py-2 text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5 group
                    ${currentOfficeId === office.id ? 'bg-black/5 dark:bg-white/10 text-foreground font-medium shadow-[0_1px_2px_rgba(0,0,0,0.02)]' : 'text-foreground hover:text-foreground'}
                  `}
                >
                  <div className="flex items-center">
                    <Icon className="w-4 h-4 mr-3 opacity-70" />
                    {office.label}
                  </div>
                  {office.availability === 'preview' && (
                    <span className="text-[10px] uppercase font-bold bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded ml-2">Preview</span>
                  )}
                  {office.availability === 'future' && (
                    <span className="text-[10px] uppercase font-bold bg-muted text-muted-foreground px-1.5 py-0.5 rounded ml-2">Breve</span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
