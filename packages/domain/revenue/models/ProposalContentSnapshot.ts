export interface ProposalContentSnapshot {
  sections: Array<{
    id: string;
    type: string;
    content: string;
    order: number;
  }>;
  capturedAt: string;
}
