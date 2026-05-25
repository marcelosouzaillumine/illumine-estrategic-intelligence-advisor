export class BenchmarkDatasetBuilder {
  /**
   * Stub de extração segura da base institucional real (Network).
   * Garante que DRE e BP nunca sejam lidos neste contexto.
   */
  static extractSafeInstitutionalNetworkData(): any[] {
    // MOCK para MVP: Retorna uma base fictícia para a engine ter material de trabalho.
    // Simula uma rede com diversas empresas conectadas.
    const network = [];
    
    // Criamos 10 empresas do setor VAREJO
    for (let i = 0; i < 10; i++) {
      network.push({
        _internalId: `T-VAREJO-${i}`, // Nunca sai daqui
        sector: 'VAREJO',
        revenue: 200000000, // TIER_3
        maturity: 'L3',
        riskScore: Math.floor(Math.random() * 100),
        confidence: i % 2 === 0 ? 'HIGH' : 'MEDIUM'
      });
    }

    // Criamos apenas 2 empresas do setor AEROSPACE (isso vai falhar no PrivacyGuard)
    for (let i = 0; i < 2; i++) {
      network.push({
        _internalId: `T-AERO-${i}`,
        sector: 'AEROSPACE',
        revenue: 9000000000,
        maturity: 'L5',
        riskScore: 20,
        confidence: 'HIGH'
      });
    }

    return network;
  }
}
