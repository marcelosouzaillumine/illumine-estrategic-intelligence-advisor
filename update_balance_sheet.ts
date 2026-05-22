import * as fs from 'fs';

const filePath = '/Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/components/pages/BalanceSheetPage.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// We will do several string replacements.

// 1. Insert `hasData` check after `indiceDescapitalizacao` section or around `resilienciaGlobal`
content = content.replace(
  "const liqGeral    = (pc + pnc) > 0 ? (ac + anc * 0.4) / (pc + pnc) : 0;",
  `const liqGeral    = (pc + pnc) > 0 ? (ac + anc * 0.4) / (pc + pnc) : 0;

  const hasData = ativoTotal > 0 || passivoTotal > 0 || plValue > 0;
  
  const formatKpiValue = (val: number, isCurrency: boolean = false, suffix: string = '') => {
    if (!hasData) return '—';
    return isCurrency ? formatCurrency(val) : val.toFixed(1);
  };
  
  const getKpiStatus = (condition: boolean) => {
    if (!hasData) return 'Neutro';
    return condition ? 'Verde' : 'Vermelho';
  };`
);

// 2. Replace the Scoring functions
const scoringRegex = /\/\/ -- Scoring \(0-100\) --[\s\S]*?const maturidade = getMaturity\(resilienciaGlobal\);/;
const newScoring = `// -- Scoring (0-100) -- (5 Pilares Executivos)
  const getScoreLiquidez = () => {
    let s = 0;
    if (liqCorrente > 1.2) s += 40; else if (liqCorrente > 1) s += 20;
    if (liquidezReal > 1) s += 30; else if (liquidezReal > 0.8) s += 15;
    if (saldoTesouraria > 0) s += 30; else if (cgl > 0) s += 15;
    return s;
  };
  const getScoreEstrutura = () => {
    let s = 0;
    if (qualidadeEndividamento < 0.4) s += 50; else if (qualidadeEndividamento < 0.7) s += 25;
    if (dependenciaBancaria < 0.3) s += 50; else if (dependenciaBancaria < 0.6) s += 25;
    return s;
  };
  const getScoreCapitalGiro = () => {
     let s = 0;
     if (ncg < ac * 0.5) s += 50; else if (ncg < ac * 0.8) s+= 25;
     if (concentracaoEstoque < 0.2) s += 50; else if (concentracaoEstoque < 0.4) s+= 25;
     return s;
  };
  const getScorePatrimonial = () => {
    let s = 0;
    if (indiceCapitalizacao > 0.3) s += 50; else if (indiceCapitalizacao > 0.1) s += 25;
    if (autonomiaFinanceira > 0.5) s += 50; else if (autonomiaFinanceira > 0.2) s += 25;
    return s;
  };
  const getScoreEvolucao = () => {
    const prevPl = getHistoricalValue(filterYear - 1, 'patrimônio líquido') || getHistoricalValue(filterYear - 1, 'pl');
    if (prevPl <= 0) return 50;
    const growth = ((plValue / prevPl) - 1);
    if (growth > 0.1) return 100;
    if (growth > 0) return 75;
    if (growth > -0.1) return 25;
    return 0;
  };

  const hsLiquidez = getScoreLiquidez();
  const hsEstrutura = getScoreEstrutura();
  const hsCapitalGiro = getScoreCapitalGiro();
  const hsPatrimonial = getScorePatrimonial();
  const hsEvolucao = getScoreEvolucao();

  const resilienciaGlobal = hasData ? (
    (hsLiquidez * 0.25) + 
    (hsEstrutura * 0.25) + 
    (hsCapitalGiro * 0.20) + 
    (hsPatrimonial * 0.20) + 
    (hsEvolucao * 0.10)
  ) : 0;

  const getMaturity = (score: number) => {
    if (!hasData) return 'Pendente';
    if (score < 20) return 'Maturidade Estrutural Inicial';
    if (score < 40) return 'Estrutura Operacional Básica';
    if (score < 60) return 'Estrutura Financeira Média';
    if (score < 80) return 'Estrutura Profissionalizada';
    return 'Alta Maturidade Estrutural';
  };
  const maturidade = getMaturity(resilienciaGlobal);`;
content = content.replace(scoringRegex, newScoring);

