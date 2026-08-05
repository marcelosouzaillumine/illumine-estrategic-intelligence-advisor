import React, { createContext, useContext, useMemo, useState } from 'react';
import { NavigationItem, NavigationMode, ExecutiveOffice } from './types';
import { useAuthorization } from '../hooks/useAuthorization';
import { EXECUTIVE_OFFICE_REGISTRY } from '../product/offices/office.registry';
import { NAVIGATION_REGISTRY } from './navigation.registry';

interface NavigationContextValue {
  mode: NavigationMode;
  setMode: (mode: NavigationMode) => void;
  offices: ExecutiveOffice[];
  navigationItems: NavigationItem[];
  getNavigationForOffice: (officeId: string) => NavigationItem[];
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<NavigationMode>('legacy');
  const { can } = useAuthorization();

  const offices = useMemo(() => {
    // Apenas retorna os offices marcados como 'active', 'beta', ou 'foundation'.
    // Mas no exemplo o usuário disse "O Registry deve conter todos os Offices, mas a Navigation Tree deve possuir um estado de maturidade. Não expor todos."
    // Vamos expor só os que não são 'future' na interface visível.
    return EXECUTIVE_OFFICE_REGISTRY.filter(office => office.availability !== 'future');
  }, []);

  const navigationItems = useMemo(() => {
    // Filtra todos os itens de navegação garantindo que o usuário tenha a Capability e que o Office esteja visível
    const filterItems = (items: NavigationItem[]): NavigationItem[] => {
      return items.filter(item => {
        // Checa permissão
        if (!can(item.capability)) {
          return false;
        }

        // Se o office do item estiver marcado como 'future', o item não aparece
        const office = EXECUTIVE_OFFICE_REGISTRY.find(o => o.id === item.officeId);
        if (office?.availability === 'future') {
          return false;
        }

        return true;
      }).map(item => {
        if (item.children && item.children.length > 0) {
          // Os children de um item usam a regra Omit<NavigationItem, 'officeId'> no tipo, 
          // então faremos um mock simples da checagem para simplificar o map sem ferir tipagem.
          const childFiltered = item.children.filter(child => can(child.capability));
          return { ...item, children: childFiltered };
        }
        return item;
      }).filter(item => {
        // Se for um container puro (dependendo de design futuro), se não sobrou children, hide.
        // Por ora, apenas re-retorna item
        return true;
      });
    };

    return filterItems(NAVIGATION_REGISTRY);
  }, [can]);

  const getNavigationForOffice = (officeId: string) => {
    return navigationItems.filter(item => item.officeId === officeId);
  };

  const value = {
    mode,
    setMode,
    offices,
    navigationItems,
    getNavigationForOffice
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigationRegistry() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigationRegistry must be used within a NavigationProvider');
  }
  return context;
}
