export interface TimelineEntry {
  readonly entryId: string;
  readonly phase: string;
  readonly description: string;
  readonly financialImpact: string;
  readonly timestamp: string;
}

export class ExecutiveDecisionTimelineEngine {
  public static buildTimeline(companyId: string): readonly TimelineEntry[] {
    return [
      {
        entryId: 'tl-1',
        phase: 'Problema Identificado',
        description: 'Pressão de Liquidez & Elevação de Custos SG&A',
        financialImpact: '- R$ 450.000,00',
        timestamp: new Date(Date.now() - 30 * 86400000).toISOString()
      },
      {
        entryId: 'tl-2',
        phase: 'Recomendação Emitida',
        description: 'Repactuação de Fornecedores via EAIL v1.0',
        financialImpact: 'Preservação de Margem',
        timestamp: new Date(Date.now() - 14 * 86400000).toISOString()
      },
      {
        entryId: 'tl-3',
        phase: 'Ação Executada',
        description: 'Chancela Fiduciária Humana & Disparo de Workflow EWI',
        financialImpact: 'R$ 450.000,00 Recorrente',
        timestamp: new Date().toISOString()
      }
    ];
  }
}
