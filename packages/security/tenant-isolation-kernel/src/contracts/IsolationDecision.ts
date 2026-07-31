export interface IsolationDecision {
  allowed: boolean;
  reason?: string;
  boundaryHash?: string;
  timestamp: Date;
}
