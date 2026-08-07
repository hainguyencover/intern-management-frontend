export class UploadValidator {
  private static MAGIC_NUMBERS: Record<string, string> = {
    '89504e47': 'image/png',
    '47494638': 'image/gif',
    '25504446': 'application/pdf',
    '504b0304': 'application/zip',
    'ffd8ffe0': 'image/jpeg',
    'ffd8ffe1': 'image/jpeg',
    'ffd8ffe2': 'image/jpeg',
    'ffd8ffe3': 'image/jpeg',
    'ffd8ffe8': 'image/jpeg'
  };

  static async validateMagicNumber(file: File): Promise<boolean> {
    // Read first 4 bytes of file
    const slice = file.slice(0, 4);
    const buffer = await slice.arrayBuffer();
    const arr = new Uint8Array(buffer);
    
    let header = '';
    for (let i = 0; i < arr.length; i++) {
      header += arr[i].toString(16).padStart(2, '0');
    }

    const detectedType = this.MAGIC_NUMBERS[header.toLowerCase()];
    if (!detectedType) {
      // If we don't know the signature, let normal MIME check pass or allow basic text files
      return true;
    }

    // Verify if it matches file's declared type
    return file.type.includes(detectedType) || detectedType.includes(file.type);
  }
}
