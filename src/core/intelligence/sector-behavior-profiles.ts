export interface SectorBehaviorProfile {
  id: string;
  name: string;
  expectedInventoryIntensity: 'Low' | 'Medium' | 'High';
  expectedAssetType: 'Light' | 'Heavy';
  expectedReceivablesCycle: 'Short' | 'Medium' | 'Long';
  earlyStageMarginProfile: 'High' | 'Variable' | 'Low';
  typicalCashFlowDynamics: string;
}

export const SECTOR_PROFILES: Record<string, SectorBehaviorProfile> = {
  'Cosméticos': {
    id: 'cosmeticos',
    name: 'Cosméticos / Higiene / Beleza',
    expectedInventoryIntensity: 'High',
    expectedAssetType: 'Light', 
    expectedReceivablesCycle: 'Medium',
    earlyStageMarginProfile: 'High',
    typicalCashFlowDynamics: 'Alto investimento em branding e formação de estoque (portfólio). Margem bruta alta sustenta CAC inicial elevado.'
  },
  'Hospital': {
    id: 'hospital',
    name: 'Saúde / Hospitalar',
    expectedInventoryIntensity: 'Medium',
    expectedAssetType: 'Heavy',
    expectedReceivablesCycle: 'Long',
    earlyStageMarginProfile: 'Variable',
    typicalCashFlowDynamics: 'Ciclo longo de recebimento (convênios). Passivo operacional elevado (folha médica) gerando pressão contínua de caixa.'
  },
  'SaaS': {
    id: 'saas',
    name: 'Tecnologia / SaaS',
    expectedInventoryIntensity: 'Low',
    expectedAssetType: 'Light',
    expectedReceivablesCycle: 'Short',
    earlyStageMarginProfile: 'High',
    typicalCashFlowDynamics: 'Burn rate inicial focado em CAC e P&D. Ativo leve. Margem altamente escalável com receita recorrente.'
  },
  'Indústria Transformação': {
    id: 'ind_transformacao',
    name: 'Indústria Transformação Base',
    expectedInventoryIntensity: 'High',
    expectedAssetType: 'Heavy',
    expectedReceivablesCycle: 'Medium',
    earlyStageMarginProfile: 'Variable',
    typicalCashFlowDynamics: 'Capital intensivo em imobilizado e giro (matéria prima e produto acabado). Margens apertadas dependentes de escala.'
  },
  'Varejo': {
    id: 'varejo',
    name: 'Varejo / Comércio',
    expectedInventoryIntensity: 'High',
    expectedAssetType: 'Light',
    expectedReceivablesCycle: 'Short',
    earlyStageMarginProfile: 'Low',
    typicalCashFlowDynamics: 'Giro rápido. Lucro depende do volume. Forte dependência de fornecedores no capital de giro.'
  },
  'Default': {
    id: 'default',
    name: 'Geral',
    expectedInventoryIntensity: 'Medium',
    expectedAssetType: 'Heavy',
    expectedReceivablesCycle: 'Medium',
    earlyStageMarginProfile: 'Variable',
    typicalCashFlowDynamics: 'Padrão neutro sem distorções setoriais identificadas.'
  }
};

export function getSectorProfile(sectorName: string): SectorBehaviorProfile {
  if (!sectorName) return SECTOR_PROFILES['Default'];
  
  const normalized = sectorName.toLowerCase();
  if (normalized.includes('cosmético') || normalized.includes('beleza') || normalized.includes('farmácia')) {
    return SECTOR_PROFILES['Cosméticos'];
  }
  if (normalized.includes('hospital') || normalized.includes('saúde') || normalized.includes('clinica')) {
    return SECTOR_PROFILES['Hospital'];
  }
  if (normalized.includes('saas') || normalized.includes('tecnologia') || normalized.includes('software') || normalized.includes('serviço de internet')) {
    return SECTOR_PROFILES['SaaS'];
  }
  if (normalized.includes('varejo') || normalized.includes('comércio') || normalized.includes('atacado')) {
    return SECTOR_PROFILES['Varejo'];
  }
  if (normalized.includes('indústria') || normalized.includes('manufatura') || normalized.includes('metalúrgica')) {
    return SECTOR_PROFILES['Indústria Transformação'];
  }
  
  return SECTOR_PROFILES['Default'];
}
