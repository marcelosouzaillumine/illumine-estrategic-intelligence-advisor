export interface ArchitectureFinding {
  id: string;
  type: string;
  observationIds: string[];
  threshold?: number;
  actualValue: number;
}
