import fs from 'fs';

const files = [
  {
    path: 'src/components/pages/balance-sheet/BalanceSheetAssetQualitySection.tsx',
    subtitle: 'O capital está imobilizado em excesso ou alocado eficientemente?'
  },
  {
    path: 'src/components/pages/balance-sheet/BalanceSheetCapitalPreservationSection.tsx',
    subtitle: 'A empresa está protegida contra perdas estruturais?'
  },
  {
    path: 'src/components/pages/balance-sheet/BalanceSheetCapitalStructureSection.tsx',
    subtitle: 'Há riscos estruturais no endividamento atual?'
  },
  {
    path: 'src/components/pages/balance-sheet/BalanceSheetWorkingCapitalSection.tsx',
    subtitle: 'O ciclo operacional consome caixa excessivo ou é auto-financiável?'
  }
];

for (const file of files) {
  let content = fs.readFileSync(file.path, 'utf-8');

  // Add ExecutiveEvidenceGrid import
  if (!content.includes('ExecutiveEvidenceGrid')) {
    content = content.replace(
      /import \{ ExecutiveSummarySection \}.*?;/,
      `import { ExecutiveSummarySection } from '../../ui/executive-summary-section';\nimport { ExecutiveEvidenceGrid } from '../../ui/executive-evidence-grid';`
    );
  }

  // Replace Header Subtitle logic
  content = content.replace(
    /\{assessment\?\.executiveNarrative && \([\s\S]*?\}\)/,
    `<ExecutiveText variant="moduleSubtitle" as="p">\n          ${file.subtitle}\n        </ExecutiveText>`
  );

  // Replace ExecutiveSummarySection props
  content = content.replace(
    /mode="separated"[\s\S]*?metrics=\{formattedMetrics\}/,
    `opinion={assessment?.executiveNarrative || 'Análise em andamento.'}
        driver={assessment?.primaryDriver || 'Fator Principal'}
        implication={assessment?.managerialImplication || assessment?.justification || 'Aguardando dados estruturais.'}
        action={assessment?.priorityAction || 'Revisar operações.'}
        technicalScore={{
          value: assessment?.score ?? null,
          confidence: assessment?.confidence || 'Alta'
        }}
      >
        {formattedMetrics.length > 0 && (
          <ExecutiveEvidenceGrid columns={3}>
            {formattedMetrics.map((metric, idx) => (
              <ExecutiveMetricCard 
                key={idx}
                title={metric.title}
                value={metric.value}
                layout="summary"
                density="compact"
                surface="default"
                className="h-full"
              />
            ))}
          </ExecutiveEvidenceGrid>
        )}`
  );

  fs.writeFileSync(file.path, content);
}
