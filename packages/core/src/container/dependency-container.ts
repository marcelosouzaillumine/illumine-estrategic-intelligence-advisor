import { PlatformError } from '../errors/platform-error';

export type Lifetime = 'SINGLETON' | 'TRANSIENT';

export interface ServiceDescriptor<T = any> {
  token: string;
  factory: (container: DependencyContainer) => T;
  lifetime: Lifetime;
  instance?: T;
}

export class DependencyContainer {
  private services = new Map<string, ServiceDescriptor>();

  public register<T>(token: string, factory: (container: DependencyContainer) => T, lifetime: Lifetime = 'SINGLETON'): void {
    this.services.set(token, { token, factory, lifetime });
  }

  public resolve<T>(token: string): T {
    const descriptor = this.services.get(token);
    if (!descriptor) {
      throw new PlatformError({
        code: 'ERR_SERVICE_NOT_FOUND',
        message: `Serviço ${token} não foi registrado no DependencyContainer.`,
        category: 'ARCHITECTURE',
        severity: 'MUST',
        timestamp: new Date().toISOString()
      });
    }

    if (descriptor.lifetime === 'SINGLETON') {
      if (!descriptor.instance) {
        descriptor.instance = descriptor.factory(this);
      }
      return descriptor.instance;
    }

    return descriptor.factory(this);
  }

  public clear(): void {
    this.services.clear();
  }
}

export const container = new DependencyContainer();
