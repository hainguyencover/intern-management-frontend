import { z } from 'zod';

export const contractSchema = z.object({
  contractNumber: z.string().min(3, 'Số hợp đồng phải có ít nhất 3 ký tự'),
  internProfileId: z.number({ required_error: 'Vui lòng chọn thực tập sinh' }),
  startDate: z.string().min(1, 'Vui lòng chọn ngày bắt đầu'),
  endDate: z.string().min(1, 'Vui lòng chọn ngày kết thúc')
});
