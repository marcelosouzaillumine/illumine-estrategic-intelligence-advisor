import { CausalRelationship } from './types';

export class InstitutionalCausalGraph {
  private edges: CausalRelationship[] = [];

  public addRelationship(rel: CausalRelationship) {
    this.edges.push(rel);
  }

  public getGraph() {
    return this.edges;
  }
}
