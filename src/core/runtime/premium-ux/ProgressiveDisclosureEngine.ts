// Placeholder — Controls what information is shown at each cognitive level
export class ProgressiveDisclosureEngine {
  static getVisibleSections(role: string, complexityLevel: 'BASIC' | 'STANDARD' | 'EXPERT'): string[] {
    if (complexityLevel === 'BASIC') return ['Summary', 'Key Alerts', 'Required Actions'];
    if (complexityLevel === 'STANDARD') return ['Summary', 'Key Alerts', 'Required Actions', 'Trends', 'Simulations'];
    return ['All Sections'];
  }
}
