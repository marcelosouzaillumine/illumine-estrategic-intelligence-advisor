import { KnowledgePackManifest } from '../contracts/KnowledgePackManifest';
import { ExecutiveKnowledge } from '../contracts/ExecutiveKnowledge';
import { ExecutiveKnowledgeRegistry } from './ExecutiveKnowledgeRegistry';
import { KnowledgeVersionManager } from './KnowledgeVersionManager';
import { KnowledgeGovernance } from '../governance/KnowledgeGovernance';

export class KnowledgeLoader {
  constructor(
    private registry: ExecutiveKnowledgeRegistry,
    private versionManager: KnowledgeVersionManager,
    private governance: KnowledgeGovernance,
    private activeOntologyVersion: string
  ) {}

  /**
   * Orchestrates the loading of a knowledge pack.
   */
  loadPackage(manifest: KnowledgePackManifest, knowledgeItems: ExecutiveKnowledge[]): void {
    // 1. Validate Ontology Compatibility
    if (!this.versionManager.isOntologyCompatible(manifest.requiredOntology.minimumVersion, this.activeOntologyVersion)) {
      throw new Error(`BLOCKED: Ontology version ${this.activeOntologyVersion} is incompatible with required version ${manifest.requiredOntology.minimumVersion}`);
    }

    // 2. Validate all Knowledge items via Governance
    for (const item of knowledgeItems) {
      const validation = this.governance.validate(item);
      if (!validation.approved) {
        throw new Error(`BLOCKED: Knowledge Governance Validation Failed for ${item.id}. Reasons: ${validation.reasons?.join(', ')}`);
      }
    }

    // 3. Register Pack and Knowledge
    this.registry.registerPack(manifest);
    
    for (const item of knowledgeItems) {
      this.registry.registerKnowledge(item);
    }
  }
}
