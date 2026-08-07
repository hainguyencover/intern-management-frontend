import { useUploadStore } from './uploadStore';
import type { UploadFileItem, ChunkConfig } from './uploadTypes';

export class ChunkUploader {
  private config: ChunkConfig = {
    chunkSizeBytes: 2 * 1024 * 1024, // 2MB chunk size
    concurrentChunks: 2
  };

  async uploadFile(item: UploadFileItem): Promise<boolean> {
    const store = useUploadStore();
    store.updateStatus(item.id, 'uploading');

    const totalSize = item.file.size;
    const totalChunks = Math.ceil(totalSize / this.config.chunkSizeBytes);
    item.totalChunks = totalChunks;

    for (let i = 0; i < totalChunks; i++) {
      if (item.status === 'paused') {
        return false;
      }

      if (item.uploadedChunks.includes(i)) continue;

      const start = i * this.config.chunkSizeBytes;
      const end = Math.min(totalSize, start + this.config.chunkSizeBytes);
      const chunk = item.file.slice(start, end);

      // Simulate chunk upload delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const percent = Math.round(((i + 1) / totalChunks) * 100);
      store.updateProgress(item.id, percent, i);
    }

    store.updateStatus(item.id, 'completed');
    return true;
  }
}

export const chunkUploader = new ChunkUploader();
