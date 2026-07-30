export interface RawDataIsolationContract {
  readonly landingZoneId: string;
  readonly connectorId: string;
  readonly rawPayloadHash: string;
  readonly rawPayloadSizeBytes: number;
  readonly ingestedAt: string;
  readonly isProcessed: boolean;
}
