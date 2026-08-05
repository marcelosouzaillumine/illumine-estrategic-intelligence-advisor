export interface TimelineEvent {
  milestoneName: string;
  timestamp: string; // ISO-8601
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  metadata?: Record<string, any>;
}

export interface RevenueTimeline {
  customerId: string;
  tenantReference?: string;
  sagaId: string;
  
  milestones: TimelineEvent[];
  
  totalActivationTimeMs?: number; 
  isCompleted: boolean;
}
