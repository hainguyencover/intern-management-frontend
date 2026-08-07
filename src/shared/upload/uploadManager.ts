import { useUploadStore } from './uploadStore';
import { FileHasher } from './fileHasher';
import { chunkUploader } from './chunkUploader';
import { UploadValidator } from './uploadValidator';
import type { UploadFileItem, UploadPolicy } from './uploadTypes';

export class UploadManager {
  async addAndStartUpload(file: File, policy?: UploadPolicy): Promise<UploadFileItem | null> {
    const store = useUploadStore();

    // Policy Validations
    if (policy?.maxSizeBytes && file.size > policy.maxSizeBytes) {
      const maxMb = (policy.maxSizeBytes / (1024 * 1024)).toFixed(1);
      throw new Error(`Tập tin vượt quá dung lượng cho phép (${maxMb}MB)`);
    }

    if (policy?.allowedMimeTypes && policy.allowedMimeTypes.length > 0) {
      const isAllowed = policy.allowedMimeTypes.some((type) => file.type.includes(type) || file.name.endsWith(type));
      if (!isAllowed) {
        throw new Error(`Định dạng tập tin không hợp lệ`);
      }
    }

    // Verify byte signatures (Magic numbers) to prevent extension spoofing
    const isRealMime = await UploadValidator.validateMagicNumber(file);
    if (!isRealMime) {
      throw new Error(`Nội dung tập tin không khớp với định dạng đuôi mở rộng!`);
    }

    const sha256 = await FileHasher.calculateSHA256(file);
    const id = 'up-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);

    const item: UploadFileItem = {
      id,
      file,
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'waiting',
      sha256Hash: sha256,
      uploadedChunks: [],
      totalChunks: Math.ceil(file.size / (2 * 1024 * 1024))
    };

    store.addFile(item);

    // Trigger async chunk upload
    chunkUploader.uploadFile(item);

    return item;
  }

  pauseUpload(id: string): void {
    const store = useUploadStore();
    store.updateStatus(id, 'paused');
  }

  resumeUpload(id: string): void {
    const store = useUploadStore();
    const item = store.items.find((i) => i.id === id);
    if (item) {
      store.updateStatus(id, 'uploading');
      chunkUploader.uploadFile(item);
    }
  }

  cancelUpload(id: string): void {
    const store = useUploadStore();
    store.removeItem(id);
  }
}

export const uploadManager = new UploadManager();
