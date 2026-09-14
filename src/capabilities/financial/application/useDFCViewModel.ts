import { useState, useMemo } from 'react';
import { useDFCAdapter } from '../../../adapters/ui/useDFCAdapter';
import { useInstitutionalAuth } from '../../../core/security/auth/InstitutionalAuthProvider';
import { FiduciaryRuntimeAdapter } from '../../../services/FiduciaryRuntimeAdapter';

export function useDFCViewModel({ clientId, selectedYear }: any) {
  const { allHistoryData, loadingHistory, refetchHistory } = useDFCAdapter(clientId || '');
  const { session } = useInstitutionalAuth();

  const [filterYear, setFilterYear] = useState<number>(selectedYear || new Date().getFullYear());
  const [viewMode, setViewMode] = useState<'oficial' | 'fiduciario' | 'lucro'>('oficial');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toast, setToast] = useState<any>(null);

  const userRole = session?.role || 'BOARD_MEMBER';
  const profile = useMemo(() => FiduciaryRuntimeAdapter.getProfile(FiduciaryRuntimeAdapter.mapOfficialRoleToProfileId(userRole)), [userRole]);
  const [densityLevel, setDensityLevel] = useState(profile.defaultDensity);

  return {
    state: {
      filterYear,
      viewMode,
      showImportModal,
      showManualModal,
      showDeleteConfirm,
      toast,
      userRole,
      densityLevel,
      loadingHistory
    },
    computed: {
      allHistoryData,
      profile
    },
    actions: {
      setFilterYear,
      setViewMode,
      setShowImportModal,
      setShowManualModal,
      setShowDeleteConfirm,
      setToast,
      setDensityLevel,
      refetchHistory
    }
  };
}
