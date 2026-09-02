import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProgramAdminShell } from '../components/ProgramAdminShell';
import { ProgramAdminDashboard } from '../components/surfaces/ProgramAdminDashboard';
import { MatchingAdminPanel } from '../components/surfaces/MatchingAdminPanel';
import { ReportsSurface } from '../components/surfaces/ReportsSurface';
import { ParticipantsSurface } from '../components/surfaces/ParticipantsSurface';

interface ProgramAdminPageProps {
  programId: string;
  tenantId: string;
  programName?: string;
  adminName?: string;
}

export const ProgramAdminPage: React.FC<ProgramAdminPageProps> = ({
  programId, tenantId, programName, adminName,
}) => (
  <Routes>
    <Route element={<ProgramAdminShell adminName={adminName} programName={programName} />}>
      <Route
        index
        element={<ProgramAdminDashboard programId={programId} tenantId={tenantId} programName={programName} />}
      />
      <Route path="matching" element={<MatchingAdminPanel programId={programId} tenantId={tenantId} />} />
      <Route path="relatorios" element={<ReportsSurface programId={programId} tenantId={tenantId} />} />
      <Route path="participantes" element={<ParticipantsSurface programId={programId} />} />
      <Route path="*" element={<Navigate to="/admin/programa" replace />} />
    </Route>
  </Routes>
);
