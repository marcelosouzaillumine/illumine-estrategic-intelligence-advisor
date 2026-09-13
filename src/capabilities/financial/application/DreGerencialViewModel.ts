import { calculateDreCascade } from '../../../lib/dreCascade';
import { DRE_OFFICIAL_STRUCTURE } from '../../../constants/dreStructure';
import { MONTH_LABELS } from '../../../constants';

export interface PeriodInfo {
  year: number;
  month?: number;
  label: string;
}

export interface DreRow {
  id: string;
  label: string;
  level: number;
  isTotal?: boolean;
}

export const DRE_STRUCTURE: DreRow[] = [
  { id: 'rb', label: 'Receita Operacional Bruta', level: 0 },
  { id: 'ded', label: '(-) Deduções e Impostos', level: 1 },
  { id: 'rl', label: 'Receita Líquida', level: 0, isTotal: true },
  { id: 'custos', label: '(-) Custos (CPV/CSP)', level: 1 },
  { id: 'lb', label: 'Lucro Bruto', level: 0, isTotal: true },
  { id: 'desp', label: '(-) Despesas Operacionais', level: 1 },
  { id: 'ebitda', label: 'EBITDA Gerencial', level: 0, isTotal: true },
  { id: 'dep', label: '(-) Depreciação e Amortização', level: 1 },
  { id: 'ebit', label: 'EBIT', level: 0, isTotal: true },
  { id: 'fin', label: '(+/-) Resultado Financeiro', level: 1 },
  { id: 'lair', label: 'LAIR', level: 0, isTotal: true },
  { id: 'ir', label: '(-) Provisão IR/CSLL', level: 1 },
  { id: 'll', label: 'Lucro Líquido', level: 0, isTotal: true },
];

export class DreGerencialViewModel {
  private dbData: any[];
  private selectedYear: number;
  private selectedMonth: number;
  private periodType: 'mensal' | 'anual';
  
  // Filtros
  private filterFilial: string;
  private filterUnidade: string;
  private filterCentroCusto: string;

  constructor(
    dbData: any[],
    selectedYear: number,
    selectedMonth: number,
    periodType: 'mensal' | 'anual',
    filterFilial: string = 'Todas',
    filterUnidade: string = 'Todas',
    filterCentroCusto: string = 'Todos'
  ) {
    this.dbData = dbData || [];
    this.selectedYear = selectedYear;
    this.selectedMonth = selectedMonth;
    this.periodType = periodType;
    this.filterFilial = filterFilial;
    this.filterUnidade = filterUnidade;
    this.filterCentroCusto = filterCentroCusto;
  }

  public getPeriods() {
    if (this.periodType === 'anual') {
      const historical: PeriodInfo[] = Array.from({ length: 5 }, (_, i) => {
        const y = this.selectedYear - 5 + i;
        return { year: y, label: y.toString() };
      });
      return { 
        historical, 
        current: { year: this.selectedYear, label: this.selectedYear.toString() } as PeriodInfo
      };
    } else {
      const historical: PeriodInfo[] = Array.from({ length: 12 }, (_, i) => {
        const d = new Date(this.selectedYear, this.selectedMonth - 1 - (12 - i), 1);
        const m = d.getMonth() + 1;
        const y = d.getFullYear();
        return { month: m, year: y, label: `${MONTH_LABELS[m]}/${y.toString().slice(-2)}` };
      });
      return { 
        historical, 
        current: { month: this.selectedMonth, year: this.selectedYear, label: `${MONTH_LABELS[this.selectedMonth]}/${this.selectedYear.toString().slice(-2)}` } as PeriodInfo
      };
    }
  }

