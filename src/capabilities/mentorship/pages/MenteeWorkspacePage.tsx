import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MenteeWorkspaceShell } from '../components/MenteeWorkspaceShell';
import { MenteeDashboard } from '../components/surfaces/MenteeDashboard';
import { MyJourneySurface } from '../components/surfaces/MyJourneySurface';
import { OKRCreateSurface } from '../components/surfaces/OKRCreateSurface';
import { SessionDetailSurface } from '../components/surfaces/SessionDetailSurface';
import { SessionsListSurface } from '../components/surfaces/SessionsListSurface';
import { PulseCheckInSurface } from '../components/surfaces/PulseCheckInSurface';
import { ResourceLibrarySurface } from '../components/surfaces/ResourceLibrarySurface';
import { MenteeOnboarding } from '../components/onboarding/MenteeOnboarding';
import { DiagnosticFormSurface } from '../components/surfaces/DiagnosticFormSurface';
import { DiagnosticReportSurface } from '../components/surfaces/DiagnosticReportSurface';

interface MenteeWorkspacePageProps {
  menteeId: string;
  programId: string;
  tenantId: string;
  menteeName?: string;
  mentorName?: string;
  programName?: string;
}

export const MenteeWorkspacePage: React.FC<MenteeWorkspacePageProps> = ({
  menteeId, programId, tenantId, menteeName, mentorName, programName,
}) => (
  <Routes>
    <Route
      path="onboarding"
      element={<MenteeOnboarding userId={menteeId} tenantId={tenantId} programId={programId} />}
    />

    <Route element={<MenteeWorkspaceShell menteeName={menteeName} programName={programName} />}>
      <Route index element={<MenteeDashboard menteeId={menteeId} programId={programId} mentorName={mentorName} />} />

      <Route
        path="diagnostico"
        element={<DiagnosticFormSurface menteeId={menteeId} programId={programId} tenantId={tenantId} />}
      />
      <Route
        path="diagnostico/relatorio"
        element={<DiagnosticReportSurface menteeId={menteeId} programId={programId} role="MENTEE" />}
      />

      <Route path="journey" element={<MyJourneySurface menteeId={menteeId} programId={programId} tenantId={tenantId} />} />
      <Route
        path="journey/new-okr"
        element={<OKRCreateSurface menteeId={menteeId} programId={programId} tenantId={tenantId} />}
      />

      <Route path="sessions" element={<SessionsListSurface role="MENTEE" userId={menteeId} programId={programId} />} />
      <Route
        path="sessions/:sessionId"
        element={<SessionDetailSurface role="MENTEE" userId={menteeId} programId={programId} />}
      />

      <Route
        path="pulse"
        element={<PulseCheckInSurface menteeId={menteeId} programId={programId} tenantId={tenantId} type="WEEKLY" />}
      />

      <Route path="resources" element={<ResourceLibrarySurface role="MENTEE" />} />

      <Route path="*" element={<Navigate to="/mentee/workspace" replace />} />
    </Route>
  </Routes>
);
