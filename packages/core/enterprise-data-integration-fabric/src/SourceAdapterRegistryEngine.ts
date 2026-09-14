export interface SourceAdapterInfo {
  readonly adapterId: string;
  readonly name: string;
  readonly category: 'ERP' | 'CRM' | 'BANKING' | 'HR' | 'BI';
  readonly isConnected: boolean;
}

export class SourceAdapterRegistryEngine {
  private static readonly adapters: readonly SourceAdapterInfo[] = [
    { adapterId: 'adapter-sap', name: 'SAP S/4HANA Connector', category: 'ERP', isConnected: true },
    { adapterId: 'adapter-totvs', name: 'TOTVS Protheus Connector', category: 'ERP', isConnected: true },
    { adapterId: 'adapter-salesforce', name: 'Salesforce CRM Connector', category: 'CRM', isConnected: true },
    { adapterId: 'adapter-openfinance', name: 'Open Finance Banking Gateway', category: 'BANKING', isConnected: true }
  ];

  public static getAvailableAdapters(): readonly SourceAdapterInfo[] {
    return this.adapters;
  }
}
