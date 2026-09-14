import { EngineDefinition } from './types';

export class EngineRegistry {
  private static engines: Map<string, EngineDefinition> = new Map();

  static register(engine: EngineDefinition) {
    if (this.engines.has(engine.name)) {
      console.warn(`[EngineRegistry] Engine ${engine.name} já registrada. Sobrescrevendo.`);
    }
    this.engines.set(engine.name, engine);
  }

  static getEngine(name: string): EngineDefinition | undefined {
    return this.engines.get(name);
  }

  static getAllEnginesOrdered(): EngineDefinition[] {
    return Array.from(this.engines.values()).sort((a, b) => a.priority - b.priority);
  }

  static getMissingDependencies(engine: EngineDefinition, executedEngines: string[]): string[] {
    return engine.dependencies.filter(dep => !executedEngines.includes(dep));
  }
}
