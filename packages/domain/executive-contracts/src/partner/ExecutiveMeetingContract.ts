export interface ExecutiveMeetingContract {
  readonly meetingId: string;
  readonly companyId: string;
  readonly title: string;
  readonly scheduledAt: string;
  readonly participantAdvisorIds: readonly string[];
  readonly agendaTopics: readonly string[];
  readonly minutesSummary: string;
  readonly decisionsMade: readonly string[];
}
