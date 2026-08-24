export type ContractStatus = 'PENDING_CONFIRMATION' | 'CONFIRMED' | 'CANCELLED';

export interface Contract {
  id: number;
  contractNumber: string;
  internProfileId: number;
  internName: string;
  startDate: string;
  endDate: string;
  status: ContractStatus;
  pdfUrl: string;
  confirmedAt?: string;
  createdAt: string;
}

export interface ContractUploadRequest {
  internProfileId: number;
  contractNumber: string;
  startDate: string;
  endDate: string;
  file: File;
}
