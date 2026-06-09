import { EvidenceAttribution } from "../../types/evidence/EvidenceAttribution";
import { EvidenceBundle } from "../../types/evidence/EvidenceBundle";
import { getErrorMessage } from "../../types/runtime/RuntimeErrorGuards";

export class ExecutiveEvidenceRegistry {
  static async registerAttribution(attribution: EvidenceAttribution): Promise<void> {
    try {
      // Stub for actual database persistence
      if (!attribution.outputId || !attribution.engineId) {
        throw new Error("Missing critical attribution context");
      }
      console.log(`[ExecutiveEvidenceRegistry] Attribution ${attribution.attributionId} registered for output ${attribution.outputId}`);
    } catch (err: unknown) {
      console.error("[ExecutiveEvidenceRegistry] Failed to register attribution:", getErrorMessage(err));
    }
  }

  static async registerBundle(bundle: EvidenceBundle): Promise<void> {
    try {
      if (!bundle.correlationId) {
        throw new Error("Missing correlation context in evidence bundle");
      }
      console.log(`[ExecutiveEvidenceRegistry] Bundle ${bundle.bundleId} registered with ${bundle.evidenceReferences.length} evidences`);
    } catch (err: unknown) {
      console.error("[ExecutiveEvidenceRegistry] Failed to register bundle:", getErrorMessage(err));
    }
  }
}
