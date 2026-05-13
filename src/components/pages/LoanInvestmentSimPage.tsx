import React, {
    useState,
    useMemo,
    useEffect
} from 'react';
import {
    Calculator,
    TrendingUp,
    ArrowRight,
    Zap,
    Percent,
    Building2,
    PiggyBank,
    Scale,
    AlertCircle,
    HelpCircle,
    Printer,
    Calendar,
    History,
    ShieldCheck
} from 'lucide-react';
import {
    motion,
    AnimatePresence
} from 'motion/react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ComposedChart,
    Line,
    Area,
    Cell
} from 'recharts';
import {
    PageHeader
} from '../Common';
import {
    cn,
    formatCurrency
} from '../../lib/utils';
import { useAllFinancialData } from '../../hooks/useFinancialData';

// --- Math Helpers ---

function pmt(rate: number, nper: number, pv: number) {
    if (rate === 0) return pv / nper;
    return (pv * rate) / (1 - Math.pow(1 + rate, -nper));
}

// Bisection method to find the real monthly rate (IRR) for arbitrary cash flows
function findIRR(pv: number, cashFlows: number[]) {
    if (pv <= 0 || cashFlows.length === 0) return 0;

    let low = -0.5; // Allow for negative rates
    let high = 5.0; // Up to 500% per month

    const calculateNPV = (rate: number) => {
        let npv = -pv;
        for (let i = 0; i < cashFlows.length; i++) {
            npv += cashFlows[i] / Math.pow(1 + rate, i + 1);
        }
        return npv;
    };

    for (let i = 0; i < 60; i++) {
        let mid = (low + high) / 2;
        let npv = calculateNPV(mid);

        if (npv > 0) {
            low = mid;
        } else {
            high = mid;
        }
    }
    return (low + high) / 2;
}

