export type NotificationType =
  | 'INTERNSHIP_COMPLETED'
  | 'INTERNSHIP_TERMINATED'
  | 'APPLICATION'
  | 'TASK'
  | 'WEEKLY_REPORT'
  | 'SYSTEM'
  | 'OTHER';

export type NotificationStatus = 'UNREAD' | 'READ';

export interface UniversityNotification {
  id: number;
  universityId: number;
  type: NotificationType;
  title: string;
  message: string;
  referenceType?: string;
  referenceId?: number;
  status: NotificationStatus;
  readAt?: string;
  createdAt: string;
}

export interface UniversityNotificationUnreadCount {
  count: number;
}

export interface UniversityNotificationPreference {
  id: number;
  universityId: number;
  internshipCompletedEnabled: boolean;
  internshipTerminatedEnabled: boolean;
  emailEnabled: boolean;
  inAppEnabled: boolean;
}

export interface UniversityNotificationPreferenceUpdate {
  internshipCompletedEnabled?: boolean;
  internshipTerminatedEnabled?: boolean;
  emailEnabled?: boolean;
  inAppEnabled?: boolean;
}

export interface PageResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
