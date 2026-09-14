export class ExecutiveRelationshipPolicy {
  static MAX_BRIEFINGS_PER_DAY = 1;
  static SILENCE_TIMEOUT_MINUTES = 60; // Não repetir interrupções na mesma hora
  
  static enforcePolicy(lastInteractionISO: string): boolean {
    const last = new Date(lastInteractionISO).getTime();
    const now = new Date().getTime();
    const diffMins = (now - last) / (1000 * 60);
    
    // AR-GFC-ERI-002: No Repetitive Interaction
    return diffMins > this.SILENCE_TIMEOUT_MINUTES;
  }
}
