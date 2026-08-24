export type DocumentType = 'CV' | 'IDENTITY_CARD' | 'CERTIFICATE' | 'CONTRACT' | 'OTHER';

export interface InternDocument {
  id: number;
  internProfileId: number;
  fileName: string;
  fileType: DocumentType;
  fileSize: number;
  fileUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  uploadedAt: string;
  notes?: string;
}

export interface DocumentUploadRequest {
  file: File;
  fileType: DocumentType;
  notes?: string;
}
