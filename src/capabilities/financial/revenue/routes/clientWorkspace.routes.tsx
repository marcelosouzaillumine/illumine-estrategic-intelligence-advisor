import React, { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { ClientWorkspaceAuthProvider, useClientWorkspaceSession } from '../../../../features/revenue/client-workspace/auth/ClientWorkspaceAuthProvider';

const ClientWorkspaceLayout = lazy(() => import('../client-workspace/components/layout/ClientWorkspaceLayout').then(m => ({ default: m.ClientWorkspaceLayout })));

// Temporary OTP Guard for the roundtrip
const ClientOTPGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, verifyOTP } = useClientWorkspaceSession();
  
  if (!session) {
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-bold mb-4">Secure Access Required</h2>
        <button 
          onClick={() => verifyOTP('token', '123456')}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded"
        >
          Simulate OTP Verification
        </button>
      </div>
    );
  }
  return <>{children}</>;
};

export const ClientWorkspaceRoutes = () => {
  return [
    <Route 
      key="client-workspace"
      path="/revenue/proposal/access/:accessToken" 
      element={
        <ClientWorkspaceAuthProvider>
          <ClientOTPGuard>
            <Suspense fallback={<div className="h-screen bg-slate-900 flex items-center justify-center text-white">Loading Secure Workspace...</div>}>
              <ClientWorkspaceLayout />
            </Suspense>
          </ClientOTPGuard>
        </ClientWorkspaceAuthProvider>
      } 
    />
  ];
};
