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