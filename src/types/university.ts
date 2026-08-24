export interface TaskProgressInfo {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  completionRate: number;
}

export interface AttendanceInfo {
  workingDays: number;
  presentDays: number;
  leaveDays: number;
  attendanceRate: number;
}

export interface EvaluationInfo {
  overallScore?: number;
  status: string;
}

export interface UniversityStudent {
  id: number;
  studentCode: string;
  fullName: string;
  major: string;
  status: string;
  mentorName?: string;
  programName?: string;
  progress: TaskProgressInfo;
  attendance: AttendanceInfo;
  evaluation?: EvaluationInfo;
}

export interface UniversityDashboardData {
  totalStudents: number;
  interningStudents: number;
  completedStudents: number;
  terminatedStudents: number;
  completionRate: number;
  attendanceRate: number;
  atRiskStudents: number;
  recentAtRiskStudents: UniversityStudent[];
}

export interface UniversityStudentQuery {
  keyword?: string;
  status?: string;
  major?: string;
  progressMin?: number;
  progressMax?: number;
  page?: number;
  size?: number;
}
