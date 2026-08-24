import { z } from 'zod';

export const programSchema = z.object({
  code: z.string().min(3, 'Mã chương trình phải có ít nhất 3 ký tự'),
  name: z.string().min(5, 'Tên chương trình phải có ít nhất 5 ký tự'),
  description: z.string().optional(),
  startDate: z.string().min(1, 'Vui lòng chọn ngày bắt đầu'),
  endDate: z.string().min(1, 'Vui lòng chọn ngày kết thúc'),
  maxCapacity: z.number().min(1, 'Sức chứa phải lớn hơn 0'),
  status: z.enum(['ACTIVE', 'CLOSED', 'DRAFT'])
});
