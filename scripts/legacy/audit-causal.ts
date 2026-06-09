import { evaluateMasterCausality } from './src/lib/master-causal-engine';
import { calculateFinancialMetrics } from './src/lib/financial-engine';

const scenarios = [
  {
    name: 'Cenário 1: Liquidez Corrente saudável, mas com fragilidades estruturais',
    bp: {
      ativoTotal: 1000,
      ativoCirculante: 600,
      ativoNaoCirculante: 400,
      passivoTotal: 1000,
      passivoCirculante: 400, // LC = 600/400 = 1.5 (Saudável)
      passivoNaoCirculante: 100, // Dívida concentrada no CP (400 / 500)
      patrimonioLiquido: 500,
      caixaEquivalentes: 20, // Liquidez imediata baixa
      estoques: 450, // Estoque elevado
      clientes: 130,
      fornecedores: 350, // Fornecedores financiando
      passivosFinanceiros: 50,
      capitalSocial: 600,
      lucrosPrejuizos: -100, // Prejuízos acumulados
      restritaConversibilidade: 0,
      creditosSocios: 0
    },
    ebitda: 10,
    lucroLiquido: -20,
    industry: 'varejo'
  },
  {
    name: 'Cenário 2: Capital de giro positivo, mas com baixa conversão em caixa',
    bp: {
      ativoTotal: 1000,
      ativoCirculante: 500,
      ativoNaoCirculante: 500,
      passivoTotal: 1000,
      passivoCirculante: 300,
      passivoNaoCirculante: 200,
      patrimonioLiquido: 500,
      caixaEquivalentes: 10, // Baixa conversão em caixa
      estoques: 100,
      clientes: 390, // Valores retidos em clientes
      fornecedores: 100,
      passivosFinanceiros: 100,
      capitalSocial: 500,
      lucrosPrejuizos: 0,
      restritaConversibilidade: 0,
      creditosSocios: 0
    },
    ebitda: 50, // EBITDA positivo, mas caixa não sobe
    lucroLiquido: 30,
    industry: 'serviços'
  },
  {
    name: 'Cenário 3: Patrimônio líquido positivo, mas com lucros/prejuízos acumulados negativos relevantes',
    bp: {
      ativoTotal: 1000,
      ativoCirculante: 400,
      ativoNaoCirculante: 600,
      passivoTotal: 1000,
      passivoCirculante: 400,
      passivoNaoCirculante: 400,
      patrimonioLiquido: 200, // PL positivo
      caixaEquivalentes: 100,
      estoques: 100,
      clientes: 200,
      fornecedores: 100,
      passivosFinanceiros: 300,
      capitalSocial: 1000, // Alto aporte de capital
      lucrosPrejuizos: -800, // Prejuízos acumulados engolindo o PL
      restritaConversibilidade: 0,
      creditosSocios: 0
    },
    ebitda: -50,
    lucroLiquido: -100,
    industry: 'indústria'
  },
  {
    name: 'Cenário 4: Estoque acima de 40% do Ativo Circulante',
    bp: {
      ativoTotal: 1000,
      ativoCirculante: 500,
      ativoNaoCirculante: 500,
      passivoTotal: 1000,
      passivoCirculante: 300,
      passivoNaoCirculante: 200,
      patrimonioLiquido: 500,
      caixaEquivalentes: 50,
      estoques: 250, // 250 / 500 = 50% (> 40%)
      clientes: 200,
      fornecedores: 100,
      passivosFinanceiros: 100,
      capitalSocial: 500,
      lucrosPrejuizos: 0,
      restritaConversibilidade: 0,
      creditosSocios: 0
    },
    ebitda: 100,
    lucroLiquido: 80,
    industry: 'varejo'
  },
  {
    name: 'Cenário 5: Dívida CP acima de 75% do Passivo Total',
    bp: {
      ativoTotal: 1000,
      ativoCirculante: 400,
      ativoNaoCirculante: 600,
      passivoTotal: 1000,
      passivoCirculante: 600, // 600 / 700 passivos exigíveis = 85.7% ou 600/1000 = 60%? Passivo Total inclui PL? Em contabilidade, Passivo Total + PL = Ativo Total.
      // Se passivoTotal = 1000 e PL = 300, então Exigível = 700. CP = 600 (>75% de 700)
      passivoNaoCirculante: 100,
      patrimonioLiquido: 300,
      caixaEquivalentes: 50,
      estoques: 150,
      clientes: 200,
      fornecedores: 100,
      passivosFinanceiros: 500,
      capitalSocial: 300,
      lucrosPrejuizos: 0,
      restritaConversibilidade: 0,
      creditosSocios: 0
    },
    ebitda: 100,
    lucroLiquido: 50,
    industry: 'indústria'
  }
];

// Correção para cenário 5: Passivo Exigível Total
scenarios[4].bp.passivoTotal = 700; // Exigível
scenarios[4].bp.patrimonioLiquido = 300; // PL (700+300=1000)

async function run() {
  for (const s of scenarios) {
    console.log(`\n===========================================`);
    console.log(`Testando: ${s.name}`);
    console.log(`===========================================`);
    const metrics = calculateFinancialMetrics(s.bp as any, s.ebitda, s.lucroLiquido, s.industry);
    const causality = evaluateMasterCausality(s.bp as any, metrics, { segment: s.industry } as any);
    
    console.log(`--> Métricas de Liquidez:`);
    console.log(`    Liquidez Corrente: ${metrics.liqCorrente.toFixed(2)}`);
    console.log(`    Liquidez Imediata: ${metrics.liqImediata.toFixed(2)}`);
    console.log(`    Saldo Tesouraria: ${metrics.saldoTesouraria.toFixed(2)}`);
    
    console.log(`\n--> Cenários Causais Ativados:`);
    if (causality.scenarios.length === 0) {
      console.log(`    Nenhum cenário ativado.`);
    } else {
      causality.scenarios.forEach(sc => {
        console.log(`    - [${sc.severity}] ${sc.name}: ${sc.description}`);
      });
    }

    console.log(`\n--> Bloqueios de Narrativa (Blocked Narratives):`);
    if (causality.blockedNarratives.length === 0) {
      console.log(`    Nenhum bloqueio.`);
    } else {
      causality.blockedNarratives.forEach(bn => console.log(`    - BLOQUEADO: ${bn}`));
    }

    console.log(`\n--> Insights Comportamentais:`);
    console.log(`    Liquidez Qualitativa: ${causality.behavioralInsights.liquidezQualitativa}`);
    console.log(`    Dinâmica de Caixa: ${causality.behavioralInsights.dinamicaDeCaixa}`);
    console.log(`    Sustentabilidade: ${causality.behavioralInsights.sustentabilidadeOperacional}`);
  }
}

run();
