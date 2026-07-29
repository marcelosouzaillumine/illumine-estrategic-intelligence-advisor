export const noHardcodedColorsRule = {
  id: 'architecture/no-hardcoded-colors',
  description: 'Bloqueia utilitários arbitrários hardcoded (bg-white, text-gray, border-slate)',
  severity: 'MUST',
  validate(codeContent: string): { valid: boolean; error?: string } {
    const forbiddenClasses = [/bg-white|text-gray-\d+|border-slate-\d+/g];
    for (const pattern of forbiddenClasses) {
      if (pattern.test(codeContent)) {
        return {
          valid: false,
          error: 'ERROR AGF-EVC-002: Classe de cor hardcoded detectada. Use os tokens semânticos corporativos ou primitivas canônicas.'
        };
      }
    }
    return { valid: true };
  }
};
