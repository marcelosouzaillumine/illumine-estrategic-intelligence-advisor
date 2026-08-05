export interface AcceptanceSignatory {
  name: string;
  email: string;
  ipAddress: string;
  role: string;
  validatedVia: 'OTP' | 'SESSION' | 'BIOMETRICS';
}

export interface AcceptanceCertificate {
  id: string;
  decisionRequestId: string;
  cryptographicHash: string;
  signatory: AcceptanceSignatory;
  timestamp: string;
  blockchainRef?: string; // Prepared for future immutable ledger
}
