import { z } from 'zod';

export const documentUploadSchema = z.object({
  fileType: z.enum(['CV', 'IDENTITY_CARD', 'CERTIFICATE', 'CONTRACT', 'OTHER'], {
    required_error: 'Vui lòng chọn loại tài liệu'
  }),
  notes: z.string().optional()
});