// 3. Replace Advisory Insights (causalInsights)
const causalRegex = /\/\/ -- Advisory Insights --[\s\S]*?\}, \[saldoTesouraria, indiceDescapitalizacao, qualidadeEndividamento, dependenciaBancaria, liquidezReal, autonomiaFinanceira, concentracaoEstoque, creditosSocios, dbData\.length\]\);/;
const newCausal = `// -- Parecer Executivo (Advisory AI) --
  const causalInsights = useMemo(() => {
    if (!hasData || dbData.length === 0) return [];
    const insights = [];

    if (saldoTesouraria < 0) {
      insights.push({ type: 'Risco Estrutural', title: 'Vulnerabilidade de Capital de Giro', desc: 'Nota-se que a necessidade de capital de giro superou a capacidade gerada pela operação. Este quadro exige financiamento constante via terceiros para sustentabilidade de curto prazo.' });
    }

    if (indiceDescapitalizacao > 0.6) {
      insights.push({ type: 'Alerta Patrimonial', title: 'Erosão de Patrimônio Líquido', desc: 'O acúmulo de prejuízos consumiu a maior parte do capital integralizado, indicando a necessidade premente de um plano de contingência para reversão e proteção estrutural.'});
    } else if (indiceDescapitalizacao > 0.25) {
      insights.push({ type: 'Atenção Moderada', title: 'Pressão na Solidez Financeira', desc: 'A absorção de parte do capital pelas perdas operacionais sugere que a diretoria deve reavaliar a rentabilidade dos produtos para proteger a sustentabilidade de longo prazo.'});
    }

    if (qualidadeEndividamento > 0.7) {
      insights.push({ type: 'Risco Estrutural', title: 'Alta Exigibilidade de Curto Prazo', desc: 'O perfil da dívida concentra-se fortemente no curto prazo, limitando a capacidade de absorção de choques econômicos inesperados no fluxo de caixa.' });
    } else if (dependenciaBancaria > 0.5) {
      insights.push({ type: 'Risco Estrutural', title: 'Alta Exposição a Terceiros', desc: 'A estrutura de financiamento revela considerável dependência do sistema bancário, elevando custos com juros e limitando a autonomia para novos investimentos.' });
    }

    if (liquidezReal > 1.2 && saldoTesouraria > 0) {
      insights.push({ type: 'Sustentabilidade', title: 'Folga de Liquidez Resiliente', desc: 'A proporção de ativos altamente líquidos demonstra excelência na gestão de garantias, conferindo à organização capacidade para investir e enfrentar adversidades.' });
    } else if (autonomiaFinanceira > 0.6) {
      insights.push({ type: 'Sustentabilidade', title: 'Alta Autonomia Estrutural', desc: 'Com o capital próprio financiando a maior parte do ativo, a companhia desfruta de robusta proteção e independência para execução de suas diretrizes estratégicas.' });
    }

    if (concentracaoEstoque > 0.4) {
      insights.push({ type: 'Parecer Consultivo', title: 'Mobilidade de Capital Restrita', desc: 'Apesar de a liquidez corrente aparentar robustez, há imobilização excessiva no estoque. Sugere-se uma revisão das políticas de compras e giros de produto.' });
    } else if (creditosSocios > (ac * 0.2)) {
      insights.push({ type: 'Parecer Consultivo', title: 'Gestão de Partes Relacionadas', desc: 'Uma fatia expressiva do ativo está vinculada aos sócios. É fundamental estruturar um cronograma de amortização para mitigar contingências na qualidade do ativo.' });
    }

    if (insights.length === 0) {
      insights.push({ type: 'Sustentabilidade', title: 'Equilíbrio Patrimonial', desc: 'Os pilares estruturais e operacionais apresentam consistência. O conselho deve focar na preservação desta solidez frente a expansões futuras.' });
    }

    return insights;
  }, [saldoTesouraria, indiceDescapitalizacao, qualidadeEndividamento, dependenciaBancaria, liquidezReal, autonomiaFinanceira, concentracaoEstoque, creditosSocios, hasData, dbData.length]);`;
content = content.replace(causalRegex, newCausal);