  public getProcessedData() {
    const periods = this.getPeriods();
    const valuesByPeriod: Record<string, Record<string, number>> = {};
    const allPeriods = [...periods.historical, periods.current];
    
    const getPeriodKey = (p: PeriodInfo) => this.periodType === 'anual' ? p.year.toString() : `${p.year}-${p.month}`;

    allPeriods.forEach(p => {
      valuesByPeriod[getPeriodKey(p)] = { rb: 0, ded: 0, rl: 0, custos: 0, lb: 0, desp: 0, ebitda: 0, dep: 0, ebit: 0, fin: 0, lair: 0, ir: 0, ll: 0 };
    });

    const rawDataByPeriod: Record<string, any[]> = {};

    this.dbData.forEach((d: any) => {
      if (d.type !== 'DRE' && d.type !== 'DRE Gerencial') return;

      const y = d.year || d.ano;
      const m = d.month || d.mes;
      const periodKey = this.periodType === 'anual' ? y.toString() : `${y}-${m}`;
      
      if (!valuesByPeriod[periodKey]) return;

      if (this.filterFilial !== 'Todas' && d.filial !== this.filterFilial) return;
      if (this.filterUnidade !== 'Todas' && d.unidade !== this.filterUnidade) return;
      if (this.filterCentroCusto !== 'Todos' && (d.centro_custo || d.centroCusto) !== this.filterCentroCusto) return;

      let parentId = d.parentId;
      const cat = (d.conta || d.category || '').toLowerCase();

      if (!parentId) {
         if (cat.includes('receita operacional bruta') || cat === 'receita bruta' || cat.includes('faturamento') || (cat.includes('receita') && !cat.includes('líquida') && !cat.includes('financeir') && !cat.includes('outras'))) {
            parentId = 'ROB';
         } else if (cat.includes('deduç') || cat.includes('imposto sobre') || cat.includes('abatimento') || cat.includes('devoluç') || cat.includes('cancelamento')) {
            parentId = 'DED';
         } else if (cat.includes('custo') || cat.includes('cmv') || cat.includes('cpv') || cat.includes('csv') || cat.includes('csp')) {
            parentId = 'CUSTOS';
         } else if (cat.includes('deprecia') || cat.includes('amortiza')) {
            parentId = 'DEP_AMORT';
         } else if (cat.includes('financeir') || cat.includes('juros')) {
            parentId = 'RESULT_FIN';
         } else if (cat.includes('provisão') || cat.includes('irpj') || cat.includes('csll') || cat.includes('imposto de renda') || cat.includes('contribuição social')) {
            parentId = 'PROV_IR_CSLL';
         } else if (cat.includes('outras receitas') || cat.includes('outra receita') || cat.includes('outras despesas operacionais')) {
            parentId = 'OUTRAS_REC_DESP';
         } else {
            parentId = 'DESP_OPER';
         }
      }

      if (!rawDataByPeriod[periodKey]) rawDataByPeriod[periodKey] = [];
      rawDataByPeriod[periodKey].push({
         ...d,
         parentId,
         value: d.val || d.valor || d.value || 0
      });
    });

    allPeriods.forEach(p => {
      const key = getPeriodKey(p);
      const periodEntries = rawDataByPeriod[key] || [];
      const rowsToCalc = [
        ...DRE_OFFICIAL_STRUCTURE.map(account => ({ ...account, value: 0 })),
        ...periodEntries
      ];
      const calculatedRows = calculateDreCascade(rowsToCalc);

      const getVal = (id: string) => {
         const match = calculatedRows.find(r => r.id === id);
         return match ? (match.computedValue !== undefined ? match.computedValue : match.value || 0) : 0;
      };

      const v = valuesByPeriod[key];
      v.rb = getVal('ROB');
      v.ded = getVal('DED');
      v.rl = getVal('ROL');
      v.custos = getVal('CUSTOS');
      v.lb = getVal('LUCRO_BRUTO');
      v.desp = getVal('DESP_OPER');
      v.ebitda = getVal('EBITDA');
      v.dep = getVal('DEP_AMORT');
      v.ebit = getVal('EBIT');
      v.fin = getVal('RESULT_FIN');
      v.lair = getVal('RAIR_CSLL');
      v.ir = getVal('PROV_IR_CSLL');
      v.ll = getVal('LUCRO_LIQUIDO');
    });

    return {
      valuesByPeriod,
      periods
    };
  }

  public getVerticalAnalysis(rl: number, val: number): number {
    if (!rl) return 0;
    return (val / rl) * 100;
  }

  public getHorizontalAnalysis(prevVal: number, currentVal: number): number {
    if (!prevVal) return 0;
    return ((currentVal - prevVal) / Math.abs(prevVal)) * 100;
  }

  public static toContract(state: any = {}, computed: any = {}, actions: any = {}) {
    return { state, computed, actions };
  }
}
