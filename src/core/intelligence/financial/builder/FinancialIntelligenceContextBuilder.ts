import { FinancialFact } from '../facts/FinancialFact';
import { FinancialStatementContext } from '../context/FinancialStatementContext';
import { BalanceSheetContext } from '../context/BalanceSheetContext';
import { IncomeStatementContext } from '../context/IncomeStatementContext';
import { CashFlowContext } from '../context/CashFlowContext';
import { FinancialMetricOntology } from '../ontology/FinancialMetricOntology';
import { FinancialRelationshipGraph } from '../graph/FinancialRelationshipGraph';

export class FinancialIntelligenceContextBuilder {
  private ontology: FinancialMetricOntology;
  private graph: FinancialRelationshipGraph;

  constructor() {
    this.ontology = new FinancialMetricOntology();
    this.graph = new FinancialRelationshipGraph();
  }

  /**
   * Orchestrates the transformation of Raw Data into a Unified Financial Context
   */
  public buildContext(
    tenantId: string,
    companyId: string,
    period: string,
    rawBalanceSheet: any,
    rawIncomeStatement: any,
    rawCashFlow: any,
    facts: FinancialFact[]
  ): FinancialStatementContext {
    
    // In a real scenario, facts would be mapped through the ontology to validate their meaning
    // and injected into the specific contexts. For this foundation, we mock the extraction.

    const balanceSheetCtx: BalanceSheetContext = {
      assets: rawBalanceSheet?.assets || { total: 0, current: 0, cashAndEquivalents: 0, inventory: 0, receivables: 0 },
      liabilities: rawBalanceSheet?.liabilities || { total: 0, current: 0, shortTermDebt: 0, longTermDebt: 0 },
      equity: rawBalanceSheet?.equity || { total: 0, retainedEarnings: 0 },
      facts: facts.filter(f => f.source === 'BALANCE_SHEET')
    };

    const incomeStatementCtx: IncomeStatementContext = {
      revenue: rawIncomeStatement?.revenue || { gross: 0, net: 0 },
      costs: rawIncomeStatement?.costs || { cogs: 0 },
      expenses: rawIncomeStatement?.expenses || { operating: 0, financial: 0 },
      margins: rawIncomeStatement?.margins || { gross: 0, ebitda: 0, operating: 0, net: 0 },
      facts: facts.filter(f => f.source === 'INCOME_STATEMENT')
    };

    const cashFlowCtx: CashFlowContext = {
      operatingCashFlow: rawCashFlow?.operatingCashFlow || 0,
      investingCashFlow: rawCashFlow?.investingCashFlow || 0,
      financingCashFlow: rawCashFlow?.financingCashFlow || 0,
      freeCashFlow: rawCashFlow?.freeCashFlow || 0,
      netChangeInCash: rawCashFlow?.netChangeInCash || 0,
      facts: facts.filter(f => f.source === 'CASH_FLOW')
    };

    // Construct the un-evaluated context
    const context: FinancialStatementContext = {
      tenantId,
      companyId,
      industry: 'UNKNOWN', // could be injected
      period,
      currency: 'BRL',
      balanceSheet: balanceSheetCtx,
      incomeStatement: incomeStatementCtx,
      cashFlow: cashFlowCtx,
      relationships: []
    };

    // Evaluate macro-economic intersections across statements
    context.relationships = this.graph.evaluate(context);

    return context;
  }
}
