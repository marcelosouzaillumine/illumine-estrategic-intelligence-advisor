import React from 'react';
import { useExecutiveInteraction } from '../../../../context/executive-interaction/ExecutiveInteractionProvider';
import { FiduciaryModalShell } from './FiduciaryModalShell';

export const ExecutiveModalOrchestrator: React.FC = () => {
  const { modalState, closeModal } = useExecutiveInteraction();

  return (
    <FiduciaryModalShell
      isOpen={modalState.isOpen}
      title={modalState.title}
      priority={modalState.priority}
      lineageHash={modalState.lineageHash}
      onClose={closeModal}
      onConfirm={modalState.onConfirm}
    >
      {modalState.content}
    </FiduciaryModalShell>
  );
};
