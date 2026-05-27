export class FiduciaryNarrativeViolation extends Error {
  public metadata: {
    bannedTerm: string;
    textSample: string;
  };

  constructor(message: string, bannedTerm: string, textSample: string) {
    super(message);
    this.name = 'FiduciaryNarrativeViolation';
    this.metadata = { bannedTerm, textSample };
    Object.setPrototypeOf(this, FiduciaryNarrativeViolation.prototype);
  }
}

export class ExecutiveNarrativeSanitizer {
  private static BANNED_PATTERNS = [
    { regex: /\bcausou\b/i, term: 'causou' },
    { regex: /\bprovou\b/i, term: 'provou' },
    { regex: /demonstrou\s+definitivamente/i, term: 'demonstrou definitivamente' },
    { regex: /inevitavelmente\s+levar[aá]/i, term: 'inevitavelmente levará' },
    { regex: /evid[eê]ncia\s+falha/i, term: 'evidencia falha' },
    { regex: /resultar[aá]\s+em/i, term: 'resultará em' },
    { regex: /respons[aá]vel\s+pela\s+deterioraç[aã]o/i, term: 'responsável pela deterioração' },
    { regex: /determinou\s+o\s+colapso/i, term: 'determinou o colapso' },
    { regex: /explica\s+completamente/i, term: 'explica completamente' },
    { regex: /gest[aã]o\s+falhou/i, term: 'gestão falhou' },
    { regex: /mal\s+administrada/i, term: 'mal administrada' },
    { regex: /resist[eê]ncia\s+interna/i, term: 'resistência interna' },
    { regex: /baixa\s+maturidade/i, term: 'baixa maturidade' },
    { regex: /incompet[eê]ncia/i, term: 'incompetência' }
  ];

  public static sanitize(text: string): string {
    if (!text) return '';

    for (const pattern of this.BANNED_PATTERNS) {
      if (pattern.regex.test(text)) {
        throw new FiduciaryNarrativeViolation(
          `Violação de linguagem fiduciária: Termo proibido '${pattern.term}' detectado na narrativa.`,
          pattern.term,
          text
        );
      }
    }
    return text;
  }
}
