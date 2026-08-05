export interface Money {
  amount: number; // in lowest denomination (e.g. cents) to avoid float precision issues
  currency: string; // ISO 4217, e.g. 'USD', 'BRL'
}

/**
 * Helper para lidar com regras puras de Money no domínio.
 */
export const MoneyOps = {
  add: (a: Money, b: Money): Money => {
    if (a.currency !== b.currency) throw new Error('Cannot add different currencies');
    return { amount: a.amount + b.amount, currency: a.currency };
  },
  subtract: (a: Money, b: Money): Money => {
    if (a.currency !== b.currency) throw new Error('Cannot subtract different currencies');
    return { amount: a.amount - b.amount, currency: a.currency };
  },
  isEqual: (a: Money, b: Money): boolean => {
    return a.amount === b.amount && a.currency === b.currency;
  }
};
