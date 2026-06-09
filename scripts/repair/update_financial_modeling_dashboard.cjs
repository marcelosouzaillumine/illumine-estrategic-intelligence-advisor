const fs = require('fs');
const file = 'src/components/pages/FinancialModelingPage.tsx';
let content = fs.readFileSync(file, 'utf8');

const importDashboard = `import { ExecutionTrackingDashboard } from '../executive/board/ExecutionTrackingDashboard';\nimport { ExecutionCommitment } from '../../services/ExecutionGovernanceAdapter';`;

content = content.replace(
  `import { ExecutiveDecisionCenter } from './ExecutiveDecisionCenter';`,
  `import { ExecutiveDecisionCenter } from './ExecutiveDecisionCenter';\n${importDashboard}`
);

const dummyCommitments = `
  const mockCommitments: ExecutionCommitment[] = [
    {
      id: 'c1',
      sourceRecommendationId: 'r1',
      title: 'Estruturação de Comitê de Auditoria',
      description: 'Implementar comitê independente para mitigar risco de reporte DRE.',
      expectedCompletionDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      expectedCapex: 50000,
      expectedRevenueImpact: 0,
      status: 'IN_PROGRESS',
      slippage: {
        timeSlippageDays: 15,
        timeSeverity: 'LOW',
        scopeDeviationPercent: 0,
        scopeSeverity: 'NONE',
        impactDeviationPercent: 0,
        impactSeverity: 'NONE',
        overallSlippageScore: 11
      },
      ownerRole: 'CEO',
      lastUpdated: new Date()
    },
    {
      id: 'c2',
      sourceRecommendationId: 'r2',
      title: 'Desmobilização de Ativos Não-Operacionais',
      description: 'Venda de imóveis para otimização de capital (ROIC).',
      expectedCompletionDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
      actualCompletionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      expectedCapex: 0,
      actualCapex: 10000,
      expectedRevenueImpact: 2000000,
      actualRevenueImpact: 1500000,
      status: 'DEVIATED',
      slippage: {
        timeSlippageDays: 35,
        timeSeverity: 'MODERATE',
        scopeDeviationPercent: 0,
        scopeSeverity: 'NONE',
        impactDeviationPercent: -25,
        impactSeverity: 'MODERATE',
        overallSlippageScore: 44
      },
      ownerRole: 'CFO',
      lastUpdated: new Date()
    }
  ];
`;

content = content.replace(
  `const executionIntelligence = useScenarioExecutionIntelligence(`,
  `${dummyCommitments}\n  const executionIntelligence = useScenarioExecutionIntelligence(`
);

const dashboardMarkup = `
            <ExecutionTrackingDashboard commitments={mockCommitments} />
`;

content = content.replace(
  `            />
          )}`,
  `            />\n${dashboardMarkup}          )}`
);

fs.writeFileSync(file, content);
console.log("Success");
