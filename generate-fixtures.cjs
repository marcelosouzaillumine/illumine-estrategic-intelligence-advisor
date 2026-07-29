const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/components/pages/__tests__/eac-scanner-fixtures');

const fixtures = {
  'analytical-perfect.tsx': `
    import React from 'react';
    const PageHeader = () => <div/>;
    const ControlBar = () => <div/>;
    const BalanceSheetExecutiveSynthesisSection = () => <div/>;
    const ExecutiveExposureCard = () => <div/>;
    const BalanceSheetCapitalPreservationSection = () => <div/>;
    const BalanceSheetWaterfallChartSection = () => <div/>;
    const ExecutiveStrategicTensions = () => <div/>;
    const RecommendationsSection = () => <div/>;
    const BalanceSheetTechnicalLayerSection = () => <div/>;
    
    export default function AnalyticalPerfect() {
      return (
        <div>
          <PageHeader />
          <ControlBar />
          <BalanceSheetExecutiveSynthesisSection />
          <ExecutiveExposureCard />
          <BalanceSheetCapitalPreservationSection />
          <BalanceSheetWaterfallChartSection />
          <ExecutiveStrategicTensions />
          <RecommendationsSection />
          <BalanceSheetTechnicalLayerSection />
        </div>
      );
    }
  `,
  'analytical-technical-before-summary.tsx': `
    import React from 'react';
    const PageHeader = () => <div/>;
    const BalanceSheetTechnicalLayerSection = () => <div/>;
    const BalanceSheetExecutiveSynthesisSection = () => <div/>;
    const ExecutiveExposureCard = () => <div/>;

    export default function Inverted() {
      return (
        <div>
          <PageHeader />
          <BalanceSheetTechnicalLayerSection />
          <BalanceSheetExecutiveSynthesisSection />
          <ExecutiveExposureCard />
        </div>
      );
    }
  `,
  'board-incomplete.tsx': `
    import React from 'react';
    const PageHeader = () => <div/>;

    export default function BoardIncomplete() {
      return (
        <div>
          <PageHeader />
        </div>
      );
    }
  `,
  'admin-without-actions.tsx': `
    import React from 'react';
    const PageHeader = () => <div/>;
    const GuidanceSection = () => <div/>;
    const FormWorkflow = () => <div/>;
    const ValidationStatus = () => <div/>;

    export default function AdminNoActions() {
      return (
        <div>
          <PageHeader />
          <GuidanceSection />
          <FormWorkflow />
          <ValidationStatus />
        </div>
      );
    }
  `,
  'operational-without-working-area.tsx': `
    import React from 'react';
    const PageHeader = () => <div/>;
    const ControlBar = () => <div/>;
    const OperationalKPIs = () => <div/>;

    export default function OpsNoWorking() {
      return (
        <div>
          <PageHeader />
          <ControlBar />
          <OperationalKPIs />
        </div>
      );
    }
  `,
  'page-with-modal.tsx': `
    import React from 'react';
    const PageHeader = () => <div/>;
    const BalanceSheetExecutiveSynthesisSection = () => <div/>;
    const ExecutiveExposureCard = () => <div/>;
    const BalanceSheetTechnicalLayerSection = () => <div/>;

    function MyModal() {
      return <BalanceSheetTechnicalLayerSection />;
    }
    export default function PageWithModal() {
      return (
        <div>
          <PageHeader />
          <BalanceSheetExecutiveSynthesisSection />
          <ExecutiveExposureCard />
          <MyModal />
        </div>
      );
    }
  `,
  'page-with-loading-state.tsx': `
    import React from 'react';
    const PageHeader = () => <div/>;
    const BalanceSheetExecutiveSynthesisSection = () => <div/>;
    const ExecutiveExposureCard = () => <div/>;
    const BalanceSheetTechnicalLayerSection = () => <div/>;

    export default function PageLoading({ loading }: { loading?: boolean }) {
      if (loading) return <BalanceSheetTechnicalLayerSection />;
      return (
        <div>
          <PageHeader />
          <BalanceSheetExecutiveSynthesisSection />
          <ExecutiveExposureCard />
        </div>
      );
    }
  `,
  'page-with-imported-section.tsx': `
    import React from 'react';
    const PageHeader = () => <div/>;
    const BalanceSheetExecutiveSynthesisSection = () => <div/>;
    const MyCustomSection = () => <div/>;
    
    export default function ImportedSectionPage() {
      return (
        <div>
          <PageHeader />
          <BalanceSheetExecutiveSynthesisSection />
          <MyCustomSection />
        </div>
      );
    }
  `,
  'page-with-alias.tsx': `
    import React from 'react';
    const IdentityHeader = () => <div/>;
    const BalanceSheetExecutiveSynthesisSection = () => <div/>;
    const ExecutiveExposureCard = () => <div/>;
    
    export default function AliasPage() {
      return (
        <div>
          <IdentityHeader />
          <BalanceSheetExecutiveSynthesisSection />
          <ExecutiveExposureCard />
        </div>
      );
    }
  `,
  'page-with-repeated-blocks.tsx': `
    import React from 'react';
    const PageHeader = () => <div/>;
    const BalanceSheetExecutiveSynthesisSection = () => <div/>;
    const ExecutiveExposureCard = () => <div/>;
    const BalanceSheetWaterfallChartSection = () => <div/>;
    const BalanceSheetTechnicalLayerSection = () => <div/>;

    export default function RepeatedBlocks() {
      return (
        <div>
          <PageHeader />
          <BalanceSheetExecutiveSynthesisSection />
          <ExecutiveExposureCard />
          <ExecutiveExposureCard />
          <BalanceSheetWaterfallChartSection />
          <BalanceSheetWaterfallChartSection />
          <BalanceSheetTechnicalLayerSection />
        </div>
      );
    }
  `
};

for (const [file, content] of Object.entries(fixtures)) {
  fs.writeFileSync(path.join(dir, file), content.trim());
}
console.log('Fixtures generated (TS safe)');
