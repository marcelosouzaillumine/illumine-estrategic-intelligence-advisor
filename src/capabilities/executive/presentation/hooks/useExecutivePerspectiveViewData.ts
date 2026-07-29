import { useMemo } from 'react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { ExecutivePerspectivePresenter } from '../presenters/ExecutivePerspectivePresenter';
import { ExecutivePerspectiveViewData } from '../view-models/ExecutivePerspectiveViewData';
import { ExecutiveAdvisoryReport } from '../../../../lib/executive-advisory-engine';
import { ExecutiveIntelligenceReport } from '../../../../services/FiduciaryRuntimeAdapter';

export interface ExecutivePerspectiveSource {
  advisoryReport?: ExecutiveAdvisoryReport | null;
  intelligenceReport?: ExecutiveIntelligenceReport | null;
}

export interface UseExecutivePerspectiveViewDataResult {
  data: ExecutivePerspectiveViewData | null;
  hasSource: boolean;
}

export function useExecutivePerspectiveViewData(
  source: ExecutivePerspectiveSource,
): UseExecutivePerspectiveViewDataResult {
  const { t } = useLanguage();
  
  const data = useMemo(() => {
    if (!source.advisoryReport && !source.intelligenceReport) {
      return null;
    }
    return ExecutivePerspectivePresenter.transform({
      advisoryReport: source.advisoryReport,
      intelligenceReport: source.intelligenceReport,
      translate: t,
    });
  }, [source.advisoryReport, source.intelligenceReport, t]);

  return {
    data,
    hasSource: Boolean(source.advisoryReport || source.intelligenceReport),
  };
}
