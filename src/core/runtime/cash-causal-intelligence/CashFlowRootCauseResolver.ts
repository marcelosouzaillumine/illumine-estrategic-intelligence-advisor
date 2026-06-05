export class CashFlowRootCauseResolver {
  public static resolve(driverName: string): 'Operacional' | 'Comercial' | 'Estoque' | 'Capital de Giro' | 'Estrutura' | 'Funding' {
    const norm = driverName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").trim();
    if (norm.includes('estoque') || norm.includes('inventario')) {
      return 'Estoque';
    }
    if (norm.includes('cliente') || norm.includes('recebivel') || norm.includes('contas a receber') || norm.includes('duplicata')) {
      return 'Comercial';
    }
    if (norm.includes('lucro') || norm.includes('prejuizo') || norm.includes('net income') || norm.includes('resultado do exercicio') || norm.includes('estrutura operacional')) {
      return 'Estrutura';
    }
    if (norm.includes('fornecedor') || norm.includes('contas a pagar') || norm.includes('obrigacao') || norm.includes('salario') || norm.includes('tributo') || norm.includes('imposto')) {
      return 'Capital de Giro';
    }
    if (norm.includes('capital') || norm.includes('aporte') || norm.includes('emprestimo') || norm.includes('financiamento') || norm.includes('divida') || norm.includes('socio') || norm.includes('mutuo')) {
      return 'Funding';
    }
    return 'Operacional';
  }
}
