import fs from 'fs';

let content = fs.readFileSync('src/core/runtime/executive-consolidation/ExecutiveNarrativeVariations.ts', 'utf-8');

// 1. Update the interface VariationSet
content = content.replace(
  /interface VariationSet \{[\s\S]*?\}/,
  `interface VariationSet {
  primaryDriver: string;
  executiveNarrative: string;
  justification?: string;
  managerialImplication?: string;
  priorityAction: string;
}`
);

// We define priority actions by Engine and Status
const PRIORITY_ACTIONS = {
  LIQUIDITY: {
    EXCELLENT: "Manter estratégia atual e avaliar alocação de excedentes de caixa em operações de maior rentabilidade.",
    HEALTHY: "Monitorar ciclo financeiro para garantir a estabilidade da cobertura de curto prazo.",
    WARNING: "Otimizar gestão do capital de giro e revisar prazos de pagamentos e recebimentos.",
    CRITICAL: "Acionar plano de contingência para injeção de liquidez imediata ou renegociação de exigibilidades.",
    INSUFFICIENT_DATA: "Levantar dados detalhados do circulante para viabilizar análise de caixa."
  },
  CAPITAL_STRUCTURE: {
    EXCELLENT: "Manter estrutura otimizada e avaliar oportunidades de alavancagem estratégica para crescimento.",
    HEALTHY: "Preservar mix de financiamento e monitorar custo de captação de dívidas vincendas.",
    WARNING: "Interromper novas captações onerosas e iniciar plano de desalavancagem progressiva.",
    CRITICAL: "Iniciar imediata reestruturação de passivos e buscar aporte de capital primário.",
    INSUFFICIENT_DATA: "Mapear estrutura completa do passivo e patrimônio líquido."
  },
  ASSET_QUALITY: {
    EXCELLENT: "Preservar política atual de investimentos e manter o foco em ativos de rápida conversibilidade.",
    HEALTHY: "Manter governança sobre novos imobilizados, avaliando sempre o retorno sobre o capital empregado.",
    WARNING: "Suspender novos investimentos imobilizados e estruturar plano de desmobilização de ativos ociosos.",
    CRITICAL: "Executar desinvestimento imediato de ativos não essenciais para recompor liquidez.",
    INSUFFICIENT_DATA: "Consolidar base de dados do ativo permanente para análise."
  },
  WORKING_CAPITAL: {
    EXCELLENT: "Preservar inteligência de giro e avaliar redução de prêmios de risco com fornecedores.",
    HEALTHY: "Manter monitoramento de prazos médios de estocagem, recebimento e pagamento.",
    WARNING: "Acelerar recebíveis, renegociar prazos com fornecedores e otimizar níveis de estoque.",
    CRITICAL: "Geração emergencial de caixa via antecipação de recebíveis e liquidação de estoques.",
    INSUFFICIENT_DATA: "Regularizar apuração dos ciclos de estoques, clientes e fornecedores."
  },
  PRESERVATION: {
    EXCELLENT: "Manter política de retenção de lucros equilibrada e avaliar oportunidades de expansão orgânica.",
    HEALTHY: "Garantir consistência na geração de lucros para fortalecer continuamente a base de capital.",
    WARNING: "Revisar política de distribuição de dividendos e conter despesas operacionais não essenciais.",
    CRITICAL: "Estancar imediatamente fontes de prejuízo e elaborar plano de readequação patrimonial urgente.",
    INSUFFICIENT_DATA: "Auditar histórico de resultados e posição patrimonial recente."
  }
};

let currentEngine = null;
let currentStatus = null;

const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Detect engine
  const engineMatch = line.match(/^\s*(LIQUIDITY|CAPITAL_STRUCTURE|ASSET_QUALITY|WORKING_CAPITAL|PRESERVATION):\s*\{/);
  if (engineMatch) {
    currentEngine = engineMatch[1];
  }
  
  // Detect status
  const statusMatch = line.match(/^\s*(EXCELLENT|HEALTHY|WARNING|CRITICAL|INSUFFICIENT_DATA):\s*\[/);
  if (statusMatch) {
    currentStatus = statusMatch[1];
  }
  
  // Replace variation
  if (currentEngine && currentStatus && line.includes('primaryDriver:')) {
    const action = PRIORITY_ACTIONS[currentEngine][currentStatus];
    
    // Add managerialImplication mapped to justification, and priorityAction
    // The current line looks like: { primaryDriver: '...', executiveNarrative: '...', justification: '...' }
    
    // Find justification: '...'
    const match = line.match(/justification:\s*('.*?')\s*\}/);
    if (match) {
      const justificationStr = match[1];
      const newLine = line.replace(
        /justification:\s*('.*?')\s*\}/,
        `managerialImplication: ${justificationStr}, priorityAction: '${action}' }`
      );
      lines[i] = newLine;
    }
  }
}

fs.writeFileSync('src/core/runtime/executive-consolidation/ExecutiveNarrativeVariations.ts', lines.join('\n'));
