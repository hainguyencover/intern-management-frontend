export enum ApplicationStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  REVIEWING = 'REVIEWING',
  SCREENING = 'SCREENING',
  INTERVIEWING = 'INTERVIEWING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CONTRACT_SENT = 'CONTRACT_SENT',
  CONTRACT_SIGNED = 'CONTRACT_SIGNED',
  INTERNING = 'INTERNING',
  COMPLETED = 'COMPLETED'
}

export interface Program {
  id: number;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status: string;
}

export interface ApplicationSubmitPayload {
  programId: number;
  position: string;
  note?: string;
}

export interface ApplicationResponse {
  id: number;
  internId: number;
  internName: string;
  internEmail: string;
  programId?: number;
  programName?: string;
  position: string;
  appliedAt?: string;
  status: ApplicationStatus | string;
  note?: string;
  createdAt: string;
  updatedAt?: string;
}
