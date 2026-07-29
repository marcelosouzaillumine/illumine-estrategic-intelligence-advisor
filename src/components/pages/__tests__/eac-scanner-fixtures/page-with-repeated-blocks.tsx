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