import React from 'react';

// Mocks para o scanner
const PageHeader = () => <div />;
const Toolbar = () => <div />;
const CriticalDecisionSurface = () => <div />;
const EvidencePanel = () => <div />;

export default function GovernanceWithDecisionSummary() {
  return (
    <div>
      <PageHeader />
      <Toolbar />
      <CriticalDecisionSurface />
      <EvidencePanel />
    </div>
  );
}
