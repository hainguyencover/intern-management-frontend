import { z } from 'zod';

export const departmentSchema = z.object({
  code: z
    .string()
    .min(2, 'Mã phòng ban phải chứa ít nhất 2 ký tự')
    .max(10, 'Mã phòng ban tối đa 10 ký tự')
    .nonempty('Mã phòng ban là bắt buộc'),
  name: z
    .string()
    .min(3, 'Tên phòng ban phải chứa ít nhất 3 ký tự')
    .nonempty('Tên phòng ban là bắt buộc'),
  description: z.string().optional()
});
