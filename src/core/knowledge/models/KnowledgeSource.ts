export interface KnowledgeSource {
  id: string;
  type: "chat" | "crm" | "erp" | "financial_system" | "advisor_input" | "document";
  provider: string; // e.g., 'Salesforce', 'SAP', 'Illumine Chat'
  trustLevel: number; // 0 to 100, where ERP/Financials might be 100, and unverified chat might be 60
  createdAt: Date;
}
