import { PageManifest } from '../../runtime/src/engine/manifest-loader';

export class ManifestGenerator {
  public static generateManifest(pageId: string, type: 'EAA' | 'EFA'): PageManifest {
    return {
      id: pageId,
      type,
      layout: {
        template: type === 'EAA' ? 'ExecutiveDashboard' : 'MasterDetail'
      },
      widgets: ['KPI_CARD', 'EXECUTIVE_CHART', 'DATA_TABLE']
    };
  }
}
