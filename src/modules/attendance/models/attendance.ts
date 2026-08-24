export type AttendanceStatus =
  | 'PRESENT'
  | 'LATE'
  | 'EARLY_LEAVE'
  | 'LATE_AND_EARLY_LEAVE'
  | 'ABSENT'
  | 'ON_LEAVE'
  | 'HOLIDAY'
  | 'INCOMPLETE'
  | 'PENDING_CORRECTION';

export type CorrectionStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface AttendanceDetail {
  id: number;
  internId: number;
  internName: string;
  studentCode: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  scheduledStartAt?: string;
  scheduledEndAt?: string;
  totalMinutes?: number;
  workedMinutes?: number;
  lateMinutes?: number;
  earlyLeaveMinutes?: number;
  checkInMethod?: string;
  checkOutMethod?: string;
  status: AttendanceStatus;
  note?: string;
  createdAt?: string;
}

export interface AttendanceSummary {
  totalInterns: number;
  totalWorkingDays: number;
  presentDays: number;
  lateDays: number;
  earlyLeaveDays: number;
  absentDays: number;
  leaveDays: number;
  attendanceRate: number;
}

export interface CorrectionRequestPayload {
  attendanceId: number;
  requestedCheckIn?: string;
  requestedCheckOut?: string;
  reason: string;
}

export interface CorrectionItem {
  id: number;
  attendanceId: number;
  attendanceDate: string;
  internId: number;
  internName: string;
  studentCode: string;
  currentCheckIn?: string;
  currentCheckOut?: string;
  requestedCheckIn?: string;
  requestedCheckOut?: string;
  reason: string;
  status: CorrectionStatus;
  reviewedByName?: string;
  reviewedAt?: string;
  reviewComment?: string;
  createdAt: string;
}

export interface LeaveRequestPayload {
  leaveTypeId?: number;
  startDate: string;
  endDate: string;
  totalDays?: number;
  reason: string;
  attachmentUrl?: string;
}

export interface LeaveDetail {
  id: number;
  internId: number;
  internName: string;
  studentCode: string;
  leaveTypeId?: number;
  leaveTypeCode?: string;
  leaveTypeName?: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  attachmentUrl?: string;
  status: LeaveStatus;
  approvedByName?: string;
  reviewedAt?: string;
  rejectedReason?: string;
  createdAt: string;
}
