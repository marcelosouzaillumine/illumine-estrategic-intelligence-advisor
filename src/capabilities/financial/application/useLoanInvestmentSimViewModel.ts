import { useState } from 'react';

export function useLoanInvestmentSimViewModel(props?: any) {
  const [amount, setAmount] = useState<number>(5000000);
  const [rate, setRate] = useState<number>(12.5);
  const [termMonths, setTermMonths] = useState<number>(60);
  const [activeScenario, setActiveScenario] = useState<'BASE' | 'CONSERVATIVE' | 'OPTIMISTIC'>('BASE');

  const computedROI = (amount * 0.28).toFixed(1);
  const monthlyPayment = (amount * (1 + rate / 100) / termMonths).toFixed(2);

  return {
    state: { amount, rate, termMonths, activeScenario },
    computed: { computedROI, monthlyPayment },
    actions: { setAmount, setRate, setTermMonths, setActiveScenario }
  };
}
