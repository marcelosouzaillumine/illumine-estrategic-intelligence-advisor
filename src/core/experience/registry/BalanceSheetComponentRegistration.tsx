import React from 'react';
import { ExperienceComponentRegistry } from './ExperienceComponentRegistry';

import { FinancialOverviewRoot } from '../../../components/pages/balance-sheet/roots/FinancialOverviewRoot';
import { FinancialDiagnosisRoot } from '../../../components/pages/balance-sheet/roots/FinancialDiagnosisRoot';
import { FinancialSignalsRoot } from '../../../components/pages/balance-sheet/roots/FinancialSignalsRoot';
import { HistoricalEvolutionRoot } from '../../../components/pages/balance-sheet/roots/HistoricalEvolutionRoot';
import { ExecutiveQuestionsRoot } from '../../../components/pages/balance-sheet/roots/ExecutiveQuestionsRoot';
import { TechnicalEvidenceRoot } from '../../../components/pages/balance-sheet/roots/TechnicalEvidenceRoot';

export function registerBalanceSheetComponents() {
  ExperienceComponentRegistry.register({
    id: 'FinancialOverviewRoot',
    factory: (props: any) => <FinancialOverviewRoot {...props} />
  });

  ExperienceComponentRegistry.register({
    id: 'FinancialDiagnosisRoot',
    factory: (props: any) => <FinancialDiagnosisRoot {...props} />
  });

  ExperienceComponentRegistry.register({
    id: 'FinancialSignalsRoot',
    factory: (props: any) => <FinancialSignalsRoot {...props} />
  });

  ExperienceComponentRegistry.register({
    id: 'HistoricalEvolutionRoot',
    factory: (props: any) => <HistoricalEvolutionRoot {...props} />
  });

  ExperienceComponentRegistry.register({
    id: 'ExecutiveQuestionsRoot',
    factory: (props: any) => <ExecutiveQuestionsRoot {...props} />
  });

  ExperienceComponentRegistry.register({
    id: 'TechnicalEvidenceRoot',
    factory: (props: any) => <TechnicalEvidenceRoot {...props} />
  });
}
