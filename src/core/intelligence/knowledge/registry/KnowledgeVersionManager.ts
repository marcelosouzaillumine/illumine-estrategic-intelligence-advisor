import { KnowledgePackManifest } from '../contracts/KnowledgePackManifest';

export class KnowledgeVersionManager {
  /**
   * Compares the pack's required ontology version against the system's active ontology version.
   * Simplistic string match or minor semver check for now.
   */
  isOntologyCompatible(packRequiredVersion: string, activeOntologyVersion: string): boolean {
    // In a real app, this would use the `semver` library to check >= required.
    // For our foundation, exact match or string locale compare is enough.
    return activeOntologyVersion.localeCompare(packRequiredVersion, undefined, { numeric: true }) >= 0;
  }

  canUpgrade(currentManifest: KnowledgePackManifest, newManifest: KnowledgePackManifest): boolean {
    return newManifest.version.localeCompare(currentManifest.version, undefined, { numeric: true }) > 0;
  }
}
