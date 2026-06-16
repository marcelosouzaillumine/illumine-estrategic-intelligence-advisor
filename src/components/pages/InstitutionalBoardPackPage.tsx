// src/components/pages/InstitutionalBoardPackPage.tsx

import React, { useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { useBoardPackDataLoader } from './governance/BoardPackDataLoader';
import { SovereignBoardPackPage } from './governance/SovereignBoardPackPage';
import { FiduciaryRuntimeAdapter } from '../../services/FiduciaryRuntimeAdapter';

interface InstitutionalBoardPackPageProps {
  clients?: any[];
  selectedClient?: string;
  selectedMonth?: number;
  selectedYear?: number;
}

// Isolated mock dataset for sandbox simulations (Demo / Sandbox mode)
const MOCK_SANDBOX_DATA = {
  isMockData: true,
  historicalCyclesCount: 3,
  clientProfile: {
    id: 'sandbox-company-id',
    name: 'Empresa Sandbox S/A',
    segmentoAtuacao: 'Default'
  },
  rawFinancialData: {
    segmentoEmpresa: 'Default',
    prevPl: 800000,
    bpSummary: {
      ativoTotal: 1000000,
      ativoCirculante: 600000,
      passivoCirculante: 600000,
      passivoTotal: 600000,
      patrimonioLiquido: 400000,
      caixaEquivalentes: 20000,
      estoques: 300000,
    }
  },
  bpData: [
    { accountId: '1', value: 1000000 },
    { accountId: '1.1', value: 600000 },
    { accountId: '1.1.1', value: 20000 },
    { accountId: '1.1.2', value: 300000 },
    { accountId: '2', value: 600000 },
    { accountId: '2.1', value: 600000 },
    { accountId: '3', value: 400000 }
  ],
  dreData: [
    { category: 'RECEITA BRUTA', value: 1200000 },
    { category: 'DEDUÇÕES', value: -200000 },
    { category: 'RECEITA LÍQUIDA', value: 1000000 },
    { category: 'CUSTOS VARIÁVEIS', value: -500000 },
    { category: 'EBITDA', value: 300000 },
    { category: 'LUCRO LÍQUIDO DO EXERCÍCIO', value: -100000 }
  ],
  cashFlowData: [
    { initialCash: 120000, finalCash: 20000, operatingFlow: -100000, investingFlow: 0, financingFlow: 0 }
  ],
  historicalSeries: []
};

export function InstitutionalBoardPackPage({ clients, selectedClient, selectedMonth, selectedYear }: InstitutionalBoardPackPageProps) {
  const filterYear = selectedYear || new Date().getFullYear();

  // 1. Load data via Firestore adapter hook
  const { payload, loading } = useBoardPackDataLoader(selectedClient || '', filterYear, clients);

  // 2. Compute/Retrieve the correct Board Pack Output fiduciarily
  const result = useMemo(() => {
    if (loading) return null;

    try {
      // If we have real data from the database, use it
      if (payload && !payload.isMockData) {
        const boardPack = FiduciaryRuntimeAdapter.generateBoardPack(payload);
        return {
          boardPack,
          dataMode: 'REAL' as const
        };
      }
      
      // Fallback: If no real data or client not selected, run sandbox simulation
      const boardPack = FiduciaryRuntimeAdapter.generateBoardPack(MOCK_SANDBOX_DATA);
      
      return {
        boardPack,
        dataMode: 'MOCK' as const
      };
    } catch (error) {
      console.error('[InstitutionalBoardPackPage] Compilation error:', error);
      return {
        boardPack: null,
        dataMode: 'ERROR' as const
      };
    }
  }, [payload, loading]);

  if (loading) {
    return (
   <div className="flex h-[80vh] items-center justify-center font-mono bg-zinc-950 text-executive-secondary">
    <div className="flex flex-col items-center gap-4 text-executive-secondary">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-xs uppercase tracking-widest">Compilando Fiduciary Board Pack...</p>
        </div>
      </div>
    );
  }

  const { boardPack, dataMode } = result || { boardPack: null, dataMode: 'ERROR' as const };

  return (
    <SovereignBoardPackPage 
      boardPack={boardPack} 
      dataMode={dataMode} 
    />
  );
}
