export interface PageManifest {
  id: string;
  type: 'EAA' | 'EFA';
  layout: {
    template: 'ExecutiveDashboard' | 'MasterDetail' | 'Settings';
  };
  widgets: string[];
}

export class ManifestLoader {
  public static parseManifest(yamlOrJsonObject: Record<string, any>): PageManifest {
    return {
      id: yamlOrJsonObject.id || 'default.page',
      type: yamlOrJsonObject.type || 'EAA',
      layout: {
        template: yamlOrJsonObject.layout?.template || 'ExecutiveDashboard'
      },
      widgets: yamlOrJsonObject.widgets || ['KPI_CARD', 'EXECUTIVE_CHART']
    };
  }
}
