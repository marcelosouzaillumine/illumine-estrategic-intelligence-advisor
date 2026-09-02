import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MentorWorkspaceShell } from '../components/MentorWorkspaceShell';
import { MentorDashboard } from '../components/surfaces/MentorDashboard';
import { MenteesListSurface } from '../components/surfaces/MenteesListSurface';
import { MenteeDetailSurface } from '../components/surfaces/MenteeDetailSurface';
import { SessionDetailSurface } from '../components/surfaces/SessionDetailSurface';
import { SessionsListSurface } from '../components/surfaces/SessionsListSurface';
import { ScheduleSessionSurface } from '../components/surfaces/ScheduleSessionSurface';
import { ResourceLibrarySurface } from '../components/surfaces/ResourceLibrarySurface';
import { MentorOnboarding } from '../components/onboarding/MentorOnboarding';
import { MentorDiagnosticSurface } from '../components/surfaces/MentorDiagnosticSurface';

interface MentorWorkspacePageProps {
  mentorId: string;
  programId: string;
  tenantId: string;
  mentorName?: string;
  programName?: string;
}

export const MentorWorkspacePage: React.FC<MentorWorkspacePageProps> = ({
  mentorId, programId, tenantId, mentorName, programName,
}) => (
  <Routes>
    <Route
      path="onboarding"
      element={<MentorOnboarding userId={mentorId} tenantId={tenantId} programId={programId} />}
    />

    <Route element={<MentorWorkspaceShell mentorName={mentorName} programName={programName} />}>
      <Route index element={<MentorDashboard mentorId={mentorId} programId={programId} tenantId={tenantId} />} />

      <Route path="mentees" element={<MenteesListSurface mentorId={mentorId} programId={programId} />} />
      <Route path="mentees/:menteeId" element={<MenteeDetailSurface programId={programId} />} />
      <Route
        path="mentees/:menteeId/diagnostico"
        element={<MentorDiagnosticSurface programId={programId} mentorId={mentorId} />}
      />
      <Route
        path="mentees/:menteeId/diagnostico/revisar"
        element={<MentorDiagnosticSurface programId={programId} mentorId={mentorId} />}
      />

      <Route path="sessions" element={<SessionsListSurface role="MENTOR" userId={mentorId} programId={programId} />} />
      <Route
        path="sessions/new"
        element={<ScheduleSessionSurface mentorId={mentorId} programId={programId} tenantId={tenantId} />}
      />
      <Route
        path="sessions/:sessionId"
        element={<SessionDetailSurface role="MENTOR" userId={mentorId} programId={programId} />}
      />

      <Route path="library" element={<ResourceLibrarySurface role="MENTOR" />} />

      <Route path="*" element={<Navigate to="/mentor/workspace" replace />} />
    </Route>
  </Routes>
);
