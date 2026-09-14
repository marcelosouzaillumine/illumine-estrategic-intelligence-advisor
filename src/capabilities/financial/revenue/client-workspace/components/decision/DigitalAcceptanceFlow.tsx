import React, { useState } from 'react';

export const DigitalAcceptanceFlow: React.FC<{ onCancel: () => void, onSuccess: () => void }> = ({ onCancel, onSuccess }) => {
  const [isSigning, setIsSigning] = useState(false);

  const handleSign = () => {
    setIsSigning(true);
    // Simulate cryptographic delay
    setTimeout(() => {
      onSuccess();
    }, 2000);
  };

  return (
    <div className="text-center max-w-lg mx-auto py-8">
      <h3 className="text-2xl font-bold text-white mb-4">Digital Acceptance</h3>
      <p className="text-slate-400 mb-8">
        Ao confirmar, sua identidade será validada e um certificado criptográfico (Acceptance Certificate) será gerado para registrar o acordo estratégico.
      </p>

      {isSigning ? (
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="text-green-400 font-semibold">Generating Cryptographic Certificate...</span>
        </div>
      ) : (
        <div className="flex gap-4 justify-center">
          <button onClick={onCancel} className="px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-medium transition-colors">
            Back
          </button>
          <button onClick={handleSign} className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500 font-bold shadow-lg shadow-green-900/20 transition-all">
            Confirm & Sign
          </button>
        </div>
      )}
    </div>
  );
};
