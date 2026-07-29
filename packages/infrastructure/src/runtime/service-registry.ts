export interface ServiceHealth {
  name: string;
  status: 'HEALTHY' | 'DEGRADED';
  latencyMs: number;
}

export class ServiceRegistry {
  private services = new Map<string, ServiceHealth>();

  public register(name: string): void {
    this.services.set(name, { name, status: 'HEALTHY', latencyMs: 6.5 });
  }

  public checkHealth(name: string): ServiceHealth | undefined {
    return this.services.get(name);
  }
}
