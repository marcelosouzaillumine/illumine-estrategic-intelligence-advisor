export type AllowedMutationType =
  | 'CAPEX_REDUCTION'
  | 'CAPEX_EXPANSION'
  | 'WORKING_CAPITAL_REDUCTION'
  | 'WORKING_CAPITAL_EXPANSION'
  | 'INVENTORY_REDUCTION'
  | 'INVENTORY_EXPANSION'
  | 'DEBT_INCREASE'
  | 'DEBT_REDUCTION'
  | 'CAPITAL_INJECTION'
  | 'MARGIN_INCREASE'
  | 'MARGIN_REDUCTION'
  | 'EXPENSE_REDUCTION'
  | 'EXPENSE_INCREASE';

export interface ScenarioMutation {
  mutationId: AllowedMutationType;
  decisionId: string;
  actionId: string;
  actionSource: 'CAR';
  value: number;
}
