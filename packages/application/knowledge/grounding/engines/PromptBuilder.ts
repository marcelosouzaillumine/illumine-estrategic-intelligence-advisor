import { GroundingPackage } from '@/core/knowledge/grounding/GroundingPackage';

export class PromptBuilder {
  // Transforms the GroundingPackage into the final string prompt or API payload for the AI Provider
  build(pkg: GroundingPackage): string {
    const docContext = pkg.knowledgeContext.map(k => `[${k.type.toUpperCase()}] ${k.title}`).join('\n');
    return `Objective: ${pkg.objective}\n\nContext:\n${docContext}\n\nStrict Policies: ${pkg.policiesApplied.join(', ')}`;
  }
}
