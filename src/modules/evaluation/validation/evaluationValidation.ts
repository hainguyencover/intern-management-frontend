import { z } from 'zod';

export const evaluationSchema = z.object({
  internId: z.string().nonempty('Vui lòng chọn Thực tập sinh'),
  period: z.string().nonempty('Kỳ đánh giá là bắt buộc'),
  feedback: z.string().optional()
});
