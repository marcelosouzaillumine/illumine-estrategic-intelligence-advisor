export interface ExplainabilityMetadata {
  origin: string; // 'manual' | 'import_pdf' | 'import_excel' | 'api'
  transformation: string; // ex: 'raw' | 'calculated' | 'de-para'
  dePara: string | null;
  timestamp: string;
  version: number;
  engine: string;
}

export interface BPNode {
  id: string;
  category: string;
  cleanCategory: string; // sem código numérico
  value: number;
  computedValue: number;
  type: string; // 'ativo' | 'passivo' | 'patrimônio líquido'
  level: number;
  parentId: string | null;
  isSynthetic: boolean;
  children: BPNode[];
  domain: string;
  classification: string;
  explainability?: ExplainabilityMetadata;
  isOrphan?: boolean;
  isDuplicate?: boolean;
}

export interface BPSummary {
  ativoTotal: number;
  ativoCirculante: number;
  ativoNaoCirculante: number;
  passivoTotal: number;
  passivoCirculante: number;
  passivoNaoCirculante: number;
  patrimonioLiquido: number;
  isBalanced: boolean;
  divergence: number;
  
  // Specific critical accounts
  caixaEquivalentes: number;
  estoques: number;
  clientes: number;
  fornecedores: number;
  passivosFinanceiros: number; // dívida
  capitalSocial: number;
  lucrosPrejuizos: number; // para medir erosão
  
  // Custom liquidity buckets
  altaConversibilidade: number;
  mediaConversibilidade: number;
  baixaConversibilidade: number;
  restritaConversibilidade: number;
  
  // Mútuos/Partes relacionadas
  creditosSocios: number;

  // Hardening validations
  hasOrphans: boolean;
  hasDuplicates: boolean;
  orphanAccounts?: string[];
  duplicateAccounts?: string[];
}

/**
 * Constrói a árvore hierárquica e consolida os valores bottom-up rigorosamente.
 */
