export interface ValidationResult {
  status: 'PASS' | 'WARNING' | 'FAIL';
  violations: string[];
  payload?: any;
}

export interface ConstitutionalProtocol {
  protocolId: string;
  protocolName: string;
  protocolVersion: string;
  authorityLevel: string;
  validate(context: any): ValidationResult;
}
