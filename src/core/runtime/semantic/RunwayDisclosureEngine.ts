export class RunwayDisclosureEngine {
  static calculate(cashAvailable: number, operationalCashBurn: number, periodBase: string = '12 meses') {
    const monthlyBurn = Math.abs(operationalCashBurn) / 12;
    const runwayMonths = cashAvailable / monthlyBurn;
    
    return {
      cashAvailable,
      operationalCashBurn,
      monthlyBurn,
      runwayMonths,
      formula: 'Caixa Disponível ÷ Consumo Médio Mensal',
      periodBase
    };
  }
}