export function buildBPHierarchy(rows: any[]): { nodes: BPNode[], flatNodes: BPNode[], summary: BPSummary } {
  const seenCategories = new Set<string>();
  const orphanAccounts: string[] = [];
  const duplicateAccounts: string[] = [];
  let hasDuplicates = false;
  let hasOrphans = false;

  const flatNodes: BPNode[] = rows.map((r, i) => {
    const rawCategory = (r.category || r.conta || '').trim();
    const cleanCat = rawCategory.replace(/^[0-9.]+\s*[-]*\s*/, '').replace(/^[()=/\-+.\s]+|[()=/\-+.\s]+$/g, '').trim().toLowerCase();
    const typeStr = (r.type || r.tipo || '').toLowerCase();
    
    let inferredLevel = r.level;
    if (!inferredLevel) {
      const codeMatch = rawCategory.match(/^([0-9]+(?:\.[0-9]+)*)/);
      if (codeMatch) {
        inferredLevel = codeMatch[1].split('.').length;
      } else {
        inferredLevel = 1;
      }
    }

    let nodeValue = r.value ?? r.val ?? r.valor ?? 0;
    if ((rawCategory.includes('(-)') || rawCategory.includes('( - )') || rawCategory.includes('(-) ')) && nodeValue > 0) {
      nodeValue = -nodeValue;
    }
    
    return {
      id: r.id || `node_${i}`,
      category: rawCategory,
      cleanCategory: cleanCat,
      value: nodeValue,
      computedValue: 0,
      type: typeStr,
      level: inferredLevel,
      parentId: null,
      isSynthetic: false,
      children: [],
      domain: 'financial',
      classification: typeStr,
      explainability: r.explainability,
      isOrphan: false,
      isDuplicate: false
    };
  });

  // Reconstruir Parent IDs assumindo a ordem das linhas e níveis rigorosamente
  const levelStack: BPNode[] = [];
  
  for (const node of flatNodes) {
    // Removemos do topo da pilha os itens com nível maior ou igual ao nível atual
    while (levelStack.length > 0 && levelStack[levelStack.length - 1].level >= node.level) {
      levelStack.pop();
    }
    
    if (levelStack.length > 0) {
      const parent = levelStack[levelStack.length - 1];
      node.parentId = parent.id;
      parent.isSynthetic = true;
      parent.children.push(node);
      
      // HERANÇA DE TIPO: Se não tem tipo ou tipo inválido, herda do pai.
      if (!node.type || !['ativo', 'passivo', 'patrimônio líquido', 'pl'].includes(node.type)) {
        node.type = parent.type;
        node.classification = parent.type;
      }
    }
    
    levelStack.push(node);
  }

  // Agora checamos duplicates e orphans após a herança estrutural
  for (const node of flatNodes) {
    const duplicateKey = `${node.type}_${node.cleanCategory}`;
    if (seenCategories.has(duplicateKey)) {
      hasDuplicates = true;
      duplicateAccounts.push(node.category);
      node.isDuplicate = true;
    }
    seenCategories.add(duplicateKey);

    const validTypes = ['ativo', 'passivo', 'patrimônio líquido', 'pl'];
    if (!validTypes.includes(node.type)) {
      hasOrphans = true;
      orphanAccounts.push(node.category);
      node.isOrphan = true;
      node.domain = 'unclassified';
      node.classification = 'orphan';
    }
  }

  // Identifica raízes (nível 1 que não têm parent)
  const rootNodes = flatNodes.filter(n => !n.parentId);

  // Consolidação Bottom-up recursiva garantindo pai = soma filhos
  function calculateBottomUp(node: BPNode): number {
    if (!node.isSynthetic) {
      node.computedValue = node.value;
      return node.value;
    }
    
    let sum = 0;
    for (const child of node.children) {
      sum += calculateBottomUp(child);
    }
    // Only overwrite computedValue if there are actual children. Otherwise keep value.
    node.computedValue = sum !== 0 ? sum : node.value;
    return node.computedValue;
  }

  rootNodes.forEach(root => calculateBottomUp(root));

  // Extrator robusto de contas usando o node já com o sumário correto
  function extractGroupSum(matches: string[], nodeType?: string, exclude?: string[]): number {
    const foundNodes = flatNodes.filter(n => 
      (!nodeType || n.type.includes(nodeType)) && 
      matches.some(m => n.cleanCategory === m || n.cleanCategory.includes(m)) &&
      (!exclude || !exclude.some(ex => n.cleanCategory.includes(ex)))
    );
    
    if (foundNodes.length === 0) return 0;

    // Filter top level nodes among the found ones to prevent double counting
    const topLevelNodes = foundNodes.filter(n => {
      let current = n.parentId;
      while (current) {
        if (foundNodes.some(fn => fn.id === current)) return false;
        const parentNode = flatNodes.find(p => p.id === current);
        if (!parentNode) break;
        current = parentNode.parentId;
      }
      return true;
    });

    return topLevelNodes.reduce((sum, n) => sum + (n.isSynthetic && n.children.length > 0 ? n.computedValue : n.value), 0);
  }

  // Sums
  let ativoCirculante = extractGroupSum(['ativo circulante', 'circulante', 'curto prazo'], 'ativo', ['não', 'nao', 'longo']);
  let ativoNaoCirculante = extractGroupSum(['ativo não circulante', 'não circulante', 'longo prazo'], 'ativo');
  let ativoTotal = extractGroupSum(['ativo total', 'total do ativo'], 'ativo');
  
  if (!ativoTotal) {
    if (ativoCirculante !== 0 || ativoNaoCirculante !== 0) {
      ativoTotal = ativoCirculante + ativoNaoCirculante;
    } else {
      ativoTotal = flatNodes.filter(n => n.type === 'ativo' && n.level === 1).reduce((s, n) => s + (n.isSynthetic && n.children.length > 0 ? n.computedValue : n.value), 0);
    }
  }

  if (!ativoCirculante && !ativoNaoCirculante && ativoTotal > 0) {
     ativoCirculante = ativoTotal;
  }

  let passivoCirculante = extractGroupSum(['passivo circulante', 'circulante', 'curto prazo'], 'passivo', ['não', 'nao', 'longo']);
  let passivoNaoCirculante = extractGroupSum(['passivo não circulante', 'não circulante', 'longo prazo'], 'passivo');
  let passivoTotal = extractGroupSum(['passivo total', 'total do passivo', 'total exigível'], 'passivo');
  
  if (!passivoTotal) {
    if (passivoCirculante !== 0 || passivoNaoCirculante !== 0) {
      passivoTotal = passivoCirculante + passivoNaoCirculante;
    } else {
      passivoTotal = flatNodes.filter(n => n.type === 'passivo' && n.level === 1 && !n.cleanCategory.includes('patrimônio')).reduce((s, n) => s + (n.isSynthetic && n.children.length > 0 ? n.computedValue : n.value), 0);
    }
  }
  
  let patrimonioLiquido = extractGroupSum(['patrimônio líquido', 'pl', 'total do patrimônio líquido', 'patrimônio'], 'patrimônio');
  if (!patrimonioLiquido) {
    patrimonioLiquido = flatNodes.filter(n => (n.type === 'patrimônio líquido' || n.type === 'pl') && n.level === 1).reduce((s, n) => s + (n.isSynthetic && n.children.length > 0 ? n.computedValue : n.value), 0);
  }

  // Validação Estrutural Rigorosa (Tolerância zero ao invés de 1.0, aceitando apenas erro de ponto flutuante)
  const totalObrigacoes = passivoTotal + patrimonioLiquido;
  const divergence = Math.abs(ativoTotal - totalObrigacoes);
  const isBalanced = divergence <= 0.01; // Tolerância máxima para flutuação de JS (cents)

  // Critical accounts
  const clientes = extractGroupSum(['clientes', 'duplicatas a receber', 'contas a receber', 'recebíveis'], 'ativo');
  const estoques = extractGroupSum(['estoques', 'estoque', 'inventário', 'mercadorias', 'produtos acabados'], 'ativo');
  const fornecedores = extractGroupSum(['fornecedores', 'fornecedor', 'contas a pagar'], 'passivo');
  const passivosFinanceiros = extractGroupSum(['empréstimos', 'financiamentos', 'dívidas', 'debêntures'], 'passivo');
  const capitalSocial = extractGroupSum(['capital social', 'capital subscrito', 'capital integralizado']);
  
  let lucrosPrejuizos = 0;
  flatNodes.filter(n => n.type.includes('patrim')).forEach(n => {
    if (n.cleanCategory.includes('prejuízo') && n.computedValue > 0) lucrosPrejuizos += n.computedValue;
    else if ((n.cleanCategory.includes('lucro') || n.cleanCategory.includes('prejuízo')) && n.computedValue < 0) lucrosPrejuizos += Math.abs(n.computedValue);
  });

  const creditosSocios = extractGroupSum(['mútuo', 'sócios', 'partes relacionadas', 'adiantamento a sócios'], 'ativo');

  // Buckets de Conversibilidade
  const altaConversibilidade = extractGroupSum(['caixa', 'bancos', 'aplicações', 'equivalentes', 'disponibilidade'], 'ativo');
  const mediaConversibilidade = clientes + extractGroupSum(['cheques', 'cartões', 'cartão'], 'ativo');
  const baixaConversibilidade = estoques + extractGroupSum(['tributos a recuperar', 'impostos a recuperar', 'impostos diferidos', 'créditos de liquidação', 'pdd', 'adiantamento'], 'ativo');
  const restritaConversibilidade = extractGroupSum(['imobilizado', 'intangível', 'investimentos', 'realizável a longo prazo'], 'ativo');

  const summary: BPSummary = {
    ativoTotal,
    ativoCirculante,
    ativoNaoCirculante,
    passivoTotal,
    passivoCirculante,
    passivoNaoCirculante,
    patrimonioLiquido,
    isBalanced,
    divergence,
    caixaEquivalentes: altaConversibilidade,
    estoques,
    clientes,
    fornecedores,
    passivosFinanceiros,
    capitalSocial,
    lucrosPrejuizos,
    altaConversibilidade,
    mediaConversibilidade,
    baixaConversibilidade,
    restritaConversibilidade,
    creditosSocios,
    hasOrphans,
    hasDuplicates,
    orphanAccounts,
    duplicateAccounts
  };

  return { nodes: rootNodes, flatNodes, summary };
}
