import { defineStore } from 'pinia';
import type { UploadFileItem, UploadStatus } from './uploadTypes';

export const useUploadStore = defineStore('upload', {
  state: () => ({
    items: [] as UploadFileItem[]
  }),

  actions: {
    addFile(item: UploadFileItem): void {
      this.items.push(item);
    },

    updateStatus(id: string, status: UploadStatus, error?: string): void {
      const item = this.items.find((i) => i.id === id);
      if (item) {
        item.status = status;
        if (error) item.error = error;
      }
    },

    updateProgress(id: string, progress: number, uploadedChunkIndex?: number): void {
      const item = this.items.find((i) => i.id === id);
      if (item) {
        item.progress = Math.min(100, Math.max(0, progress));
        if (uploadedChunkIndex !== undefined && !item.uploadedChunks.includes(uploadedChunkIndex)) {
          item.uploadedChunks.push(uploadedChunkIndex);
        }
      }
    },

    removeItem(id: string): void {
      this.items = this.items.filter((i) => i.id !== id);
    }
  }
});
