export type UploadStatus = 'waiting' | 'uploading' | 'paused' | 'completed' | 'failed';

export interface UploadPolicy {
  maxSizeBytes?: number;
  allowedMimeTypes?: string[];
  maxFiles?: number;
}

export interface ChunkConfig {
  chunkSizeBytes: number;
  concurrentChunks: number;
}

export interface UploadFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  progress: number;
  status: UploadStatus;
  speedBytesPerSec?: number;
  sha256Hash?: string;
  uploadedChunks: number[];
  totalChunks: number;
  error?: string;
}
