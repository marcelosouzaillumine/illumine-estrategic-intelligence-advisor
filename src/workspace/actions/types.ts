export type ActionStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface ExecutiveAction {
  id: string;
  insightId: string;
  title: string;
  description: string;
  status: ActionStatus;
  ownerId: string; // User ID
  deadline: string; // ISO string
  createdAt: string;
  followUpNotes?: string[];
}
