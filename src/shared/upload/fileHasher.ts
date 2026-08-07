export class FileHasher {
  static async calculateSHA256(file: File): Promise<string> {
    const chunkSize = 2 * 1024 * 1024; // 2MB chunks
    const totalSize = file.size;
    const totalChunks = Math.ceil(totalSize / chunkSize);
    const hashes: string[] = [];

    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(totalSize, start + chunkSize);
      const chunk = file.slice(start, end);
      
      const buffer = await chunk.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const chunkHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      hashes.push(chunkHash);
    }

    // Hash the combined chunk hashes
    const encoder = new TextEncoder();
    const combinedBuffer = encoder.encode(hashes.join(''));
    const finalHashBuffer = await crypto.subtle.digest('SHA-256', combinedBuffer);
    const finalHashArray = Array.from(new Uint8Array(finalHashBuffer));
    return finalHashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
}
