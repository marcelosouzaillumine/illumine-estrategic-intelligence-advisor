import { ExecutiveKnowledge } from '../contracts/ExecutiveKnowledge';
import { KnowledgePackManifest } from '../contracts/KnowledgePackManifest';

export class ExecutiveKnowledgeRegistry {
  private knowledgeItems: Map<string, ExecutiveKnowledge> = new Map();
  private activePacks: Map<string, KnowledgePackManifest> = new Map();

  registerPack(manifest: KnowledgePackManifest): void {
    if (this.activePacks.has(manifest.id)) {
      throw new Error(`Pack ${manifest.id} is already registered.`);
    }
    this.activePacks.set(manifest.id, manifest);
  }

  registerKnowledge(knowledge: ExecutiveKnowledge): void {
    if (this.knowledgeItems.has(knowledge.id)) {
      throw new Error(`Knowledge ${knowledge.id} is already registered.`);
    }
    this.knowledgeItems.set(knowledge.id, knowledge);
  }

  findKnowledge(id: string): ExecutiveKnowledge | undefined {
    return this.knowledgeItems.get(id);
  }

  findByConcept(ontologyConceptId: string): ExecutiveKnowledge[] {
    const results: ExecutiveKnowledge[] = [];
    for (const k of this.knowledgeItems.values()) {
      if (k.ontologyReferences.includes(ontologyConceptId)) {
        results.push(k);
      }
    }
    return results;
  }

  findByDomain(domain: string): ExecutiveKnowledge[] {
    const results: ExecutiveKnowledge[] = [];
    for (const k of this.knowledgeItems.values()) {
      if (k.domain === domain) {
        results.push(k);
      }
    }
    return results;
  }

  search(predicate: (k: ExecutiveKnowledge) => boolean): ExecutiveKnowledge[] {
    const results: ExecutiveKnowledge[] = [];
    for (const k of this.knowledgeItems.values()) {
      if (predicate(k)) {
        results.push(k);
      }
    }
    return results;
  }

  remove(id: string): void {
    this.knowledgeItems.delete(id);
  }
}
