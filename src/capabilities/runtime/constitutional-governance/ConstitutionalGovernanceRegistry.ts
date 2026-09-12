import { ConstitutionalProtocol } from './ConstitutionalProtocolDefinition';

export class ConstitutionalGovernanceRegistry {
  private static protocols: Map<string, ConstitutionalProtocol> = new Map();

  public static registerProtocol(protocol: ConstitutionalProtocol): void {
    this.protocols.set(protocol.protocolId, protocol);
  }

  public static getProtocol(protocolId: string): ConstitutionalProtocol | undefined {
    return this.protocols.get(protocolId);
  }

  public static getAllProtocols(): ConstitutionalProtocol[] {
    return Array.from(this.protocols.values());
  }

  public static clearRegistry(): void {
    this.protocols.clear();
  }
}
