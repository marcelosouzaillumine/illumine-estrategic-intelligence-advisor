
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
    History,
    ShieldCheck,
    Boxes,
    Sparkles,
    Printer,
    Calendar,
    Target,
    DollarSign,
    LayoutDashboard
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
    cn,
    formatCurrency
} from '../../lib/utils';
import { useAllFinancialData } from '../../hooks/useFinancialData';

// --- Math Helpers ---

function pmt(rate: number, nper: number, pv: number) {
    if (rate === 0) return pv / nper;
    return (pv * rate) / (1 - Math.pow(1 + rate, -nper));
}

function findIRR(pv: number, cashFlows: number[]) {
    if (pv <= 0 || cashFlows.length === 0) return 0;
    let low = -0.5;
    let high = 5.0;
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
        if (npv > 0) low = mid;
        else high = mid;
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
    const [loanNominalRate, setLoanNominalRate] = useState(1.75); 
    const [loanFees, setLoanFees] = useState(0); 
    const [amortSystem, setAmortSystem] = useState<'PRICE' | 'SAC'>('PRICE');
    const [includeIOF, setIncludeIOF] = useState(false); 
    const [loanGracePeriod, setLoanGracePeriod] = useState(7); 

    // Consortium States
    const [consortiumAdminFee, setConsortiumAdminFee] = useState(13); 
    const [consortiumReserveFund, setConsortiumReserveFund] = useState(2); 
    const [projectedInflation, setProjectedInflation] = useState(4.5); 
    const [consortiumReducedPercentage, setConsortiumReducedPercentage] = useState(100); 
    const [consortiumContemplationMonth, setConsortiumContemplationMonth] = useState(Math.round(months / 2));

    // Investment / Business ROI States
    const [investmentYield, setInvestmentYield] = useState(0.85); 
    const [expectedBusinessROI, setExpectedBusinessROI] = useState(5); 

    // --- Calculations ---

    const loanResults = useMemo(() => {
        const r = loanNominalRate / 100;
        const dailyIOFRate = 0.00411 / 100;
        const flatIOFRate = 0.38 / 100;
        const approxIOF = includeIOF ? ((amount * flatIOFRate) + (amount * dailyIOFRate * Math.min(months * 30, 365))) : 0;
        let principalToFinance = amount + (includeIOF ? approxIOF : 0) + loanFees;
        if (loanGracePeriod > 0) {
            principalToFinance = principalToFinance * Math.pow(1 + r, loanGracePeriod);
        }
        const remainingMonths = Math.max(1, months - Math.floor(loanGracePeriod));
        
        if (amortSystem === 'PRICE') {
            const installment = pmt(r, remainingMonths, principalToFinance);
            const totalPaid = installment * remainingMonths;
            const cashFlows = new Array(months).fill(0);
            for (let t = 0; t < months; t++) {
                if (t >= Math.floor(loanGracePeriod)) cashFlows[t] = installment;
            }
            const cashValue = includeIOF ? amount : (amount - loanFees - approxIOF);
            const realRateMonthly = findIRR(cashValue, cashFlows);
            const cetAnnual = (Math.pow(1 + realRateMonthly, 12) - 1) * 100;
            return {
                installment,
                totalPaid,
                totalInterest: totalPaid - principalToFinance,
                iof: approxIOF,
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
            const cashValue = includeIOF ? amount : (amount - loanFees - approxIOF);
            const realRateMonthly = findIRR(cashValue, installments);
            const cetAnnual = (Math.pow(1 + realRateMonthly, 12) - 1) * 100;
            return {
                installment: installments[Math.floor(loanGracePeriod)],
                totalPaid,
                totalInterest,
                iof: approxIOF,
                cet: isNaN(cetAnnual) ? 0 : cetAnnual,
                avgInstallment: totalPaid / months,
                principalToFinance
            };
        }
    }, [amount, months, loanNominalRate, loanFees, amortSystem, includeIOF, loanGracePeriod]);

    const consortiumResults = useMemo(() => {
        const totalCostNoInflation = amount * (1 + (consortiumAdminFee + consortiumReserveFund) / 100);
        const baseInstallment = totalCostNoInflation / months;
        const reducedInst = baseInstallment * (consortiumReducedPercentage / 100);
        const paidUntilContemplation = reducedInst * consortiumContemplationMonth;
        const remainingBalanceAtContemplation = totalCostNoInflation - paidUntilContemplation;
        const postContemplationBaseInst = (months - consortiumContemplationMonth) > 0 ? remainingBalanceAtContemplation / (months - consortiumContemplationMonth) : 0;
        let totalPaid = 0;
        const cashFlows: number[] = [];
        for (let t = 0; t < months; t++) {
            const year = Math.floor(t / 12);
            let currentBase = t < consortiumContemplationMonth ? reducedInst : postContemplationBaseInst;
            const adjustedInstallment = currentBase * Math.pow(1 + projectedInflation / 100, year);
            totalPaid += adjustedInstallment;
            cashFlows.push(adjustedInstallment);
        }
        const realRateMonthly = findIRR(amount, cashFlows);
        const cetAnnual = (Math.pow(1 + realRateMonthly, 12) - 1) * 100;
        return {
            installment: reducedInst,
            totalPaid,
            totalFees: totalPaid - amount,
            cet: isNaN(cetAnnual) ? 0 : cetAnnual
        };
    }, [amount, months, consortiumAdminFee, consortiumReserveFund, projectedInflation, consortiumReducedPercentage, consortiumContemplationMonth]);

    const temporalData = useMemo(() => {
        const data = [];
        const r = loanNominalRate / 100;
        const principalToFinance = loanResults.principalToFinance || amount;
        const remainingMonths = months - loanGracePeriod;
        const sacPrincipalPerMonth = remainingMonths > 0 ? principalToFinance / remainingMonths : 0;
        let sacBalance = principalToFinance;
        const priceInst = remainingMonths > 0 ? pmt(r, remainingMonths, principalToFinance) : 0;
        let priceBalance = principalToFinance;
        const monthlySave = loanResults.avgInstallment;
        const yieldRate = (investmentYield || 0.85) / 100;
        const monthlyInflation = (projectedInflation / 12) / 100;
        const realYieldRate = (1 + yieldRate) / (1 + monthlyInflation) - 1;
        let accumulatedInvestment = 0;
        let accumulatedRealWealth = 0;
        let accumulatedNetWealth = 0;
        let milestoneMonth = -1;

        const totalCostNoInflation = amount * (1 + (consortiumAdminFee + consortiumReserveFund) / 100);
        const baseConsInst = totalCostNoInflation / months;
        const reducedConsInst = baseConsInst * (consortiumReducedPercentage / 100);
        const remainingBalanceAtContemplation = totalCostNoInflation - (reducedConsInst * consortiumContemplationMonth);
        const postContemplationConsBaseInst = (months - consortiumContemplationMonth) > 0 ? remainingBalanceAtContemplation / (months - consortiumContemplationMonth) : 0;

        for (let i = 1; i <= months; i++) {
            let currentPrice = 0, currentPricePrincipal = 0, currentPriceInterest = 0;
            let currentSac = 0, currentSacPrincipal = 0, currentSacInterest = 0;
            if (i > loanGracePeriod) {
                currentSacInterest = sacBalance * r;
                currentSacPrincipal = sacPrincipalPerMonth;
                currentSac = currentSacPrincipal + currentSacInterest;
                sacBalance = Math.max(0, sacBalance - currentSacPrincipal);
                currentPriceInterest = priceBalance * r;
                currentPricePrincipal = Math.max(0, priceInst - currentPriceInterest);
                currentPrice = priceInst;
                priceBalance = Math.max(0, priceBalance - currentPricePrincipal);
            }
            const year = Math.floor((i - 1) / 12);
            let consBase = i <= consortiumContemplationMonth ? reducedConsInst : postContemplationConsBaseInst;
            const consInst = consBase * Math.pow(1 + projectedInflation / 100, year);
            const prevInvestment = accumulatedInvestment;
            accumulatedInvestment = (accumulatedInvestment + monthlySave) * (1 + yieldRate);
            accumulatedRealWealth = (accumulatedRealWealth + monthlySave) * (1 + realYieldRate);
            const profitThisMonth = (accumulatedInvestment - (prevInvestment + monthlySave));
            accumulatedNetWealth = (accumulatedNetWealth + monthlySave + (profitThisMonth * 0.85));
            if (milestoneMonth === -1 && accumulatedInvestment >= amount) milestoneMonth = i;
            if (months <= 48 || i % 3 === 0 || i === months) {
                data.push({
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
        return { data, milestoneMonth, investmentResults: { monthlySave, netWealth: accumulatedNetWealth } };
    }, [amount, months, loanNominalRate, loanResults, consortiumAdminFee, consortiumReserveFund, projectedInflation, investmentYield, loanGracePeriod, consortiumReducedPercentage, consortiumContemplationMonth]);

    return (
        <div className="space-y-10 pb-20 animate-executive-fade">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900 p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden no-print">
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                            <Zap size={20} className="text-secondary" />
                        </div>
                        <h1 className="text-3xl font-display font-black tracking-tight uppercase">Simulador de Captação</h1>
                    </div>
                    <p className="text-slate-400 text-sm font-medium">Modelagem estratégica de capital para decisão C-Level.</p>
                </div>
                <div className="flex gap-3 relative z-10">
                    <button onClick={() => window.print()} className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2">
                        <Printer size={16} /> RELATÓRIO
                    </button>
                </div>
            </div>

            {/* Executive Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card p-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="shrink-0">
                        <div className="w-20 h-20 rounded-[32px] bg-secondary/10 flex items-center justify-center text-secondary relative">
                            <Sparkles size={40} />
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-[11px] font-black text-secondary uppercase tracking-[0.3em] mb-3">Diretriz de Alavancagem</h3>
                        <p className="executive-note italic text-slate-600">
                            "A análise de spread indica que a alavancagem via crédito de longo prazo é {expectedBusinessROI > loanResults.cet ? 'favorável' : 'desafiadora'} para este cenário. O custo efetivo da dívida está em {loanResults.cet.toFixed(1)}% a.a., enquanto o retorno projetado do negócio é de {expectedBusinessROI.toFixed(1)}% a.a."
                        </p>
                    </div>
                </div>
                <div className="bg-primary p-8 rounded-[32px] text-white flex flex-col justify-between relative overflow-hidden group shadow-xl">
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl"></div>
                    <div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Custo da Dívida (CET)</h3>
                        <p className="text-4xl font-display font-black mb-2">{loanResults.cet.toFixed(2)}% <span className="text-sm font-bold opacity-50">a.a.</span></p>
                        <div className="flex items-center gap-2 text-emerald-400">
                            <ShieldCheck size={16} />
                            <span className="text-xs font-bold uppercase tracking-widest">Análise Validada</span>
                        </div>
                    </div>
                    <button className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Detalhamento Técnico</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                {/* Sidebar: Inputs */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-8 sticky top-8">
                        <div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-6">
                                <div className="p-2 bg-slate-900 text-white rounded-xl shadow-lg"><Calculator size={18} /></div>
                                Premissas
                            </h3>
                            <div className="space-y-5">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-1"><DollarSign size={10} /> Valor</label>
                                    <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-slate-900 text-sm" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-1"><Calendar size={10} /> Prazo (Mês)</label>
                                    <div className="flex items-center gap-3">
                                        <input type="range" min="6" max="360" value={months} onChange={(e) => setMonths(Number(e.target.value))} className="flex-1 accent-slate-900 h-1 bg-slate-100 rounded-full appearance-none cursor-pointer" />
                                        <span className="text-xs font-black text-slate-900">{months}</span>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-slate-100 space-y-4">
                                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
                                        <button onClick={() => setAmortSystem('PRICE')} className={cn("py-2 rounded-lg text-[9px] font-black transition-all", amortSystem === 'PRICE' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400")}>PRICE</button>
                                        <button onClick={() => setAmortSystem('SAC')} className={cn("py-2 rounded-lg text-[9px] font-black transition-all", amortSystem === 'SAC' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400")}>SAC</button>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[8px] font-bold text-slate-500 uppercase">Taxa Nom. (% a.m.)</label>
                                        <input type="number" step="0.01" value={loanNominalRate} onChange={(e) => setLoanNominalRate(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-xs" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[8px] font-bold text-slate-500 uppercase">ROI Negócio (% a.a.)</label>
                                        <input type="number" value={expectedBusinessROI} onChange={(e) => setExpectedBusinessROI(Number(e.target.value))} className="w-full px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-lg font-bold text-emerald-700 text-xs" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Results */}
                <div className="lg:col-span-3 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-elegant transition-all">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Custo Efetivo Empréstimo</p>
                            <h3 className="text-5xl font-display font-black text-slate-900 mb-2">{loanResults.cet.toFixed(2)}% <span className="text-sm font-bold opacity-30">a.a.</span></h3>
                            <p className="text-sm font-bold text-slate-500 italic mb-8">Parcela Média: <span className="text-slate-900">{formatCurrency(loanResults.avgInstallment)}</span></p>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                                    <span>Juros Totais</span>
                                    <span className="text-rose-600">{formatCurrency(loanResults.totalInterest)}</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                    <div className="h-full bg-rose-500" style={{ width: `${(loanResults.totalInterest / loanResults.totalPaid) * 100}%` }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-elegant transition-all">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Custo Efetivo Consórcio</p>
                            <h3 className="text-5xl font-display font-black text-slate-900 mb-2">{consortiumResults.cet.toFixed(2)}% <span className="text-sm font-bold opacity-30">a.a.</span></h3>
                            <p className="text-sm font-bold text-slate-500 italic mb-8">Taxa Adm: <span className="text-slate-900">{consortiumAdminFee}%</span></p>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                                    <span>Taxas Totais</span>
                                    <span className="text-amber-600">{formatCurrency(consortiumResults.totalFees)}</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500" style={{ width: `${(consortiumResults.totalFees / consortiumResults.totalPaid) * 100}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-2xl font-display font-black text-slate-900 mb-1">Evolução do Fluxo de Caixa</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Comparativo de desembolso mensal por modalidade</p>
                            </div>
                            <div className="flex items-center gap-4 text-[9px] font-black uppercase">
                                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div> PRICE</div>
                                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div> SAC</div>
                                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div> Consórcio</div>
                            </div>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={temporalData.data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="monthNum" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v/1000}k`} />
                                    <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="price" fill="#2563eb" barSize={8} radius={[4,4,0,0]} />
                                    <Bar dataKey="sac" fill="#f43f5e" barSize={8} radius={[4,4,0,0]} />
                                    <Bar dataKey="consortium" fill="#f59e0b" barSize={8} radius={[4,4,0,0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="md:col-span-2 bg-slate-900 p-12 rounded-[56px] text-white overflow-hidden relative border border-slate-800 shadow-2xl">
                            <div className="absolute -right-20 -top-20 opacity-20 blur-3xl bg-blue-600 w-[500px] h-[500px] rounded-full"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-6 mb-12">
                                    <div className="p-4 bg-blue-600 rounded-[24px] shadow-2xl">
                                        <TrendingUp className="text-white" size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-display font-black tracking-tight uppercase">Diagnóstico de Capital</h3>
                                        <p className="text-blue-400 text-[11px] font-black uppercase tracking-[0.3em] mt-2">Inteligência Estratégica Illumine</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                    <div className="space-y-10">
                                        <div>
                                            <div className="flex justify-between items-end mb-4">
                                                <h4 className="text-lg font-black text-white uppercase tracking-tighter">Spread Operacional</h4>
                                                <span className={cn("text-3xl font-black", expectedBusinessROI > loanResults.cet ? "text-emerald-400" : "text-rose-400")}>{(expectedBusinessROI - loanResults.cet).toFixed(1)}%</span>
                                            </div>
                                            <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                                                <div className={cn("h-full", expectedBusinessROI > loanResults.cet ? "bg-emerald-500" : "bg-rose-500")} style={{ width: `${Math.min(Math.abs(expectedBusinessROI - loanResults.cet) * 10, 100)}%` }}></div>
                                            </div>
                                            <p className="text-[11px] text-slate-400 mt-4 font-medium italic">Diferencial entre ROI do Negócio e Custo da Dívida.</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 p-8 rounded-[40px] border border-white/10 backdrop-blur-md">
                                        <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6 flex items-center gap-2"><ShieldCheck size={14} /> Parecer CFO</h4>
                                        <p className="text-sm text-slate-300 leading-relaxed font-medium mb-6">
                                            {expectedBusinessROI > loanResults.cet 
                                                ? `Estrutura de capital recomendada: O ROI operacional de ${expectedBusinessROI.toFixed(1)}% valida a captação com spread positivo de ${(expectedBusinessROI - loanResults.cet).toFixed(1)}%.`
                                                : `Atenção: O custo do capital (${loanResults.cet.toFixed(1)}%) é superior ao ROI do negócio. Alavancagem não recomendada sem revisão de taxas.`
                                            }
                                        </p>
                                        <div className="pt-6 border-t border-white/10 flex justify-between text-[10px] font-black uppercase text-slate-400">
                                            <span>Risco de Liquidez</span>
                                            <span className="text-emerald-400">Controlado</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-emerald-900 p-12 md:p-20 rounded-[64px] text-white border border-emerald-800 shadow-2xl relative overflow-hidden mt-10">
                <div className="absolute -right-40 -bottom-40 w-[600px] h-[600px] bg-emerald-500/20 blur-[120px] rounded-full"></div>
                <div className="relative z-10 max-w-5xl">
                    <h3 className="text-3xl font-display font-black mb-12 flex items-center gap-6">
                        <div className="p-4 bg-emerald-500/20 rounded-[24px] shadow-inner"><Target className="text-emerald-400" size={32} /></div>
                        Recomendações de Gestão
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div className="space-y-8">
                            <h4 className="text-[11px] font-black uppercase text-emerald-400 tracking-[0.4em] mb-4">Estratégia de Captação</h4>
                            <ul className="space-y-5">
                                {["Avaliar o benefício fiscal (Tax Shield) no Lucro Real.", "Monitorar o DSCR mensal para saúde de caixa.", "Garantir carência compatível com o ROI do ativo."].map((item, idx) => (
                                    <li key={idx} className="flex gap-4 text-sm text-emerald-100/90 leading-relaxed group">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-8">
                            <h4 className="text-[11px] font-black uppercase text-emerald-400 tracking-[0.4em] mb-4">Saneamento e Pricing</h4>
                            <ul className="space-y-5">
                                {["Revisar rating bancário a cada 180 dias.", "Ajustar markup conforme novo WACC operacional.", "Implementar conta reserva para spreads de ROI."].map((item, idx) => (
                                    <li key={idx} className="flex gap-4 text-sm text-emerald-100/90 leading-relaxed group">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
