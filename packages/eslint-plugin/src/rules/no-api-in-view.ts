export const noApiInViewRule = {
  id: 'architecture/no-api-in-view',
  description: 'Bloqueia chamadas diretas de API (fetch, axios, supabase) dentro de Views React (.tsx)',
  severity: 'MUST',
  validate(codeContent: string): { valid: boolean; error?: string } {
    const forbiddenPatterns = [/fetch\(|\baxios\b|supabase\.from/g];
    for (const pattern of forbiddenPatterns) {
      if (pattern.test(codeContent)) {
        return {
          valid: false,
          error: 'ERROR AGF-MVVM-001: Acesso a API detectado dentro da View. A View deve consumir exclusivamente o ViewModel.'
        };
      }
    }
    return { valid: true };
  }
};
