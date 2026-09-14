export type RuleId = string & { readonly __brand: 'RuleId' };

export const createRuleId = (id: string): RuleId => id as RuleId;
