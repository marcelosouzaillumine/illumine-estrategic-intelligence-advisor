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