export function LoanInvestmentSimPage({ clientId }: { clientId?: string }) {
    const { dbData, loading } = useAllFinancialData(clientId || '');

    const [amount, setAmount] = useState(800000);
    const [months, setMonths] = useState(48);

    useEffect(() => {
        if (!clientId || loading) return;
        if (dbData && dbData.length === 0) {
            setAmount(0);
        }
    }, [dbData, loading, clientId]);

    // Loan States
    const [loanNominalRate, setLoanNominalRate] = useState(1.75); // % a.m.
    const [loanFees, setLoanFees] = useState(0); // Zero for validation
    const [amortSystem, setAmortSystem] = useState < 'PRICE' | 'SAC' > ('PRICE');
    const [includeIOF, setIncludeIOF] = useState(false); // Zero for validation
    const [loanGracePeriod, setLoanGracePeriod] = useState(7); // months

    // Consortium States
    const [consortiumAdminFee, setConsortiumAdminFee] = useState(13); // % total
    const [consortiumReserveFund, setConsortiumReserveFund] = useState(2); // % total
    const [projectedInflation, setProjectedInflation] = useState(4.5); // % a.a. (IPCA)
    const [consortiumReducedPercentage, setConsortiumReducedPercentage] = useState(100); // % of full installment
    const [consortiumContemplationMonth, setConsortiumContemplationMonth] = useState(Math.round(months / 2));

    // Investment / Business ROI States
    const [investmentYield, setInvestmentYield] = useState(0.85); // % a.m. (approx 10.75% a.a.)
    const [expectedBusinessROI, setExpectedBusinessROI] = useState(5); // % a.a. (Business growth potential)

    // --- Calculations ---

    const loanResults = useMemo(() => {
        const r = loanNominalRate / 100;

        // Calculate IOF (Standard PJ estimate)
        const dailyIOFRate = 0.00411 / 100;
        const flatIOFRate = 0.38 / 100;
        const approxIOF = includeIOF ? ((amount * flatIOFRate) + (amount * dailyIOFRate * Math.min(months * 30, 365))) : 0;

        let principalToFinance = amount + (includeIOF ? approxIOF : 0) + loanFees;

        // Handle Grace Period (Capitalize interest during grace)
        // If grace > 0, the balance grows until the first payment
        if (loanGracePeriod > 0) {
            principalToFinance = principalToFinance * Math.pow(1 + r, loanGracePeriod);
        }

        // The term of payments is the total term - rounded grace for amortization schedule purposes
        const remainingMonths = Math.max(1, months - Math.floor(loanGracePeriod));
        if (remainingMonths <= 0) return {
            installment: 0,
            totalPaid: 0,
            totalInterest: 0,
            iof: approxIOF,
            realRateMonthly: 0,
            cet: 0,
            avgInstallment: 0,
            principalToFinance
        };

        if (amortSystem === 'PRICE') {
            const installment = pmt(r, remainingMonths, principalToFinance);
            const totalPaid = installment * remainingMonths;
            const totalInterest = totalPaid - principalToFinance + (principalToFinance - (includeIOF ? (amount + approxIOF + loanFees) : amount));

            // CET calculation with full cash flows for high precision
            const cashFlows = new Array(months).fill(0);
            for (let t = 0; t < months; t++) {
                if (t >= Math.floor(loanGracePeriod)) {
                    cashFlows[t] = installment;
                }
            }
            
            const cashValue = includeIOF ? amount : (amount - loanFees - approxIOF);
            const realRateMonthly = findIRR(cashValue, cashFlows);
            const cetAnnual = (Math.pow(1 + realRateMonthly, 12) - 1) * 100;

            return {
                installment,
                totalPaid,
                totalInterest,
                iof: approxIOF,
                realRateMonthly: realRateMonthly * 100,
                cet: isNaN(cetAnnual) ? 0 : cetAnnual,
                avgInstallment: totalPaid / months,
                principalToFinance
            };
        } else {
            const A = principalToFinance / remainingMonths;
            let totalInterest = 0;
            let balance = principalToFinance;
            const installments = new Array(months).fill(0);

            for (let t = 0; t < remainingMonths; t++) {
                const J = balance * r;
                installments[Math.floor(loanGracePeriod) + t] = A + J;
                totalInterest += J;
                balance -= A;
            }

            const totalPaid = totalInterest + principalToFinance;
            const avgInstallment = totalPaid / months;

            const cashValue = includeIOF ? amount : (amount - loanFees - approxIOF);
            const realRateMonthly = findIRR(cashValue, installments);
            const cetAnnual = (Math.pow(1 + realRateMonthly, 12) - 1) * 100;

            return {
                installment: installments[Math.floor(loanGracePeriod)],
                lastInstallment: installments[months - 1],
                totalPaid,
                totalInterest,
                iof: approxIOF,
                realRateMonthly: realRateMonthly * 100,
                cet: isNaN(cetAnnual) ? 0 : cetAnnual,
                avgInstallment,
                principalToFinance
            };
        }
    }, [amount, months, loanNominalRate, loanFees, amortSystem, includeIOF, loanGracePeriod]);

    const consortiumResults = useMemo(() => {
        const totalCostNoInflation = amount * (1 + (consortiumAdminFee + consortiumReserveFund) / 100);
        const baseInstallment = totalCostNoInflation / months;

        // Reduced installment logic
        const reducedInst = baseInstallment * (consortiumReducedPercentage / 100);
        const monthsRemainingAfterContemplation = months - consortiumContemplationMonth;

        // Balance recalculation after contemplation
        const paidUntilContemplation = reducedInst * consortiumContemplationMonth;
        const remainingBalanceAtContemplation = totalCostNoInflation - paidUntilContemplation;
        const postContemplationBaseInst = monthsRemainingAfterContemplation > 0 ?
            remainingBalanceAtContemplation / monthsRemainingAfterContemplation :
            0;

        let totalPaid = 0;
        const cashFlows: number[] = [];
        const annualInf = projectedInflation / 100;

        for (let t = 0; t < months; t++) {
            const year = Math.floor(t / 12);
            let currentBase = t < consortiumContemplationMonth ? reducedInst : postContemplationBaseInst;
            const adjustedInstallment = currentBase * Math.pow(1 + annualInf, year);
            totalPaid += adjustedInstallment;
            cashFlows.push(adjustedInstallment);
        }

        const realRateMonthly = findIRR(amount, cashFlows);
        const cetAnnual = (Math.pow(1 + realRateMonthly, 12) - 1) * 100;

        return {
            installment: reducedInst,
            postContemplationInstallment: postContemplationBaseInst,
            totalPaid,
            totalFees: totalPaid - amount,
            cet: isNaN(cetAnnual) ? 0 : cetAnnual
        };
    }, [amount, months, consortiumAdminFee, consortiumReserveFund, projectedInflation, consortiumReducedPercentage, consortiumContemplationMonth]);

    const opportunityCostAnalysis = useMemo(() => {
        // If Loan: Asset is available TODAY. 
        // ROI generated over 'months' = Amount * ROI_annual * (months/12)
        const loanOpportunityGain = amount * (expectedBusinessROI / 100) * (months / 12);

        // If Consortium: Asset is available (on average) at HALF the term.
        // Opportunity gain is only for the second half.
        const consortiumOpportunityGain = loanOpportunityGain / 2;

        const opportunityLoss = loanOpportunityGain - consortiumOpportunityGain;

        return {
            loanOpportunityGain,
            consortiumOpportunityGain,
            opportunityLoss,
            netDecisionValue: (loanResults.totalPaid + loanResults.iof + loanFees - loanOpportunityGain) -
                (consortiumResults.totalPaid - consortiumOpportunityGain)
        };
    }, [amount, months, expectedBusinessROI, loanResults, consortiumResults, loanFees]);

    const temporalData = useMemo(() => {
        const data = [];
        const r = loanNominalRate / 100;
        const principalToFinance = (loanResults as any).principalToFinance || amount;
        const remainingMonths = months - loanGracePeriod;
        
        // SAC logic
        const sacPrincipalPerMonth = remainingMonths > 0 ? principalToFinance / remainingMonths : 0;
        let sacBalance = principalToFinance;

        // PRICE logic
        const priceInst = remainingMonths > 0 ? pmt(r, remainingMonths, principalToFinance) : 0;
        let priceBalance = principalToFinance;

        // Investment Accumulation logic (Nominal vs Real/Net)
        const monthlySave = loanResults.avgInstallment;
        const yieldRate = (investmentYield || 0.85) / 100;
        const monthlyInflation = (projectedInflation / 12) / 100;
        const realYieldRate = (1 + yieldRate) / (1 + monthlyInflation) - 1;
        
        let accumulatedInvestment = 0;
        let accumulatedRealWealth = 0; // Discounting inflation (Fisher equation)
        let accumulatedNetWealth = 0;  // Considering IR tax (15% on profits)
        let milestoneMonth = -1;

        // PRICE total calculation
        const priceTotalPaid = priceInst * remainingMonths;
        
        // SAC total calculation
        let sacTotalInterest = 0;
        for (let t = 0; t < remainingMonths; t++) {
            sacTotalInterest += (principalToFinance - t * sacPrincipalPerMonth) * r;
        }
        const sacTotalPaid = principalToFinance + sacTotalInterest;

        // Consortium logic for chart
        const totalCostNoInflation = amount * (1 + (consortiumAdminFee + consortiumReserveFund) / 100);
        const baseConsInst = totalCostNoInflation / months;
        const reducedConsInst = baseConsInst * (consortiumReducedPercentage / 100);
        const remainingBalanceAtContemplation = totalCostNoInflation - (reducedConsInst * consortiumContemplationMonth);
        const postContemplationConsBaseInst = (months - consortiumContemplationMonth) > 0 ?
            remainingBalanceAtContemplation / (months - consortiumContemplationMonth) :
            0;

        for (let i = 1; i <= months; i++) {
            let currentPrice = 0;
            let currentPricePrincipal = 0;
            let currentPriceInterest = 0;
            let currentSac = 0;
            let currentSacPrincipal = 0;
            let currentSacInterest = 0;

            if (i > loanGracePeriod) {
                // SAC calculations
                currentSacInterest = sacBalance * r;
                currentSacPrincipal = sacPrincipalPerMonth;
                currentSac = currentSacPrincipal + currentSacInterest;
                sacBalance = Math.max(0, sacBalance - currentSacPrincipal);

                // PRICE calculations
                currentPriceInterest = priceBalance * r;
                currentPricePrincipal = Math.max(0, priceInst - currentPriceInterest);
                currentPrice = priceInst;
                priceBalance = Math.max(0, priceBalance - currentPricePrincipal);
            }

            // Consortium
            const year = Math.floor((i - 1) / 12);
            let consBase = i <= consortiumContemplationMonth ? reducedConsInst : postContemplationConsBaseInst;
            const consInst = consBase * Math.pow(1 + projectedInflation / 100, year);

            // Investment
            const prevInvestment = accumulatedInvestment;
            accumulatedInvestment = (accumulatedInvestment + monthlySave) * (1 + yieldRate);
            
            // Real Wealth (Purchasing Power)
            accumulatedRealWealth = (accumulatedRealWealth + monthlySave) * (1 + realYieldRate);
            
            // Net Wealth (15% tax on accrued profit)
            const profitThisMonth = (accumulatedInvestment - (prevInvestment + monthlySave));
            const netProfit = profitThisMonth * 0.85;
            accumulatedNetWealth = (accumulatedNetWealth + monthlySave + netProfit);
            
            if (milestoneMonth === -1 && accumulatedInvestment >= amount) {
                milestoneMonth = i;
            }

            // Sampling logic for chart readability - higher density
            let shouldInclude = false;
            if (months <= 48) shouldInclude = true;
            else if (i % 3 === 0) shouldInclude = true;
            if (i === 1 || i === months || i === milestoneMonth || i === Math.floor(loanGracePeriod) + 1 || i === consortiumContemplationMonth) shouldInclude = true;

            if (shouldInclude) {
                data.push({
                    month: `Mês ${i}`,
                    monthNum: i,
                    price: Math.round(currentPrice),
                    pricePrincipal: Math.round(currentPricePrincipal),
                    priceInterest: Math.round(currentPriceInterest),
                    sac: Math.round(currentSac),
                    sacPrincipal: Math.round(currentSacPrincipal),
                    sacInterest: Math.round(currentSacInterest),
                    consortium: Math.round(consInst),
                    investment: Math.round(accumulatedInvestment),
                    realWealth: Math.round(accumulatedRealWealth)
                });
            }
        }
        return { 
            data, 
            milestoneMonth,
            investmentResults: {
                monthlySave: loanResults.avgInstallment,
                totalValue: accumulatedInvestment,
                realWealth: accumulatedRealWealth,
                netWealth: accumulatedNetWealth,
                monthsToMilestone: milestoneMonth
            },
            priceTotalPaid,
            sacTotalPaid
        };
    }, [amount, months, loanNominalRate, loanResults, consortiumAdminFee, consortiumReserveFund, projectedInflation, investmentYield, loanGracePeriod, consortiumReducedPercentage, consortiumContemplationMonth]);
  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto print:p-0 animate-executive-fade">
      <div className="bg-slate-900 rounded-[40px] p-10 mb-10 shadow-2xl relative overflow-hidden no-print">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <PageHeader 
            title="Inteligência de Capital" 
            subtitle="Simulador estratégico de decisão entre alavancagem imediata vs. planejamento estruturado"
            icon={<Calculator className="text-primary" size={24} />}
            color="primary"
          />
          <div className="flex gap-3">
            <button 
              onClick={() => window.print()}
              className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2"
            >
              <Printer size={16} /> RELATÓRIO EXECUTIVO
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Sidebar: Inputs */}
        <div className="md:col-span-2 xl:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-8 sticky top-8">
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-6">
                <div className="p-2 bg-slate-900 text-white rounded-xl"><Calculator size={18} /></div>
                 Premissas de Capital
              </h3>
              
              <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-1">
                <Calculator size={10} className="text-blue-500" /> Valor do Recurso (Capital)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">R$</span>
                <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setAmount(isNaN(val) ? 0 : val);
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-1">
                <Calendar size={10} className="text-slate-500" /> Prazo (Meses)
              </label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" min="6" max="360" step="1"
                    value={months} 
                    onChange={(e) => setMonths(Number(e.target.value))}
                    className="flex-1 accent-slate-900"
                  />
                  <input 
                    type="number" 
                    value={months} 
                    onChange={(e) => {
                      const m = Math.max(1, Number(e.target.value));
                      setMonths(m);
                      if (consortiumContemplationMonth > m) setConsortiumContemplationMonth(Math.round(m/2));
                    }}
                    className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg font-black text-slate-900 text-xs text-right"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-4">
               <h4 className="text-[10px] font-black text-slate-800 uppercase flex items-center gap-2">
                 <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600"><Building2 size={12} /></div>
                 Config. Empréstimo
               </h4>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[8px] font-bold text-slate-500 uppercase flex items-center gap-1">Carência (Meses) <HelpCircle size={8} className="text-slate-300" /></label>
                    <input 
                      type="number" min="0" max={months - 1} step="0.1" value={loanGracePeriod} 
                      onChange={(e) => setLoanGracePeriod(Math.min(months - 1, Math.max(0, Number(e.target.value))))}
                      className="w-full px-3 py-2 bg-blue-50/50 border border-blue-100 rounded-xl font-bold text-xs outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-blue-700"
                    />
                  </div>
                 <div className="space-y-1 flex flex-col justify-end">
                    <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <span className="text-[8px] font-black text-slate-500 uppercase">Incluir IOF</span>
                      <button 
                        onClick={() => setIncludeIOF(!includeIOF)}
                        className={cn(
                          "w-10 h-5 rounded-full relative transition-all shadow-inner",
                          includeIOF ? "bg-blue-600" : "bg-slate-300"
                        )}
                      >
                        <motion.div 
                          animate={{ left: includeIOF ? 24 : 4 }}
                          className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm" 
                        />
                      </button>
                    </div>
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-2 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50">
                 <button 
                   onClick={() => setAmortSystem('PRICE')}
                   className={cn(
                     "py-2 px-3 rounded-xl text-[10px] font-black transition-all",
                     amortSystem === 'PRICE' ? "bg-white text-slate-900 shadow-lg shadow-slate-200/50" : "text-slate-400 hover:text-slate-600"
                   )}
                 >
                   PRICE
                 </button>
                 <button 
                   onClick={() => setAmortSystem('SAC')}
                   className={cn(
                     "py-2 px-3 rounded-xl text-[10px] font-black transition-all",
                     amortSystem === 'SAC' ? "bg-white text-slate-900 shadow-lg shadow-slate-200/50" : "text-slate-400 hover:text-slate-600"
                   )}
                 >
                   SAC
                 </button>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <label className="text-[8px] font-bold text-slate-500 uppercase">Taxa Nom. (% a.m.)</label>
                   <input 
                     type="number" step="0.01" value={loanNominalRate} 
                     onChange={(e) => {
                      const val = Number(e.target.value);
                      setLoanNominalRate(isNaN(val) ? 0 : val);
                    }}
                     className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-xs"
                   />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[8px] font-bold text-slate-500 uppercase">Taxas / TAC (R$)</label>
                   <input 
                     type="number" value={loanFees} 
                     onChange={(e) => {
                      const val = Number(e.target.value);
                      setLoanFees(isNaN(val) ? 0 : val);
                    }}
                     className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-xs"
                   />
                 </div>
               </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-4">
               <h4 className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2"><Scale size={12} /> Config. Consórcio</h4>
               
               <div className="space-y-1">
                 <label className="text-[8px] font-bold text-slate-500 uppercase">Projeção Inflação (% a.a.)</label>
                 <input 
                   type="number" step="0.1" value={projectedInflation} 
                   onChange={(e) => setProjectedInflation(Number(e.target.value))}
                   className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-xs"
                 />
                 <p className="text-[7px] text-slate-400">Ajuste anual projetado (Meta IPCA ~4.5%)</p>
               </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[8px] font-bold text-slate-500 uppercase">Tx. Adm Total (%)</label>
                    <input 
                      type="number" step="0.5" value={consortiumAdminFee} 
                      onChange={(e) => setConsortiumAdminFee(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-bold text-slate-500 uppercase">F. Reserva (%)</label>
                    <input 
                      type="number" step="0.1" value={consortiumReserveFund} 
                      onChange={(e) => setConsortiumReserveFund(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[8px] font-bold text-slate-500 uppercase">Parc. Reduzida (%)</label>
                    <input 
                      type="number" step="5" min="30" max="100" value={consortiumReducedPercentage} 
                      onChange={(e) => setConsortiumReducedPercentage(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-bold text-slate-500 uppercase">Contemplação (Mês)</label>
                    <input 
                      type="number" min="1" max={months} value={consortiumContemplationMonth} 
                      onChange={(e) => setConsortiumContemplationMonth(Math.min(months, Math.max(1, Number(e.target.value))))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-xs"
                    />
                  </div>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-4">
               <h4 className="text-[10px] font-black text-slate-800 uppercase flex items-center gap-2">
                 <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600"><TrendingUp size={12} /></div>
                 Inteligência de Investimento
               </h4>
               
               <div className="space-y-4">
                 <div className="space-y-1">
                   <label className="text-[8px] font-bold text-slate-500 uppercase flex items-center justify-between">
                     <span>Yield Invest. Privado (% a.m.)</span>
                     <span className="text-emerald-500">{(investmentYield * 12).toFixed(1)}% a.a.</span>
                   </label>
                   <input 
                     type="number" step="0.01" value={investmentYield} 
                     onChange={(e) => setInvestmentYield(Number(e.target.value))}
                     className="w-full px-4 py-2 bg-emerald-50/30 border border-emerald-100 rounded-xl font-black text-emerald-600 text-xs outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                   />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[8px] font-bold text-slate-500 uppercase flex items-center justify-between">
                     <span>ROI Operacional Negócio (% a.a.)</span>
                     <span className="text-blue-500">Lucratividade Alvo</span>
                   </label>
                   <input 
                     type="number" step="1" value={expectedBusinessROI} 
                     onChange={(e) => setExpectedBusinessROI(Number(e.target.value))}
                     className="w-full px-4 py-2 bg-blue-50/30 border border-blue-100 rounded-xl font-black text-blue-600 text-xs outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                   />
                 </div>
               </div>
            </div>
          </div>

        <div className="md:col-span-2 xl:col-span-2 space-y-8 min-w-0">
          
          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm relative overflow-hidden group hover:border-rose-200 transition-colors">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-rose-600 group-hover:scale-110 group-hover:opacity-10 transition-all duration-500"><AlertCircle size={100} /></div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                CET Empréstimo ({amortSystem})
              </p>
              <h3 className="text-5xl font-black text-rose-600 mb-2 tracking-tighter">{isNaN(loanResults.cet) ? '0.00' : loanResults.cet.toFixed(2)}% <span className="text-sm font-bold text-rose-400">a.a.</span></h3>
              <div className="flex flex-col gap-1 mb-8">
                <p className="text-sm font-bold text-slate-900">
                  {amortSystem === 'PRICE' ? 'Parcela Fixa:' : 'Primeira Parcela:'} {formatCurrency(loanResults.installment)}
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-tight">
                  <span className="text-slate-400">Total de Juros + Encargos</span>
                  <span className="text-rose-600">{formatCurrency(loanResults.totalInterest + loanResults.iof + loanFees)}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((loanResults.totalInterest + loanResults.iof + loanFees) / (loanResults.totalPaid + loanResults.iof + loanFees)) * 100}%` }}
                    className="h-full bg-rose-500" 
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm relative overflow-hidden group hover:border-amber-200 transition-colors">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-amber-600 group-hover:scale-110 group-hover:opacity-10 transition-all duration-500"><Scale size={100} /></div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                CET Consórcio (Projetado)
              </p>
              <h3 className="text-5xl font-black text-amber-600 mb-2 tracking-tighter">{isNaN(consortiumResults.cet) ? '0.00' : consortiumResults.cet.toFixed(2)}% <span className="text-sm font-bold text-amber-400">a.a.</span></h3>
              <div className="flex flex-col gap-1 mb-8">
                <p className="text-sm font-bold text-slate-900">
                  Parcela de Entrada: {formatCurrency(consortiumResults.installment)}
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-tight">
                  <span className="text-slate-400">Taxa Adm + Fundo Reserva</span>
                  <span className="text-amber-600">{formatCurrency(consortiumResults.totalFees)}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(consortiumResults.totalFees / consortiumResults.totalPaid) * 100}%` }}
                    className="h-full bg-amber-500" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Triple Chart Layout */}
          <div className="space-y-8">
            {/* 1. Cash Flow Chart - Primary Visual Colors */}
            <div className="bg-white p-6 md:p-10 rounded-[40px] border border-slate-100 shadow-sm transition-all hover:shadow-md">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">Desembolso Mensal (Cash Flow)</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Comparativo de desembolso imediato: Cores de alta visualização para longos prazos</p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">PRICE</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">SAC</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Consórcio</span>
                  </div>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={temporalData.data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="monthNum" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `M${val}`} />
                    <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `R$${val/1000}k`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: any) => [formatCurrency(value), '']}
                    />
                    <Bar dataKey="price" name="PRICE" fill="#2563eb" radius={[4,4,0,0]} />
                    <Bar dataKey="sac" name="SAC" fill="#f43f5e" radius={[4,4,0,0]} />
                    <Bar dataKey="consortium" name="Consórcio" fill="#f59e0b" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Total Cost Comparison - ENHANCED Horizontal Bar Chart */}
            <div className="bg-white p-6 md:p-10 rounded-[40px] border border-slate-100 shadow-sm transition-all hover:shadow-md">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">Custo de Capital vs. Retorno Acumulado</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Comparativo total do ciclo: O que você paga vs. O que você ganha (Líquido de IR)</p>
                </div>
              </div>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    layout="vertical"
                    data={[
                      { name: 'Empr. PRICE', custo: temporalData.priceTotalPaid - amount, principal: amount, info: 'Parcelas Fixas' },
                      { name: 'Empr. SAC', custo: temporalData.sacTotalPaid - amount, principal: amount, info: 'Parcelas Decrescentes' },
                      { name: 'Consórcio', custo: consortiumResults.totalPaid - amount, principal: amount, info: 'Taxa Adm + Inflação' },
                      { name: 'Investimento', ganho: temporalData.investmentResults.netWealth - (temporalData.investmentResults.monthlySave * months), principal: temporalData.investmentResults.monthlySave * months, info: 'Ganho Líquido Pós-IR' }
                    ]} 
                    margin={{ left: 80, right: 40, top: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" fontSize={10} tickFormatter={(v) => `R$${v/1000}k`} />
                    <YAxis dataKey="name" type="category" fontSize={11} fontWeight="900" width={80} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} formatter={(v: any) => formatCurrency(v)} />
                    <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px', paddingBottom: '20px' }} />
                    <Bar dataKey="principal" name="Principal / Investido" stackId="a" fill="#334155" barSize={32} />
                    <Bar dataKey="custo" name="Juros e Taxas" stackId="a" fill="#e11d48" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="ganho" name="Rendimento Líquido (Pós-IR)" stackId="a" fill="#059669" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 2. Amortization Schedule Chart */}
            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm transition-all hover:shadow-md">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">Composição da Parcela & Amortização</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visualização técnica de abatimento do principal ({amortSystem})</p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-900"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Principal (Abatimento)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Juros (Custo)</span>
                  </div>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={temporalData.data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="monthNum" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `M${val}`} />
                    <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `R$${val/1000}k`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: any) => [formatCurrency(value), '']}
                    />
                    <Bar dataKey={amortSystem === 'PRICE' ? 'pricePrincipal' : 'sacPrincipal'} name="Amortização" stackId="a" fill="#1e293b" />
                    <Bar dataKey={amortSystem === 'PRICE' ? 'priceInterest' : 'sacInterest'} name="Juros" stackId="a" fill="#cbd5e1" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 3. Wealth/Investment Chart */}
            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm transition-all hover:shadow-md">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">Evolução do Patrimônio Acumulado</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gráfico de acúmulo de capital se o valor da parcela for investido</p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Patrimônio Nominal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Patrimônio Real (Deflacionado)</span>
                  </div>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={temporalData.data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="monthNum" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `M${val}`} />
                    <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `R$${val/1000}k`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: any) => [formatCurrency(value), '']}
                    />
                    <Area type="monotone" dataKey="investment" fill="#ecfdf5" stroke="#10b981" strokeWidth={3} name="Capital Acumulado (Bruto)" />
                    <Area type="monotone" dataKey="realWealth" fill="#eff6ff" stroke="#60a5fa" strokeWidth={2} name="Poder de Compra (Real)" strokeDasharray="5 5" />
                    <Line type="monotone" dataKey={() => amount} stroke="#cbd5e1" strokeDasharray="3 3" name="Meta (Capital de Giro)" dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              
              {temporalData.milestoneMonth !== -1 && (
                <div className="mt-8 p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                    <Zap size={24} />
                  </div>
                  <div>
                    <p className="text-emerald-800 font-bold text-sm">Ponto de Equilíbrio Atingido!</p>
                    <p className="text-emerald-700 text-xs">Investindo <span className="font-bold">{formatCurrency(temporalData.investmentResults.monthlySave)}/mês</span> a <span className="font-bold">{investmentYield}% a.m.</span>, você atinge os <span className="font-bold">{formatCurrency(amount)}</span> no <span className="font-black italic underline">mês {temporalData.milestoneMonth}</span>.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-8 rounded-[40px] text-white overflow-hidden relative border border-slate-800 shadow-2xl">
              <div className="absolute -right-10 -top-10 opacity-10 blur-2xl bg-blue-500 w-64 h-64 rounded-full"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
                    <TrendingUp className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-black tracking-tight uppercase text-white">Diagnóstico Estratégico de Capital</h3>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3">Poder de Alavancagem vs. Custo da Dívida</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Seu negócio gera <span className="text-white font-bold">{expectedBusinessROI}% a.a.</span>. Captar agora via empréstimo custa <span className="text-rose-400 font-bold">{loanResults.cet.toFixed(2)}% a.a.</span>.
                    </p>
                    <div className="mt-4 p-5 bg-white/5 rounded-3xl border border-white/10">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[8px] font-bold text-slate-400 uppercase">Spread de Crescimento</p>
                          <p className="text-3xl font-black text-blue-400">{(expectedBusinessROI - loanResults.cet).toFixed(2)}% <span className="text-sm font-normal text-slate-500">a.a.</span></p>
                        </div>
                        <div className="text-right">
                          <p className="text-[8px] font-bold text-slate-400 uppercase">Vantagem ROI</p>
                          <p className="text-xs font-bold text-emerald-400">{expectedBusinessROI > loanResults.cet ? 'POSITIVO' : 'NEGATIVO'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/10">
                    <h4 className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-3">Análise do Custo de Espera (Consórcio)</h4>
                    <p className="text-sm text-slate-300 leading-relaxed mb-4">
                      No consórcio, a contemplação média ocorre em {Math.round(months/2)} meses. A perda de lucro por não ter o ativo operando hoje é:
                    </p>
                    <div className="p-5 bg-amber-400/10 rounded-3xl border border-amber-400/20">
                      <p className="text-2xl font-black text-amber-400">{formatCurrency(opportunityCostAnalysis.opportunityLoss)}</p>
                      <p className="text-[9px] font-bold text-amber-300/60 uppercase mt-1">Custo de Oportunidade do Fluxo de Caixa</p>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/10">
                    <div className="bg-white/10 p-6 rounded-3xl">
                      <h4 className="text-xs font-black text-white uppercase mb-4 flex items-center gap-2">
                        <Scale size={14} className="text-blue-400" /> Matriz de Decisão CFO:
                      </h4>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="p-5 bg-white/5 rounded-3xl border border-white/5">
                            <p className="text-[9px] text-slate-400 uppercase font-black mb-2 flex items-center gap-2">
                              <TrendingUp size={12} className="text-blue-400" /> Alavancagem Operacional
                            </p>
                            <p className="text-[11px] text-slate-200 leading-relaxed">
                              {expectedBusinessROI > loanResults.cet 
                                ? "Arbitragem Positiva Detectada: O retorno marginal do seu negócio supera o Custo Efetivo Total da dívida. Captar agora e reinvestir no giro amplia seu patrimônio líquido mais rápido do que a economia de juros do consórcio." 
                                : "Atenção: O ROI do negócio está abaixo do custo de capital. A dívida pode corroer o caixa operacional. Recomenda-se a estrutura de consórcio para expansão orgânica sem pressão no WACC."}
                            </p>
                          </div>
                          <div className="p-5 bg-white/5 rounded-3xl border border-white/5">
                            <p className="text-[9px] text-slate-400 uppercase font-black mb-2 flex items-center gap-2">
                              <ShieldCheck size={12} className="text-emerald-400" /> Custo de Capital Próprio (Ke)
                            </p>
                            <p className="text-[11px] text-slate-200 leading-relaxed">
                              Ao não descapitalizar o caixa atual ({formatCurrency(amount)}), você preserva seu "Equity". Considerando um Ke de mercado (15-18% a.a.), manter liquidez e utilizar crédito bancário otimiza a estrutura de capital da empresa pela dedutibilidade fiscal e preservação de margem de segurança.
                            </p>
                          </div>
                        </div>
                        <div className="p-6 bg-emerald-500/10 rounded-[32px] border border-emerald-500/20">
                          <p className="text-[10px] text-emerald-400 uppercase font-black mb-2 flex items-center gap-2">
                            <Zap size={14} /> Veredito de Engenharia Financeira
                          </p>
                          <p className="text-[12px] text-emerald-50 font-medium leading-relaxed mb-4">
                            {opportunityCostAnalysis.netDecisionValue < 0 
                              ? `Foco em Velocidade: A alavancagem via empréstimo gera um benefício incremental de ${formatCurrency(Math.abs(opportunityCostAnalysis.netDecisionValue))} sobre o ciclo total. A disponibilidade imediata do capital acelera o giro de estoque/vendas que compensa amplamente os juros pagos.`
                              : `Foco em Eficiência: O consórcio apresenta uma vantagem matemática de ${formatCurrency(opportunityCostAnalysis.netDecisionValue)}. É a rota ideal para formação de patrimônio imobiliário ou renovação de frota onde os ciclos operacionais são mais longos.`}
                          </p>
                          <div className="h-px bg-emerald-500/10 mb-4"></div>
                          <p className="text-[11px] text-emerald-100/80 leading-relaxed">
                            Patrimônio Acumulado Estimado: Se você realizar o projeto hoje e reinvestir o equivalente à parcela, seu poder de compra real acumulado (Fisher Eq.) será de <span className="text-white font-bold">{formatCurrency(temporalData.investmentResults.realWealth)}</span> ao final de {months} meses.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-slate-200">
               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-6">
                 <History size={16} className="text-primary" /> Memória de Cálculo
               </h3>
               <div className="space-y-6">
                 <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                    <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-widest border-b border-slate-200 pb-2">1. Empréstimo (PRICE)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px]">
                      <div className="space-y-1">
                        <p className="text-slate-400 font-bold uppercase">Saldo Devedor Inicial</p>
                        <p className="font-black text-slate-800">{formatCurrency(amount)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-400 font-bold uppercase">Carência (Juros Capitalizados)</p>
                        <p className="font-black text-slate-800">{loanGracePeriod} meses @ {loanNominalRate}% a.m.</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-400 font-bold uppercase">Base de Cálculo de Amortização</p>
                        <p className="font-black text-slate-800">{formatCurrency(loanResults.principalToFinance)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-400 font-bold uppercase">Prazo de Amortização</p>
                        <p className="font-black text-slate-800">{months - Math.floor(loanGracePeriod)} meses</p>
                      </div>
                      <div className="space-y-1 col-span-2 pt-2 border-t border-slate-100">
                        <p className="text-slate-400 font-bold uppercase italic">Fórmula: PMT = [PV * i] / [1 - (1+i)^-n]</p>
                        <p className="text-slate-600 leading-relaxed font-medium">O saldo inicial acumula juros mensais durante a carência. O montante final é amortizado no prazo restante via sistema Francês (Price).</p>
                      </div>
                    </div>
                 </div>

                 <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                    <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-widest border-b border-slate-200 pb-2">2. Consórcio Estruturado</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px]">
                      <div className="space-y-1">
                        <p className="text-slate-400 font-bold uppercase">Crédito Nominal</p>
                        <p className="font-black text-slate-800">{formatCurrency(amount)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-400 font-bold uppercase">Custo Total de Taxas</p>
                        <p className="font-black text-slate-800">{consortiumAdminFee}% (Adm) + {consortiumReserveFund}% (Reserva) = {consortiumAdminFee + consortiumReserveFund}%</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-400 font-bold uppercase">Total a Pagar (S/ Inflação)</p>
                        <p className="font-black text-slate-800">{formatCurrency(amount * (1 + (consortiumAdminFee + consortiumReserveFund) / 100))}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-400 font-bold uppercase">Parcela Inicial</p>
                        <p className="font-black text-slate-800">{formatCurrency(consortiumResults.installment)}</p>
                      </div>
                      <div className="space-y-1 col-span-2 pt-2 border-t border-slate-100">
                        <p className="text-slate-400 font-bold uppercase italic">Impacto da Inflação ({projectedInflation}% a.a.)</p>
                        <p className="text-slate-600 leading-relaxed font-medium">As parcelas e o crédito são corrigidos anualmente. No gráfico de evolução patrimonial, o poder de compra real é deflacionado pela inflação (Equação de Fisher).</p>
                      </div>
                    </div>
                 </div>

                 <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                    <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-widest border-b border-slate-200 pb-2">3. Evolução de Investimento & ROI</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px]">
                      <div className="space-y-1">
                        <p className="text-slate-400 font-bold uppercase">Custo de Oportunidade (ROI)</p>
                        <p className="font-black text-slate-800">{expectedBusinessROI}% ao ano</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-400 font-bold uppercase">Rendimento da Aplicação</p>
                        <p className="font-black text-slate-800">{investmentYield}% ao mês ({((Math.pow(1 + investmentYield/100, 12) - 1)*100).toFixed(2)}% a.a.)</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-400 font-bold uppercase">Imposto de Renda (IR)</p>
                        <p className="font-black text-slate-800">15% sobre os ganhos de capital</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-400 font-bold uppercase">Valor Final Estimado (Líquido IR)</p>
                        <p className="font-black text-emerald-600">{formatCurrency(temporalData.investmentResults.netWealth)}</p>
                      </div>
                      <div className="space-y-1 col-span-2 pt-2 border-t border-slate-100">
                        <p className="text-slate-400 font-bold uppercase italic">Metodologia de Patrimônio Real</p>
                        <p className="text-slate-600 leading-relaxed font-medium">Calculamos o rendimento bruto, subtraímos 15% de IR sobre a rentabilidade, e deflacionamos o montante pela inflação projetada para obter o Poder de Compra Final.</p>
                      </div>
                    </div>
                 </div>
               </div>
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-slate-200">
               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-6">
                 <ArrowRight size={16} className="text-blue-600" /> Notas Técnicas
               </h3>
               <div className="space-y-4">
                 <div className="flex gap-4">
                   <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 font-bold text-xs">1</div>
                   <p className="text-[10px] text-slate-500 leading-relaxed"><span className="font-bold text-slate-700">CET (Custo Efetivo Total):</span> Calculado via TIR (Taxa Interna de Retorno) considerando todas as taxas de abertura, IOF e indexadores.</p>
                 </div>
                 <div className="flex gap-4">
                   <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 font-bold text-xs">2</div>
                   <p className="text-[10px] text-slate-500 leading-relaxed"><span className="font-bold text-slate-700">IOF:</span> Estimativa baseada em alíquota fixa de 0,38% + 0,00411%/dia (limite 365 dias) para PJ.</p>
                 </div>
                 <div className="flex gap-4">
                   <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 font-bold text-xs">3</div>
                   <p className="text-[10px] text-slate-500 leading-relaxed"><span className="font-bold text-slate-700">Inflação:</span> O consórcio reajusta o valor do bem e das parcelas anualmente. Usamos projeção linear.</p>
                 </div>
                 <div className="flex gap-4">
                   <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 font-bold text-xs">4</div>
                   <p className="text-[10px] text-slate-500 leading-relaxed"><span className="font-bold text-slate-700">Carência:</span> Os meses de carência capitalizam juros ao saldo devedor.</p>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Tactical Recommendations Section */}
      <div className="bg-emerald-900 p-12 rounded-[50px] text-white border border-emerald-800 shadow-2xl relative overflow-hidden mt-8">
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-emerald-500/20 blur-3xl rounded-full"></div>
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-emerald-400/10 blur-3xl rounded-full"></div>
        <div className="relative z-10">
          <h3 className="text-2xl font-black mb-10 flex items-center gap-4 text-white">
            <div className="p-3 bg-emerald-500/20 rounded-2xl shadow-inner"><TrendingUp className="text-emerald-400" size={28} /></div>
            Recomendações Táticas de Gestão
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase text-emerald-400 tracking-[0.2em] mb-4">Estratégia Contratual</h4>
              <ul className="space-y-4">
                {[
                  "Verificar cláusulas de liquidação antecipada (amortização de juros futuros).",
                  "Garantir que as taxas acessórias (TAC/Seguros) estejam diluídas no CET.",
                  "Avaliar a possibilidade de utilizar o lucro do bem financiado para amortizações extraordinárias.",
                  "Considerar o custo de oportunidade do 'Ke' (Capital Próprio) vs 'Kd' (Custo da Dívida)."
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-emerald-100/90 leading-relaxed group">
                    <ArrowRight size={16} className="shrink-0 mt-0.5 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase text-emerald-400 tracking-[0.2em] mb-4">Saneamento e Pricing</h4>
              <ul className="space-y-4">
                {[
                  "Revisar cadastro bancário a cada 6 meses para pleitear redução de spread.",
                  "Ajustar markup de preços considerando o novo custo de capital (WACC) após reforma fiscal.",
                  "Implementar conta reserva vinculada ao investimento do spread de ROI.",
                  "Utilizar o benefício fiscal dos juros (Tax Shield) para otimizar o lucro líquido."
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-emerald-100/90 leading-relaxed group">
                    <ArrowRight size={16} className="shrink-0 mt-0.5 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
);
}
