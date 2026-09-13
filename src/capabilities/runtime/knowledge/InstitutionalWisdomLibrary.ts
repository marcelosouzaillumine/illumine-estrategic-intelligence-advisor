// src/core/runtime/knowledge/InstitutionalWisdomLibrary.ts

export interface IWLPrinciple {
  principleId: string;
  collection:
    | "GOVERNANCE"
    | "LEADERSHIP"
    | "STRATEGIC"
    | "ETHICAL"
    | "ESG"
    | "INSTITUTIONAL"
    | "BAM"
    | "BIBLICAL";
  title: string;
  description: string;
  source: string;
  tags: string[];
  version: string;
  status: "ACTIVE" | "DEPRECATED";
  createdAt: string;
  updatedAt: string;
}

export class InstitutionalWisdomLibrary {
  private static principles: IWLPrinciple[] = [
    // 1. GOVERNANCE
    {
      principleId: 'IWL-GOV-01',
      collection: 'GOVERNANCE',
      title: 'Transparência Ativa & Accountability',
      description: 'Zelar pelo dever fiduciário de transparência, prestando contas de todas as alçadas decisórias de forma clara e tempestiva.',
      source: 'IBGC & Fiduciary Law',
      tags: ['Compliance', 'Board', 'Prestação de Contas'],
      version: '1.0',
      status: 'ACTIVE',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    },
    {
      principleId: 'IWL-GOV-02',
      collection: 'GOVERNANCE',
      title: 'Segregação Eficiente de Alçadas',
      description: 'Garantir que as decisões operacionais respeitem os limites fiduciários e de aprovação colegiada estabelecidos no estatuto.',
      source: 'Constituição Fiduciária Illumine',
      tags: ['Alçadas', 'Compliance', 'Segregação de Funções'],
      version: '1.0',
      status: 'ACTIVE',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    },
    // 2. LEADERSHIP
    {
      principleId: 'IWL-LEA-01',
      collection: 'LEADERSHIP',
      title: 'Liderança Servidora',
      description: 'O líder atua como facilitador e removedor de obstáculos para que a equipe atinja a excelência de forma saudável.',
      source: 'Robert K. Greenleaf',
      tags: ['Serviço', 'Cultura', 'Liderança'],
      version: '1.0',
      status: 'ACTIVE',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    },
    // 3. STRATEGIC
    {
      principleId: 'IWL-STR-01',
      collection: 'STRATEGIC',
      title: 'Prontidão Adaptativa de Portfólio',
      description: 'Monitorar continuamente o ciclo tecnológico de mercado para mitigar a obsolescência e gerar inovação prospectiva sustentável.',
      source: 'Strategic Governance Framework',
      tags: ['Inovação', 'Adaptabilidade', 'Mercado'],
      version: '1.0',
      status: 'ACTIVE',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    },
    // 4. ETHICAL
    {
      principleId: 'IWL-ETH-01',
      collection: 'ETHICAL',
      title: 'Integridade Incondicional',
      description: 'Alinhamento absoluto entre discurso institucional, políticas internas e decisões operacionais práticas do Board.',
      source: 'Código de Conduta Illumine',
      tags: ['Integridade', 'Conformidade', 'Ética'],
      version: '1.0',
      status: 'ACTIVE',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    },
    // 5. ESG
    {
      principleId: 'IWL-ESG-01',
      collection: 'ESG',
      title: 'Governança Socialmente Responsável',
      description: 'Assegurar que as operações respeitem o ecossistema socioambiental e fortaleçam a conformidade ativa (ESGIM™).',
      source: 'ESGIM Matrix 2.0',
      tags: ['Sustentabilidade', 'Social', 'Governança'],
      version: '1.0',
      status: 'ACTIVE',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    },
    // 6. INSTITUTIONAL
    {
      principleId: 'IWL-INS-01',
      collection: 'INSTITUTIONAL',
      title: 'Preservação de Legado e Sucessão',
      description: 'Estruturar regimentos sucessórios claros de liderança corporativa para blindar a perenidade institucional multigeração.',
      source: 'Family Business Advisor',
      tags: ['Legado', 'Sucessão', 'Perenidade'],
      version: '1.0',
      status: 'ACTIVE',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    },
    // 7. BAM
    {
      principleId: 'IWL-BAM-01',
      collection: 'BAM',
      title: 'Business as Mission (BAM)',
      description: 'Integrar os negócios como um canal de transformação social, espiritual e econômica sob a visão do Reino.',
      source: 'Lausanne Movement on BAM',
      tags: ['Missão', 'Propósito', 'Valores'],
      version: '1.0',
      status: 'ACTIVE',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    },
    // 8. BIBLICAL
    {
      principleId: 'IWL-BIB-01',
      collection: 'BIBLICAL',
      title: 'Mordomia Fiduciária (Stewardship)',
      description: 'Reconhecer que os recursos da empresa são confiados temporariamente para serem geridos com prudência, excelência e responsabilidade.',
      source: 'Fundamentos Bíblicos de Gestão',
      tags: ['Mordomia', 'Prudência', 'Caixa'],
      version: '1.0',
      status: 'ACTIVE',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    },
    {
      principleId: 'IWL-BIB-02',
      collection: 'BIBLICAL',
      title: 'Justiça e Cuidado Humano',
      description: 'Zelar por remunerações justas, tratamento honrado e proteção ao bem-estar integral das pessoas como imagem de Deus.',
      source: 'Fundamentos Bíblicos de Gestão',
      tags: ['Justiça', 'Cuidado', 'Pessoas'],
      version: '1.0',
      status: 'ACTIVE',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    }
  ];

  public static getPrinciple(id: string): IWLPrinciple | undefined {
    return this.principles.find(p => p.principleId === id);
  }

  public static getPrinciplesByCollection(collection: string): IWLPrinciple[] {
    return this.principles.filter(p => p.collection === collection && p.status === 'ACTIVE');
  }

  public static getAllPrinciples(): IWLPrinciple[] {
    return this.principles.filter(p => p.status === 'ACTIVE');
  }
}
