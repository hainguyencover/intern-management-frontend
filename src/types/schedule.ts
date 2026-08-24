export interface ScheduleEvent {
  id: number;
  title: string;
  description?: string;
  eventDate: string;
  eventType: 'CHECK_IN' | 'MILESTONE' | 'REPORT_DEADLINE' | 'EVALUATION';
  status: 'UPCOMING' | 'COMPLETED' | 'MISSED';
}

export interface ScheduleMilestone {
  id: number;
  weekNumber: number;
  title: string;
  deliverables: string;
  dueDate: string;
  isCompleted: boolean;
}
