// src/core/runtime/causal-intelligence/SurvivabilityDependencyGraph.ts

import { CausalGraph, CausalNode, CausalEdge, CausalFactor } from './types';

export class SurvivabilityDependencyGraph {
  public static build(
    factors: CausalFactor[],
    fco: number,
    isDfcAvailable: boolean
  ): CausalGraph {
    const nodes: CausalNode[] = [];
    const edges: CausalEdge[] = [];

    // Helper to add nodes without duplicates
    const addNode = (id: string, label: string, type: 'SYMPTOM' | 'ROOT_CAUSE' | 'INTERMEDIARY_PRESSURE', severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL') => {
      if (!nodes.some(n => n.id === id)) {
        nodes.push({ id, label, type, severity });
      }
    };

    // Helper to add edges without duplicates
    const addEdge = (source: string, target: string, description: string) => {
      if (!edges.some(e => e.source === source && e.target === target)) {
        edges.push({ source, target, description });
      }
    };

    // 1. Fallback for blocked / missing DFC analysis
    if (!isDfcAvailable) {
      addNode('DFC_MISSING', 'DFC Ausente / Inconciliável', 'SYMPTOM', 'CRITICAL');
      addNode('RESTRICTED_ANALYSIS', 'Análise Causal Restrita', 'INTERMEDIARY_PRESSURE', 'HIGH');
      addEdge('DFC_MISSING', 'RESTRICTED_ANALYSIS', 'Restringe fiduciariedade');
      return { nodes, edges };
    }

    // 2. Base Symptoms
    if (fco < 0) {
      addNode('FCO_DEFICIT', 'FCO Negativo (Queima de Caixa)', 'SYMPTOM', 'CRITICAL');
    } else {
      addNode('FCO_LOW', 'FCO Frágil / Baixo', 'SYMPTOM', 'MODERATE');
    }

    addNode('CASH_DRAIN', 'Pressão na Liquidez Corporativa', 'SYMPTOM', fco < 0 ? 'HIGH' : 'LOW');

    // 3. Populate based on detected root causes
    factors.forEach(factor => {
      const severity = factor.severity;
      
      if (factor.type === 'MARGIN_COMPRESSION' || factor.type === 'PRICE_COST_MISMATCH') {
        addNode(factor.type, factor.label, 'ROOT_CAUSE', severity);
        addNode('EBITDA_COMPRESSION', 'Compressão do EBITDA', 'INTERMEDIARY_PRESSURE', 'HIGH');
        addEdge(factor.type, 'EBITDA_COMPRESSION', 'Reduz margem operacional');
        addEdge('EBITDA_COMPRESSION', fco < 0 ? 'FCO_DEFICIT' : 'FCO_LOW', 'Gera déficit primário');
      }

      if (factor.type === 'EXCESS_INVENTORY' || factor.type === 'CUSTOMER_CREDIT_EXPANSION') {
        addNode(factor.type, factor.label, 'ROOT_CAUSE', severity);
        addNode('WORKING_CAPITAL_LOCK', 'Bloqueio de Capital de Giro', 'INTERMEDIARY_PRESSURE', 'HIGH');
        addEdge(factor.type, 'WORKING_CAPITAL_LOCK', 'Retém recursos circulantes');
        addEdge('WORKING_CAPITAL_LOCK', fco < 0 ? 'FCO_DEFICIT' : 'FCO_LOW', 'Drena fluxo operacional');
      }

      if (factor.type === 'DEBT_SERVICE_BURDEN' || factor.type === 'SHORT_TERM_DEBT_REFINANCING_PRESSURE') {
        addNode(factor.type, factor.label, 'ROOT_CAUSE', severity);
        addNode('FINANCIAL_STRESS', 'Sobrecarga de Passivo Financeiro', 'INTERMEDIARY_PRESSURE', 'HIGH');
        addEdge(factor.type, 'FINANCIAL_STRESS', 'Consome geração de caixa');
        addEdge('FINANCIAL_STRESS', 'CASH_DRAIN', 'Acelera dreno de liquidez');
      }

      if (factor.type === 'CASH_DRAIN_BY_DISTRIBUTIONS') {
        addNode(factor.type, factor.label, 'ROOT_CAUSE', severity);
        addEdge(factor.type, 'CASH_DRAIN', 'Saída de recursos livres');
      }
    });

    // Connect symptoms to main Cash Drain node
    if (nodes.some(n => n.id === 'FCO_DEFICIT')) {
      addEdge('FCO_DEFICIT', 'CASH_DRAIN', 'Compromete preservação');
    }
    if (nodes.some(n => n.id === 'FCO_LOW')) {
      addEdge('FCO_LOW', 'CASH_DRAIN', 'Limita crescimento');
    }

    return { nodes, edges };
  }
}
