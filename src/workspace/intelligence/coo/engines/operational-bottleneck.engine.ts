export interface BottleneckIndicator {
  nodeId: string;
  nodeName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  queueSize: number;
  averageDelay: number; // in hours or days
  impactValue: number; // estimated financial impact
}

export class OperationalBottleneckEngine {
  public async computeBottlenecks(rawData: any): Promise<BottleneckIndicator[]> {
    return rawData.bottlenecks || [
      {
        nodeId: 'process-3a',
        nodeName: 'Gargalo de Aprovação Técnica',
        severity: 'high',
        queueSize: 45,
        averageDelay: 72, // hours
        impactValue: 45000
      }
    ];
  }
}
