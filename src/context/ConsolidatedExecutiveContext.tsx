import React, { createContext, useContext, useEffect, useState } from 'react';
import { ConsolidatedExecutiveAdvisoryReport } from '../core/runtime/consolidated/advisory/advisoryTypes';
import { ConsolidatedFinancialOrchestrator } from '../core/runtime/consolidated/ConsolidatedFinancialOrchestrator';
import { ConsolidatedAdvisoryOrchestrator } from '../core/runtime/consolidated/advisory/ConsolidatedAdvisoryOrchestrator';
import { ConsolidatedFinancialInput } from '../core/runtime/consolidated/types';
import { DEMO_GROUP_FIXTURE } from '../core/runtime/consolidated/data/DemoGroupFixture';
import { ConsolidatedFinancialDataLoader } from '../core/runtime/consolidated/data/ConsolidatedFinancialDataLoader';
import { ConsolidatedDataValidationGateway } from '../core/runtime/consolidated/data/ConsolidatedDataValidationGateway';

interface ConsolidatedContextType {
  report: ConsolidatedExecutiveAdvisoryReport | null;
  loading: boolean;
  error: string | null;
}

const ConsolidatedContext = createContext<ConsolidatedContextType>({
  report: null,
  loading: true,
  error: null
});

export const useConsolidatedExecutive = () => useContext(ConsolidatedContext);

export const ConsolidatedExecutiveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [report, setReport] = useState<ConsolidatedExecutiveAdvisoryReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConsolidatedData = async () => {
      try {
        setLoading(true);

        const DEMO_MODE = true; // TODO: Conectar isso à UI no futuro para alternar modos. Por enquanto mantemos como true para não quebrar as demos se não houver grupo no db.

        let consolidatedInput: ConsolidatedFinancialInput;

        if (DEMO_MODE) {
          consolidatedInput = DEMO_GROUP_FIXTURE;
        } else {
          // Exemplo de como usar no futuro
          const rawInput = await ConsolidatedFinancialDataLoader.load('ID_DO_GRUPO_SELECIONADO', '2026');
          consolidatedInput = ConsolidatedDataValidationGateway.transform(rawInput);
        }

        // 1. Orquestrador Financeiro (Matemática Pura e Eliminação)
        const financialOutput = ConsolidatedFinancialOrchestrator.run(consolidatedInput);

        // 2. Orquestrador Advisory (Causalidade e Narrativa Institucional)
        const advisoryReport = ConsolidatedAdvisoryOrchestrator.run(financialOutput, consolidatedInput.entities);

        setReport(advisoryReport);
      } catch (err: any) {
        console.error('Falha na geração do relatório consolidado:', err);
        setError(err.message || 'Erro crítico na geração da inteligência multi-entidade.');
      } finally {
        setLoading(false);
      }
    };

    fetchConsolidatedData();
  }, []);

  return (
    <ConsolidatedContext.Provider value={{ report, loading, error }}>
      {children}
    </ConsolidatedContext.Provider>
  );
};
