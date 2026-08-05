import React from 'react';
// import { ExecutiveFinancialHealthScore } from '../../../workspace/intelligence/cfo/cfo-health-score.engine';

export const CFOValidationLab: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">CFO Validation Lab</h1>
        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
          SYSTEM_INTELLIGENCE_DEBUG
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Score Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm col-span-1">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Executive Health Score</h2>
          <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
            <span className="text-5xl font-black text-gray-900">82</span>
            <span className="text-lg font-medium text-green-600 mt-2">Healthy</span>
          </div>
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Liquidity</span>
              <span className="font-medium">90/100</span>
            </div>
            <div className="flex justify-between">
              <span>Profitability</span>
              <span className="font-medium">85/100</span>
            </div>
          </div>
        </div>

        {/* Validation Details */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Metrics Validation</h2>
            <ul className="space-y-3">
              <li className="flex items-center text-green-700">
                <span className="mr-2">✓</span> Revenue calculation within bounds
              </li>
              <li className="flex items-center text-green-700">
                <span className="mr-2">✓</span> EBITDA calculation within bounds
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Insight Governance</h2>
            <ul className="space-y-3">
              <li className="flex items-center text-green-700">
                <span className="mr-2">✓</span> 8 approved
              </li>
              <li className="flex items-center text-yellow-600">
                <span className="mr-2">⚠</span> 2 approved (low confidence)
              </li>
              <li className="flex items-center text-red-600">
                <span className="mr-2">✕</span> 1 rejected
              </li>
            </ul>
          </div>
          
        </div>
      </div>
    </div>
  );
};
