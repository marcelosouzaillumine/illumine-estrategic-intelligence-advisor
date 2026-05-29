import React from 'react';

export interface HistoricalInferenceDisclosureProps {
  status: 'AVAILABLE' | 'NOT_AVAILABLE';
  message: string;
}

export const HistoricalInferenceDisclosure: React.FC<HistoricalInferenceDisclosureProps> = ({
  status,
  message
}) => {
  if (status === 'AVAILABLE') {
    return null; // Don't show disclosure if historical inference is valid
  }

  return (
    <div className="flex flex-col gap-2 p-3 bg-red-50 border-l-4 border-red-500 rounded text-sm text-red-800">
      <span className="font-semibold uppercase tracking-wide">NOT_AVAILABLE</span>
      <p>{message}</p>
    </div>
  );
};
