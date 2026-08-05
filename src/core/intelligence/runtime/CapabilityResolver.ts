export interface CapabilityAdapter {
  id: string;
  type: string;
  version: string;
  adapt(rawInput: any): Promise<any>;
}

export class CapabilityResolver {
  private adapters: Map<string, CapabilityAdapter> = new Map();

  public register(adapter: CapabilityAdapter): void {
    this.adapters.set(adapter.id, adapter);
  }

  public resolve(capabilityId: string): CapabilityAdapter {
    const adapter = this.adapters.get(capabilityId);
    if (!adapter) {
      throw new Error(`No CapabilityAdapter found for capabilityId: ${capabilityId}`);
    }
    return adapter;
  }
}
