import React from 'react';
import { ShieldAlert, FileText, CheckCircle, AlertTriangle, Lock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { InstitutionalEvidenceValidationOutput } from '../../services/FiduciaryRuntimeAdapter';

interface InstitutionalEvidenceControlCenterPageProps {
  evidenceReport?: InstitutionalEvidenceValidationOutput;
}

export function InstitutionalEvidenceControlCenterPage({ evidenceReport }: InstitutionalEvidenceControlCenterPageProps) {
  if (!evidenceReport) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-slate-900 border border-slate-800 rounded-lg">
        <Lock className="h-12 w-12 text-slate-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-300">Evidência Fiduciária Indisponível</h2>
        <p className="text-slate-400 mt-2 text-center max-w-md">
          A camada de ingestão de evidências não foi executada ou nenhum dado fiduciário foi submetido para validação.
        </p>
      </div>
    );
  }

  const {
    evidenceStatus,
    fiduciaryInterpretationBlocked,
    evidenceIntegrityStatus,
    reconciliationStatus,
    tenantIsolationStatus,
    unresolvedEvidenceIssues,
    evidenceNarrative,
    uploadAuditTrail,
    lineageHash,
    confidenceLevel
  } = evidenceReport;

  const getStatusColor = (status: string) => {
    if (status === 'VALIDATED' || status === 'FIDUCIARY_TRUSTED' || status === 'SECURE' || status === 'RECONCILED' || status === 'HIGH') return 'text-emerald-400';
    if (status === 'PARTIALLY_VALIDATED' || status === 'PARTIAL' || status === 'MODERATE') return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
          <FileText className="h-8 w-8 text-blue-500" />
          Centro de Evidência Fiduciária
        </h1>
        <p className="text-slate-400">
          Governança, validação estrutural e integridade da evidência institucional ingerida.
        </p>
      </div>

      {fiduciaryInterpretationBlocked && (
        <div className="bg-rose-950/40 border border-rose-900/50 p-6 rounded-lg flex items-start gap-4">
          <ShieldAlert className="h-8 w-8 text-rose-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-bold text-rose-400">Interpretação Fiduciária Bloqueada (Fail-Closed)</h3>
            <p className="text-rose-300/80 mt-2">
              Anomalias críticas detectadas na evidência documental impedem a inteligência fiduciária de operar em regime normal. 
              O sistema ativou proteção Fail-Closed e operará com visão severamente restrita.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Status da Evidência</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${getStatusColor(evidenceStatus)}`}>
              {evidenceStatus.replace(/_/g, ' ')}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Integridade Documental</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${getStatusColor(evidenceIntegrityStatus)}`}>
              {evidenceIntegrityStatus}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Reconciliação Contábil</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${getStatusColor(reconciliationStatus)}`}>
              {reconciliationStatus}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Confiança Fiduciária</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${getStatusColor(confidenceLevel)}`}>
              {confidenceLevel}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-200">Narrativa de Validação</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300">{evidenceNarrative}</p>
        </CardContent>
      </Card>

      {unresolvedEvidenceIssues.length > 0 && (
        <Card className="bg-rose-950/20 border-rose-900/30">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-rose-400 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Anomalias e Violações (Fail-Closed Triggers)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {unresolvedEvidenceIssues.map((issue, idx) => (
                <li key={idx} className="flex items-start gap-2 text-rose-300">
                  <span className="mt-1 text-rose-500">•</span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-200 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            Trilha de Auditoria (Lineage Hash: {lineageHash})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-950 p-4 rounded-lg font-mono text-sm text-slate-400 space-y-1">
            {uploadAuditTrail.map((log, idx) => (
              <div key={idx}>{log}</div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
