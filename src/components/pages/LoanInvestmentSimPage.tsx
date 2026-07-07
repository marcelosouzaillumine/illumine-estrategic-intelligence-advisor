
import React, {
    useState,
    useMemo,
    useEffect
} from 'react';
import { Calculator, TrendingUp, ArrowRight, Zap, Percent, Building2, PiggyBank, Scale, AlertCircle, HelpCircle, History, ShieldCheck, Boxes, Sparkles, Printer, Calendar, Target, DollarSign, LayoutDashboard, Save, Plus, Trash2, FileText, ChevronDown, Award, Loader2, BarChart } from 'lucide-react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Line, Area, Cell } from 'recharts';
import { cn, formatCurrency } from '../../lib/utils';
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

    const [projectName, setProjectName] = useState('Novo Projeto de Captação');
    const [savedProjects, setSavedProjects] = useState<any[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [isSimActive, setIsSimActive] = useState(false);
    const [projectPurpose, setProjectPurpose] = useState('Capital de Giro');

    // Multi-Institution State
    const [banks, setBanks] = useState([
        { id: 1, name: 'Instituição A', rate: 1.75, fees: 0, grace: 0, active: true },
        { id: 2, name: 'Instituição B', rate: 1.85, fees: 0, grace: 0, active: false },
        { id: 3, name: 'Instituição C', rate: 1.65, fees: 1500, grace: 3, active: false },
    ]);

    const [consortia, setConsortia] = useState([
        { id: 1, name: 'Consórcio Alpha', adminFee: 13, reserveFund: 2, reduced: 100, contemplMonth: 24, active: true },
        { id: 2, name: 'Consórcio Beta', adminFee: 15, reserveFund: 1, reduced: 75, contemplMonth: 12, active: false },
        { id: 3, name: 'Consórcio Gamma', adminFee: 12, reserveFund: 3, reduced: 50, contemplMonth: 36, active: false },
    ]);

    // Investment / Business ROI States
    const [investmentYield, setInvestmentYield] = useState(0.85); 
    const [expectedBusinessROI, setExpectedBusinessROI] = useState(5); 

    const [amount, setAmount] = useState(500000);
    const [months, setMonths] = useState(60);
    const [projectedInflation, setProjectedInflation] = useState(4.5); 

    // --- Persistence ---
    useEffect(() => {
        if (!auth.currentUser || !clientId) return;
        const q = query(
            collection(db, 'captacao_projetos'),
            where('clientId', '==', clientId),
            where('ownerId', '==', auth.currentUser.uid)
        );
        const unsub = onSnapshot(q, (snap) => {
            setSavedProjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsub();
    }, [clientId, auth.currentUser]);

    const handleSaveProject = async () => {
        if (!auth.currentUser || !clientId) return;
        setSaving(true);
        try {
            const payload = {
                projectName,
                clientId,
                ownerId: auth.currentUser.uid,
                amount,
                months,
                projectedInflation,
                banks,
                consortia,
                investmentYield,
                expectedBusinessROI,
                projectPurpose,
                updatedAt: serverTimestamp()
            };
            if (selectedProjectId) {
                await updateDoc(doc(db, 'captacao_projetos', selectedProjectId), payload);
            } else {
                const docRef = await addDoc(collection(db, 'captacao_projetos'), payload);
                setSelectedProjectId(docRef.id);
            }
        } catch (error) {
            console.error("Error saving project:", error);
        } finally {
            setSaving(false);
        }
    };

    const loadProject = (project: any) => {
        setSelectedProjectId(project.id);
        setProjectName(project.projectName);
        setAmount(project.amount || 0);
        setMonths(project.months || 60);
        setProjectedInflation(project.projectedInflation || 4.5);
        setBanks(project.banks || banks);
        setConsortia(project.consortia || consortia);
        setInvestmentYield(project.investmentYield || 0);
        setExpectedBusinessROI(project.expectedBusinessROI || 0);
        setProjectPurpose(project.projectPurpose || 'Capital de Giro');
        setIsSimActive(true);
    };

    const resetProject = () => {
        setSelectedProjectId(null);
        setProjectName('Novo Projeto de Captação');
        setAmount(0);
        setMonths(0);
        setExpectedBusinessROI(0);
        setInvestmentYield(0);
        setProjectPurpose('Capital de Giro');
        setProjectedInflation(4.5);
        setBanks([
            { id: 1, name: 'Instituição A', rate: 1.75, fees: 0, grace: 0, active: true },
            { id: 2, name: 'Instituição B', rate: 1.85, fees: 0, grace: 0, active: false },
            { id: 3, name: 'Instituição C', rate: 1.65, fees: 1500, grace: 3, active: false },
        ]);
        setConsortia([
            { id: 1, name: 'Consórcio Alpha', adminFee: 13, reserveFund: 2, reduced: 100, contemplMonth: 24, active: true },
            { id: 2, name: 'Consórcio Beta', adminFee: 15, reserveFund: 1, reduced: 75, contemplMonth: 12, active: false },
            { id: 3, name: 'Consórcio Gamma', adminFee: 12, reserveFund: 3, reduced: 50, contemplMonth: 36, active: false },
        ]);
        setIsSimActive(true);
    };

    // --- Calculations ---

    const bankResults = useMemo(() => {
        return banks.map(bank => {
            if (!bank.active) return null;
            const r = bank.rate / 100;
            const principalToFinance = amount + bank.fees;
            let financedWithGrace = principalToFinance;
            if (bank.grace > 0) {
                financedWithGrace = principalToFinance * Math.pow(1 + r, bank.grace);
            }
            const remainingMonths = Math.max(1, months - bank.grace);

            // PRICE
            const installmentPrice = pmt(r, remainingMonths, financedWithGrace);
            const totalPaidPrice = installmentPrice * remainingMonths;
            const cashFlowsPrice = new Array(months).fill(0);
            for (let t = 0; t < months; t++) {
                if (t >= bank.grace) cashFlowsPrice[t] = installmentPrice;
            }
            const realRatePrice = findIRR(amount, cashFlowsPrice);
            const cetPrice = (Math.pow(1 + realRatePrice, 12) - 1) * 100;

            // SAC
            const A = financedWithGrace / remainingMonths;
            let totalPaidSac = 0;
            let balance = financedWithGrace;
            const cashFlowsSac = new Array(months).fill(0);
            for (let t = 0; t < remainingMonths; t++) {
                const J = balance * r;
                const inst = A + J;
                cashFlowsSac[bank.grace + t] = inst;
                totalPaidSac += inst;
                balance -= A;
            }
            const realRateSac = findIRR(amount, cashFlowsSac);
            const cetSac = (Math.pow(1 + realRateSac, 12) - 1) * 100;

            return {
                ...bank,
                price: {
                    installment: installmentPrice,
                    totalPaid: totalPaidPrice,
                    totalInterest: totalPaidPrice - principalToFinance,
                    cet: isNaN(cetPrice) ? 0 : cetPrice,
                    cashFlows: cashFlowsPrice
                },
                sac: {
                    installment: cashFlowsSac[bank.grace],
                    totalPaid: totalPaidSac,
                    totalInterest: totalPaidSac - principalToFinance,
                    cet: isNaN(cetSac) ? 0 : cetSac,
                    cashFlows: cashFlowsSac
                }
            };
        });
    }, [amount, months, banks]);

    const consortiumCalculatedResults = useMemo(() => {
        return consortia.map(cons => {
            if (!cons.active) return null;
            const totalCostNoInflation = amount * (1 + (cons.adminFee + cons.reserveFund) / 100);
            const baseInstallment = totalCostNoInflation / months;
            const reducedInst = baseInstallment * (cons.reduced / 100);
            const paidUntilContemplation = reducedInst * cons.contemplMonth;
            const remainingBalanceAtContemplation = totalCostNoInflation - paidUntilContemplation;
            const postContemplationBaseInst = (months - cons.contemplMonth) > 0 ? remainingBalanceAtContemplation / (months - cons.contemplMonth) : 0;
            
            let totalPaid = 0;
            const cashFlows: number[] = [];
            for (let t = 0; t < months; t++) {
                const year = Math.floor(t / 12);
                let currentBase = t < cons.contemplMonth ? reducedInst : postContemplationBaseInst;
                const adjustedInstallment = currentBase * Math.pow(1 + projectedInflation / 100, year);
                totalPaid += adjustedInstallment;
                cashFlows.push(adjustedInstallment);
            }
            const realRateMonthly = findIRR(amount, cashFlows);
            const cetAnnual = (Math.pow(1 + realRateMonthly, 12) - 1) * 100;
            
            return {
                ...cons,
                installment: reducedInst,
                totalPaid,
                totalFees: totalPaid - amount,
                cet: isNaN(cetAnnual) ? 0 : cetAnnual,
                cashFlows
            };
        });
    }, [amount, months, consortia, projectedInflation]);

    const bestOption = useMemo(() => {
        const all: any[] = [];
        bankResults.forEach(b => {
            if (b) {
                all.push({ type: 'Banco (PRICE)', name: b.name, cet: b.price.cet });
                all.push({ type: 'Banco (SAC)', name: b.name, cet: b.sac.cet });
            }
        });
        consortiumCalculatedResults.forEach(c => {
            if (c) {
                all.push({ type: 'Consórcio', name: c.name, cet: c.cet });
            }
        });
        if (all.length === 0 || amount <= 0) return null;
        return all.reduce((prev, curr) => (prev.cet < curr.cet) ? prev : curr);
    }, [bankResults, consortiumCalculatedResults, amount]);

    const loanResults = useMemo(() => {
        return bestOption || { cet: 0, name: 'N/A', type: 'N/A' };
    }, [bestOption]);

    const temporalData = useMemo(() => {
        const data: any[] = [];
        for (let i = 1; i <= months; i++) {
            const row: any = { monthNum: i };
            bankResults.forEach((b, idx) => {
                if (b) {
                    row[`bank_${idx+1}_price`] = Math.round(b.price.cashFlows[i-1] || 0);
                    row[`bank_${idx+1}_sac`] = Math.round(b.sac.cashFlows[i-1] || 0);
                }
            });
            consortiumCalculatedResults.forEach((c, idx) => {
                if (c) row[`cons_${idx+1}`] = Math.round(c.cashFlows[i-1] || 0);
            });
            if (i % Math.max(1, Math.floor(months / 20)) === 0 || i === months) {
                data.push(row);
            }
        }
        return data;
    }, [months, bankResults, consortiumCalculatedResults]);

    if (!isSimActive) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 animate-executive-fade">
                <div className="w-full max-w-4xl space-y-12">
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-[40px] bg-slate-900 text-secondary mb-6 shadow-2xl relative">
                            <Zap size={48} />
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-success-soft0 rounded-full border-4 border-white flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                            </div>
                        </div>
                        <h1 className="text-5xl font-display font-black text-primary tracking-tight uppercase">Simulador de Captação</h1>
            <p className="text-executive-secondary text-lg font-medium max-w-2xl mx-auto italic">
                            "Modelagem estratégica de capital, spread operacional e alavancagem financeira para decisões de alto impacto."
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <motion.button 
                            whileHover={{ y: -5 }}
                            onClick={resetProject}
                            className="group p-10 bg-slate-900 rounded-[48px] text-white text-left transition-all shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute -right-20 -top-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl group-hover:bg-secondary/20 transition-all"></div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-8 group-hover:bg-secondary group-hover:text-white transition-all">
                                    <Plus size={32} />
                                </div>
                                <h3 className="text-2xl font-display font-black uppercase mb-2">Novo Projeto</h3>
                <p className="text-executive-secondary text-sm font-medium leading-relaxed">
                                    Inicie uma modelagem do zero, definindo valor, prazo e comparando instituições.
                                </p>
                            </div>
                        </motion.button>

                        <div className="bg-white p-10 rounded-[48px] border border-border shadow-sm relative overflow-hidden">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                    <History size={20} className="text-muted-foreground" /> Projetos Recentes
                                </h3>
                                <span className="text-[10px] font-black text-muted-foreground bg-slate-50 px-3 py-1 rounded-full">{savedProjects.length} SALVOS</span>
                            </div>
                            
                            <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                {savedProjects.length > 0 ? (
                                    savedProjects.map(p => (
                                        <button 
                                            key={p.id} 
                                            onClick={() => loadProject(p)}
                                            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-2xl transition-all group/item"
                                        >
                                            <div className="text-left">
                                                <p className="text-xs font-black uppercase tracking-tight mb-1">{p.projectName}</p>
                        <p className="text-[10px] font-bold ">{formatCurrency(p.amount)} • {p.months} Meses</p>
                                            </div>
                                            <ArrowRight size={16} className="opacity-0 group-hover/item:opacity-100 transform translate-x-[-10px] group-hover/item:translate-x-0 transition-all" />
                                        </button>
                                    ))
                                ) : (
                                    <div className="text-center py-10">
                                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                                            <FileText size={24} />
                                        </div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Nenhum projeto salvo</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20 animate-executive-fade">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-slate-900 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden no-print border border-white/5">
                {/* Visual Background Accents */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] -ml-32 -mb-32 pointer-events-none"></div>
                
                <div className="relative z-10 flex-1 space-y-6">
                    <div className="space-y-3">
                        <label className="text-[9px] font-black text-secondary uppercase tracking-[0.4em] flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></div>
                            Identificação da Modelagem
                        </label>
                        <div className="flex items-center gap-4 group max-w-2xl">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-focus-within:text-secondary group-focus-within:border-secondary/50 transition-all">
                                <FileText size={24} />
                            </div>
                            <input 
                                type="text"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                className="bg-transparent text-3xl font-display font-black tracking-tighter uppercase outline-none focus:text-secondary transition-all w-full placeholder:text-white/10 border-b border-white/20 focus:border-secondary pb-1"
                                placeholder="NOME DO PROJETO"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 rounded-full border border-blue-500/20">
                            <Zap size={12} className="text-blue-400" />
                            <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Estratégia de Captação</p>
                        </div>
                        {savedProjects.length > 0 && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 group cursor-pointer">
                                <History size={12} className="text-muted-foreground" />
                                <select 
                                    onChange={(e) => {
                                        const p = savedProjects.find(sp => sp.id === e.target.value);
                                        if (p) loadProject(p);
                                    }}
                                    value={selectedProjectId || ''}
                                    className="bg-transparent text-[9px] font-black uppercase outline-none text-muted-foreground group-hover:text-white transition-colors"
                                >
                                    <option value="" className="bg-slate-900">PROJETOS SALVOS</option>
                                    {savedProjects.map(p => (
                                        <option key={p.id} value={p.id} className="bg-slate-900">{p.projectName}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex gap-3 relative z-10">
                    <button onClick={resetProject} className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 transition-all">
                        <Plus size={18} />
                    </button>
                    <button 
                        onClick={handleSaveProject}
                        disabled={saving}
                        className="px-5 md:px-8 py-2 md:py-3 bg-secondary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-secondary/90 transition-all shadow-xl shadow-secondary/20 flex items-center gap-2"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
                        {selectedProjectId ? 'ATUALIZAR' : 'SALVAR PROJETO'}
                    </button>
                    <button onClick={() => window.print()} className="px-5 md:px-8 py-2 md:py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2">
                        <Printer size={16} /> RELATÓRIO
                    </button>
                </div>
            </div>

            {/* Executive Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card p-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="shrink-0">
                        <div className="w-20 h-20 rounded-[32px] bg-secondary/10 flex items-center justify-center text-secondary relative">
                            <Award size={40} />
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-success-soft0 rounded-full border-4 border-white flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-[11px] font-black text-secondary uppercase tracking-[0.3em] mb-3">Melhor Opção Identificada</h3>
            <p className="executive-note italic text-executive-secondary">
                            {bestOption 
                                ? `Baseado no Custo Efetivo Total (CET), a melhor alternativa é ${bestOption.name} (${bestOption.type}), com taxa de ${bestOption.cet.toFixed(2)}% a.a. O spread contra o retorno do negócio é de ${(expectedBusinessROI - bestOption.cet).toFixed(1)}%.`
                                : "Aguardando modelagem de dados para análise de spread e custo de capital."
                            }
                        </p>
                    </div>
                </div>
                <div className="bg-primary p-8 rounded-[32px] text-white flex flex-col justify-between relative overflow-hidden group shadow-xl">
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl"></div>
                    <div>
                        <h3 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">Menor CET Projetado</h3>
            <p className="text-4xl font-display font-black mb-2">{bestOption ? bestOption.cet.toFixed(2) : '0.00'}% <span className="text-sm font-bold ">a.a.</span></p>
                        <div className="flex items-center gap-2 text-emerald-400">
                            <ShieldCheck size={16} />
                            <span className="text-xs font-bold uppercase tracking-widest">Análise Multibancos</span>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase text-white/40">
                        <FileText size={14} />
                        {projectName}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                {/* Sidebar: Inputs */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-[32px] border border-border shadow-sm space-y-8 sticky top-8">
                        <div>
                            <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2 mb-6">
                                <div className="p-2 bg-slate-900 text-white rounded-xl shadow-lg"><Calculator size={18} /></div>
                                Captação
                            </h3>
                            <div className="space-y-5">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-1"><Target size={10} /> Finalidade do Capital</label>
                                    <select 
                                        value={projectPurpose} 
                                        onChange={(e) => setProjectPurpose(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-border rounded-xl font-bold text-muted-foreground outline-none focus:border-border text-xs"
                                    >
                                        <option value="Capital de Giro">Capital de Giro</option>
                                        <option value="Alongamento de Dívida">Alongamento de Dívida</option>
                                        <option value="Aquisição de Empresas (M&A)">Aquisição de Empresas (M&A)</option>
                                        <option value="Investimento em Expansão">Investimento em Expansão</option>
                                        <option value="Compra de Ativos/Máquinas">Compra de Ativos/Máquinas</option>
                                        <option value="Outros">Outros</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-1"><DollarSign size={10} /> Valor Necessário</label>
                  <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 border border-border rounded-xl font-bold text-executive-secondary outline-none focus:border-border text-sm" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-1"><Calendar size={10} /> Prazo Total (Meses)</label>
                                    <div className="flex items-center gap-4">
                                        <input 
                                            type="number" 
                                            value={months || ''} 
                                            onChange={(e) => setMonths(Number(e.target.value))} 
                                            className="w-16 px-2 py-1 bg-slate-50 border border-border rounded-lg font-bold text-muted-foreground text-xs outline-none focus:border-border"
                                            placeholder="0"
                                        />
                                        <input type="range" min="0" max="360" value={months} onChange={(e) => setMonths(Number(e.target.value))} className="flex-1 accent-slate-900 h-1 bg-slate-100 rounded-full appearance-none cursor-pointer" />
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-border space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[8px] font-bold text-muted-foreground uppercase">ROI Esperado do Negócio (% a.a.)</label>
                                        <input type="number" value={expectedBusinessROI} onChange={(e) => setExpectedBusinessROI(Number(e.target.value))} className="w-full px-3 py-2 bg-success-soft border border-emerald-100 rounded-lg font-bold text-emerald-700 text-xs" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[8px] font-bold text-muted-foreground uppercase">Rendimento de Caixa (% a.m.)</label>
                                        <input type="number" step="0.01" value={investmentYield} onChange={(e) => setInvestmentYield(Number(e.target.value))} className="w-full px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg font-bold text-blue-700 text-xs" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Results */}
                <div className="lg:col-span-3 space-y-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Banks Section */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-widest px-4 flex items-center gap-2">
                                <Building2 size={14} className="text-blue-500" /> Instituições Financeiras (Empréstimo)
                            </h4>
                            <div className="space-y-4">
                                {banks.map((bank, idx) => (
                                    <div key={bank.id} className={cn("bg-white p-6 rounded-3xl border transition-all", (bank.active && amount > 0) ? "border-blue-200 shadow-md" : "border-border opacity-60")}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <input 
                                                    type="checkbox" 
                                                    checked={bank.active} 
                                                    onChange={(e) => {
                                                        const newBanks = [...banks];
                                                        newBanks[idx].active = e.target.checked;
                                                        setBanks(newBanks);
                                                    }}
                                                    className="w-4 h-4 rounded-full accent-blue-600"
                                                />
                                                <input 
                                                    type="text" 
                                                    value={bank.name} 
                                                    onChange={(e) => {
                                                        const newBanks = [...banks];
                                                        newBanks[idx].name = e.target.value;
                                                        setBanks(newBanks);
                                                    }}
                                                    className="bg-transparent font-black text-xs uppercase outline-none text-muted-foreground"
                                                />
                                            </div>
                                            {bankResults[idx] && (
                                                <div className="flex gap-2">
                                                    <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                                                        PRICE: {bankResults[idx]!.price.cet.toFixed(2)}%
                                                    </span>
                                                    <span className="text-[8px] font-black text-emerald-600 bg-success-soft px-2 py-1 rounded-lg">
                                                        SAC: {bankResults[idx]!.sac.cet.toFixed(2)}%
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[8px] font-black text-muted-foreground uppercase">Taxa (% a.m.)</label>
                                                <input 
                                                    type="number" 
                                                    step="0.01" 
                                                    value={bank.rate} 
                                                    onChange={(e) => {
                                                        const newBanks = [...banks];
                                                        newBanks[idx].rate = Number(e.target.value);
                                                        setBanks(newBanks);
                                                    }}
                                                    className="w-full bg-slate-50 border-none rounded-lg p-2 text-[10px] font-bold"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[8px] font-black text-muted-foreground uppercase">Carência (M)</label>
                                                <input 
                                                    type="number" 
                                                    value={bank.grace} 
                                                    onChange={(e) => {
                                                        const newBanks = [...banks];
                                                        newBanks[idx].grace = Number(e.target.value);
                                                        setBanks(newBanks);
                                                    }}
                                                    className="w-full bg-slate-50 border-none rounded-lg p-2 text-[10px] font-bold"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Consortia Section */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-widest px-4 flex items-center gap-2">
                                <PiggyBank size={14} className="text-amber-500" /> Administradoras de Consórcio
                            </h4>
                            <div className="space-y-4">
                                {consortia.map((cons, idx) => (
                                    <div key={cons.id} className={cn("bg-white p-6 rounded-3xl border transition-all", (cons.active && amount > 0) ? "border-amber-200 shadow-md" : "border-border opacity-60")}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <input 
                                                    type="checkbox" 
                                                    checked={cons.active} 
                                                    onChange={(e) => {
                                                        const newCons = [...consortia];
                                                        newCons[idx].active = e.target.checked;
                                                        setConsortia(newCons);
                                                    }}
                                                    className="w-4 h-4 rounded-full accent-amber-600"
                                                />
                                                <input 
                                                    type="text" 
                                                    value={cons.name} 
                                                    onChange={(e) => {
                                                        const newCons = [...consortia];
                                                        newCons[idx].name = e.target.value;
                                                        setConsortia(newCons);
                                                    }}
                                                    className="bg-transparent font-black text-xs uppercase outline-none text-muted-foreground"
                                                />
                                            </div>
                                            {consortiumCalculatedResults[idx] && (
                                                <span className="text-[10px] font-black text-amber-600 bg-warning-soft px-2 py-1 rounded-lg">
                                                    CET: {consortiumCalculatedResults[idx]!.cet.toFixed(2)}% a.a.
                                                </span>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[8px] font-black text-muted-foreground uppercase">T. Adm Total (%)</label>
                                                <input 
                                                    type="number" 
                                                    value={cons.adminFee} 
                                                    onChange={(e) => {
                                                        const newCons = [...consortia];
                                                        newCons[idx].adminFee = Number(e.target.value);
                                                        setConsortia(newCons);
                                                    }}
                                                    className="w-full bg-slate-50 border-none rounded-lg p-2 text-[10px] font-bold"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[8px] font-black text-muted-foreground uppercase">Contempl. (M)</label>
                                                <input 
                                                    type="number" 
                                                    value={cons.contemplMonth} 
                                                    onChange={(e) => {
                                                        const newCons = [...consortia];
                                                        newCons[idx].contemplMonth = Number(e.target.value);
                                                        setConsortia(newCons);
                                                    }}
                                                    className="w-full bg-slate-50 border-none rounded-lg p-2 text-[10px] font-bold"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[8px] font-black text-muted-foreground uppercase">Reduzida (%)</label>
                                                <input 
                                                    type="number" 
                                                    value={cons.reduced} 
                                                    onChange={(e) => {
                                                        const newCons = [...consortia];
                                                        newCons[idx].reduced = Number(e.target.value);
                                                        setConsortia(newCons);
                                                    }}
                                                    className="w-full bg-slate-50 border-none rounded-lg p-2 text-[10px] font-bold"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[48px] border border-border shadow-sm">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-2xl font-display font-black text-primary mb-1">Evolução de Fluxo (Comparativo)</h3>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Análise simultânea de desembolso mensal</p>
                            </div>
                        </div>
                        <div className="h-[400px] w-full flex items-center justify-center bg-slate-50/50 rounded-[32px] border border-dashed border-border">
                            {amount > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={temporalData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" />
                                        <XAxis dataKey="monthNum" fontSize={10} tickLine={false} axisLine={false} />
                                        <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v/1000}k`} />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                            formatter={(value: any) => formatCurrency(value)}
                                        />
                                        <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', paddingTop: '20px' }} />
                                        
                                        {banks.map((b, idx) => b.active && (
                                            <React.Fragment key={`bank_${idx}`}>
                                                <Bar name={`${b.name} (PRICE)`} dataKey={`bank_${idx+1}_price`} fill={['var(--color-executive-primary)', 'var(--color-executive-primary)', 'var(--color-executive-primary)'][idx]} barSize={6} radius={[2,2,0,0]} />
                                                <Bar name={`${b.name} (SAC)`} dataKey={`bank_${idx+1}_sac`} fill={['var(--color-executive-primary)', 'var(--color-executive-primary)', 'var(--color-executive-primary)'][idx]} barSize={6} radius={[2,2,0,0]} />
                                            </React.Fragment>
                                        ))}
                                        {consortia.map((c, idx) => c.active && (
                                            <Line key={`cons_${idx}`} name={c.name} dataKey={`cons_${idx+1}`} stroke={['var(--color-executive-primary)', 'var(--color-executive-primary)', 'var(--color-executive-primary)'][idx]} strokeWidth={3} dot={false} />
                                        ))}
                                    </ComposedChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="text-center space-y-2">
                                    <BarChart size={40} className="mx-auto text-muted-foreground" />
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Aguardando definição de valor para gerar projeção</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bankResults.filter(r => r !== null).map((res: any, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-[40px] border border-blue-100 shadow-sm col-span-1 lg:col-span-2">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-sm font-black text-primary uppercase tracking-widest">{res.name}</h4>
                                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">Comparativo de Amortização</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Price Column */}
                                    <div className="p-6 bg-slate-50 rounded-3xl border border-border relative">
                                        <div className="absolute top-4 right-4 text-blue-500"><Percent size={16} /></div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Sistema PRICE</p>
                                        <div className="space-y-4">
                                            <div>
                        <p className="text-2xl font-black text-primary">{res.price.cet.toFixed(2)}% <span className="text-[10px] ">CET a.a.</span></p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                                                <div>
                          <p className="text-[8px] font-black text-executive-secondary uppercase">Total Pago</p>
                                                    <p className="text-xs font-bold text-muted-foreground">{formatCurrency(res.price.totalPaid)}</p>
                                                </div>
                                                <div>
                          <p className="text-[8px] font-black text-executive-secondary uppercase">Juros</p>
                                                    <p className="text-xs font-bold text-rose-500">{formatCurrency(res.price.totalInterest)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Sac Column */}
                                    <div className="p-6 bg-success-soft/30 rounded-3xl border border-emerald-100 relative">
                                        <div className="absolute top-4 right-4 text-emerald-500"><TrendingUp size={16} /></div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Sistema SAC</p>
                                        <div className="space-y-4">
                                            <div>
                        <p className="text-2xl font-black text-primary">{res.sac.cet.toFixed(2)}% <span className="text-[10px] ">CET a.a.</span></p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-emerald-200">
                                                <div>
                          <p className="text-[8px] font-black text-executive-secondary uppercase">Total Pago</p>
                                                    <p className="text-xs font-bold text-muted-foreground">{formatCurrency(res.sac.totalPaid)}</p>
                                                </div>
                                                <div>
                          <p className="text-[8px] font-black text-executive-secondary uppercase">Juros</p>
                                                    <p className="text-xs font-bold text-emerald-600">{formatCurrency(res.sac.totalInterest)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 p-4 bg-blue-900 rounded-2xl text-white">
                                    <p className="text-xs font-bold flex items-center gap-2">
                                        <Zap size={14} className="text-secondary" />
                                        Diagnóstico: {res.sac.totalPaid < res.price.totalPaid 
                                            ? `O sistema SAC economiza ${formatCurrency(res.price.totalPaid - res.sac.totalPaid)} em juros totais comparado ao PRICE.` 
                                            : `O sistema PRICE oferece parcelas iniciais menores, favorecendo o fluxo de caixa imediato.`}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {consortiumCalculatedResults.filter(r => r !== null).map((res: any, idx) => (
                            <div key={`cons_res_${idx}`} className="bg-white p-6 rounded-[32px] border border-amber-100 shadow-sm">
                <p className="text-[8px] font-black text-executive-secondary uppercase tracking-widest mb-2">{res.name} (CONSÓRCIO)</p>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-2xl font-black text-primary">{res.cet.toFixed(2)}%</span>
                                    <span className="text-[10px] font-bold text-muted-foreground">CET a.a.</span>
                                </div>
                                <div className="space-y-2 pt-4 border-t border-border">
                                    <div className="flex justify-between text-[9px] font-bold">
                                        <span className="text-muted-foreground">Total Pago:</span>
                                        <span className="text-muted-foreground">{formatCurrency(res.totalPaid)}</span>
                                    </div>
                                    <div className="flex justify-between text-[9px] font-bold">
                                        <span className="text-muted-foreground">Taxas Totais:</span>
                                        <span className="text-amber-600">{formatCurrency(res.totalFees)}</span>
                                    </div>
                                </div>
                                <div className="mt-4 p-3 bg-warning-soft rounded-xl">
                                    <p className="text-[8px] text-amber-700 italic leading-tight font-bold">
                                        Taxa administrativa de {res.adminFee}% com contemplação no mês {res.contemplMonth}.
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="md:col-span-2 bg-slate-900 p-12 rounded-[56px] text-white overflow-hidden relative border border-border shadow-2xl">
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
                                                <div className={cn("h-full", expectedBusinessROI > loanResults.cet ? "bg-success-soft0" : "bg-critical-soft0")} style={{ width: `${Math.min(Math.abs(expectedBusinessROI - loanResults.cet) * 10, 100)}%` }}></div>
                                            </div>
                                            <p className="text-[11px] text-muted-foreground mt-4 font-medium italic">Diferencial entre ROI do Negócio e Custo da Dívida.</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 p-8 rounded-[40px] border border-white/10 backdrop-blur-md">
                                        <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6 flex items-center gap-2"><ShieldCheck size={14} /> Parecer CFO</h4>
                    <p className="text-sm text-executive-secondary leading-relaxed font-medium mb-6">
                                            {projectPurpose === 'Alongamento de Dívida' && `Estratégia focada em redução de desembolso mensal e otimização do cronograma de amortização.`}
                                            {projectPurpose === 'Capital de Giro' && `Foco em liquidez imediata. O CET de ${loanResults.cet.toFixed(1)}% deve ser comparado ao custo de oportunidade do caixa.`}
                                            {projectPurpose.includes('Expansão') && `Investimento em crescimento. O ROI de ${expectedBusinessROI.toFixed(1)}% justifica a alavancagem com spread de ${(expectedBusinessROI - loanResults.cet).toFixed(1)}%.`}
                                            {(!projectPurpose.includes('Alongamento') && !projectPurpose.includes('Giro') && !projectPurpose.includes('Expansão')) && (
                                                expectedBusinessROI > loanResults.cet 
                                                    ? `Estrutura de capital recomendada para ${projectPurpose}: O ROI de ${expectedBusinessROI.toFixed(1)}% valida a captação.`
                                                    : `Atenção: O custo de capital (${loanResults.cet.toFixed(1)}%) para ${projectPurpose} é superior ao ROI esperado.`
                                            )}
                                        </p>
                                        <div className="pt-6 border-t border-white/10 flex justify-between text-[10px] font-black uppercase text-muted-foreground">
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
            {amount > 0 && (
                <div className="bg-emerald-900 p-12 md:p-20 rounded-[64px] text-white border border-emerald-800 shadow-2xl relative overflow-hidden mt-10">
                    <div className="absolute -right-40 -bottom-40 w-[600px] h-[600px] bg-success-soft0/20 blur-[120px] rounded-full"></div>
                    <div className="relative z-10 max-w-5xl">
                        <h3 className="text-3xl font-display font-black mb-12 flex items-center gap-6">
                            <div className="p-4 bg-success-soft0/20 rounded-[24px] shadow-inner"><Target className="text-emerald-400" size={32} /></div>
                            Recomendações de Gestão
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                            <div className="space-y-8">
                                <h4 className="text-[11px] font-black uppercase text-emerald-400 tracking-[0.4em] mb-4">Estratégia de Captação</h4>
                                <ul className="space-y-5">
                                    {[
                                        `Estratégia para ${projectPurpose}: A alternativa ${bestOption?.name} oferece a melhor estrutura de custo (${bestOption?.cet.toFixed(2)}% a.a.).`,
                                        projectPurpose === 'Capital de Giro' 
                                            ? "Priorizar carência para fortalecer o colchão de liquidez operacional nos primeiros meses."
                                            : "Monitorar o impacto do custo de capital no ROI total do projeto de investimento.",
                                        expectedBusinessROI > (bestOption?.cet || 0)
                                            ? `Spread de ${(expectedBusinessROI - (bestOption?.cet || 0)).toFixed(1)}% identificado. A alavancagem potencializa o retorno sobre o patrimônio (ROE).`
                                            : `Risco de descapitalização: O custo do dinheiro supera o retorno esperado para ${projectPurpose}.`,
                                        `Eficiência Fiscal: Considere o impacto do Tax Shield no Lucro Real, que pode reduzir o custo efetivo em até 34%.`
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex gap-4 text-sm text-emerald-100/90 leading-relaxed group">
                                            <div className="w-1.5 h-1.5 rounded-full bg-success-soft0 mt-2 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="p-8 bg-white/5 rounded-[40px] border border-white/10 backdrop-blur-md">
                                <h4 className="text-[11px] font-black uppercase text-secondary tracking-[0.4em] mb-6">Ponto de Equilíbrio (Capital)</h4>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black text-muted-foreground uppercase">ROI Mínimo Requerido</span>
                                        <span className="text-xl font-black text-white">{(bestOption?.cet || 0).toFixed(2)}%</span>
                                    </div>
                                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                        <div className="bg-secondary h-full" style={{ width: `${Math.min((bestOption?.cet || 0) * 5, 100)}%` }}></div>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                                        Para que a captação não destrua valor, o retorno sobre o capital investido (ROIC) deve ser obrigatoriamente superior a {(bestOption?.cet || 0).toFixed(2)}% ao ano.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
