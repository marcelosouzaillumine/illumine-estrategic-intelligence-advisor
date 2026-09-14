import React, { useState, useEffect } from 'react';
export const AnalyticsHealthCenterPage: React.FC = () => {
  
  // Mocking the EAMI state for the initial baseline rendering.
  // In a real implementation, this comes from the ARB backend services.
  const [eamiScore, setEamiScore] = useState(82); // 0-100 Migration Index
  
  const [metrics, setMetrics] = useState({
    analyticsIntegrityScore: 98,
    certifiedPages: 1,
    totalAnalyticsPages: 42,
    activeCapabilities: 3,
    totalCapabilitiesExpected: 18,
    legacyLogicRemoved: 87, // functions eliminated
    evidenceCoverage: 100
  });

  const getEAMIStatus = (score: number) => {
    if (score <= 30) return { label: 'Legacy Analytics', color: 'text-rose-500' };
    if (score <= 60) return { label: 'Transitional Governance', color: 'text-orange-500' };
    if (score <= 85) return { label: 'Governed Analytics', color: 'text-blue-500' };
    return { label: 'Executive Governance Certified', color: 'text-emerald-500' };
  };

  const status = getEAMIStatus(eamiScore);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 border-b pb-6 border-slate-200">
        <h1 className="text-3xl font-executive font-bold text-slate-900">Analytics Health Center™</h1>
        <p className="text-slate-500 mt-2">Executive Analytics Governance & Observability Dashboard (ARB Restricted)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Main EAMI Score Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 col-span-1 md:col-span-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-700">Executive Analytics Migration Index™ (EAMI)</h2>
            <p className="text-sm text-slate-500 mt-1">A saúde estrutural da inteligência governada pela plataforma.</p>
          </div>
          <div className="text-right">
            <span className={`text-4xl font-bold ${status.color}`}>{eamiScore}</span>
            <span className="text-slate-400 text-lg">/100</span>
            <p className={`text-sm font-medium mt-1 ${status.color}`}>{status.label}</p>
          </div>
        </div>

        {/* 1. Foundation Integrity */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-700 mb-4 flex items-center">
            <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span> Foundation Integrity
          </h3>
          <div className="flex flex-col h-24 justify-center items-center">
            <div className="text-4xl font-bold text-slate-800">{metrics.analyticsIntegrityScore}%</div>
            <div className="text-sm text-slate-500 mt-1">Analytics Integrity Score</div>
          </div>
        </div>

        {/* 2. Migration Progress */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-700 mb-4 flex items-center">
            <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span> Migration Progress
          </h3>
          <div className="flex flex-col h-24 justify-center items-center">
            <div className="text-4xl font-bold text-slate-800">
              {metrics.certifiedPages} <span className="text-slate-400 text-2xl">/ {metrics.totalAnalyticsPages}</span>
            </div>
            <div className="text-sm text-slate-500 mt-1">Certified Pages</div>
          </div>
        </div>

        {/* 3. Intelligence Coverage */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-700 mb-4 flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span> Governance Coverage
                                </h3>
          <div className="flex flex-col h-24 justify-center items-center">
            <div className="text-4xl font-bold text-slate-800">
              {metrics.activeCapabilities} <span className="text-slate-400 text-2xl">/ {metrics.totalCapabilitiesExpected}</span>
            </div>
            <div className="text-sm text-slate-500 mt-1">Capabilities</div>
          </div>
        </div>

        {/* 4. Legacy Elimination */}
        <div className="bg-white rounded-xl shadow-sm border border-emerald-200 p-6">
          <h3 className="font-semibold text-emerald-700 mb-4 flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span> Legacy Elimination
          </h3>
          <div className="flex flex-col h-24 justify-center items-center">
            <div className="text-4xl font-bold text-emerald-600">{metrics.legacyLogicRemoved}</div>
            <div className="text-sm text-emerald-600/80 mt-1">Functions eliminated</div>
            <div className="text-xs text-slate-400 mt-3">{metrics.evidenceCoverage}% Evidence Coverage Reached</div>
          </div>
        </div>
      </div>
      
      <div className="text-xs text-slate-400 text-center mt-8">
        Strictly governed by the Architecture Review Board (ARB) & Analytics Migration Constitution.
      </div>
    </div>
  );
};

export default AnalyticsHealthCenterPage;
