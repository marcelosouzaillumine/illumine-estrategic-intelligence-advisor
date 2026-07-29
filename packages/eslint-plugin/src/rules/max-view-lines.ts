export const maxViewLinesRule = {
  id: 'architecture/max-view-lines',
  description: 'Alerta quando o tamanho da View ultrapassa o limite arquitetural de 500 linhas',
  severity: 'SHOULD',
  validate(codeContent: string): { valid: boolean; warning?: string } {
    const lines = codeContent.split('\n').length;
    if (lines > 500) {
      return {
        valid: false,
        warning: `WARNING AGF-MVVM-004: Componente excede o limite arquitetural (${lines} linhas > 500 max). Fatore em Header, Workspace, Dialog e ViewModel.`
      };
    }
    return { valid: true };
  }
};
