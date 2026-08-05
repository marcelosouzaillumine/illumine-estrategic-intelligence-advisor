export interface TimelineReadModel {
  id: string;
  stage: string;
  date: string;
  status: 'completed' | 'current' | 'pending';
}
