import { DiagnosticDomain } from '../diagnostics/core/diagnostic-types';

export interface DomainEdge {
  target: DiagnosticDomain;
  weight: number;
  reason: string;
}

export class ExecutiveDomainGraph {
  private static instance: ExecutiveDomainGraph;
  private adjacencyList: Map<DiagnosticDomain, DomainEdge[]> = new Map();

  private constructor() {
    this.buildGraph();
  }

  public static getInstance(): ExecutiveDomainGraph {
    if (!ExecutiveDomainGraph.instance) {
      ExecutiveDomainGraph.instance = new ExecutiveDomainGraph();
    }
    return ExecutiveDomainGraph.instance;
  }

  public addEdge(source: DiagnosticDomain, target: DiagnosticDomain, weight: number, reason: string) {
    if (!this.adjacencyList.has(source)) {
      this.adjacencyList.set(source, []);
    }
    this.adjacencyList.get(source)!.push({ target, weight, reason });
  }

  public removeEdge(source: DiagnosticDomain, target: DiagnosticDomain) {
    if (this.adjacencyList.has(source)) {
      const edges = this.adjacencyList.get(source)!;
      this.adjacencyList.set(source, edges.filter(e => e.target !== target));
    }
  }

  private buildGraph() {
    // Financial directly influences Governance, Operational, and Risk
    this.addEdge('financial', 'governance', 0.9, 'A previsibilidade financeira exige governança forte para sustentar decisões.');
    this.addEdge('financial', 'operational', 0.8, 'Com disciplina financeira, o foco muda para eficiência e escala operacional.');
    this.addEdge('financial', 'risk', 0.7, 'A base financeira sólida expõe a necessidade de mitigar riscos institucionais.');

    // Governance directly influences People (Leadership), Compliance (Institutional), Risk
    this.addEdge('governance', 'people', 0.9, 'A governança exige descentralização e liderança forte para funcionar.');
    this.addEdge('governance', 'institutional', 0.8, 'Regras de governança demandam estruturas institucionais e compliance.');
    this.addEdge('governance', 'risk', 0.8, 'Governança é o primeiro pilar para uma gestão de riscos eficaz.');

    // Operational directly influences Commercial, Innovation, Digital
    this.addEdge('operational', 'commercial', 0.9, 'A escala operacional desbloqueia o potencial de agressividade comercial.');
    this.addEdge('operational', 'innovation', 0.7, 'Operação estabilizada permite focar em novos produtos e inovações.');
    this.addEdge('operational', 'digital', 0.8, 'A digitalização amplifica a eficiência operacional.');

    // Commercial directly influences Customer, Marketing (indirectly mapped)
    this.addEdge('commercial', 'customer', 0.9, 'A expansão comercial requer foco em retenção e sucesso do cliente.');
    this.addEdge('commercial', 'innovation', 0.6, 'Feedback comercial retroalimenta o funil de inovação.');

    // E assim por diante, compondo uma teia.
  }

  public getAdjacent(domain: DiagnosticDomain): DomainEdge[] {
    return this.adjacencyList.get(domain) || [];
  }

  public suggestNext(completedDomains: DiagnosticDomain[]): DomainEdge | null {
    let bestEdge: DomainEdge | null = null;

    for (const completed of completedDomains) {
      const edges = this.getAdjacent(completed);
      for (const edge of edges) {
        if (!completedDomains.includes(edge.target)) {
          if (!bestEdge || edge.weight > bestEdge.weight) {
            bestEdge = edge;
          }
        }
      }
    }

    return bestEdge;
  }
}
