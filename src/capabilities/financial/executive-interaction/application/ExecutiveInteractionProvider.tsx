import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ExecutiveInteractionState,
  ExecutiveEscalationLevel,
  ExecutiveConfidenceDisclosure,
  ExecutiveEvidenceVisibility,
  ExecutiveModalPriority,
  GovernanceDataDependency
} from '../../../../workspace/runtime/executive-interaction/types';

interface LoadingSemantics {
  phase: 'validating' | 'dependencies' | 'confidence' | 'lineage' | 'sync' | 'ready';
  message: string;
  progress: number;
  completedChecks: string[];
}

interface InstitutionalFlags {
  isFiduciarySafe: boolean;
  hasSovereigntyViolation: boolean;
  isDegraded: boolean;
  hasSupervision: boolean;
}

interface ModalState {
  isOpen: boolean;
  priority: ExecutiveModalPriority;
  title: string;
  content: React.ReactNode;
  lineageHash?: string;
  onConfirm?: () => Promise<void> | void;
}

interface ExecutiveInteractionContextType {
  interactionState: ExecutiveInteractionState;
  escalationLevel: ExecutiveEscalationLevel;
  confidenceDisclosure: ExecutiveConfidenceDisclosure;
  evidenceVisibility: ExecutiveEvidenceVisibility;
  modalPriority: ExecutiveModalPriority;
  loadingSemantics: LoadingSemantics;
  institutionalFlags: InstitutionalFlags;
  modalState: ModalState;
  dependencies: GovernanceDataDependency[];
  
  setInteractionState: (state: ExecutiveInteractionState) => void;
  setEscalationLevel: (level: ExecutiveEscalationLevel) => void;
  setConfidenceDisclosure: (disclosure: ExecutiveConfidenceDisclosure) => void;
  setEvidenceVisibility: (visibility: ExecutiveEvidenceVisibility) => void;
  setModalPriority: (priority: ExecutiveModalPriority) => void;
  setDependencies: (deps: GovernanceDataDependency[]) => void;
  
  openModal: (params: {
    title: string;
    content: React.ReactNode;
    priority: ExecutiveModalPriority;
    lineageHash?: string;
    onConfirm?: () => Promise<void> | void;
  }) => void;
  closeModal: () => void;
  
  triggerFiduciaryModal: (params: {
    title: string;
    content: React.ReactNode;
    lineageHash: string;
    onConfirm: () => Promise<void> | void;
  }) => void;
  
  setLoadingPhase: (phase: LoadingSemantics['phase'], message: string, progress: number, completed: string[]) => void;
}

const defaultConfidence: ExecutiveConfidenceDisclosure = {
  confidenceScore: 100,
  confidenceLabel: 'Alta',
  evidenceCoverage: 1.0,
  lineageIntegrity: true,
  missingDependencies: [],
  runtimeMode: 'production'
};

const defaultLoading: LoadingSemantics = {
  phase: 'ready',
  message: 'Pronto',
  progress: 100,
  completedChecks: ['validating', 'dependencies', 'confidence', 'lineage', 'sync']
};

const defaultFlags: InstitutionalFlags = {
  isFiduciarySafe: true,
  hasSovereigntyViolation: false,
  isDegraded: false,
  hasSupervision: false
};

const defaultModal: ModalState = {
  isOpen: false,
  priority: 'LOW',
  title: '',
  content: null
};

const ExecutiveInteractionContext = createContext<ExecutiveInteractionContextType>({
  interactionState: 'READY',
  escalationLevel: 'NORMAL',
  confidenceDisclosure: defaultConfidence,
  evidenceVisibility: 'SUMMARY',
  modalPriority: 'LOW',
  loadingSemantics: defaultLoading,
  institutionalFlags: defaultFlags,
  modalState: defaultModal,
  dependencies: [],
  setInteractionState: () => {},
  setEscalationLevel: () => {},
  setConfidenceDisclosure: () => {},
  setEvidenceVisibility: () => {},
  setModalPriority: () => {},
  setDependencies: () => {},
  openModal: () => {},
  closeModal: () => {},
  triggerFiduciaryModal: () => {},
  setLoadingPhase: () => {}
});

export const useExecutiveInteraction = () => useContext(ExecutiveInteractionContext);

export function ExecutiveInteractionProvider({ children }: { children: React.ReactNode }) {
  const [interactionState, setInteractionState] = useState<ExecutiveInteractionState>('READY');
  const [escalationLevel, setEscalationLevel] = useState<ExecutiveEscalationLevel>('NORMAL');
  const [confidenceDisclosure, setConfidenceDisclosure] = useState<ExecutiveConfidenceDisclosure>(defaultConfidence);
  const [evidenceVisibility, setEvidenceVisibility] = useState<ExecutiveEvidenceVisibility>('SUMMARY');
  const [modalPriority, setModalPriority] = useState<ExecutiveModalPriority>('LOW');
  const [dependencies, setDependencies] = useState<GovernanceDataDependency[]>([]);
  const [loadingSemantics, setLoadingSemantics] = useState<LoadingSemantics>(defaultLoading);
  const [modalState, setModalState] = useState<ModalState>(defaultModal);

  const [institutionalFlags, setInstitutionalFlags] = useState<InstitutionalFlags>(defaultFlags);

  useEffect(() => {
    // Dynamic derivation of flags from interactionState and confidence
    const hasSovereignty = interactionState === 'FAIL_CLOSED';
    const isDegraded = interactionState === 'DEGRADED' || confidenceDisclosure.runtimeMode === 'degraded';
    const hasSupervision = escalationLevel !== 'NORMAL';
    const isFiduciarySafe = !hasSovereignty && !isDegraded && confidenceDisclosure.lineageIntegrity;

    setInstitutionalFlags({
      isFiduciarySafe,
      hasSovereigntyViolation: hasSovereignty,
      isDegraded,
      hasSupervision
    });
  }, [interactionState, escalationLevel, confidenceDisclosure]);

  const openModal = (params: {
    title: string;
    content: React.ReactNode;
    priority: ExecutiveModalPriority;
    lineageHash?: string;
    onConfirm?: () => Promise<void> | void;
  }) => {
    setModalPriority(params.priority);
    setModalState({
      isOpen: true,
      priority: params.priority,
      title: params.title,
      content: params.content,
      lineageHash: params.lineageHash,
      onConfirm: params.onConfirm
    });
  };

  const closeModal = () => {
    setModalState(defaultModal);
  };

  const triggerFiduciaryModal = (params: {
    title: string;
    content: React.ReactNode;
    lineageHash: string;
    onConfirm: () => Promise<void> | void;
  }) => {
    openModal({
      title: params.title,
      content: params.content,
      priority: 'FIDUCIARY',
      lineageHash: params.lineageHash,
      onConfirm: params.onConfirm
    });
  };

  const setLoadingPhase = (
    phase: LoadingSemantics['phase'],
    message: string,
    progress: number,
    completed: string[]
  ) => {
    setLoadingSemantics({
      phase,
      message,
      progress,
      completedChecks: completed
    });
  };

  return (
    <ExecutiveInteractionContext.Provider value={{
      interactionState,
      escalationLevel,
      confidenceDisclosure,
      evidenceVisibility,
      modalPriority,
      loadingSemantics,
      institutionalFlags,
      modalState,
      dependencies,
      setInteractionState,
      setEscalationLevel,
      setConfidenceDisclosure,
      setEvidenceVisibility,
      setModalPriority,
      setDependencies,
      openModal,
      closeModal,
      triggerFiduciaryModal,
      setLoadingPhase
    }}>
      {children}
    </ExecutiveInteractionContext.Provider>
  );
}
