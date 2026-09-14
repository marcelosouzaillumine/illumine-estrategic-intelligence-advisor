/**
 * Referência leve para uma fonte de dados persistida no Data Fabric.
 */
export interface DataSourceReference {
  artifactId: string;
  name: string;
  version: string;
  category: string;
  extractedAt: string;
}
