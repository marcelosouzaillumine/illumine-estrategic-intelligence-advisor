export class LSPDiagnostics {
  public static diagnose(codeContent: string): string[] {
    const diagnostics: string[] = [];
    if (/fetch\(|\baxios\b/.test(codeContent)) {
      diagnostics.push('AGF-MVVM-001: Chamada de API direta detectada na View. Mova para o ViewModel.');
    }
    if (/bg-white/.test(codeContent)) {
      diagnostics.push('AGF-EVC-002: Cor hardcoded bg-white detectada. Use ExecutiveSurface ou tokens semânticos.');
    }
    return diagnostics;
  }
}
