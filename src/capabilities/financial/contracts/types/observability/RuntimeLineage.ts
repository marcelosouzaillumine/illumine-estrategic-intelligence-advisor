export interface RuntimeLineage {
  lineageId: string;
  sourceType: "USER_INPUT" | "SYSTEM_GENERATED" | "EXTERNAL_INTEGRATION";
  sourceId: string;
  timestamp: string;
}