// 4. Update KPI Cards in the render
const kpiCardsRegex = /<KpiCard title="Capital de Giro Líquido"[\s\S]*?status=\{liquidezReal >= 1 \? 'Verde' : 'Vermelho'\} \/>/g;
const replaceCardsFunction = (match: string) => {
  return match
    .replace(/value=\{formatCurrency\(cgl\)\}/g, "value={formatKpiValue(cgl, true)}")
    .replace(/status=\{cgl > 0 \? 'Verde' : 'Vermelho'\}/g, "status={getKpiStatus(cgl > 0)}")
    
    .replace(/value=\{formatCurrency\(ncg\)\}/g, "value={formatKpiValue(ncg, true)}")
    .replace(/status=\{ncg < cgl \? 'Verde' : 'Amarelo'\}/g, "status={getKpiStatus(ncg < cgl)}")
    
    .replace(/value=\{formatCurrency\(saldoTesouraria\)\}/g, "value={formatKpiValue(saldoTesouraria, true)}")
    .replace(/status=\{saldoTesouraria > 0 \? 'Verde' : 'Vermelho'\}/g, "status={getKpiStatus(saldoTesouraria > 0)}")
    
    .replace(/value=\{idx\.val\.toFixed\(2\)\}/g, "value={formatKpiValue(idx.val)}")
    .replace(/status=\{idx\.val >= 1 \? 'Verde' : 'Vermelho'\}/g, "status={getKpiStatus(idx.val >= 1)}")
    
    .replace(/value=\{liquidezReal\.toFixed\(2\)\}/g, "value={formatKpiValue(liquidezReal)}")
    .replace(/status=\{liquidezReal >= 1 \? 'Verde' : 'Vermelho'\}/g, "status={getKpiStatus(liquidezReal >= 1)}")
};
content = content.replace(kpiCardsRegex, replaceCardsFunction);

const endividamentoCardsRegex = /<KpiCard \n\s*key=\{i\}\n\s*title=\{idx\.name\}[\s\S]*?status=\{idx\.status as any\}\n\s*\/>/g;
content = content.replace(endividamentoCardsRegex, `<KpiCard 
                key={i}
                title={idx.name}
                value={formatKpiValue(idx.val)}
                suffix={hasData ? idx.unit : ''}
                icon={idx.icon as any}
                status={hasData ? (idx.status as any) : 'Neutro'}
              />`);

// 5. Hero Section replacement (5 Pillars)
const heroSectionRegex = /<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">[\s\S]*?<\/div>\s*<\/div>/;
const newPillars = `<div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Liquidez (25%)', val: hsLiquidez, color: 'emerald' },
            { label: 'Estrutura (25%)', val: hsEstrutura, color: 'blue' },
            { label: 'Cap. Giro (20%)', val: hsCapitalGiro, color: 'amber' },
            { label: 'Solidez (20%)', val: hsPatrimonial, color: 'purple' },
            { label: 'Evolução (10%)', val: hsEvolucao, color: 'indigo' }
          ].map((hs, i) => (
            <div key={i} className={cn("border rounded-[32px] p-6 flex flex-col justify-between relative overflow-hidden group transition-all duration-500 hover:-translate-y-1 hover:shadow-xl", 
              hasData ? "bg-slate-950 border-white/5 hover:border-white/10" : "bg-slate-100 border-slate-200"
            )}>
              {hasData && <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[40px] -mr-16 -mt-16 pointer-events-none opacity-40 transition-opacity duration-500 group-hover:opacity-70", \`bg-\${hs.color}-500/30\`)} />}
              
              <div className="relative z-10">
                <span className={cn("text-[10px] font-black uppercase tracking-[0.2em] mb-4 block", hasData ? "text-white/40" : "text-slate-400")}>{hs.label}</span>
                <div className="mt-8">
                  <span className={cn("text-4xl font-black tracking-tighter drop-shadow-md", hasData ? "text-white" : "text-slate-300")}>{hasData ? hs.val.toFixed(0) : '—'}</span>
                  <div className={cn("w-full h-1.5 rounded-full mt-4 overflow-hidden shadow-inner", hasData ? "bg-white/5" : "bg-slate-200")}>
                    <div className={cn("h-full rounded-full transition-all duration-1000 ease-out", hasData ? \`bg-\${hs.color}-500\` : "bg-transparent")} style={{ width: \`\${hasData ? hs.val : 0}%\` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>`;
content = content.replace(heroSectionRegex, newPillars);

const emptyHeroTextRegex = /resilienciaGlobal\.toFixed\(0\)/g;
content = content.replace(emptyHeroTextRegex, "hasData ? resilienciaGlobal.toFixed(0) : '—'");

// Fix Advisory AI Empty state text
const advisoryEmptyRegex = /Aguardando dados para gerar leitura causal\./g;
content = content.replace(advisoryEmptyRegex, "Aguardando consolidação dos demonstrativos contábeis para emissão do parecer executivo estrutural.");

fs.writeFileSync(filePath, content);
console.log("Updated BalanceSheetPage calculations and structure.");
