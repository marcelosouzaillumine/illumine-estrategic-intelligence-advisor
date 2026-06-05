import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { ConstitutionalAxiomStatus } from '../../../services/FiduciaryRuntimeAdapter';
import { ShieldCheck, AlertTriangle, XCircle, AlertOctagon } from 'lucide-react';

interface Props {
  axioms: ConstitutionalAxiomStatus[];
}

export const ConstitutionalAxiomPanel: React.FC<Props> = ({ axioms }) => {
  const { t } = useLanguage();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLIANT': return <ShieldCheck className="w-5 h-5 text-green-500" />;
      case 'ATTENTION': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'RESTRICTED': return <XCircle className="w-5 h-5 text-orange-500" />;
      case 'VIOLATED': return <AlertOctagon className="w-5 h-5 text-red-500" />;
      default: return <ShieldCheck className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'COMPLIANT': return 'bg-green-500/10 border-green-500/20';
      case 'ATTENTION': return 'bg-yellow-500/10 border-yellow-500/20';
      case 'RESTRICTED': return 'bg-orange-500/10 border-orange-500/20';
      case 'VIOLATED': return 'bg-red-500/10 border-red-500/20';
      default: return 'bg-gray-800 border-gray-700';
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 h-full">
      <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-blue-400" />
        {t('cgd.panels.axioms')}
      </h3>
      <div className="space-y-3">
        {axioms.map((ax, idx) => (
          <div key={idx} className={`p-4 rounded-md border flex items-start gap-4 transition-colors ${getStatusBg(ax.status)}`}>
            <div className="mt-0.5">
              {getStatusIcon(ax.status)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-white">{ax.axiom}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-black/30 font-semibold tracking-wider">
                  {t(`cgd.status.${ax.status}`)}
                </span>
              </div>
              <p className="text-sm text-gray-400">{ax.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
