export class ExecutiveNavigationSimplifier {
  static getSimplifiedMenu(role: string): string[] {
    if (role === 'BOARD_MEMBER') {
      return ['Executive Overview', 'Risk Radar', 'Governance Actions', 'Board Pack'];
    }
    return ['Dashboard', 'Early Warning', 'Workflows', 'Simulations', 'Reports'];
  }
}
