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
  docId?: string;
  ordem?: number;
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

  // Custom advanced extractors for Patrimonial Indicators
  obrigacoesOperacionais: number | null;
  realizavelLongoPrazo: number | null;
  ativoPermanente: number | null;

  // Hardening validations
  hasOrphans: boolean;
  hasDuplicates: boolean;
  orphanAccounts?: string[];
  duplicateAccounts?: string[];
}

import { StructuralRootNormalizer } from '../../../core/runtime/integrity/StructuralRootNormalizer';

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
    const rawCategory = (r.category || r.conta || r.accountName || '').trim();
    const cleanCat = rawCategory.replace(/^[0-9.]+\s*[-]*\s*/, '').replace(/^[()=/\-+.\s]+|[()=/\-+.\s]+$/g, '').trim().toLowerCase();
    let typeStr = (r.type || r.tipo || '').toLowerCase();
    if (!typeStr) {
      const code = String(r.code || '');
      const cat = cleanCat;
      if (code.startsWith('1') || cat.includes('ativo') || cat === 'caixa' || cat.includes('estoque') || cat.includes('clientes') || cat.includes('banco') || cat.includes('duplicatas')) {
        typeStr = 'ativo';
      } else if (code.startsWith('2') || cat.includes('passivo') || cat.includes('fornecedor') || cat.includes('empréstimo') || cat.includes('financiamento')) {
        typeStr = 'passivo';
      } else if (code.startsWith('3') || cat.includes('patrimônio') || cat.includes('pl ') || cat === 'pl' || cat.includes('capital social') || cat.includes('lucro') || cat.includes('prejuízo')) {
        typeStr = 'patrimônio líquido';
      }
    }
    
    let inferredLevel = r.level;
    if (!inferredLevel) {
      const codeMatch = rawCategory.match(/^([0-9]+(?:\.[0-9]+)*)/);
      if (codeMatch) {
        inferredLevel = codeMatch[1].split('.').length;
      } else {
        inferredLevel = 1;
      }
    }

    let rawVal = r.value ?? r.val ?? r.valor ?? 0;
    if (typeof rawVal === 'string') {
      // Remove all non-numeric characters except for comma and period
      let cleanStr = rawVal.replace(/[^\d.,-]/g, '');
      // If there are both commas and periods, assume Brazilian format if comma is last separator
      if (cleanStr.includes(',') && cleanStr.includes('.')) {
        if (cleanStr.lastIndexOf(',') > cleanStr.lastIndexOf('.')) {
          cleanStr = cleanStr.replace(/\./g, '').replace(',', '.');
        } else {
          cleanStr = cleanStr.replace(/,/g, '');
        }
      } else if (cleanStr.includes(',')) {
        cleanStr = cleanStr.replace(',', '.');
      }
      rawVal = parseFloat(cleanStr) || 0;
    } else {
      rawVal = Number(rawVal) || 0;
    }
    let nodeValue = rawVal;
    
    if ((rawCategory.includes('(-)') || rawCategory.includes('( - )') || rawCategory.includes('(-) ')) && nodeValue > 0) {
      nodeValue = -nodeValue;
    }
    
    return {
      id: r.id ? `${r.id}_idx${i}` : `node_${i}`,
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
      isDuplicate: false,
      docId: r.docId,
      ordem: r.ordem || 0
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

    // To prevent double counting between parent and children (Safeguard 2):
    // If a node is synthetic (has children) and any of its descendants is also matched in foundNodes,
    // we discard the parent node in favor of the children.
    const nodesToSum = foundNodes.filter(n => {
      if (n.isSynthetic && n.children.length > 0) {
        const hasMatchedDescendant = foundNodes.some(other => {
          if (other.id === n.id) return false;
          let current = other.parentId;
          const visited = new Set<string>();
          while (current) {
            if (current === n.id) return true;
            if (visited.has(current)) break; // Prevent circular references
            visited.add(current);
            const parentNode = flatNodes.find(p => p.id === current);
            if (!parentNode) break;
            current = parentNode.parentId;
          }
          return false;
        });
        if (hasMatchedDescendant) return false;
      }
      return true;
    });

    return nodesToSum.reduce((sum, n) => sum + (n.isSynthetic && n.children.length > 0 ? n.computedValue : n.value), 0);
  }

  // Sums
  let ativoCirculante = extractGroupSum(['ativo circulante', 'circulante', 'curto prazo'], 'ativo', ['não', 'nao', 'longo']);
  let ativoNaoCirculante = extractGroupSum(['ativo não circulante', 'não circulante', 'longo prazo'], 'ativo');
  let ativoTotal = extractGroupSum(['ativo total', 'total do ativo'], 'ativo');
  
  if (!ativoTotal) {
    if (ativoCirculante !== 0 || ativoNaoCirculante !== 0) {
      ativoTotal = ativoCirculante + ativoNaoCirculante;
    } else {
      ativoTotal = flatNodes.filter(n => 
        (n.type.includes('ativo') || n.type.includes('pendente') || !n.type) && 
        !n.cleanCategory.includes('passivo') && 
        !n.cleanCategory.includes('patrimônio') &&
        !n.parentId // Only top level
      ).reduce((s, n) => s + (n.isSynthetic ? n.computedValue : n.value), 0);
    }
  }
  if (ativoTotal === 0) {
    ativoTotal = flatNodes.filter(n => n.type.includes('ativo') && !n.parentId).reduce((s, n) => s + (n.isSynthetic ? n.computedValue : n.value), 0);
  }

  if (!ativoCirculante) {
    ativoCirculante = flatNodes.filter(n => !n.isSynthetic && (
      n.cleanCategory.includes('caixa') || n.cleanCategory.includes('banco') || 
      n.cleanCategory.includes('aplicação') || n.cleanCategory.includes('cliente') || 
      n.cleanCategory.includes('estoque') || n.cleanCategory.includes('imposto a recuperar') ||
      n.cleanCategory.includes('duplicata') || n.cleanCategory.includes('adiantamento')
    )).reduce((s, n) => s + n.value, 0);
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
      passivoTotal = flatNodes.filter(n => 
        (n.type.includes('passivo') || n.type.includes('pendente') || !n.type) && 
        !n.cleanCategory.includes('patrimônio') && 
        !n.cleanCategory.includes('pl ') && 
        !n.cleanCategory.includes('ativo') &&
        !n.parentId // Only top level
      ).reduce((s, n) => s + (n.isSynthetic ? n.computedValue : n.value), 0);
    }
  }
  if (passivoTotal === 0) {
    passivoTotal = flatNodes.filter(n => n.type.includes('passivo') && !n.parentId).reduce((s, n) => s + (n.isSynthetic ? n.computedValue : n.value), 0);
  }

  if (!passivoCirculante) {
    passivoCirculante = flatNodes.filter(n => !n.isSynthetic && (
      n.cleanCategory.includes('fornecedor') || n.cleanCategory.includes('imposto') || 
      n.cleanCategory.includes('salário') || n.cleanCategory.includes('encargo') || 
      n.cleanCategory.includes('obrigação') || n.cleanCategory.includes('curto prazo') ||
      n.cleanCategory.includes('pagar')
    )).reduce((s, n) => s + n.value, 0);
  }

  if (!passivoCirculante && !passivoNaoCirculante && passivoTotal > 0) {
     passivoCirculante = passivoTotal;
  }
  
  let patrimonioLiquido = extractGroupSum(['patrimônio líquido', 'pl', 'total do patrimônio líquido', 'patrimônio'], 'patrimônio');
  if (!patrimonioLiquido) {
    patrimonioLiquido = flatNodes.filter(n => 
      (n.type === 'patrimônio líquido' || n.type === 'pl') && 
      !n.parentId // Only top level
    ).reduce((s, n) => s + (n.isSynthetic ? n.computedValue : n.value), 0);
  }
  if (patrimonioLiquido === 0) {
    patrimonioLiquido = flatNodes.filter(n => (n.type === 'patrimônio líquido' || n.type === 'pl') && !n.parentId).reduce((s, n) => s + (n.isSynthetic ? n.computedValue : n.value), 0);
  }

  // Validação Estrutural Rigorosa (Tolerância zero ao invés de 1.0, aceitando apenas erro de ponto flutuante)
  const totalObrigacoes = passivoTotal + patrimonioLiquido;
  const divergence = Math.abs(ativoTotal - totalObrigacoes);
  const isBalanced = divergence <= 0.01; // Tolerância máxima para flutuação de JS (cents)

  // Critical accounts
  const clientes = extractGroupSum(['clientes', 'duplicatas a receber', 'contas a receber', 'recebíveis'], 'ativo');
  const estoques = extractGroupSum(['estoques', 'estoque', 'inventário', 'mercadorias', 'produtos acabados'], 'ativo');
  const fornecedores = extractGroupSum(['fornecedores', 'fornecedor', 'contas a pagar'], 'passivo');
  const passivosFinanceiros = extractGroupSum(['empréstimo', 'emprestimo', 'financiamento', 'dívida', 'divida', 'debênture', 'debenture', 'empréstimos', 'financiamentos', 'dívidas', 'debêntures'], 'passivo');
  const capitalSocial = extractGroupSum(['capital social', 'capital subscrito', 'capital integralizado']);
  
  let lucrosPrejuizos = 0;
  flatNodes.filter(n => n.type.includes('patrim')).forEach(n => {
    if (n.cleanCategory.includes('prejuízo') && n.computedValue > 0) lucrosPrejuizos += n.computedValue;
    else if ((n.cleanCategory.includes('lucro') || n.cleanCategory.includes('prejuízo')) && n.computedValue < 0) lucrosPrejuizos += Math.abs(n.computedValue);
  });

  const creditosSocios = extractGroupSum(['mútuo', 'sócios', 'partes relacionadas', 'adiantamento a sócios'], 'ativo');

  // Advanced Extractors with Fail Closed logic
  const obrigacoesOperacionaisRaw = extractGroupSum([
    'fornecedores', 'fornecedor',
    'salários', 'salario', 'encargos',
    'trabalhistas',
    'sociais',
    'fiscais', 'impostos a recolher', 'tributos a recolher',
    'adiantamento de clientes',
    'contas a pagar'
  ], 'passivo', [
    'empréstimo', 'emprestimo', 'financiamento',
    'parcelamento',
    'mútuo', 'mutuo', 'sócios', 'socios',
    'dividendos', 'jcp',
    'judicial', 'judiciais'
  ]);
  const obrigacoesOperacionais = obrigacoesOperacionaisRaw > 0 ? obrigacoesOperacionaisRaw : null;

  const realizavelLongoPrazoRaw = extractGroupSum([
    'realizável a longo prazo', 'realizavel a longo prazo',
    'contas a receber de longo prazo',
    'partes relacionadas',
    'depósitos judiciais', 'depositos judiciais',
    'ativos fiscais diferidos', 'impostos diferidos'
  ], 'ativo');
  const realizavelLongoPrazo = realizavelLongoPrazoRaw > 0 ? realizavelLongoPrazoRaw : null;

  const ativoPermanenteRaw = extractGroupSum([
    'imobilizado',
    'intangível', 'intangivel',
    'investimentos'
  ], 'ativo', [
    'realizável', 'realizavel', 'fiscal', 'fiscais', 'depósito', 'deposito', 'contas a receber'
  ]);
  const ativoPermanente = ativoPermanenteRaw > 0 ? ativoPermanenteRaw : null;

  // Função rigorosa fiduciária para Disponível Total (Caixa e Equivalentes)
  const disponivelKeywords = [
    'disponivel',
    'disponíveis',
    'disponiveis',
    'caixa',
    'banco',
    'bancos',
    'depósitos bancários à vista',
    'depósito bancário à vista',
    'depositos bancarios a vista',
    'deposito bancario a vista',
    'aplicações de liquidez imediata',
    'aplicacao de liquidez imediata',
    'aplicações de liquidez imediata',
    'aplicação de liquidez imediata',
    'aplicacoes de liquidez imediata',
    'numerário',
    'numerario',
    'equivalentes de caixa',
    'equivalente de caixa',
    'alta conversibilidade',
    'resgate imediato'
  ];

  const excludeDisponivel = ['restrito', 'vinculado'];

  const altaConversibilidade = extractGroupSum(disponivelKeywords, 'ativo', excludeDisponivel);
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
    obrigacoesOperacionais,
    realizavelLongoPrazo,
    ativoPermanente,
    hasOrphans,
    hasDuplicates,
    orphanAccounts,
    duplicateAccounts
  };

  // --- NORMALIZAÇÃO DA RAIZ ---
  // Corrige os root nodes ("Ativo", "Passivo") que venham zerados mesmo com filhos populados
  StructuralRootNormalizer.normalizeRootNodes(flatNodes);

  return { nodes: rootNodes, flatNodes, summary };
}
