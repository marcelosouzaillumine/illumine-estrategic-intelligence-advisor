export interface SchemaDefinition {
  name: string;
  version: string;
  fields: string[];
  deprecated: boolean;
}

export class SchemaRegistry {
  private static schemas: Map<string, SchemaDefinition> = new Map();

  static register(schema: SchemaDefinition) {
    this.schemas.set(`${schema.name}_${schema.version}`, schema);
  }

  static get(name: string, version: string): SchemaDefinition | undefined {
    return this.schemas.get(`${name}_${version}`);
  }
}

// Initial registrations
SchemaRegistry.register({
  name: 'ExecutiveSnapshot',
  version: 'v1',
  fields: ['id', 'tenantId', 'periodId', 'performance', 'cashIntelligence', 'planning'],
  deprecated: false,
});

SchemaRegistry.register({
  name: 'ExecutiveSnapshot',
  version: 'v2',
  fields: ['id', 'tenantId', 'periodId', 'performance', 'cashIntelligence', 'planning', 'scenario'],
  deprecated: false,
});
