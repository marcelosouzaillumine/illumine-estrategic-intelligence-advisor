import { v4 as uuidv4 } from 'uuid';
import { RuntimeLineageNode } from './observability-types';

export class ExecutionLineageTracker {
  private nodes: RuntimeLineageNode[] = [];
  private currentStack: RuntimeLineageNode[] = [];
  private readonly MAX_CAUSAL_DEPTH = 7;

  public startNode(engineName: string, inputs: string[]) {

    const node: RuntimeLineageNode = {
      nodeId: `node-${uuidv4()}`,
      engineName,
      inputs,
      output: '',
      timestamp: new Date().toISOString(),
      durationMs: Date.now(), // temporarily hold start time
      children: []
    };

    if (this.currentStack.length > 0) {
      const parent = this.currentStack[this.currentStack.length - 1];
      if (!parent.children) parent.children = [];
      parent.children.push(node);
    } else {
      this.nodes.push(node);
    }
    
    this.currentStack.push(node);
  }

  public endNode(outputSummary: string) {
    if (this.currentStack.length === 0) return;
    const node = this.currentStack.pop()!;
    node.output = outputSummary;
    node.durationMs = Date.now() - node.durationMs; // calculate actual duration
  }

  public getNodes(): RuntimeLineageNode[] {
    return this.nodes;
  }
}
