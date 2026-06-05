import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { ConfidenceBreakdown } from '../../../services/FiduciaryRuntimeAdapter';
import { Activity, Database, Clock, Zap, Link } from 'lucide-react';

interface Props {
  confidence: ConfidenceBreakdown;
}

export const ConstitutionalConfidencePanel: React.FC<Props> = ({ confidence }) => {
  const { t } = useLanguage();

  const getOverallColor = (level: string) => {
    switch (level) {
      case 'HIGH_CONFIDENCE': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'MEDIUM_CONFIDENCE': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'LOW_CONFIDENCE': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'FAIL_CLOSED': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-400 bg-gray-800 border-gray-700';
    }
  };

  const MetricItem = ({ icon: Icon, label, value, stateClass = "text-white" }: any) => (
    <div className="flex items-center justify-between p-3 bg-black/40 rounded border border-gray-800">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <span className={`text-sm font-medium ${stateClass}`}>{value}</span>
    </div>
  );

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 h-full">
      <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-emerald-400" />
        {t('cgd.panels.confidence')}
      </h3>
      
      <div className={`p-4 rounded-lg border mb-5 flex items-center justify-center ${getOverallColor(confidence.overallConfidence)}`}>
        <span className="text-lg font-semibold tracking-wide uppercase">
          {t(`cgd.confidence.${confidence.overallConfidence}`)}
        </span>
      </div>

      <div className="space-y-2">
        <MetricItem 
          icon={Database} 
          label={t('cgd.confidence.completeness')} 
          value={`${confidence.completenessScore}%`} 
          stateClass={confidence.completenessScore >= 90 ? "text-green-400" : "text-yellow-400"}
        />
        <MetricItem 
          icon={Clock} 
          label={t('cgd.confidence.historicalDepth')} 
          value={`${confidence.historicalDepthMonths} M`} 
        />
        <MetricItem 
          icon={Zap} 
          label={t('cgd.confidence.consistency')} 
          value={confidence.runtimeConsistency} 
          stateClass={confidence.runtimeConsistency === 'CONSISTENT' ? "text-green-400" : "text-red-400"}
        />
        <MetricItem 
          icon={Link} 
          label={t('cgd.confidence.lineage')} 
          value={confidence.lineageContinuity} 
          stateClass={confidence.lineageContinuity === 'UNBROKEN' ? "text-green-400" : "text-red-400"}
        />
      </div>
    </div>
  );
};
