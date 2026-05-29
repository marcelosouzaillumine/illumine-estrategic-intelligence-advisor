import { SegmentCode, SegmentIntelligenceContext } from './types';

export const SegmentIntelligenceRegistry: Record<SegmentCode, SegmentIntelligenceContext> = {
  COMMERCE_DISTRIBUTION: {
    segmentCode: 'COMMERCE_DISTRIBUTION',
    segmentLabel: 'Comércio e Distribuição',
    segmentCategory: 'TRADE',
    operationalCharacteristics: {
      inventoryHeavy: true,
      assetLight: false,
      highSupplierDependency: true,
      workingCapitalSensitivity: 'CRITICAL',
      fixedCostIntensity: 'LOW',
      revenueVolatility: 'MEDIUM'
    },
    defaultThresholdProfiles: {
      minCurrentLiquidity: 1.2,
      healthyCurrentLiquidity: 1.5,
      maxInventoryToAssets: 0.45,
      maxShortTermDebtToAssets: 0.35,
      minOperatingCashReserveDays: 30,
      maxAcceptableLeverage: 3.5
    },
    executiveNarrativeTraits: {
      inventoryPressure: 'aprisionamento de capital em estoques',
      workingCapitalPressure: 'pressão no giro operacional e ciclo de caixa',
      operationalLeverage: 'alavancagem dependente de volume de vendas',
      supplierDependency: 'alta dependência de prazos de fornecedores',
      fixedCostBurden: 'pressão de custos logísticos e comissionamentos',
      revenueSensitivities: 'sensibilidade a sazonalidade e consumo varejista'
    },
    baseRiskProfile: {
      dominantOperationalRisks: ['Risco de obsolescência de estoque', 'Dependência de fornecedores estratégicos', 'Compressão de margem operacional'],
      strategicAlerts: ['Alerta de giro lento', 'Ruptura de ciclo de caixa'],
      contextualWarnings: ['Alta necessidade de capital de giro'],
      vulnerabilityDrivers: ['Prazos médios desbalanceados', 'Custo logístico crescente']
    }
  },
  INDUSTRY: {
    segmentCode: 'INDUSTRY',
    segmentLabel: 'Indústria e Manufatura',
    segmentCategory: 'MANUFACTURING',
    operationalCharacteristics: {
      inventoryHeavy: true,
      assetLight: false,
      highSupplierDependency: true,
      workingCapitalSensitivity: 'HIGH',
      fixedCostIntensity: 'HIGH',
      revenueVolatility: 'MEDIUM'
    },
    defaultThresholdProfiles: {
      minCurrentLiquidity: 1.1,
      healthyCurrentLiquidity: 1.4,
      maxInventoryToAssets: 0.30,
      maxShortTermDebtToAssets: 0.30,
      minOperatingCashReserveDays: 45,
      maxAcceptableLeverage: 4.0
    },
    executiveNarrativeTraits: {
      inventoryPressure: 'imobilização de capital em matérias-primas e insumos',
      workingCapitalPressure: 'longo ciclo de conversão de caixa industrial',
      operationalLeverage: 'alta alavancagem operacional por custos fixos fabris',
      supplierDependency: 'dependência na cadeia de suprimentos',
      fixedCostBurden: 'peso estrutural de capacidade instalada e manutenção',
      revenueSensitivities: 'exposição a demanda macroeconômica'
    },
    baseRiskProfile: {
      dominantOperationalRisks: ['Ociosidade de capacidade produtiva', 'Risco cambial e de commodities', 'Custo fixo alto em períodos de baixa demanda'],
      strategicAlerts: ['Necessidade de manutenção de margem bruta', 'Pressão no ciclo produtivo'],
      contextualWarnings: ['Imobilização excessiva'],
      vulnerabilityDrivers: ['Quebra de cadeia de suprimentos', 'Pressão cambial']
    }
  },
  HEALTHCARE: {
    segmentCode: 'HEALTHCARE',
    segmentLabel: 'Saúde e Hospitalar',
    segmentCategory: 'HEALTH',
    operationalCharacteristics: {
      inventoryHeavy: false,
      assetLight: false,
      highSupplierDependency: true,
      workingCapitalSensitivity: 'HIGH',
      fixedCostIntensity: 'HIGH',
      revenueVolatility: 'LOW'
    },
    defaultThresholdProfiles: {
      minCurrentLiquidity: 0.9, // Greater tolerance for structural delays
      healthyCurrentLiquidity: 1.2,
      maxInventoryToAssets: 0.15,
      maxShortTermDebtToAssets: 0.40,
      minOperatingCashReserveDays: 60,
      maxAcceptableLeverage: 4.5
    },
    executiveNarrativeTraits: {
      inventoryPressure: 'custo de estocagem de insumos médicos de alto valor',
      workingCapitalPressure: 'longo ciclo de recebimento devido a fontes pagadoras',
      operationalLeverage: 'dependência de ocupação hospitalar',
      supplierDependency: 'dependência de materiais e medicamentos especializados',
      fixedCostBurden: 'pressão assistencial e folha médica rígida',
      revenueSensitivities: 'dependência de fluxo de convênios e planos de saúde'
    },
    baseRiskProfile: {
      dominantOperationalRisks: ['Glosas médicas e atrasos de convênios', 'Alto custo fixo assistencial', 'Ciclo de recebimento longo'],
      strategicAlerts: ['Risco de sinistralidade da fonte pagadora', 'Falta de suprimentos médicos'],
      contextualWarnings: ['Fluxo de caixa pressionado por faturamento não realizado'],
      vulnerabilityDrivers: ['Prazo médio de recebimento dilatado', 'Ocupação abaixo do breakeven']
    }
  },
  SERVICES: {
    segmentCode: 'SERVICES',
    segmentLabel: 'Serviços Profissionais e B2B',
    segmentCategory: 'SERVICES',
    operationalCharacteristics: {
      inventoryHeavy: false,
      assetLight: true,
      highSupplierDependency: false,
      workingCapitalSensitivity: 'MEDIUM',
      fixedCostIntensity: 'MEDIUM',
      revenueVolatility: 'MEDIUM'
    },
    defaultThresholdProfiles: {
      minCurrentLiquidity: 1.3,
      healthyCurrentLiquidity: 1.8,
      maxInventoryToAssets: 0.05,
      maxShortTermDebtToAssets: 0.25,
      minOperatingCashReserveDays: 90,
      maxAcceptableLeverage: 2.5
    },
    executiveNarrativeTraits: {
      inventoryPressure: 'pressão residual de insumos de apoio',
      workingCapitalPressure: 'inadimplência ou concentração de recebíveis',
      operationalLeverage: 'alavancagem baseada em produtividade da equipe',
      supplierDependency: 'baixa dependência de terceiros físicos',
      fixedCostBurden: 'sensibilidade primária a custos com folha de pagamento',
      revenueSensitivities: 'sensibilidade de retenção de carteira e churn'
    },
    baseRiskProfile: {
      dominantOperationalRisks: ['Dependência de capital humano chave', 'Concentração de clientes (carteira)', 'Baixa barreira de entrada operacional'],
      strategicAlerts: ['Aumento de custo de aquisição (CAC)', 'Pressão na margem de contribuição por hora'],
      contextualWarnings: ['Risco trabalhista e retenção de talentos'],
      vulnerabilityDrivers: ['Perda de contratos principais', 'Aumento de custos de folha']
    }
  },
  TECHNOLOGY: {
    segmentCode: 'TECHNOLOGY',
    segmentLabel: 'Tecnologia e Software',
    segmentCategory: 'TECH',
    operationalCharacteristics: {
      inventoryHeavy: false,
      assetLight: true,
      highSupplierDependency: false,
      workingCapitalSensitivity: 'LOW',
      fixedCostIntensity: 'HIGH',
      revenueVolatility: 'LOW'
    },
    defaultThresholdProfiles: {
      minCurrentLiquidity: 1.5,
      healthyCurrentLiquidity: 2.0,
      maxInventoryToAssets: 0.02,
      maxShortTermDebtToAssets: 0.20,
      minOperatingCashReserveDays: 180, // Tech often needs high runway
      maxAcceptableLeverage: 2.0 // Usually less leveraged
    },
    executiveNarrativeTraits: {
      inventoryPressure: 'ausência de restrições de estoque físico',
      workingCapitalPressure: 'dinâmica de recebimento antecipado (SaaS)',
      operationalLeverage: 'altíssima alavancagem operacional por base de usuários',
      supplierDependency: 'dependência de infraestrutura em nuvem',
      fixedCostBurden: 'custos intensivos em P&D e infraestrutura tecnológica',
      revenueSensitivities: 'retenção, MRR e LTV'
    },
    baseRiskProfile: {
      dominantOperationalRisks: ['Risco de churn e perda de receita recorrente', 'Obsolecência tecnológica rápida', 'Aumento drástico em CAC'],
      strategicAlerts: ['Burn rate insustentável', 'Falha de segurança e conformidade'],
      contextualWarnings: ['Baixa rentabilidade imediata frente ao alto investimento'],
      vulnerabilityDrivers: ['Taxa de retenção em queda', 'Escalada de custos de nuvem']
    }
  },
  NONPROFIT: {
    segmentCode: 'NONPROFIT',
    segmentLabel: 'Terceiro Setor e ONGs',
    segmentCategory: 'SOCIAL',
    operationalCharacteristics: {
      inventoryHeavy: false,
      assetLight: true,
      highSupplierDependency: false,
      workingCapitalSensitivity: 'HIGH',
      fixedCostIntensity: 'MEDIUM',
      revenueVolatility: 'HIGH'
    },
    defaultThresholdProfiles: {
      minCurrentLiquidity: 1.2,
      healthyCurrentLiquidity: 2.0,
      maxInventoryToAssets: 0.10,
      maxShortTermDebtToAssets: 0.15, // Should ideally have low debt
      minOperatingCashReserveDays: 90,
      maxAcceptableLeverage: 1.0
    },
    executiveNarrativeTraits: {
      inventoryPressure: 'estoques limitados a doações e suprimentos de projeto',
      workingCapitalPressure: 'sensibilidade ao cronograma de desembolsos de fomento',
      operationalLeverage: 'escalabilidade restrita por fontes de financiamento',
      supplierDependency: 'dependência moderada de parceiros implementadores',
      fixedCostBurden: 'rigidez estrutural não coberta por recursos restritos',
      revenueSensitivities: 'dependência de doadores, editais e grants'
    },
    baseRiskProfile: {
      dominantOperationalRisks: ['Dependência de poucos grandes doadores', 'Ineficiência em destinação de fundos', 'Risco regulatório de compliance'],
      strategicAlerts: ['Falta de fundos irrestritos', 'Gargalo de fluxo de caixa para operação-meio'],
      contextualWarnings: ['Sustentabilidade de longo prazo comprometida'],
      vulnerabilityDrivers: ['Perda de título filantrópico', 'Interrupção de repasses']
    }
  },
  EDUCATION: {
    segmentCode: 'EDUCATION',
    segmentLabel: 'Educação e Ensino',
    segmentCategory: 'EDUCATION',
    operationalCharacteristics: {
      inventoryHeavy: false,
      assetLight: false, // Heavy on real estate usually
      highSupplierDependency: false,
      workingCapitalSensitivity: 'MEDIUM',
      fixedCostIntensity: 'HIGH',
      revenueVolatility: 'LOW' // Highly predictable due to academic cycles
    },
    defaultThresholdProfiles: {
      minCurrentLiquidity: 1.1,
      healthyCurrentLiquidity: 1.4,
      maxInventoryToAssets: 0.05,
      maxShortTermDebtToAssets: 0.35,
      minOperatingCashReserveDays: 60,
      maxAcceptableLeverage: 3.5
    },
    executiveNarrativeTraits: {
      inventoryPressure: 'baixo impacto de estoques físicos no balanço',
      workingCapitalPressure: 'sazonalidade de matrículas e risco de inadimplência escolar',
      operationalLeverage: 'alavancagem baseada no índice de ocupação de turmas',
      supplierDependency: 'baixa dependência de cadeia de suprimentos comercial',
      fixedCostBurden: 'alto custo fixo com corpo docente e infraestrutura predial',
      revenueSensitivities: 'sensibilidade à captação, evasão (dropout) e FIES/crédito'
    },
    baseRiskProfile: {
      dominantOperationalRisks: ['Evasão escolar elevada', 'Aumento de inadimplência', 'Ociosidade de infraestrutura física'],
      strategicAlerts: ['Queda na renovação de matrículas', 'Regulação governamental'],
      contextualWarnings: ['Alta dependência de programas de crédito estudantil'],
      vulnerabilityDrivers: ['Taxa de conversão de novos alunos', 'Rigidez da folha docente']
    }
  },
  CONSTRUCTION: {
    segmentCode: 'CONSTRUCTION',
    segmentLabel: 'Construção Civil e Engenharia',
    segmentCategory: 'CONSTRUCTION',
    operationalCharacteristics: {
      inventoryHeavy: true, // Land bank and construction in progress
      assetLight: false,
      highSupplierDependency: true,
      workingCapitalSensitivity: 'CRITICAL',
      fixedCostIntensity: 'HIGH',
      revenueVolatility: 'HIGH'
    },
    defaultThresholdProfiles: {
      minCurrentLiquidity: 1.5, // Needs high liquidity due to long cycles
      healthyCurrentLiquidity: 2.0,
      maxInventoryToAssets: 0.60, // Inventory (land, works in progress) is high
      maxShortTermDebtToAssets: 0.40,
      minOperatingCashReserveDays: 120,
      maxAcceptableLeverage: 4.0
    },
    executiveNarrativeTraits: {
      inventoryPressure: 'forte imobilização em banco de terrenos e obras em andamento',
      workingCapitalPressure: 'intensivo descasamento crônico de caixa e longo ciclo operacional',
      operationalLeverage: 'exposição estrutural a lançamentos e velocidade de vendas',
      supplierDependency: 'dependência severa de suprimentos de construção e empreiteiros',
      fixedCostBurden: 'pressão de custos fixos de estrutura e equipamentos',
      revenueSensitivities: 'sensibilidade extrema à taxa de juros e crédito imobiliário'
    },
    baseRiskProfile: {
      dominantOperationalRisks: ['Estouro de orçamento de obras', 'Atraso em cronograma e distratos', 'Risco de crédito do adquirente'],
      strategicAlerts: ['Gargalos de fornecimento de insumos', 'Queda no VSO (Velocidade de Vendas)'],
      contextualWarnings: ['Alta dependência de financiamento atrelado à obra'],
      vulnerabilityDrivers: ['Inflação da construção civil (INCC)', 'Taxa Selic']
    }
  },
  LOGISTICS: {
    segmentCode: 'LOGISTICS',
    segmentLabel: 'Logística e Transportes',
    segmentCategory: 'LOGISTICS',
    operationalCharacteristics: {
      inventoryHeavy: false,
      assetLight: false, // Heavy on fleets/warehouses unless 3PL asset-light
      highSupplierDependency: true,
      workingCapitalSensitivity: 'MEDIUM',
      fixedCostIntensity: 'HIGH',
      revenueVolatility: 'MEDIUM'
    },
    defaultThresholdProfiles: {
      minCurrentLiquidity: 1.1,
      healthyCurrentLiquidity: 1.5,
      maxInventoryToAssets: 0.10,
      maxShortTermDebtToAssets: 0.35,
      minOperatingCashReserveDays: 45,
      maxAcceptableLeverage: 3.5
    },
    executiveNarrativeTraits: {
      inventoryPressure: 'necessidade restrita a peças, manutenção e combustíveis',
      workingCapitalPressure: 'pressão de recebíveis vs. pagamento imediato de fretes/pedágios',
      operationalLeverage: 'sensibilidade direta ao volume roteirizado e ociosidade de frota',
      supplierDependency: 'dependência de manutenção e terceirizados de frota',
      fixedCostBurden: 'pesada estrutura de ativos de transporte e armazéns',
      revenueSensitivities: 'sensibilidade a preços de combustíveis e atividade econômica'
    },
    baseRiskProfile: {
      dominantOperationalRisks: ['Volatilidade do preço do combustível', 'Ociosidade e rotação de frota', 'Passivo trabalhista'],
      strategicAlerts: ['Baixo índice de frete de retorno', 'Manutenção corretiva elevada'],
      contextualWarnings: ['Renovação de frota adiada'],
      vulnerabilityDrivers: ['Tabela de fretes vs custos diretos', 'Sinistralidade']
    }
  },
  GENERIC_OPERATION: {
    segmentCode: 'GENERIC_OPERATION',
    segmentLabel: 'Operação Geral Não Especificada',
    segmentCategory: 'GENERAL',
    operationalCharacteristics: {
      inventoryHeavy: false,
      assetLight: false,
      highSupplierDependency: false,
      workingCapitalSensitivity: 'MEDIUM',
      fixedCostIntensity: 'MEDIUM',
      revenueVolatility: 'MEDIUM'
    },
    defaultThresholdProfiles: {
      minCurrentLiquidity: 1.2,
      healthyCurrentLiquidity: 1.5,
      maxInventoryToAssets: 0.30,
      maxShortTermDebtToAssets: 0.35,
      minOperatingCashReserveDays: 60,
      maxAcceptableLeverage: 3.0
    },
    executiveNarrativeTraits: {
      inventoryPressure: 'impacto padrão de estoques no balanço',
      workingCapitalPressure: 'dinâmica genérica de necessidade de capital de giro',
      operationalLeverage: 'alavancagem estrutural indefinida',
      supplierDependency: 'relação típica de cadeia de fornecimento',
      fixedCostBurden: 'estrutura equilibrada de custos operacionais',
      revenueSensitivities: 'sensibilidade a ciclos econômicos regulares'
    },
    baseRiskProfile: {
      dominantOperationalRisks: ['Limitação analítica por ausência de definição setorial', 'Risco genérico de liquidez', 'Vulnerabilidade não especificada a drivers externos'],
      strategicAlerts: ['Identidade Setorial Desconhecida'],
      contextualWarnings: ['Análise utilizando parâmetros prudenciais medianos (Fail-Closed)'],
      vulnerabilityDrivers: ['Ciclo econômico geral']
    }
  }
};
